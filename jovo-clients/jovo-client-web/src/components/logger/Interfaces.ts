import { Component } from '../..';
import { LogLevel } from './LoggerComponent';

export interface Logger extends Component {
  error(...content: any[]): void;

  warn(...content: any[]): void;

  info(...content: any[]): void;

  log(...content: any[]): void;

  debug(...content: any[]): void;
}

export interface LogPayload {
  level: LogLevel;
  content: string;
}
