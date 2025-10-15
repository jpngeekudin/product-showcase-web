import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../helpers/http.helper";
import type { IProduct } from "../../interfaces/product.interface";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams({ page: "1", size: "8" });
    axiosInstance
      .get(`/api/products?${query.toString()}`)
      .then((res) => {
        if (!!res.data.data) {
          setProducts(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <Hero />
      <div className="container pt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="fw-bold fs-4">Rekomendasi</div>
            <div className="text-muted">Produk-produk pilihan terbaik kami</div>
          </div>
          <button className="btn btn-border">Lihat Semua Produk</button>
        </div>
        <div className="row row-cols-lg-4 g-4 mb-4">
          {products.map((product, i) => {
            return (
              <div key={i} className="col">
                <div
                  className="card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(product._id)}
                >
                  <img
                    src={`/api/files/get?path=${product.image}`}
                    alt=""
                    className="rounded-top"
                    style={{ height: 180, objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <div className="fw-semibold mb-3">{product.name}</div>
                    <div className="fw-bold text-primary fs-5 mb-2">
                      Rp. {product.price.toLocaleString("id-ID")}
                    </div>
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 10, fontSize: ".9rem" }}
                    >
                      <div>
                        <i
                          className="fa fa-star me-1"
                          style={{ color: "#FFB700" }}
                        ></i>
                        <span>4.9</span>
                      </div>
                      <div style={{ color: "#CACACA" }}>&#8226;</div>
                      <div>121 Terjual</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div
      className="position-relative"
      style={{
        height: 400,
        background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('/assets/images/home-bg.png')`,
        backgroundSize: "cover",
      }}
    >
      <div
        className="position-absolute text-white text-center"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="fw-bold mb-2" style={{ fontSize: "1.7rem" }}>
          Cari Fitur Impian
        </div>
        <div className="mb-3">
          Cari furnitur mulai dari meja, lemari, hingga rak disini
        </div>
        <div className="d-flex align-items-center" style={{ gap: 20 }}>
          <input
            type="text"
            className="form-control rounded-pill py-2"
            placeholder="Cari produk"
            style={{ width: 600 }}
          />
          <button
            className="btn btn-primary rounded-circle"
            style={{ width: 46, height: 46 }}
          >
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
