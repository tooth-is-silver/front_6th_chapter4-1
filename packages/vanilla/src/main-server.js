import { ServerRouter } from "./lib/ServerRouter.js";
import { getProducts, getProduct, getCategories } from "./api/productApi.js";

// productApi.js 함수들을 직접 export (환경별 baseUrl 처리 로직 포함)
export const mockGetProducts = getProducts;
export const mockGetProduct = getProduct;
export const mockGetCategories = getCategories;

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
