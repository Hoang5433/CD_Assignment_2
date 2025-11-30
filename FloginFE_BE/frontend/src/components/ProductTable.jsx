import { useProductStore } from "../stores/useProductStore";
import { formatVND } from "../utils/helper";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Pencil, Trash2 } from "lucide-react";

const ProductTable = ({ onEdit, onDelete }) => {
  const { products, loading } = useProductStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-slate-600">Đang tải...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-slate-500 text-lg">Chưa có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 border-slate-200">
            <TableHead className="text-slate-900 font-semibold">ID</TableHead>
            <TableHead className="text-slate-900 font-semibold">Tên sản phẩm</TableHead>
            <TableHead className="text-slate-900 font-semibold">Danh mục</TableHead>
            <TableHead className="text-slate-900 font-semibold text-right">Giá</TableHead>
            <TableHead className="text-slate-900 font-semibold text-center">Số lượng</TableHead>
            <TableHead className="text-slate-900 font-semibold">Mô tả</TableHead>
            <TableHead className="text-slate-900 font-semibold text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((p) => (
            <TableRow
              key={p.id}
              data-testid="product-item"
              className="border-slate-200 hover:bg-slate-50 transition"
            >
              <TableCell className="font-medium text-slate-900">#{p.id}</TableCell>
              <TableCell className="text-slate-800 font-medium">{p.productName}</TableCell>
              <TableCell className="text-slate-600">{p.category?.name || "-"}</TableCell>
              <TableCell className="text-right font-semibold text-slate-900">
                {formatVND(p.price)}
              </TableCell>
              <TableCell className="text-center text-slate-600">{p.quantity ?? 0}</TableCell>
              <TableCell className="text-slate-600 max-w-xs truncate">
                {p.description || "-"}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => onEdit(p)}
                    size="sm"
                    variant="outline"
                    className="gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    data-testid="edit-product-btn"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="hidden md:inline">Sửa</span>
                  </Button>

                  <Button
                    onClick={() => onDelete(p)}
                    size="sm"
                    variant="outline"
                    className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                    data-testid="delete-product-btn"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden md:inline">Xóa</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
