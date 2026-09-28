import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sanitizeInput, validateTextLength } from '@/lib/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimiter.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimiter.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting based on IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { text, options } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Server-side text validation
    const validation = validateTextLength(text);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Sanitize input
    const sanitizedText = sanitizeInput(text);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const systemPrompt = options?.type === 'summarize' 
      ? 'You are a helpful assistant that summarizes documents concisely while retaining key information.'
      : options?.type === 'key-points'
      ? 'You are a helpful assistant that extracts key points from documents.'
      : 'You are a helpful assistant that enhances and improves document text for clarity, readability, and professionalism.';

    const userPrompt = options?.type === 'summarize'
      ? 'Please provide a concise summary of the following text:\n\n' + sanitizedText
      : options?.type === 'key-points'
      ? 'Please extract and list the key points from the following text:\n\n' + sanitizedText
      : 'Please enhance and improve the following text for clarity, readability, and professionalism:\n\n' + sanitizedText;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const enhancedText = completion.choices[0]?.message?.content || text;

    let summary: string | undefined;
    let keyPoints: string[] | undefined;

    if (options?.type === 'enhance') {
      // Generate summary and key points for enhanced documents
      const summaryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes documents concisely.' },
          { role: 'user', content: 'Please provide a brief summary of the following text:\n\n' + enhancedText },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      const summaryText = summaryCompletion.choices[0]?.message?.content;
    summary = summaryText || undefined;

      const keyPointsCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that extracts key points from documents. Return each point on a new line.' },
          { role: 'user', content: 'Please extract the key points from the following text:\n\n' + enhancedText },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });
      const keyPointsText = keyPointsCompletion.choices[0]?.message?.content || '';
      keyPoints = keyPointsText.split('\n').filter(point => point.trim().length > 0);
    }

    return NextResponse.json({
      enhancedText,
      summary: options?.type === 'summarize' ? enhancedText : summary,
      keyPoints: options?.type === 'key-points' ? enhancedText.split('\n').filter((p: string) => p.trim()) : keyPoints,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to enhance document' }, { status: 500 });
  }
}
