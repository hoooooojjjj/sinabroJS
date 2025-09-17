/**
 * 프로토타입과 상속(Prototype & Inheritance) 완전 정복
 * 
 * 자바스크립트는 프로토타입 기반 언어로, 모든 객체는 다른 객체를 
 * 프로토타입으로 가질 수 있으며, 프로토타입 체인을 통해 상속을 구현합니다.
 */

console.log('🧬 프로토타입과 상속 학습 시작!');

// 1. 프로토타입 기본 개념
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 프로토타입에 메서드 추가
Person.prototype.introduce = function() {
    return `안녕하세요! 저는 ${this.name}이고, ${this.age}살입니다.`;
};

Person.prototype.getOlder = function(years = 1) {
    this.age += years;
    return `${years}년이 지났습니다. 현재 나이: ${this.age}살`;
};

const person1 = new Person('김철수', 25);
const person2 = new Person('이영희', 28);

console.log(person1.introduce());
console.log(person2.getOlder(2));

// 프로토타입 체인 확인
console.log('프로토타입 체인:', person1.__proto__ === Person.prototype); // true
console.log('생성자 확인:', person1.constructor === Person); // true

// 2. 프로토타입 상속 - 생성자 함수 방식
function Developer(name, age, language) {
    // 부모 생성자 호출
    Person.call(this, name, age);
    this.language = language;
}

// 프로토타입 상속 설정
Developer.prototype = Object.create(Person.prototype);
Developer.prototype.constructor = Developer;

// Developer만의 메서드 추가
Developer.prototype.code = function() {
    return `${this.name}이 ${this.language}로 코딩중입니다! 🚀`;
};

Developer.prototype.introduce = function() {
    // 부모 메서드 호출 + 추가 정보
    const baseIntro = Person.prototype.introduce.call(this);
    return `${baseIntro} 주 사용 언어는 ${this.language}입니다.`;
};

const dev1 = new Developer('박개발', 30, 'JavaScript');
console.log(dev1.introduce());
console.log(dev1.code());

// 3. ES6 클래스 문법 (Syntactic Sugar)
class Animal {
    constructor(name, species) {
        this.name = name;
        this.species = species;
    }
    
    makeSound() {
        return `${this.name}이 소리를 냅니다!`;
    }
    
    // 정적 메서드
    static getAnimalCount() {
        return Animal.count || 0;
    }
    
    // getter
    get info() {
        return `${this.species}: ${this.name}`;
    }
    
    // setter  
    set nickname(nick) {
        this._nickname = nick;
    }
    
    get nickname() {
        return this._nickname || this.name;
    }
}

// 상속 (extends)
class Dog extends Animal {
    constructor(name, breed) {
        super(name, '개'); // 부모 생성자 호출
        this.breed = breed;
    }
    
    makeSound() {
        return `${this.name}이 멍멍 짖습니다! 🐕`;
    }
    
    fetch() {
        return `${this.name}이 공을 가져옵니다!`;
    }
    
    // 부모 메서드 확장
    get info() {
        return `${super.info} (품종: ${this.breed})`;
    }
}

const dog1 = new Dog('맥스', '골든 리트리버');
console.log('클래스 기반 상속:');
console.log(dog1.info);
console.log(dog1.makeSound());
console.log(dog1.fetch());

dog1.nickname = '멍멍이';
console.log(`별명: ${dog1.nickname}`);

// 4. 믹스인(Mixin) 패턴 - 다중 상속 구현
const Flyable = {
    fly() {
        return `${this.name}이 하늘을 날고 있습니다! ✈️`;
    },
    
    land() {
        return `${this.name}이 착륙했습니다.`;
    }
};

const Swimmable = {
    swim() {
        return `${this.name}이 수영하고 있습니다! 🏊‍♂️`;
    },
    
    dive(depth = 1) {
        return `${this.name}이 ${depth}m 깊이로 잠수합니다!`;
    }
};

class Duck extends Animal {
    constructor(name) {
        super(name, '오리');
    }
    
    makeSound() {
        return `${this.name}이 꽥꽥 웁니다! 🦆`;
    }
}

// 믹스인 적용
Object.assign(Duck.prototype, Flyable, Swimmable);

const duck1 = new Duck('도날드');
console.log('\n믹스인 패턴:');
console.log(duck1.makeSound());
console.log(duck1.fly());
console.log(duck1.swim());
console.log(duck1.dive(3));

// 5. 프로토타입 체인 깊이 있게 이해하기
console.log('\n🔍 프로토타입 체인 분석:');

function analyzePrototypeChain(obj, objName) {
    console.log(`\n=== ${objName} 프로토타입 체인 ===`);
    
    let current = obj;
    let level = 0;
    
    while (current) {
        const indent = '  '.repeat(level);
        const constructor = current.constructor ? current.constructor.name : 'Unknown';
        
        if (level === 0) {
            console.log(`${indent}🎯 ${objName} (${constructor})`);
        } else {
            console.log(`${indent}↑ ${constructor}.prototype`);
        }
        
        // 주요 프로퍼티 표시
        const ownProps = Object.getOwnPropertyNames(current)
            .filter(prop => typeof current[prop] === 'function' && prop !== 'constructor')
            .slice(0, 3);
            
        if (ownProps.length > 0) {
            console.log(`${indent}  메서드: [${ownProps.join(', ')}]`);
        }
        
        current = Object.getPrototypeOf(current);
        level++;
        
        if (level > 5) break; // 무한 루프 방지
    }
}

analyzePrototypeChain(duck1, 'duck1');
analyzePrototypeChain(dev1, 'dev1');

// 6. 프로토타입 조작 - 실시간 기능 추가
console.log('\n🛠 동적 프로토타입 조작:');

// 모든 개발자에게 새로운 기능 추가
Developer.prototype.debug = function() {
    return `${this.name}이 버그를 찾고 있습니다... 🐛`;
};

console.log(dev1.debug()); // 기존 인스턴스에서도 새 메서드 사용 가능!

// 7. Object.create()를 활용한 순수 프로토타입 상속
const vehiclePrototype = {
    init(make, model) {
        this.make = make;
        this.model = model;
        return this;
    },
    
    getInfo() {
        return `${this.make} ${this.model}`;
    }
};

const carPrototype = Object.create(vehiclePrototype);
carPrototype.drive = function() {
    return `${this.getInfo()}이 도로를 달리고 있습니다! 🚗`;
};

const myCar = Object.create(carPrototype).init('Tesla', 'Model 3');
console.log('\nObject.create() 상속:');
console.log(myCar.drive());

console.log('✅ 프로토타입과 상속 학습 완료!');
