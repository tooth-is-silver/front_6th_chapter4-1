import express from "express";
import compression from "compression";
import sirv from "sirv";
import { render } from "./src/main-server.js";

const prod = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || (prod ? "/front_6th_chapter4-1/vanilla/" : "/");

const app = express();

// 환경 분기
if (!prod) {
  // Vite dev server + middleware (TODO: Vite 미들웨어 추가)
  console.log("Development mode");
} else {
  // compression + sirv
  app.use(compression());
  app.use(base, sirv("./dist/vanilla", { extensions: [] }));
}

// 렌더링 파이프라인
app.use("*", async (req, res) => {
  const url = req.originalUrl.replace(base, "");
  const { html, head, initialData } = await render(url);

  // initialData 스크립트 생성
  const initialDataScript = `<script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>`;

  // Template 치환 (TODO: 실제 HTML 템플릿 로드)
  const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vanilla Javascript SSR</title>
  <!--app-head-->
</head>
<body>
<div id="app"><!--app-html--></div>
</body>
</html>
  `.trim();

  const finalHtml = template
    .replace("<!--app-head-->", head)
    .replace("<!--app-html-->", html)
    .replace("</head>", `${initialDataScript}</head>`);

  res.send(finalHtml);
});

// Start http server
app.listen(port, () => {
  console.log(`React Server started at http://localhost:${port}`);
});
