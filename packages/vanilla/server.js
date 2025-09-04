import compression from "compression";
import express from "express";
import fs from "fs";
import { dirname, join } from "path";
import sirv from "sirv";
import { fileURLToPath } from "url";

// 환경 변수 설정
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const baseUrl = process.env.BASE || (isProd ? "/front_6th_chapter4-1/vanilla/" : "/");

const app = express();
app.use(compression());

// 환경 별 정적 파일 서빙 설정
if (isProd) {
  app.use(baseUrl, sirv("dist/vanilla", { dev: false }));
} else {
  // vite 개발 서버는 middleware를 사용
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 별 html 읽기
const templateHtml = isProd
  ? join(__dirname, baseUrl, "dist/vanilla/index.html")
  : join(__dirname, baseUrl, "index.html");

let template = fs.readFileSync(templateHtml, "utf-8");

// SSG 렌더링 함수
const render = async (url) => {
  return template.replace("<!--app-html-->", `<div>hihi ${url}</div>`);
};

// 모든 라우트처리
app.get("*", async (req, res) => {
  const url = req.originalUrl.replace(baseUrl, "");
  const { html, head } = await render(url);

  // html에 렌더링 결과 포함하여 응답
  const finalHtml = template.replace("<!--app-html-->", html).replace("<!--app-head-->", head);

  res.send(finalHtml);
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
