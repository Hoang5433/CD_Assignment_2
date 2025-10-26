# Mock API Mode - Hướng dẫn sử dụng

## 🎯 Mục đích
File `src/services/api.js` đã được cập nhật để hỗ trợ **MOCK MODE** - cho phép test giao diện Product Manager mà không cần backend running.

## 🔧 Cấu hình

### Bật Mock Mode (hiện tại)
```javascript
const MOCK_MODE = true; // Sử dụng mock data
```

### Tắt Mock Mode (khi có backend)
```javascript
const MOCK_MODE = false; // Sử dụng API thật
```

## ✨ Features với Mock Mode

### 1. **Login**
- ✅ Luôn login thành công với bất kỳ username/password
- ✅ Trả về mock token: `'mock-jwt-token-123456'`
- ✅ Username được lưu và hiển thị

### 2. **Product List**
Mock data có sẵn 3 sản phẩm:
```javascript
[
  { id: 1, name: 'iPhone 15 Pro', price: 999.99, description: '...' },
  { id: 2, name: 'MacBook Pro M3', price: 1999.99, description: '...' },
  { id: 3, name: 'AirPods Pro', price: 249.99, description: '...' }
]
```

### 3. **Create Product**
- ✅ Thêm sản phẩm mới vào mock array
- ✅ Auto-increment ID (bắt đầu từ 4)
- ✅ Parse price thành float

### 4. **Update Product**
- ✅ Tìm product theo ID và update
- ✅ Merge data cũ với data mới
- ✅ Trả về error nếu không tìm thấy

### 5. **Delete Product**
- ✅ Xóa product khỏi mock array
- ✅ Trả về error nếu không tìm thấy

## 🚀 Cách sử dụng

### Test với Mock Data (không cần backend)
1. Đảm bảo `MOCK_MODE = true` trong `api.js`
2. Chạy frontend:
```powershell
npm start
```
3. Mở http://localhost:3000
4. Login với **bất kỳ** username/password
5. Test tất cả CRUD operations

### Chuyển sang API thật
1. Đổi `MOCK_MODE = false` trong `api.js`
2. Đảm bảo backend đang chạy ở port 8080
3. Restart frontend
4. Login với credentials thật

## 📊 So sánh

| Feature | Mock Mode | API Mode |
|---------|-----------|----------|
| **Backend required** | ❌ Không cần | ✅ Cần chạy |
| **Login** | Luôn thành công | Xác thực thật |
| **Data** | Mock array | Database |
| **Persistence** | Mất khi reload | Lưu vĩnh viễn |
| **Speed** | ⚡ Instant | 🌐 Network delay |
| **Good for** | UI testing, demo | Production |

## 💡 Lợi ích Mock Mode

✅ **Test UI ngay lập tức** - không chờ backend  
✅ **Demo dễ dàng** - không cần setup database  
✅ **Develop độc lập** - frontend/backend tách biệt  
✅ **Debug nhanh** - không có network issues  
✅ **Perfect cho testing** - data đoán trước được  

## 🎬 Flow hoạt động

### Mock Mode Flow:
```
Login Form → Mock authService.login() → Success ✅
Product Manager → Mock productService.getAll() → 3 products
Add Product → Mock create() → Push to array → Success
Edit Product → Mock update() → Update array → Success
Delete Product → Mock delete() → Remove from array → Success
```

### API Mode Flow:
```
Login Form → API POST /auth/login → Backend validation
Product Manager → API GET /products → Database query
Add Product → API POST /products → Insert DB
Edit Product → API PUT /products/:id → Update DB
Delete Product → API DELETE /products/:id → Delete DB
```

## 🔄 Switching Example

### Frontend only:
```javascript
// api.js
const MOCK_MODE = true; // ← Frontend tự test
```

### With backend:
```javascript
// api.js
const MOCK_MODE = false; // ← Connect to backend
```

```powershell
# Backend terminal
cd backend
mvn spring-boot:run

# Frontend terminal
cd frontend
npm start
```

## 🐛 Troubleshooting

### "Cannot read property 'data' of undefined"
→ Đảm bảo Promise.resolve() trả về object có property `data`

### Mock data không persist
→ Đúng vậy! Mock data lưu trong memory, reload page sẽ mất
→ Dùng API mode nếu cần persistence

### Login thất bại
→ Check MOCK_MODE = true
→ Check console.log để debug

## 📝 Customize Mock Data

Muốn thêm/sửa mock products:
```javascript
// Trong api.js
let mockProducts = [
  { id: 1, name: 'Your Product', price: 99.99, description: 'Desc' },
  // Thêm products khác...
];
```

---