import React, { type ReactNode } from "react";

export default function Loader({
  isLoading,
  isNoData = false,
  height = 400,
  children,
}: {
  isLoading: boolean;
  isNoData?: boolean;
  height?: string | number;
  children?: ReactNode | ReactNode[];
}) {
  return (
    <>
      {isLoading || isNoData ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height }}
        >
          {isLoading && <div className="spinner-border text-muted"></div>}
          {isNoData && <div className="fw-bold text-muted fs-4">No Data</div>}
        </div>
      ) : children}
    </>
  );
}
