#!/bin/bash

# 启动后端服务
echo "正在启动后端服务..."
cd /Users/loop/cqdigital/blog-system
npm run start:dev > backend.log 2>&1 &
BACKEND_PID=$!

# 等待一会儿确保后端开始启动
sleep 5

# 启动前端服务在3001端口
echo "正在启动前端服务..."
cd /Users/loop/cqdigital/blog-system/frontend
npm run dev:port > frontend.log 2>&1 &
FRONTEND_PID=$!

echo "后端服务 PID: $BACKEND_PID"
echo "前端服务 PID: $FRONTEND_PID"
echo ""
echo "服务已启动:"
echo "- 后端 API 服务运行在: http://localhost:3000"
echo "- 前端应用运行在: http://localhost:3001"
echo ""
echo "日志文件:"
echo "- 后端日志: /Users/loop/cqdigital/blog-system/backend.log"
echo "- 前端日志: /Users/loop/cqdigital/blog-system/frontend/frontend.log"

# 等待任意进程退出
wait $BACKEND_PID $FRONTEND_PID