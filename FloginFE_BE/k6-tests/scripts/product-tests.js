import http from 'k6/http';
import { sleep, check } from 'k6';
const BASE_URL = 'http://localhost:8080';

export const options = {
    vus: 100,          // số user đồng thời
    duration: '60s',   // chạy 60s
};

export default function () {
    const loginPayloads = JSON.stringify({
        username: "admin123",
        password: "admin123"
    })
    const loginHeaders = {
        headers: {
            'Content-type': 'application/json',
        }
    }
    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayloads, loginHeaders )
    check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'receive token': (r) => r.json('accessToken') !== undefined
    })

    if (loginRes.status !== 200) {
        console.log('Login failed:', loginRes.body);
        return;
    }
    const token = loginRes.json('accessToken');
    const productHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    const productRes = http.get(`${BASE_URL}/products`, productHeaders);
    check(productRes, {
        'products status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has products data': (r) => r.json().length > 0,
    });

    sleep(1);
}
