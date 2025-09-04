import express from "express";
import compression from "compression";
import sirv from "sirv";

const prod = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || (prod ? "/front_6th_chapter4-1/vanilla/" : "/");

const app = express();

// 환경 분기 - 구현 가이드 예시대로
if (!prod) {
  // Vite dev server + middleware (TODO: Vite 미들웨어 추가)
  console.log("Development mode");
} else {
  // compression + sirv
  app.use(compression());
  app.use(base, sirv("./dist/vanilla", { extensions: [] }));
}

const render = () => {
  return `<div>안녕하세요</div>`;
};

app.get("*all", (req, res) => {
  res.send(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vanilla Javascript SSR</title>
</head>
<body>
<div id="app">${render()}</div>
</body>
</html>
  `.trim(),
  );
});

// Start http server
app.listen(port, () => {
  console.log(`React Server started at http://localhost:${port}`);
});
