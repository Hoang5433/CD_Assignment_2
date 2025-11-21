import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import DeleteProductModal from "../components/DeleteProductModal";


const ProductPage = () => {
  const { products, loading, quantity, getAllProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, getAllCategory } = useCategoryStore();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (payload) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    await getAllProducts();
    setShowFormModal(false);
    setEditingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct.id);
    await getAllProducts();
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <h2>Product Manager ({quantity})</h2>
        <button className="btn-add" onClick={openAddModal} data-testid="add-product-btn">+ Thêm sản phẩm</button>
      </div>

      <ProductTable
        products={products}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {showFormModal && (
        <ProductFormModal
          categories={categories}
          product={editingProduct}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      {showDeleteModal && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductPage;
