/**
 * 함수형 프로그래밍(Functional Programming) 핵심 개념
 *
 * 순수함수, 고차함수, 불변성, 함수 합성 등 함수형 프로그래밍의
 * 핵심 패러다임을 실무 관점에서 완전 정복합니다.
 */

console.log("🧮 함수형 프로그래밍 학습 시작!");

// ===== 1. 순수함수 vs 비순수함수 =====
console.log("\n✨ 1. 순수함수 vs 비순수함수");

// ❌ 비순수함수 (Side Effect 있음)
let globalCounter = 0;

function impureIncrement() {
  globalCounter++; // 외부 상태 변경
  console.log("Current count:", globalCounter); // 콘솔 출력 (side effect)
  return globalCounter;
}

// ✅ 순수함수 (Same input, Same output, No side effects)
function pureIncrement(count) {
  return count + 1; // 입력에 대해 항상 같은 출력, 부수효과 없음
}

console.log("비순수함수 결과:", impureIncrement()); // 1
console.log("비순수함수 결과:", impureIncrement()); // 2 (상태에 따라 다른 결과)

console.log("순수함수 결과:", pureIncrement(5)); // 6
console.log("순수함수 결과:", pureIncrement(5)); // 6 (항상 같은 결과)

// ===== 2. 고차함수 (Higher-Order Functions) =====
console.log("\n🔧 2. 고차함수 패턴");

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 함수를 인자로 받는 고차함수들
const doubled = numbers.map((x) => x * 2);
const evens = numbers.filter((x) => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);

console.log("원본 배열:", numbers);
console.log("2배 증가:", doubled);
console.log("짝수 필터:", evens);
console.log("합계:", sum);

// 커스텀 고차함수 구현
function createTransformer(operation) {
  return function (array) {
    return array.map(operation);
  };
}

const doubler = createTransformer((x) => x * 2);
const squarer = createTransformer((x) => x ** 2);

console.log("커스텀 고차함수 - 더블러:", doubler([1, 2, 3]));
console.log("커스텀 고차함수 - 제곱:", squarer([1, 2, 3]));

// ===== 3. 커링(Currying)과 부분 적용 =====
console.log("\n🥄 3. 커링과 부분 적용");

// 일반 함수
function multiply(a, b, c) {
  return a * b * c;
}

// 커링된 함수
function curriedMultiply(a) {
  return function (b) {
    return function (c) {
      return a * b * c;
    };
  };
}

// 화살표 함수로 더 간결하게
const curriedMultiplyArrow = (a) => (b) => (c) => a * b * c;

console.log("일반 함수:", multiply(2, 3, 4)); // 24
console.log("커링 함수:", curriedMultiply(2)(3)(4)); // 24
console.log("화살표 커링:", curriedMultiplyArrow(2)(3)(4)); // 24

// 부분 적용 활용
const multiplyBy2 = curriedMultiplyArrow(2);
const multiplyBy2And3 = multiplyBy2(3);

console.log("부분 적용 1단계:", multiplyBy2And3(5)); // 30
console.log("부분 적용 1단계:", multiplyBy2And3(10)); // 60

// 실무 커링 예제: 로깅 함수
const createLogger = (level) => (message) => (timestamp) =>
  `[${timestamp}] ${level.toUpperCase()}: ${message}`;

const infoLogger = createLogger("info");
const errorLogger = createLogger("error");

const logInfo = infoLogger("사용자가 로그인했습니다");
const logError = errorLogger("데이터베이스 연결 실패");

console.log("Info 로그:", logInfo(new Date().toISOString()));
console.log("Error 로그:", logError(new Date().toISOString()));

// ===== 4. 함수 합성 (Function Composition) =====
console.log("\n🔗 4. 함수 합성");

// 작은 함수들
const add10 = (x) => x + 10;
const multiply3 = (x) => x * 3;
const square = (x) => x ** 2;

// 수동 합성
const manual = square(multiply3(add10(5))); // 5 -> 15 -> 45 -> 2025
console.log("수동 합성:", manual);

// 합성 유틸리티 함수
const compose =
  (...functions) =>
  (value) =>
    functions.reduceRight((acc, fn) => fn(acc), value);

const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value);

// compose는 오른쪽에서 왼쪽으로 실행
const composedOperation = compose(square, multiply3, add10);
console.log("Compose 합성:", composedOperation(5)); // 2025

// pipe는 왼쪽에서 오른쪽으로 실행 (더 직관적)
const pipedOperation = pipe(add10, multiply3, square);
console.log("Pipe 합성:", pipedOperation(5)); // 2025

// 실무 예제: 데이터 처리 파이프라인
const users = [
  { name: "김철수", age: 25, department: "개발" },
  { name: "이영희", age: 30, department: "디자인" },
  { name: "박개발", age: 28, department: "개발" },
  { name: "최기획", age: 35, department: "기획" },
];

const processDevelopers = pipe(
  (users) => users.filter((user) => user.department === "개발"),
  (developers) => developers.map((dev) => ({ ...dev, role: "Developer" })),
  (developers) => developers.sort((a, b) => a.age - b.age)
);

console.log("개발자 처리 파이프라인:", processDevelopers(users));

// ===== 5. 불변성과 데이터 변환 =====
console.log("\n🔒 5. 불변성과 데이터 변환");

// ❌ 가변적 접근 (원본 데이터 수정)
const mutableArray = [1, 2, 3];
// mutableArray.push(4); // 원본 수정

// ✅ 불변적 접근 (새로운 데이터 생성)
const immutableAdd = (arr, item) => [...arr, item];
const immutableRemove = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1),
];
const immutableUpdate = (arr, index, newValue) => [
  ...arr.slice(0, index),
  newValue,
  ...arr.slice(index + 1),
];

const originalArray = [1, 2, 3, 4, 5];
console.log("원본 배열:", originalArray);
console.log("요소 추가:", immutableAdd(originalArray, 6));
console.log("요소 제거:", immutableRemove(originalArray, 2));
console.log("요소 수정:", immutableUpdate(originalArray, 1, 99));
console.log("원본 배열 (변경 없음):", originalArray);

// 객체 불변성
const updateUser = (user, updates) => ({ ...user, ...updates });
const addUserSkill = (user, skill) => ({
  ...user,
  skills: [...(user.skills || []), skill],
});

const originalUser = { name: "김개발", age: 30, skills: ["JavaScript"] };
const updatedUser = updateUser(originalUser, { age: 31 });
const skilledUser = addUserSkill(updatedUser, "TypeScript");

console.log("원본 사용자:", originalUser);
console.log("업데이트된 사용자:", skilledUser);

// ===== 6. 함수형 에러 처리 (Maybe/Either 모나드 패턴) =====
console.log("\n🛡️ 6. 함수형 에러 처리");

// Maybe 모나드 (값이 있을 수도, 없을 수도)
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  static none() {
    return new Maybe(null);
  }

  isNone() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    if (this.isNone()) {
      return Maybe.none();
    }
    return Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    if (this.isNone()) {
      return Maybe.none();
    }
    return fn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isNone() ? defaultValue : this.value;
  }
}

// Maybe 모나드 사용
const safeParseInt = (str) => {
  const parsed = parseInt(str);
  return isNaN(parsed) ? Maybe.none() : Maybe.of(parsed);
};

const safeDivide = (a, b) => (b === 0 ? Maybe.none() : Maybe.of(a / b));

const calculation = Maybe.of("42")
  .map((str) => parseInt(str))
  .flatMap((num) => safeDivide(num, 6))
  .map((result) => result * 2);

console.log("Maybe 모나드 계산:", calculation.getOrElse("계산 실패"));

// Either 모나드 (성공 또는 실패)
class Either {
  constructor(value, isRight = true) {
    this.value = value;
    this.isRight = isRight;
  }

  static right(value) {
    return new Either(value, true);
  }

  static left(value) {
    return new Either(value, false);
  }

  map(fn) {
    if (this.isRight) {
      try {
        return Either.right(fn(this.value));
      } catch (error) {
        return Either.left(error.message);
      }
    }
    return this;
  }

  flatMap(fn) {
    return this.isRight ? fn(this.value) : this;
  }

  fold(leftFn, rightFn) {
    return this.isRight ? rightFn(this.value) : leftFn(this.value);
  }
}

// Either 모나드 사용
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? Either.right(email)
    : Either.left("유효하지 않은 이메일 형식");
};

const processUser = (email) =>
  validateEmail(email)
    .map((validEmail) => ({ email: validEmail, id: Date.now() }))
    .map((user) => ({ ...user, status: "active" }));

const result1 = processUser("user@example.com");
const result2 = processUser("invalid-email");

console.log(
  "유효한 이메일 처리:",
  result1.fold(
    (error) => `에러: ${error}`,
    (user) => `성공: ${JSON.stringify(user)}`
  )
);

console.log(
  "잘못된 이메일 처리:",
  result2.fold(
    (error) => `에러: ${error}`,
    (user) => `성공: ${JSON.stringify(user)}`
  )
);

// ===== 7. 실무 함수형 유틸리티 라이브러리 =====
console.log("\n🛠️ 7. 실무 함수형 유틸리티");

const FP = {
  // 배열 처리
  map: (fn) => (array) => array.map(fn),
  filter: (predicate) => (array) => array.filter(predicate),
  reduce: (reducer, initial) => (array) => array.reduce(reducer, initial),

  // 객체 처리
  pick: (keys) => (obj) =>
    keys.reduce(
      (result, key) =>
        obj.hasOwnProperty(key) ? { ...result, [key]: obj[key] } : result,
      {}
    ),

  omit: (keys) => (obj) =>
    Object.keys(obj)
      .filter((key) => !keys.includes(key))
      .reduce((result, key) => ({ ...result, [key]: obj[key] }), {}),

  // 조건부 실행
  when: (predicate, fn) => (value) => predicate(value) ? fn(value) : value,
  unless: (predicate, fn) => (value) => !predicate(value) ? fn(value) : value,

  // 함수 조합
  compose:
    (...fns) =>
    (value) =>
      fns.reduceRight((acc, fn) => fn(acc), value),
  pipe:
    (...fns) =>
    (value) =>
      fns.reduce((acc, fn) => fn(acc), value),

  // 유틸리티
  identity: (x) => x,
  constant: (x) => () => x,
  tap: (fn) => (value) => {
    fn(value);
    return value;
  },
};

// 실무 예제: 사용자 데이터 처리 파이프라인
const rawUsers = [
  {
    id: 1,
    name: "김철수",
    age: 25,
    email: "kim@test.com",
    role: "user",
    active: true,
  },
  {
    id: 2,
    name: "이영희",
    age: 17,
    email: "lee@test.com",
    role: "admin",
    active: false,
  },
  {
    id: 3,
    name: "박개발",
    age: 30,
    email: "park@test.com",
    role: "user",
    active: true,
  },
];

const processUsers = FP.pipe(
  FP.filter((user) => user.active), // 활성 사용자만
  FP.filter((user) => user.age >= 18), // 성인만
  FP.map(FP.pick(["id", "name", "email"])), // 필요한 필드만
  FP.map((user) => ({ ...user, processedAt: new Date().toISOString() })), // 처리 시간 추가
  FP.tap((users) => console.log("처리된 사용자 수:", users.length)) // 로깅 (부수효과)
);

const processedUsers = processUsers(rawUsers);
console.log("최종 처리된 사용자들:", processedUsers);

// 커링된 검색 함수
const createSearcher = FP.pipe(
  (searchTerm) => searchTerm.toLowerCase(),
  (term) => (users) =>
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    )
);

const searchByName = createSearcher("김");
console.log("이름 검색 결과:", searchByName(processedUsers));

console.log(
  "\n✅ 함수형 프로그래밍 학습 완료! 순수함수의 세계를 정복했습니다! 🎉"
);
