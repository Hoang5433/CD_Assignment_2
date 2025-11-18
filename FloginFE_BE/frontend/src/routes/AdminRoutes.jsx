import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import ProductManager from "../components/Product";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="products" element={<ProductManager />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;