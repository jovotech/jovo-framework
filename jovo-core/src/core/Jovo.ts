import { EventEmitter } from 'events';
import _cloneDeep = require('lodash.clonedeep');
import _get = require('lodash.get');
import _sample = require('lodash.sample');
import _set = require('lodash.set');
import {
  AudioData,
  Cms,
  EnumRequestType,
  ErrorCode,
  JovoError,
  Log,
  SessionConstants,
  SessionData,
  SpeechBuilder,
  ValidationError,
  Validator,
} from '..';
import {
  Host,
  Inputs,
  JovoData,
  JovoRequest,
  JovoResponse,
  JovoSession,
  Output,
  RequestType,
  SessionAttributes,
} from '../Interfaces';
import { AsrData } from './AsrData';
import { BaseApp, BaseAppConfig } from './BaseApp';
import { HandleRequest } from './HandleRequest';
import { NluData } from './NluData';
import { User } from './User';

export abstract class Jovo extends EventEmitter {
  readonly $host: Host;
  readonly $app: BaseApp;
  readonly $data: JovoData;
  readonly $config: BaseAppConfig;
  $type: RequestType;
  $handleRequest?: HandleRequest;
  $jovo: Jovo;
  $user: User;
  $asr: AsrData;
  $nlu: NluData;
  $inputs: Inputs;
  readonly $output: Output;
  $request?: JovoRequest;
  $response?: JovoResponse;
  $session: JovoSession;
  readonly $plugins?: any; // tslint:disable-line
  $speech: SpeechBuilder;
  $reprompt: SpeechBuilder;
  $cms: Cms;

  $rawResponseJson?: any; // tslint:disable-line

  $requestSessionAttributes: SessionAttributes = {};

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super();
    this.setMaxListeners(0);
    this.$jovo = this;
    this.$handleRequest = handleRequest;
    this.$host = host;
    this.$app = app;
    this.$data = {};
    this.$config = _cloneDeep(app.config);
    this.$session = {
      $data: {},
    };
    this.$type = {
      optional: true,
      type: EnumRequestType.UNKNOWN_REQUEST,
    };
    this.$asr = new AsrData();
    this.$nlu = new NluData();
    this.$inputs = {};
    this.$output = {};
    this.$request = undefined;
    this.$response = undefined;
    this.$plugins = {};
    this.$user = new User(this);
    this.$cms = new Cms();
    this.$speech = this.speechBuilder()!;
    this.$reprompt = this.speechBuilder()!;
  }

  /**
   * Returns boolean if request is part of new session
   * @public
   * @return {boolean}
   */
  abstract isNewSession(): boolean;

  /**
   * Returns audio capability of request device
   * @public
   * @return {boolean}
   */
  abstract hasAudioInterface(): boolean;

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  abstract hasScreenInterface(): boolean;

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  abstract hasVideoInterface(): boolean;

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  abstract getSpeechBuilder(): SpeechBuilder | undefined;

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  abstract speechBuilder(): SpeechBuilder | undefined;

  /**
   * Returns device id. Doesn't work with all platforms.
   * @returns {string | undefined}
   */
  abstract getDeviceId(): string | undefined;

  /**
   * Returns raw text of request. Doesn't work with all platforms.
   * @returns {string | undefined}
   */
  abstract getRawText(): string | undefined;

  /**
   * Returns audio data of request. Doesn't work with all platforms.
   * @returns {AudioData | undefined}
   */
  abstract getAudioData(): AudioData | undefined;

  /**
   * Returns timestamp of a user's request
   * @returns {string | undefined}
   */
  abstract getTimestamp(): string | undefined;

  /**
   * Returns locale of the request
   * @deprecated use this.$request.getLocale() instead
   * @returns {string}
   */
  abstract getLocale(): string | undefined;

  /**
   * Returns type of platform ("AlexaSkill","GoogleAction")
   * @public
   * @return {string}
   */
  abstract getType(): string | undefined;

  /**
   * Returns type of platform e.g. ("Alexa","GoogleAssistant")
   * @public
   * @return {string}
   */
  abstract getPlatformType(): string;

  /**
   * Returs id of the touched/selected item
   * @public
   * @return {*}
   */
  abstract getSelectedElementId(): string | undefined;

  /**
   * Returns UserID
   * @deprecated Use this.$user.getId() instead.
   * @public
   * @return {string}
   */
  getUserId() {
    return this.$user.getId();
  }

  /**
   * Returns state value stored in the request session
   * @return {string}
   */
  getState() {
    return this.getSessionAttribute(SessionConstants.STATE);
  }

  /**
   * Saves state to sessionAttributes
   * @param {String} state
   * @return {Jovo}
   */
  setState(state: string | undefined) {
    if (typeof state === 'undefined') {
      this.removeState();
    } else {
      this.setSessionAttribute(SessionConstants.STATE, state);
    }
    return this;
  }

  /**
   * Removes state from session
   * @return {Jovo}
   */
  removeState() {
    if (this.$session && this.$session.$data[SessionConstants.STATE]) {
      delete this.$session.$data[SessionConstants.STATE];
    }
    return this;
  }

  /**
   * Returns session data value for given path
   * @param {string=} path
   * @return {any}
   */
  getSessionData(path?: string) {
    if (path) {
      return this.getSessionAttribute(path);
    } else {
      return this.getSessionAttributes();
    }
  }

  /**
   * Returns session attribute value for given path
   * @param {string} path
   * @return {any}
   */
  getSessionAttribute(path: string): any {
    // tslint:disable-line
    if (this.$session) {
      return _get(this.$session.$data, path);
    }
    return;
  }

  /**
   * Returns full session attributes obj
   * @return {any}
   */
  getSessionAttributes(): SessionData | undefined {
    if (this.$session) {
      return this.$session.$data;
    }
    return;
  }

  /**
   * Sets session data for given path
   * @param {SessionData} obj
   * @returns {this}
   */
  setSessionData(obj: SessionData): this;
  setSessionData(path: string, value: any): this; // tslint:disable-line
  setSessionData(objOrPath: string | SessionData, value?: any) {
    // tslint:disable-line
    if (typeof objOrPath === 'string') {
      return this.setSessionAttribute(objOrPath, value);
    } else {
      return this.setSessionAttributes(objOrPath);
    }
  }

  /**
   * Sets session attribute for given path
   * @param {string} path
   * @param {any} value
   * @return {Jovo} this
   */
  setSessionAttribute(path: string, value: any): this {
    // tslint:disable-line
    if (this.$session) {
      _set(this.$session.$data, path, value);
    }
    return this;
  }

  /**
   * Adds session data object for given path
   * @param {string} path
   * @param {any} value
   * @return {Jovo} this
   */
  addSessionData(path: string, value: any): this {
    // tslint:disable-line
    return this.setSessionAttribute(path, value);
  }

  /**
   * Adds session attribute for given path
   * @param {string} path
   * @param {any} value
   * @return {Jovo} this
   */
  addSessionAttribute(path: string, value: any): this {
    // tslint:disable-line
    return this.setSessionAttribute(path, value);
  }

  /**
   * Sets full session attributes obj
   * @public
   * @param {any} sessionData
   * @return {Jovo} this
   */
  setSessionAttributes(sessionData: SessionData) {
    if (this.$session) {
      this.$session.$data = sessionData;
    }
    return this;
  }

  /**
   * Returns access token
   * @deprecated use this.$request.getAccessToken() instead
   * @returns {string}
   */
  getAccessToken(): string | undefined {
    return this.$request!.getAccessToken();
  }

  /**
   * Returns request intent name
   * @deprecated use this.$request.getIntentName() instead
   * @returns {string}
   */
  getIntentName() {
    return this.$request!.getIntentName();
  }

  /**
   * Responds with the given text and ends session
   * Transforms plaintext to SSML
   * @public
   * @param {string|SpeechBuilder|string[]} speech Plaintext or SSML
   */
  tell(speech: string | SpeechBuilder | string[]): Jovo {
    if (!speech) {
      throw new Error('Speech must not be undefined');
    }

    if (Array.isArray(speech)) {
      speech = _sample(speech)!;
    }

    delete this.$output.ask;
    this.$output.tell = {
      speech: speech.toString(),
    };
    return this;
  }

  /**
   * Says speech and waits for answer from user.
   * Reprompt when user input fails.
   * Keeps session open.
   * @public
   * @param {string|SpeechBuilder} speech
   * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
   */
  ask(speech: string | SpeechBuilder | string[], reprompt?: string | SpeechBuilder | string[]) {
    delete this.$output.tell;

    if (!speech) {
      throw new Error('Speech must not be undefined');
    }

    if (Array.isArray(speech)) {
      speech = _sample(speech)!;
    }

    if (Array.isArray(reprompt)) {
      reprompt = _sample(reprompt);
    }

    if (!reprompt) {
      reprompt = speech;
    }

    this.$output.ask = {
      speech: speech.toString(),
      reprompt: reprompt.toString(), // tslint:disable-line:object-literal-sort-keys
    };

    return this;
  }

  /**
   * Maps incoming request input key names with
   * keys from the inputMap
   * @param {*} inputMap
   */
  mapInputs(inputMap: { [key: string]: string }): void {
    const mappedInputs: Inputs = {};

    Object.keys(this.$inputs).forEach((inputKey: string) => {
      if (inputMap[inputKey]) {
        Log.verbose(`Mapping input key ${inputKey} to ${inputMap[inputKey]}.`);
        mappedInputs[inputMap[inputKey]] = this.$inputs[inputKey];
      } else {
        mappedInputs[inputKey] = this.$inputs[inputKey];
      }
    });
    this.$inputs = mappedInputs;
  }

  /**
   * Get input object by name
   * @public
   * @param {string} key
   * @return {*}
   */
  getInput(key: string) {
    return _get(this.$inputs, key);
  }

  /**
   * Sets output object
   * @public
   * @param {Output} obj
   * @return {Jovo}
   */
  setOutput(obj: Output) {
    Object.assign(this.$output, obj);
    return this;
  }

  /**
   * Set raw json response.
   * @param obj
   */
  setResponseObject(obj: any) {
    // tslint:disable-line
    this.$rawResponseJson = obj;
  }

  /**
   * Shows simple card to response
   * @public
   * @param {string} title
   * @param {string} content
   * @return {Jovo}
   */
  showSimpleCard(title: string, content: string) {
    this.$output.card = {
      SimpleCard: {
        content,
        title,
      },
    };
    return this;
  }

  /**
   * Shows image card to response
   * @public
   * @param {string} title
   * @param {string} content
   * @param {string} imageUrl secure url
   * @return {Jovo}
   */
  showImageCard(title: string, content: string, imageUrl: string) {
    this.$output.card = {
      ImageCard: {
        content,
        imageUrl,
        title,
      },
    };
    return this;
  }

  /**
   * Shows account linking card to response
   * @public
   * @return {Jovo}
   */
  showAccountLinkingCard() {
    this.$output.card = {
      AccountLinkingCard: {},
    };
    return this;
  }

  /**
   * Fires respond event and ends session.
   * @deprecated
   * @public
   */
  endSession() {
    Log.info('endSession() is obsolete in v2');
  }

  /**
   * Returns true if the current request is of type LAUNCH
   * @public
   * @return {boolean}
   */
  isLaunchRequest(): boolean {
    return this.$type.type === EnumRequestType.LAUNCH;
  }

  /**
   * Returns true if the current request is of type INTENT
   * @public
   * @return {boolean}
   */
  isIntentRequest(): boolean {
    return this.$type.type === EnumRequestType.INTENT;
  }

  /**
   * Returns true if the current request is of type END
   * @public
   * @return {boolean}
   */
  isEndRequest(): boolean {
    return this.$type.type === EnumRequestType.END;
  }

  /**
   * Returns true if the current request is of type AUDIOPLAYER
   * @public
   * @return {boolean}
   */
  isAudioPlayerRequest(): boolean {
    return this.$type.type === EnumRequestType.AUDIOPLAYER;
  }

  /**
   * Returns true if the current request is of type ON_ELEMENT_SELECTED
   * @public
   * @return {boolean}
   */
  isElementSelectedRequest(): boolean {
    return this.$type.type === EnumRequestType.ON_ELEMENT_SELECTED;
  }

  /**
   * Validates incoming request input data for all registered validators asynchronous.
   * @param schema The object containing all validators of type Validator|Function.
   * @returns object Contains function failed() to filter for failed validators.
   */
  async validateAsync(schema: { [key: string]: any }) {
    // tslint:disable-line:no-any
    const failedValidators: string[][] = []; // tslint:disable-line:no-any
    for (const input in schema) {
      if (!schema.hasOwnProperty(input)) {
        continue;
      }

      const validator = schema[input];
      if (validator.constructor === Array) {
        for (const v of validator) {
          await this.parseForValidatorAsync(v, input, this.$inputs[input], failedValidators);
        }
      } else {
        await this.parseForValidatorAsync(validator, input, this.$inputs[input], failedValidators);
      }
    }
    return this.parseForFailedValidators(failedValidators);
  }

  /**
   * Validates incoming request input data for all registered validators.
   * @param schema The object containing all validators of type Validator|Function.
   * @returns object Contains function failed() to filter for failed validators.
   */
  validate(schema: { [key: string]: any }) {
    // tslint:disable-line:no-any
    const failedValidators: string[][] = []; // tslint:disable-line:no-any
    for (const input in schema) {
      if (!schema.hasOwnProperty(input)) {
        continue;
      }

      const validator = schema[input];
      if (validator.constructor === Array) {
        for (const v of validator) {
          this.parseForValidator(v, input, this.$inputs[input], failedValidators);
        }
      } else {
        this.parseForValidator(validator, input, this.$inputs[input], failedValidators);
      }
    }
    return this.parseForFailedValidators(failedValidators);
  }

  /**
   * Reduces all failed validators to a set applying to the filter in ...args.
   * @param failedValidators An array of all failed validators.
   * @returns object Contains a function to filter through all failed validators.
   */
  parseForFailedValidators(failedValidators: string[][]) {
    return {
      failed(...args: string[]) {
        return (
          failedValidators.reduce((res: string[][], v: string[]) => {
            for (const p of args) {
              if (v.indexOf(p) === -1) {
                return res;
              }
            }
            res.push(v);
            return res;
          }, []).length > 0
        );
      },
    };
  }

  /**
   * Helper function for this.validate().
   * @param validator The current Validator to call the current request input data on.
   * @param inputName The current input data name to validate.
   * @param input The current input data to validate.
   * @param failedValidators An array of already failed validators.
   * @throws JovoError if the validator has an unsupported type.
   */
  parseForValidator(
    validator: () => void | Validator,
    inputName: string,
    input: any,
    failedValidators: string[][],
  ) {
    // tslint:disable-line:no-any
    try {
      if (validator instanceof Validator) {
        validator.setInputToValidate(input);
        validator.validate(this);
      } else if (typeof validator === 'function') {
        validator.call(this);
      } else {
        throw new JovoError(
          'This validation type is not supported.',
          ErrorCode.ERR,
          'jovo-core',
          undefined,
          'Please make sure you only use supported types of validation such as a function or an extended Validator',
          '',
        );
      }
    } catch (err) {
      if (err.constructor === ValidationError) {
        failedValidators.push([err.validator, inputName, err.message]);
      } else {
        throw err;
      }
    }
  }

  /**
   * Asynchronous helper function for this.validateAsync().
   * @param validator The current Validator to call the current request input data on.
   * @param inputName The current input data name to validate.
   * @param input The current input data to validate.
   * @param failedValidators An array of already failed validators.
   * @throws JovoError if the validator has an unsupported type.
   */
  async parseForValidatorAsync(
    validator: () => void | Validator,
    inputName: string,
    input: any,
    failedValidators: string[][],
  ) {
    try {
      if (validator instanceof Validator) {
        // @ts-ignore
        validator.setInputToValidate(input);
        // @ts-ignore
        await validator.validate(this);
      } else if (typeof validator === 'function') {
        await validator.call(this);
      } else {
        throw new JovoError(
          'This validation type is not supported.',
          ErrorCode.ERR,
          'jovo-core',
          undefined,
          'Please make sure you only use supported types of validation such as a function or an extended Validator',
        );
      }
    } catch (err) {
      if (err.constructor === ValidationError) {
        failedValidators.push([err.validator, inputName, err.message]);
      } else {
        throw err;
      }
    }
  }
}
