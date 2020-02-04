import { EventEmitter } from 'events';
import { NetworkAdapter, NetworkResponse, RequestConfig, RequestMethod } from '../../..';

export class AjaxAdapter implements NetworkAdapter {
  constructor(private readonly parent: EventEmitter) {}

  request<T>(
    type: RequestMethod,
    url: string,
    data?: any, // tslint:disable-line:no-any
    config?: RequestConfig,
  ): Promise<NetworkResponse<T>> {
    return new Promise<NetworkResponse<T>>((resolve, reject) => {
      const xhrequest = new XMLHttpRequest();

      xhrequest.onload = () => {
        let responseData = xhrequest.response;
        if (typeof xhrequest.response === 'string') {
          responseData = JSON.parse(xhrequest.response);
        }
        resolve({ status: xhrequest.status, data: responseData as T });
      };
      this.setListeners(xhrequest);

      if (xhrequest.upload) {
        this.setUploadListeners(xhrequest);
      }

      xhrequest.open(type.toUpperCase(), url, true);
      if (config && config.headers) {
        // tslint:disable-next-line:forin
        for (const header in config.headers) {
          if (typeof data === 'undefined' && header.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete config.headers[header];
          } else {
            // Otherwise add header to the request
            xhrequest.setRequestHeader(header, config.headers[header]);
          }
        }
      }
      xhrequest.send(data);
    });
  }

  private setListeners(xhrequest: XMLHttpRequest) {
    xhrequest.onprogress = this.handleEvent.bind(this, 'progress');
    xhrequest.onabort = this.handleEvent.bind(this, 'abort');
    xhrequest.ontimeout = this.handleEvent.bind(this, 'timeout');
  }

  private setUploadListeners(xhrequest: XMLHttpRequest) {
    xhrequest.upload.onloadstart = this.handleEvent.bind(this, 'upload.start');
    xhrequest.upload.onprogress = this.handleEvent.bind(this, 'upload.progress');
    xhrequest.upload.onabort = this.handleEvent.bind(this, 'upload.abort');
    xhrequest.upload.onerror = this.handleEvent.bind(this, 'upload.error');
    xhrequest.upload.onload = this.handleEvent.bind(this, 'upload.success');
  }

  private handleEvent(eventName: string, event?: ProgressEvent) {
    this.parent.emit(`request.${eventName}`, event);
  }
}
