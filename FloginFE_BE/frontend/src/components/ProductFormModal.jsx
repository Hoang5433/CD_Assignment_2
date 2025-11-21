import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCategoryIdFromName } from "../utils/helper";

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

  categoryId: z.coerce.number(),

  description: z
      .string()
      .max(500, "Mô tả không quá 500 ký tự")
      .optional()
      .or(z.literal("")),
});


const ProductFormModal = ({ categories, product, onClose, onSubmit }) => {
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

  useEffect(() => {
    console.log(categories);
    reset({
      productName: product?.productName || "",
      price: product?.price || "",
      quantity: product?.quantity ?? 1,
      categoryId: getCategoryIdFromName(product?.category?.name, categories) || "",
      description: product?.description || "",
    });
  }, [product, reset, categories]);

  const submitHandler = async (data) => {
    await onSubmit({
      productName: data.productName,
      price: Number(data.price),
      quantity: Number(data.quantity),
      category_id: data.categoryId,
      description: data.description || "",
    });
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
            <input type="number" step="1000" {...register("price")} data-testid="product-price" />
            {errors.price && (
              <p className="field-error">{errors.price.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Số lượng</label>
            <input type="number" {...register("quantity")} data-testid="product-quantity" />
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
            <textarea {...register("description")} data-testid="product-description"></textarea>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
              data-testid="submit-btn"
            >
              {product ? "Cập nhật" : "Thêm mới"}
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
