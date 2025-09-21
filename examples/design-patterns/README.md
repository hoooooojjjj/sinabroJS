# 디자인 패턴과 아키텍처 패턴

## 🎯 학습 목표

- GoF 디자인 패턴의 핵심 개념과 실무 적용법
- JavaScript 특성에 맞는 패턴 구현 방법
- 모던 웹 애플리케이션 아키텍처 패턴
- 코드 품질과 유지보수성을 높이는 패턴 활용법

## 🏗️ 디자인 패턴 분류

### 생성 패턴 (Creational Patterns)

**객체 생성과 관련된 패턴들**

#### 1. Singleton Pattern

하나의 인스턴스만 생성하고 전역 접근을 제공

```javascript
class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    this.logs = [];
    Logger.instance = this;
  }

  static getInstance() {
    return Logger.instance || new Logger();
  }
}

// 항상 같은 인스턴스
const logger1 = new Logger();
const logger2 = new Logger();
console.log(logger1 === logger2); // true
```

#### 2. Factory Pattern

객체 생성을 캡슐화하고 조건에 따라 다른 객체 생성

```javascript
class UserFactory {
  static createUser(type, userData) {
    const userTypes = {
      admin: () => new AdminUser(userData),
      regular: () => new RegularUser(userData),
      guest: () => new GuestUser(userData),
    };
    return userTypes[type]();
  }
}

const admin = UserFactory.createUser("admin", { name: "관리자" });
```

#### 3. Builder Pattern

복잡한 객체를 단계별로 생성

```javascript
const query = new QueryBuilder()
  .select("id", "name")
  .from("users")
  .where("active = 1")
  .orderBy("name")
  .limit(10)
  .build();
```

### 구조 패턴 (Structural Patterns)

**객체 간의 관계를 다루는 패턴들**

#### 1. Adapter Pattern

호환되지 않는 인터페이스를 연결

```javascript
class ModernAPIAdapter {
  constructor(legacyAPI) {
    this.legacyAPI = legacyAPI;
  }

  getUser() {
    const data = this.legacyAPI.getData();
    return {
      name: data.user_name,
      email: data.user_email,
      age: data.user_age,
    };
  }
}
```

#### 2. Decorator Pattern

객체에 동적으로 기능 추가

```javascript
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
// 기본 커피 + 우유 + 설탕
```

#### 3. Facade Pattern

복잡한 시스템에 간단한 인터페이스 제공

```javascript
class HomeTheaterFacade {
  watchMovie() {
    this.lighting.dim(10);
    this.audio.turnOn();
    this.video.turnOn();
    return "영화 모드 준비 완료!";
  }
}
```

### 행동 패턴 (Behavioral Patterns)

**객체 간의 상호작용과 책임 분배**

#### 1. Observer Pattern

일대다 의존성 - 상태 변화를 구독자들에게 알림

```javascript
class EventEmitter {
  on(event, listener) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(...args));
    }
  }
}

// 사용자 상태 변화를 여러 컴포넌트가 구독
userState.on("userLoggedIn", (user) => updateHeader(user));
userState.on("userLoggedIn", (user) => updateSidebar(user));
```

#### 2. Strategy Pattern

알고리즘을 캡슐화하고 교체 가능하게 만듦

```javascript
class PaymentProcessor {
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount, details) {
    return this.strategy.pay(amount, details);
  }
}

// 결제 방식을 동적으로 변경
processor.setStrategy(new CreditCardStrategy());
processor.setStrategy(new PayPalStrategy());
```

#### 3. Command Pattern

요청을 객체로 캡슐화 (실행 취소 가능)

```javascript
class EditorInvoker {
  execute(command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();
    command.undo();
  }
}

// Undo/Redo 기능 구현
invoker.execute(new WriteCommand(editor, "Hello"));
invoker.undo(); // 'Hello' 삭제
```

## 🏛️ 아키텍처 패턴

### 1. Module Pattern

코드를 모듈로 분리하고 캡슐화

```javascript
class APIModule {
  // Private 메서드 (ES2022 문법)
  #makeRequest(endpoint) {
    return fetch(`${this.baseURL}${endpoint}`);
  }

  // Public 메서드
  async get(endpoint) {
    return this.#makeRequest(endpoint);
  }
}
```

### 2. MVC Pattern

Model-View-Controller 분리

```javascript
// Model: 데이터와 비즈니스 로직
class Model {
  set(key, value) {
    this.data[key] = value;
    this.notify({ key, value });
  }
}

// View: UI 표현
class View {
  update(change) {
    this.render(change);
  }
}

// Controller: 사용자 입력 처리
class Controller {
  handleUserInput(input) {
    this.model.set(input.key, input.value);
  }
}
```

### 3. Pub/Sub Pattern

발행/구독 - 느슨한 결합으로 컴포넌트 간 통신

```javascript
class PubSub {
  subscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);

    return {
      unsubscribe: () => {
        /* 구독 해제 */
      },
    };
  }

  publish(eventName, data) {
    this.events[eventName]?.forEach((callback) => callback(data));
  }
}

// 전역 이벤트 버스로 활용
eventBus.subscribe("user:login", (user) => updateUI(user));
eventBus.publish("user:login", userData);
```

## 💼 실무 활용 사례

### 1. React와 패턴들

```javascript
// HOC (Higher-Order Component) - Decorator 패턴
const withAuth = (Component) => (props) => {
  const [user, setUser] = useState(null);
  // 인증 로직
  return user ? <Component {...props} /> : <Login />;
};

// Context API - Observer 패턴
const UserContext = createContext();
const useUser = () => useContext(UserContext);

// Custom Hooks - Strategy 패턴
const usePayment = (strategy) => {
  return useMemo(() => new PaymentProcessor(strategy), [strategy]);
};
```

### 2. Node.js와 패턴들

```javascript
// Middleware Pattern - Chain of Responsibility
app.use(authMiddleware);
app.use(loggingMiddleware);
app.use(errorHandlingMiddleware);

// Module Pattern - CommonJS/ES Modules
export class DatabaseService {
  static getInstance() {
    return (DatabaseService.instance ||= new DatabaseService());
  }
}

// Event-driven Architecture - Observer
const EventEmitter = require("events");
class OrderService extends EventEmitter {
  createOrder(order) {
    // 주문 생성 로직
    this.emit("order:created", order);
  }
}
```

## 🚀 실행 방법

```bash
node design-patterns.js
```

## 📊 패턴 선택 가이드

### 언제 사용할까?

| 패턴      | 사용 시기         | 예시 상황                  |
| --------- | ----------------- | -------------------------- |
| Singleton | 전역 상태 관리    | Logger, Config, Cache      |
| Factory   | 조건부 객체 생성  | 다형성이 필요한 경우       |
| Observer  | 상태 변화 알림    | UI 업데이트, 이벤트 시스템 |
| Strategy  | 알고리즘 교체     | 결제 방식, 정렬 방식       |
| Command   | 실행 취소 필요    | 에디터, 트랜잭션           |
| Facade    | 복잡한 API 단순화 | 라이브러리 래핑            |

### 성능 고려사항

#### 메모리 효율성

```javascript
// ✅ WeakMap 사용으로 메모리 누수 방지
const observers = new WeakMap();

// ✅ 이벤트 리스너 정리
class Component {
  destroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
```

#### 실행 성능

```javascript
// ✅ 지연 초기화
class ExpensiveService {
  get instance() {
    return (this._instance ||= this.createInstance());
  }
}

// ✅ 캐싱으로 중복 계산 방지
class CachedFactory {
  create(type) {
    return this.cache.get(type) || this.cache.set(type, new type()).get(type);
  }
}
```

## 🛠 도구와 라이브러리

### 패턴 구현 도구

- **RxJS**: Observer 패턴의 강력한 구현체
- **Lodash**: Functional programming 패턴들
- **EventEmitter**: Node.js 내장 Observer 구현체
- **Proxy**: Decorator/Proxy 패턴을 위한 ES6 기능

### 상태 관리 라이브러리

```javascript
// Redux - Command + Observer 패턴
const store = createStore(reducer);
store.dispatch({ type: "INCREMENT" }); // Command
store.subscribe(listener); // Observer

// MobX - Observer 패턴
class TodoStore {
  @observable todos = [];
  @action addTodo = (todo) => this.todos.push(todo);
}
```

## 🏆 베스트 프랙티스

### 1. 패턴 오버엔지니어링 방지

```javascript
// ❌ 단순한 함수를 과도하게 패턴화
class SimpleCalculator {
  constructor() {
    this.strategy = new AdditionStrategy();
  }
}

// ✅ 단순한 경우는 단순하게
const add = (a, b) => a + b;
```

### 2. 적절한 추상화 수준

```javascript
// ✅ 필요한 만큼만 추상화
class APIService {
  // 자주 변경되는 부분만 Strategy 패턴 적용
  setAuthStrategy(strategy) {
    this.authStrategy = strategy;
  }

  // 안정적인 부분는 직접 구현
  makeRequest(url) {
    return fetch(url, this.authStrategy.getHeaders());
  }
}
```

### 3. 타입 안전성 (TypeScript)

```typescript
interface PaymentStrategy {
  pay(amount: number, details: PaymentDetails): Promise<PaymentResult>;
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  async processPayment(
    amount: number,
    details: PaymentDetails
  ): Promise<PaymentResult> {
    return this.strategy.pay(amount, details);
  }
}
```

## 🎯 마스터 체크리스트

- [ ] Singleton 패턴으로 전역 상태를 안전하게 관리한다
- [ ] Factory 패턴으로 객체 생성을 캡슐화한다
- [ ] Observer 패턴으로 느슨한 결합을 구현한다
- [ ] Strategy 패턴으로 알고리즘을 교체 가능하게 만든다
- [ ] Command 패턴으로 실행 취소 기능을 구현한다
- [ ] MVC 패턴으로 관심사를 분리한다
- [ ] Module 패턴으로 코드를 캡슐화한다
- [ ] 적절한 패턴을 선택하여 과도한 복잡성을 피한다
