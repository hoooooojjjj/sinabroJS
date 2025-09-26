// 간단한 테스팅 프레임워크 구현
class SimpleTest {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  describe(name, fn) {
    console.log(`\n📝 ${name}`);
    fn.call(this);
  }

  it(description, testFn) {
    try {
      testFn.call(this);
      console.log(`  ✅ ${description}`);
      this.passed++;
    } catch (error) {
      console.log(`  ❌ ${description}`);
      console.log(`     ${error.message}`);
      this.failed++;
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, but got ${actual}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(
            `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
              actual
            )}`
          );
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy, but got ${actual}`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected falsy, but got ${actual}`);
        }
      },
    };
  }

  run() {
    console.log(
      `\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`
    );
    return { passed: this.passed, failed: this.failed };
  }
}

// 성능 테스터
class PerformanceTester {
  static benchmark(name, fn, iterations = 1000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();
    const total = end - start;
    const average = total / iterations;
    console.log(
      `⏱️ ${name}: ${total.toFixed(3)}ms total, ${average.toFixed(6)}ms avg`
    );
    return { total, average };
  }

  static compare(tests) {
    const results = {};
    console.log("\n🏃‍♂️ Performance Comparison:");

    Object.entries(tests).forEach(([name, fn]) => {
      results[name] = this.benchmark(name, fn);
    });

    return results;
  }
}

// 디버깅 유틸리티
class Debugger {
  static trace(obj, property) {
    let value = obj[property];
    Object.defineProperty(obj, property, {
      get() {
        console.log(`🔍 GET ${property}: ${value}`);
        return value;
      },
      set(newValue) {
        console.log(`📝 SET ${property}: ${value} -> ${newValue}`);
        value = newValue;
      },
    });
  }

  static spy(obj, methodName) {
    const original = obj[methodName];
    obj[methodName] = function (...args) {
      console.log(`📞 CALL ${methodName}(${args.join(", ")})`);
      const result = original.apply(this, args);
      console.log(`📤 RETURN ${methodName}: ${result}`);
      return result;
    };
  }

  static deepLog(obj, maxDepth = 3) {
    const seen = new WeakSet();

    function stringify(value, depth = 0) {
      if (depth > maxDepth) return "[Max Depth Reached]";

      if (value === null) return "null";
      if (typeof value !== "object") return String(value);
      if (seen.has(value)) return "[Circular Reference]";

      seen.add(value);

      if (Array.isArray(value)) {
        return `[${value.map((v) => stringify(v, depth + 1)).join(", ")}]`;
      }

      const props = Object.keys(value)
        .map((key) => `${key}: ${stringify(value[key], depth + 1)}`)
        .join(", ");

      return `{${props}}`;
    }

    console.log("🔍 Deep Log:", stringify(obj));
  }
}

// 테스트 실행
const test = new SimpleTest();

test.describe("Calculator Tests", function () {
  const add = (a, b) => a + b;
  const multiply = (a, b) => a * b;

  this.it("should add numbers correctly", function () {
    this.expect(add(2, 3)).toBe(5);
    this.expect(add(-1, 1)).toBe(0);
  });

  this.it("should multiply numbers correctly", function () {
    this.expect(multiply(3, 4)).toBe(12);
    this.expect(multiply(0, 5)).toBe(0);
  });
});

test.describe("Array Tests", function () {
  this.it("should filter arrays correctly", function () {
    const arr = [1, 2, 3, 4, 5];
    const evens = arr.filter((n) => n % 2 === 0);
    this.expect(evens).toEqual([2, 4]);
  });
});

test.run();

// 성능 비교
PerformanceTester.compare({
  "For Loop": () => {
    let sum = 0;
    for (let i = 0; i < 1000; i++) {
      sum += i;
    }
  },
  "While Loop": () => {
    let sum = 0;
    let i = 0;
    while (i < 1000) {
      sum += i;
      i++;
    }
  },
  Reduce: () => {
    Array.from({ length: 1000 }, (_, i) => i).reduce((a, b) => a + b, 0);
  },
});

// 디버깅 예제
const person = { name: "John", age: 30 };
Debugger.trace(person, "age");
person.age = 31;
person.age;

const calculator = {
  add(a, b) {
    return a + b;
  },
  multiply(a, b) {
    return a * b;
  },
};
Debugger.spy(calculator, "add");
calculator.add(5, 3);

const complexObj = {
  users: [
    { id: 1, name: "Alice", meta: { active: true } },
    { id: 2, name: "Bob", meta: { active: false } },
  ],
};
Debugger.deepLog(complexObj);
