import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { ServerRouter } from "./lib/ServerRouter.js";

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

// 서버용 개별 상품 조회 함수
export const mockGetProduct = async (productId) => {
  // 해당 상품 찾기
  const product = items.find((item) => item.productId === productId);

  if (!product) {
    return null; // 상품 없음
  }

  // 기본 상품 정보 반환
  return {
    ...product,
    description: `${product.title}에 대한 상세 설명입니다.`,
    rating: 4,
    reviewCount: 100,
    stock: 50,
  };
};

// 서버용 카테고리 목록 조회 함수
export const mockGetCategories = async () => {
  const categories = {};

  items.forEach((item) => {
    const cat1 = item.category1;
    if (!categories[cat1]) categories[cat1] = {};
  });

  return categories;
};

// 라우트별 데이터 프리페칭 함수
async function prefetchData(route, params) {
  if (route.path === "/") {
    // mockGetProducts + mockGetCategories
    // productStore.dispatch(SETUP)
    const productsData = await mockGetProducts({ limit: 20 });
    const categoriesData = await mockGetCategories();
    return { products: productsData.products, categories: categoriesData };
  } else if (route.path === "/product/:id") {
    // mockGetProduct(params.id)
    // productStore.dispatch(SET_CURRENT_PRODUCT)
    const productData = await mockGetProduct(params.id);
    return { currentProduct: productData };
  }
  return {};
}

export const render = async (url) => {
  // 1. Store 초기화 (TODO: 나중에 실제 store 추가)

  // 2. 라우트 매칭
  const router = new ServerRouter("");
  router.addRoute("/", () => "HomePage");
  router.addRoute("/product/:id", () => "ProductDetailPage");

  const matchedRoute = router.findRoute(url);
  if (!matchedRoute) {
    return { html: "<h1>404 Not Found</h1>", head: "", initialData: {} };
  }

  // 3. 데이터 프리페칭
  const initialData = await prefetchData(matchedRoute, matchedRoute.params);

  // 4. HTML 생성 (TODO: 실제 컴포넌트 렌더링)
  const html = `<h1>Server Rendered: ${matchedRoute.path}</h1>`;
  const head = "";

  return { html, head, initialData };
};
