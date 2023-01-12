import {
  axios,
  HandleRequest,
  Jovo,
  Plugin,
  PluginConfig,
  RequiredOnlyWhere,
  StoredElement,
} from '@jovotech/framework';
import { InboxLog, InboxLogType, InboxLogTypeLike } from './index';
import { v4 as uuidV4 } from 'uuid';
import { Inbox } from './Inbox';

export interface JovoInboxConfig extends PluginConfig {
  fallbackLocale: string;
  server: {
    url: string;
    path: string;
  };
  appId: string;
  skip?: {
    platforms?: string[];
    locales?: string[];
    userIds?: string[];
  };
  storedElements: {
    request: true;
    response: true;
    state?: StoredElement | boolean;
    input?: StoredElement | boolean;
    output?: StoredElement | boolean;
    nlu?: StoredElement | boolean;
    user?: StoredElement | boolean;
    session?: StoredElement | boolean;
  };
}

export type JovoInboxInitConfig = RequiredOnlyWhere<JovoInboxConfig, 'appId'>;

export class JovoInbox extends Plugin<JovoInboxConfig> {
  constructor(config: JovoInboxInitConfig) {
    super(config);
  }
  getDefaultConfig(): JovoInboxConfig {
    return {
      ...this.getInitConfig(),
      fallbackLocale: 'en',
      server: {
        url: 'http://localhost:4000',
        path: '/api/logs',
      },
      skip: {
        platforms: [],
        locales: [],
        userIds: [],
      },
      storedElements: {
        request: true,
        response: true,
      },
    };
  }
  getInitConfig(): JovoInboxInitConfig {
    return {
      appId: '<APP_ID>',
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    parent.middlewareCollection.use('request.start', async (jovo: Jovo) => {
      // prepare data that is required in every turn
      const userId = jovo.$user.id || '';
      const platform = jovo.$platform.constructor.name;
      const locale = jovo.$request.getLocale() || this.config.fallbackLocale;

      const skipUserIds = this.config.skip?.userIds?.includes(userId);
      const skipPlatforms = this.config.skip?.platforms?.includes(platform);
      const skipLocales = this.config.skip?.locales?.includes(locale);

      // generate a request id, store it into jovo.$data to make it available in
      // every middleware
      jovo.$data._JOVO_INBOX_ = {
        requestId: uuidV4(),
        skip: skipUserIds || skipPlatforms || skipLocales,
        logs: [],
      };

      jovo.$inbox = new Inbox(this, jovo);
    });

    parent.middlewareCollection.use('after.request.end', async (jovo: Jovo) => {
      if (jovo.$data._JOVO_INBOX_.skip) {
        return;
      }
      if (this.config.storedElements.request) {
        jovo.$data._JOVO_INBOX_.logs.push(this.buildLog(jovo, InboxLogType.Request, jovo.$request));
      }
    });

    parent.middlewareCollection.use('after.interpretation.end', async (jovo: Jovo) => {
      if (jovo.$data._JOVO_INBOX_.skip) {
        return;
      }

      if (this.config.storedElements.input) {
        jovo.$data._JOVO_INBOX_.logs.push(
          this.buildLog(jovo, InboxLogType.Input, jovo.$input || {}),
        );
      }

      if (this.config.storedElements.nlu) {
        jovo.$data._JOVO_INBOX_.logs.push(
          this.buildLog(jovo, InboxLogType.Nlu, jovo.$input.nlu || {}),
        );
      }
    });

    parent.middlewareCollection.use('after.dialogue.router', async (jovo: Jovo) => {
      if (jovo.$data._JOVO_INBOX_.skip) {
        return;
      }

      if (this.config.storedElements.state) {
        jovo.$data._JOVO_INBOX_.logs.push(this.buildLog(jovo, InboxLogType.State, jovo.$state));
      }
    });

    parent.middlewareCollection.use('after.response.end', async (jovo: Jovo) => {
      if (jovo.$data._JOVO_INBOX_.skip) {
        return;
      }

      if (this.config.storedElements.output) {
        jovo.$data._JOVO_INBOX_.logs.push(this.buildLog(jovo, InboxLogType.Output, jovo.$output));
      }

      if (this.config.storedElements.user) {
        jovo.$data._JOVO_INBOX_.logs.push(
          this.buildLog(jovo, InboxLogType.User, jovo.$user.getPersistableData()),
        );
      }

      if (this.config.storedElements.session) {
        jovo.$data._JOVO_INBOX_.logs.push(
          this.buildLog(jovo, InboxLogType.Session, jovo.$session.getPersistableData()),
        );
      }

      if (this.config.storedElements.response) {
        jovo.$data._JOVO_INBOX_.logs.push(
          this.buildLog(jovo, InboxLogType.Response, jovo.$response),
        );
      }

      await this.post(jovo.$data._JOVO_INBOX_.logs);
    });
  }

  buildLog(jovo: Jovo, type: InboxLogTypeLike, payload: unknown): InboxLog {
    return {
      appId: this.config.appId,
      platform: jovo.$platform.constructor.name,
      userId: jovo.$user.id || '',
      locale: jovo.$request.getLocale() || this.config.fallbackLocale,
      requestId: jovo.$data._JOVO_INBOX_.requestId,
      sessionId: jovo.$request.getSessionId() || '-',
      type,
      payload,
    };
  }

  async post(log: InboxLog | InboxLog[]): Promise<void> {
    return axios.request({
      method: 'POST',
      url: `${this.config.server.url}${this.config.server.path}`,
      data: log,
    });
  }
}
