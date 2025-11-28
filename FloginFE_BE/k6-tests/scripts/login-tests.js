import http from 'k6/http'
import {sleep, check} from 'k6'
const BASE_URL = 'http://localhost:8080';
export const options = {
    stages: [
        { duration: '20s', target: 100 },   // 100 users
        { duration: '20s', target: 500 },   // 500 users
        { duration: '20s', target: 1000 },  // 1000 users
        { duration: '10s', target: 0 },     // cool down
    ],
}
export default function (){
    const payload = JSON.stringify({
        username: "admin123",
        password: "admin123"
    })
    const params = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const res = http.post(`${BASE_URL}/auth/login`, payload, params )
    check(res, {
        'status 200': (r) => r.status === 200,
        'response not empty': (r) => r.body && r.body.length > 0,
    })
    if (res.status !== 200) {
        console.log('Error res:', res.body);
    }
    sleep(1)
}
