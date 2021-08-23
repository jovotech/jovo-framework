import { Plugin, EnumRequestType } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { BasicCard, Carousel, CarouselBrowse, List, Table } from '../index';
import { GoogleActionResponse } from '../core/GoogleActionResponse';
import { HtmlResponse } from '../response/HtmlResponse';

export class InteractiveCanvas implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    GoogleAction.prototype.htmlResponse = function (obj: HtmlResponse) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }
      this.$output.GoogleAssistant.HtmlResponse = obj;

      return this;
    };
  }
  output(googleAction: GoogleAction) {
    if (!googleAction.hasInteractiveCanvasInterface()) {
      return;
    }
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }
    const output = googleAction.$output;

    const htmlResponse = _get(output, 'GoogleAssistant.HtmlResponse') as HtmlResponse;
    if (htmlResponse) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        htmlResponse: {
          url: htmlResponse.url,
          updatedState: htmlResponse.data,
          suppressMic: htmlResponse.suppress,
          enableFullScreen: htmlResponse.enableFullScreen,
          continueTtsDuringTouch: htmlResponse.continueTtsDuringTouch,
        },
      });
      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
