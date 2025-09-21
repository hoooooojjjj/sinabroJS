/**
 * JavaScript 성능 최적화 기법 완전 정복
 * 
 * 메모리 관리, DOM 최적화, 알고리즘 최적화, 캐싱 등
 * 실무에서 바로 적용할 수 있는 성능 향상 기법들을 학습합니다.
 */

console.log('🚀 JavaScript 성능 최적화 학습 시작!');

// ===== 1. 메모리 최적화와 가비지 컬렉션 =====
console.log('\n🧠 1. 메모리 최적화');

// ❌ 메모리 누수 패턴들
function createMemoryLeaks() {
    const leaks = [];
    
    // 1. 전역 변수 남용
    window.globalVariable = 'This creates memory leak';
    
    // 2. 이벤트 리스너 미정리
    const element = document.createElement('div');
    const handler = () => console.log('clicked');
    element.addEventListener('click', handler);
    // element.removeEventListener('click', handler); // 이게 없으면 메모리 누수
    
    // 3. 타이머 미정리
    const intervalId = setInterval(() => {
        console.log('This will run forever');
    }, 1000);
    // clearInterval(intervalId); // 이게 없으면 메모리 누수
    
    // 4. 클로저로 인한 불필요한 참조
    return function() {
        const largeData = new Array(1000000).fill('data');
        return largeData.length; // largeData가 계속 메모리에 남음
    };
}

// ✅ 메모리 효율적인 패턴들
class MemoryEfficientManager {
    constructor() {
        this.handlers = new Map();
        this.intervals = new Set();
        this.cache = new Map();
    }
    
    // WeakMap/WeakSet을 활용한 자동 메모리 정리
    createWeakCache() {
        return new WeakMap(); // 키가 GC되면 자동으로 정리됨
    }
    
    // 이벤트 리스너 안전 관리
    addEventHandler(element, event, handler) {
        const key = `${element.tagName}-${event}`;
        element.addEventListener(event, handler);
        this.handlers.set(key, { element, event, handler });
    }
    
    removeEventHandler(element, event) {
        const key = `${element.tagName}-${event}`;
        const handlerInfo = this.handlers.get(key);
        if (handlerInfo) {
            element.removeEventListener(event, handlerInfo.handler);
            this.handlers.delete(key);
        }
    }
    
    // 타이머 안전 관리
    createInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }
    
    // 정리 메서드
    cleanup() {
        // 모든 이벤트 리스너 정리
        this.handlers.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        
        // 모든 타이머 정리
        this.intervals.forEach(id => clearInterval(id));
        
        // 캐시 정리
        this.cache.clear();
        
        console.log('🧹 메모리 정리 완료');
    }
}

const memoryManager = new MemoryEfficientManager();
console.log('메모리 관리자 생성 완료');

// ===== 2. DOM 조작 최적화 =====
console.log('\n🏗️ 2. DOM 조작 최적화');

// ❌ 비효율적인 DOM 조작
function inefficientDOMManipulation() {
    const container = document.getElementById('container') || document.createElement('div');
    
    // 매번 DOM에 접근 (매우 느림)
    for (let i = 0; i < 1000; i++) {
        const div = document.createElement('div');
        div.innerHTML = `Item ${i}`;
        div.style.color = 'red'; // 매번 리플로우 발생
        container.appendChild(div); // 매번 리플로우 발생
    }
}

// ✅ 효율적인 DOM 조작
class DOMOptimizer {
    // DocumentFragment 사용으로 DOM 조작 최소화
    createOptimizedList(items) {
        const fragment = document.createDocumentFragment();
        
        items.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item; // innerHTML보다 안전하고 빠름
            div.className = 'list-item'; // CSS 클래스로 스타일링
            fragment.appendChild(div);
        });
        
        return fragment; // 한 번에 DOM에 추가
    }
    
    // 배치 DOM 업데이트
    batchDOMUpdates(element, updates) {
        // 1. 요소를 DOM에서 분리 (리플로우 방지)
        const parent = element.parentNode;
        const placeholder = document.createTextNode('');
        parent.replaceChild(placeholder, element);
        
        // 2. 오프라인 상태에서 모든 업데이트 수행
        updates.forEach(update => update(element));
        
        // 3. 한 번에 DOM에 다시 삽입
        parent.replaceChild(element, placeholder);
    }
    
    // Virtual DOM 스타일 비교 업데이트
    updateElementsEfficiently(container, newItems, oldItems = []) {
        const itemsToAdd = newItems.filter(item => !oldItems.includes(item));
        const itemsToRemove = oldItems.filter(item => !newItems.includes(item));
        
        // 제거할 요소들
        itemsToRemove.forEach(item => {
            const element = container.querySelector(`[data-item="${item}"]`);
            if (element) element.remove();
        });
        
        // 추가할 요소들 (DocumentFragment 사용)
        const fragment = document.createDocumentFragment();
        itemsToAdd.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item;
            div.dataset.item = item;
            fragment.appendChild(div);
        });
        
        container.appendChild(fragment);
    }
}

const domOptimizer = new DOMOptimizer();
console.log('DOM 최적화 도구 생성 완료');

// ===== 3. 이벤트 처리 최적화 =====
console.log('\n⚡ 3. 이벤트 처리 최적화');

// 디바운스와 스로틀 최적화 버전
class EventOptimizer {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleFlags = new Map();
    }
    
    // 고성능 디바운스 (메모리 효율적)
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
    
    // 고성능 스로틀 (정밀한 타이밍 제어)
    throttle(func, limit, key = 'default') {
        if (this.throttleFlags.has(key)) return;
        
        this.throttleFlags.set(key, true);
        func();
        
        setTimeout(() => {
            this.throttleFlags.delete(key);
        }, limit);
    }
    
    // 이벤트 위임 최적화
    delegateEvent(container, selector, eventType, handler) {
        const optimizedHandler = (event) => {
            // 이벤트 버블링 활용으로 메모리 절약
            const target = event.target.closest(selector);
            if (target && container.contains(target)) {
                handler(event, target);
            }
        };
        
        container.addEventListener(eventType, optimizedHandler, {
            passive: true, // 스크롤 성능 향상
            capture: false
        });
        
        return optimizedHandler;
    }
    
    // Intersection Observer를 활용한 지연 로딩
    createLazyLoader(callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                }
            });
        }, { ...defaultOptions, ...options });
    }
}

const eventOptimizer = new EventOptimizer();

// 사용 예제
eventOptimizer.debounce(() => {
    console.log('디바운스된 검색 실행');
}, 300, 'search');

console.log('이벤트 최적화 도구 생성 완료');

// ===== 4. 알고리즘과 데이터 구조 최적화 =====
console.log('\n🧮 4. 알고리즘 최적화');

class AlgorithmOptimizer {
    // ❌ 비효율적인 배열 검색 O(n)
    slowSearch(array, target) {
        return array.find(item => item === target);
    }
    
    // ✅ Map을 활용한 빠른 검색 O(1)
    fastSearch(map, target) {
        return map.get(target);
    }
    
    // ✅ 이진 검색 O(log n)
    binarySearch(sortedArray, target) {
        let left = 0;
        let right = sortedArray.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const midValue = sortedArray[mid];
            
            if (midValue === target) return mid;
            if (midValue < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return -1;
    }
    
    // ✅ 효율적인 배열 중복 제거
    removeDuplicates(array) {
        // Set 활용 (가장 빠름)
        return [...new Set(array)];
    }
    
    // ✅ 효율적인 배열 병합
    mergeArrays(...arrays) {
        // concat보다 스프레드가 더 빠름 (작은 배열의 경우)
        return [].concat(...arrays);
    }
    
    // ✅ 효율적인 객체 속성 체크
    hasProperty(obj, property) {
        // hasOwnProperty보다 in 연산자가 더 빠름
        return property in obj;
    }
    
    // ✅ 메모이제이션으로 중복 계산 방지
    memoize(fn, cacheSize = 100) {
        const cache = new Map();
        
        return function(...args) {
            const key = JSON.stringify(args);
            
            if (cache.has(key)) {
                return cache.get(key);
            }
            
            const result = fn.apply(this, args);
            
            // LRU 캐시 구현 (메모리 제한)
            if (cache.size >= cacheSize) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }
            
            cache.set(key, result);
            return result;
        };
    }
}

const algorithmOptimizer = new AlgorithmOptimizer();

// 성능 테스트
const testArray = Array.from({ length: 10000 }, (_, i) => i);
const testMap = new Map(testArray.map(i => [i, i]));

console.time('느린 검색');
algorithmOptimizer.slowSearch(testArray, 9999);
console.timeEnd('느린 검색');

console.time('빠른 검색');
algorithmOptimizer.fastSearch(testMap, 9999);
console.timeEnd('빠른 검색');

// ===== 5. 캐싱 전략과 최적화 =====
console.log('\n💾 5. 캐싱 최적화');

class CacheOptimizer {
    constructor() {
        this.memoryCache = new Map();
        this.lruCache = new Map();
        this.maxCacheSize = 1000;
    }
    
    // LRU (Least Recently Used) 캐시
    lruGet(key) {
        if (this.lruCache.has(key)) {
            const value = this.lruCache.get(key);
            // 재사용된 항목을 맨 뒤로 이동
            this.lruCache.delete(key);
            this.lruCache.set(key, value);
            return value;
        }
        return null;
    }
    
    lruSet(key, value) {
        if (this.lruCache.has(key)) {
            this.lruCache.delete(key);
        } else if (this.lruCache.size >= this.maxCacheSize) {
            // 가장 오래된 항목 제거
            const firstKey = this.lruCache.keys().next().value;
            this.lruCache.delete(firstKey);
        }
        
        this.lruCache.set(key, value);
    }
    
    // TTL (Time To Live) 캐시
    createTTLCache(defaultTTL = 300000) { // 5분 기본 TTL
        const cache = new Map();
        
        return {
            set(key, value, ttl = defaultTTL) {
                const expireAt = Date.now() + ttl;
                cache.set(key, { value, expireAt });
            },
            
            get(key) {
                const item = cache.get(key);
                if (!item) return null;
                
                if (Date.now() > item.expireAt) {
                    cache.delete(key);
                    return null;
                }
                
                return item.value;
            },
            
            clear() {
                cache.clear();
            },
            
            // 만료된 항목 정리
            cleanup() {
                const now = Date.now();
                for (const [key, item] of cache.entries()) {
                    if (now > item.expireAt) {
                        cache.delete(key);
                    }
                }
            }
        };
    }
    
    // HTTP 캐시 시뮬레이션
    async fetchWithCache(url, options = {}) {
        const cacheKey = `${url}${JSON.stringify(options)}`;
        const cached = this.lruGet(cacheKey);
        
        if (cached) {
            console.log('캐시에서 반환:', url);
            return cached;
        }
        
        try {
            // 실제 환경에서는 fetch 사용
            const response = await this.simulateFetch(url, options);
            this.lruSet(cacheKey, response);
            console.log('네트워크에서 가져옴:', url);
            return response;
        } catch (error) {
            console.error('Fetch 에러:', error);
            throw error;
        }
    }
    
    // Fetch 시뮬레이션
    simulateFetch(url) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    url, 
                    data: `데이터 from ${url}`, 
                    timestamp: Date.now() 
                });
            }, Math.random() * 1000 + 500);
        });
    }
}

const cacheOptimizer = new CacheOptimizer();
const ttlCache = cacheOptimizer.createTTLCache(10000); // 10초 TTL

// 캐시 테스트
ttlCache.set('user:123', { name: '김개발', role: 'developer' });
console.log('TTL 캐시 테스트:', ttlCache.get('user:123'));

// ===== 6. 비동기 처리 최적화 =====
console.log('\n⚡ 6. 비동기 처리 최적화');

class AsyncOptimizer {
    constructor() {
        this.requestQueue = [];
        this.batchSize = 10;
        this.batchDelay = 100;
    }
    
    // 요청 배치 처리
    batchRequests(requestFn) {
        return new Promise((resolve) => {
            this.requestQueue.push({ requestFn, resolve });
            
            if (this.requestQueue.length === 1) {
                setTimeout(() => this.processBatch(), this.batchDelay);
            }
        });
    }
    
    async processBatch() {
        const batch = this.requestQueue.splice(0, this.batchSize);
        const promises = batch.map(({ requestFn }) => requestFn());
        
        try {
            const results = await Promise.allSettled(promises);
            batch.forEach(({ resolve }, index) => {
                resolve(results[index]);
            });
        } catch (error) {
            console.error('배치 처리 에러:', error);
        }
        
        // 큐에 더 있으면 계속 처리
        if (this.requestQueue.length > 0) {
            setTimeout(() => this.processBatch(), this.batchDelay);
        }
    }
    
    // 동시 요청 제한
    async limitConcurrency(tasks, limit = 3) {
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
    
    // 지수 백오프 재시도
    async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) break;
                
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`재시도 ${attempt + 1}/${maxRetries} (${delay}ms 후)`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    }
}

const asyncOptimizer = new AsyncOptimizer();

// 비동기 최적화 테스트
const testTasks = Array.from({ length: 20 }, (_, i) => 
    () => new Promise(resolve => 
        setTimeout(() => resolve(`Task ${i} 완료`), Math.random() * 1000)
    )
);

asyncOptimizer.limitConcurrency(testTasks, 5).then(results => {
    console.log('동시성 제한 테스트 완료:', results.length, '개 작업');
});

// ===== 7. 실무 성능 모니터링 =====
console.log('\n📊 7. 성능 모니터링');

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
    }
    
    // 함수 실행 시간 측정
    measureFunction(name, fn) {
        return async function(...args) {
            const start = performance.now();
            const result = await fn.apply(this, args);
            const end = performance.now();
            
            console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }
    
    // 메모리 사용량 모니터링
    measureMemory() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
            };
        }
        return null;
    }
    
    // FPS 모니터링
    startFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        
        const countFPS = () => {
            frames++;
            const now = performance.now();
            
            if (now >= lastTime + 1000) {
                console.log(`📈 FPS: ${frames}`);
                frames = 0;
                lastTime = now;
            }
            
            requestAnimationFrame(countFPS);
        };
        
        countFPS();
    }
    
    // 성능 마크 및 측정
    startMark(name) {
        performance.mark(`${name}-start`);
    }
    
    endMark(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        console.log(`📏 ${name}: ${measure.duration.toFixed(2)}ms`);
        
        return measure.duration;
    }
    
    // 리소스 로딩 성능 분석
    analyzeResourceLoading() {
        const resources = performance.getEntriesByType('resource');
        const analysis = {
            total: resources.length,
            byType: {},
            slow: []
        };
        
        resources.forEach(resource => {
            const type = resource.name.split('.').pop() || 'unknown';
            analysis.byType[type] = (analysis.byType[type] || 0) + 1;
            
            if (resource.duration > 1000) { // 1초 이상
                analysis.slow.push({
                    name: resource.name,
                    duration: Math.round(resource.duration)
                });
            }
        });
        
        return analysis;
    }
}

const performanceMonitor = new PerformanceMonitor();

// 성능 테스트 함수
const slowFunction = performanceMonitor.measureFunction('느린함수', () => {
    return new Promise(resolve => {
        // CPU 집약적 작업 시뮬레이션
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.random();
        }
        resolve(result);
    });
});

// 성능 테스트 실행
slowFunction().then(() => {
    const memoryInfo = performanceMonitor.measureMemory();
    if (memoryInfo) {
        console.log('메모리 사용량:', memoryInfo);
    }
});

// 정리 함수
function cleanup() {
    memoryManager.cleanup();
    console.log('🧹 모든 리소스 정리 완료');
}

// 페이지 언로드 시 정리
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
}

console.log('\n✅ JavaScript 성능 최적화 학습 완료! 빠르고 효율적인 코드의 달인이 되었습니다! 🏃‍♂️💨');
