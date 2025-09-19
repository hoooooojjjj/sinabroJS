# 함수형 프로그래밍(Functional Programming)

## 🎯 학습 목표
- 함수형 프로그래밍 패러다임의 핵심 개념 완전 이해
- 순수함수, 불변성, 함수 합성의 실무 활용법 습득
- 고차함수와 커링을 통한 재사용 가능한 코드 작성
- Maybe/Either 모나드를 활용한 안전한 에러 처리

## 🧮 함수형 프로그래밍 핵심 원칙

### 1. 순수함수 (Pure Functions)
```javascript
// ✅ 순수함수: 같은 입력 → 같은 출력, 부수효과 없음
const pureAdd = (a, b) => a + b;

// ❌ 비순수함수: 외부 상태 의존, 부수효과 있음
let count = 0;
const impureIncrement = () => ++count;
```

### 2. 불변성 (Immutability)
```javascript
// ✅ 불변적 접근
const addItem = (array, item) => [...array, item];

// ❌ 가변적 접근
const mutableAdd = (array, item) => { array.push(item); return array; };
```

### 3. 고차함수 (Higher-Order Functions)
```javascript
// 함수를 인자로 받거나 함수를 반환하는 함수
const createMultiplier = factor => number => number * factor;
const double = createMultiplier(2);
const triple = createMultiplier(3);
```

## 🔧 핵심 기법들

### 커링 (Currying)
```javascript
// 다중 인자 함수를 단일 인자 함수들의 체인으로 변환
const curriedMultiply = a => b => c => a * b * c;

// 부분 적용으로 재사용성 증가
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);
```

### 함수 합성 (Function Composition)
```javascript
const compose = (...fns) => value => 
    fns.reduceRight((acc, fn) => fn(acc), value);

const pipe = (...fns) => value => 
    fns.reduce((acc, fn) => fn(acc), value);

// 데이터 처리 파이프라인
const processData = pipe(
    validateInput,
    transformData,
    saveToDatabase
);
```

## 🛡️ 함수형 에러 처리

### Maybe 모나드
```javascript
class Maybe {
    static of(value) { return new Maybe(value); }
    static none() { return new Maybe(null); }
    
    map(fn) {
        return this.isNone() ? Maybe.none() : Maybe.of(fn(this.value));
    }
    
    getOrElse(defaultValue) {
        return this.isNone() ? defaultValue : this.value;
    }
}

// 안전한 체이닝
const result = Maybe.of('42')
    .map(str => parseInt(str))
    .map(num => num * 2)
    .getOrElse(0);
```

### Either 모나드
```javascript
// 성공(Right) 또는 실패(Left)를 표현
const validateEmail = email => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? Either.right(email)
        : Either.left('Invalid email format');
```

## 💼 실무 활용 패턴

### 1. 데이터 변환 파이프라인
```javascript
const processUsers = pipe(
    users => users.filter(user => user.active),
    users => users.map(user => ({ ...user, fullName: `${user.firstName} ${user.lastName}` })),
    users => users.sort((a, b) => a.createdAt - b.createdAt)
);
```

### 2. 조건부 실행
```javascript
const when = (predicate, fn) => value => 
    predicate(value) ? fn(value) : value;

const addDiscountIfEligible = when(
    user => user.isPremium,
    user => ({ ...user, discount: 0.1 })
);
```

### 3. 로깅과 디버깅
```javascript
const tap = fn => value => {
    fn(value);
    return value;
};

const processWithLogging = pipe(
    validateInput,
    tap(data => console.log('After validation:', data)),
    transformData,
    tap(data => console.log('After transformation:', data)),
    saveData
);
```

## 🚀 실행 방법
```bash
node functional-core.js
```

## 🆚 함수형 vs 객체지향 비교

| 측면 | 함수형 | 객체지향 |
|------|--------|----------|
| 데이터와 기능 | 분리 | 캡슐화 |
| 상태 관리 | 불변 | 가변 |
| 문제 해결 | 함수 합성 | 상속과 다형성 |
| 재사용성 | 고차함수 | 클래스 상속 |

## 🏆 함수형 프로그래밍의 장점

### 1. 예측 가능성
- 순수함수는 같은 입력에 대해 항상 같은 출력 보장
- 부수효과가 없어 디버깅이 쉬움

### 2. 테스트 용이성
```javascript
// 순수함수는 테스트하기 매우 쉬움
const add = (a, b) => a + b;
assert(add(2, 3) === 5); // 항상 성공
```

### 3. 병렬 처리 안전성
- 불변 데이터는 동시성 문제 없음
- 스레드 안전 보장

### 4. 모듈성과 재사용성
```javascript
// 작은 순수함수들을 조합하여 복잡한 기능 구현
const processUser = pipe(
    validateUser,
    normalizeData,
    enrichUserData,
    saveUser
);
```

## 🛠 실무 도구들

### 1. Lodash/FP
```javascript
import { pipe, map, filter, groupBy } from 'lodash/fp';

const processData = pipe(
    filter({ active: true }),
    map('name'),
    groupBy('department')
);
```

### 2. Ramda
```javascript
import R from 'ramda';

const processUsers = R.pipe(
    R.filter(R.prop('active')),
    R.map(R.pick(['id', 'name', 'email'])),
    R.sortBy(R.prop('name'))
);
```

## 📚 추천 학습 순서
1. **순수함수와 불변성** - 기초 개념 이해
2. **고차함수** - map, filter, reduce 완전 이해
3. **함수 합성** - pipe와 compose 패턴
4. **커링과 부분 적용** - 재사용 가능한 함수 작성
5. **모나드 패턴** - 안전한 에러 처리
6. **실무 적용** - 기존 코드를 함수형으로 리팩토링

## 💡 실무 적용 팁

### 점진적 도입
```javascript
// 1단계: 순수함수로 유틸리티 작성
const formatCurrency = amount => `$${amount.toLocaleString()}`;

// 2단계: 고차함수로 데이터 처리
const processProducts = products => 
    products
        .filter(p => p.inStock)
        .map(p => ({ ...p, displayPrice: formatCurrency(p.price) }));

// 3단계: 함수 합성으로 파이프라인 구축
const productPipeline = pipe(
    filterInStock,
    addDisplayPrice,
    sortByPrice
);
```

## 🎯 마스터 체크리스트
- [ ] 순수함수와 비순수함수를 구분할 수 있다
- [ ] 불변성을 유지하며 데이터를 변환한다
- [ ] 고차함수를 자유자재로 활용한다
- [ ] 커링과 부분 적용으로 재사용 가능한 함수를 만든다
- [ ] 함수 합성으로 복잡한 로직을 조합한다
- [ ] Maybe/Either 모나드로 안전한 에러 처리를 한다
- [ ] 실무 프로젝트에 함수형 패턴을 적용한다
