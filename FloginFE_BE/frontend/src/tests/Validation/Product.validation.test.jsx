import { validateProduct } from '../../utils/productValidation';

describe('Product Validation Tests', () => {
  describe('validateProduct', () => {
    test('TC1: Product name rỗng - nên trả về lỗi', () => {
      const product = {
        name: '',
        price: 1000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.name).toBe('Ten san pham khong duoc de trong');
    });

    test('Product name quá ngắn - nên trả về lỗi', () => {
      const product = {
        name: 'ab',
        price: 1000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.name).toBe('Ten san pham phai co it nhat 3 ky tu');
    });

    test('Product name quá dài - nên trả về lỗi', () => {
      const product = {
        name: 'a'.repeat(101),
        price: 1000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.name).toBe('Ten san pham khong duoc qua 100 ky tu');
    });

    test('TC2: Price âm - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: -1000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.price).toBe('Gia san pham phai lon hon 0');
    });

    test('Price bằng 0 - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 0,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.price).toBe('Gia san pham phai lon hon 0');
    });

    test('Price quá lớn - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 100000001,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.price).toBe('Gia san pham khong duoc qua 100 trieu');
    });

    test('Price boundary hợp lệ - 1', () => {
      const product = {
        name: 'Laptop',
        price: 1,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.price).toBeUndefined();
    });

    test('Price boundary hợp lệ - 100000000', () => {
      const product = {
        name: 'Laptop',
        price: 100000000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.price).toBeUndefined();
    });

    test('Quantity âm - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: -1,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.quantity).toBe('So luong phai >= 0');
    });

    test('Quantity quá lớn - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10001,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.quantity).toBe('So luong khong duoc qua 10000');
    });

    test('Quantity boundary hợp lệ - 0', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 0,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.quantity).toBeUndefined();
    });

    test('Quantity boundary hợp lệ - 10000', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10000,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.quantity).toBeUndefined();
    });

    test('Description quá dài - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        description: 'a'.repeat(501),
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.description).toBe('Mo ta khong duoc qua 500 ky tu');
    });

    test('Description hợp lệ - không lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        description: 'a'.repeat(500),
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(errors.description).toBeUndefined();
    });

    test('Category rỗng - nên trả về lỗi', () => {
      const product = {
        name: 'Laptop',
        price: 1000,
        quantity: 10,
        category_id: ''
      };
      const errors = validateProduct(product);

      expect(errors.category).toBe('Vui long chon danh muc');
    });

    test('TC3: Product hợp lệ - không có lỗi', () => {
      const product = {
        name: 'Laptop Dell',
        price: 15000000,
        quantity: 10,
        category_id: '1'
      };
      const errors = validateProduct(product);

      expect(Object.keys(errors).length).toBe(0);
    });
  });
});