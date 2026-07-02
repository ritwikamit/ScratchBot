import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function StreamingMessage({ text }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <MarkdownRenderer content={text} />
      <span
        className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
        style={{
          background: visible ? '#a78bfa' : 'transparent',
          transition: 'background 0.1s',
        }}
      />
    </div>
  );
}
