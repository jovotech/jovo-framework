export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export interface RequestConfig {
  headers?: Record<string, string>;
}

// tslint:disable-next-line:no-any
export interface NetworkResponse<T = any> {
  data?: T;
  status: number;
}

export interface NetworkAdapter {
  // tslint:disable-next-line:no-any
  request<T = any>(
    type: RequestMethod,
    url: string,
    data?: any, // tslint:disable-line:no-any
    config?: RequestConfig,
  ): Promise<NetworkResponse<T>>;
}
