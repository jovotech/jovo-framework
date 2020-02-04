import { Component } from '../..';
import { LogLevel } from './LoggerComponent';

export interface Logger extends Component {
  // tslint:disable-next-line:no-any
  error(...content: any[]): void;

  // tslint:disable-next-line:no-any
  warn(...content: any[]): void;

  // tslint:disable-next-line:no-any
  info(...content: any[]): void;

  // tslint:disable-next-line:no-any
  log(...content: any[]): void;

  // tslint:disable-next-line:no-any
  debug(...content: any[]): void;
}

export interface LogPayload {
  level: LogLevel;
  content: string;
}
