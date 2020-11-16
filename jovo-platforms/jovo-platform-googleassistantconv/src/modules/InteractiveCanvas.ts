import { Plugin } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { HtmlResponse } from '..';
import { ConversationalActionResponse } from '../core/ConversationalActionResponse';

export class InteractiveCanvas implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    GoogleAction.prototype.htmlResponse = function (obj: HtmlResponse) {
      if (!this.$output.GoogleAssistant) {
        this.$output.GoogleAssistant = {};
      }
      this.$output.GoogleAssistant.htmlResponse = obj;

      return this;
    };
  }
  output(googleAction: GoogleAction) {
    if (!googleAction.hasInteractiveCanvasInterface()) {
      return;
    }
    const output = googleAction.$output;
    const htmlResponse = _get(output, 'GoogleAssistant.htmlResponse') as HtmlResponse;
    if (htmlResponse) {
      _set(googleAction.$response as ConversationalActionResponse, 'prompt.canvas', htmlResponse);
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
