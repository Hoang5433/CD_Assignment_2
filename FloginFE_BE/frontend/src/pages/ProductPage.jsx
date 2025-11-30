import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";
import DeleteProductModal from "../components/DeleteProductModal";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-slate-600">
            Quản lý tất cả các sản phẩm của bạn ({quantity} sản phẩm)
          </p>
        </div>

        {/* Controls Card */}
        <Card className="mb-6 shadow-sm border-slate-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Add Product Button */}
              <Button
                onClick={openAddModal}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                data-testid="add-product-btn"
              >
                <Plus className="h-5 w-5" />
                Thêm sản phẩm
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table Card */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="pt-6">
            <ProductTable
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Pagination Controls */}
            <div className="flex gap-4 justify-center items-center mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                variant="outline"
                size="icon"
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium text-slate-700 min-w-32 text-center">
                Trang <strong className="text-slate-900">{currentPage + 1}</strong> / <strong>{totalPages}</strong>
              </span>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                variant="outline"
                size="icon"
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
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