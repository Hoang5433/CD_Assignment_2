import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
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
    setFormData({ name: '', price: '', description: '' });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || ''
    });
    setShowForm(true);
    setError('');
    setSuccess('');
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
      
      // Reset form
      setShowForm(false);
      setFormData({ name: '', price: '', description: '' });
      setEditingProduct(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Không thể lưu sản phẩm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await productService.delete(id);
      setSuccess('Xóa sản phẩm thành công!');
      await fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ name: '', price: '', description: '' });
    setEditingProduct(null);
    setError('');
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

      {/* Form thêm/sửa sản phẩm */}
      {showForm && (
        <div className="product-form-container">
          <h3>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
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
              <label htmlFor="price">Giá: *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Nhập giá sản phẩm"
                required
              />
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
                  <th>Giá</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-name">{product.name}</td>
                    <td className="product-price">${product.price}</td>
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
                        onClick={() => handleDelete(product.id)}
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
