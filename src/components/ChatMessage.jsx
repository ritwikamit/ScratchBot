import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import CopyButton from './CopyButton';

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const langLabel = lang || 'code';
  const langUpper = langLabel.toUpperCase();
  return `<div class="code-block-wrapper">
    <div class="code-block-header">
      <span class="code-lang">${langUpper}</span>
      <span class="code-copy-btn" data-code="${encodeURIComponent(text)}" data-lang="${langLabel}"></span>
    </div>
    <pre><code class="language-${langLabel}">${text}</code></pre>
  </div>`;
};

renderer.paragraph = ({ tokens }) => {
  const text = tokens.map((t) => t.raw).join('');
  return `<p>${text}</p>\n`;
};

renderer.codespan = ({ text }) => `<code>${text}</code>`;

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer,
});

function decodeHtmlEntities(str) {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.textContent;
}

function MessageContent({ text }) {
  const html = useMemo(() => {
    try {
      return marked.parse(text);
    } catch {
      return `<p>${text}</p>`;
    }
  }, [text]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll('.code-copy-btn').forEach((el) => {
      const code = decodeHtmlEntities(el.getAttribute('data-code'));
      const copyButton = document.createElement('span');
      copyButton.innerHTML = `<button class="copy-btn-inline">Copy</button>`;
      copyButton.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code).then(() => {
          const btn = copyButton.querySelector('button');
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
      el.replaceWith(copyButton);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-sm max-w-none text-[15px] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [showCopy, setShowCopy] = useState(false);

  const msgVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      variants={msgVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
      className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-purple-500/80 to-pink-500/80 flex items-center justify-center shadow-md shadow-purple-500/15 mt-1">
          <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 40 40" fill="none">
            <path d="M10 14 C10 12.34 11.34 11 13 11 L27 11 C28.66 11 30 12.34 30 14 L30 22 C30 23.66 28.66 25 27 25 L18 25 L13 29 L13 25 L13 25 C11.34 25 10 23.66 10 22 Z"
                  stroke="white" strokeWidth="1.4" strokeLinejoin="round" opacity="0.8"/>
            <circle cx="15" cy="17" r="1.2" fill="white" opacity="0.8"/>
            <circle cx="20" cy="17" r="1.2" fill="white" opacity="0.8"/>
            <circle cx="25" cy="17" r="1.2" fill="white" opacity="0.8"/>
          </svg>
        </div>
      )}

      <div
        className={`relative group max-w-[88%] sm:max-w-[80%] lg:max-w-[70%] ${
          isUser ? 'order-1' : ''
        }`}
      >
        <div
          className={`px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-purple-600/25 backdrop-blur-2xl text-purple-50 ring-1 ring-purple-400/20 shadow-md shadow-purple-500/5'
              : 'bg-black/40 backdrop-blur-2xl text-white ring-1 ring-white/10'
          }`}
        >
          {isUser ? (
            <p className="text-sm sm:text-[15px] leading-relaxed">{message.text}</p>
          ) : (
            <MessageContent text={message.text} />
          )}
        </div>

        <div
          className={`flex items-center gap-1.5 mt-1.5 ${
            isUser ? 'justify-end' : ''
          }`}
        >
          {!isUser && (
            <motion.div
              initial={false}
              animate={{ opacity: showCopy ? 1 : 0, y: showCopy ? 0 : 2 }}
              transition={{ duration: 0.15 }}
            >
              <CopyButton text={message.text} />
            </motion.div>
          )}
          <span className={`text-[10px] font-medium ${isUser ? 'text-purple-300/50' : 'text-cosmic-300'}`}>
            {isUser ? 'You' : 'ScratchBot'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
