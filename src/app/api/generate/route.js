import { rateLimiter } from '../../../lib/limiter';
import { generateBlog } from '../../../lib/aiResponse';

export async function POST(req) {
  // Get IP address
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
  try {
    await rateLimiter.consume(ip);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded – try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // Parse input data
  let data = {};
  try {
    data = await req.json();
  } catch {}
  const { threadText, threadUrl, selectedTone, customVibe } = data;

  // If a URL is provided, reject for now
  if (threadUrl && threadUrl.trim()) {
    return new Response(
      JSON.stringify({ comingSoon: true, message: 'Coming soon, just paste thread for now.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // If no threadText, reject
  if (!threadText || !threadText.trim()) {
    return new Response(
      JSON.stringify({ error: 'Thread text is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // Call AI
  const result = await generateBlog({
    thread: threadText,
    tone: selectedTone,
    customPrompt: customVibe,
  });
  return new Response(
    JSON.stringify(result),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
} 