import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="App">
      <Toaster closeButton={true} richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
