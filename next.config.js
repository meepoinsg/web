// 不管Vercel具体怎么调用构建命令（next build 还是 npm run build），
// Next.js 启动时一定会先加载这个配置文件，所以把"合并地点数据"这一步
// 放在这里执行，保证每次构建/开发启动前数据都是最新的。
const { buildPlaces } = require("./scripts/build-places");
buildPlaces();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
