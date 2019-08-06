import { Inputs } from './Interfaces';
import { Log } from './Log';
import { Project as P } from './Project';
export const Project = P.getInstance();

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

export { BaseApp } from './BaseApp';
export { ActionSet } from './ActionSet';

export { Jovo } from './Jovo';
export { EnumRequestType, SessionConstants } from './enums';
export { SpeechBuilder } from './SpeechBuilder';

export { Middleware } from './Middleware';
export { TestSuite, RequestBuilder, ResponseBuilder } from './TestSuite';
export { Conversation, ConversationConfig } from './Conversation';
export { Extensible } from './Extensible';
export { ExtensibleConfig } from './Extensible';
export { Cms } from './Cms';
export { BaseCmsPlugin } from './BaseCmsPlugin';
export { JovoError, ErrorCode } from './errors/JovoError';
export {
    Validator,
    ValidationError,
    IsRequiredValidator,
    ValidValuesValidator,
    InvalidValuesValidator,
} from './validators';
export {
    HandleRequest,
    Plugin,
    PluginConfig,
    Output,
    JovoRequest,
    RequestType,
    Platform,
    Analytics,
    JovoResponse,
    Db,
    NLUData,
    Inputs,
    Input,
    Host,
    AppData,
    JovoData,
    SessionData,
    Data,
    JovoFunction,
    HandlerReturnType,
    Handler,
    RequestJSON,
} from './Interfaces';

export { Util } from './Util';
export { LogLevel, Log, Logger, Appender, Config, LogEvent } from './Log';
export { User } from './User';


