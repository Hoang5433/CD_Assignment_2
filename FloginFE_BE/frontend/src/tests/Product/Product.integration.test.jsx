import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { productService } from "../../services/productService";
import ProductTable from "../../components/ProductTable";
import { useProductStore } from "../../stores/useProductStore";
import { toast } from "sonner";
import ProductFormModal from "../../components/ProductFormModal";
import { formatVND } from "../../utils/helper";

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

const mockApiResponse = {
  content: mockProducts,
  totalElements: mockProducts.length,
  totalPages: 1,
  number: 0,
  size: 10,
  first: true,
  last: true,
  empty: false,
};

const mockCategories = [
  { id: 1, name: "iPhone" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Xiaomi" },
];

describe("Product Components Integration Test", () => {
  describe("a) Test ProductTable component với API", () => {
    let originalState;
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      productService.getAllProducts.mockResolvedValue(mockApiResponse);
      originalState = useProductStore.getState();
      useProductStore.getState().getAllProducts(); //Fetch data on store
      mockOnEdit.mockClear();
      mockOnDelete.mockClear();
    });

    afterEach(() => {
      useProductStore.setState(originalState, true);
    });
    test("Should render correct products from store", async () => {
      render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      mockProducts.forEach((p) => {
        expect(screen.getByText(p.productName)).toBeInTheDocument();
      });
    });
  });

  describe("b) Test ProductForm component (create/edit)", () => {
    const mockOnClose = jest.fn();
    let originalState;

    beforeEach(() => {
      jest.clearAllMocks();
      originalState = useProductStore.getState();
      useProductStore.setState({
        products: mockProducts,
        quantity: mockProducts.length,
        loading: false,
        totalPages: 1,
        currentPage: 0,
      });
    });

    afterEach(() => {
      useProductStore.setState(originalState, true);
    });

    test("Create product successfully and update state", async () => {
      const updatedMockResponse = {
        content: [
          ...mockProducts,
          {
            id: 3,
            productName: "iPhone 15 Pro",
            price: 25000000,
            quantity: 15,
            description: "iPhone 15 Pro 256GB",
            category: { id: 1, name: "iPhone" },
          },
        ],
        totalElements: 3,
        totalPages: 1,
        number: 0,
        size: 10,
        first: true,
        last: true,
        empty: false,
      };

      productService.getAllProducts.mockResolvedValue(updatedMockResponse);

      expect(useProductStore.getState().products).toHaveLength(2); //State before

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
        <ProductFormModal onClose={mockOnClose} categories={mockCategories} />
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
        // Check if addProduct service is called
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

      await waitFor(() => {
        //Check if getAllProducts is called after create new
        expect(productService.getAllProducts).toHaveBeenCalled();
      });

      await waitFor(() => {
        const { products } = useProductStore.getState();
        expect(products).toHaveLength(3);
        expect(products).toContainEqual(
          expect.objectContaining({
            id: 3,
            productName: "iPhone 15 Pro",
            price: 25000000,
          })
        );
      });
    });

    test("Create product FAILED and does NOT update state", async () => {
      expect(useProductStore.getState().products).toHaveLength(2);

      // Mock API addProduct FAILED
      productService.addProduct.mockRejectedValue(new Error("API Error"));

      render(
        <ProductFormModal onClose={mockOnClose} categories={mockCategories} />
      );

      // Fill form (giống test success)
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

      // Expect addProduct called
      await waitFor(() => {
        expect(productService.addProduct).toHaveBeenCalledWith({
          productName: "iPhone 15 Pro",
          price: 25000000,
          quantity: 15,
          category_id: "1",
          description: "iPhone 15 Pro 256GB",
        });
      });

      // Expect toast.error called
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Thêm mới thất bại", {
          description: expect.anything(),
        });
      });

      // Ensure NOT calling refresh API
      expect(productService.getAllProducts).not.toHaveBeenCalled();

      // Ensure state NOT updated
      const { products } = useProductStore.getState();
      expect(products).toHaveLength(2);
    });

    test("Update product successfully and update state", async () => {
      const editingProduct = mockProducts[0];
      const updatedProduct = {
        ...editingProduct,
        productName: "iPhone 14 Pro Max Updated",
        price: 22000000,
        quantity: 8,
        description: "iPhone 14 Pro Max 256GB - Updated",
      };

      productService.updateProduct.mockResolvedValue(updatedProduct);

      render(
        <ProductFormModal
          product={editingProduct}
          onClose={mockOnClose}
          categories={mockCategories}
        />
      );

      // Check if form has been pre-filled data
      await waitFor(() => {
        expect(screen.getByTestId("product-name")).toHaveValue(
          "iPhone 14 Pro Max"
        );
        expect(screen.getByTestId("product-price")).toHaveValue(24000000);
        expect(screen.getByTestId("product-quantity")).toHaveValue(10);
        expect(screen.getByTestId("product-category")).toHaveValue("1");
        expect(screen.getByTestId("product-description")).toHaveValue(
          "iPhone 14 Pro Max 256GB"
        );
      });

      fireEvent.change(screen.getByTestId("product-name"), {
        target: { value: "iPhone 14 Pro Max Updated" },
      });
      fireEvent.change(screen.getByTestId("product-price"), {
        target: { value: "22000000" },
      });
      fireEvent.change(screen.getByTestId("product-quantity"), {
        target: { value: "8" },
      });
      fireEvent.change(screen.getByTestId("product-description"), {
        target: { value: "iPhone 14 Pro Max 256GB - Updated" },
      });

      fireEvent.click(screen.getByTestId("submit-btn"));

      await waitFor(() => {
        // Check if updateProduct service is called with correct data
        expect(productService.updateProduct).toHaveBeenCalledWith(
          editingProduct.id,
          {
            productName: "iPhone 14 Pro Max Updated",
            price: 22000000,
            quantity: 8,
            category_id: 1,
            description: "iPhone 14 Pro Max 256GB - Updated",
          }
        );

        expect(toast.success).toHaveBeenCalledWith("Cập nhật thành công", {
          description: expect.anything(),
        });
      });

      await waitFor(() => {
        const { products } = useProductStore.getState();
        expect(products).toHaveLength(2);

        // Check updated product
        const updatedProductInStore = products.find(
          (p) => p.id === editingProduct.id
        );
        expect(updatedProductInStore).toEqual(
          expect.objectContaining({
            id: 1,
            productName: "iPhone 14 Pro Max Updated",
            price: 22000000,
            quantity: 8,
            description: "iPhone 14 Pro Max 256GB - Updated",
          })
        );

        // Check other products are not changed
        const otherProduct = products.find((p) => p.id === 2);
        expect(otherProduct).toEqual(mockProducts[1]);
      });
    });

    test("Update product handles network error", async () => {
      jest.clearAllMocks();
      const editingProduct = mockProducts[0];

      productService.updateProduct.mockRejectedValue(
        new Error("Update Product Fail")
      );

      render(
        <ProductFormModal
          product={editingProduct}
          onClose={mockOnClose}
          categories={mockCategories}
        />
      );

      fireEvent.change(screen.getByTestId("product-name"), {
        target: { value: "Updated Product" },
      });

      fireEvent.click(screen.getByTestId("submit-btn"));

      // Check API call
      await waitFor(() => {
        expect(productService.updateProduct).toHaveBeenCalledWith(
          editingProduct.id,
          expect.objectContaining({
            productName: "Updated Product",
            price: 24000000,
            quantity: 10,
            category_id: 1,
            description: "iPhone 14 Pro Max 256GB",
          })
        );
      });

      // Check error toast
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Cập nhật thất bại", {
          description: expect.anything(),
        });
      });

      // Check store state is unchanged
      await waitFor(() => {
        const { products } = useProductStore.getState();
        expect(products).toHaveLength(2);

        const unchangedProduct = products.find(
          (p) => p.id === editingProduct.id
        );
        expect(unchangedProduct).toBeDefined();
        expect(unchangedProduct.productName).toBe("iPhone 14 Pro Max");
        expect(unchangedProduct.price).toBe(24000000);
      });

      expect(productService.getAllProducts).not.toHaveBeenCalled();
    });
  });

  describe("c) Test ProductDetail", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    let originalState;

    beforeEach(() => {
      jest.clearAllMocks();
      productService.getAllProducts.mockResolvedValue(mockApiResponse);
      originalState = useProductStore.getState();
      useProductStore.getState().getAllProducts(); //Fetch data on store
      mockOnEdit.mockClear();
      mockOnDelete.mockClear();
    });

    afterEach(() => {
      useProductStore.setState(originalState, true);
    });

    test("Should have enough fields of products", async () => {
      render(<ProductTable onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      await waitFor(() => {
        expect(screen.getByText("#1")).toBeInTheDocument(); //ID
        expect(screen.getByText("#2")).toBeInTheDocument();
        expect(screen.getByText("iPhone 14 Pro Max")).toBeInTheDocument(); //Product Name
        expect(screen.getByText("Samsung Galaxy S23")).toBeInTheDocument();
        expect(screen.getByText("iPhone")).toBeInTheDocument();   //Category
        expect(screen.getByText("Samsung")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument(); //Quantity
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("iPhone 14 Pro Max 256GB")).toBeInTheDocument(); // Description
        expect(
          screen.getByText("Samsung Galaxy S23 Ultra")
        ).toBeInTheDocument();
      });

      expect(formatVND).toHaveBeenCalledWith(24000000);
      expect(formatVND).toHaveBeenCalledWith(18000000);
    });

    test("Price should be formatted", async () => {
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
  });
});
