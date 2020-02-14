import { Component, ComponentConfig, Logger, LoggerEvents, LogPayload } from '../..';

declare module '../../core/Interfaces' {
  interface Config {
    LoggerComponent: LoggerComponentConfig;
  }
}

export interface LoggerComponentConfig extends ComponentConfig {
  level: LogLevel;
}

export enum LogLevel {
  None,
  Error,
  Warning,
  Info,
  Log,
  Verbose,
}

interface LogParameters {
  // tslint:disable-next-line:no-any
  content: any[];
  forLevel: LogLevel;
  // tslint:disable-next-line:no-any
  useMethod: (message: string) => any;
}

export class LoggerComponent extends Component<LoggerComponentConfig> implements Logger {
  static DEFAULT_CONFIG: LoggerComponentConfig = {
    level: LogLevel.Verbose,
  };

  readonly name = 'LoggerComponent';

  get level(): LogLevel {
    return this.$config.level;
  }

  async onInit(): Promise<void> {
    // tslint:disable-line
  }

  // tslint:disable-next-line:no-any
  debug(...content: any[]): void {
    this.doLog({
      content,
      forLevel: LogLevel.Verbose,
      // tslint:disable-next-line
      useMethod: console.debug,
    });
  }

  // tslint:disable-next-line:no-any
  log(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Log, useMethod: console.log });
  }

  // tslint:disable-next-line:no-any
  info(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Info, useMethod: console.info });
  }

  // tslint:disable-next-line:no-any
  warn(...content: any[]): void {
    this.doLog({
      content,
      forLevel: LogLevel.Warning,
      // tslint:disable-next-line
      useMethod: console.warn,
    });
  }

  // tslint:disable-next-line:no-any
  error(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Error, useMethod: console.error });
  }

  getDefaultConfig(): LoggerComponentConfig {
    return LoggerComponent.DEFAULT_CONFIG;
  }

  private emitLog(payload: LogPayload) {
    this.$client.emit(LoggerEvents.Log, payload);
  }

  private doLog(parameters: LogParameters) {
    if (this.level >= parameters.forLevel) {
      const stringContent = this.contentToString(...parameters.content);
      const payload: LogPayload = {
        content: stringContent,
        level: parameters.forLevel,
      };
      this.emitLog(payload);
      parameters.useMethod(stringContent);
    }
  }

  // tslint:disable-next-line:no-any
  private contentToString(...content: any[]): string {
    let value = '';
    // tslint:disable-next-line:no-any
    content.forEach((item: any, index: number) => {
      if (typeof item === 'object' || Array.isArray(item)) {
        value += JSON.stringify(item, undefined, 2);
      } else {
        value += item;
      }
      if (index !== content.length - 1) {
        value += '\n';
      }
    });
    return value;
  }
}
