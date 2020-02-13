import { Button, ButtonType, WebViewHeightRatio } from '../..';

export interface LinkButtonOptions {
  webview_height_ratio?: WebViewHeightRatio;
  messenger_extensions?: boolean;
  fallback_url?: string;
  webview_share_button?: string;
}

export class LinkButton extends Button {
  constructor(public title: string, public url: string, options?: LinkButtonOptions) {
    super(ButtonType.Link);

    if (options) {
      const entries = Object.entries(options);
      entries.forEach((entry: [string, any]) => {
        const key = entry[0];
        this[key] = entry[1];
      });
    }
  }
}
