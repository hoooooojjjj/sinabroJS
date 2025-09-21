/**
 * 실무 디자인 패턴과 아키텍처 패턴 완전 정복
 * 
 * GoF 디자인 패턴부터 모던 JavaScript 아키텍처 패턴까지
 * 실무에서 바로 활용할 수 있는 모든 패턴을 학습합니다.
 */

console.log('🏗️ 디자인 패턴 학습 시작!');

// ===== 1. 생성 패턴 (Creational Patterns) =====
console.log('\n🛠️ 1. 생성 패턴들');

// 1.1 Singleton Pattern - 단일 인스턴스 보장
class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        
        this.logs = [];
        this.level = 'info';
        Logger.instance = this;
        
        return this;
    }
    
    log(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }
    
    getLogs() {
        return [...this.logs]; // 불변성 유지
    }
    
    setLevel(level) {
        this.level = level;
    }
    
    // 정적 메서드로 인스턴스 접근
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}

// 테스트: 항상 같은 인스턴스 반환
const logger1 = new Logger();
const logger2 = new Logger();
const logger3 = Logger.getInstance();

logger1.log('info', '첫 번째 로그');
logger2.log('warning', '두 번째 로그');

console.log('Singleton 테스트:', logger1 === logger2); // true
console.log('총 로그 수:', logger3.getLogs().length); // 2

// 1.2 Factory Pattern - 객체 생성을 캡슐화
class UserFactory {
    static createUser(type, userData) {
        const userTypes = {
            admin: () => new AdminUser(userData),
            regular: () => new RegularUser(userData),
            guest: () => new GuestUser(userData)
        };
        
        const createUserFn = userTypes[type];
        if (!createUserFn) {
            throw new Error(`지원하지 않는 사용자 타입: ${type}`);
        }
        
        return createUserFn();
    }
}

class BaseUser {
    constructor({ name, email }) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }
    
    getInfo() {
        return `${this.name} (${this.email})`;
    }
}

class AdminUser extends BaseUser {
    constructor(userData) {
        super(userData);
        this.role = 'admin';
        this.permissions = ['read', 'write', 'delete', 'manage'];
    }
    
    manageUsers() {
        return '사용자 관리 기능 실행';
    }
}

class RegularUser extends BaseUser {
    constructor(userData) {
        super(userData);
        this.role = 'user';
        this.permissions = ['read', 'write'];
    }
    
    createPost() {
        return '게시글 작성 기능 실행';
    }
}

class GuestUser extends BaseUser {
    constructor(userData) {
        super(userData);
        this.role = 'guest';
        this.permissions = ['read'];
    }
    
    browse() {
        return '게시글 조회 기능 실행';
    }
}

// Factory 패턴 사용
const admin = UserFactory.createUser('admin', { name: '관리자', email: 'admin@test.com' });
const user = UserFactory.createUser('regular', { name: '사용자', email: 'user@test.com' });
const guest = UserFactory.createUser('guest', { name: '게스트', email: 'guest@test.com' });

console.log('Factory 패턴:', admin.getInfo(), admin.role);

// 1.3 Builder Pattern - 복잡한 객체를 단계별로 생성
class QueryBuilder {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.query = {
            select: [],
            from: '',
            where: [],
            orderBy: [],
            limit: null,
            offset: null
        };
        return this;
    }
    
    select(...columns) {
        this.query.select.push(...columns);
        return this;
    }
    
    from(table) {
        this.query.from = table;
        return this;
    }
    
    where(condition) {
        this.query.where.push(condition);
        return this;
    }
    
    orderBy(column, direction = 'ASC') {
        this.query.orderBy.push(`${column} ${direction}`);
        return this;
    }
    
    limit(count) {
        this.query.limit = count;
        return this;
    }
    
    offset(count) {
        this.query.offset = count;
        return this;
    }
    
    build() {
        const { select, from, where, orderBy, limit, offset } = this.query;
        
        let sql = `SELECT ${select.join(', ')} FROM ${from}`;
        
        if (where.length > 0) {
            sql += ` WHERE ${where.join(' AND ')}`;
        }
        
        if (orderBy.length > 0) {
            sql += ` ORDER BY ${orderBy.join(', ')}`;
        }
        
        if (limit) {
            sql += ` LIMIT ${limit}`;
        }
        
        if (offset) {
            sql += ` OFFSET ${offset}`;
        }
        
        return sql;
    }
}

// Builder 패턴 사용 - 메서드 체이닝
const query = new QueryBuilder()
    .select('id', 'name', 'email')
    .from('users')
    .where('active = 1')
    .where('age > 18')
    .orderBy('name')
    .limit(10)
    .offset(0)
    .build();

console.log('Builder 패턴 SQL:', query);

// ===== 2. 구조 패턴 (Structural Patterns) =====
console.log('\n🔗 2. 구조 패턴들');

// 2.1 Adapter Pattern - 호환되지 않는 인터페이스를 연결
class LegacyAPI {
    getData() {
        return {
            user_name: 'John Doe',
            user_email: 'john@example.com',
            user_age: 30
        };
    }
}

class ModernAPIAdapter {
    constructor(legacyAPI) {
        this.legacyAPI = legacyAPI;
    }
    
    getUser() {
        const data = this.legacyAPI.getData();
        
        // 레거시 형식을 모던 형식으로 변환
        return {
            name: data.user_name,
            email: data.user_email,
            age: data.user_age,
            id: Math.random().toString(36).substr(2, 9)
        };
    }
}

// Adapter 사용
const legacyAPI = new LegacyAPI();
const adapter = new ModernAPIAdapter(legacyAPI);
console.log('Adapter 패턴:', adapter.getUser());

// 2.2 Decorator Pattern - 객체에 동적으로 기능 추가
class Coffee {
    constructor() {
        this.description = '기본 커피';
        this.cost = 2.0;
    }
    
    getDescription() {
        return this.description;
    }
    
    getCost() {
        return this.cost;
    }
}

// 데코레이터 기본 클래스
class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    getDescription() {
        return this.coffee.getDescription();
    }
    
    getCost() {
        return this.coffee.getCost();
    }
}

// 구체적인 데코레이터들
class MilkDecorator extends CoffeeDecorator {
    getDescription() {
        return this.coffee.getDescription() + ' + 우유';
    }
    
    getCost() {
        return this.coffee.getCost() + 0.5;
    }
}

class SugarDecorator extends CoffeeDecorator {
    getDescription() {
        return this.coffee.getDescription() + ' + 설탕';
    }
    
    getCost() {
        return this.coffee.getCost() + 0.2;
    }
}

class WhipDecorator extends CoffeeDecorator {
    getDescription() {
        return this.coffee.getDescription() + ' + 휘핑크림';
    }
    
    getCost() {
        return this.coffee.getCost() + 0.8;
    }
}

// Decorator 패턴 사용 - 동적 기능 조합
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhipDecorator(coffee);

console.log('Decorator 패턴:', coffee.getDescription(), `$${coffee.getCost()}`);

// 2.3 Facade Pattern - 복잡한 시스템에 간단한 인터페이스 제공
class AudioSystem {
    turnOn() { return '오디오 시스템 켜짐'; }
    turnOff() { return '오디오 시스템 꺼짐'; }
    setVolume(level) { return `볼륨 ${level}로 설정`; }
}

class VideoSystem {
    turnOn() { return '비디오 시스템 켜짐'; }
    turnOff() { return '비디오 시스템 꺼짐'; }
    setResolution(resolution) { return `해상도 ${resolution}로 설정`; }
}

class LightingSystem {
    turnOn() { return '조명 켜짐'; }
    turnOff() { return '조명 꺼짐'; }
    dim(level) { return `조명 ${level}%로 조절`; }
}

// Facade - 복잡한 홈 시어터 시스템을 간단하게 제어
class HomeTheaterFacade {
    constructor() {
        this.audio = new AudioSystem();
        this.video = new VideoSystem();
        this.lighting = new LightingSystem();
    }
    
    watchMovie() {
        const actions = [];
        actions.push(this.lighting.dim(10));
        actions.push(this.audio.turnOn());
        actions.push(this.audio.setVolume(8));
        actions.push(this.video.turnOn());
        actions.push(this.video.setResolution('4K'));
        actions.push('영화 감상 모드 준비 완료!');
        
        return actions;
    }
    
    endMovie() {
        const actions = [];
        actions.push(this.video.turnOff());
        actions.push(this.audio.turnOff());
        actions.push(this.lighting.turnOn());
        actions.push('시스템 종료 완료!');
        
        return actions;
    }
}

const homeTheater = new HomeTheaterFacade();
console.log('Facade 패턴 - 영화 모드:', homeTheater.watchMovie());

// ===== 3. 행동 패턴 (Behavioral Patterns) =====
console.log('\n🎭 3. 행동 패턴들');

// 3.1 Observer Pattern - 객체 간 일대다 의존성 정의
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(
            listener => listener !== listenerToRemove
        );
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => {
            listener(...args);
        });
    }
    
    once(event, listener) {
        const onceWrapper = (...args) => {
            listener(...args);
            this.off(event, onceWrapper);
        };
        
        this.on(event, onceWrapper);
    }
}

// Observer 패턴 실사용 예제 - 사용자 상태 관리
class UserStateManager extends EventEmitter {
    constructor() {
        super();
        this.currentUser = null;
    }
    
    login(user) {
        this.currentUser = user;
        this.emit('userLoggedIn', user);
    }
    
    logout() {
        const prevUser = this.currentUser;
        this.currentUser = null;
        this.emit('userLoggedOut', prevUser);
    }
    
    updateProfile(updates) {
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...updates };
            this.emit('profileUpdated', this.currentUser);
        }
    }
}

const userState = new UserStateManager();

// 다양한 컴포넌트들이 사용자 상태 변화를 구독
userState.on('userLoggedIn', (user) => {
    console.log('Header: 사용자 로그인 -', user.name);
});

userState.on('userLoggedIn', (user) => {
    console.log('Sidebar: 메뉴 업데이트 -', user.role);
});

userState.on('userLoggedOut', () => {
    console.log('App: 로그아웃 처리 완료');
});

// 테스트
userState.login({ name: '김개발', role: 'developer' });

// 3.2 Strategy Pattern - 알고리즘을 캡슐화하고 교체 가능하게 만듦
class PaymentProcessor {
    constructor() {
        this.strategy = null;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    processPayment(amount, details) {
        if (!this.strategy) {
            throw new Error('결제 전략이 설정되지 않았습니다.');
        }
        
        return this.strategy.pay(amount, details);
    }
}

// 다양한 결제 전략들
class CreditCardStrategy {
    pay(amount, details) {
        return `신용카드로 ${amount}원 결제 (카드번호: ${details.cardNumber})`;
    }
}

class PayPalStrategy {
    pay(amount, details) {
        return `PayPal로 ${amount}원 결제 (이메일: ${details.email})`;
    }
}

class BankTransferStrategy {
    pay(amount, details) {
        return `계좌이체로 ${amount}원 결제 (계좌: ${details.accountNumber})`;
    }
}

// Strategy 패턴 사용
const paymentProcessor = new PaymentProcessor();

// 신용카드 결제
paymentProcessor.setStrategy(new CreditCardStrategy());
console.log('Strategy 패턴:', paymentProcessor.processPayment(50000, { cardNumber: '**** **** **** 1234' }));

// PayPal 결제로 전략 변경
paymentProcessor.setStrategy(new PayPalStrategy());
console.log('Strategy 패턴:', paymentProcessor.processPayment(30000, { email: 'user@paypal.com' }));

// 3.3 Command Pattern - 요청을 객체로 캡슐화
class Command {
    execute() {
        throw new Error('execute 메서드를 구현해야 합니다.');
    }
    
    undo() {
        throw new Error('undo 메서드를 구현해야 합니다.');
    }
}

class TextEditor {
    constructor() {
        this.content = '';
    }
    
    write(text) {
        this.content += text;
    }
    
    delete(length) {
        this.content = this.content.slice(0, -length);
    }
    
    getContent() {
        return this.content;
    }
}

// 구체적인 명령들
class WriteCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }
    
    execute() {
        this.editor.write(this.text);
    }
    
    undo() {
        this.editor.delete(this.text.length);
    }
}

class DeleteCommand extends Command {
    constructor(editor, length) {
        super();
        this.editor = editor;
        this.length = length;
        this.deletedText = '';
    }
    
    execute() {
        this.deletedText = this.editor.getContent().slice(-this.length);
        this.editor.delete(this.length);
    }
    
    undo() {
        this.editor.write(this.deletedText);
    }
}

// 명령 실행기 (Invoker)
class EditorInvoker {
    constructor() {
        this.history = [];
        this.currentPosition = -1;
    }
    
    execute(command) {
        // 현재 위치 이후의 히스토리 제거 (새로운 명령 실행 시)
        this.history = this.history.slice(0, this.currentPosition + 1);
        
        command.execute();
        this.history.push(command);
        this.currentPosition++;
    }
    
    undo() {
        if (this.currentPosition >= 0) {
            const command = this.history[this.currentPosition];
            command.undo();
            this.currentPosition--;
        }
    }
    
    redo() {
        if (this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            const command = this.history[this.currentPosition];
            command.execute();
        }
    }
}

// Command 패턴 사용
const editor = new TextEditor();
const invoker = new EditorInvoker();

// 명령들 실행
invoker.execute(new WriteCommand(editor, 'Hello '));
invoker.execute(new WriteCommand(editor, 'World!'));
console.log('Command 패턴 - 작성 후:', editor.getContent());

invoker.execute(new DeleteCommand(editor, 6)); // 'World!' 삭제
console.log('Command 패턴 - 삭제 후:', editor.getContent());

invoker.undo(); // 삭제 취소
console.log('Command 패턴 - Undo 후:', editor.getContent());

invoker.redo(); // 삭제 재실행
console.log('Command 패턴 - Redo 후:', editor.getContent());

// ===== 4. 모던 JavaScript 아키텍처 패턴 =====
console.log('\n🏛️ 4. 아키텍처 패턴들');

// 4.1 Module Pattern - ES6 모듈 시스템
class APIModule {
    constructor() {
        this.baseURL = 'https://api.example.com';
        this.cache = new Map();
    }
    
    // Private 메서드 (# 문법)
    #makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log(`API 요청: ${url}`);
        
        // 실제로는 fetch를 사용
        return Promise.resolve({ 
            data: `${endpoint}의 데이터`,
            timestamp: Date.now()
        });
    }
    
    #setCacheItem(key, data, ttl = 300000) {
        const expireAt = Date.now() + ttl;
        this.cache.set(key, { data, expireAt });
    }
    
    #getCacheItem(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expireAt) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    // Public 메서드
    async get(endpoint) {
        const cached = this.#getCacheItem(endpoint);
        if (cached) {
            console.log('캐시에서 반환:', endpoint);
            return cached;
        }
        
        const data = await this.#makeRequest(endpoint);
        this.#setCacheItem(endpoint, data);
        return data;
    }
    
    async post(endpoint, payload) {
        return this.#makeRequest(endpoint, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
    
    clearCache() {
        this.cache.clear();
    }
}

// Module 사용
const api = new APIModule();
api.get('/users').then(data => {
    console.log('Module 패턴 - API 응답:', data);
});

// 4.2 MVC Pattern - Model-View-Controller
class Model {
    constructor() {
        this.data = {};
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    notify(change) {
        this.observers.forEach(observer => observer.update(change));
    }
    
    set(key, value) {
        const oldValue = this.data[key];
        this.data[key] = value;
        this.notify({ key, value, oldValue });
    }
    
    get(key) {
        return this.data[key];
    }
    
    getAll() {
        return { ...this.data };
    }
}

class View {
    constructor(model) {
        this.model = model;
        this.model.subscribe(this);
    }
    
    update(change) {
        console.log(`View 업데이트: ${change.key} = ${change.value}`);
        this.render();
    }
    
    render() {
        const data = this.model.getAll();
        console.log('현재 상태:', data);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    
    updateData(key, value) {
        this.model.set(key, value);
    }
    
    handleUserInput(input) {
        // 사용자 입력을 처리하고 모델 업데이트
        const { action, key, value } = input;
        
        switch (action) {
            case 'update':
                this.updateData(key, value);
                break;
            case 'reset':
                this.model.data = {};
                this.model.notify({ key: 'all', value: 'reset' });
                break;
            default:
                console.log('알 수 없는 액션:', action);
        }
    }
}

// MVC 패턴 사용
const model = new Model();
const view = new View(model);
const controller = new Controller(model, view);

// 사용자 인터랙션 시뮬레이션
controller.handleUserInput({ action: 'update', key: 'username', value: '김개발' });
controller.handleUserInput({ action: 'update', key: 'role', value: 'developer' });

// 4.3 Pub/Sub Pattern (발행/구독)
class PubSub {
    constructor() {
        this.events = {};
    }
    
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        this.events[eventName].push(callback);
        
        // 구독 해제 함수 반환
        return {
            unsubscribe: () => {
                this.events[eventName] = this.events[eventName].filter(
                    cb => cb !== callback
                );
            }
        };
    }
    
    publish(eventName, data) {
        if (!this.events[eventName]) return;
        
        this.events[eventName].forEach(callback => {
            setTimeout(() => callback(data), 0); // 비동기 실행
        });
    }
    
    clear() {
        this.events = {};
    }
}

// 전역 이벤트 버스
const eventBus = new PubSub();

// 다양한 컴포넌트들이 이벤트를 구독
const headerSubscription = eventBus.subscribe('user:login', (user) => {
    console.log('Header 컴포넌트: 사용자 로그인 -', user.name);
});

const sidebarSubscription = eventBus.subscribe('user:login', (user) => {
    console.log('Sidebar 컴포넌트: 메뉴 업데이트');
});

const notificationSubscription = eventBus.subscribe('user:login', (user) => {
    console.log('Notification: 환영 메시지 표시');
});

// 이벤트 발행
eventBus.publish('user:login', { name: '박개발', id: '12345' });

// 정리 함수
function cleanup() {
    headerSubscription.unsubscribe();
    sidebarSubscription.unsubscribe();
    notificationSubscription.unsubscribe();
    eventBus.clear();
    console.log('🧹 모든 패턴 정리 완료');
}

setTimeout(() => {
    cleanup();
    console.log('\n✅ 디자인 패턴 학습 완료! 소프트웨어 아키텍처의 달인이 되었습니다! 🏗️✨');
}, 2000);
