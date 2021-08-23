import { ErrorCode, Jovo, JovoError, Log } from 'jovo-core';
import * as ua from 'universal-analytics';

import { Config, Event, Transaction, TransactionItem } from './interfaces';

export enum SystemMetricNamesEnum {
  'Stop' = 'Stop',
  'ERROR' = 'Stop',
  'EXCEEDED_MAX_REPROMPTS' = 'Stop',
  'PLAYTIME_LIMIT_REACHED' = 'Stop',
  'USER_INITIATED' = 'Stop',
  'undefined' = 'Stop',
}

export enum SystemDimensionNameEnum {
  'UUID' = 'Stop',
}

export type systemMetricNames = keyof typeof SystemMetricNamesEnum; // will be enhanced for new custom metrics
export type systemDimensionNames = keyof typeof SystemDimensionNameEnum; // will be enhanced for new custom metrics

export class GoogleAnalyticsInstance {
  // this map can be overwritten by skill developers to map endreasons to different custom metric numbers
  customMetricsIndicesMap: Map<systemMetricNames, number> = new Map<systemMetricNames, number>();
  customDimensionsIndicesMap: Map<systemDimensionNames, number> = new Map<
    systemDimensionNames,
    number
  >();

  $parameters: Record<string, string | number> = {};
  experiments: Record<string, string | number> = {};

  constructor(
    protected jovo: Jovo,
    protected config: Config,
    protected userId: string,
    public visitor: ua.Visitor,
  ) {
    this.customMetricsIndicesMap = new Map<systemMetricNames, number>(config.customMetricMap);
    this.customDimensionsIndicesMap = new Map<systemDimensionNames, number>(
      config.customDimensionMap,
    );
  }

  /**
   * Set custom metric for next pageview
   * Throws error if metricName is not mapped to an index in your config
   * @param name - metricName
   * @param targetValue - target value in googleAnalytics
   * @param pageviewOnly - should metric should only be added for pageview requests? Standard true
   */
  setCustomMetricByName(name: systemMetricNames, targetValue: number, pageviewOnly = true): void {
    // Set user id as a custom dimension to track hits on the same scope
    const metricNumber: number | undefined = this.customMetricsIndicesMap.get(name);
    if (!metricNumber) {
      throw new JovoError(
        `Trying to set custom system metric ${name} which is not set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        'Google Analytics sets some custom dimensions and metrics per default',
        `Set systemMetrics in your config (which is an tuple Array mapping systemMetrics to GoogleAnalytics indices) and add ${name}`,
        'See readme for more information',
      );
    }
    if (pageviewOnly) {
      this.setParameter(`cm${metricNumber}`, targetValue);
    } else {
      this.visitor?.set(`cm${metricNumber}`, targetValue);
    }
  }

  /**
   * Set custom dimension for next pageview
   * Throws error if dimensionName is not mapped to an index in your config
   * @param name - dimensionName
   * @param targetValue - target value in googleAnalytics
   * @param pageviewOnly - should dimension should only be added for pageview requests? Standard false
   */
  setCustomDimensionByName(
    name: systemDimensionNames,
    targetValue: string | number,
    pageviewOnly = false,
  ): void {
    // Set user id as a custom dimension to track hits on the same scope
    const dimensionNumber = this.customDimensionsIndicesMap.get(name);
    if (typeof dimensionNumber !== 'number') {
      throw new JovoError(
        `Trying to set custom system dimension ${name} which is not set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-analytics-googleanalytics',
        'Google Analytics sets some custom dimensions and metrics per default',
        `Set systemDimensions in your config (which is an tuple Array mapping systemDimensions to GoogleAnalytics indices) and add ${name}`,
        'See readme for more information',
      );
    }
    Log.debug(`\n [!!] setting dimension: cd${dimensionNumber} `);
    if (pageviewOnly) {
      this.setParameter(`cd${dimensionNumber}`, targetValue);
    } else {
      this.visitor?.set(`cd${dimensionNumber}`, targetValue);
    }
  }

  setCustomMetric(index: number, value: string | number) {
    this.visitor?.set(`cm${index}`, value);
  }
  setCustomDimension(index: number, value: string | number): void {
    this.visitor?.set(`cd${index}`, value);
  }

  setParameter(parameter: string, value: string | number): void {
    this.$parameters[parameter] = value;
  }
  setOptimizeExperiment(experimentId: string, variation: string | number): void {
    this.experiments[experimentId] = variation;

    this.$parameters[`exp`] = Object.entries(this.experiments)
      .map(([id, value]) => `${id}.${value}`)
      .join('!');
  }

  async sendEvent(params: Event) {

    await this.visitor!.event(params, (err: any) => {
      if (err) {
        throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
      }
    }).send();

  }

  sendTransaction(params: Transaction) {
    this.visitor!.transaction(params, (err: any) => {
      if (err) {
        throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
      }
    }).send();
  }
  sendItem(params: TransactionItem) {
    this.visitor!.transaction(params, (err: any) => {
      if (err) {
        throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-analytics-googleanalytics');
      }
    }).send();
  }

  /**
   * User Events ties users to event category and action
   * @param {object} jovo: Jovo object
   * @param {string} eventName maps to category -> eventGroup
   * @param {string} eventElement maps to action -> instance of eventGroup
   */
  sendUserEvent(eventCategory: string, eventAction: string) {
    const params: Event = {
      eventCategory,
      eventAction,
      eventLabel: this.userId,
      documentPath: this.jovo.getRoute().path,
    };

    this.jovo.$googleAnalytics.visitor!.event(params);
  }
}
