import { EnumLike } from '@jovotech/common';
import chalk from 'chalk';
import colorize from 'json-colorizer';
import _unset from 'lodash.unset';
import { LoggingFormat } from '../enums';
import { HandleRequest, Jovo } from '../index';
import { Plugin, PluginConfig } from '../Plugin';
import { mask } from '../utilities';

declare module '../interfaces' {
  interface RequestData {
    _BASIC_LOGGING_START?: number;
  }
}

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    BasicLogging?: BasicLoggingConfig;
  }

  interface ExtensiblePlugins {
    BasicLogging?: BasicLogging;
  }
}

export interface RequestResponseConfig {
  enabled: boolean;
  objects?: string[];
  maskedObjects?: string[];
  excludedObjects?: string[];
}

export interface BasicLoggingConfig extends PluginConfig {
  request?: RequestResponseConfig | boolean;
  response?: RequestResponseConfig | boolean;
  format?: EnumLike<LoggingFormat>;
  maskValue?: unknown;
  indentation?: string | number;
  colorizeSettings?: {
    colors: {
      BRACE?: string;
      BRACKET?: string;
      COLON?: string;
      COMMA?: string;
      STRING_KEY?: string;
      STRING_LITERAL?: string;
      NUMBER_LITERAL?: string;
      BOOLEAN_LITERAL?: string;
      NULL_LITERAL?: string;
    };
  };
}

export class BasicLogging extends Plugin<BasicLoggingConfig> {
  getDefaultConfig(): BasicLoggingConfig {
    return {
      skipTests: true,
      enabled: true,
      request: {
        enabled: true,
        excludedObjects: [],
        maskedObjects: [],
        objects: [],
      },
      response: {
        enabled: true,
        excludedObjects: [],
        maskedObjects: [],
        objects: [],
      },
      format: LoggingFormat.Pretty,
      maskValue: '[ Hidden ]',
      indentation: 2,
      colorizeSettings: {
        colors: {
          STRING_KEY: 'white',
          STRING_LITERAL: 'green',
          NUMBER_LITERAL: 'yellow',
          BRACE: 'white.bold',
        },
      },
    };
  }

  constructor(config: BasicLoggingConfig) {
    if (config.enabled === false) {
      if (typeof config.request === 'undefined') {
        config.request = false;
      }

      if (typeof config.response === 'undefined') {
        config.response = false;
      }
    }

    super(config);

    if (typeof config.request === 'boolean') {
      this.config.request = {
        objects: [],
        maskedObjects: [],
        excludedObjects: [],
        enabled: config.request,
      };
    }

    if (typeof config.response === 'boolean') {
      this.config.response = {
        objects: [],
        maskedObjects: [],
        excludedObjects: [],
        enabled: config.response,
      };
    }
  }

  mount(parent: HandleRequest): Promise<void> | void {
    parent.middlewareCollection.use('request.start', (jovo) => {
      if ((this.config.request as RequestResponseConfig).enabled) {
        return this.logRequest(jovo);
      }
    });
    parent.middlewareCollection.use('response.end', (jovo: Jovo) => {
      if ((this.config.response as RequestResponseConfig).enabled) {
        return this.logResponse(jovo);
      }
    });
  }

  async logRequest(jovo: Jovo): Promise<void> {
    jovo.$data._BASIC_LOGGING_START = new Date().getTime();

    if (!this.config.request) {
      return;
    }

    const requestCopy = JSON.parse(JSON.stringify(jovo.$request));

    const requestConfig = this.config.request as RequestResponseConfig;

    // Exclude properties from logs according to configuration
    if (requestConfig.excludedObjects && requestConfig.excludedObjects.length > 0) {
      requestConfig.excludedObjects.forEach((excludePath: string) => {
        _unset(requestCopy, excludePath);
      });
    }

    if (requestConfig.objects && requestConfig.objects.length > 0) {
      requestConfig.objects.forEach((objectPath: string) => {
        _unset(requestCopy, objectPath);
      });
    }

    // Mask properties according to configuration
    if (requestConfig.maskedObjects && requestConfig.maskedObjects.length > 0) {
      mask(requestConfig.maskedObjects, requestCopy, this.config.maskValue);
    }

    if (this.config.format === LoggingFormat.Pretty) {
      // eslint-disable-next-line no-console
      console.log(chalk.bgWhite.black('\n\n >>>>> Request - ' + new Date().toISOString() + ' '));
      // eslint-disable-next-line no-console
      console.log(
        colorize(
          JSON.stringify(requestCopy, null, this.config.indentation || 2),
          this.config.colorizeSettings,
        ),
      );
    } else if (this.config.format === LoggingFormat.Json) {
      // eslint-disable-next-line no-console
      console.log(colorize(JSON.stringify(requestCopy), this.config.colorizeSettings));
    }
  }

  async logResponse(jovo: Jovo): Promise<void> {
    const basicLoggingEnd = new Date().getTime();
    const duration = jovo.$data._BASIC_LOGGING_START
      ? basicLoggingEnd - jovo.$data._BASIC_LOGGING_START
      : 0;

    if (!this.config.response) {
      return;
    }

    const responseCopy = JSON.parse(JSON.stringify(jovo.$response));

    const responseConfig = this.config.response as RequestResponseConfig;

    // Exclude properties from logs according to configuration
    if (responseConfig.excludedObjects && responseConfig.excludedObjects.length > 0) {
      responseConfig.excludedObjects.forEach((excludePath: string) => {
        _unset(responseCopy, excludePath);
      });
    }

    if (responseConfig.objects && responseConfig.objects.length > 0) {
      responseConfig.objects.forEach((objectPath: string) => {
        _unset(responseCopy, objectPath);
      });
    }

    if (responseConfig.maskedObjects && responseConfig.maskedObjects.length > 0) {
      mask(responseConfig.maskedObjects, responseCopy, this.config.maskValue);
    }

    if (this.config.format === LoggingFormat.Pretty) {
      // eslint-disable-next-line no-console
      console.log(
        chalk.bgGray.white('\n\n <<<<< Response - ' + new Date().toISOString() + ' ') +
          ' ✔️ ' +
          duration +
          'ms',
      );
      // eslint-disable-next-line no-console
      console.log(
        colorize(
          JSON.stringify(responseCopy, null, this.config.indentation || 2),
          this.config.colorizeSettings,
        ),
      );
    } else if (this.config.format === LoggingFormat.Json) {
      // eslint-disable-next-line no-console
      console.log(colorize(JSON.stringify(responseCopy), this.config.colorizeSettings));
    }
  }
}
