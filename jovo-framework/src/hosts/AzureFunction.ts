// tslint:disable-next-line
import { Context, HttpRequest } from '@azure/functions';
import { Host, JovoResponse, Log, LogEvent, LogLevel } from 'jovo-core';

const AZURE_FUNCTION_APPENDER_NAME = 'azureFunction';

export class AzureFunction implements Host {
  /**
   * Add an appender, if not already added, that writes logs to Azure Function's context.log.
   * The benefit of doing so, vs. just using console.log, is that the logs get associated with the request
   * in the Azure Portal. Otherwise the only way to see the logs is as a jumbled mess in Application Insights.
   *
   * @param contextLogLevel the minimum level of logs that will be logged
   */
  private static addContextLogger(contextLogLevel: LogLevel) {
    // If the appender was already added (which will be the case every time except the first request), don't add it again
    if (Log.config.appenders[AZURE_FUNCTION_APPENDER_NAME]) {
      return;
    }

    // Our context logger requires async hooks enabled, so don't add it if they aren't
    if (Log.config.disableAsyncHooks) {
      return;
    }

    // Add our context.log appender
    Log.addAppender(AZURE_FUNCTION_APPENDER_NAME, {
      ignoreFormatting: true,
      logLevel: contextLogLevel,
      trackRequest: true,
      write: (logEvent: LogEvent) => {
        if (logEvent.msg) {
          const host = logEvent.requestContext;
          if (host && host instanceof AzureFunction) {
            if (logEvent.logLevel === LogLevel.ERROR) {
              host.context.log.error(logEvent.msg);
            } else if (logEvent.logLevel === LogLevel.WARN) {
              host.context.log.warn(logEvent.msg);
            } else if (logEvent.logLevel === LogLevel.INFO) {
              host.context.log.info(logEvent.msg);
            } else if (
              logEvent.logLevel === LogLevel.VERBOSE ||
              logEvent.logLevel === LogLevel.DEBUG
            ) {
              host.context.log.verbose(logEvent.msg);
            } else {
              host.context.log(logEvent.msg);
            }
          } else {
            // this should hardly ever happen, but just in case
            Log.info(logEvent.msg);
          }
        }
      },
    });

    // Finally remove the existing console appender, since it would just be duplicating log entries now
    Log.removeAppender('console');
  }

  headers: { [key: string]: string };
  hasWriteFileAccess = false;
  req: HttpRequest;
  context: Context;
  $request: any; // tslint:disable-line

  /**
   * Constructs an AzureFunction host object to handle an incoming request.
   *
   * @param context Azure Fuctions context object
   * @param req Azure Functions HTTP request object
   * @param contextLogLevel Minimum log level to send to the context logger
   */
  constructor(context: Context, req: HttpRequest, contextLogLevel: LogLevel = LogLevel.DEBUG) {
    this.req = req;
    this.context = context;
    this.headers = req.headers;
    this.$request = req.body;

    // ensure the context log appender has been added to Log
    AzureFunction.addContextLogger(contextLogLevel);
  }

  getQueryParams(): Record<string, string> {
    return this.req.query || {};
  }

  getRequestObject() {
    return this.$request;
  }

  setResponse(obj: JovoResponse) {
    return new Promise<void>((resolve) => {
      this.context.res = {
        body: obj,
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
      };
      this.context.done();
      resolve();
    });
  }

  fail(error: Error) {
    // We must call context.done with the error object and no response body
    // in order for the request to be recognized as 'Failed' in the Azure Portal.
    this.context.done(error);
  }
}
