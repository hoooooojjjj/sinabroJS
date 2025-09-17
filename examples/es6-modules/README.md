# ES6+ 모던 JavaScript 기능들

## 🎯 학습 목표
- ES6부터 최신 JavaScript까지의 핵심 기능 완전 마스터
- 모듈 시스템과 import/export 패턴 이해
- 구조 분해 할당, 스프레드 연산자 등 최신 문법 활용
- 실무에서 바로 쓸 수 있는 모던 패턴들 습득

## 📁 파일 구조
```
es6-modules/
├── modern-features.js        # 최신 기능 종합 예제
├── utils/
│   ├── mathUtils.js         # 수학 유틸리티 (export 패턴)
│   └── arrayUtils.js        # 배열 유틸리티 (ES6+ 활용)
└── README.md
```

## 🚀 주요 학습 내용

### 1. 모듈 시스템 (ES Modules)

#### Named Export
```javascript
// 내보내기
export const PI = Math.PI;
export function add(a, b) { return a + b; }

// 가져오기
import { PI, add } from './mathUtils.js';
```

#### Default Export
```javascript
// 내보내기 (파일당 하나)
export default function power(base, exp) {
    return Math.pow(base, exp);
}

// 가져오기
import power from './mathUtils.js';
```

#### Mixed Export/Import
```javascript
// 혼합 사용
import power, { add, PI as MATH_PI } from './mathUtils.js';
```

### 2. 구조 분해 할당 (Destructuring)

#### 배열 구조 분해
```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first: 1, second: 2, rest: [3, 4, 5]
```

#### 객체 구조 분해
```javascript
const { name, age, email = 'default@email.com' } = user;
// 기본값 설정 가능
```

#### 함수 매개변수 구조 분해
```javascript
function createUser({ name, age, skills = [] }) {
    return { profile: `${name} (${age})`, skillCount: skills.length };
}
```

### 3. 스프레드 연산자 (Spread Operator)

| 용도 | 예제 | 설명 |
|------|------|------|
| 배열 병합 | `[...arr1, ...arr2]` | 여러 배열을 하나로 합침 |
| 객체 병합 | `{...obj1, ...obj2}` | 객체 속성 복사/덮어쓰기 |
| 함수 인수 | `func(...args)` | 배열을 개별 인수로 전달 |
| 가변 매개변수 | `function sum(...nums)` | 여러 인수를 배열로 받음 |

### 4. 템플릿 리터럴 (Template Literals)

```javascript
// 기본 사용
const message = `Hello, ${name}! You are ${age} years old.`;

// 멀티라인 문자열
const html = `
    <div class="card">
        <h2>${title}</h2>
        <p>${description}</p>
    </div>
`;

// 태그드 템플릿
function highlight(strings, ...values) {
    return strings.map((str, i) => 
        `${str}${values[i] ? `**${values[i]}**` : ''}`
    ).join('');
}
```

### 5. 옵셔널 체이닝 & 널 병합 연산자

```javascript
// 옵셔널 체이닝 (?.)
const theme = user?.profile?.settings?.theme;
const users = data?.users?.map?.(u => u.name);

// 널 병합 연산자 (??)
const userTheme = theme ?? 'light';  // null/undefined만 체크
const isActive = status ?? false;
```

### 6. 고급 객체 기능

#### Symbol
```javascript
const LOG_LEVELS = {
    DEBUG: Symbol('debug'),
    INFO: Symbol('info'),
    ERROR: Symbol('error')
};
```

#### Map & Set
```javascript
// Map - key-value 저장소 (any type key)
const userCache = new Map();
userCache.set('user1', { name: 'Kim' });

// Set - 유니크한 값들의 집합
const skills = new Set(['JS', 'TS', 'React']);
```

### 7. 클래스 고급 기능

```javascript
class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    
    on(event, callback) { /* ... */ }
    emit(event, ...args) { /* ... */ }
    off(event, callback) { /* ... */ }
}

// 상속
class DataStore extends EventEmitter {
    // 부모 클래스 기능 + 데이터 관리
}
```

### 8. 동적 Import

```javascript
// 조건부 모듈 로딩
async function loadFeature(name) {
    const module = await import(`./features/${name}.js`);
    return module.default;
}

// 코드 스플리팅에 유용
const analytics = await loadFeature('analytics');
```

## 🛠 실행 방법

### Node.js에서 실행
```bash
# package.json에 "type": "module" 추가 필요
node modern-features.js
```

### 브라우저에서 실행
```html
<script type="module" src="modern-features.js"></script>
```

## 💡 실무 활용 팁

### 성능 최적화
```javascript
// ✅ 구조 분해로 필요한 것만 추출
const { data } = await fetchAPI();

// ✅ 스프레드로 불변성 유지
const newState = { ...oldState, loading: false };

// ✅ 옵셔널 체이닝으로 안전한 접근
const value = deeply?.nested?.property;
```

### 코드 가독성 향상
```javascript
// ❌ 기존 방식
function createUser(name, age, email, skills) {
    email = email || 'default@email.com';
    skills = skills || [];
    // ...
}

// ✅ 모던 방식
function createUser({ name, age, email = 'default@email.com', skills = [] }) {
    // 훨씬 명확하고 안전함
}
```

### 모듈화 전략
```javascript
// utils/index.js - 배럴 익스포트
export { default as mathUtils } from './mathUtils.js';
export { default as arrayUtils } from './arrayUtils.js';
export { default as stringUtils } from './stringUtils.js';

// 사용하는 곳에서
import { mathUtils, arrayUtils } from './utils/index.js';
```

## 🏆 브라우저 지원

| 기능 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|---------|------|
| ES Modules | 61+ | 60+ | 10.1+ | 16+ |
| Optional Chaining | 80+ | 72+ | 13.1+ | 80+ |
| Nullish Coalescing | 80+ | 72+ | 13.1+ | 80+ |
| Dynamic Import | 63+ | 67+ | 11.1+ | 79+ |

## 🎯 마스터 체크리스트
- [ ] 모듈 import/export를 자유자재로 사용한다
- [ ] 구조 분해 할당으로 깔끔한 코드를 작성한다
- [ ] 스프레드 연산자로 불변성을 유지한다
- [ ] 템플릿 리터럴로 가독성 좋은 문자열을 만든다
- [ ] 옵셔널 체이닝으로 안전한 객체 접근을 한다
- [ ] Map, Set, Symbol 등 새로운 자료구조를 활용한다
- [ ] 동적 import로 코드 스플리팅을 구현한다
