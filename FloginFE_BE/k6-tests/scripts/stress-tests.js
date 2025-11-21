import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8080';

export const options = {
    stages: [
        { duration: '30s', target: 50 },     // Warm-up nhanh
        { duration: '30s', target: 100 },    // Tăng load
        { duration: '30s', target: 200 },    // Stress test
        { duration: '30s', target: 300 },    // Peak load
        { duration: '1m', target: 0 },       // Recovery
    ],
    thresholds: {
        http_req_duration: ['p(95)<30000'], //"95% requests phải có response time < 30 giây" // chua sai redis nen kho toi uu hoa db
        http_req_failed: ['rate<0.2'], //"Tỷ lệ request failed phải dưới 20%"
    },
};

export default function () {
    const payload = JSON.stringify({
        username: "admin123",
        password: "admin123"
    });

    const login = http.post(`${BASE_URL}/auth/login`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (login.status !== 200) {
        sleep(0.5);
        return;
    }

    const token = login.json('accessToken');
    const res = http.get(`${BASE_URL}/products`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    check(res, {
        'status 200': (r) => r.status === 200,
    });

    sleep(0.5); // Giảm sleep time
}