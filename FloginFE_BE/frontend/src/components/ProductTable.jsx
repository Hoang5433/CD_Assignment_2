import { useProductStore } from "../stores/useProductStore";
import { formatVND } from "../utils/helper";

const ProductTable = ({ onEdit, onDelete }) => {
  const { products, loading } = useProductStore();

  if (loading) return <div className="loading">Đang tải...</div>;

  if (products.length === 0)
    return <p className="no-products">Chưa có sản phẩm nào</p>;

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} data-testid="product-item">
              <td>{p.id}</td>
              <td>{p.productName}</td>
              <td>{p.category?.name || "-"}</td>
              <td>{formatVND(p.price)}</td>
              <td>{p.quantity ?? 0}</td>
              <td>{p.description || "-"}</td>

              <td className="product-actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(p)}
                  data-testid="edit-product-btn"
                >
                  ✏️ Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={() => onDelete(p)}
                  data-testid="delete-product-btn"
                >
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
