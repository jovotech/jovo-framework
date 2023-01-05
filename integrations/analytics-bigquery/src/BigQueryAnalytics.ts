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
  onAddEvent?: (jovo: Jovo, event: AnalyticsEvent) => Promise<void> | void;
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
  }

  getDefaultConfig(): BigQueryAnalyticsPluginConfig {
    return {
      ...this.getInitConfig(),
      dryRun: false,
      insertRowsOptions: { skipInvalidRows: true, ignoreUnknownValues: true },
      logging: false,
    };
  }

  getInitConfig(): BigQueryAnalyticsPluginInitConfig {
    return {
      appId: '<YOUR-APP-ID>',
      datasetId: '<YOUR-DATASET-ID>',
      tableId: '<YOUR-TABLE-ID>',
      libraryOptions: {},
    };
  }

  async trackRequest(jovo: Jovo): Promise<void> {
    jovo.$bigQuery = new JovoBigQuery(this, jovo);
    await jovo.$bigQuery.processRequest(jovo);
  }

  async trackResponse(jovo: Jovo): Promise<void> {
    await jovo.$bigQuery.processResponse(jovo);
  }

  async eventExecuteHandler(jovo: Jovo, payload: AnyObject | undefined): Promise<void> {
    await jovo.$bigQuery.executeHandler(jovo, payload);
  }
}
