import {
  AnalyticsPlugin,
  AnalyticsPluginConfig,
  Jovo,
  RequiredOnlyWhere,
  Platform,
  JovoError,
  AnyObject,
} from '@jovotech/framework';

import { AnalyticsEvent, JovoBigQuery } from './JovoBigQuery';
import { BigQueryOptions, InsertRowsOptions } from '@google-cloud/bigquery';

export interface BigQueryLoggingConfig {
  addEvent?: boolean;
  sendEvents?: boolean;
}

export interface BigQueryAnalyticsPluginConfig extends AnalyticsPluginConfig {
  enabled?: boolean;
  appId: string;
  datasetId: string;
  tableId: string;
  libraryOptions: BigQueryOptions;
  dryRun: boolean;
  insertRowsOptions: InsertRowsOptions;
  logging?: BigQueryLoggingConfig | boolean;
  onAddEvent?: (jovo: Jovo, event: AnalyticsEvent)=> Promise<void> | void;
}

export type BigQueryAnalyticsPluginInitConfig = RequiredOnlyWhere<
  BigQueryAnalyticsPluginConfig,
  'appId' | 'datasetId' | 'tableId' | 'libraryOptions'
>;

export class BigQueryAnalytics extends AnalyticsPlugin<BigQueryAnalyticsPluginConfig> {
  constructor(config: BigQueryAnalyticsPluginInitConfig) {
    super(config);
  }

  mount(parent: Platform): void {
    if (this.config.enabled === false) {
      return;
    }

    if (!this.config.appId) {
      throw new JovoError({
        message: `Can not send request to BigQuery. App-ID is missing.`,
      });
    }

    if (!this.config.datasetId) {
      throw new JovoError({
        message: `Can not send request to BigQuery. Dataset-ID is missing.`,
      });
    }

    if (!this.config.tableId) {
      throw new JovoError({
        message: `Can not send request to BigQuery. Table-ID is missing.`,
      });
    }

    if (!this.config.libraryOptions?.keyFilename) {
      throw new JovoError({
        message: `Can not send request to BigQuery. Key-Filename is missing.`,
      });
    }

    if (!this.config.libraryOptions?.projectId) {
      throw new JovoError({
        message: `Can not send request to BigQuery. Project-ID is missing.`,
      });
    }

    if (typeof this.config.logging === 'boolean') {
      const flag = this.config.logging;
      
      // overwrite with individual flags
      this.config.logging = {
        addEvent: flag,
        sendEvents: flag,
      } as BigQueryLoggingConfig;
    }

    // attach to base class middlewares
    super.mount(parent);

    parent.middlewareCollection.use(
      'event.ComponentTreeNode.executeHandler',
      this.eventExecuteHandler.bind(this),
    );

    // parent.middlewareCollection.use('event.$t', this.eventT.bind(this));
  }

  getDefaultConfig(): BigQueryAnalyticsPluginConfig {
    return {
      ...this.getInitConfig(),
    };
  }

  getInitConfig(): BigQueryAnalyticsPluginConfig {
    return {
      appId: '',
      datasetId: '',
      tableId: '',
      libraryOptions: {},
      dryRun: false,
      insertRowsOptions: { skipInvalidRows: true, ignoreUnknownValues: true },
      logging: false,
    };
  }

  async trackRequest(jovo: Jovo): Promise<void> {
    jovo.$bigquery = new JovoBigQuery(this, jovo);
    await jovo.$bigquery.processRequest(jovo);
  }

  async trackResponse(jovo: Jovo): Promise<void> {
    await jovo.$bigquery.processResponse(jovo);
  }

  async eventExecuteHandler(jovo: Jovo, payload: AnyObject | undefined): Promise<void> {
    await jovo.$bigquery.executeHandler(jovo, payload);
  }

  // async eventT(jovo: Jovo, payload: AnyObject | undefined): Promise<void> {
  //   await jovo.$bigquery.eventT(jovo, payload);
  // }
}
