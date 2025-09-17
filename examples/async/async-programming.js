/**
 * 비동기 프로그래밍(Asynchronous Programming) 완전 정복
 * 
 * 콜백 -> Promise -> async/await로 진화해온 자바스크립트 비동기 처리의
 * 모든 패턴을 실무 관점에서 학습합니다.
 */

console.log('⚡ 비동기 프로그래밍 학습 시작!');

// ===== 1. 콜백(Callback) 패턴 =====
console.log('\n📞 1. 콜백 패턴');

function fetchUserData(userId, callback) {
    console.log(`사용자 ${userId} 데이터 요청 중...`);
    
    setTimeout(() => {
        const userData = {
            id: userId,
            name: `사용자${userId}`,
            email: `user${userId}@example.com`
        };
        callback(null, userData); // 성공 시: (error, data)
    }, 1000);
}

function fetchUserPosts(userId, callback) {
    console.log(`사용자 ${userId}의 게시글 요청 중...`);
    
    setTimeout(() => {
        const posts = [
            { id: 1, title: '첫 번째 게시글', userId },
            { id: 2, title: '두 번째 게시글', userId }
        ];
        callback(null, posts);
    }, 800);
}

// 콜백 헬(Callback Hell) 예시
fetchUserData(1, (error, user) => {
    if (error) {
        console.error('사용자 데이터 에러:', error);
        return;
    }
    
    console.log('사용자 정보:', user);
    
    fetchUserPosts(user.id, (error, posts) => {
        if (error) {
            console.error('게시글 에러:', error);
            return;
        }
        
        console.log('게시글 목록:', posts);
        
        // 더 깊은 중첩이 생기면 콜백 헬이 됨...
    });
});

// ===== 2. Promise 패턴 =====
console.log('\n🤝 2. Promise 패턴');

function fetchUserDataPromise(userId) {
    return new Promise((resolve, reject) => {
        console.log(`Promise: 사용자 ${userId} 데이터 요청 중...`);
        
        setTimeout(() => {
            if (userId <= 0) {
                reject(new Error('유효하지 않은 사용자 ID'));
                return;
            }
            
            const userData = {
                id: userId,
                name: `사용자${userId}`,
                email: `user${userId}@example.com`
            };
            resolve(userData);
        }, 500);
    });
}

function fetchUserPostsPromise(userId) {
    return new Promise((resolve, reject) => {
        console.log(`Promise: 사용자 ${userId}의 게시글 요청 중...`);
        
        setTimeout(() => {
            const posts = [
                { id: 1, title: 'Promise 게시글 1', userId },
                { id: 2, title: 'Promise 게시글 2', userId }
            ];
            resolve(posts);
        }, 300);
    });
}

// Promise 체이닝
fetchUserDataPromise(2)
    .then(user => {
        console.log('Promise 사용자 정보:', user);
        return fetchUserPostsPromise(user.id);
    })
    .then(posts => {
        console.log('Promise 게시글 목록:', posts);
    })
    .catch(error => {
        console.error('Promise 에러:', error.message);
    });

// ===== 3. Promise 고급 활용 =====
console.log('\n🚀 3. Promise 고급 활용');

// Promise.all - 병렬 처리
const parallelRequests = [
    fetchUserDataPromise(3),
    fetchUserDataPromise(4),
    fetchUserDataPromise(5)
];

Promise.all(parallelRequests)
    .then(users => {
        console.log('Promise.all 결과 - 모든 사용자:', users.length, '명');
        users.forEach(user => console.log(`- ${user.name}`));
    })
    .catch(error => {
        console.error('Promise.all 에러:', error.message);
    });

// Promise.allSettled - 일부 실패해도 모든 결과 확인
const mixedRequests = [
    fetchUserDataPromise(6),
    fetchUserDataPromise(-1), // 에러 발생
    fetchUserDataPromise(7)
];

Promise.allSettled(mixedRequests)
    .then(results => {
        console.log('Promise.allSettled 결과:');
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`  요청 ${index + 1}: 성공 -`, result.value.name);
            } else {
                console.log(`  요청 ${index + 1}: 실패 -`, result.reason.message);
            }
        });
    });

// Promise.race - 가장 빠른 응답 사용
const raceRequests = [
    new Promise(resolve => setTimeout(() => resolve('빠른 응답'), 100)),
    new Promise(resolve => setTimeout(() => resolve('느린 응답'), 500))
];

Promise.race(raceRequests)
    .then(winner => {
        console.log('Promise.race 승자:', winner);
    });

// ===== 4. async/await 패턴 =====
console.log('\n✨ 4. async/await 패턴');

async function fetchUserProfile(userId) {
    try {
        console.log(`async/await: 사용자 ${userId} 프로필 조회 중...`);
        
        const user = await fetchUserDataPromise(userId);
        console.log('async/await 사용자:', user.name);
        
        const posts = await fetchUserPostsPromise(userId);
        console.log('async/await 게시글 수:', posts.length);
        
        return {
            user,
            posts,
            totalPosts: posts.length
        };
        
    } catch (error) {
        console.error('async/await 에러:', error.message);
        throw error;
    }
}

// async 함수 사용
fetchUserProfile(8).then(profile => {
    console.log('완성된 프로필:', {
        name: profile.user.name,
        postsCount: profile.totalPosts
    });
});

// ===== 5. 실무 패턴: API 요청 관리자 =====
console.log('\n💼 5. 실무 패턴: API 요청 관리자');

class ApiManager {
    constructor(baseUrl = 'https://jsonplaceholder.typicode.com') {
        this.baseUrl = baseUrl;
        this.requestCache = new Map();
    }
    
    // 재시도 로직이 있는 fetch
    async fetchWithRetry(url, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`API 요청 시도 ${attempt}: ${url}`);
                
                // 실제 환경에서는 fetch를 사용하지만, 예제에서는 가짜 응답
                await new Promise(resolve => setTimeout(resolve, 200));
                
                if (Math.random() > 0.7 && attempt < maxRetries) {
                    throw new Error('네트워크 에러 (시뮬레이션)');
                }
                
                return {
                    ok: true,
                    json: async () => ({ id: 1, title: '가짜 데이터' })
                };
                
            } catch (error) {
                console.log(`시도 ${attempt} 실패:`, error.message);
                
                if (attempt === maxRetries) {
                    throw new Error(`모든 재시도 실패: ${error.message}`);
                }
                
                // 지수 백오프 (재시도 간격을 점점 늘림)
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // 캐싱 기능이 있는 GET 요청
    async get(endpoint, useCache = true) {
        const cacheKey = `GET:${endpoint}`;
        
        if (useCache && this.requestCache.has(cacheKey)) {
            console.log('캐시에서 반환:', endpoint);
            return this.requestCache.get(cacheKey);
        }
        
        try {
            const response = await this.fetchWithRetry(`${this.baseUrl}${endpoint}`);
            const data = await response.json();
            
            if (useCache) {
                this.requestCache.set(cacheKey, data);
            }
            
            return data;
            
        } catch (error) {
            console.error('API GET 에러:', error.message);
            throw error;
        }
    }
    
    // 병렬 요청 처리
    async getBatch(endpoints) {
        const requests = endpoints.map(endpoint => this.get(endpoint));
        
        try {
            const results = await Promise.allSettled(requests);
            return results.map((result, index) => ({
                endpoint: endpoints[index],
                status: result.status,
                data: result.status === 'fulfilled' ? result.value : null,
                error: result.status === 'rejected' ? result.reason.message : null
            }));
        } catch (error) {
            console.error('배치 요청 에러:', error.message);
            throw error;
        }
    }
}

// API 매니저 사용 예제
async function demonstrateApiManager() {
    const api = new ApiManager();
    
    try {
        // 단일 요청
        const post = await api.get('/posts/1');
        console.log('API 응답:', post);
        
        // 캐시된 요청 (두 번째 호출)
        const cachedPost = await api.get('/posts/1');
        console.log('캐시된 응답:', cachedPost);
        
        // 병렬 요청
        const batchResults = await api.getBatch(['/posts/1', '/posts/2', '/posts/3']);
        console.log('배치 요청 결과:');
        batchResults.forEach(result => {
            console.log(`  ${result.endpoint}: ${result.status}`);
        });
        
    } catch (error) {
        console.error('API 매니저 데모 에러:', error.message);
    }
}

// 6초 후 실행 (다른 예제들이 완료된 후)
setTimeout(demonstrateApiManager, 6000);

// ===== 6. 에러 처리 패턴 =====
console.log('\n🛡️ 6. 고급 에러 처리');

class AsyncError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'AsyncError';
        this.code = code;
        this.details = details;
    }
}

async function robustAsyncFunction() {
    try {
        // 여러 비동기 작업을 안전하게 처리
        const operations = [
            fetchUserDataPromise(9),
            fetchUserDataPromise(10),
            fetchUserDataPromise(-2) // 의도적 에러
        ];
        
        const results = await Promise.allSettled(operations);
        
        const successes = results.filter(r => r.status === 'fulfilled');
        const failures = results.filter(r => r.status === 'rejected');
        
        if (failures.length > 0) {
            console.log(`⚠️ ${failures.length}개의 작업이 실패했습니다.`);
            failures.forEach((failure, index) => {
                console.log(`   실패 ${index + 1}: ${failure.reason.message}`);
            });
        }
        
        console.log(`✅ ${successes.length}개의 작업이 성공했습니다.`);
        return successes.map(s => s.value);
        
    } catch (error) {
        throw new AsyncError(
            '비동기 작업 처리 중 예상치 못한 에러',
            'UNEXPECTED_ERROR',
            { originalError: error.message }
        );
    }
}

robustAsyncFunction()
    .then(results => {
        console.log('안정적인 비동기 함수 결과:', results.length, '개');
    })
    .catch(error => {
        if (error instanceof AsyncError) {
            console.error('커스텀 에러:', error.message, `(코드: ${error.code})`);
        } else {
            console.error('일반 에러:', error.message);
        }
    });

setTimeout(() => {
    console.log('\n✅ 비동기 프로그래밍 학습 완료! 모든 패턴을 마스터했습니다! 🎉');
}, 8000);
