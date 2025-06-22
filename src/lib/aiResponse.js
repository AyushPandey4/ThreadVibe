import slugify from "./slugify";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "sarvamai/sarvam-m:free";

export async function generateBlog({ thread, tone, customPrompt }) {
  const vibe = customPrompt || tone || "default";
  const prompt = `
You are a professional blog writer.

Take the following X (Twitter) thread and convert it into a high-quality, engaging blog post.

Thread:
${thread}

Target tone or style: ${vibe}

Return only a JSON object in the following format (markdown-escaped):
{
  "title": "...",
  "contentMarkdown": "...",
  "tags": ["...", "..."],
  "seo": {
    "title": "...",
    "description": "...",
    "slug": "..."
  },
  "imagePrompt": "..." // A short, vivid prompt for an AI image generator to create a cover image for this blog post
}

Ensure:
- The blog is well-structured with intro, headings, body, and a clear conclusion.
- Use Markdown format with ## Headings, **bold**, bullet points, etc.
- Add a CTA at the end (e.g., follow, share, comment).
- Make sure tone matches: ${vibe}
- SEO title should be catchy and descriptive (50-60 characters)
- SEO description should be compelling (150-160 characters)
- The imagePrompt should be vivid, descriptive, and suitable for a blog cover image, but should not mention any text or words.
`;

  if (!OPENROUTER_API_KEY) {
    // console.error("OpenRouter API key not set in environment variables.");
    throw new Error("OpenRouter API key not set in environment variables.");
  }

  const body = {
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 2048,
    temperature: 0.7,
  };

  // console.debug("[OpenRouter] Request body:", body);

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    // console.error("[OpenRouter] Response not ok:", response.status, text);
    throw new Error("Failed to generate blog with OpenRouter. " + text);
  }

  const data = await response.json();
  // console.debug("[OpenRouter] Response data:", data);
  // The model's response is in data.choices[0].message.content
  let content = data.choices[0].message.content;

  // Try to extract JSON block
  let jsonString = null;
  const codeBlockMatch = content.match(/```json\s*([\s\S]+?)```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  } else {
    // Fallback: find first {...} block
    const curlyMatch = content.match(/{[\s\S]+}/);
    if (curlyMatch) {
      jsonString = curlyMatch[0];
    }
  }
  // console.debug("[OpenRouter] Extracted JSON string:", jsonString);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    // console.error("[OpenRouter] Failed to parse response:", content);
    throw new Error("Failed to parse OpenRouter response.");
  }
  // Ensure seo is always an object
  parsed.seo = parsed.seo || {};
  // Fallbacks for missing fields
  if (!parsed.seo.title && parsed.title) {
    parsed.seo.title = parsed.title;
  }
  if (!parsed.seo.description && parsed.description) {
    parsed.seo.description = parsed.description;
  }
  if (!parsed.seo.slug && parsed.title) {
    parsed.seo.slug = slugify(parsed.title);
  }
  // console.debug("[OpenRouter] Parsed result:", parsed);
  return parsed;
}
