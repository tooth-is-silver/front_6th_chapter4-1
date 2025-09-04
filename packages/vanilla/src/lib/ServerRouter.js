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
}
