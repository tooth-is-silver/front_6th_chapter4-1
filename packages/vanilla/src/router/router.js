// 글로벌 라우터 인스턴스
import { Router, ServerRouter } from "../lib";
import { BASE_URL } from "../constants.js";

export const router = typeof window === "undefined" ? new ServerRouter("") : new Router(BASE_URL);
