export interface IApiResponse<T = any> {
  data: T;
  success: boolean;
  metadata: {
    total: number;
  };
}
