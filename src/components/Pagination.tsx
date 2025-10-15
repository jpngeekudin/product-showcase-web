import React, { useMemo } from "react";
import ReactPaginate from "react-paginate";

interface IProps {
  page: number;
  totalItems: number;
  itemsPerPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalItems,
  itemsPerPage,
  onChange,
}: IProps) {
  const pageCount = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <span className="me-1">Menampilkan {itemsPerPage} dari</span>
        <span className="text-primary fw-semibold me-1">{totalItems}</span>
        <span>data</span>
      </div>
      <ReactPaginate
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me px-2"}
        containerClassName={"pagination react-paginate"}
        activeClassName={"active"}
        pageCount={pageCount}
        forcePage={page - 1}
        onPageChange={({ selected }) => onChange(selected + 1)}
      />
    </div>
  );
}
