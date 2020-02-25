import { AppConfig } from './Interfaces';
import { Log } from './util/Log';
import { Project as P } from './util/Project';

export * from './plugins/types';

export const Project = P.getInstance();

export function config(cfg?: AppConfig): AppConfig {
  return cfg || {};
}

try {
  // do not use source map support with jest.
  if (process.env.JEST_WORKER_ID === undefined) {
    require('source-map-support').install(); // tslint:disable-line
  }
} catch (error) {
  Log.error(error);
}

declare global {
  interface Console {
    /**
     * Prints to console and exits process.
     * @param {object} obj
     */
    dd(obj: object): void;
  }
}

export { BaseApp } from './core/BaseApp';
export { ActionSet } from './core/ActionSet';

export { Jovo } from './core/Jovo';
export { EnumRequestType, SessionConstants } from './enums';
export { SpeechBuilder } from './util/SpeechBuilder';

export { Middleware } from './core/Middleware';
export { Platform } from './core/Platform';
export { TestSuite, RequestBuilder, ResponseBuilder } from './TestSuite';
export { Conversation, ConversationConfig } from './util/Conversation';
export { Extensible } from './core/Extensible';
export { ExtensibleConfig } from './core/Extensible';
export { Cms } from './util/Cms';
export { BaseCmsPlugin } from './plugins/BaseCmsPlugin';
export { JovoError, ErrorCode } from './errors/JovoError';
export { HandleRequest } from './core/HandleRequest';
export { AsrData } from './core/AsrData';
export { NluData } from './core/NluData';

export { InvalidValuesValidator } from './plugins/validators/InvalidValuesValidator';
export { IsRequiredValidator } from './plugins/validators/IsRequiredValidator';

export { Validator } from './plugins/validators/Validator';

export { ValidationError } from './plugins/validators/ValidatorError';

export { ValidValuesValidator } from './plugins/validators/ValidValuesValidator';
export { Util } from './util/Util';
export { LogLevel, Log, Logger, Appender, Config, LogEvent } from './util/Log';
export { User } from './core/User';
export { ComponentPlugin } from './plugins/ComponentPlugin';
export {
  Component,
  ComponentConfig,
  ComponentDelegationOptions,
  ComponentResponse,
  ComponentResponseStatus,
} from './plugins/Component';
export { Router } from './plugins/Router';
export * from './Interfaces';

export * from './util/HttpService';
export * from './util/AudioEncoder';
export { Config as I18NextConfig, I18Next } from './plugins/I18Next';
