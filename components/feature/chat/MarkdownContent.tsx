"use client"

// 导入必要的依赖
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'              // 用于解析HTML标签
import rehypeHighlight from 'rehype-highlight'   // 用于代码语法高亮
import { useEffect, useRef } from 'react'
// 导入代码高亮样式，可以选择其他主题
import 'highlight.js/styles/github.css'

// 定义组件的Props类型
type MarkdownContentProps = {
  content: string  // markdown内容字符串
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // 创建一个ref数组来存储所有代码块的DOM引用
  const codeBlockRefs = useRef<HTMLDivElement[]>([]);

  // 初始化代码复制功能
  useEffect(() => {
    const initializeClipboard = async () => {
      // 动态导入clipboard.js库
      const Clipboard = (await import('clipboard')).default;
      // 遍历所有代码块，为每个代码块添加复制功能
      codeBlockRefs.current.forEach((blockRef, index) => {
        if (blockRef) {
          const button = blockRef.querySelector('.copy-button');
          const codeElement = blockRef.querySelector('code');
          if (button && codeElement) {
            // 初始化Clipboard实例
            const clipboard = new Clipboard(button, {
              text: () => codeElement.textContent || ''  // 获取代码内容
            });

            // 复制成功后的回调
            clipboard.on('success', (e) => {
              const btn = e.trigger as HTMLButtonElement;
              btn.textContent = '已复制!';  // 更新按钮文本
              // 2秒后恢复按钮文本
              setTimeout(() => {
                btn.textContent = '复制';
              }, 2000);
            });
          }
        }
      });
    };

    initializeClipboard();
  }, [content]);  // 当content变化时重新初始化

  return (
    // prose类用于美化markdown排版
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        // 配置rehype插件：支持HTML解析和代码高亮
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        // 自定义各种markdown元素的渲染
        components={{
          // 自定义代码块渲染
          code({ node, inline, className, children, ...props }) {
            // 检测代码块的语言
            const match = /language-(\w+)/.exec(className || '')
            
            // 处理内联代码
            if (inline || !match) {
              return (
                <code {...props} className="bg-gray-200 rounded px-1">
                  {children}
                </code>
              )
            }
            
            // 处理代码块
            return (
              <div 
                className="rounded-lg bg-gray-100 p-4 my-4 relative group"
                // 将代码块DOM引用存储到ref数组中
                ref={(el) => {
                  if (el) {
                    codeBlockRefs.current.push(el);
                  }
                }}
              >
                {/* 复制按钮 */}
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
          // 自定义链接渲染：添加样式和安全属性
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // 自定义表格渲染：添加横向滚动支持
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props} className="min-w-full divide-y divide-gray-300" />
            </div>
          ),
          // 自定义表头单元格样式
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            />
          ),
          // 自定义表格单元格样式
          td: ({ node, ...props }) => (
            <td {...props} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500" />
          ),
          // 自定义分割线样式
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-t border-gray-300" />
          ),
          // 自定义各级标题样式
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