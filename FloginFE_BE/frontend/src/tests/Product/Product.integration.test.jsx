import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { productService } from "../../services/productService";
import ProductTable from "../../components/ProductTable";
import { useProductStore } from "../../stores/useProductStore";
import { toast } from "sonner";
import ProductFormModal from "../../components/ProductFormModal";
import { formatVND, getCategoryIdFromName } from "../../utils/helper";

jest.mock("../../services/productService");
jest.mock("../../services/categoryService");
jest.mock("../../utils/helper");
jest.mock("sonner");

const mockProducts = [
  {
    id: 1,
    productName: "iPhone 14 Pro Max",
    price: 24000000,
    quantity: 10,
    description: "iPhone 14 Pro Max 256GB",
    category: { id: 1, name: "iPhone" },
  },
  {
    id: 2,
    productName: "Samsung Galaxy S23",
    price: 18000000,
    quantity: 5,
    description: "Samsung Galaxy S23 Ultra",
    category: { id: 2, name: "Samsung" },
  },
];

const mockCategories = [
  { id: 1, name: "iPhone" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
];

// Flow : UI -> Store -> Service -> Store
// 1. Component ProductTable gọi useProductStore.getAllProducts() trong useEffect.
// 2. getAllProducts() gọi service (mock) → trả về mock data.
// 3. set(...) trong store update state thật.
// 4. Component re-render → hiển thị dữ liệu từ store thật.

describe("a) Test ProductTable component với API", () => {
  let originalState;
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    productService.getAllProducts.mockResolvedValue(mockProducts);
    originalState = useProductStore.getState();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  afterEach(() => {
    useProductStore.setState(originalState, true);
  });

  test("Fetch thành công và hiển thị danh sách sản phẩm", async () => {
    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    //Loading state ban đầu
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();

    await waitFor(() => {
      //Check service
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);

      //Check store
      const { products } = useProductStore.getState();
      expect(products).toHaveLength(mockProducts.length);
      expect(products[0].productName).toBe("iPhone 14 Pro Max");

      //Check UI render products
      mockProducts.forEach((p) => {
        expect(screen.getByText(p.productName)).toBeInTheDocument();
      });
    });
  });

  test("Fetch danh sách sản phẩm thất bại và hiển thị lỗi ", async () => {
    productService.getAllProducts.mockRejectedValue(new Error("Network Error"));

    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    //Loading state ban đầu
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Có lỗi khi lấy danh sách sản phẩm"
      );

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(0);

      expect(screen.getByText("Chưa có sản phẩm nào")).toBeInTheDocument();
    });
  });

  test("Hiển thị empty state khi không có sản phẩm", async () => {
    productService.getAllProducts.mockResolvedValue([]);

    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(screen.getByText("Chưa có sản phẩm nào")).toBeInTheDocument();
      const { products } = useProductStore.getState();
      expect(products).toHaveLength(0);
    });
  });

  test("Callback được gọi khi click Edit và Delete", async () => {
    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(screen.getByText("iPhone 14 Pro Max")).toBeInTheDocument();
    });

    //Edit button
    const editButtons = screen.getAllByTestId("edit-product-btn");
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[0]);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);

    //Delete button
    const deleteButtons = screen.getAllByTestId("delete-product-btn");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockProducts[0]);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});

describe("b) Test ProductForm component (create/edit)", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  let originalState;

  beforeEach(() => {
    jest.clearAllMocks();
    originalState = useProductStore.getState();
  });

  afterEach(() => {
    useProductStore.setState(originalState, true);
  });
  test("Hiển thị form thêm sản phẩm", async () => {
    render(
      <ProductFormModal
        categories={mockCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Thêm sản phẩm mới")).toBeInTheDocument();
    expect(screen.getByTestId("product-name")).toBeInTheDocument();
    expect(screen.getByTestId("product-price")).toBeInTheDocument();
    expect(screen.getByTestId("product-quantity")).toBeInTheDocument();
    expect(screen.getByTestId("product-quantity")).toHaveValue(1);
    expect(screen.getByTestId("product-category")).toBeInTheDocument();
    expect(screen.getByTestId("product-description")).toBeInTheDocument();

    // Check categories trong dropdown
    await waitFor(() => {
      mockCategories.forEach((cat) => {
        expect(screen.getByText(cat.name)).toBeInTheDocument();
      });
    });

    expect(screen.getByTestId("submit-btn")).toHaveTextContent("Thêm mới");
  });

  test("Hiển thị form chỉnh sửa với data pre-filled", async () => {
    getCategoryIdFromName.mockReturnValue(1);

    render(
      <ProductFormModal
        categories={mockCategories}
        product={mockProducts[0]}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Chỉnh sửa sản phẩm")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toHaveTextContent("Cập nhật");

    // Wait for useEffect
    await waitFor(
      () => {
        expect(
          screen.getByDisplayValue("iPhone 14 Pro Max")
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue(24000000)).toBeInTheDocument();
        expect(screen.getByDisplayValue(10)).toBeInTheDocument();
        expect(
          screen.getByDisplayValue("iPhone 14 Pro Max 256GB")
        ).toBeInTheDocument();

        // Check category select
        const categorySelect = screen.getByTestId("product-category");
        expect(categorySelect).toHaveValue("1");
      },
      { timeout: 2000 }
    );

    //Check helper function
    expect(getCategoryIdFromName).toHaveBeenCalledWith(
      "iPhone",
      mockCategories
    );
    expect(getCategoryIdFromName).toHaveBeenCalledTimes(1);
  });

  test("Hiển thị lỗi khi submit form trống", async () => {
    render(
      <ProductFormModal
        categories={mockCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Submit form trống
    const submitButton = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Tên sản phẩm phải ít nhất 3 ký tự")
      ).toBeInTheDocument();
      expect(screen.getByText("Giá phải lớn hơn 0")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng chọn danh mục")).toBeInTheDocument();
    });
  });

  test("Hiển thị lỗi validation từng field khi nhập sai", async () => {
    render(
      <ProductFormModal categories={mockCategories} onClose={mockOnClose} />
    );

    // Test productName validation - nhập ít hơn 3 ký tự
    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "ab" },
    });

    // Test price validation - nhập giá âm
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "-1000" },
    });

    // Test quantity validation - nhập số lượng âm
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "-5" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(
        screen.getByText("Tên sản phẩm phải ít nhất 3 ký tự")
      ).toBeInTheDocument();
      expect(screen.getByText("Giá phải lớn hơn 0")).toBeInTheDocument();
      expect(screen.getByText("Số lượng >= 0")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng chọn danh mục")).toBeInTheDocument();
    });
  });

  test("Hiển thị loading state khi đang submit form", async () => {
    productService.addProduct.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <ProductFormModal categories={mockCategories} onClose={mockOnClose} />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "iPhone 15 Pro" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "1" },
    });

    const submitButton = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Đang xử lý...");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test("Tạo sản phẩm mới thành công", async () => {
    const newProduct = {
      id: 3,
      productName: "iPhone 15 Pro",
      price: 25000000,
      quantity: 15,
      description: "iPhone 15 Pro 256GB",
      category: { id: 1, name: "iPhone" },
    };
    productService.addProduct.mockResolvedValue(newProduct);

    render(
      <ProductFormModal categories={mockCategories} onClose={mockOnClose} />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "iPhone 15 Pro" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("product-description"), {
      target: { value: "iPhone 15 Pro 256GB" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      // Check if service is called
      expect(productService.addProduct).toHaveBeenCalledWith({
        productName: "iPhone 15 Pro",
        price: 25000000,
        quantity: 15,
        category_id: "1",
        description: "iPhone 15 Pro 256GB",
      });

      expect(toast.success).toHaveBeenCalledWith("Thêm mới thành công", {
        description: expect.anything(),
      });
    });

    // Check if store update
    await waitFor(() => {
      const { products } = useProductStore.getState();
      expect(products).toContainEqual(newProduct);
    });
  });

  test("Tạo sản phẩm mới thất bại", async () => {
    const newProduct = {
      id: 3,
      productName: "iPhone 15 Pro",
      price: 25000000,
      quantity: 15,
      description: "iPhone 15 Pro 256GB",
      category: { id: 1, name: "iPhone" },
    };
    productService.addProduct.mockRejectedValue(new Error("Network Error"));

    render(
      <ProductFormModal categories={mockCategories} onClose={mockOnClose} />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "iPhone 15 Pro" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("product-description"), {
      target: { value: "iPhone 15 Pro 256GB" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      // Check if service is called
      expect(productService.addProduct).toHaveBeenCalledWith({
        productName: "iPhone 15 Pro",
        price: 25000000,
        quantity: 15,
        category_id: "1",
        description: "iPhone 15 Pro 256GB",
      });

      expect(toast.error).toHaveBeenCalledWith("Thêm mới thất bại", {
        description: expect.anything(),
      });
    });

    // Check if store update
    await waitFor(() => {
      const { products } = useProductStore.getState();
      expect(products).not.toContainEqual(newProduct);
    });
  });

  test("Cập nhật sản phẩm thành công", async () => {
    const updatedProduct = {
      id: 1,
      productName: "iPhone 15 Pro",
      price: 25000000,
      quantity: 15,
      description: "iPhone 15 Pro 256GB",
      category: { id: 1, name: "iPhone" },
    };

    productService.updateProduct.mockResolvedValue(updatedProduct);

    useProductStore.setState((state) => ({
      ...state,
      products: [...mockProducts],
      quantity: mockProducts.length,
    }));

    render(
      <ProductFormModal
        product={mockProducts[0]}
        categories={mockCategories}
        onClose={mockOnClose}
      />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "iPhone 15 Pro" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("product-description"), {
      target: { value: "iPhone 15 Pro 256GB" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(
        mockProducts[0].id,
        {
          productName: "iPhone 15 Pro",
          price: 25000000,
          quantity: 15,
          category_id: "1",
          description: "iPhone 15 Pro 256GB",
        }
      );

      expect(toast.success).toHaveBeenCalledWith("Cập nhật thành công", {
        description: expect.anything(),
      });
    });

    await waitFor(() => {
      const { products } = useProductStore.getState();
      const updatedProductInStore = products.find(
        (p) => p.id === mockProducts[0].id
      );
      expect(updatedProductInStore).toEqual(updatedProduct);
      expect(products).toHaveLength(mockProducts.length);
    });
  });

  test("Cập nhật sản phẩm thất bại", async () => {
    const updatedProduct = {
      id: 1,
      productName: "iPhone 15 Pro",
      price: 25000000,
      quantity: 15,
      description: "iPhone 15 Pro 256GB",
      category: { id: 1, name: "iPhone" },
    };

    productService.updateProduct.mockRejectedValue(new Error("Network Error"));

    useProductStore.setState((state) => ({
      ...state,
      products: [...mockProducts],
      quantity: mockProducts.length,
    }));

    render(
      <ProductFormModal
        product={mockProducts[0]}
        categories={mockCategories}
        onClose={mockOnClose}
      />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "iPhone 15 Pro" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByTestId("product-category"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("product-description"), {
      target: { value: "iPhone 15 Pro 256GB" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(
        mockProducts[0].id,
        {
          productName: "iPhone 15 Pro",
          price: 25000000,
          quantity: 15,
          category_id: "1",
          description: "iPhone 15 Pro 256GB",
        }
      );

      expect(toast.error).toHaveBeenCalledWith("Cập nhật thất bại", {
        description: expect.anything(),
      });
    });

    await waitFor(() => {
      const { products } = useProductStore.getState();
      const updatedProductInStore = products.find(
        (p) => p.id === mockProducts[0].id
      );
      expect(updatedProductInStore).not.toEqual(updatedProduct);
    });
  });
});

describe("c) Test ProductTable component - Hiển thị chi tiết sản phẩm trong bảng", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    productService.getAllProducts.mockResolvedValue(mockProducts);
  });

  test("Hiển thị đầy đủ thông tin chi tiết sản phẩm trong table", async () => {
    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("iPhone 14 Pro Max")).toBeInTheDocument();
      expect(screen.getByText("Samsung Galaxy S23")).toBeInTheDocument();
      expect(screen.getByText("iPhone")).toBeInTheDocument();
      expect(screen.getByText("Samsung")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("iPhone 14 Pro Max 256GB")).toBeInTheDocument();
      expect(screen.getByText("Samsung Galaxy S23 Ultra")).toBeInTheDocument();
    });

    expect(formatVND).toHaveBeenCalledWith(24000000);
    expect(formatVND).toHaveBeenCalledWith(18000000);
  });

  test("Hiển thị giá đã được format", async () => {
    // Mock formatVND
    formatVND.mockImplementation((amount) => {
      const formats = {
        24000000: "24.000.000 ₫",
        18000000: "18.000.000 ₫",
      };
      return formats[amount] || amount?.toString() || "";
    });

    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await waitFor(() => {
      expect(screen.getByText("24.000.000 ₫")).toBeInTheDocument();
      expect(screen.getByText("18.000.000 ₫")).toBeInTheDocument();
    });
  });

  test("Hiển thị đúng số lượng sản phẩm", async () => {
    render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    await waitFor(() => {
      const productItems = screen.getAllByTestId("product-item");
      expect(productItems).toHaveLength(mockProducts.length);

      // Kiểm tra từng sản phẩm có đủ các cột thông tin
      productItems.forEach((item, index) => {
        const cells = item.querySelectorAll("td");
        expect(cells).toHaveLength(7); // ID, Name, Category, Price, Quantity, Description, Actions
      });
    });
  });
});
