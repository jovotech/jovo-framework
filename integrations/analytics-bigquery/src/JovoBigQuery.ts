import { BigQuery } from '@google-cloud/bigquery';

import { AnyObject, Capability, Jovo, RequiredOnlyWhere } from '@jovotech/framework';
import { BigQueryAnalytics, BigQueryAnalyticsPluginConfig, BigQueryLoggingConfig } from './BigQueryAnalytics';
import { v4 as uuidv4 } from 'uuid';

declare global {
  interface ReadableStream { }
}

enum SessionEndReason {
  User = 'user',
  Error = 'error',
}

export type Event = RequiredOnlyWhere<AnalyticsEvent, 'eventType'>;

export interface AnalyticsEvent extends AnyObject {
  eventType: string;
  eventId?: string;
  appId?: string;
  eventDate?: string;
  epochMilliseconds?: number;
  epochSeconds?: number;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  locale?: string;
  timeZone?: string;
}

export class JovoBigQuery {
  readonly client: BigQuery;
  private onError?: (error: Error) => Promise<void>;
  private events: AnalyticsEvent[] = [];
  readonly requestId: string;
  readonly requestStart: number;

  constructor(readonly plugin: BigQueryAnalytics, readonly jovo: Jovo) {
    this.client = new BigQuery(this.config.libraryOptions);
    this.requestId = jovo.$id;
    this.requestStart = Date.now();
  }

  get config(): BigQueryAnalyticsPluginConfig {
    return this.plugin.config;
  }

  async processRequest(jovo: Jovo): Promise<void> {
    this.initOnError(jovo);

    await this.addEventDeviceCapabilites(jovo);
    await this.addEventNewUser(jovo);
    await this.addEventSessionStart(jovo);
    await this.addEventRequestStart(jovo);
    await this.addEventInput(jovo);
  }

  async processResponse(jovo: Jovo): Promise<void> {
    await this.addEventRequestEnd(jovo);
    await this.addEventSessionEnd(jovo, SessionEndReason.User);

    await this.sendEvents();
    this.destroy(jovo);
  }

  async executeHandler(jovo: Jovo, payload: AnyObject | undefined): Promise<void> {
    await this.addEventExecuteHandler(jovo, payload);
  }

  // async eventT(jovo: Jovo, payload: AnyObject | undefined): Promise<void> {
  //   this.addEventT(jovo, payload);
  // }

  clearEvents(): void {
    this.events = [];
  }

  async addEvent(event: Event): Promise<void> {
    event.eventId = uuidv4();
    event.appId = this.config.appId;
    event.eventDate = new Date().toISOString();
    event.epochMilliseconds = Math.round(Date.now());
    event.epochSeconds = Math.round(event.epochMilliseconds / 1000);
    event.locale = this.jovo.$request.getLocale();
    event.userId = this.jovo.$user.id;
    event.sessionId = this.jovo.$session.id;
    event.requestId = this.requestId;

    if (this.jovo.$request.timeZone) {
      event.timeZone = this.jovo.$request.timeZone as string;
    }

    if (this.config.onAddEvent) {
      await this.config.onAddEvent(this.jovo, event);
    }

    this.events.push(event);

    if ((this.config.logging as BigQueryLoggingConfig).addEvent) {
      // eslint-disable-next-line no-console
      console.log('BigQuery addEvent', { event });
    }
  }

  async addError(error: Error): Promise<void> {
    const event = {
      eventType: 'error',
      errorName: error.name,
      message: error.message,
      stack: error.stack,
    };

    await this.addEvent(event);
  }

  async sendEvents(): Promise<void> {
    if (this.events.length === 0 || this.config.dryRun) {
      return;
    }

    if ((this.config.logging as BigQueryLoggingConfig).sendEvents) {
      // eslint-disable-next-line no-console
      console.time('BigQuery sendEvents');
    }

    try {
      const result: any = await this.client
        .dataset(this.config.datasetId)
        .table(this.config.tableId)
        .insert(this.events, this.config.insertRowsOptions);

      if ((this.config.logging as BigQueryLoggingConfig).sendEvents) {
        // eslint-disable-next-line no-console
        console.log({ result });
      }
    } catch (error) {
      if ((this.config.logging as BigQueryLoggingConfig).sendEvents) {
        // eslint-disable-next-line no-console
        console.log('BigQuery error', { error: JSON.stringify(error, null, 2) });
      }
    }

    if ((this.config.logging as BigQueryLoggingConfig).sendEvents) {
      // eslint-disable-next-line no-console
      console.timeEnd('BigQuery sendEvents');
    }
  }

  private initOnError(jovo: Jovo) {
    if (!this.onError) {
      this.onError = async (error: Error) => {
        this.addError(error);
        await this.addEventRequestEnd(jovo);
        await this.addEventSessionEnd(jovo, SessionEndReason.Error);

        await this.sendEvents();

        this.destroy(jovo);
      };

      jovo.$app.onError(this.onError);
    }
  }

  private destroy(jovo: Jovo) {
    if (this.onError) {
      jovo.$app.removeErrorListener(this.onError);
      this.onError = undefined;
    }
  }

  private async addEventRequestStart(jovo: Jovo) {
    const event = {
      eventType: 'request_start',
    };

    await this.addEvent(event);
  }

  private async addEventSessionStart(jovo: Jovo) {
    if (jovo.$session.isNew) {
      const event = {
        eventType: 'session_start',
      };

      await this.addEvent(event);
    }
  }

  private async addEventDeviceCapabilites(jovo: Jovo) {
    if (jovo.$session.isNew) {
      const deviceId: string | undefined = undefined;

      const event = {
        eventType: 'device_capabilities',
        deviceId,
        supportScreen: jovo.$device.capabilities.includes(Capability.Screen),
        supportAudio: jovo.$device.capabilities.includes(Capability.Audio),
        supportLongformAudio: jovo.$device.capabilities.includes(Capability.LongformAudio),
        supportVideo: jovo.$device.capabilities.includes(Capability.Video),
      };

      await this.addEvent(event);
    }
  }

  private async addEventNewUser(jovo: Jovo) {
    if (jovo.$user.isNew) {
      const event = {
        eventType: 'new_user',
      };

      await this.addEvent(event);
    }
  }

  private async addEventInput(jovo: Jovo) {
    const transcriptText = jovo.$input.getText();
    if (transcriptText) {
      const event = {
        eventType: 'transcript',
        transcriptText,
      };

      await this.addEvent(event);
    }

    const intent: string = jovo.$input.getIntentName() || jovo.$input.type || '<unknown>';
    const event = {
      eventType: 'intent',
      intent,
    };

    await this.addEvent(event);

    if (jovo.$input?.entities) {
      for (const [key, value] of Object.entries(jovo.$input.entities)) {
        const event = {
          eventType: 'intent_entity',
          intent,
          entityName: key,
          entityId: value?.id,
          entityResolved: value?.resolved,
          entityValue: value?.value,
        };

        await this.addEvent(event);
      }
    }
  }

  private async addEventSessionEnd(jovo: Jovo, reason: SessionEndReason) {
    const lastOutput = jovo?.$output[jovo.$output.length - 1];
    const listen = lastOutput ? lastOutput.listen ?? true : false;

    if (!listen || reason === SessionEndReason.Error) {
      const elapsed = Date.now() - this.jovo.$session.createdAt.getTime();

      const event = {
        eventType: 'session_end',
        elapsed,
        reason,
      };

      await this.addEvent(event);
    }
  }

  private async addEventRequestEnd(jovo: Jovo) {
    const elapsed = Date.now() - this.requestStart;

    const event = {
      eventType: 'request_end',
      elapsed,
    };

    await this.addEvent(event);
  }

  private async addEventExecuteHandler(jovo: Jovo, payload: AnyObject | undefined) {
    const event = {
      eventType: 'execute_handler',
      component: payload?.component,
      handler: payload?.handler,
    };

    await this.addEvent(event);
  }

  // private addEventT(jovo: Jovo, payload: AnyObject | undefined) {
  //   let paths = [];

  //   if (payload?.path) {
  //     paths = payload?.path && Array.isArray(payload?.path) ? payload.path : [payload.path];

  //     for (let index = 0; index < paths.length; index++) {
  //       const path = paths[index];

  //       const event = {
  //         eventType: 'translation',
  //         translationKey: path,
  //         isFallbackKey: index > 0,
  //         translationLanguage: payload?.options.lng,
  //         translationPlatform: payload?.options.platform,
  //       };

  //       this.addEvent(event);
  //     }
  //   }
  // }
}
