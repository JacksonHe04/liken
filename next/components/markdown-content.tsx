"use client"

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'

type MarkdownContentProps = {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // 自定义代码块样式
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <span className={`${className} rounded-md p-1 bg-gray-200 overflow-auto`}>
                <code {...props} className={match ? `language-${match[1]}` : ''}>
                  {children}
                </code>
              </span>
            ) : (
              <code {...props} className="bg-red-100 dark:bg-gray-800 rounded px-1">
                {children}
              </code>
            )
          },
          // 自定义链接样式
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // 自定义表格样式
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" />
            </div>
          ),
          // 自定义表格头部样式
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
            />
          ),
          // 自定义表格单元格样式
          td: ({ node, ...props }) => (
            <td {...props} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400" />
          ),
          
          // 自定义分割线样式
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-t border-gray-300 dark:border-gray-700" />
          ),

          // 自定义标题样式
          h1: ({ node, ...props }) => (
            <h1 {...props} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 dark:text-gray-100" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6 dark:text-gray-200 dark:border-gray-700" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4 dark:text-gray-300" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="scroll-m-20 text-xl font-semibold tracking-tight mb-4 dark:text-gray-400" />
          ),
          h5: ({ node, ...props }) => (
            <h5 {...props} className="scroll-m-20 text-lg font-semibold tracking-tight mb-4 dark:text-gray-500" />
          ),
          h6: ({ node, ...props }) => (
            <h6 {...props} className="scroll-m-20 text-base font-semibold tracking-tight mb-4 dark:text-gray-600" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}