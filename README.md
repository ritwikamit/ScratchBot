# ScratchBot

A cosmic-themed AI chatbot built with React, Vite, Tailwind CSS, Framer Motion, and the OpenRouter API. Features an animated starfield background, dark-only space theme, and a premium glass-morphism UI.

## Features

- Real-time AI responses via OpenRouter API (qwen/qwen-2.5-7b-instruct)
- Animated canvas starfield background with twinkling stars
- Subtle rotating spiral particle accent
- Dark-only cosmic theme (no light mode)
- Markdown rendering with code block copy support
- Conversation history with localStorage persistence
- Collapsible sidebar with chat grouping by date
- Auto-resizing input with Enter to send
- Smooth animations powered by Framer Motion
- Typing indicator and error handling with retry
- Fully responsive layout

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your API key from [OpenRouter](https://openrouter.ai/keys).

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## How It Works

The app communicates with the OpenRouter API using the qwen/qwen-2.5-7b-instruct model. Conversation history is sent with each request so the model maintains context. Responses are rendered as Markdown with syntax-highlighted code blocks. The starfield and spiral accent are rendered on canvas elements using requestAnimationFrame, optimized to pause when the tab is hidden and respect `prefers-reduced-motion`.

## Folder Structure

```
src/
├── components/
│   ├── ChatMessage.jsx       # Individual message bubble
│   ├── ChatWindow.jsx        # Message list + empty state
│   ├── CopyButton.jsx        # Copy-to-clipboard button
│   ├── Header.jsx            # Top navigation bar
│   ├── MessageInput.jsx      # Text area with send button
│   ├── Sidebar.jsx           # Chat history sidebar
│   ├── SpiralAccent.jsx      # Animated spiral particle canvas
│   ├── Starfield.jsx         # Twinkling starfield canvas
│   ├── SuggestionCards.jsx   # Quick prompt cards
│   └── TypingIndicator.jsx   # Animated typing dots
├── hooks/
│   └── useChat.js            # Chat state management
├── services/
│   └── gemini.js             # OpenRouter API client
├── utils/
│   └── helpers.js            # Utility functions
├── App.jsx                   # Root layout
├── index.css                 # Global styles
└── main.jsx                  # Entry point
```

## Tech Stack

- **React 19** — UI library
- **Vite** — Build tool
- **Tailwind CSS 4** — Styling
- **Framer Motion** — Animations
- **Marked** — Markdown rendering
- **OpenRouter API** — AI model (qwen/qwen-2.5-7b-instruct)
