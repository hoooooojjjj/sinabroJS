/**
 * 수학 유틸리티 모듈
 * Named Export와 Default Export 예제
 */

// Named Exports
export const PI = Math.PI;
export const E = Math.E;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// 클래스 export
export class Calculator {
    constructor() {
        this.history = [];
    }
    
    calculate(operation, a, b) {
        let result;
        switch (operation) {
            case 'add':
                result = add(a, b);
                break;
            case 'multiply':
                result = multiply(a, b);
                break;
            default:
                throw new Error('Unsupported operation');
        }
        
        this.history.push({ operation, a, b, result });
        return result;
    }
    
    getHistory() {
        return [...this.history]; // 깊은 복사 방지
    }
}

// 한번에 여러 개 export
export { PI as MATH_PI, E as EULER_NUMBER };

// Default Export - 모듈당 하나만 가능
export default function power(base, exponent) {
    return Math.pow(base, exponent);
}
