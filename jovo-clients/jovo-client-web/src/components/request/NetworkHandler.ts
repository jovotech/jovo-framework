import { NetworkAdapter, NetworkResponse, RequestConfig, RequestMethod } from '../..';

export class NetworkHandler {
  private $adapter: NetworkAdapter;

  constructor(adapter: NetworkAdapter) {
    this.$adapter = adapter;
  }

  // tslint:disable-next-line:no-any
  request<T = any>(
    type: RequestMethod,
    url: string,
    data?: any, // tslint:disable-line:no-any

    config?: RequestConfig,
  ): Promise<NetworkResponse<T>> {
    return this.$adapter.request<T>(type, url, data, config);
  }

  // tslint:disable-next-line:no-any
  get<T = any>(url: string, config?: RequestConfig): Promise<NetworkResponse<T>> {
    return this.request<T>('get', url, undefined, config);
  }

  // tslint:disable-next-line:no-any
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<NetworkResponse<T>> {
    return this.request<T>('post', url, data, config);
  }

  // tslint:disable-next-line:no-any
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<NetworkResponse<T>> {
    return this.request<T>('put', url, data, config);
  }

  // tslint:disable-next-line:no-any
  delete<T = any>(url: string, config?: RequestConfig): Promise<NetworkResponse<T>> {
    return this.request<T>('delete', url, undefined, config);
  }
}
