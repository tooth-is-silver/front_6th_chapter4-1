/**
 * 서버사이드 라우터 - window 객체가 없는 SSR 환경에서 사용
 */
export class ServerRouter {
  #routes;
  #route;
  #baseUrl;
  #currentQuery = {};

  // 모든 라우트 설정 초기화 (라우트 저장소, 활성 라우트, url)
  constructor(baseUrl = "") {
    this.#routes = new Map();
    this.#route = null;
    this.#baseUrl = baseUrl.replace(/\/$/, "");
  }

  // 현재 설정된 쿼리 파라미터를 반환 (서버 환경에서는 직접 관리)
  get query() {
    return this.#currentQuery;
  }

  // 새 쿼리 파라미터로 URL 생성하고 라우팅 업데이트
  set query(newQuery) {
    const newUrl = ServerRouter.getUrl(newQuery, this.#baseUrl);
    this.push(newUrl);
  }

  // 현재 라우트의 경로 파라미터 반환 (예: /product/:id에서 {id: "123"})
  get params() {
    return this.#route?.params ?? {};
  }

  // 현재 매칭된 라우트 정보 반환
  get route() {
    return this.#route;
  }

  // 현재 라우트의 핸들러 함수 반환
  get target() {
    return this.#route?.handler;
  }

  /**
   * 라우트 등록 - URL 패턴과 핸들러 함수를 매핑
   * @param {string} path - 경로 패턴 (예: "/product/:id")
   * @param {Function} handler - 라우트 핸들러 함수
   */
  addRoute(path, handler) {
    // 동적 파라미터를 정규식으로 변환하는 과정
    const paramNames = [];
    const regexPath = path
      .replace(/:\w+/g, (match) => {
        paramNames.push(match.slice(1)); // ':id' -> 'id'로 변환해서 저장
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const regex = new RegExp(`^${this.#baseUrl}${regexPath}$`);

    // 라우트 정보를 Map에 저장
    this.#routes.set(path, {
      regex,
      paramNames,
      handler,
    });
  }
}
