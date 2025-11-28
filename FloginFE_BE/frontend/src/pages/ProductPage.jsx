import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import DeleteProductModal from "../components/DeleteProductModal";

const ProductPage = () => {
  const {deleteProduct } = useProductStore();
  const quantity = useProductStore((state) => state.quantity);
  const { categories, getAllCategory } = useCategoryStore();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    getAllCategory();
  }, [getAllCategory]);

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