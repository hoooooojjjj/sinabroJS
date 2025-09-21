# JavaScript 성능 최적화(Performance Optimization)

## 🎯 학습 목표
- JavaScript 애플리케이션의 성능 병목 지점 식별 및 해결
- 메모리 관리와 가비지 컬렉션 최적화 전략
- DOM 조작과 이벤트 처리의 효율적인 패턴
- 알고리즘과 데이터 구조 선택을 통한 성능 향상
- 실무에서 바로 적용할 수 있는 최적화 기법들

## 🚀 핵심 최적화 영역

### 1. 메모리 최적화
**메모리 누수 방지**
```javascript
// ❌ 메모리 누수 패턴
function createLeak() {
    const element = document.createElement('div');
    element.addEventListener('click', handler); // 정리하지 않음
    setInterval(() => {}, 1000); // 정리하지 않음
}

// ✅ 메모리 효율적 패턴
class MemoryManager {
    constructor() {
        this.handlers = new Map();
        this.intervals = new Set();
    }
    
    cleanup() {
        this.handlers.forEach(({element, event, handler}) => {
            element.removeEventListener(event, handler);
        });
        this.intervals.forEach(id => clearInterval(id));
    }
}
```

**WeakMap/WeakSet 활용**
```javascript
// 자동 메모리 정리를 위한 약한 참조
const cache = new WeakMap(); // 키가 GC되면 자동 정리
const processed = new WeakSet(); // 객체가 GC되면 자동 정리
```

### 2. DOM 최적화

#### DocumentFragment 활용
```javascript
// ✅ 효율적인 DOM 조작
function createOptimizedList(items) {
    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item; // innerHTML보다 안전하고 빠름
        fragment.appendChild(div);
    });
    
    return fragment; // 한 번에 DOM에 추가
}
```

#### 배치 업데이트 패턴
```javascript
function batchDOMUpdates(element, updates) {
    // 1. 요소를 DOM에서 분리
    const parent = element.parentNode;
    const placeholder = document.createTextNode('');
    parent.replaceChild(placeholder, element);
    
    // 2. 오프라인 상태에서 모든 업데이트 수행
    updates.forEach(update => update(element));
    
    // 3. 한 번에 DOM에 다시 삽입
    parent.replaceChild(element, placeholder);
}
```

### 3. 이벤트 처리 최적화

#### 고성능 디바운스/스로틀
```javascript
class EventOptimizer {
    debounce(func, delay, key = 'default') {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timerId = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timerId);
    }
}
```

#### 이벤트 위임 최적화
```javascript
// 이벤트 위임으로 메모리 절약
container.addEventListener('click', (event) => {
    const target = event.target.closest('.button');
    if (target) handleClick(target);
}, { passive: true }); // passive로 스크롤 성능 향상
```

### 4. 알고리즘 최적화

#### 데이터 구조 선택
| 작업 | 비효율적 | 효율적 | 복잡도 개선 |
|------|----------|--------|-------------|
| 검색 | Array.find() | Map.get() | O(n) → O(1) |
| 중복제거 | filter() | Set() | O(n²) → O(n) |
| 속성확인 | hasOwnProperty | in 연산자 | 약간 빠름 |

#### 메모이제이션
```javascript
function memoize(fn, cacheSize = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) return cache.get(key);
        
        const result = fn.apply(this, args);
        
        // LRU 캐시 구현
        if (cache.size >= cacheSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}
```

## 💾 캐싱 전략

### 1. LRU (Least Recently Used) 캐시
```javascript
class LRUCache {
    lruGet(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            // 재사용된 항목을 맨 뒤로 이동
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return null;
    }
}
```

### 2. TTL (Time To Live) 캐시
```javascript
const ttlCache = {
    set(key, value, ttl = 300000) { // 5분 기본
        const expireAt = Date.now() + ttl;
        cache.set(key, { value, expireAt });
    },
    
    get(key) {
        const item = cache.get(key);
        if (!item || Date.now() > item.expireAt) {
            cache.delete(key);
            return null;
        }
        return item.value;
    }
};
```

## ⚡ 비동기 처리 최적화

### 동시성 제한
```javascript
async function limitConcurrency(tasks, limit = 3) {
    const results = [];
    const executing = [];
    
    for (const task of tasks) {
        const promise = task().then(result => {
            executing.splice(executing.indexOf(promise), 1);
            return result;
        });
        
        results.push(promise);
        executing.push(promise);
        
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    
    return Promise.all(results);
}
```

### 요청 배치 처리
```javascript
class BatchProcessor {
    constructor(batchSize = 10, delay = 100) {
        this.queue = [];
        this.batchSize = batchSize;
        this.delay = delay;
    }
    
    add(requestFn) {
        return new Promise(resolve => {
            this.queue.push({ requestFn, resolve });
            
            if (this.queue.length === 1) {
                setTimeout(() => this.processBatch(), this.delay);
            }
        });
    }
}
```

## 📊 성능 모니터링

### 실행 시간 측정
```javascript
function measureFunction(name, fn) {
    return async function(...args) {
        const start = performance.now();
        const result = await fn.apply(this, args);
        const end = performance.now();
        
        console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    };
}
```

### 메모리 사용량 모니터링
```javascript
function measureMemory() {
    if ('memory' in performance) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        return {
            used: Math.round(usedJSHeapSize / 1048576), // MB
            total: Math.round(totalJSHeapSize / 1048576),
            limit: Math.round(jsHeapSizeLimit / 1048576)
        };
    }
    return null;
}
```

### Performance API 활용
```javascript
// 성능 마크 설정
performance.mark('operation-start');

// ... 작업 수행 ...

performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

const measure = performance.getEntriesByName('operation')[0];
console.log(`Duration: ${measure.duration.toFixed(2)}ms`);
```

## 🚀 실행 방법
```bash
node performance-techniques.js
```

## 💡 실무 최적화 체크리스트

### 🔍 식별 (Identify)
- [ ] 성능 병목 지점 분석 (Chrome DevTools Profiler)
- [ ] 메모리 누수 확인 (Memory tab)
- [ ] 네트워크 요청 최적화 (Network tab)
- [ ] 렌더링 성능 분석 (Performance tab)

### ⚡ 최적화 (Optimize)
- [ ] 불필요한 DOM 조작 제거
- [ ] 이벤트 리스너 정리
- [ ] 적절한 데이터 구조 선택
- [ ] 메모이제이션 적용
- [ ] 캐싱 전략 구현
- [ ] 비동기 요청 최적화

### 📊 측정 (Measure)
- [ ] Before/After 성능 비교
- [ ] 메모리 사용량 모니터링
- [ ] 사용자 경험 지표 추적 (FCP, LCP, CLS)
- [ ] 지속적인 성능 모니터링 설정

## 🎯 성능 향상 목표

### Core Web Vitals 최적화
- **FCP (First Contentful Paint)**: < 1.8초
- **LCP (Largest Contentful Paint)**: < 2.5초  
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### JavaScript 성능 목표
- **번들 크기**: < 200KB (gzipped)
- **초기 로딩 시간**: < 3초
- **인터랙션 응답 시간**: < 16ms (60 FPS)
- **메모리 사용량**: 안정적 유지 (메모리 누수 없음)

## 🛠 권장 도구들

### 성능 분석
- **Chrome DevTools**: 종합 성능 분석
- **Lighthouse**: 자동화된 성능 감사
- **WebPageTest**: 실제 네트워크 환경 테스트
- **Bundle Analyzer**: 번들 크기 분석

### 모니터링
- **Sentry**: 실시간 성능 모니터링
- **New Relic**: APM 솔루션
- **DataDog**: 인프라 모니터링
- **Google Analytics**: 사용자 경험 추적

## 🏆 마스터 체크리스트
- [ ] 메모리 누수를 식별하고 해결할 수 있다
- [ ] DOM 조작을 최적화하여 리플로우를 최소화한다
- [ ] 적절한 데이터 구조를 선택하여 알고리즘을 최적화한다
- [ ] 캐싱 전략을 구현하여 중복 작업을 제거한다
- [ ] 비동기 처리를 최적화하여 병목을 해결한다
- [ ] 성능 모니터링 도구를 활용하여 지속적으로 개선한다
- [ ] Core Web Vitals 지표를 달성한다
