import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSession } from '@/lib/auth/session';

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { message, historyContext = [] } = body;

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
  }

  const apiUrl = process.env.GROQ_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: 'GROQ_API_URL is not configured' }, { status: 500 });
  }

  const model = process.env.GROQ_MODEL;
  if (!model) {
    return NextResponse.json({ error: 'GROQ_MODEL is not configured' }, { status: 500 });
  }

  let conversationHistory = [...historyContext, { role: 'user', content: message }];
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }

  try {
    const groqResponse = await axios.post(
      apiUrl,
      {
        model,
        messages: conversationHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    let reply = '';
    if (
      groqResponse.data &&
      groqResponse.data.choices &&
      groqResponse.data.choices.length > 0
    ) {
      reply = groqResponse.data.choices[0].message.content;
    }
    conversationHistory.push({ role: 'assistant', content: reply });
    return NextResponse.json({ reply });
  } catch (error) {
    const status = error.response?.status || 500;
    const rawError = error.response?.data?.error?.message || error.message;
    const sanitizedMsg = typeof rawError === 'string'
      ? rawError.replace(/gsk_[a-zA-Z0-9_-]{20,}/g, '[REDACTED_KEY]').replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[REDACTED_KEY]').replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]')
      : 'Failed to process AI request';
    console.error(`[Chat API Error] Status: ${status}, Model: ${model}, Message: ${sanitizedMsg}`);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: sanitizedMsg },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
