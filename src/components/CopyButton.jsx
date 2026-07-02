import { useState } from 'react';
import Button from './Button';

export default function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      //
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 8 7 11 12 5"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="10" height="12" rx="1.5"/>
            <path d="M5 3V2a1 1 0 011-1h4a1 1 0 011 1v1"/>
          </svg>
          Copy
        </>
      )}
    </Button>
  );
}
