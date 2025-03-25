"use client"

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import { useEffect, useRef } from 'react'
// 导入代码高亮样式，您可以选择其他主题
import 'highlight.js/styles/github.css'

type MarkdownContentProps = {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const codeBlockRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const initializeClipboard = async () => {
      const Clipboard = (await import('clipboard')).default;
      codeBlockRefs.current.forEach((blockRef, index) => {
        if (blockRef) {
          const button = blockRef.querySelector('.copy-button');
          const codeElement = blockRef.querySelector('code');
          if (button && codeElement) {
            const clipboard = new Clipboard(button, {
              text: () => codeElement.textContent || ''
            });

            clipboard.on('success', (e) => {
              const btn = e.trigger as HTMLButtonElement;
              btn.textContent = '已复制!';
              setTimeout(() => {
                btn.textContent = '复制';
              }, 2000);
            });
          }
        }
      });
    };

    initializeClipboard();
  }, [content]);

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            
            if (inline || !match) {
              return (
                <code {...props} className="bg-gray-200 rounded px-1">
                  {children}
                </code>
              )
            }
            
            return (
              <div 
                className="rounded-lg bg-gray-100 p-4 my-4 relative group"
                ref={(el) => {
                  if (el) {
                    codeBlockRefs.current.push(el);
                  }
                }}
              >
                <button
                  className="copy-button absolute top-2 right-2 px-2 py-1 text-sm bg-gray-200 
                    rounded transition-opacity duration-200"
                >
                  复制
                </button>
                <code {...props} className={className}>
                  {children}
                </code>
              </div>
            )
          },
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="min-w-full divide-y divide-gray-300" />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500" />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-t border-gray-300" />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 my-6" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="scroll-m-20 text-2xl font-semibold tracking-tight my-4" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="scroll-m-20 text-xl font-semibold tracking-tight my-4" />
          ),
          h5: ({ node, ...props }) => (
            <h5 {...props} className="scroll-m-20 text-lg font-semibold tracking-tight my-4" />
          ),
          h6: ({ node, ...props }) => (
            <h6 {...props} className="scroll-m-20 text-base font-semibold tracking-tight my-4" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}