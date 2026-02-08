import { NextRequest, NextResponse } from 'next/server';
import { trackAnalyticsEvent } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, vehicleSlug, sessionId, metadata } = body;

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Fire-and-forget tracking
    trackAnalyticsEvent({
      eventType,
      vehicleSlug,
      sessionId,
      metadata: {
        ...metadata,
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      },
    });

    // Return immediately
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API /analytics] Error:', error);
    // Even on error, return success since this is fire-and-forget
    return NextResponse.json({ success: true });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Analytics API - Use POST to track events',
    version: '1.0',
    supportedEvents: [
      'page_view',
      'vehicle_view',
      'compare',
      'chat_start',
      'chat_message',
      'lead_created',
      'test_drive_requested',
      'financing_calculated',
    ],
  });
}
