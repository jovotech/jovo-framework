import { Component, ComponentOptions, Logger, LoggerEvents, LogPayload } from '../..';

export interface LoggerComponentOptions extends ComponentOptions {
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
  content: any[];
  forLevel: LogLevel;
  useMethod: (message: string) => any;
}

export class LoggerComponent extends Component<LoggerComponentOptions> implements Logger {
  static DEFAULT_OPTIONS: LoggerComponentOptions = {
    level: LogLevel.Verbose,
  };

  get level(): LogLevel {
    return this.options.level;
  }

  async onInit(): Promise<void> {}

  debug(...content: any[]): void {
    this.doLog({
      content,
      forLevel: LogLevel.Verbose,
      // tslint:disable-next-line
      useMethod: console.debug,
    });
  }

  log(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Log, useMethod: console.log });
  }

  info(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Info, useMethod: console.info });
  }

  warn(...content: any[]): void {
    this.doLog({
      content,
      forLevel: LogLevel.Warning,
      // tslint:disable-next-line
      useMethod: console.warn,
    });
  }

  error(...content: any[]): void {
    // tslint:disable-next-line
    this.doLog({ content, forLevel: LogLevel.Error, useMethod: console.error });
  }

  getDefaultOptions(): LoggerComponentOptions {
    return LoggerComponent.DEFAULT_OPTIONS;
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

  private contentToString(...content: any[]): string {
    let value = '';
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
