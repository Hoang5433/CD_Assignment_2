# Product Manager - Tài liệu hướng dẫn

## 🎯 Tính năng đã hoàn thành

### 1. **Login với API Integration**
- ✅ Form đăng nhập với username/password
- ✅ Gọi API backend để xác thực
- ✅ Lưu token vào localStorage
- ✅ Hiển thị error message khi đăng nhập thất bại
- ✅ Loading state trong quá trình đăng nhập
- ✅ Chuyển sang Product Manager sau khi login thành công

### 2. **Product Manager - CRUD đầy đủ**

#### ✨ Các chức năng:
- ✅ **CREATE**: Thêm sản phẩm mới
- ✅ **READ**: Hiển thị danh sách sản phẩm trong bảng
- ✅ **UPDATE**: Chỉnh sửa thông tin sản phẩm
- ✅ **DELETE**: Xóa sản phẩm (có confirm dialog)

#### 📊 Thông tin sản phẩm hiển thị:
- **ID** - Mã sản phẩm
- **Tên sản phẩm** - Product name
- **Giá** - Price (hiển thị dạng $XX.XX)
- **Mô tả** - Description (tùy chọn)
- **Thao tác** - Nút Sửa và Xóa

### 3. **Giao diện Product Manager**

#### Header:
- Tiêu đề "Product Manager"
- Nút "Thêm sản phẩm mới" (màu gradient tím)

#### Form thêm/sửa:
- Form hiển thị khi click "Thêm mới" hoặc "Sửa"
- 3 trường input:
  - **Tên sản phẩm*** (required)
  - **Giá*** (required, type number)
  - **Mô tả** (optional, textarea)
- Nút "Thêm mới" / "Cập nhật" và "Hủy"

#### Bảng danh sách:
- Table với header màu gradient
- Hover effect cho từng row
- Nút Sửa (màu xanh) và Xóa (màu đỏ) cho mỗi sản phẩm
- Responsive design

### 4. **App Header với Logout**
- Hiển thị tên user đăng nhập
- Nút Đăng xuất (xóa token và quay về Login)
- Gradient background

## 🎨 CSS3 Animations đã triển khai

### Animations:
1. **fadeIn** - Fade in khi load component
2. **slideIn** - Slide từ trái sang phải
3. **pulse** - Hiệu ứng nhấp nháy cho loading

### Transitions:
- Button hover: transform + box-shadow (0.3s)
- Table row hover: background + scale
- Input focus: border-color + shadow
- Form animations: fadeIn + slideIn

## 📡 API Endpoints sử dụng

```javascript
// Auth
POST /api/auth/login
Body: { username, password }
Response: { token, ...userData }

// Products
GET    /api/products           // Lấy danh sách
POST   /api/products           // Thêm mới
PUT    /api/products/:id       // Cập nhật
DELETE /api/products/:id       // Xóa
```

## 🚀 Hướng dẫn sử dụng

### 1. Đăng nhập
```
1. Nhập username và password
2. Click "Login"
3. Hệ thống xác thực và lưu token
4. Chuyển đến Product Manager
```

### 2. Xem danh sách sản phẩm
```
- Danh sách hiển thị dạng bảng
- Có thông tin: ID, Tên, Giá, Mô tả, Thao tác
- Hover vào row để xem effect
```

### 3. Thêm sản phẩm mới
```
1. Click "Thêm sản phẩm mới"
2. Điền thông tin vào form:
   - Tên sản phẩm (bắt buộc)
   - Giá (bắt buộc)
   - Mô tả (tùy chọn)
3. Click "Thêm mới"
4. Hiển thị thông báo thành công
5. Danh sách tự động refresh
```

### 4. Sửa sản phẩm
```
1. Click nút "Sửa" trên row sản phẩm
2. Form hiển thị với dữ liệu hiện tại
3. Chỉnh sửa thông tin
4. Click "Cập nhật"
5. Hiển thị thông báo thành công
```

### 5. Xóa sản phẩm
```
1. Click nút "Xóa" trên row sản phẩm
2. Confirm dialog hiển thị
3. Click "OK" để xác nhận xóa
4. Hiển thị thông báo thành công
```

### 6. Đăng xuất
```
1. Click nút "Đăng xuất" ở header
2. Token bị xóa khỏi localStorage
3. Quay về trang Login
```

## 📂 Cấu trúc Component

```
App.js
├── Login.jsx (khi chưa login)
└── Product Manager (sau khi login)
    ├── App Header (user info + logout)
    └── Product.jsx
        ├── Header (title + add button)
        ├── Alerts (error/success messages)
        ├── Product Form (thêm/sửa)
        └── Product Table (danh sách)
```

## 🎯 State Management

### App.js
```javascript
- isLoggedIn: boolean
- currentUser: { username, ...data }
```

### Product.jsx
```javascript
- products: []
- loading: boolean
- error: string
- success: string
- showForm: boolean
- editingProduct: object | null
- formData: { name, price, description }
```

## 💡 Features nổi bật

### 1. Loading States
- Login: "Đang đăng nhập..."
- Fetch products: "Đang tải..."
- Disable inputs khi loading

### 2. Error Handling
- Login error: hiển thị message từ API
- Product operations: hiển thị error alert
- API errors được catch và xử lý

### 3. Success Messages
- Thêm/sửa/xóa thành công: alert màu xanh
- Tự động ẩn sau 3 giây

### 4. User Experience
- Confirm dialog khi xóa
- Form reset sau khi submit thành công
- Auto-refresh danh sách sau CRUD
- Responsive design cho mobile

### 5. Accessibility
- Label với htmlFor
- Input có id tương ứng
- Button có title/aria-label
- Semantic HTML

## 🎨 Color Scheme

```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #4caf50 (Green)
Info: #2196F3 (Blue)
Danger: #f44336 (Red)
Warning: #ff9800 (Orange)
Gray: #999
```

## 📱 Responsive Breakpoints

```css
Desktop: > 768px (full layout)
Mobile: ≤ 768px
  - Stack buttons vertically
  - Smaller table font
  - Full-width actions
```

## 🔐 Security

- Token lưu trong localStorage
- Token gửi kèm trong API requests (nếu backend config)
- Logout xóa sạch token
- Error messages không expose sensitive data

## ✅ Checklist hoàn thành

- [x] Login form với API
- [x] Token storage
- [x] Product list với table
- [x] Create product
- [x] Update product
- [x] Delete product (với confirm)
- [x] Form validation (required fields)
- [x] Loading states
- [x] Error handling
- [x] Success messages
- [x] Logout functionality
- [x] User display in header
- [x] CSS3 animations
- [x] Responsive design
- [x] Hover effects
- [x] Accessibility

## 🚀 Chạy ứng dụng

```powershell
cd 
npm start
```

Mở trình duyệt: **http://localhost:3000**

## 🐛 Troubleshooting

### Backend chưa chạy
```
Error: Network Error / Cannot connect
→ Kiểm tra backend đang chạy ở port 8080
```

### CORS error
```
→ Backend cần config CORS cho origin: http://localhost:3000
```

### Token không được gửi
```
→ Cần config axios interceptor để gửi token trong header
→ Hoặc backend cần xử lý token từ localStorage
```

---
