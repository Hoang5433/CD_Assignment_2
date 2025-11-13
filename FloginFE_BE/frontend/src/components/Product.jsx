import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  
  // Form state với đầy đủ thuộc tính
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();
      setProducts(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      price: '', 
      stock: '', 
      category: '',
      description: '' 
    });
    setShowFormModal(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price ?? '',
      stock: product.stock ?? '',
      category: product.category || '',
      description: product.description || ''
    });
    setShowFormModal(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    try {
      await productService.delete(deletingProduct.id);
      setSuccess('Xóa sản phẩm thành công!');
      await fetchProducts();
      setShowDeleteModal(false);
      setDeletingProduct(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingProduct) {
        // Update existing product
        await productService.update(editingProduct.id, formData);
        setSuccess('Cập nhật sản phẩm thành công!');
      } else {
        // Create new product
        await productService.create(formData);
        setSuccess('Thêm sản phẩm mới thành công!');
      }
      
      // Refresh product list
      await fetchProducts();
      
      // Reset form and close modal
      setShowFormModal(false);
      setFormData({ name: '', price: '', stock: '', category: '', description: '' });
      setEditingProduct(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Không thể lưu sản phẩm');
    }
  };

  const handleCancel = () => {
    setShowFormModal(false);
    setFormData({ name: '', price: '', stock: '', category: '', description: '' });
    setEditingProduct(null);
    setError('');
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Product Manager</h2>
        <button className="btn-add" onClick={handleAddNew}>
          + Thêm sản phẩm mới
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Modal Form thêm/sửa sản phẩm */}
      {showFormModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Tên sản phẩm: *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Danh mục:</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Điện thoại">Điện thoại</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                    <option value="Máy tính bảng">Máy tính bảng</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Giá bán: *</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Nhập giá bán"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Số lượng:</label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Nhập số lượng"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả sản phẩm"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteModal && deletingProduct && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
              <button className="modal-close" onClick={handleCloseDeleteModal}>×</button>
            </div>
            
            <div className="delete-confirmation">
              <div className="delete-icon">🗑️</div>
              <p className="delete-message">
                Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deletingProduct.name}"</strong>?
              </p>
              <p className="delete-warning">Hành động này không thể hoàn tác.</p>
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCloseDeleteModal}>
                Hủy
              </button>
              <button className="btn-delete-confirm" onClick={handleDeleteConfirm}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="product-table-container">
          {products.length === 0 ? (
            <p className="no-products">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td className="product-category">
                      {product.category || <em>Chưa phân loại</em>}
                    </td>
                    <td className="product-price">${product.price}</td>
                    <td className="product-stock">{product.stock ?? 0}</td>
                    <td className="product-description">
                      {product.description || <em>Không có mô tả</em>}
                    </td>
                    <td className="product-actions">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEdit(product)}
                        title="Chỉnh sửa"
                      >
                        ✏️ Sửa
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteClick(product)}
                        title="Xóa"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Product;
