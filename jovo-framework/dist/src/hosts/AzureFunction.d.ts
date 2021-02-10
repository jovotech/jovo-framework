import { Context, HttpRequest } from '@azure/functions';
import { Host, JovoResponse, LogLevel } from 'jovo-core';
export declare class AzureFunction implements Host {
    /**
     * Add an appender, if not already added, that writes logs to Azure Function's context.log.
     * The benefit of doing so, vs. just using console.log, is that the logs get associated with the request
     * in the Azure Portal. Otherwise the only way to see the logs is as a jumbled mess in Application Insights.
     *
     * @param contextLogLevel the minimum level of logs that will be logged
     */
    private static addContextLogger;
    headers: {
        [key: string]: string;
    };
    hasWriteFileAccess: boolean;
    req: HttpRequest;
    context: Context;
    $request: any;
    /**
     * Constructs an AzureFunction host object to handle an incoming request.
     *
     * @param context Azure Fuctions context object
     * @param req Azure Functions HTTP request object
     * @param contextLogLevel Minimum log level to send to the context logger
     */
    constructor(context: Context, req: HttpRequest, contextLogLevel?: LogLevel);
    getQueryParams(): Record<string, string>;
    getRequestObject(): any;
    setResponse(obj: JovoResponse): Promise<void>;
    fail(error: Error): void;
}
