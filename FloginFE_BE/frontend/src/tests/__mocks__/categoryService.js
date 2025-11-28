import "@testing-library/jest-dom";

export const mockGetAllCategory = jest.fn()

export const categoryService = {
    getAllCategory: mockGetAllCategory
}