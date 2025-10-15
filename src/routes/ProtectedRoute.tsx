import React from "react";
import { getStorageItem } from "../helpers/storage.helper";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: any;
}) {
  const { token } = getStorageItem("auth");

  if (!token) {
    return <Navigate to={"/auth/login"} />;
  }

  return children;
}
