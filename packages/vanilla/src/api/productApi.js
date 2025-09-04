// API 기본 URL 설정
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  const prod = process.env.NODE_ENV === "production";
  return prod ? "http://localhost:4174" : "http://localhost:5174";
};

const BASE_URL = getBaseUrl();

// SSG 환경에서는 ServerRouter의 함수들을 직접 사용
export async function getProducts(params = {}) {
  const { limit = 20, search = "", category1 = "", category2 = "", sort = "price_asc" } = params;
  const page = params.current ?? params.page ?? 1;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(category1 && { category1 }),
    ...(category2 && { category2 }),
    sort,
  });

  const response = await fetch(`${BASE_URL}/api/products?${searchParams}`);
  return await response.json();
}

export async function getProduct(productId) {
  const response = await fetch(`${BASE_URL}/api/products/${productId}`);
  return await response.json();
}

export async function getCategories() {
  // 클라이언트 환경에서는 기존 API 호출 유지
  const response = await fetch(`${BASE_URL}/api/categories`);
  return await response.json();
}
