import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductListPage from "../pages/products/ProductListPage";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import LayoutMain from "../components/layouts/LayoutMain";
import UserListPage from "../pages/users/UserListPage";
import HomePage from "../pages/home/HomePage";
import HomeProductDetailPage from "../pages/home/HomeProductDetailPage";

export default function IndexRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          element={
            <ProtectedRoute>
              <LayoutMain />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to={"home"} />} />
          <Route path="home">
            <Route path="" element={<HomePage />} />
            <Route path=":id" element={<HomeProductDetailPage />} />
          </Route>
          <Route path="products" element={<ProductListPage />} />
          <Route path="users" element={<UserListPage />} />
        </Route>
        <Route path="auth">
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
