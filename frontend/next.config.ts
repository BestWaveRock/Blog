import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    position: 'bottom-right',
  },
  allowedDevOrigins: ['127.0.0.1'],
  // 添加输出目录配置
  distDir: '.next',
  // 配置静态导出
  output: 'export',
  // 设置基础路径（如果需要）
  basePath: '',

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;