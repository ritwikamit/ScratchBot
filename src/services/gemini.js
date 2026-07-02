const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'qwen/qwen-2.5-7b-instruct';

export async function sendMessage(messages, signal) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('Set a valid VITE_OPENROUTER_API_KEY in your Vercel project environment variables (Project Settings > Environment Variables).');
  }

  const chatMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));

  const res = await fetch(API_URL, { signal,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ScratchBot',
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

export async function sendMessageStream(messages, signal, onToken) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('Set a valid VITE_OPENROUTER_API_KEY in your Vercel project environment variables (Project Settings > Environment Variables).');
  }

  const chatMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.text,
  }));

  const res = await fetch(API_URL, { signal,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ScratchBot',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: chatMessages,
      max_tokens: 2048,
      temperature: 0.7,
      stream: true,
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

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (!trimmed.startsWith('data: ')) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const content = json?.choices?.[0]?.delta?.content;
        if (content) onToken(content);
      } catch {
        //
      }
    }
  }
}
