const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'qwen/qwen-2.5-7b-instruct';

export async function sendMessage(messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    throw new Error('Set a valid VITE_OPENROUTER_API_KEY in your .env file');
  }

  const chatMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Gemini Assistant',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: chatMessages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const err = await res.json();
      message = err?.error?.message || JSON.stringify(err?.error) || message;
    } catch {
      const text = await res.text().catch(() => '');
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from API');
  }

  return text;
}
