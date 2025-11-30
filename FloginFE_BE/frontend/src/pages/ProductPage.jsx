import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import DeleteProductModal from "../components/DeleteProductModal";

const ProductPage = () => {
  const {
    deleteProduct,
    quantity,
    getAllProducts,
    currentPage,
    totalPages
  } = useProductStore();
  const { categories, getAllCategory } = useCategoryStore();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    getAllProducts(0)
    getAllCategory();
  }, [getAllCategory, getAllProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      getAllProducts(newPage);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    
    try {
      await deleteProduct(deletingProduct.id);
      setShowDeleteModal(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingProduct(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Product Manager ({quantity})</h2>
        <button
          className="btn-add"
          onClick={openAddModal}
          data-testid="add-product-btn"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <ProductTable 
        onEdit={handleEditClick} 
        onDelete={handleDeleteClick} 
      />

      <div className="pagination-controls" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', alignItems: 'center' }}>
        <button
            className="btn-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            style={{ opacity: currentPage === 0 ? 0.5 : 1, cursor: 'pointer' }}
        >
          &lt; Trước
        </button>

        <span>
          Trang <strong>{currentPage + 1}</strong> / {totalPages}
        </span>

        <button
            className="btn-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages}
            style={{ opacity: currentPage + 1 >= totalPages ? 0.5 : 1, cursor: 'pointer' }}
        >
          Sau &gt;
        </button>
      </div>

      {showFormModal && (
        <ProductFormModal
          categories={categories}
          product={editingProduct}
          onClose={handleCloseFormModal}
        />
      )}

      {showDeleteModal && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ProductPage;