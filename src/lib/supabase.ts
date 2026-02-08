import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client (only if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock storage for demo mode (localStorage fallback)
class MockStorage {
  private prefix = 'valparaiso_';

  async insert(table: string, data: any) {
    if (typeof window === 'undefined') {
      console.log('[MockStorage] Server-side insert:', table, data);
      return { data: { id: this.generateId(), ...data }, error: null };
    }

    const key = `${this.prefix}${table}`;
    const existing = this.getAll(table);
    const newRecord = {
      id: this.generateId(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    existing.push(newRecord);
    localStorage.setItem(key, JSON.stringify(existing));
    
    console.log(`[MockStorage] Inserted into ${table}:`, newRecord);
    return { data: newRecord, error: null };
  }

  async select(table: string, filters?: any) {
    if (typeof window === 'undefined') {
      console.log('[MockStorage] Server-side select:', table);
      return { data: [], error: null };
    }

    const records = this.getAll(table);
    console.log(`[MockStorage] Select from ${table}:`, records.length, 'records');
    return { data: records, error: null };
  }

  private getAll(table: string): any[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${this.prefix}${table}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  clearAll() {
    if (typeof window === 'undefined') return;
    
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
    console.log('[MockStorage] Cleared all data');
  }
}

export const mockStorage = new MockStorage();

// Helper functions for database operations
export async function createLead(data: {
  name?: string;
  phone?: string;
  email?: string;
  source: string;
  vehicleSlug?: string;
  message?: string;
  metadata?: any;
}) {
  if (supabase) {
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        phone: data.phone,
        email: data.email,
        source: data.source,
        vehicle_slug: data.vehicleSlug,
        message: data.message,
        metadata: data.metadata,
        status: 'new',
      })
      .select()
      .single();

    return { data: lead, error };
  } else {
    // Mock mode
    return await mockStorage.insert('leads', {
      name: data.name,
      phone: data.phone,
      email: data.email,
      source: data.source,
      vehicle_slug: data.vehicleSlug,
      message: data.message,
      metadata: data.metadata,
      status: 'new',
    });
  }
}

export async function createChatMessage(data: {
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  leadId?: string;
  metadata?: any;
}) {
  if (supabase) {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: data.sessionId,
        role: data.role,
        content: data.content,
        lead_id: data.leadId,
        metadata: data.metadata,
      })
      .select()
      .single();

    return { data: message, error };
  } else {
    // Mock mode
    return await mockStorage.insert('chat_messages', {
      session_id: data.sessionId,
      role: data.role,
      content: data.content,
      lead_id: data.leadId,
      metadata: data.metadata,
    });
  }
}

export async function createTestDrive(data: {
  leadId?: string;
  vehicleSlug: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}) {
  if (supabase) {
    const { data: testDrive, error } = await supabase
      .from('test_drives')
      .insert({
        lead_id: data.leadId,
        vehicle_slug: data.vehicleSlug,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        notes: data.notes,
        status: 'pending',
      })
      .select()
      .single();

    return { data: testDrive, error };
  } else {
    // Mock mode
    return await mockStorage.insert('test_drives', {
      lead_id: data.leadId,
      vehicle_slug: data.vehicleSlug,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      notes: data.notes,
      status: 'pending',
    });
  }
}

export async function trackAnalyticsEvent(data: {
  eventType: string;
  vehicleSlug?: string;
  sessionId?: string;
  metadata?: any;
}) {
  if (supabase) {
    // Fire and forget
    supabase
      .from('analytics_events')
      .insert({
        event_type: data.eventType,
        vehicle_slug: data.vehicleSlug,
        session_id: data.sessionId,
        metadata: data.metadata,
      })
      .then((result) => {
        if (result.error) {
          console.error('[Analytics] Error tracking event:', result.error);
        } else {
          console.log('[Analytics] Event tracked:', data.eventType);
        }
      });
  } else {
    // Mock mode - just log
    console.log('[Analytics] Event (mock):', data.eventType, data);
  }
}

export async function getChatHistory(sessionId: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    return { data: data || [], error };
  } else {
    // Mock mode
    const { data } = await mockStorage.select('chat_messages');
    const filtered = data.filter((msg: any) => msg.session_id === sessionId);
    return { data: filtered, error: null };
  }
}
