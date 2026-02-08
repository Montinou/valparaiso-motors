import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar campos requeridos
    const { name, phone, email, source, vehicleSlug, message } = body;

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'El campo "source" es requerido' },
        { status: 400 }
      );
    }

    // Validar que al menos tenga nombre o teléfono
    if (!name && !phone) {
      return NextResponse.json(
        { success: false, error: 'Se requiere al menos nombre o teléfono' },
        { status: 400 }
      );
    }

    // Crear lead
    const { data, error } = await createLead({
      name,
      phone,
      email,
      source,
      vehicleSlug,
      message,
      metadata: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      },
    });

    if (error) {
      console.error('[API /leads] Error creating lead:', error);
      return NextResponse.json(
        { success: false, error: 'Error al crear el lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: data?.id,
      message: '¡Gracias! Un asesor se contactará pronto.',
    });
  } catch (error) {
    console.error('[API /leads] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Leads API - Use POST to create a lead',
    version: '1.0',
  });
}
