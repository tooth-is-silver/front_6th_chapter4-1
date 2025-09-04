// 글로벌 라우터 인스턴스
import { Router } from "../lib";
import { BASE_URL } from "../constants.js";
import { ServerRouter } from "../lib/serverRouter.js";

// window 여부에 따라서 clinet router와 server router 분기
// BASE_URL을 serverRouter에만 전달하는 이유 : 서버 환경에서는 window객체가 없기 때문에 url정보를 불러올 수 없어 미리 명시
export const router = typeof window !== "undefined" ? new Router() : new ServerRouter(BASE_URL);
