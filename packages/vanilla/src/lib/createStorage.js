/**
 * 환경별 스토리지 추상화 함수 - 브라우저/서버 환경에서 동일한 인터페이스 제공
 * @param {string} key - 스토리지 키 (예: "cart", "user-preferences")
 * @param {Storage} storage - 스토리지 구현체 (기본값: 환경별 자동 선택)
 * @returns {Object} { get, set, reset } 스토리지 조작 메서드들
 */
export const createStorage = (key, storage = typeof window === "undefined" ? memoryStorage() : window.localStorage) => {
  // 데이터 조회
  const get = () => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing storage item for key "${key}":`, error);
      return null;
    }
  };

  // 데이터 저장
  const set = (value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting storage item for key "${key}":`, error);
    }
  };

  // 데이터 삭제
  const reset = () => {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage item for key "${key}":`, error);
    }
  };

  return { get, set, reset };
};

/**
 * 서버 환경용 메모리 스토리지 - localStorage API와 동일한 인터페이스 제공
 * @returns {Object} localStorage와 호환되는 메서드를 가진 객체
 */
const memoryStorage = () => {
  const storage = new Map(); // 메모리 내 데이터 저장소

  return {
    getItem: (key) => storage.get(key),
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear(),
  };
};
