import { RequestBody, RequestType, WebRequest, WebResponse } from '../index';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type VoidListener = () => void;
export type ErrorListener = (error: Error) => void;

export interface ClientInputObject {
  type: RequestType;
  body?: RequestBody;
}

export type ClientWebRequestSendMethod = () => Promise<WebResponse>;

export interface ClientWebRequest extends WebRequest {
  send: ClientWebRequestSendMethod;
}
