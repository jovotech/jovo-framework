import { BaseApp, Host, Jovo } from '..';
export declare class HandleRequest {
    app: BaseApp;
    host: Host;
    jovo?: Jovo;
    error?: Error;
    $data?: any;
    platformClazz?: any;
    excludedMiddlewareNames?: string[];
    constructor(app: BaseApp, host: Host, jovo?: Jovo);
    stopMiddlewareExecution(): void;
}
