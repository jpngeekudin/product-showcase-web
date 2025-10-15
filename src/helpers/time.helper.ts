import moment from "moment";

export function formatDate(value: number | string, format: string = "DD MMM YYYY") {
  return moment(value).format(format);
}
