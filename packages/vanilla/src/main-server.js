import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// items.json 데이터 로드 - 서버에서 mock 데이터 사용을 위해
const itemsPath = join(__dirname, "mocks", "items.json");
const items = JSON.parse(readFileSync(itemsPath, "utf-8"));

// 서버용 상품 목록 조회 함수
export const mockGetProducts = async (params = {}) => {
  const { limit = 20, search = "" } = params;
  const page = params.current ?? params.page ?? 1;

  // 검색 필터링
  let filtered = [...items];
  if (search) {
    const searchTerm = search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.title.toLowerCase().includes(searchTerm) || item.brand.toLowerCase().includes(searchTerm),
    );
  }

  // 페이지네이션
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
};

export const render = async (url, query) => {
  console.log({ url, query });
  return "";
};
