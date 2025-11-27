// Product validation utilities

export const validateProduct = (product) => {
  const errors = {};

  // Product name validation
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Ten san pham khong duoc de trong';
  } else if (product.name.length < 3) {
    errors.name = 'Ten san pham phai co it nhat 3 ky tu';
  } else if (product.name.length > 100) {
    errors.name = 'Ten san pham khong duoc qua 100 ky tu';
  }

  // Price validation
  if (product.price === undefined || product.price === null) {
    errors.price = 'Gia san pham khong duoc de trong';
  } else if (product.price <= 0) {
    errors.price = 'Gia san pham phai lon hon 0';
  } else if (product.price > 100000000) {
    errors.price = 'Gia san pham khong duoc qua 100 trieu';
  }

  // Quantity validation
  if (product.quantity === undefined || product.quantity === null) {
    errors.quantity = 'So luong khong duoc de trong';
  } else if (product.quantity < 0) {
    errors.quantity = 'So luong phai >= 0';
  } else if (product.quantity > 10000) {
    errors.quantity = 'So luong khong duoc qua 10000';
  }

  // Description validation
  if (product.description && product.description.length > 500) {
    errors.description = 'Mo ta khong duoc qua 500 ky tu';
  }

  // Category validation
  if (!product.category_id || product.category_id === '') {
    errors.category = 'Vui long chon danh muc';
  }

  return errors;
};