import { NextResponse } from 'next/server';
import axios from 'axios';

let conversationHistory = [];

export async function POST(request) {
  const body = await request.json();
  const { text } = body;

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  conversationHistory.push({ role: 'user', content: text });
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }

  try {
    const openRouterResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct',
        messages: conversationHistory,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'Lurnix Voice Chat',
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
    console.error('OpenRouter API error:', error.message);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
