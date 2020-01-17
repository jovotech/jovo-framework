import { NetworkAdapter, NetworkResponse, RequestOptions, RequestType } from '../..';

export class NetworkHandler {
  private $adapter: NetworkAdapter;

  constructor(adapter: NetworkAdapter) {
    this.$adapter = adapter;
  }

  request<T = any>(type: RequestType, url: string, data?: any, options?: RequestOptions): Promise<NetworkResponse<T>> {
    return this.$adapter.request<T>(type, url, data, options);
  }

  get<T = any>(url: string, options?: RequestOptions): Promise<NetworkResponse<T>> {
    return this.request<T>('get', url, undefined, options);
  }

  post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<NetworkResponse<T>> {
    return this.request<T>('post', url, data, options);
  }

  put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<NetworkResponse<T>> {
    return this.request<T>('put', url, data, options);
  }

  delete<T = any>(url: string, options?: RequestOptions): Promise<NetworkResponse<T>> {
    return this.request<T>('delete', url, undefined, options);
  }
}
