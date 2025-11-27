import { validateUsername, validatePassword } from '../../utils/validation';

describe('Login Validation Tests', () => {
  describe('validateUsername', () => {
    test('TC1: Username rỗng - nên trả về lỗi', () => {
      expect(validateUsername('')).toBe('Ten dang nhap khong duoc de trong');
    });

    test('TC2: Username quá ngắn - nên trả về lỗi', () => {
      expect(validateUsername('ab')).toBe('Ten dang nhap phai co it nhat 3 ky tu');
    });

    test('TC3: Username quá dài - nên trả về lỗi', () => {
      expect(validateUsername('a'.repeat(51))).toBe('Ten dang nhap khong duoc qua 50 ky tu');
    });

    test('TC4: Username chứa ký tự đặc biệt không hợp lệ - nên trả về lỗi', () => {
      expect(validateUsername('user@')).toBe('Ten dang nhap chi duoc chua chu, so va cac ky tu -, ., _');
    });

    test('TC5: Username chứa ký tự đặc biệt không hợp lệ - space', () => {
      expect(validateUsername('user name')).toBe('Ten dang nhap chi duoc chua chu, so va cac ky tu -, ., _');
    });

    test('TC6: Username hợp lệ - không có lỗi', () => {
      expect(validateUsername('user123')).toBe('');
    });

    test('TC7: Username hợp lệ với ký tự đặc biệt cho phép', () => {
      expect(validateUsername('user_123.test')).toBe('');
    });
  });

  describe('validatePassword', () => {
    test('TC8: Password rỗng - nên trả về lỗi', () => {
      expect(validatePassword('')).toBe('Mat khau khong duoc de trong');
    });

    test('TC9: Password quá ngắn - nên trả về lỗi', () => {
      expect(validatePassword('12345')).toBe('Mat khau phai co it nhat 6 ky tu');
    });

    test('TC10: Password quá dài - nên trả về lỗi', () => {
      expect(validatePassword('a'.repeat(101))).toBe('Mat khau khong duoc qua 100 ky tu');
    });

    test('TC11: Password không có chữ - nên trả về lỗi', () => {
      expect(validatePassword('123456')).toBe('Mat khau phai chua ca chu va so');
    });

    test('TC12: Password không có số - nên trả về lỗi', () => {
      expect(validatePassword('password')).toBe('Mat khau phai chua ca chu va so');
    });

    test('TC13: Password hợp lệ - không có lỗi', () => {
      expect(validatePassword('password123')).toBe('');
    });

    test('TC14: Password hợp lệ với ký tự đặc biệt', () => {
      expect(validatePassword('Pass123!')).toBe('');
    });
  });
});