import type { StylesConfig } from "react-select";

export const reactSelectStyles: StylesConfig = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: "var(--bs-border-radius)",
    borderColor: "var(--bs-border-color)",
  }),
};
