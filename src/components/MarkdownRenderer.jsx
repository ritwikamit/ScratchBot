import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useCallback } from 'react';

function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const lang = language || 'text';

  return (
    <div className="code-block-wrapper" style={{ margin: '12px 0' }}>
      <div className="code-block-header">
        <span className="code-lang">{lang.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-cosmic-300 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 8 7 11 12 5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="10" height="12" rx="1.5" />
                <path d="M5 3V2a1 1 0 011-1h4a1 1 0 011 1v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '14px 16px',
          borderRadius: '0 0 10px 10px',
          fontSize: '13px',
          lineHeight: 1.65,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          overflowX: 'auto',
        }}
        wrapLines={false}
        showLineNumbers={false}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code
      style={{
        background: 'rgba(255,255,255,0.08)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.875em',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: '#e879f9',
      }}
    >
      {children}
    </code>
  );
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>;
            }
            if (!inline) {
              return <CodeBlock language="">{String(children).replace(/\n$/, '')}</CodeBlock>;
            }
            return <InlineCode>{children}</InlineCode>;
          },
          h1: ({ children }) => <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '16px 0 8px', color: '#fff' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '14px 0 6px', color: '#fff' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '12px 0 4px', color: '#fff' }}>{children}</h3>,
          p: ({ children }) => <p style={{ margin: '8px 0', lineHeight: 1.7 }}>{children}</p>,
          ul: ({ children }) => <ul style={{ margin: '8px 0', paddingLeft: '1.5rem', listStyle: 'disc' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ margin: '8px 0', paddingLeft: '1.5rem', listStyle: 'decimal' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote
              style={{
                margin: '10px 0',
                padding: '8px 14px',
                borderLeft: '3px solid rgba(168,85,247,0.5)',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '0 8px 8px 0',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '12px 0' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead style={{ background: 'rgba(255,255,255,0.05)' }}>{children}</thead>,
          th: ({ children }) => <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>{children}</th>,
          td: ({ children }) => <td style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{children}</td>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>
              {children}
            </a>
          ),
          hr: () => <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />,
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
