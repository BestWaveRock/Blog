'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
// Editor.js核心库和插件使用动态导入以避免SSR问题
// @ts-ignore
import type EditorJS from '@editorjs/editorjs';
// @ts-ignore

// 定义Editor.js的数据类型
interface EditorJSData {
  time: number;
  blocks: Array<{
    type: string;
    data: any;
  }>;
  version: string;
}

// 定义组件属性
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// 移除有问题的动态导入

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter your content here...'
}) => {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== 'undefined' && holderRef.current) {
      initializeEditor();
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isClient]);

  const initializeEditor = async () => {
    if (!holderRef.current) return;

    try {
      // 动态导入Editor.js插件
      const EditorJSModule = (await import('@editorjs/editorjs')).default;
      // @ts-ignore
      const Paragraph = (await import('@editorjs/paragraph')).default;
      // @ts-ignore
      const Header = (await import('@editorjs/header')).default;
      const List = (await import('@editorjs/list')).default;
      const Code = (await import('@editorjs/code')).default;
      // @ts-ignore
      const Embed = (await import('@editorjs/embed')).default as any;
      // @ts-ignore
      const Table = (await import('@editorjs/table')).default;
      const Quote = (await import('@editorjs/quote')).default;
      // @ts-ignore
      const Marker = (await import('@editorjs/marker')).default;
      const InlineCode = (await import('@editorjs/inline-code')).default;

      // 解析初始数据
      let initialData: EditorJSData | undefined;
      if (value) {
        try {
          initialData = JSON.parse(value);
        } catch (e) {
          // 如果解析失败，创建包含纯文本的段落块
          initialData = {
            time: Date.now(),
            blocks: [{
              type: 'paragraph',
              data: {
                text: value
              }
            }],
            version: '2.0'
          };
        }
      }

      // 创建Editor.js实例
      const editor = new EditorJSModule({
        holder: holderRef.current,
        tools: {
          paragraph: Paragraph as any,
          header: Header as any,
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          code: Code,
          embed: Embed,
          table: Table as any,
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            },
          },
          marker: Marker,
          inlineCode: InlineCode,
        },
        data: initialData,
        placeholder: placeholder,
        minHeight: 300,
        onChange: async (api, event) => {
          if (editorRef.current) {
            const savedData = await editorRef.current.save();
            onChange(JSON.stringify(savedData));
          }
        },
      });

      editorRef.current = editor;
      setIsEditorReady(true);
    } catch (error) {
      console.error('Failed to initialize Editor.js:', error);
    }
  };

  if (!isClient) {
    return (
      <div className="card-apple p-6">
        <div className="text-secondary">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="card-apple">
      <div
        ref={holderRef}
        className="prose prose-lg max-w-none p-6 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 rounded-xl"
      >
        {!isEditorReady && (
          <div className="text-secondary">
            Initializing editor...
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;