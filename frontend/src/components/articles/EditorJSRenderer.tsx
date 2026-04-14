'use client';

import React from 'react';

// Editor.js内容渲染器组件
const EditorJSRenderer = ({ content }: { content: any }) => {
  // Debugging: log the type and value of content
  console.log('EditorJSRenderer content type:', typeof content);
  console.log('EditorJSRenderer content value:', content);

  // 直接将内容转换为字符串并渲染，避免任何对象渲染问题
  try {
    // 确保 content 是字符串
    const contentString = typeof content === 'object' && content !== null 
      ? JSON.stringify(content, null, 2) 
      : String(content);
    
    console.log('Final content string:', contentString);
    
    // 尝试解析为 Editor.js 格式
    try {
      const editorData = JSON.parse(contentString);
      
      if (editorData && editorData.blocks && Array.isArray(editorData.blocks)) {
        console.log('Parsed Editor.js data, rendering blocks');
        return (
          <div className="prose prose-lg dark:prose-dark max-w-none">
            {editorData.blocks.map((block: any, index: number) => {
              try {
                switch (block.type) {
                  case 'header':
                    const HeaderTag = `h${block.data.level}` as any;
                    return (
                      <HeaderTag key={index} className="text-foreground mt-6 mb-4">
                        <span dangerouslySetInnerHTML={{ __html: String(block.data.text) }} />
                      </HeaderTag>
                    );
                  case 'paragraph':
                    return (
                      <p key={index} className="text-foreground mb-4 typography-body">
                        <span dangerouslySetInnerHTML={{ __html: String(block.data.text) }} />
                      </p>
                    );
                  case 'list':
                    if (block.data.style === 'unordered') {
                      return (
                        <ul key={index} className="text-foreground mb-4 typography-body">
                          {block.data.items.map((item: any, itemIndex: number) => (
                            <li key={itemIndex} className="ml-4 mb-2">
                              {typeof item === 'object' && item !== null ? (
                                <>
                                  {item.content && <span dangerouslySetInnerHTML={{ __html: item.content }} />}
                                  {item.items && item.items.length > 0 && (
                                    <ul className="ml-4 mt-2">
                                      {item.items.map((subItem: any, subIndex: number) => (
                                        <li key={subIndex} className="mb-1">
                                          {typeof subItem === 'object' && subItem !== null ? (
                                            subItem.content ? (
                                              <span dangerouslySetInnerHTML={{ __html: subItem.content }} />
                                            ) : (
                                              String(subItem)
                                            )
                                          ) : (
                                            String(subItem)
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <span dangerouslySetInnerHTML={{ __html: String(item) }} />
                              )}
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      return (
                        <ol key={index} className="text-foreground mb-4 typography-body">
                          {block.data.items.map((item: any, itemIndex: number) => (
                            <li key={itemIndex} className="ml-4 mb-2">
                              {typeof item === 'object' && item !== null ? (
                                <>
                                  {item.content && <span dangerouslySetInnerHTML={{ __html: item.content }} />}
                                  {item.items && item.items.length > 0 && (
                                    <ol className="ml-4 mt-2">
                                      {item.items.map((subItem: any, subIndex: number) => (
                                        <li key={subIndex} className="mb-1">
                                          {typeof subItem === 'object' && subItem !== null ? (
                                            subItem.content ? (
                                              <span dangerouslySetInnerHTML={{ __html: subItem.content }} />
                                            ) : (
                                              String(subItem)
                                            )
                                          ) : (
                                            String(subItem)
                                          )}
                                        </li>
                                      ))}
                                    </ol>
                                  )}
                                </>
                              ) : (
                                <span dangerouslySetInnerHTML={{ __html: String(item) }} />
                              )}
                            </li>
                          ))}
                        </ol>
                      );
                    }
                  case 'code':
                    return (
                      <pre key={index} className="bg-surface p-4 rounded-xl mb-4 overflow-x-auto">
                        <code className="typography-code text-foreground">{String(block.data.code)}</code>
                      </pre>
                    );
                  default:
                    // 对于未知类型的块，尝试渲染其文本内容
                    return (
                      <p key={index} className="text-foreground mb-4 typography-body">
                        {String(block.data?.text || block.data)}
                      </p>
                    );
                }
              } catch (blockError) {
                console.error('Error rendering block:', blockError);
                return (
                  <p key={index} className="text-foreground mb-4 typography-body">
                    Error rendering block
                  </p>
                );
              }
            })}
          </div>
        );
      }
    } catch (parseError) {
      console.warn('Failed to parse Editor.js content, rendering as plain text:', parseError);
      // 只有在解析失败时才渲染为普通文本
      return (
        <div className="prose prose-lg dark:prose-dark max-w-none">
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
            {contentString}
          </div>
        </div>
      );
    }

    // 如果解析成功但没有返回，默认返回空内容
    return null;
  } catch (error) {
    // 捕获所有可能的错误，确保组件不会崩溃
    console.error('Error in EditorJSRenderer:', error);
    return (
      <div className="prose prose-lg dark:prose-dark max-w-none">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap typography-body">
          Error rendering content
        </div>
      </div>
    );
  }
};

export default EditorJSRenderer;