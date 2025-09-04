import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { mockGetProducts } from "./src/main-server.js";

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, "../../dist/vanilla");

// 페이지 목록 생성
async function getPages() {
  const products = await mockGetProducts({ limit: 20 });
  return [
    { url: "/", filePath: `${DIST_DIR}/index.html` },
    { url: "/404", filePath: `${DIST_DIR}/404.html` },
    ...products.products.map((p) => ({
      url: `/product/${p.productId}/`,
      filePath: `${DIST_DIR}/product/${p.productId}/index.html`,
    })),
  ];
}

// HTML 파일 저장 함수
async function saveHtmlFile(filePath, html) {
  // 디렉토리 생성
  const dir = dirname(filePath);
  try {
    mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(err);
    // 디렉토리가 이미 존재하는 경우 무시
  }

  // 파일 저장
  writeFileSync(filePath, html);
  console.log(`Generated: ${filePath}`);
}

async function generateStaticSite() {
  console.log("Starting SSG build...");

  // 2. 페이지 목록 생성
  const pages = await getPages();
  console.log(`Total pages to generate: ${pages.length}`);

  // 3. 각 페이지 렌더링 + 저장 (TODO: 실제 render 함수 사용)
  for (const page of pages) {
    const html = `<h1>Static Page: ${page.url}</h1>`;
    await saveHtmlFile(page.filePath, html);
  }

  console.log("SSG build completed!");
}

// 실행
generateStaticSite();
