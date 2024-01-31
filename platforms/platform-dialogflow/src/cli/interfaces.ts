import { PluginConfig } from '@jovotech/cli-core';
import { SupportedLocales } from './constants';

export type SupportedLocalesType = (typeof SupportedLocales)[number];

export interface DialogflowConfig extends PluginConfig {
  endpoint?: string;
  language?: string;
  keyFile?: string;
  projectId?: string;
  locales?: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface DialogflowAgent {
  defaultTimezone: string;
  language: string;
  description?: string;
  webhook?: {
    url: string;
    headers?: { [key: string]: string };
    available?: boolean;
  };
  isPrivate?: boolean;
  supportedLanguages?: string[];
}
