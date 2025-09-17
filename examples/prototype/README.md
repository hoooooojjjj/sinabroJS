# 프로토타입과 상속(Prototype & Inheritance)

## 🎯 학습 목표
- 자바스크립트 프로토타입 체인의 동작 원리 완전 이해
- 생성자 함수와 ES6 클래스의 차이점과 활용법
- 상속 패턴과 믹스인을 통한 다중 상속 구현
- 실무에서 효과적인 객체지향 프로그래밍 기법

## 📝 핵심 개념

### 프로토타입이란?
자바스크립트는 **프로토타입 기반 언어**입니다. 모든 객체는 다른 객체를 프로토타입으로 가질 수 있으며, 프로토타입 체인을 통해 속성과 메서드를 상속받습니다.

## 🔍 주요 학습 내용

### 1. 프로토타입 기본
```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};
```

### 2. 상속 패턴 비교

| 방식 | 장점 | 단점 |
|------|------|------|
| 생성자 함수 | 명시적, 유연함 | 복잡한 설정 |
| ES6 클래스 | 직관적, 간결함 | 내부적으론 프로토타입 |
| Object.create() | 순수 프로토타입 상속 | 초기화 패턴 필요 |

### 3. 고급 패턴
- **믹스인(Mixin)**: 다중 상속 구현
- **프로토타입 체인 분석**: 상속 구조 이해
- **동적 프로토타입 조작**: 런타임 기능 확장

## 🚀 실행 방법
```bash
node prototype-inheritance.js
```

## 💡 실무 활용 팁

### 성능 최적화
- 공통 메서드는 프로토타입에 정의
- 인스턴스별 고유 데이터만 생성자에서 초기화

### 메모리 효율성
```javascript
// ❌ 비효율적 - 인스턴스마다 메서드 복사
function User(name) {
    this.name = name;
    this.greet = function() { return `Hi, ${this.name}`; };
}

// ✅ 효율적 - 프로토타입에서 메서드 공유
User.prototype.greet = function() {
    return `Hi, ${this.name}`;
};
```

### 상속 관계 확인
```javascript
// instanceof 연산자
console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog);    // true

// 프로토타입 체인 확인
console.log(Object.getPrototypeOf(dog) === Dog.prototype);
```

## 🎉 학습 성과
이 예제를 통해 다음을 마스터할 수 있습니다:
1. 프로토타입 체인의 작동 원리
2. 다양한 상속 구현 방법
3. 메모리 효율적인 객체 설계
4. 실무에서 바로 쓸 수 있는 패턴들
