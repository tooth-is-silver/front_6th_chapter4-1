import { ServerRouter } from "./lib/ServerRouter.js";
import { HomePage, NotFoundPage, ProductDetailPage } from "./pages";

export async function render(url) {
  // 2. 라우트 매칭
  const serverRouter = new ServerRouter();

  serverRouter.addRoute("/", HomePage);
  serverRouter.addRoute("/product/:id/", ProductDetailPage);
  serverRouter.addRoute("/404", NotFoundPage);

  serverRouter.start(url);

  const { pathname, query, params } = serverRouter;

  // 3. 데이터 프리페칭
  const routeParams = { pathname, query, params };
  const data = await serverRouter.prefetch(routeParams);
  const metaData = serverRouter.target.meta ? serverRouter.target.meta(data) : "";
  const head = metaData;

  // 4. HTML 생성 - 프리패치된 데이터를 페이지 컴포넌트에 전달
  const html = await serverRouter.target(data, query);

  return { html, head, initialData: data };
}
