import React, { useMemo, useRef } from "react";
import AppLogo from "../icons/AppLogo";
import { Outlet, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AppTooltip from "../AppTooltip";
import { getStorageItem } from "../../helpers/storage.helper";
import type { IUser } from "../../interfaces/user.interface";

export default function LayoutMain() {
  const navigate = useNavigate();

  const user: IUser = useMemo(() => {
    return getStorageItem("user");
  }, []);

  return (
    <div>
      <div className="border-bottom p-3">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              <AppLogo />
            </div>
            <OverlayTrigger
              rootClose
              trigger={["click"]}
              placement="bottom-end"
              overlay={(props) => {
                return (
                  <div {...props}>
                    <div
                      className="border rounded bg-white p-1"
                      style={{ width: 300 }}
                    >
                      <div className="list-group list-group-flush">
                        <div
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            navigate("/products");
                            document.body.click();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Products Management
                        </div>
                        <div
                          className="list-group-item list-group-item-action"
                          onClick={() => {
                            navigate("/users");
                            document.body.click();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Users Management
                        </div>
                        <div
                          className="list-group-item list-group-item-action text-danger"
                          onClick={() => {
                            localStorage.clear();
                            navigate("/auth/login");
                            document.body.click();
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          Logout
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            >
              <div
                className="d-flex align-items-center"
                style={{ gap: 10, cursor: "pointer" }}
              >
                <i className="fa fa-chevron-down"></i>
                <div className="fw-semibold">{user?.fullname}</div>
                <div
                  className="rounded-circle bg-light border"
                  style={{ height: 32, width: 32 }}
                ></div>
              </div>
            </OverlayTrigger>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
