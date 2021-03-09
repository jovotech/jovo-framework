import { Analytics, BaseApp, HandleRequest, Inputs, Log, PluginConfig } from 'jovo-core';
import type {
  Action,
  AudioAction,
  CorePlatformResponse,
  ProcessingAction,
  QuickReplyAction,
  SpeechAction,
  VisualAction,
  VisualActionBasicCard,
  VisualActionImageCard,
} from 'jovo-platform-core'; // tslint:disable-line
import _merge = require('lodash.merge');
import * as dashbot from 'dashbot'; // tslint:disable-line

export interface Config extends PluginConfig {
  key: string;
}

export class DashbotUniversal implements Analytics {
  config: Config = {
    key: '',
  };
  dashbot!: dashbot.Universal;

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.track = this.track.bind(this);
  }

  install(app: BaseApp) {
    // @ts-ignore
    this.dashbot = dashbot(this.config.key).universal;
    app.on('response', this.track);
  }

  uninstall(app: BaseApp) {
    app.removeListener('response', this.track);
  }

  /**
   * Sends the request & response logs to Dashbot
   * @param {HandleRequest} handleRequest
   */
  track(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return;
    }

    if (handleRequest.jovo.getPlatformType() === 'CorePlatform') {
      try {
        const requestLog = this.createRequestLog(handleRequest);
        this.dashbot.logIncoming(requestLog);
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }

      try {
        const responseLog = this.createResponseLog(handleRequest);
        this.dashbot.logOutgoing(responseLog);
      } catch (e) {
        Log.error('Error while logging to Dashbot');
        Log.error(e);
      }
    }
  }

  /**
   * returns the request log for Dashbot
   * @param {HandleRequest} handleRequest
   */
  private createRequestLog(handleRequest: HandleRequest): RequestLog {
    /**
     * text (user utterance) can be either in the request if text input was used,
     * or in the response if an ASR plugin transcribed the incoming audio file.
     */
    const request = handleRequest.host.getRequestObject();
    const response = handleRequest.jovo!.$response! as CorePlatformResponse;
    const text = request.request.body.text || response.context.request.asr?.text || '';

    const requestLog: RequestLog = {
      platformJson: {
        // complete JSON request that will be visible in Dashbot console
        asr: handleRequest.jovo!.$asr,
        nlu: handleRequest.jovo!.$nlu,
        request,
      },
      text,
      userId: handleRequest.jovo!.$request!.getUserId(),
    };

    const intent = handleRequest.jovo!.$nlu.intent?.name;
    if (intent) {
      requestLog.intent = {
        name: intent,
      };

      if (Object.keys(handleRequest.jovo!.$inputs).length > 0) {
        const inputs = this.parseJovoInputsToDashbotInputs(handleRequest.jovo!.$inputs);
        requestLog.intent.inputs = inputs;
      }
    }

    return requestLog;
  }

  /**
   * returns the response log for Dashbot
   * @param {HandleRequest} handleRequest
   */
  private createResponseLog(handleRequest: HandleRequest): ResponseLog {
    const actions = (handleRequest.jovo!.$response! as CorePlatformResponse).actions;
    const text = this.getResponseText(actions);
    const responseLog: ResponseLog = {
      platformJson: { ...handleRequest.jovo!.$response },
      text,
      userId: handleRequest.jovo!.$request!.getUserId(),
    };

    const images = this.getImageLogs(actions);
    if (images.length > 0) {
      responseLog.images = images;
    }

    const buttons = this.getButtonLogs(actions);
    if (buttons.length > 0) {
      responseLog.buttons = buttons;
    }

    return responseLog;
  }

  /**
   * returns an array of `Image` objects created from the VisualActions.
   * @param {Action[]} actions
   */
  private getImageLogs(actions: Action[]): Image[] {
    const images: Image[] = [];

    actions.forEach((action) => {
      if (action.type === 'VISUAL' && (action as VisualAction).visualType === 'IMAGE_CARD') {
        images.push({ url: (action as VisualActionImageCard).imageUrl });
      }
    });

    return images;
  }

  /**
   * returns an array of `Button` objects created form the QuickReplyActions.
   * @param {Action[]} actions
   */
  private getButtonLogs(actions: Action[]): Button[] {
    const buttons: Button[] = [];

    actions.forEach((action) => {
      if (action.type === 'QUICK_REPLY') {
        (action as QuickReplyAction).replies.forEach((quickReply) => {
          buttons.push({
            // use value as fallback, since empty strings are not shown in transcripts
            id: quickReply.id || quickReply.value,
            label: quickReply.label || quickReply.value,
            value: quickReply.value,
          });
        });
      }
    });

    return buttons;
  }

  /**
   * Creates a string containing the output for the SPEECH, AUDIO, VISUAL, and PROCESSING
   * action types. Each type is separated by a pipe ("|").
   * @param {Actions} actions array from response
   */
  private getResponseText(actions: Action[]): string {
    const textArr: string[] = actions.map((action) => {
      if (action.type === 'SPEECH') {
        return this.getSpeechActionText(action as SpeechAction);
      } else if (action.type === 'AUDIO') {
        return this.getAudioActionText(action as AudioAction);
      } else if (action.type === 'VISUAL') {
        return this.getVisualActionText(action as VisualAction);
      } else if (action.type === 'PROCESSING') {
        return this.getProcessingActionText(action as ProcessingAction);
      } else {
        // could be QuickReplies
        return '';
      }
    }, '');

    // we filter out all falsy values before constructing the string.
    return textArr.filter((value) => value).join(' | ');
  }

  /**
   * Will throw error if parsed any other action than of type `SpeechAction`
   *
   * returns `SPEECH: ${action's plain text}`
   * @param {SpeechAction} action
   */
  private getSpeechActionText(action: SpeechAction): string {
    return 'SPEECH: ' + action.plain || '';
  }

  /**
   * Will throw error if parsed any other action than of type `AudioAction`
   *
   * Returns a string containing the `AUDIO: ` tag as well as each tracks filename.
   *
   * e.g. `AUDIO: {fileName} | {fileName2} | ...`
   * @param {Action} action
   */
  private getAudioActionText(action: AudioAction): string {
    const text = action.tracks
      .map((track) => {
        return getFilenameFromUrl(track.src);
      })
      .join(' | ');

    return 'AUDIO: ' + text;
  }

  /**
   * Will throw error if parsed any other action than of type `VisualAction`
   *
   * Returns a string containing the `VISUAL: ` tag as well as the cards title, body,
   * and image name (if defined).
   *
   * e.g. `VISUAL: ${title} | ${body} | ${filename} }
   * @param {VisualAction} action
   */
  private getVisualActionText(action: VisualAction): string {
    let text = 'VISUAL: ';
    if (action.visualType === 'BASIC_CARD') {
      text += this.getBasicCardText(action as VisualActionBasicCard);
    } else if (action.visualType === 'IMAGE_CARD') {
      text += this.getImageCardText(action as VisualActionImageCard);
    }

    return text;
  }

  /**
   * Returns the text for `VisualActionBasicCard`
   * @param {VisualActionBasicCard} action
   */
  private getBasicCardText(action: VisualActionBasicCard): string {
    return `${action.title} | ${action.body}`;
  }

  /**
   * Returns the text for `VisualActionImageCard`
   * @param {VisualActionImageCard} action
   */
  private getImageCardText(action: VisualActionImageCard): string {
    let text = '';
    if (action.title) {
      text += `${action.title} | `;
    }
    if (action.body) {
      text += `${action.body} | `;
    }
    text += getFilenameFromUrl(action.imageUrl);

    return text;
  }

  /**
   * Returns `PROCESSING: ${action.text}`
   * @param {ProcessingAction} action
   */
  private getProcessingActionText(action: ProcessingAction): string {
    return 'PROCESSING: ' + action.text;
  }

  /**
   * First, delete the unused properties from the jovo-core `Input` interface
   * to match Dashbot's `Input` interface.
   * After that create array with the updated inputs
   * @param {Inputs} inputs request's inputs
   */
  private parseJovoInputsToDashbotInputs(inputs: Inputs): Input[] {
    const arr: Input[] = [];
    Object.values(inputs).forEach((input) => {
      delete input.key;
      delete input.id;

      arr.push(input);
    });

    return arr;
  }
}

/**
 * Returns the filename from the hosted files url
 * e.g. "https://www.example.com/my-audio.mp3" -> "my-audio.mp3"
 * @param {string} url
 * @returns {string}
 */
function getFilenameFromUrl(url: string): string {
  return url.slice(url.lastIndexOf('/') + 1);
}

/**
 * name and value will never be undefined.
 * had to mark them because jovo-core Input interface also marked them as possibly undefined
 */
interface Input {
  name?: string;
  value?: string;
}

interface Button {
  id: string;
  label: string;
  value: string;
}

interface Image {
  url: string;
}

interface Log {
  text: string;
  userId: string;
  platformJson: {
    [index: string]: any;
  };
}

interface RequestLog extends Log {
  intent?: {
    name: string;
    inputs?: Input[];
  };
}

interface ResponseLog extends Log {
  images?: Image[];
  buttons?: Button[];
}
