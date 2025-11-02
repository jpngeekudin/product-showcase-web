import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLogo from "../../components/icons/AppLogo";
import Select from "react-select";
import { reactSelectStyles } from "../../styles/react-select-styles";
import Pagination from "../../components/Pagination";
import { axiosInstance } from "../../helpers/http.helper";
import type { IProduct } from "../../interfaces/product.interface";
import type { IApiResponse } from "../../interfaces/api-response.interface";
import { Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const productCategoryOpts = [
  { value: "fashion", label: "Fashion" },
  { value: "furniture", label: "Furniture" },
];

export default function ProductListPage() {
  const [listRefreshCounter, setListRefreshCounter] = useState(0);
  const [modalAdd, setModalAdd] = useState<{ show: boolean; item?: IProduct }>({
    show: false,
  });

  return (
    <>
      <div className="container pt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <div className="fw-bold fs-4">Daftar Produk</div>
            <div className="text-muted">
              Lihat semua produk yang tersedia di inventaris.
            </div>
          </div>
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <button className="btn btn-border">Perbarui Stok Produk</button>
            <button
              className="btn btn-primary"
              onClick={() => setModalAdd({ show: true })}
            >
              <i className="fa fa-plus me-1"></i>
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>
        <ProductList
          refreshCounter={listRefreshCounter}
          onEdit={(product) => setModalAdd({ show: true, item: product })}
        />
      </div>

      {modalAdd.show && (
        <ProductAddModal
          show={modalAdd.show}
          edited={modalAdd.item}
          onAdded={() => {
            toast.success("Success adding product");
            setListRefreshCounter((c) => c + 1);
          }}
          onHide={() => setModalAdd({ show: false })}
        />
      )}
    </>
  );
}

function ProductList({
  refreshCounter = 0,
  onEdit,
}: {
  refreshCounter?: number;
  onEdit: (product: IProduct) => void;
}) {
  const [internalRefreshCounter, setInternalRefreshCounter] = useState(0);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [modalDetail, setModalDetail] = useState<{
    show: boolean;
    data?: IProduct;
  }>({ show: false });

  useEffect(() => {
    setPage(1);
  }, [refreshCounter, internalRefreshCounter]);

  useEffect(() => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(itemsPerPage),
    });

    axiosInstance
      .get<IApiResponse<IProduct[]>>("/api/products?" + query.toString())
      .then((res) => {
        setProducts(res.data.data);
        setTotalItems(res.data.metadata.total);
      })
      .catch(console.error);
  }, [page, refreshCounter, internalRefreshCounter]);

  return (
    <>
      <div className="border rounded">
        <div className="d-flex align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center" style={{ gap: 10 }}>
            <div className="position-relative" style={{ width: 220 }}>
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Cari produk"
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
                options={[{ label: "Nama Produk" }]}
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
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Harga (Rp)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => {
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
                          src={`/api/files/get?path=${product.image}`}
                          alt=""
                          style={{ height: 40, width: 40, objectFit: "cover" }}
                        />
                        <div>{product.name}</div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>Rp. {product.price.toLocaleString("id-ID")}</td>
                    <td>
                      {product.status ? (
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
                          className="rounded-pill text-warning fw-semibold py-1 px-2"
                          style={{
                            backgroundColor: "rgba(var(--bs-warning-rgb), 0.1)",
                            fontSize: "0.8rem",
                          }}
                        >
                          <i className="fa fa-check-circle me-2"></i>
                          <span>Menipis</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setModalDetail({ show: true, data: product })
                        }
                      >
                        Lihat Detail
                      </span>
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

      {modalDetail.show && !!modalDetail.data && (
        <ProductDetailModal
          show={modalDetail.show}
          data={modalDetail.data}
          onEdit={() => {
            onEdit(modalDetail.data!);
            setModalDetail({ show: false });
          }}
          onDelete={() => setInternalRefreshCounter((c) => c + 1)}
          onHide={() => setModalDetail({ show: false })}
        />
      )}
    </>
  );
}

function ProductDetailModal({
  show,
  data,
  onEdit,
  onDelete,
  onHide,
}: {
  show: boolean;
  data: IProduct;
  onEdit: () => void;
  onDelete?: () => void;
  onHide: () => void;
}) {
  return (
    <Modal centered size="xl" show={show} onHide={onHide}>
      <Modal.Header className="d-flex align-items-center justify-content-between">
        <div>
          <div className="fw-bold fs-4">Detail Produk</div>
          <div className="text-muted">
            Berikut adalah detail dari produk yang dipilih
          </div>
        </div>
        <div style={{ cursor: "pointer" }} onClick={onHide}>
          <i className="fa fatimes"></i>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col col-4">
            <img
              src={`/api/files/get?path=${data.image}`}
              alt=""
              className="w-100 rounded"
              style={{ height: 200, objectFit: "cover" }}
            />
          </div>
          <div className="col col-8">
            <div className="row row-cols-2">
              <div className="col">
                <div className="mb-3">
                  <div className="text-muted mb-1">Nama Produk</div>
                  <div className="fw-semibold">{data.name}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted mb-1">Deskripsi Produk</div>
                  <div className="fw-semibold">{data.description}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted mb-1">Harga Satuan</div>
                  <div className="fw-semibold">
                    Rp. {data.price.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-muted mb-1">Status Produk</div>
                  <span
                    className="rounded-pill text-success border border-success fw-semibold px-2 py-1"
                    style={{
                      backgroundColor: "rgba(var(--bs-success-rgb), 0.2)",
                      fontSize: ".9rem",
                    }}
                  >
                    <i className="fa fa-circle-check me-2"></i>
                    <span>Active</span>
                  </span>
                </div>
              </div>
              <div className="col">
                <div className="mb-3">
                  <div className="text-muted mb-1">Kategori Produk</div>
                  <div className="fw-semibold">Meja</div>
                </div>
                <div className="rounded bg-light d-flex align-items-center justify-content-between p-3 mb-3">
                  <div>
                    <div className="text-muted mb-1">Stok Saat Ini</div>
                    <div className="fw-semibold">{data.stock} Unit</div>
                  </div>
                  <div
                    className="fw-semibold text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Perbarui
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
            Tutup
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              axiosInstance
                .delete(`/api/products/${data._id}`)
                .then((res) => {
                  toast.success("Success deleting product!");
                  onDelete?.();
                })
                .catch((err) => {
                  toast.error("Failed deleting product!");
                })
                .finally(() => {
                  onHide();
                });
            }}
          >
            Hapus
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            <i className="fa fa-pencil me-1"></i>
            <span>Edit Produk</span>
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function ProductAddModal({
  show,
  edited,
  onAdded,
  onHide,
}: {
  show: boolean;
  edited?: IProduct;
  onAdded: () => void;
  onHide: () => void;
}) {
  const { register, handleSubmit, watch, control, reset, setValue } = useForm<{
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
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
          <div className="fw-bold fs-4">Tambah Produk</div>
          <div className="text-muted">
            Masukkan detail produk untuk menambahkannya ke inventaris.
          </div>
        </div>
        <div style={{ cursor: "pointer" }} onClick={onHide}>
          <i className="fa fa-times"></i>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={handleSubmit((value) => {
            // suibmit: create new
            if (!edited) {
              const uploadBody = new FormData();
              uploadBody.append("file", value.image);
              const uploadQuery = new URLSearchParams({
                type: "product_image",
              });
              axiosInstance
                .post(`/api/files/upload?${uploadQuery.toString()}`, uploadBody)
                .then((res) => {
                  axiosInstance
                    .post(`/api/products`, {
                      name: value.name,
                      category: value.category,
                      stock: value.stock,
                      price: value.price,
                      description: value.description,
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
              const uploadQuery = new URLSearchParams({
                type: "product_image",
              });
              axiosInstance
                .post(`/api/files/upload?${uploadQuery.toString()}`, uploadBody)
                .then((res) => {
                  axiosInstance
                    .put(`/api/products/${value._id}`, {
                      name: value.name,
                      category: value.category,
                      stock: value.stock,
                      price: value.price,
                      description: value.description,
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
              <div className="row mb-3">
                <div className="col col-md-7">
                  <div className="mb-1">
                    <span>Nama Produk</span>
                    <span className="text-danger">*</span>
                  </div>
                  <input
                    {...register("name")}
                    type="text"
                    className="form-control"
                    placeholder="Masukkan nama produk"
                  />
                </div>
                <div className="col col-md-5">
                  <div className="mb-1">
                    <span>Kategori Produk</span>
                    <span className="text-danger">*</span>
                  </div>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => {
                      return (
                        <Select
                          options={productCategoryOpts}
                          styles={reactSelectStyles}
                          placeholder="Pilih Kategori"
                          value={productCategoryOpts.find(
                            (o) => o.value === field.value
                          )}
                          onChange={(v: any) => field.onChange(v.value)}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="mb-1">Deskripsi Produk</div>
                <textarea
                  {...register("description")}
                  className="form-control"
                  placeholder="Masukkan deskripsi produk"
                  rows={4}
                  style={{ resize: "none" }}
                ></textarea>
              </div>
              <div className="row mb-3">
                <div className="col col-lg-6">
                  <div className="mb-1">
                    <span>Harga Satuan</span>
                    <span className="text-danger">*</span>
                  </div>
                  <input
                    {...register("price", { valueAsNumber: true })}
                    type="number"
                    className="form-control"
                    placeholder="Masukkan harga"
                  />
                </div>
                <div className="col col-lg-6">
                  <div className="mb-1">
                    <span>Stok Awal</span>
                    <span className="text-danger">*</span>
                  </div>
                  <input
                    {...register("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Masukkan stock"
                  />
                </div>
              </div>
              <div
                className="rounded border d-flex align-items-center p-3"
                style={{ gap: 10 }}
              >
                <div>
                  <div className="fw-semibold fs-5">Status Produk</div>
                  <div className="text-muted">
                    Sistem akan menandai produk sebagai “Menipis” secara
                    otomatis jika stoknya mendekati habis.
                  </div>
                </div>
                <div style={{ width: 70 }}>
                  {status ? "Active" : "Inactive"}
                </div>
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
