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

  const apiKey = process.env.Lurnix_Chatbot || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenRouter API key is not configured' }, { status: 500 });
  }

  let conversationHistory = [...historyContext, { role: 'user', content: message }];
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }

  const model = process.env.AI_MODEL || 'meta-llama/llama-3.1-8b-instruct';

  try {
    const openRouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: conversationHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Lurnix Chatbot',
        },
      }
    );
    let reply = '';
    if (
      openRouterResponse.data &&
      openRouterResponse.data.choices &&
      openRouterResponse.data.choices.length > 0
    ) {
      reply = openRouterResponse.data.choices[0].message.content;
    }
    conversationHistory.push({ role: 'assistant', content: reply });
    return NextResponse.json({ reply });
  } catch (error) {
    const status = error.response?.status || 500;
    const rawError = error.response?.data?.error?.message || error.message;
    const sanitizedMsg = typeof rawError === 'string'
      ? rawError.replace(/sk-[a-zA-Z0-9_-]{20,}/g, '[REDACTED_KEY]').replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, 'Bearer [REDACTED]')
      : 'Failed to process AI request';
    console.error(`[Chat API Error] Status: ${status}, Model: ${model}, Message: ${sanitizedMsg}`);
    return NextResponse.json(
      { error: 'Failed to process AI request', details: sanitizedMsg },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
