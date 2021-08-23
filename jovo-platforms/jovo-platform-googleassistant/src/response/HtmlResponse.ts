export interface InteractiveCanvasResponse {
  url?: string;
  data?: Record<string, object>;
  suppress?: boolean;
  enableFullScreen?: boolean;
  continueTtsDuringTouch?: boolean;
}

export class HtmlResponse implements InteractiveCanvasResponse {
  url?: string;
  data?: Record<string, object>;
  suppress?: boolean;
  enableFullScreen?: boolean;
  continueTtsDuringTouch?: boolean;
  constructor(obj: Partial<InteractiveCanvasResponse>) {
    this.url = obj.url;
    this.data = obj.data;
    this.suppress = obj.suppress;
    this.enableFullScreen = obj.enableFullScreen;
    this.continueTtsDuringTouch = obj.continueTtsDuringTouch;
  }
}
