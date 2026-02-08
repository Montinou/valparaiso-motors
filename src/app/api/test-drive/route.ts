import { NextRequest, NextResponse } from 'next/server';
import { createLead, createTestDrive } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    const { name, phone, email, vehicleSlug, preferredDate, preferredTime, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      );
    }

    if (!vehicleSlug) {
      return NextResponse.json(
        { success: false, error: 'El vehículo es requerido' },
        { status: 400 }
      );
    }

    if (!preferredDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Fecha y hora preferidas son requeridas' },
        { status: 400 }
      );
    }

    // Crear lead primero
    const { data: lead, error: leadError } = await createLead({
      name,
      phone,
      email,
      source: 'test-drive',
      vehicleSlug,
      message: `Test Drive solicitado para ${preferredDate} a las ${preferredTime}`,
    });

    if (leadError || !lead) {
      console.error('[API /test-drive] Error creating lead:', leadError);
      return NextResponse.json(
        { success: false, error: 'Error al procesar la solicitud' },
        { status: 500 }
      );
    }

    // Crear test drive
    const { data: testDrive, error: testDriveError } = await createTestDrive({
      leadId: lead.id,
      vehicleSlug,
      preferredDate,
      preferredTime,
      notes,
    });

    if (testDriveError) {
      console.error('[API /test-drive] Error creating test drive:', testDriveError);
      return NextResponse.json(
        { success: false, error: 'Error al agendar el test drive' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testDriveId: testDrive?.id,
      leadId: lead.id,
      message: '¡Test drive agendado! Te contactaremos pronto para confirmar.',
    });
  } catch (error) {
    console.error('[API /test-drive] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Test Drive API - Use POST to schedule a test drive',
    version: '1.0',
  });
}
