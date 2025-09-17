/**
 * ES6+ 최신 JavaScript 기능들 종합 예제
 * 
 * 구조 분해 할당, 스프레드 연산자, 템플릿 리터럴, 옵셔널 체이닝,
 * 널 병합 연산자, 동적 import 등 모던 JavaScript의 핵심 기능들을 
 * 실무 관점에서 학습합니다.
 */

// 모듈 import (정적)
import power, { 
    add, 
    multiply, 
    Calculator,
    PI as MATH_PI 
} from './utils/mathUtils.js';

import { 
    mergeArrays,
    arrayOperations,
    ArrayManager,
    chunkArray 
} from './utils/arrayUtils.js';

console.log('🎯 ES6+ 최신 기능 학습 시작!');

// ===== 1. 구조 분해 할당 (Destructuring) =====
console.log('\n📦 1. 구조 분해 할당');

// 배열 구조 분해
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log('배열 구조 분해:', { first, second, rest });

// 객체 구조 분해 (기본값, 별칭 사용)
const user = {
    name: '김개발',
    age: 28,
    address: {
        city: '서울',
        district: '강남구'
    }
};

const { 
    name, 
    age, 
    email = 'no-email@example.com', // 기본값
    address: { city, district } // 중첩 구조 분해
} = user;

console.log('객체 구조 분해:', { name, age, email, city, district });

// 함수 매개변수 구조 분해
function createProfile({ name, age, skills = [] }) {
    return {
        profile: `${name} (${age}세)`,
        skillCount: skills.length,
        hasSkills: skills.length > 0
    };
}

const profile = createProfile({
    name: '이개발',
    age: 25,
    skills: ['JavaScript', 'TypeScript', 'React']
});

console.log('함수 매개변수 구조 분해:', profile);

// ===== 2. 스프레드 연산자 (Spread Operator) =====
console.log('\n🌟 2. 스프레드 연산자');

// 배열 스프레드
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2, 7, 8];
console.log('배열 병합:', merged);

// 객체 스프레드
const baseConfig = {
    host: 'localhost',
    port: 3000,
    ssl: false
};

const productionConfig = {
    ...baseConfig,
    host: 'production.server.com',
    ssl: true,
    cache: true
};

console.log('객체 병합:', productionConfig);

// 함수 인수 스프레드
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log('가변 인수 합계:', sum(1, 2, 3, 4, 5));

// ===== 3. 템플릿 리터럴 (Template Literals) =====
console.log('\n📝 3. 템플릿 리터럴');

const product = {
    name: 'MacBook Pro',
    price: 2500000,
    discount: 0.1
};

const finalPrice = product.price * (1 - product.discount);

// 멀티라인 템플릿
const productInfo = `
📱 상품 정보
--------------
제품명: ${product.name}
원가: ${product.price.toLocaleString()}원
할인율: ${(product.discount * 100)}%
최종가: ${finalPrice.toLocaleString()}원

${finalPrice < 2000000 ? '✅ 특가 상품!' : '💰 프리미엄 상품'}
`;

console.log(productInfo);

// 태그드 템플릿 리터럴
function highlight(strings, ...values) {
    return strings
        .map((str, i) => `${str}${values[i] ? `**${values[i]}**` : ''}`)
        .join('');
}

const highlighted = highlight`안녕하세요! 저는 ${name}이고, ${age}살입니다.`;
console.log('태그드 템플릿:', highlighted);

// ===== 4. 옵셔널 체이닝과 널 병합 연산자 =====
console.log('\n🔗 4. 옵셔널 체이닝 & 널 병합 연산자');

const apiResponse = {
    user: {
        profile: {
            name: '박개발',
            settings: {
                theme: 'dark'
            }
        }
    }
};

// 옵셔널 체이닝으로 안전한 프로퍼티 접근
const theme = apiResponse?.user?.profile?.settings?.theme;
const language = apiResponse?.user?.profile?.settings?.language; // undefined

console.log('옵셔널 체이닝:', { theme, language });

// 널 병합 연산자로 기본값 설정
const userTheme = theme ?? 'light';
const userLanguage = language ?? 'ko';

console.log('널 병합 연산자:', { userTheme, userLanguage });

// 배열과 함수에서도 사용 가능
const users = apiResponse?.users?.map?.(u => u.name) ?? [];
console.log('배열 옵셔널 체이닝:', users);

// ===== 5. Symbol과 Map/Set =====
console.log('\n🔧 5. Symbol과 Map/Set');

// Symbol - 유니크한 식별자
const LOG_LEVEL = {
    DEBUG: Symbol('debug'),
    INFO: Symbol('info'),
    ERROR: Symbol('error')
};

class Logger {
    constructor() {
        this.logs = new Map();
    }
    
    log(level, message) {
        if (!this.logs.has(level)) {
            this.logs.set(level, []);
        }
        this.logs.get(level).push({
            message,
            timestamp: new Date().toISOString()
        });
    }
    
    getLogs(level) {
        return this.logs.get(level) ?? [];
    }
    
    getAllLevels() {
        return Array.from(this.logs.keys());
    }
}

const logger = new Logger();
logger.log(LOG_LEVEL.INFO, '애플리케이션 시작');
logger.log(LOG_LEVEL.ERROR, '데이터베이스 연결 실패');
logger.log(LOG_LEVEL.DEBUG, '변수 값 확인');

console.log('로그 레벨들:', logger.getAllLevels().length);
console.log('에러 로그:', logger.getLogs(LOG_LEVEL.ERROR));

// Set을 활용한 중복 제거
const skills = new Set(['JavaScript', 'TypeScript', 'React', 'Node.js', 'React']);
console.log('중복 제거된 스킬:', Array.from(skills));

// ===== 6. 클래스와 상속 (ES6+) =====
console.log('\n🏛️ 6. 모던 클래스');

class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
    }
    
    emit(event, ...args) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }
    
    off(event, callback) {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }
}

class DataStore extends EventEmitter {
    constructor() {
        super();
        this.data = new Map();
    }
    
    set(key, value) {
        const oldValue = this.data.get(key);
        this.data.set(key, value);
        this.emit('dataChanged', { key, value, oldValue });
    }
    
    get(key) {
        return this.data.get(key);
    }
}

const store = new DataStore();
store.on('dataChanged', ({ key, value }) => {
    console.log(`데이터 변경: ${key} = ${value}`);
});

store.set('user', '김개발');
store.set('theme', 'dark');

// ===== 7. 동적 Import (Dynamic Import) =====
console.log('\n⚡ 7. 동적 Import');

async function loadFeature(featureName) {
    try {
        console.log(`${featureName} 기능을 동적으로 로딩 중...`);
        
        // 실제 환경에서는 동적 import 사용
        // const module = await import(`./features/${featureName}.js`);
        
        // 예제를 위한 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockModule = {
            default: function(data) {
                return `${featureName} 기능이 ${data}를 처리했습니다.`;
            }
        };
        
        console.log(`${featureName} 기능 로딩 완료!`);
        return mockModule.default;
        
    } catch (error) {
        console.error(`${featureName} 기능 로딩 실패:`, error.message);
        throw error;
    }
}

// 동적 로딩 사용
loadFeature('analytics').then(analyticsFeature => {
    const result = analyticsFeature('사용자 데이터');
    console.log('동적 로딩 결과:', result);
});

// ===== 8. 실무 패턴: 모던 유틸리티 클래스 =====
console.log('\n💼 8. 실무 패턴');

class ModernUtils {
    // 정적 메서드들
    static debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Pipe 함수 - 함수형 프로그래밍
    static pipe(...functions) {
        return (value) => functions.reduce((acc, fn) => fn(acc), value);
    }
    
    // 깊은 복사
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

// 파이프 함수 사용 예제
const processNumber = ModernUtils.pipe(
    x => x * 2,           // 2배
    x => x + 10,          // +10
    x => x.toString(),    // 문자열 변환
    x => `결과: ${x}`     // 템플릿 적용
);

console.log('파이프 함수:', processNumber(5)); // "결과: 20"

// 디바운스 함수 테스트
const debouncedLog = ModernUtils.debounce(
    (message) => console.log('디바운스 실행:', message),
    1000
);

debouncedLog('첫 번째 호출');
debouncedLog('두 번째 호출'); // 이것만 실행됨

setTimeout(() => {
    console.log('\n✅ ES6+ 최신 기능 학습 완료! 모던 JavaScript 마스터! 🚀');
}, 2000);
