/**
 * SSG 서버 라우터 - 서버 환경에서 라우팅 처리
 */
export class ServerRouter {
  #routes;
  #baseUrl;

  constructor(baseUrl = "") {
    // 라우트 저장을 위한 Map 초기화 - 클라이언트와 동일한 구조 사용
    this.#routes = new Map();
    // baseUrl 설정 - 서버에서는 window 객체 없이 직접 전달받아 설정
    this.#baseUrl = baseUrl.replace(/\/$/, "");
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  /**
   * 라우트 등록 - 클라이언트 Router와 동일한 방식
   * @param {string} path - 경로 패턴 (예: "/product/:id")
   * @param {Function} handler - 라우트 핸들러
   */
  addRoute(path, handler) {
    // 동적 파라미터 이름들을 저장할 배열 (예: [id] for "/product/:id")
    const paramNames = [];
    // 경로 패턴을 정규식으로 변환 (:id → ([^/]+))
    const regexPath = path
      .replace(/:\w+/g, (match) => {
        paramNames.push(match.slice(1)); // ':id' -> 'id'
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    // baseUrl을 포함한 완전한 정규식 패턴 생성
    const regex = new RegExp(`^${this.#baseUrl}${regexPath}$`);

    // 라우트 정보를 Map에 저장 - 나중에 findRoute에서 사용
    this.#routes.set(path, {
      regex,
      paramNames,
      handler,
    });
  }

  /**
   * URL에 매칭되는 라우트를 찾기 - 서버에서 사용
   * @param {string} url - 매칭할 URL 경로
   * @returns {Object|null} 매칭된 라우트 정보 또는 null
   */
  findRoute(url) {
    // 서버 환경에서는 전달받은 URL 문자열을 직접 파싱 (쿼리스트링 제거)
    const pathname = url.split("?")[0];

    // 등록된 모든 라우트를 순회하며 매칭 확인
    for (const [routePath, route] of this.#routes) {
      const match = pathname.match(route.regex);
      if (match) {
        // 매치된 동적 파라미터들을 객체로 변환
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1]; // 첫 번째 캡처 그룹부터 시작
        });

        // 클라이언트 Router와 동일한 형태로 반환
        return {
          ...route,
          params,
          path: routePath,
        };
      }
    }
    return null; // 매칭되는 라우트 없음
  }

  /**
   * 등록된 모든 라우트 목록 반환 - SSG 빌드용
   * @returns {Array} 라우트 목록 배열
   */
  getAllRoutes() {
    // Map의 모든 엔트리를 배열로 변환하여 반환
    return Array.from(this.#routes.entries()).map(([path, route]) => ({
      path, // 원본 경로 패턴 (예: "/product/:id")
      ...route, // regex, paramNames, handler 포함
    }));
  }

  /**
   * 쿼리 파라미터를 객체로 파싱 - 정적 메서드
   * @param {string} search - 쿼리 문자열 (예: "?page=1&limit=10")
   * @returns {Object} 파싱된 쿼리 객체
   */
  static parseQuery(search = "") {
    // 서버에서는 URLSearchParams를 직접 사용하여 파싱
    const params = new URLSearchParams(search);
    const query = {};
    for (const [key, value] of params) {
      query[key] = value;
    }
    return query;
  }
}
