/**
 * 클로저(Closure) 기본 개념과 활용 예제
 * 
 * 클로저는 함수가 선언된 렉시컬 환경(Lexical Environment)을 기억하여
 * 함수가 스코프 밖에서 실행될 때도 그 환경에 접근할 수 있게 해주는 기능입니다.
 */

console.log('🔥 클로저(Closure) 학습 시작!');

// 1. 기본 클로저 예제
function outerFunction(x) {
    // 외부 함수의 변수
    const outerVariable = x;
    
    // 내부 함수 (클로저)
    function innerFunction(y) {
        // 내부 함수에서 외부 함수의 변수에 접근 가능
        console.log(`외부 변수: ${outerVariable}, 내부 변수: ${y}`);
        return outerVariable + y;
    }
    
    return innerFunction;
}

const closureExample = outerFunction(10);
console.log('기본 클로저:', closureExample(5)); // 15

// 2. 카운터 함수 - 클로저의 대표적인 활용
function createCounter() {
    let count = 0;
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getCount() {
            return count;
        }
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log('Counter 1:', counter1.increment()); // 1
console.log('Counter 1:', counter1.increment()); // 2
console.log('Counter 2:', counter2.increment()); // 1 (독립적인 스코프)

// 3. 모듈 패턴 - 프라이빗 변수 구현
const bankAccount = (function(initialBalance) {
    let balance = initialBalance;
    
    // 프라이빗 메서드
    function isValidAmount(amount) {
        return typeof amount === 'number' && amount > 0;
    }
    
    // 퍼블릭 API 반환
    return {
        deposit(amount) {
            if (isValidAmount(amount)) {
                balance += amount;
                return `입금 완료: ${amount}원, 잔액: ${balance}원`;
            }
            return '유효하지 않은 금액입니다.';
        },
        
        withdraw(amount) {
            if (isValidAmount(amount) && amount <= balance) {
                balance -= amount;
                return `출금 완료: ${amount}원, 잔액: ${balance}원`;
            }
            return '잔액이 부족하거나 유효하지 않은 금액입니다.';
        },
        
        getBalance() {
            return `현재 잔액: ${balance}원`;
        }
    };
})(10000);

console.log(bankAccount.getBalance()); // 현재 잔액: 10000원
console.log(bankAccount.deposit(5000)); // 입금 완료: 5000원, 잔액: 15000원
console.log(bankAccount.withdraw(3000)); // 출금 완료: 3000원, 잔액: 12000원

// 4. 함수형 프로그래밍 - 부분 적용(Partial Application)
function multiply(a, b, c) {
    return a * b * c;
}

function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

const multiplyBy2 = partial(multiply, 2);
const multiplyBy2And3 = partial(multiply, 2, 3);

console.log('부분 적용 1:', multiplyBy2(5, 10)); // 2 * 5 * 10 = 100
console.log('부분 적용 2:', multiplyBy2And3(4)); // 2 * 3 * 4 = 24

// 5. 메모이제이션 - 성능 최적화
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache[key]) {
            console.log(`캐시에서 반환: ${key}`);
            return cache[key];
        }
        
        console.log(`계산 후 캐시 저장: ${key}`);
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// 피보나치 수열 (메모이제이션 적용)
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log('메모이제이션 피보나치:');
console.log(fibonacci(10)); // 처음 계산
console.log(fibonacci(10)); // 캐시에서 반환

console.log('✅ 클로저 학습 완료!');
