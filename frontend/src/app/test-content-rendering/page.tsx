'use client';

import { useState } from 'react';
import EditorJSRenderer from '@/components/articles/EditorJSRenderer';

export default function TestContentRendering() {
  const [testContent, setTestContent] = useState('');
  const [renderMode, setRenderMode] = useState('json');

  // 测试用的Editor.js JSON内容
  const editorJsContent = {
    "time": 1775110791978,
    "blocks": [
      {
        "id": "hWBvg5pOAK",
        "type": "header",
        "data": {
          "text": "<b>一、 从“大海捞针”到“按图索骥”：日志排查的降维打击</b>",
          "level": 3
        }
      },
      {
        "id": "om8WUIzHAU",
        "type": "paragraph",
        "data": {
          "text": "就在今天，面对一组晦涩的 Kafka 消费者日志——<code>Disconnecting from node 19 due to socket connection setup timeout</code>，如果是在几年前，我可能需要翻阅 Stack Overflow 的数十个页面，对比各种 <code>advertised.listeners</code> 配置，甚至要在线下环境盲目抓包。"
        }
      },
      {
        "id": "TrYNT1nPg4",
        "type": "paragraph",
        "data": {
          "text": "但在大模型的辅助下，这种排查变成了“对话式”的。它不仅瞬间指出了 Socket 超时的物理含义，还精准地提示我检查 SASL 认证模块与机制的匹配问题。<b>大模型并没有代替我思考，它代替的是低效的搜索与信息过滤。</b> 这种对知识索引能力的冲击，让传统的“经验型程序员”产生了一种危机感：如果经验可以被秒级提取，那么“资深”的价值体现在哪里？"
        }
      }
    ],
    "version": "2.31.5"
  };

  // 测试用的纯文本内容
  const plainTextContent = "这是一篇普通的文章内容，没有使用Editor.js编辑器。它只包含纯文本内容，应该被直接渲染出来。";

  const handleTestRender = () => {
    if (renderMode === 'json') {
      setTestContent(JSON.stringify(editorJsContent));
    } else if (renderMode === 'parsed-json') {
      setTestContent(editorJsContent);
    } else {
      setTestContent(plainTextContent);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">内容渲染测试</h1>

        <div className="mb-6">
          <label className="block text-foreground mb-2">选择测试模式:</label>
          <select
            value={renderMode}
            onChange={(e) => setRenderMode(e.target.value)}
            className="w-full p-2 border border-border rounded bg-background text-foreground"
          >
            <option value="json">JSON字符串</option>
            <option value="parsed-json">已解析的JSON对象</option>
            <option value="plain">纯文本</option>
          </select>
        </div>

        <button
          onClick={handleTestRender}
          className="bg-accent text-white px-4 py-2 rounded mb-6"
        >
          测试渲染
        </button>

        <div className="card-apple p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">渲染结果:</h2>
          {testContent ? (
            <EditorJSRenderer content={testContent} />
          ) : (
            <p className="text-secondary">点击"测试渲染"按钮查看结果</p>
          )}
        </div>
      </div>
    </div>
  );
}