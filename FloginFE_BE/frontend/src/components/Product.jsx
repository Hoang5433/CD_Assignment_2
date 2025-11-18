import React, { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema
const productSchema = z.object({
  productName: z
      .string()
      .min(3, "Tên sản phẩm phải ít nhất 3 ký tự")
      .max(100, "Tên sản phẩm không quá 100 ký tự"),

  price: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z
          .number()
          .positive("Giá phải lớn hơn 0")
          .max(999_999_999, "Giá không vượt quá 999,999,999")
  ),

  quantity: z.preprocess(
      (val) => (val === "" || val === undefined ? 0 : Number(val)),
      z
          .number()
          .int("Số lượng phải là số nguyên")
          .min(0, "Số lượng >= 0")
          .max(99_999, "Số lượng không vượt quá 99,999")
  ),

  categoryId: z.string().nonempty("Phải chọn danh mục"),

  description: z
      .string()
      .max(500, "Mô tả không quá 500 ký tự")
      .optional()
      .or(z.literal("")),
});


const ProductManager = () => {
  const { products, loading, quantity, getAllProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, getAllCategory } = useCategoryStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: "",
      quantity: 1,
      categoryId: "",
      description: "",
    },
    mode: "onChange"
  });

  const [showFormModal, setShowFormModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [deletingProduct, setDeletingProduct] = React.useState(null);

  useEffect(() => {
    getAllCategory();
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      productName: "",
      price: "",
      quantity: 1,
      categoryId: "",
      description: "",
    });
    setShowFormModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const category = categories.find(c => c.name === product.category?.name);
    const categoryId = category ? String(category.id) : "";
    reset({
      productName: product.productName ?? "",
      price: product.price ?? "",
      quantity: product.quantity ?? 0,
      categoryId,
      description: product.description ?? "",
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        productName: data.productName,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category_id: data.categoryId,
        description: data.description || "",
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }

      await getAllProducts();
      setShowFormModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      await getAllProducts();
      setShowDeleteModal(false);
      setDeletingProduct(null);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
      <div className="product-container">
        <div className="product-header">
          <h2>Product Manager ({quantity})</h2>
          <button className="btn-add" onClick={openAddModal}>+ Thêm sản phẩm</button>
        </div>

        {loading ? (
            <div className="loading">Đang tải...</div>
        ) : (
            <div className="product-table-container">
              {products.length === 0 ? (
                  <p className="no-products">Chưa có sản phẩm nào</p>
              ) : (
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
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.productName}</td>
                            <td>{p.category?.name || "-"}</td>
                            <td>${p.price}</td>
                            <td>{p.quantity ?? 0}</td>
                            <td>{p.description || "-"}</td>
                            <td className="product-actions">
                              <button className="btn-edit" onClick={() => openEditModal(p)}>✏️ Sửa</button>
                              <button className="btn-delete" onClick={() => { setDeletingProduct(p); setShowDeleteModal(true); }}>🗑️ Xóa</button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
              )}
            </div>
        )}

        {/* Form Modal */}
        {showFormModal && (
            <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                  <button className="modal-close" onClick={() => setShowFormModal(false)}>×</button>
                </div>

                <form className="product-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label htmlFor="productName">Tên sản phẩm</label>
                    <input id="productName" type="text" {...register("productName")} />
                    {errors.productName && <p className="field-error">{errors.productName.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Giá</label>
                    <input id="price" type="number" step="0.01" {...register("price")} />
                    {errors.price && <p className="field-error">{errors.price.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">Số lượng</label>
                    <input id="quantity" type="number" {...register("quantity")} />
                    {errors.quantity && <p className="field-error">{errors.quantity.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoryId">Danh mục</label>
                    <Controller
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <select {...field}>
                              <option value="">-- Chọn danh mục --</option>
                              {categories.map((cat) => (
                                  <option key={cat.id} value={(cat.id)}>
                                    {cat.name}
                                  </option>
                              ))}
                            </select>
                        )}
                    />
                    {errors.categoryId && <p className="field-error">{errors.categoryId.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Mô tả</label>
                    <textarea id="description" {...register("description")}></textarea>
                    {errors.description && <p className="field-error">{errors.description.message}</p>}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={isSubmitting}>
                      {editingProduct ? "Cập nhật" : "Thêm mới"}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => setShowFormModal(false)}>Hủy</button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && deletingProduct && (
            <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
              <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Xác nhận xóa</h3>
                  <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
                </div>
                <div className="delete-confirmation">
                  <div className="delete-icon">🗑️</div>
                  <p className="delete-message">
                    Bạn có chắc muốn xóa <strong>{deletingProduct.productName}</strong>?
                  </p>
                  <p className="delete-warning">Hành động này không thể hoàn tác.</p>
                </div>
                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                  <button className="btn-delete-confirm" onClick={handleDeleteConfirm}>Xóa</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProductManager;
