import "./globals.css";

export const metadata = {
  title: "新加坡本地游指南",
  description: "精选吃喝玩乐 + 实时天气 + 地图",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
