export type RequestType = 'get' | 'post' | 'put' | 'delete';

export interface RequestOptions {
  headers?: Record<string, string>;
}

export interface NetworkResponse<T = any> {
  data?: T;
  status: number;
}

export interface NetworkAdapter {
  request<T = any>(
    type: RequestType,
    url: string,
    data?: any,
    options?: RequestOptions,
  ): Promise<NetworkResponse<T>>;
}
