export class HtmlResponse {
  url?: string;
  data?: Record<string, object>;
  suppress?: boolean;
  enableFullScreen?: boolean;
  continueTtsDuringTouch?: boolean;

  constructor(obj: {
    url?: string;
    data?: Record<string, object>;
    suppress?: boolean;
    enableFullScreen?: boolean;
    continueTtsDuringTouch?: boolean;
  }) {
    this.url = obj.url;
    this.data = obj.data;
    this.suppress = obj.suppress;
    this.enableFullScreen = obj.enableFullScreen;
    this.continueTtsDuringTouch = obj.continueTtsDuringTouch;
  }
}
