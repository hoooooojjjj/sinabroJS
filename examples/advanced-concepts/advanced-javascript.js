// 1.1 기본 Proxy 사용법
const targetObject = {
  name: "JavaScript",
  version: "ES2024",
  features: ["proxy", "reflect"],
};

const proxyHandler = {
  get(target, property, receiver) {
    console.log(`✅ GET: ${String(property)} 속성에 접근`);

    // 존재하지 않는 속성에 대한 기본값 제공
    if (!(property in target)) {
      return `${String(property)} 속성은 존재하지 않습니다.`;
    }

    return Reflect.get(target, property, receiver);
  },

  set(target, property, value, receiver) {
    console.log(`✏️ SET: ${String(property)} = ${value}`);

    // 타입 검증
    if (property === "version" && typeof value !== "string") {
      throw new TypeError("version은 문자열이어야 합니다.");
    }

    return Reflect.set(target, property, value, receiver);
  },

  has(target, property) {
    console.log(`🔍 HAS: ${String(property)} 속성 존재 여부 확인`);
    return Reflect.has(target, property);
  },

  deleteProperty(target, property) {
    console.log(`🗑️ DELETE: ${String(property)} 속성 삭제`);
    if (property === "name") {
      console.log("❌ name 속성은 삭제할 수 없습니다.");
      return false;
    }
    return Reflect.deleteProperty(target, property);
  },
};

const proxiedObject = new Proxy(targetObject, proxyHandler);

// Proxy 테스트
console.log("Proxy 테스트:");
console.log(proxiedObject.name); // GET 트랩 실행
console.log(proxiedObject.unknownProperty); // 존재하지 않는 속성
proxiedObject.newProperty = "새로운 값"; // SET 트랩 실행
console.log("features" in proxiedObject); // HAS 트랩 실행

// 1.2 고급 Proxy 활용 - 함수 호출 가로채기
function createValidator(schema) {
  return new Proxy(
    {},
    {
      set(target, property, value) {
        const rule = schema[property];
        if (rule && !rule(value)) {
          throw new Error(`${String(property)} 검증 실패: ${value}`);
        }
        return Reflect.set(target, property, value);
      },
    }
  );
}

const userSchema = {
  name: (value) => typeof value === "string" && value.length > 0,
  age: (value) => typeof value === "number" && value >= 0 && value <= 150,
  email: (value) => typeof value === "string" && value.includes("@"),
};

const validatedUser = createValidator(userSchema);
try {
  validatedUser.name = "김개발";
  validatedUser.age = 30;
  validatedUser.email = "dev@example.com";
  console.log("검증 통과:", validatedUser);
} catch (error) {
  console.error("검증 실패:", error.message);
}

// 1.3 함수 Proxy - 메서드 호출 가로채기
function createAPI() {
  const cache = new Map();

  return new Proxy(function () {}, {
    get(target, property) {
      return function (...args) {
        const cacheKey = `${String(property)}:${JSON.stringify(args)}`;

        if (cache.has(cacheKey)) {
          console.log(`🎯 캐시 히트: ${String(property)}`);
          return cache.get(cacheKey);
        }

        // 실제 API 호출 시뮬레이션
        const result = `${String(property)} 결과: ${args.join(", ")}`;
        cache.set(cacheKey, result);
        console.log(`📡 API 호출: ${String(property)}`);

        return result;
      };
    },
  });
}

const api = createAPI();
console.log("API 테스트:");
console.log(api.getUser("123")); // API 호출
console.log(api.getUser("123")); // 캐시에서 반환
console.log(api.getPosts("user123")); // 새로운 API 호출

// ===== 2. Symbol - 유니크한 식별자 =====
console.log("\n🔯 2. Symbol의 힘");

// 2.1 기본 Symbol 사용법
const uniqueKey = Symbol("고유 키");
const anotherKey = Symbol("고유 키"); // 같은 설명이어도 다른 Symbol

console.log(uniqueKey === anotherKey); // false - 완전히 다른 값

// 객체의 은밀한 속성 생성
const secretData = Symbol("비밀 데이터");
const user = {
  name: "공개 이름",
  [secretData]: "비밀 정보",
};

console.log("일반 속성:", user.name);
console.log("Symbol 속성:", user[secretData]);
console.log("Object.keys로는 보이지 않음:", Object.keys(user));

// 2.2 Well-known Symbols 활용
class CustomIterable {
  constructor(data) {
    this.data = data;
  }

  // Symbol.iterator를 구현하여 for...of 가능하게 만들기
  *[Symbol.iterator]() {
    for (const item of this.data) {
      yield item.toUpperCase();
    }
  }

  // Symbol.toStringTag로 toString 결과 커스터마이징
  get [Symbol.toStringTag]() {
    return "CustomIterable";
  }

  // Symbol.hasInstance로 instanceof 동작 커스터마이징
  static [Symbol.hasInstance](instance) {
    return instance && typeof instance[Symbol.iterator] === "function";
  }
}

const customIterable = new CustomIterable(["hello", "world", "symbol"]);

console.log("for...of 테스트:");
for (const item of customIterable) {
  console.log(item); // HELLO, WORLD, SYMBOL
}

console.log("toString 테스트:", customIterable.toString());
console.log("instanceof 테스트:", customIterable instanceof CustomIterable);

// 2.3 Symbol Registry - 전역 Symbol 공유
const globalSymbol = Symbol.for("전역 심볼");
const sameGlobalSymbol = Symbol.for("전역 심볼");

console.log("전역 Symbol 테스트:", globalSymbol === sameGlobalSymbol); // true
console.log("Symbol 키 확인:", Symbol.keyFor(globalSymbol)); // "전역 심볼"

// ===== 3. Iterator와 Generator =====
console.log("\n🌀 3. Iterator와 Generator");

// 3.1 커스텀 Iterator 구현
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
      },
    };
  }
}

const range = new NumberRange(1, 5);
console.log("Iterator 테스트:");
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 3.2 Generator 함수 활용
function* infiniteSequence() {
  let num = 1;
  while (true) {
    yield num++;
  }
}

function* fibonacci() {
  let a = 0,
    b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Generator를 이용한 지연 평가
function* take(iterable, count) {
  let taken = 0;
  for (const item of iterable) {
    if (taken >= count) break;
    yield item;
    taken++;
  }
}

function* filter(iterable, predicate) {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* map(iterable, mapper) {
  for (const item of iterable) {
    yield mapper(item);
  }
}

console.log("Generator 체이닝 테스트:");
const fibSequence = fibonacci();
const evenFibs = filter(fibSequence, (n) => n % 2 === 0);
const squaredEvenFibs = map(evenFibs, (n) => n * n);
const first5 = take(squaredEvenFibs, 5);

for (const num of first5) {
  console.log(num); // 0, 4, 64, 1024, 28900
}

// 3.3 비동기 Generator
async function* asyncDataGenerator() {
  const data = ["첫 번째", "두 번째", "세 번째"];

  for (const item of data) {
    // 비동기 작업 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield `비동기 ${item} 데이터`;
  }
}

// 비동기 Iterator 사용
async function processAsyncData() {
  console.log("비동기 Generator 테스트:");
  for await (const data of asyncDataGenerator()) {
    console.log(data);
  }
}

// processAsyncData(); // 실제 실행은 주석 해제

// ===== 4. WeakMap과 WeakSet - 메모리 효율적 컬렉션 =====
console.log("\n💾 4. WeakMap과 WeakSet");

// 4.1 WeakMap을 이용한 프라이빗 데이터 구현
const privateData = new WeakMap();

class SecureUser {
  constructor(name, password) {
    this.name = name;
    // 비밀번호는 WeakMap에 저장
    privateData.set(this, { password, loginAttempts: 0 });
  }

  authenticate(password) {
    const data = privateData.get(this);
    if (data.password === password) {
      data.loginAttempts = 0;
      return true;
    } else {
      data.loginAttempts++;
      return false;
    }
  }

  getLoginAttempts() {
    return privateData.get(this).loginAttempts;
  }

  changePassword(oldPassword, newPassword) {
    const data = privateData.get(this);
    if (data.password === oldPassword) {
      data.password = newPassword;
      return true;
    }
    return false;
  }
}

const secureUser = new SecureUser("김보안", "secret123");
console.log("WeakMap 테스트:");
console.log("인증 성공:", secureUser.authenticate("secret123"));
console.log("인증 실패:", secureUser.authenticate("wrong"));
console.log("로그인 시도:", secureUser.getLoginAttempts());

// 4.2 WeakSet을 이용한 객체 태깅
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log("이미 처리된 객체입니다.");
    return;
  }

  // 객체 처리 로직
  console.log("객체 처리 중:", obj.name);
  processedObjects.add(obj);
}

const obj1 = { name: "객체1" };
const obj2 = { name: "객체2" };

console.log("WeakSet 테스트:");
processObject(obj1); // 첫 번째 처리
processObject(obj1); // 이미 처리됨
processObject(obj2); // 첫 번째 처리

// ===== 5. ArrayBuffer와 DataView - 바이너리 데이터 처리 =====
console.log("\n💿 5. 바이너리 데이터 처리");

// 5.1 ArrayBuffer로 바이너리 데이터 생성
const buffer = new ArrayBuffer(16); // 16바이트 버퍼
const view = new DataView(buffer);

// 다양한 타입의 데이터 저장
view.setUint32(0, 0x12345678); // 4바이트 정수
view.setFloat32(4, 3.14159); // 4바이트 실수
view.setUint16(8, 0xabcd); // 2바이트 정수
view.setUint8(10, 0xff); // 1바이트 정수

// 데이터 읽기
console.log("바이너리 데이터 읽기:");
console.log("Uint32:", view.getUint32(0).toString(16));
console.log("Float32:", view.getFloat32(4));
console.log("Uint16:", view.getUint16(8).toString(16));
console.log("Uint8:", view.getUint8(10).toString(16));

// 5.2 Typed Arrays 활용
const int32Array = new Int32Array(4);
int32Array[0] = 1000000;
int32Array[1] = -2000000;
int32Array[2] = 3000000;
int32Array[3] = -4000000;

console.log("Typed Array:", int32Array);
console.log("버퍼 크기:", int32Array.buffer.byteLength, "바이트");

// 5.3 실용적 예제 - 이미지 데이터 처리 시뮬레이션
function createImageData(width, height) {
  const pixelCount = width * height;
  const buffer = new ArrayBuffer(pixelCount * 4); // RGBA, 각 1바이트
  const pixels = new Uint8ClampedArray(buffer);

  // 그라데이션 패턴 생성
  for (let i = 0; i < pixelCount; i++) {
    const x = i % width;
    const y = Math.floor(i / width);

    pixels[i * 4] = (x / width) * 255; // Red
    pixels[i * 4 + 1] = (y / height) * 255; // Green
    pixels[i * 4 + 2] = 128; // Blue
    pixels[i * 4 + 3] = 255; // Alpha
  }

  return { width, height, data: pixels };
}

const imageData = createImageData(4, 4);
console.log(
  "이미지 데이터 생성 완료:",
  imageData.width + "x" + imageData.height
);

// ===== 6. 정규표현식 고급 활용 =====
console.log("\n🔍 6. 고급 정규표현식");

// 6.1 Named Capture Groups
const emailPattern =
  /^(?<username>[a-zA-Z0-9._-]+)@(?<domain>[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
const emailMatch = "user.name@example.com".match(emailPattern);

if (emailMatch) {
  console.log("이메일 파싱:");
  console.log("사용자명:", emailMatch.groups.username);
  console.log("도메인:", emailMatch.groups.domain);
}

// 6.2 Lookbehind와 Lookahead
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const passwords = ["weak", "Strong1!", "NoNumber!", "nonumber1@"];

console.log("비밀번호 검증:");
passwords.forEach((pwd) => {
  console.log(`${pwd}: ${passwordPattern.test(pwd) ? "유효" : "무효"}`);
});

// 6.3 Unicode Property Escapes
const emojiPattern = /\p{Emoji}/gu;
const text = "Hello 👋 World 🌍! 코딩 💻";
const emojis = text.match(emojiPattern);
console.log("이모지 추출:", emojis);

// 6.4 실용적 정규식 유틸리티
class RegexUtils {
  static createValidator(pattern, flags = "") {
    const regex = new RegExp(pattern, flags);
    return (value) => regex.test(value);
  }

  static extractAll(text, pattern, flags = "g") {
    const regex = new RegExp(pattern, flags);
    return Array.from(text.matchAll(regex));
  }

  static replaceWithCallback(text, pattern, callback, flags = "g") {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, callback);
  }
}

// URL 추출기
const urlExtractor = RegexUtils.createValidator("https?://[\\w.-]+");
const urls = ["https://example.com", "http://test.org", "not-a-url"];
console.log("URL 검증:");
urls.forEach((url) => {
  console.log(`${url}: ${urlExtractor(url) ? "유효" : "무효"}`);
});

// ===== 7. 메타프로그래밍 패턴들 =====
console.log("\n🧙‍♂️ 7. 메타프로그래밍 패턴");

// 7.1 Decorator Pattern (ES Proposal)
function logged(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    console.log(`🔧 호출: ${propertyKey}(${args.join(", ")})`);
    const result = originalMethod.apply(this, args);
    console.log(`✅ 반환: ${result}`);
    return result;
  };

  return descriptor;
}

function memoized(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`💾 캐시 히트: ${propertyKey}`);
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

// 7.2 Mixins 패턴
const Flyable = {
  fly() {
    return `${this.name}이 날고 있습니다.`;
  },
};

const Swimmable = {
  swim() {
    return `${this.name}이 수영하고 있습니다.`;
  },
};

function applyMixins(BaseClass, ...mixins) {
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin).forEach((name) => {
      if (name !== "constructor") {
        BaseClass.prototype[name] = mixin[name];
      }
    });
  });
}

class Duck {
  constructor(name) {
    this.name = name;
  }
}

applyMixins(Duck, Flyable, Swimmable);

const duck = new Duck("도날드");
console.log("Mixin 테스트:");
console.log(duck.fly());
console.log(duck.swim());

// 7.3 동적 클래스 생성
function createClass(className, properties, methods = {}) {
  const ClassConstructor = {
    [className]: function (data = {}) {
      properties.forEach((prop) => {
        this[prop] = data[prop] || null;
      });
    },
  }[className];

  Object.keys(methods).forEach((methodName) => {
    ClassConstructor.prototype[methodName] = methods[methodName];
  });

  return ClassConstructor;
}

const DynamicUser = createClass("DynamicUser", ["name", "email", "age"], {
  greet() {
    return `안녕하세요, ${this.name}입니다!`;
  },

  getInfo() {
    return `${this.name} (${this.age}세, ${this.email})`;
  },
});

const dynamicUser = new DynamicUser({
  name: "동적 사용자",
  email: "dynamic@example.com",
  age: 25,
});

console.log("동적 클래스 테스트:");
console.log(dynamicUser.greet());
console.log(dynamicUser.getInfo());

// ===== 8. JavaScript 엔진 이해와 최적화 =====
console.log("\n⚙️ 8. 엔진 최적화 이해");

// 8.1 Hidden Classes와 Inline Caching 최적화
console.log("Hidden Classes 최적화:");

// ✅ 좋은 패턴 - 같은 구조로 객체 생성
function createOptimizedPoint(x, y) {
  return { x, y }; // 항상 같은 순서로 속성 추가
}

const points = Array.from({ length: 1000 }, (_, i) =>
  createOptimizedPoint(i, i * 2)
);

console.log("최적화된 객체들 생성 완료:", points.length);

// 8.2 JIT 컴파일러 최적화를 위한 패턴
function hotFunction(numbers) {
  // 단형성 (monomorphic) 함수 - JIT에 의해 최적화됨
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i]; // 항상 숫자만 처리
  }
  return sum;
}

// 함수를 "워밍업"하여 최적화 유도
const testNumbers = Array.from({ length: 10000 }, (_, i) => i);
console.time("Hot Function");
for (let i = 0; i < 100; i++) {
  hotFunction(testNumbers);
}
console.timeEnd("Hot Function");

// 8.3 메모리 사용량 최적화 패턴
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];

    // 미리 객체들을 생성해 두기
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

  size() {
    return this.pool.length;
  }
}

// 벡터 객체 풀 예제
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (vec) => {
    vec.x = 0;
    vec.y = 0;
  },
  5
);

console.log("Object Pool 테스트:");
const vector1 = vectorPool.acquire();
vector1.x = 10;
vector1.y = 20;
console.log("벡터 사용:", vector1);

vectorPool.release(vector1);
console.log("풀 크기:", vectorPool.size());

// 8.4 성능 측정 도구
class PerformanceProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }

  mark(name) {
    this.marks.set(name, performance.now());
  }

  measure(name, startMark, endMark = null) {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();

    if (startTime === undefined) {
      throw new Error(`시작 마크 '${startMark}'를 찾을 수 없습니다.`);
    }

    const duration = endTime - startTime;
    this.measures.set(name, duration);
    console.log(`📊 ${name}: ${duration.toFixed(3)}ms`);
    return duration;
  }

  profile(name, fn) {
    this.mark(`${name}-start`);
    const result = fn();
    this.mark(`${name}-end`);
    this.measure(name, `${name}-start`, `${name}-end`);
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

const profiler = new PerformanceProfiler();

// 성능 측정 예제
profiler.profile("배열 생성", () => {
  return Array.from({ length: 100000 }, (_, i) => i * i);
});

profiler.profile("배열 필터링", () => {
  const arr = Array.from({ length: 100000 }, (_, i) => i);
  return arr.filter((n) => n % 2 === 0);
});

console.log("성능 리포트:", profiler.getReport());

// 정리 함수
function cleanup() {
  // WeakMap과 WeakSet은 자동으로 정리되므로 별도 처리 불필요
  console.log("🧹 고급 개념 학습 정리 완료");
}

setTimeout(() => {
  cleanup();
  console.log("\n🎓 축하합니다! JavaScript 고급 개념을 모두 마스터했습니다!");
  console.log("💪 이제 진정한 JavaScript 전문가가 되었습니다! 🚀✨");
}, 1000);
