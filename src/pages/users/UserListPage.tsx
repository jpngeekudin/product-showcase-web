import React, { useEffect, useMemo, useRef, useState } from "react";
import { axiosInstance } from "../../helpers/http.helper";
import type { IApiResponse } from "../../interfaces/api-response.interface";
import type { IUser } from "../../interfaces/user.interface";
import Pagination from "../../components/Pagination";
import Select from "react-select";
import { reactSelectStyles } from "../../styles/react-select-styles";
import { formatDate } from "../../helpers/time.helper";
import { Controller, useForm } from "react-hook-form";
import { Form, Modal, OverlayTrigger } from "react-bootstrap";
import { toast } from "react-toastify";

export default function UserListPage() {
  const [listRefreshCounter, setListRefreshCounter] = useState(0);
  const [modal, setModal] = useState<{ show: boolean; edited?: IUser }>({
    show: false,
  });

  return (
    <>
      <div className="container pt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="fw-bold fs-4">Daftar User</div>
            <div className="text-muted">Lihat semua user yang terdaftar.</div>
          </div>
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <button className="btn btn-border">Perbarui User</button>
            <button
              className="btn btn-primary"
              onClick={() => setModal({ show: true })}
            >
              <i className="fa fa-plus me-1"></i>
              <span>Tambah User</span>
            </button>
          </div>
        </div>
        <UserList
          refreshCounter={listRefreshCounter}
          onEdit={(user) => setModal({ show: true, edited: user })}
        />
      </div>

      {modal.show && (
        <UserModal
          show={modal.show}
          edited={modal.edited}
          onHide={() => setModal({ show: false })}
          onAdded={() => setListRefreshCounter((c) => c + 1)}
        />
      )}
    </>
  );
}

function UserList({
  refreshCounter = 0,
  onEdit,
}: {
  refreshCounter?: number;
  onEdit: (user: IUser) => void;
}) {
  const [internalRefershCounter, setInternalRefreshCounter] = useState(0);
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [refreshCounter, internalRefershCounter]);

  useEffect(() => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(itemsPerPage),
    });

    axiosInstance
      .get<IApiResponse<IUser[]>>("/api/user?" + query.toString())
      .then((res) => {
        setUsers(res.data.data);
        setTotalItems(res.data.metadata.total);
      })
      .catch(console.error);
  }, [page, refreshCounter, internalRefershCounter]);

  return (
    <div className="border rounded">
      <div className="d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <div className="position-relative" style={{ width: 220 }}>
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Cari user"
            />
            <div
              className="position-absolute text-muted"
              style={{
                left: 20,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <i className="fa fa-search"></i>
            </div>
          </div>
          <div style={{ width: 200 }}>
            <Select
              options={[{ label: "Semua Kategori" }]}
              placeholder="Pilih Kategori"
              styles={reactSelectStyles}
            />
          </div>
          <div style={{ width: 200 }}>
            <Select
              options={[{ label: "Semua Status" }]}
              placeholder="Pilih Status"
              styles={reactSelectStyles}
            />
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <div className="fw-semibold">Urutkan: </div>
          <div style={{ width: 150 }}>
            <Select
              options={[{ label: "Fullname" }]}
              placeholder="Sort"
              styles={reactSelectStyles}
            />
          </div>
          <div style={{ width: 100 }}>
            <Select
              options={[{ label: "Asc" }]}
              placeholder="Sort"
              styles={reactSelectStyles}
            />
          </div>
        </div>
      </div>
      <div className="border-top">
        <table className="table">
          <thead>
            <tr>
              <th>Nama User</th>
              <th>No Telp</th>
              <th>Tanggal Dibuat</th>
              <th>Status</th>
              <th style={{ width: 160 }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 10 }}
                    >
                      {/* <div
                        className="rounded bg-light border"
                        style={{ height: 40, width: 40 }}
                      ></div> */}
                      <img
                        className="rounded"
                        src={`/api/files/get?path=${user.image}`}
                        alt=""
                        style={{ height: 40, width: 40, objectFit: "cover" }}
                      />
                      <div>{user.fullname}</div>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{formatDate(user.created_at, "DD MMMM, YYYY")}</td>
                  <td>
                    {user.status ? (
                      <span
                        className="rounded-pill text-success fw-semibold py-1 px-2"
                        style={{
                          backgroundColor: "rgba(var(--bs-success-rgb), 0.1)",
                          fontSize: "0.8rem",
                        }}
                      >
                        <i className="fa fa-check-circle me-2"></i>
                        <span>Active</span>
                      </span>
                    ) : (
                      <span
                        className="rounded-pill text-dark fw-semibold py-1 px-2"
                        style={{
                          backgroundColor: "rgba(var(--bs-dark-rgb), 0.1)",
                          fontSize: "0.8rem",
                        }}
                      >
                        <i className="fa fa-check-circle me-2"></i>
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 10 }}
                    >
                      <div
                        className="text-primary fw-bold cursor-pointer"
                        onClick={() => onEdit(user)}
                      >
                        Lihat Detail
                      </div>
                      <OverlayTrigger
                        trigger={["click"]}
                        placement="auto"
                        overlay={(props) => {
                          return (
                            <div {...props}>
                              <div className="border rounded bg-white">
                                <div className="list-group list-group-flush">
                                  <div
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onEdit(user)}
                                  >
                                    Edit
                                  </div>
                                  <div
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      axiosInstance
                                        .delete(`/api/user/${user._id}`)
                                        .then((res) => {
                                          toast.success(
                                            "Success deleting user!"
                                          );
                                          setInternalRefreshCounter(
                                            (c) => c + 1
                                          );
                                        })
                                        .catch((err) => {
                                          toast.error("Failed deleting user");
                                        });
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      >
                        <div style={{ cursor: "pointer" }}>
                          <i className="fa fa-ellipsis-h"></i>
                        </div>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-top p-3">
        <Pagination
          page={page}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

function UserModal({
  show,
  edited,
  onAdded,
  onHide,
}: {
  show: boolean;
  edited?: IUser;
  onAdded: () => void;
  onHide: () => void;
}) {
  const { control, register, watch, handleSubmit, setValue, reset } = useForm<{
    _id: string;
    fullname: string;
    username: string;
    phone: string;
    email: string;
    password: string;
    status: boolean;
    image: File;
  }>();

  useEffect(() => {
    if (!edited) return;
    reset({ ...edited, image: undefined });
    axiosInstance
      .get(`/api/files/get?path=${edited.image}`, { responseType: "blob" })
      .then((res) => {
        const image = new File([res.data], "image");
        setValue("image", image);
      });
  }, [edited]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const image = watch("image");
  const inputtedImageUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  const status = watch("status");

  return (
    <Modal centered size="xl" show={show} onHide={onHide}>
      <Modal.Header className="justify-content-between">
        <div>
          <div className="fw-bold fs-4">Tambah User</div>
          <div className="text-muted">
            Masukkan detail user untuk menambahkannya ke manajemen user.
          </div>
        </div>
        <div style={{ cursor: "pointer" }} onClick={onHide}>
          <i className="fa fa-times"></i>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit((value) => {
            // submit: create new
            if (!edited) {
              const uploadBody = new FormData();
              uploadBody.append("file", value.image);
              const uploadQuery = new URLSearchParams({ type: "user_image" });
              axiosInstance
                .post(`/api/files/upload?${uploadQuery.toString()}`, uploadBody)
                .then((res) => {
                  axiosInstance
                    .post(`/api/user`, {
                      username: value.username,
                      password: value.password,
                      fullname: value.fullname,
                      phone: value.phone,
                      email: value.email,
                      status: value.status,
                      image: res.data.data,
                    })
                    .then((res) => {
                      onAdded();
                      onHide();
                    })
                    .catch(console.error);
                })
                .catch(console.error);
            }

            // submit: edit existing
            else {
              const uploadBody = new FormData();
              uploadBody.append("file", value.image);
              const uploadQuery = new URLSearchParams({ type: "user_image" });
              axiosInstance
                .post(`/api/files/upload?${uploadQuery.toString()}`, uploadBody)
                .then((res) => {
                  axiosInstance
                    .put(`/api/user/${value._id}`, {
                      username: value.username,
                      password: value.password,
                      fullname: value.fullname,
                      phone: value.phone,
                      email: value.email,
                      status: value.status,
                      image: res.data.data,
                    })
                    .then((res) => {
                      onAdded();
                      onHide();
                    })
                    .catch(console.error);
                })
                .catch(console.error);
            }
          })}
        >
          <div className="row mb-3">
            <div className="col col-md-4">
              {inputtedImageUrl ? (
                <img
                  src={inputtedImageUrl}
                  alt=""
                  className="w-100 rounded mb-3"
                  style={{ height: 240, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded bg-light mb-3"
                  style={{ height: 160 }}
                ></div>
              )}
              <Controller
                control={control}
                name="image"
                render={({ field: { ref, name, onBlur, onChange } }) => {
                  return (
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={(e) => {
                        ref(e);
                        inputFileRef.current = e;
                      }}
                      name={name}
                      onBlur={onBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!!file) onChange(file);
                      }}
                    />
                  );
                }}
              />
              <button
                className="btn btn-border w-100"
                onClick={() => inputFileRef.current?.click()}
              >
                <i className="fa fa-upload me-1"></i>
                <span>Unggah Gambar</span>
              </button>
            </div>
            <div className="col col-md-8">
              <div className="row g-3 mb-3">
                <div className="col col-12">
                  <div className="mb-1">
                    <span>Username</span>
                    <span className="text-danger ms-1">*</span>
                  </div>
                  <input
                    {...register("username")}
                    type="text"
                    className="form-control"
                    placeholder="Masukkan username"
                  />
                </div>
                <div className="col col-md-6">
                  <div className="mb-1">
                    <span>Nama Lengkap</span>
                    <span className="text-danger">*</span>
                  </div>
                  <input
                    {...register("fullname")}
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="col col-md-6">
                  <div className="mb-1">
                    <span>No Telepon</span>
                    <span className="text-danger">*</span>
                  </div>
                  <input
                    {...register("phone")}
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div className="col col-12">
                  <div className="mb-1">Email</div>
                  <input
                    {...register("email")}
                    type="email"
                    className="form-control"
                  />
                </div>
                <div className="col col-12">
                  <div className="mb-1">
                    <span>Password</span>
                    <span className="text-danger ms-1">*</span>
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    className="form-control"
                    placeholder="Masukkan kata sandi"
                  />
                </div>
                <div className="col col-12">
                  <div
                    className="rounded border d-flex align-items-center p-3"
                    style={{ gap: 10 }}
                  >
                    <div>
                      <div className="fw-semibold fs-5">Status User</div>
                      <div className="text-muted">
                        Jika user telah lama tidak aktif anda bisa menonaktifkan
                        status user secara manual
                      </div>
                    </div>
                    <div>{status ? "Aktif" : "Nonaktif"}</div>
                    <div className="form-check form-switch">
                      <input
                        {...register("status")}
                        type="checkbox"
                        className="form-check-input"
                        style={{ width: 30, height: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex align-items-center justify-content-end"
            style={{ gap: 10 }}
          >
            <button className="btn btn-border" onClick={onHide}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Simpan
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
