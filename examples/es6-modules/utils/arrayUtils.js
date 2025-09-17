/**
 * 배열 유틸리티 모듈
 * ES6+ 최신 기능들 활용
 */

// 구조 분해 할당과 스프레드 연산자
export function mergeArrays(...arrays) {
    return [...new Set([].concat(...arrays))]; // 중복 제거된 병합
}

// 템플릿 리터럴 활용
export function formatArray(arr, separator = ', ') {
    return `[${arr.join(separator)}]`;
}

// 고차 함수와 화살표 함수
export const arrayOperations = {
    // 배열에서 특정 조건의 요소들 필터링
    filterBy: (arr, predicate) => arr.filter(predicate),
    
    // 배열 요소들을 특정 방식으로 변환
    mapWith: (arr, transformer) => arr.map(transformer),
    
    // 배열을 특정 값으로 축약
    reduceWith: (arr, reducer, initialValue) => 
        arr.reduce(reducer, initialValue),
    
    // 배열을 그룹핑
    groupBy: (arr, keyGetter) => {
        return arr.reduce((groups, item) => {
            const key = keyGetter(item);
            groups[key] = groups[key] || [];
            groups[key].push(item);
            return groups;
        }, {});
    }
};

// 옵셔널 체이닝과 널 병합 연산자 활용
export function safeArrayAccess(arr, index, fallback = null) {
    return arr?.[index] ?? fallback;
}

// Promise와 async/await를 활용한 배열 처리
export async function processArrayAsync(arr, asyncProcessor) {
    const results = [];
    for (const item of arr) {
        const result = await asyncProcessor(item);
        results.push(result);
    }
    return results;
}

// 제너레이터 함수
export function* chunkArray(arr, chunkSize) {
    for (let i = 0; i < arr.length; i += chunkSize) {
        yield arr.slice(i, i + chunkSize);
    }
}

// Map과 Set을 활용한 유틸리티
export class ArrayManager {
    constructor() {
        this.cache = new Map();
        this.processed = new Set();
    }
    
    // 캐시된 배열 처리
    processWithCache(arr, processor, cacheKey) {
        if (this.cache.has(cacheKey)) {
            console.log('캐시에서 반환:', cacheKey);
            return this.cache.get(cacheKey);
        }
        
        const result = processor(arr);
        this.cache.set(cacheKey, result);
        this.processed.add(cacheKey);
        
        return result;
    }
    
    // 처리된 키들 확인
    getProcessedKeys() {
        return Array.from(this.processed);
    }
    
    // 캐시 정리
    clearCache() {
        this.cache.clear();
        this.processed.clear();
    }
}
