import { AppConfig } from './App';
import { Plugin } from './Plugin';

export class HandleRequest {
  readonly plugins: Record<string, Plugin> = {};

  constructor(readonly config: AppConfig) {}
}
