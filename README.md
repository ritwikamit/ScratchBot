# ScratchBot

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer)](https://motion.dev)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Qwen_2.5_7B-FF6B6B)](https://openrouter.ai)

A cosmic-themed AI chatbot with syntax-highlighted markdown, conversation history, and a premium glass-morphism UI.

![Screenshot](https://github.com/user-attachments/assets/00000000-0000-0000-0000-000000000000)

## Features

| Feature | Description |
|---|---|
| **AI Responses** | Real-time replies via OpenRouter (qwen/qwen-2.5-7b-instruct) |
| **Syntax Highlighting** | vscDarkPlus theme with language detection (18 languages) |
| **Code Blocks** | Copy button, language label, horizontal scroll |
| **Stop Generation** | Abort in-flight requests, preserves partial response |
| **Conversation History** | localStorage persistence with date-based sidebar grouping |
| **Dark Theme** | Full cosmic dark mode — no light mode |
| **Animations** | Framer Motion micro-interactions throughout |
| **Responsive** | Mobile-first adaptive layout |
| **Accessible** | Keyboard focus rings, motion preferences respected |

## Tech Stack

- **React 19** + **Vite 6** — UI framework and build tool
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion 11** — Declarative animations
- **react-markdown** + **react-syntax-highlighter** — Markdown with syntax highlighting
- **OpenRouter API** — AI model gateway (qwen/qwen-2.5-7b-instruct)
- **Canvas API** — Animated starfield + spiral particle background

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
VITE_OPENROUTER_API_KEY=your_key_here
```

Get a key at [openrouter.ai/keys](https://openrouter.ai/keys).

> **Vercel users**: Set `VITE_OPENROUTER_API_KEY` in Project Dashboard → Settings → Environment Variables.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── components/
│   ├── Button.jsx             # Reusable button (6 variants)
│   ├── ChatMessage.jsx        # Message bubble
│   ├── ChatWindow.jsx         # Message list + empty/error states
│   ├── CopyButton.jsx         # Copy-to-clipboard button
│   ├── Header.jsx             # Top navigation bar
│   ├── MarkdownRenderer.jsx   # react-markdown + syntax highlighting
│   ├── MessageInput.jsx       # Textarea with send/stop button
│   ├── ScratchBotLogo.jsx     # Logo component
│   ├── Sidebar.jsx            # Chat history sidebar
│   ├── SpiralAccent.jsx       # Animated spiral canvas
│   ├── Starfield.jsx          # Twinkling starfield canvas
│   ├── SuggestionCards.jsx    # Quick prompt cards
│   ├── TypingIndicator.jsx    # Animated typing dots
│   └── ui/
│       └── spiral-animation.jsx
├── hooks/
│   └── useChat.js             # Chat state + AbortController logic
├── services/
│   └── gemini.js              # OpenRouter API client
├── utils/
│   └── helpers.js             # Utility functions
├── App.jsx                    # Root layout
├── index.css                  # Global styles + Tailwind
└── main.jsx                   # Entry point
```

## How It Works

1. The user types a message and presses Enter (or clicks the paper-plane button).
2. The message is added to the chat history and sent to OpenRouter alongside prior messages.
3. While waiting for a response, the send button morphs into a stop button.
4. The response is rendered as Markdown with syntax-highlighted code blocks (vscDarkPlus theme).
5. All conversations persist in `localStorage`.

## Roadmap

- [x] Markdown rendering with syntax highlighting
- [x] Stop generation mid-response
- [x] Reusable button system with variants
- [x] Paper-plane send button morphing into stop button
- [ ] Streaming responses (SSE)
- [ ] Voice input
- [ ] Export / import chat history
- [ ] Custom system prompt

## License

MIT © scratchbott.vercel.app
