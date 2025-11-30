import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteProductModal = ({ product, onClose, onConfirm }) => {
  const [open, setOpen] = useState(!!product);

  useEffect(() => {
    setOpen(!!product);
  }, [product]);

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setOpen(false);
      onClose();
    } else {
      setOpen(true);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white border-red-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center space-y-2">
            <p className="text-slate-700">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <strong className="text-slate-900">{product.productName}</strong>
              ?
            </p>
            <p className="text-sm text-red-600 font-medium">
              ⚠️ Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="pt-6 gap-3 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              onClose();
            }}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
            data-testid="confirm-delete-btn"
          >
            <AlertTriangle className="h-4 w-4" />
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;
