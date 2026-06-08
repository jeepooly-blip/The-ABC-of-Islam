import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, locale } = await request.json();

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'TTS API key not configured' }, { status: 500 });
    }

    const voiceMap: Record<string, string> = {
      en: '21m00Tcm4TlvDq8ikWAM',
      ar: 'pNInz6obpgDQGcFmaJgB',
      fr: 'MF3mGyEYCl7XYWbV9V6O',
      es: 'TX3LPaxmHKxFdv7VOQHJ',
      tr: 'nPczCjzI2devNBz1zQrb',
      ur: 'pNInz6obpgDQGcFmaJgB',
      hi: 'pNInz6obpgDQGcFmaJgB',
      de: 'pNInz6obpgDQGcFmaJgB',
      ru: 'pNInz6obpgDQGcFmaJgB',
      pt: 'pNInz6obpgDQGcFmaJgB',
      zh: 'pNInz6obpgDQGcFmaJgB',
      ja: 'pNInz6obpgDQGcFmaJgB',
      ko: 'pNInz6obpgDQGcFmaJgB',
      id: 'pNInz6obpgDQGcFmaJgB',
      bn: 'pNInz6obpgDQGcFmaJgB',
      sw: 'pNInz6obpgDQGcFmaJgB',
    };

    const voiceId = voiceMap[locale] || voiceMap.en;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.6,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
  }
}
