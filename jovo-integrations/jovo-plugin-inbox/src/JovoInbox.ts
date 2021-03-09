import type { Plugin, PluginConfig, BaseApp } from 'jovo-core';
import { HandleRequest } from 'jovo-core';
import { InboxLog, InboxLogType, JovoInboxDb } from './interfaces';
import _merge = require('lodash.merge');
import { SqlInbox } from './SqlInbox';
import { InboxLogEntity } from './entity/InboxLog';
import { ConnectionOptions } from 'typeorm';
import { v4 as uuid } from 'uuid';
import _get = require('lodash.get');
import _set = require('lodash.set');
import _unset = require('lodash.unset');

export interface JovoInboxConfig extends PluginConfig {
  db?: Partial<ConnectionOptions>;
  appId?: string;
  defaultLocale: string;

  skipPlatforms?: string[];
  skipLocales?: string[];
  skipUserIds?: string[];

  skipRequestObjects?: string[];
  skipResponseObjects?: string[];

  maskRequestObjects?: string[];
  maskResponseObjects?: string[];
  maskValue?: string | Function;
}

export class JovoInbox {
  inboxDb: JovoInboxDb;

  constructor(private config: JovoInboxConfig) {
    this.inboxDb = new SqlInbox(config.db);
  }

  async add(inboxLog: InboxLog) {
    await this.inboxDb.add(inboxLog);
  }

  async close() {
    await this.inboxDb.close();
  }
}
export class JovoInboxPlugin implements Plugin {
  config: JovoInboxConfig = {
    enabled: true,
    defaultLocale: 'en',
    skipPlatforms: [],
    skipLocales: [],
    skipUserIds: [],
    skipRequestObjects: [],
    skipResponseObjects: [],
    maskRequestObjects: [
      'context.System.apiAccessToken',
      'context.System.user.permissions.consentToken',
    ],
    maskResponseObjects: [],
    maskValue: '-',
  };
  constructor(config: Partial<JovoInboxConfig>) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp): void {
    app.middleware('platform.init')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo) {
        return;
      }

      if (!handleRequest.$data) {
        handleRequest.$data = {};
      }

      const userId = handleRequest.jovo?.$user.getId()!;
      const platform = handleRequest.jovo.getPlatformType();
      const locale = handleRequest.jovo!.$request!.getLocale() || this.config.defaultLocale;

      const skipUserIds = this.config.skipUserIds?.includes(userId);
      const skipPlatform = this.config.skipPlatforms?.includes(platform);
      const skipLocale = this.config.skipLocales?.includes(locale);

      handleRequest.$data = {
        requestId: uuid(),
        skip: skipUserIds || skipPlatform || skipLocale,
      };

      if (handleRequest.$data.skip) {
        return;
      }

      handleRequest.jovo!.$inbox = new JovoInbox(this.config);

      const inboxLog = this.buildLog(handleRequest);
      inboxLog.type = InboxLogType.REQUEST;

      inboxLog.payload = this.modifyObject(
        handleRequest.jovo!.$request,
        this.config.maskRequestObjects,
        this.config.skipRequestObjects,
      );

      await handleRequest.jovo!.$inbox.add(inboxLog);
    });

    app.middleware('response')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo!.$inbox || handleRequest.$data.skip) {
        return;
      }

      const inboxLog = this.buildLog(handleRequest);
      inboxLog.type = InboxLogType.RESPONSE;
      inboxLog.payload = this.modifyObject(
        handleRequest.jovo!.$response,
        this.config.maskResponseObjects,
        this.config.skipResponseObjects,
      );

      await handleRequest.jovo!.$inbox.add(inboxLog);
    });

    app.middleware('fail')!.use(async (handleRequest: HandleRequest) => {
      if (!handleRequest.jovo!.$inbox || !handleRequest.error) {
        return;
      }

      if (handleRequest.$data.skip) {
        return;
      }

      const payload = {
        message: handleRequest.error.message,
        stackTrace: handleRequest.error.stack,
      };
      const inboxLog = this.buildLog(handleRequest);
      inboxLog.type = InboxLogType.ERROR;
      inboxLog.payload = payload;

      await handleRequest.jovo!.$inbox.add(inboxLog);
    });

    app.middleware('after.response')!.use(async (handleRequest: HandleRequest) => {
      // TODO: performance should be tested. close connection after every request?
      // await handleRequest.jovo!.$inbox!.close();
    });
  }

  /**
   * Builds initial InboxLog object with data that is used by every log type.
   * @param handleRequest
   */
  buildLog(handleRequest: HandleRequest) {
    const inboxLog = new InboxLogEntity();
    inboxLog.appId = this.config.appId!;
    inboxLog.createdAt = new Date();
    inboxLog.locale = handleRequest.jovo!.$request!.getLocale() || this.config.defaultLocale;
    inboxLog.platform = handleRequest.jovo!.getPlatformType();

    // not all platforms have a getRequestId() method
    try {
      // tslint:disable-next-line:no-any
      inboxLog.requestId = (handleRequest.jovo!.$request as any).getRequestId();
    } catch (e) {
      inboxLog.requestId = handleRequest.$data.requestId;
    }
    inboxLog.sessionId = handleRequest.jovo!.$request!.getSessionId() || 'no-session';

    inboxLog.userId = handleRequest.jovo?.$user.getId()!;
    return inboxLog;
  }

  /**
   * Skips objects provided in skipArray, masks objects provided in maskArray
   * @param obj
   * @param maskArray
   * @param skipArray
   */
  // tslint:disable-next-line:no-any
  modifyObject(obj: any, maskArray?: string[], skipArray?: string[]) {
    const copy = JSON.parse(JSON.stringify(obj));

    if (maskArray && maskArray.length > 0) {
      maskArray.forEach((maskPath: string) => {
        const value = _get(copy, maskPath);
        if (value && this.config.maskValue) {
          let newValue = this.config.maskValue;
          if (typeof newValue === 'function') {
            newValue = (this.config.maskValue as Function)(value);
          }
          _set(copy, maskPath, newValue);
        }
      });
    }
    if (skipArray && skipArray.length > 0) {
      skipArray.forEach((path: string) => {
        if (_get(copy, path)) {
          _unset(copy, path);
        }
      });
    }
    return copy;
  }
}
