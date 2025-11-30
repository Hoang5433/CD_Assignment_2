import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductStore } from "../stores/useProductStore";

const productSchema = z.object({
  productName: z
    .string()
    .min(3, "Tên sản phẩm phải ít nhất 3 ký tự")
    .max(100, "Tên sản phẩm không quá 100 ký tự"),

  price: z.coerce
    .number({
      required_error: "Giá là bắt buộc",
      invalid_type_error: "Giá phải là số",
    })
    .positive("Giá phải lớn hơn 0")
    .max(999_999_999, "Giá không vượt quá 999,999,999"),

  quantity: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z
      .number()
      .int("Số lượng phải là số nguyên")
      .min(0, "Số lượng >= 0")
      .max(99_999, "Số lượng không vượt quá 99,999")
  ),

  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),

  description: z
    .string()
    .max(500, "Mô tả không quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

const ProductFormModal = ({ categories, product, onClose }) => {
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
  });

  const { updateProduct, addProduct } = useProductStore();

  useEffect(() => {
    reset({
      productName: product?.productName || "",
      price: product?.price || "",
      quantity: product?.quantity ?? 1,
      categoryId: product?.category?.id || "",
      description: product?.description || "",
    });
  }, [product, reset, categories]);

  const submitHandler = async (formData) => {
    try {
      if (product) {
        await updateProduct(product.id, {
          productName: formData.productName,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          category_id: formData.categoryId,
          description: formData.description || "",
        });
      } else {
        await addProduct({
          productName: formData.productName,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          category_id: formData.categoryId,
          description: formData.description || "",
        });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit(submitHandler)}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input {...register("productName")} data-testid="product-name" />
            {errors.productName && (
              <p className="field-error">{errors.productName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Giá</label>
            <input
              type="number"
              step="1000"
              {...register("price")}
              data-testid="product-price"
            />
            {errors.price && (
              <p className="field-error">{errors.price.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Số lượng</label>
            <input
              type="number"
              {...register("quantity")}
              data-testid="product-quantity"
            />
            {errors.quantity && (
              <p className="field-error">{errors.quantity.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <select {...field} data-testid="product-category">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.categoryId && (
              <p className="field-error">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              {...register("description")}
              data-testid="product-description"
            ></textarea>
            {errors.description && (
              <p className="field-error">{errors.description.message}</p>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
              data-testid="submit-btn"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : product
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
