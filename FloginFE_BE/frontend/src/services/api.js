import axios from 'axios';

/**
 * API SERVICE CONFIGURATION
 * 
 * CÁCH CHUYỂN ĐỔI GIỮA MOCK VÀ API THẬT:
 * =======================================
 * 
 * 1. SỬ DỤNG MOCK DATA (Test UI mà không cần backend):
 *    const MOCK_MODE = true;
 * 
 * 2. SỬ DỤNG API THẬT (Kết nối với backend):
 *    const MOCK_MODE = false;
 * 
 * LƯU Ý:
 * - Mock mode: Data lưu trong memory, reload page sẽ reset
 * - API mode: Cần backend chạy ở http://localhost:8080
 * - Có thể config API_BASE_URL qua file .env
 * 
 * BACKEND REQUIREMENTS (khi MOCK_MODE = false):
 * ============================================
 * - Server chạy tại: http://localhost:8080
 * - CORS enabled cho: http://localhost:3000
 * - Endpoints:
 *   POST   /api/auth/login
 *   GET    /api/products
 *   POST   /api/products
 *   PUT    /api/products/:id
 *   DELETE /api/products/:id
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Interceptor - Tự động thêm token vào mọi request
// Uncomment để enable khi sử dụng API thật
/*
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý lỗi tập trung
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect về login
    }
    return Promise.reject(error);
  }
);
*/

// Mock data cho testing khi backend chưa sẵn sàng
const MOCK_MODE = true; // Set false để sử dụng API thật

// Mock products data
let mockProducts = [
  { id: 1, name: 'iPhone 15 Pro', price: 999.99, description: 'Latest iPhone with A17 chip' },
  { id: 2, name: 'MacBook Pro M3', price: 1999.99, description: 'Powerful laptop for developers' },
  { id: 3, name: 'AirPods Pro', price: 249.99, description: 'Wireless earbuds with ANC' },
];

let nextId = 4;

export const authService = {
  login: (credentials) => {
    if (MOCK_MODE) {
      // Mock login - luôn trả về thành công
      return Promise.resolve({
        data: {
          token: 'mock-jwt-token-123456',
          username: credentials.username,
          message: 'Login successful'
        }
      });
    }
    // Real API call
    return api.post('/auth/login', credentials);
    /* API Response format:
     * {
     *   data: {
     *     token: string,
     *     username: string,
     *     id?: number,
     *     email?: string
     *   }
     * }
     */
  },
};

export const productService = {
  getAll: () => {
    if (MOCK_MODE) {
      // Mock get all products
      return Promise.resolve({
        data: mockProducts
      });
    }
    // Real API call
    return api.get('/products');
    /* API Response format:
     * {
     *   data: [
     *     {
     *       id: number,
     *       name: string,
     *       price: number,
     *       description?: string,
     *       category?: string,
     *       stock?: number,
     *       createdAt?: string,
     *       updatedAt?: string
     *     }
     *   ]
     * }
     */
  },
  
  create: (product) => {
    if (MOCK_MODE) {
      // Mock create product
      const newProduct = {
        id: nextId++,
        ...product,
        price: parseFloat(product.price)
      };
      mockProducts.push(newProduct);
      return Promise.resolve({
        data: newProduct
      });
    }
    // Real API call
    return api.post('/products', product);
    /* Request body:
     * {
     *   name: string (required),
     *   price: number (required),
     *   description?: string,
     *   category?: string,
     *   stock?: number
     * }
     * Response format: { data: Product }
     */
  },
  
  update: (id, product) => {
    if (MOCK_MODE) {
      // Mock update product
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = {
          ...mockProducts[index],
          ...product,
          price: parseFloat(product.price)
        };
        return Promise.resolve({
          data: mockProducts[index]
        });
      }
      return Promise.reject({ response: { data: { message: 'Product not found' } } });
    }
    // Real API call
    return api.put(`/products/${id}`, product);
    /* Request body:
     * {
     *   name?: string,
     *   price?: number,
     *   description?: string,
     *   category?: string,
     *   stock?: number
     * }
     * Response format: { data: Product }
     */
  },
  
  delete: (id) => {
    if (MOCK_MODE) {
      // Mock delete product
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return Promise.resolve({
          data: { message: 'Product deleted successfully' }
        });
      }
      return Promise.reject({ response: { data: { message: 'Product not found' } } });
    }
    // Real API call
    return api.delete(`/products/${id}`);
    /* Response format:
     * {
     *   data: {
     *     message: string,
     *     id?: number
     *   }
     * }
     */
  },
};

export default api;

/**
 * USAGE EXAMPLES / VÍ DỤ SỬ DỤNG
 * ================================
 * 
 * 1. LOGIN:
 * ---------
 * import { authService } from '../services/api';
 * 
 * const handleLogin = async () => {
 *   try {
 *     const response = await authService.login({ username, password });
 *     const { token, username } = response.data;
 *     localStorage.setItem('token', token);
 *     // Navigate to dashboard
 *   } catch (error) {
 *     console.error('Login failed:', error.response?.data?.message);
 *   }
 * };
 * 
 * 
 * 2. GET ALL PRODUCTS:
 * --------------------
 * import { productService } from '../services/api';
 * 
 * const fetchProducts = async () => {
 *   try {
 *     const response = await productService.getAll();
 *     setProducts(response.data);
 *   } catch (error) {
 *     console.error('Fetch failed:', error);
 *   }
 * };
 * 
 * 
 * 3. CREATE PRODUCT:
 * ------------------
 * const addProduct = async () => {
 *   try {
 *     const newProduct = {
 *       name: 'iPhone 15',
 *       price: 999.99,
 *       description: 'Latest iPhone'
 *     };
 *     const response = await productService.create(newProduct);
 *     console.log('Created:', response.data);
 *   } catch (error) {
 *     console.error('Create failed:', error);
 *   }
 * };
 * 
 * 
 * 4. UPDATE PRODUCT:
 * ------------------
 * const updateProduct = async (id) => {
 *   try {
 *     const updates = {
 *       name: 'iPhone 15 Pro',
 *       price: 1199.99
 *     };
 *     const response = await productService.update(id, updates);
 *     console.log('Updated:', response.data);
 *   } catch (error) {
 *     console.error('Update failed:', error);
 *   }
 * };
 * 
 * 
 * 5. DELETE PRODUCT:
 * ------------------
 * const deleteProduct = async (id) => {
 *   try {
 *     await productService.delete(id);
 *     console.log('Deleted successfully');
 *   } catch (error) {
 *     console.error('Delete failed:', error);
 *   }
 * };
 * 
 * 
 * ERROR HANDLING:
 * ---------------
 * try {
 *   const response = await productService.getAll();
 * } catch (error) {
 *   if (error.response) {
 *     // Server responded with error status
 *     console.log('Status:', error.response.status);
 *     console.log('Data:', error.response.data);
 *     console.log('Message:', error.response.data.message);
 *   } else if (error.request) {
 *     // Request made but no response
 *     console.log('No response from server');
 *   } else {
 *     // Something else happened
 *     console.log('Error:', error.message);
 *   }
 * }
 */