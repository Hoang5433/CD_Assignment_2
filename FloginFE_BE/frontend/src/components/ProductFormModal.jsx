import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductStore } from "../stores/useProductStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
  const [open, setOpen] = useState(true);

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
      categoryId: product?.category?.id ? String(product.category.id) : "",
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
          category_id: Number(formData.categoryId),
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
      setOpen(false);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setOpen(false);
      onClose();
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-slate-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-slate-700 font-medium">
              Tên sản phẩm *
            </Label>
            <Input
              id="productName"
              {...register("productName")}
              data-testid="product-name"
              className="border-slate-300 focus:ring-blue-500"
              placeholder="Nhập tên sản phẩm..."
            />
            {errors.productName && (
              <p className="text-red-500 text-sm font-medium">
                {errors.productName.message}
              </p>
            )}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-700 font-medium">
                Giá *
              </Label>
              <Input
                id="price"
                type="number"
                step="1000"
                {...register("price")}
                data-testid="product-price"
                className="border-slate-300 focus:ring-blue-500"
                placeholder="0"
              />
              {errors.price && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-slate-700 font-medium">
                Số lượng *
              </Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity")}
                data-testid="product-quantity"
                className="border-slate-300 focus:ring-blue-500"
                placeholder="0"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-slate-700 font-medium">
              Danh mục *
            </Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="categoryId"
                  data-testid="product-category"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
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
              <p className="text-red-500 text-sm font-medium">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-medium">
              Mô tả
            </Label>
            <textarea
              id="description"
              {...register("description")}
              data-testid="product-description"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows="4"
              placeholder="Nhập mô tả sản phẩm..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <DialogFooter className="pt-6 gap-3 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              data-testid="submit-btn"
            >
              {isSubmitting
                ? "Đang xử lý..."
                : product
                  ? "Cập nhật"
                  : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
