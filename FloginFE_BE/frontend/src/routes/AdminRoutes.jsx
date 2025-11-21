import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProductPage from "../pages/ProductPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="products" element={<ProductPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;