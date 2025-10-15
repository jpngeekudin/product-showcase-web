import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/http.helper";
import { useParams } from "react-router-dom";
import { Rating, RoundedStar, ThinStar } from "@smastrom/react-rating";
import type { IProduct } from "../../interfaces/product.interface";
import { getImageUrl } from "../../helpers/url.helper";
import Loader from "../../components/Loader";

export default function HomeProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<IProduct>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="container pt-5">
      <Loader isLoading={isLoading}>
        <div className="row mb-4">
          <div className="col col-4">
            <img
              src={getImageUrl(product?.image)}
              alt=""
              className="w-100 rounded mb-3"
              style={{ objectFit: "cover", height: 380 }}
            />
            <div className="row row-cols-4">
              {[1, 2, 3, 4].map((e, i) => {
                return (
                  <div key={i} className="col">
                    <img
                      src={getImageUrl(product?.image)}
                      alt=""
                      className="rounded w-100"
                      style={{ objectFit: "cover", height: 86 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col col-8">
            <div className="rounded border p-3">
              <div className="fw-semibold fs-5 mb-3">{product?.name}</div>
              <div
                className="d-flex align-items-center mb-4"
                style={{ gap: 12, fontSize: ".9rem" }}
              >
                <div>4.5</div>
                <Rating
                  readOnly
                  value={4.5}
                  style={{ maxWidth: 100 }}
                  itemStyles={{
                    itemShapes: RoundedStar,
                    activeFillColor: "#ffb700",
                    inactiveFillColor: "#fbf1a9",
                  }}
                />
                <div>30 Terjual</div>
              </div>
              <div className="fw-bold fs-3 text-primary mb-4">
                Rp. {product?.price.toLocaleString("id-ID")}
              </div>
              <table className="table table-borderless border-0 mb-4">
                <tbody>
                  <tr>
                    <td>Pengiriman</td>
                    <td>
                      <div className="fw-semibold mb-1">
                        Garansi Tiba: 4 - 6 September
                      </div>
                      <div className="text-muted">
                        Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Kuantitas</td>
                    <td>
                      <div
                        className="d-flex align-items-center"
                        style={{ gap: 16 }}
                      >
                        <div className="input-group" style={{ width: 150 }}>
                          <button
                            className="btn btn-border"
                            disabled={quantity <= 1}
                            onClick={() => setQuantity((i) => i - 1)}
                          >
                            <i className="fa fa-minus"></i>
                          </button>
                          <input
                            readOnly
                            type="number"
                            className="form-control"
                            value={quantity}
                          />
                          <button
                            className="btn btn-border"
                            disabled={quantity >= (product?.stock || 0)}
                            onClick={() => setQuantity((i) => i + 1)}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                        </div>
                        <div
                          className="rounded text-success fw-semibold px-3 py-2"
                          style={{
                            backgroundColor: "rgba(var(--bs-success-rgb), 0.2)",
                            fontSize: ".9rem",
                          }}
                        >
                          Tersedia
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className="btn btn-primary w-100 rounded-2 py-2">
                Beli Produk
              </button>
            </div>
          </div>
        </div>
        <div className="rounded bg-light fw-bold fs-5 p-2 mb-3">
          Deskripsi Produk
        </div>
        <div className="p-2">{product?.description || "No Description"}</div>
      </Loader>
    </div>
  );
}
