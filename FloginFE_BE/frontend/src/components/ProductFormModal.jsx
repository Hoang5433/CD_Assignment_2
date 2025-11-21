import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCategoryIdFromName } from "../utils/helper";

const productSchema = z.object({
  productName: z.string().min(3).max(100),
  price: z.preprocess((v) => Number(v), z.number().positive()),
  quantity: z.preprocess((v) => Number(v), z.number().int().min(0)),
  categoryId: z.string().nonempty(),
  description: z.string().max(500).optional().or(z.literal("")),
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
  }, [product, reset]);

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
            <input type="number" step="1000" {...register("price")} />
            {errors.price && (
              <p className="field-error">{errors.price.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Số lượng</label>
            <input type="number" {...register("quantity")} />
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
                <select {...field}>
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
            <textarea {...register("description")}></textarea>
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
