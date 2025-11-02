import React, { useEffect } from "react";
import AppLogo from "../../components/icons/AppLogo";
import { useForm } from "react-hook-form";
import { Form } from "react-bootstrap";
import { axiosInstance } from "../../helpers/http.helper";
import { getStorageItem, setStorageItem } from "../../helpers/storage.helper";
import type { IApiResponse } from "../../interfaces/api-response.interface";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();

  useEffect(() => {
    const existingToken = getStorageItem("auth");
    if (!!existingToken) navigate("/");
  }, []);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="rounded rounded-3 border p-5" style={{ width: 460 }}>
        <div className="mb-3">
          <div className="mb-2">
            <AppLogo />
          </div>
          <div>Enter your username and password correctly</div>
        </div>
        <Form
          onSubmit={handleSubmit((value) => {
            axiosInstance
              .post<IApiResponse>("/api/auth/login", {
                username: value.username,
                password: value.password,
              })
              .then((res) => {
                if (!!res.data.data) {
                  setStorageItem("auth", {
                    token: res.data.data.token.access_token,
                  });
                  setStorageItem("user", res.data.data.user);
                  navigate("/");
                }
              });
          })}
        >
          <div className="mb-4">
            <div className="mb-3">
              <div className="mb-1">Username</div>
              <input
                {...register("username")}
                type="text"
                className="form-control"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-3">
              <div className="mb-1">Password</div>
              <input
                {...register("password")}
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
