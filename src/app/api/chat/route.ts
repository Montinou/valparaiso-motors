import { NextRequest, NextResponse } from 'next/server';
import { createChatMessage } from '@/lib/supabase';

// Vehicle data for AI context
const VEHICLE_DATA = [
  {
    "brand": "Haval",
    "model": "Jolion",
    "slug": "haval-jolion",
    "tagline": "SUV urbano inteligente con tecnología de punta y máximo confort",
    "category": "SUV",
    "year": 2025,
    "specs": {
      "engine": "Turbo 4 cilindros 16V",
      "power": "141 HP",
      "torque": "210 Nm",
      "transmission": "Automática DCT 7 vel.",
      "traction": "2WD"
    },
    "highlightFeatures": [
      "Pantalla táctil 12.3\" con Apple CarPlay + Android Auto",
      "Techo panorámico eléctrico",
      "Cámara 360° + Estacionamiento asistido",
      "Crucero adaptativo ACC + 6 airbags",
      "W-HUD (Head-Up Display)"
    ]
  },
  {
    "brand": "Haval",
    "model": "Jolion PRO HEV",
    "slug": "haval-jolion-pro-hev",
    "tagline": "SUV híbrido eficiente con 190 HP combinados y 27 km/L en ciudad",
    "category": "SUV Híbrido",
    "year": 2025,
    "specs": {
      "power": "190 HP combinados",
      "torque": "375 Nm combinados",
      "transmission": "Transmisión híbrida DHT",
      "fuelConsumption": "27 km/L en ciudad, 16.6 km/L en carretera"
    },
    "highlightFeatures": [
      "Rendimiento 27 km/L en ciudad",
      "190 HP y 375 Nm de potencia combinada",
      "Pantalla 12.3\" Apple CarPlay + Android Auto",
      "Cámara 360° + Estacionamiento asistido"
    ]
  },
  {
    "brand": "ORA",
    "model": "ORA 03",
    "slug": "ora-03",
    "tagline": "Hatchback eléctrico deportivo con 310 km de autonomía",
    "category": "Eléctrico",
    "year": 2025,
    "specs": {
      "power": "170 HP",
      "torque": "250 Nm",
      "autonomy": "310 km WLTP",
      "charging": "20% a 80% en 36 minutos (carga rápida)"
    },
    "highlightFeatures": [
      "310 km de autonomía WLTP",
      "Pantallas duales 10.25\" Apple CarPlay + Android Auto wireless",
      "Cámara 360° + Estacionamiento asistido",
      "7 Airbags - El eléctrico más seguro del segmento"
    ]
  },
  {
    "brand": "Haval",
    "model": "H6 GT",
    "slug": "haval-h6-gt",
    "tagline": "SUV deportivo premium 4WD con 201 HP y tecnología superior",
    "category": "SUV Premium",
    "year": 2025,
    "specs": {
      "engine": "2.0L Turbo",
      "power": "201 HP",
      "torque": "320 Nm",
      "transmission": "Automática DCT 7 vel.",
      "traction": "4WD"
    },
    "highlightFeatures": [
      "Motor 2.0L Turbo 201 HP + tracción 4WD",
      "Pantalla 12.3\" + W-HUD proyectado en parabrisas",
      "Techo panorámico eléctrico + Asientos ventilados",
      "8 altavoces DTS + Infinity Sound System"
    ]
  },
  {
    "brand": "Haval",
    "model": "H6 HEV",
    "slug": "haval-h6-hev",
    "tagline": "SUV híbrido premium con 243 HP y consumo de solo 18.4 km/L",
    "category": "SUV Híbrido",
    "year": 2025,
    "specs": {
      "power": "243 HP combinados",
      "torque": "530 Nm combinados",
      "transmission": "Transmisión híbrida DHT",
      "fuelConsumption": "18.4 km/L"
    },
    "highlightFeatures": [
      "243 HP y 530 Nm de potencia combinada",
      "Consumo 18.4 km/L en uso mixto",
      "Pantalla 12.3\" Apple CarPlay + Android Auto",
      "Sistema híbrido DHT autorrecargable"
    ]
  },
  {
    "brand": "GWM",
    "model": "Poer Super Luxury",
    "slug": "gwm-poer",
    "tagline": "Pickup 4x4 diesel premium con 163 CV y tracción TOD BorgWarner",
    "category": "Pickup",
    "year": 2025,
    "specs": {
      "engine": "2.0L Diesel",
      "power": "163 CV",
      "torque": "400 Nm",
      "transmission": "Automática ZF 8 velocidades",
      "traction": "4x4 automática TOD"
    },
    "highlightFeatures": [
      "Motor diesel 2.0L 163 CV con 400 Nm",
      "Transmisión automática ZF 8 velocidades",
      "Tracción 4x4 TOD BorgWarner + Selector 4L",
      "Bloqueo diferencial trasero electrónico"
    ]
  },
  {
    "brand": "GWM",
    "model": "Tank 300",
    "slug": "gwm-tank-300",
    "tagline": "SUV 4x4 todoterreno con 217 HP y selector 2H/4H/4L",
    "category": "SUV 4x4 Todoterreno",
    "year": 2025,
    "specs": {
      "engine": "2.0L Turbo",
      "power": "217 HP",
      "torque": "380 Nm",
      "transmission": "Automática",
      "traction": "4WD con selector 2H/4H/4L"
    },
    "highlightFeatures": [
      "Motor turbo 2.0L con 217 HP y 380 Nm",
      "Selector tracción 2H/4H/4L para todo terreno",
      "Pantalla táctil 12.3\" Apple CarPlay + Android Auto",
      "Sistema audio Infinity: 8 parlantes + subwoofer"
    ]
  },
  {
    "brand": "Mitsubishi",
    "model": "L200",
    "slug": "mitsubishi-l200",
    "tagline": "Pickup 4x4 legendaria con motor diesel 181 CV y Super Select 4WD-II",
    "category": "Pickup",
    "year": 2025,
    "specs": {
      "engine": "2.4L Turbo Diesel",
      "power": "181 CV",
      "torque": "430 Nm",
      "transmission": "Manual 6 vel / Automática 6 vel",
      "traction": "Super Select 4WD-II"
    },
    "highlightFeatures": [
      "Motor diesel 2.4L 181 CV con 430 Nm de torque",
      "Sistema Super Select 4WD-II legendario",
      "7 airbags + ASTC + HAC + DAC + TSA",
      "Pantalla táctil 7\" con GPS, Apple CarPlay y Android Auto"
    ]
  },
  {
    "brand": "Mitsubishi",
    "model": "Outlander",
    "slug": "mitsubishi-outlander",
    "tagline": "SUV 7 asientos premium con S-AWC y 184 CV de potencia",
    "category": "SUV 7 Asientos",
    "year": 2025,
    "specs": {
      "engine": "2.5L DOHC",
      "power": "184 CV",
      "torque": "244 Nm",
      "transmission": "CVT",
      "traction": "S-AWC + AYC"
    },
    "highlightFeatures": [
      "7 asientos con 3ra fila + Respaldo abatible 40:20:40",
      "S-AWC + AYC + 6 modos de conducción",
      "Display conductor 12.3\" + Pantalla 9\" GPS CarPlay/Android Auto",
      "Techo solar panorámico eléctrico"
    ]
  },
  {
    "brand": "Changan",
    "model": "CS55 Plus PHEV",
    "slug": "changan-cs55-plus-phev",
    "tagline": "SUV híbrido enchufable autorrecargable con 1215 km de autonomía combinada",
    "category": "SUV Híbrido Enchufable",
    "year": 2025,
    "specs": {
      "autonomy": "1215 km CLTC combinada",
      "transmission": "Automática",
      "traction": "FWD"
    },
    "priceUsd": 32000,
    "highlightFeatures": [
      "Autonomía combinada 1215 km CLTC",
      "Tecnología híbrida enchufable autorrecargable",
      "Diseño moderno y espacioso",
      "Precio competitivo USD 32.000"
    ]
  }
];

const SYSTEM_PROMPT = `Sos el asistente virtual de Valparaíso Motors, concesionario oficial de Haval, GWM, Mitsubishi, Changan y ORA en Córdoba, Argentina.

Tu trabajo es:
1. Ayudar a los visitantes a encontrar el vehículo ideal según sus necesidades
2. Responder preguntas sobre specs, precios y disponibilidad
3. Comparar modelos cuando te lo pidan
4. Ofrecer agendar test drives
5. Capturar datos de contacto de forma natural (nombre + teléfono)

Reglas:
- Hablás en español argentino, profesional pero cercano
- Usás voseo ("vos podés", "si querés")
- Solo hablás de los vehículos que Valparaíso Motors vende (datos adjuntos)
- Si no sabés algo, decís "No tengo esa info, pero podés consultarlo al (0351) 3092154"
- Nunca inventás precios ni datos técnicos
- Cuando alguien muestra interés real, sugerís agendar un test drive o hablar con un asesor
- Sos conciso — respuestas de 2-4 oraciones max, a menos que pidan detalle

Datos de la concesionaria:
- Dirección: Av. Ciudad de Valparaíso 4380, Córdoba
- Teléfono: (0351) 3092154
- Horarios: Lun-Vie 9:00-19:30, Sáb 9:00-14:00
- WhatsApp: +54 9 351 309-2154

VEHÍCULOS DISPONIBLES:
${JSON.stringify(VEHICLE_DATA, null, 2)}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const aiGatewayKey = process.env.AI_GATEWAY_KEY;
    if (!aiGatewayKey) {
      console.error('[API /chat] AI_GATEWAY_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Prepare messages with system prompt
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Store user message
    const lastMessage = messages[messages.length - 1];
    if (sessionId && lastMessage?.role === 'user') {
      await createChatMessage({
        sessionId,
        role: 'user',
        content: lastMessage.content,
      });
    }

    // Call Gemini Flash via Vercel AI Gateway
    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiGatewayKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API /chat] AI Gateway error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Error communicating with AI service' },
        { status: 500 }
      );
    }

    // Stream the response back to client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullAssistantMessage = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Parse SSE format
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    fullAssistantMessage += content;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  // Skip parsing errors
                }
              }
            }
          }

          // Store assistant message
          if (sessionId && fullAssistantMessage) {
            await createChatMessage({
              sessionId,
              role: 'assistant',
              content: fullAssistantMessage,
            });
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[API /chat] Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[API /chat] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
