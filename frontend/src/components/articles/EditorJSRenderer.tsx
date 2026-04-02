'use client';

import React from 'react';

// Editor.js内容渲染器组件
const EditorJSRenderer = ({ content }: { content: any }) => {
  // Debugging: log the type and value of content
  console.log('EditorJSRenderer content type:', typeof content);
  console.log('EditorJSRenderer content value:', content);

  // Handle case where content is already parsed as an object
  if (typeof content === 'object' && content !== null) {
    // Check if it's already an Editor.js data structure
    if (content.blocks && Array.isArray(content.blocks)) {
      // Render directly without parsing
      return (
        <div className="prose prose-lg dark:prose-dark max-w-none">
          {content.blocks.map((block: any, index: number) => {
            switch (block.type) {
              case 'header':
                const HeaderTag = `h${block.data.level}` as any;
                return (
                  <HeaderTag key={index} className="text-foreground mt-6 mb-4">
                    {block.data.text}
                  </HeaderTag>
                );
              case 'paragraph':
                return (
                  <p key={index} className="text-foreground mb-4 typography-body">
                    {block.data.text}
                  </p>
                );
              case 'list':
                if (block.data.style === 'unordered') {
                  return (
                    <ul key={index} className="text-foreground mb-4 typography-body">
                      {block.data.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="ml-4 mb-2">{item}</li>
                      ))}
                    </ul>
                  );
                } else {
                  return (
                    <ol key={index} className="text-foreground mb-4 typography-body">
                      {block.data.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="ml-4 mb-2">{item}</li>
                      ))}
                    </ol>
                  );
                }
              case 'code':
                return (
                  <pre key={index} className="bg-surface p-4 rounded-xl mb-4 overflow-x-auto">
                    <code className="typography-code text-foreground">{block.data.code}</code>
                  </pre>
                );
              default:
                // 对于未知类型的块，尝试渲染其文本内容
                return (
                  <p key={index} className="text-foreground mb-4 typography-body">
                    {block.data?.text || JSON.stringify(block.data)}
                  </p>
                );
            }
          })}
        </div>
      );
    } else {
      // For other object types, stringify and render as plain text
      try {
        const contentString = JSON.stringify(content, null, 2);
        return (
          <div className="prose prose-lg dark:prose-dark max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
              {contentString}
            </div>
          </div>
        );
      } catch (stringifyError) {
        // If stringify fails, try a safer approach
        console.error('Failed to stringify content:', stringifyError);
        return (
          <div className="prose prose-lg dark:prose-dark max-w-none">
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
              Content cannot be displayed
            </div>
          </div>
        );
      }
    }
  }

  // Handle string content
  if (typeof content === 'string') {
    try {
      // 尝试解析Editor.js的JSON格式
      const editorData = JSON.parse(content);

      if (editorData && editorData.blocks && Array.isArray(editorData.blocks)) {
        return (
          <div className="prose prose-lg dark:prose-dark max-w-none">
            {editorData.blocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'header':
                  const HeaderTag = `h${block.data.level}` as any;
                  return (
                    <HeaderTag key={index} className="text-foreground mt-6 mb-4">
                      {block.data.text}
                    </HeaderTag>
                  );
                case 'paragraph':
                  return (
                    <p key={index} className="text-foreground mb-4 typography-body">
                      {block.data.text}
                    </p>
                  );
                case 'list':
                  if (block.data.style === 'unordered') {
                    return (
                      <ul key={index} className="text-foreground mb-4 typography-body">
                        {block.data.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="ml-4 mb-2">{item}</li>
                        ))}
                      </ul>
                    );
                  } else {
                    return (
                      <ol key={index} className="text-foreground mb-4 typography-body">
                        {block.data.items.map((item: string, itemIndex: number) => (
                          <li key={itemIndex} className="ml-4 mb-2">{item}</li>
                        ))}
                      </ol>
                    );
                  }
                case 'code':
                  return (
                    <pre key={index} className="bg-surface p-4 rounded-xl mb-4 overflow-x-auto">
                      <code className="typography-code text-foreground">{block.data.code}</code>
                    </pre>
                  );
                default:
                  // 对于未知类型的块，尝试渲染其文本内容
                  return (
                    <p key={index} className="text-foreground mb-4 typography-body">
                      {block.data?.text || String(block.data)}
                    </p>
                  );
              }
            })}
          </div>
        );
      }
    } catch (e) {
      // 如果解析失败，将内容作为普通文本处理
      console.warn('Failed to parse Editor.js content, rendering as plain text:', e);
    }

    // 默认情况下将内容作为普通文本渲染
    return (
      <div className="prose prose-lg dark:prose-dark max-w-none">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
          {content}
        </div>
      </div>
    );
  }

  // Fallback for unexpected content types
  return (
    <div className="prose prose-lg dark:prose-dark max-w-none">
      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
        Unexpected content format
      </div>
    </div>
  );
};

export default EditorJSRenderer;