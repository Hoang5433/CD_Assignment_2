const DeleteProductModal = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Xác nhận xóa</h3>
          <button
            className="modal-close"
            onClick={() => onClose(false)}
          >
            ×
          </button>
        </div>
        <div className="delete-confirmation">
          <div className="delete-icon">🗑️</div>
          <p className="delete-message">
            Bạn có chắc muốn xóa <strong>{product.productName}</strong>?
          </p>
          <p className="delete-warning">Hành động này không thể hoàn tác.</p>
        </div>
        <div className="form-actions">
          <button
            className="btn-cancel"
            onClick={() => onClose(false)}
          >
            Hủy
          </button>
          <button
            className="btn-delete-confirm"
            data-testid="confirm-delete-btn"
            onClick={onConfirm}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
