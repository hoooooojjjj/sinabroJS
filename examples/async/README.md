# 비동기 프로그래밍(Asynchronous Programming)

## 🎯 학습 목표
- 콜백 → Promise → async/await 진화 과정 완전 이해
- 실무에서 사용되는 고급 비동기 패턴 습득
- 에러 처리와 성능 최적화 전략 마스터
- API 요청 관리와 재시도 로직 구현

## 📝 비동기 프로그래밍 핵심

### 왜 비동기가 필요한가?
자바스크립트는 **싱글 스레드**이지만, 비동기 처리를 통해:
- UI 블로킹 방지
- 네트워크 요청의 효율적 처리  
- 동시성 구현
- 사용자 경험 향상

## 🔄 진화 과정

### 1단계: 콜백(Callback)
```javascript
fetchData(userId, (error, data) => {
    if (error) return handleError(error);
    // 성공 처리...
});
```
**문제점**: 콜백 헬, 에러 처리 복잡성

### 2단계: Promise
```javascript
fetchData(userId)
    .then(data => processData(data))
    .catch(error => handleError(error));
```
**개선점**: 체이닝 가능, 명확한 에러 처리

### 3단계: async/await
```javascript
try {
    const data = await fetchData(userId);
    const result = await processData(data);
    return result;
} catch (error) {
    handleError(error);
}
```
**장점**: 동기 코드처럼 직관적

## 🛠 Promise 고급 메서드

| 메서드 | 용도 | 특징 |
|--------|------|------|
| `Promise.all()` | 병렬 실행, 모두 성공 대기 | 하나라도 실패하면 전체 실패 |
| `Promise.allSettled()` | 병렬 실행, 모든 결과 확인 | 실패해도 모든 결과 반환 |
| `Promise.race()` | 가장 빠른 결과 사용 | 타임아웃 구현에 유용 |
| `Promise.any()` | 첫 번째 성공 결과 사용 | 모두 실패해야 전체 실패 |

## 🚀 실행 방법
```bash
node async-programming.js
```

## 💡 실무 패턴

### 1. 재시도 로직
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fetch(url);
        } catch (error) {
            if (attempt === maxRetries) throw error;
            await delay(Math.pow(2, attempt) * 1000); // 지수 백오프
        }
    }
}
```

### 2. 캐싱 전략
```javascript
class ApiCache {
    constructor(ttl = 300000) { // 5분 TTL
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async get(key, fetcher) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.data;
        }
        
        const data = await fetcher();
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
    }
}
```

### 3. 에러 처리 전략
```javascript
// 구체적인 에러 클래스
class NetworkError extends Error {
    constructor(message, status, url) {
        super(message);
        this.name = 'NetworkError';
        this.status = status;
        this.url = url;
    }
}

// 중앙집중식 에러 처리
async function safeApiCall(apiCall) {
    try {
        return await apiCall();
    } catch (error) {
        if (error instanceof NetworkError) {
            // 네트워크 에러 특별 처리
            console.error(`API 요청 실패: ${error.url}`);
        }
        throw error;
    }
}
```

## ⚡ 성능 최적화 팁

### 병렬 vs 순차 처리
```javascript
// ❌ 순차 처리 (느림)
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// ✅ 병렬 처리 (빠름) - 서로 독립적인 경우
const [user, posts] = await Promise.all([
    fetchUser(id),
    fetchPosts(id)
]);
```

### 메모리 효율적인 스트림 처리
```javascript
async function* processLargeDataset(items) {
    for (const item of items) {
        const processed = await processItem(item);
        yield processed; // 한 번에 하나씩 처리
    }
}
```

## 🏆 마스터 체크리스트
- [ ] 콜백 헬을 Promise로 해결할 수 있다
- [ ] Promise.all과 Promise.allSettled를 구분해서 사용한다
- [ ] async/await로 직관적인 비동기 코드를 작성한다
- [ ] 적절한 에러 처리 전략을 구현한다
- [ ] 재시도 로직과 캐싱을 활용한다
- [ ] 병렬 처리로 성능을 최적화한다
