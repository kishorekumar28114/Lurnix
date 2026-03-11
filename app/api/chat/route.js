import { NextResponse } from 'next/server';
import axios from 'axios';

let conversationHistory = [];
const Lurnix_Chatbot = process.env.Lurnix_Chatbot;

export async function POST(request) {
  const body = await request.json();
  const { message } = body;

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  conversationHistory.push({ role: 'user', content: message });
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
          Authorization: `Bearer ${Lurnix_Chatbot}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'Lurnix Chatbot',
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
