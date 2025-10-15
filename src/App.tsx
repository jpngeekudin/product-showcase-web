import { useState } from "react";
import LoginPage from "./pages/auth/LoginPage";
import ProductListPage from "./pages/products/ProductListPage";
import IndexRoutes from "./routes/IndexRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      {/* <LoginPage /> */}
      {/* <ProductListPage /> */}
      <IndexRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
