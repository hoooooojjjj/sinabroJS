# 고급 JavaScript 개념과 메타프로그래밍

## 🎯 학습 목표
- Proxy와 Reflect를 활용한 메타프로그래밍 마스터
- Symbol의 고급 활용법과 Well-known Symbols 이해
- Iterator와 Generator를 통한 지연 평가와 커스텀 이터러블 구현
- WeakMap, WeakSet을 활용한 메모리 효율적 프로그래밍
- ArrayBuffer와 TypedArray로 바이너리 데이터 처리
- 정규표현식 고급 기법과 최신 기능 활용
- JavaScript 엔진의 최적화 메커니즘 이해

## 🔮 Proxy와 Reflect - 메타프로그래밍의 핵심

### 기본 Proxy 트랩들
```javascript
const proxyHandler = {
  get(target, property, receiver) {
    console.log(`접근: ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
  
  set(target, property, value, receiver) {
    console.log(`설정: ${String(property)} = ${value}`);
    // 타입 검증 등 추가 로직 가능
    return Reflect.set(target, property, value, receiver);
  },
  
  has(target, property) {
    return Reflect.has(target, property);
  },
  
  deleteProperty(target, property) {
    return Reflect.deleteProperty(target, property);
  }
};

const proxiedObject = new Proxy(targetObject, proxyHandler);
```

### 실무 활용 패턴

#### 1. 유효성 검증 프록시
```javascript
function createValidator(schema) {
  return new Proxy({}, {
    set(target, property, value) {
      const rule = schema[property];
      if (rule && !rule(value)) {
        throw new Error(`검증 실패: ${String(property)}`);
      }
      return Reflect.set(target, property, value);
    }
  });
}

const userValidator = createValidator({
  name: (v) => typeof v === 'string' && v.length > 0,
  age: (v) => typeof v === 'number' && v >= 0
});
```

#### 2. API 캐싱 프록시
```javascript
function createCachedAPI() {
  const cache = new Map();
  
  return new Proxy(function() {}, {
    get(target, method) {
      return (...args) => {
        const key = `${String(method)}:${JSON.stringify(args)}`;
        if (cache.has(key)) {
          return cache.get(key);
        }
        
        const result = callAPI(method, args);
        cache.set(key, result);
        return result;
      };
    }
  });
}
```

## 🔯 Symbol - 유니크한 식별자

### Well-known Symbols 활용

#### Symbol.iterator
```javascript
class CustomIterable {
  constructor(data) {
    this.data = data;
  }
  
  *[Symbol.iterator]() {
    for (const item of this.data) {
      yield item.toUpperCase();
    }
  }
}

const iterable = new CustomIterable(['a', 'b', 'c']);
for (const item of iterable) {
  console.log(item); // A, B, C
}
```

#### Symbol.toStringTag
```javascript
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

console.log(new MyClass().toString()); // [object MyClass]
```

### 프라이빗 속성 구현
```javascript
const privateKey = Symbol('private');

class SecureClass {
  constructor() {
    this[privateKey] = 'private data';
    this.publicData = 'public data';
  }
  
  getPrivateData() {
    return this[privateKey];
  }
}
```

## 🌀 Iterator와 Generator

### 커스텀 Iterator 구현
```javascript
class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

const range = new NumberRange(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]
```

### Generator 함수 활용

#### 지연 평가 체이닝
```javascript
function* filter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) yield item;
  }
}

function* map(iterable, mapper) {
  for (const item of iterable) {
    yield mapper(item);
  }
}

function* take(iterable, count) {
  let taken = 0;
  for (const item of iterable) {
    if (taken >= count) break;
    yield item;
    taken++;
  }
}

// 사용 예제
const fibonacci = function* () {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
};

const result = [...take(
  map(
    filter(fibonacci(), n => n % 2 === 0),
    n => n * n
  ),
  5
)];
```

#### 비동기 Generator
```javascript
async function* asyncDataGenerator() {
  for (let i = 1; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield `Data ${i}`;
  }
}

// 사용법
for await (const data of asyncDataGenerator()) {
  console.log(data);
}
```

## 💾 WeakMap과 WeakSet

### 프라이빗 데이터 관리
```javascript
const privateData = new WeakMap();

class SecureUser {
  constructor(name, password) {
    this.name = name;
    privateData.set(this, { password, attempts: 0 });
  }
  
  authenticate(password) {
    const data = privateData.get(this);
    return data.password === password;
  }
  
  // 객체가 GC되면 privateData도 자동으로 정리됨
}
```

### 객체 태깅과 상태 추적
```javascript
const processedObjects = new WeakSet();

function processIfNeeded(obj) {
  if (processedObjects.has(obj)) {
    return; // 이미 처리됨
  }
  
  // 처리 로직
  processObject(obj);
  processedObjects.add(obj);
}
```

## 💿 바이너리 데이터 처리

### ArrayBuffer와 DataView
```javascript
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);

// 다양한 타입 저장
view.setUint32(0, 0x12345678);
view.setFloat32(4, 3.14159);
view.setUint16(8, 0xABCD);

// 읽기
console.log(view.getUint32(0).toString(16)); // 12345678
console.log(view.getFloat32(4)); // 3.1415901184082031
```

### TypedArray 활용
```javascript
// 효율적인 숫자 배열 처리
const int32Array = new Int32Array(1000);
int32Array[0] = 1000000;

// 기존 배열보다 메모리 효율적
const float32Array = new Float32Array([1.1, 2.2, 3.3]);
console.log(float32Array.buffer.byteLength); // 12 bytes
```

## 🔍 고급 정규표현식

### Named Capture Groups
```javascript
const pattern = /^(?<username>\w+)@(?<domain>[\w.-]+)$/;
const match = 'user@example.com'.match(pattern);
console.log(match.groups.username); // 'user'
console.log(match.groups.domain);   // 'example.com'
```

### Lookbehind와 Lookahead
```javascript
// 비밀번호 검증: 8자 이상, 대소문자+숫자+특수문자 포함
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

console.log(passwordPattern.test('Weak1')); // false
console.log(passwordPattern.test('Strong1!')); // true
```

### Unicode Property Escapes
```javascript
const emojiPattern = /\p{Emoji}/gu;
const text = 'Hello 👋 World 🌍!';
const emojis = text.match(emojiPattern);
console.log(emojis); // ['👋', '🌍']
```

## 🧙‍♂️ 메타프로그래밍 패턴

### Mixin 패턴
```javascript
const Flyable = {
  fly() { return `${this.name} is flying`; }
};

const Swimmable = {
  swim() { return `${this.name} is swimming`; }
};

function applyMixins(BaseClass, ...mixins) {
  mixins.forEach(mixin => {
    Object.getOwnPropertyNames(mixin).forEach(name => {
      if (name !== 'constructor') {
        BaseClass.prototype[name] = mixin[name];
      }
    });
  });
}

class Duck {
  constructor(name) { this.name = name; }
}

applyMixins(Duck, Flyable, Swimmable);
```

### 동적 클래스 생성
```javascript
function createClass(className, properties, methods = {}) {
  const ClassConstructor = {
    [className]: function(data = {}) {
      properties.forEach(prop => {
        this[prop] = data[prop] || null;
      });
    }
  }[className];
  
  Object.keys(methods).forEach(methodName => {
    ClassConstructor.prototype[methodName] = methods[methodName];
  });
  
  return ClassConstructor;
}

const User = createClass('User', ['name', 'email'], {
  greet() { return `Hello, ${this.name}!`; }
});
```

## ⚙️ JavaScript 엔진 최적화

### Hidden Classes 최적화
```javascript
// ✅ 좋은 패턴 - 같은 구조로 객체 생성
function createPoint(x, y) {
  return { x, y }; // 항상 같은 순서
}

// ❌ 나쁜 패턴 - 다른 구조의 객체들
function badPattern(useZ) {
  const obj = { x: 1, y: 2 };
  if (useZ) obj.z = 3; // Hidden class 변경 발생
  return obj;
}
```

### JIT 최적화를 위한 단형성 함수
```javascript
// ✅ 단형성 함수 - 항상 같은 타입 처리
function monomorphicSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]; // 항상 숫자만
  }
  return sum;
}

// ❌ 다형성 함수 - JIT 최적화 어려움
function polymorphicSum(items) {
  let sum = 0;
  for (const item of items) {
    sum += typeof item === 'number' ? item : parseFloat(item);
  }
  return sum;
}
```

### Object Pool 패턴
```javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    
    // 미리 객체 생성
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire() {
    return this.pool.pop() || this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 사용 예제
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (vec) => { vec.x = 0; vec.y = 0; }
);
```

## 🚀 실행 방법
```bash
node advanced-javascript.js
```

## 📊 성능 측정 도구

### 커스텀 프로파일러
```javascript
class PerformanceProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }
  
  profile(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    this.measures.set(name, end - start);
    console.log(`${name}: ${(end - start).toFixed(3)}ms`);
    return result;
  }
  
  getReport() {
    const report = {};
    this.measures.forEach((duration, name) => {
      report[name] = `${duration.toFixed(3)}ms`;
    });
    return report;
  }
}

// 사용법
const profiler = new PerformanceProfiler();
const result = profiler.profile('heavy-computation', () => {
  return Array.from({length: 1000000}, (_, i) => i * i);
});
```

## 💡 실무 활용 팁

### 1. Proxy 사용 시 주의사항
- 성능 오버헤드가 있으므로 핫스팟에서는 신중히 사용
- 모든 트랩을 구현할 필요 없음, 필요한 것만 구현
- Reflect 사용으로 기본 동작 보장

### 2. Symbol 활용 전략
- 프라이빗 속성에는 Symbol 사용
- 전역 공유가 필요한 경우 Symbol.for() 사용
- Well-known Symbol로 내장 동작 커스터마이징

### 3. Generator 최적화
- 무한 시퀀스 처리에 Generator 활용
- 메모리 효율적인 데이터 스트림 처리
- async/await와 결합한 비동기 스트림

### 4. WeakMap/WeakSet 활용
- 메모리 누수 방지가 중요한 상황에서 사용
- DOM 노드와 연관 데이터 저장
- 객체 태깅과 상태 추적

## 🏆 고급 개념 마스터 체크리스트
- [ ] Proxy와 Reflect로 메타프로그래밍을 구현할 수 있다
- [ ] Symbol을 활용하여 프라이빗 속성과 고유 식별자를 만든다
- [ ] Iterator와 Generator로 커스텀 이터러블을 구현한다
- [ ] WeakMap/WeakSet으로 메모리 효율적인 코드를 작성한다
- [ ] ArrayBuffer와 TypedArray로 바이너리 데이터를 처리한다
- [ ] 고급 정규표현식으로 복잡한 패턴 매칭을 한다
- [ ] JavaScript 엔진의 최적화를 이해하고 활용한다
- [ ] 메타프로그래밍 패턴으로 동적이고 유연한 코드를 작성한다
