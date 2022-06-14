import { EnumLike } from '@jovotech/common';
import chalk from 'chalk';
import colorize from 'json-colorizer';
import { LoggingFormat } from '../enums';
import { HandleRequest, Jovo } from '../index';
import { Plugin, PluginConfig } from '../Plugin';
import { copy, mask } from '../utilities';

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
  /** @deprecated Use the property "format" instead */
  styling?: boolean;
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
      styling: true,
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

  constructor(config?: BasicLoggingConfig) {
    if (config?.enabled === false) {
      if (typeof config.request === 'undefined') {
        config.request = false;
      }

      if (typeof config.response === 'undefined') {
        config.response = false;
      }
    }

    super(config);

    if (typeof this.config.request === 'boolean') {
      this.config.request = {
        objects: [],
        maskedObjects: [],
        excludedObjects: [],
        enabled: this.config.request,
      };
    }

    if (typeof this.config.response === 'boolean') {
      this.config.response = {
        objects: [],
        maskedObjects: [],
        excludedObjects: [],
        enabled: this.config.response,
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

    const requestConfig = this.config.request as RequestResponseConfig;
    const requestCopy = copy(jovo.$request, {
      include: requestConfig.objects,
      exclude: requestConfig.excludedObjects,
    });

    // Mask properties according to configuration
    if (requestConfig.maskedObjects && requestConfig.maskedObjects.length > 0) {
      mask(requestCopy, requestConfig.maskedObjects, this.config.maskValue);
    }

    if (this.config.format === LoggingFormat.Pretty) {
      if (this.config.styling) {
        // eslint-disable-next-line no-console
        console.log(chalk.bgWhite.black('\n\n >>>>> Request - ' + new Date().toISOString() + ' '));
      }
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

    const responseConfig = this.config.response as RequestResponseConfig;
    const responseCopy = copy(jovo.$response, {
      include: responseConfig.objects,
      exclude: responseConfig.excludedObjects,
    });

    if (responseConfig.maskedObjects && responseConfig.maskedObjects.length > 0) {
      mask(responseCopy, responseConfig.maskedObjects, this.config.maskValue);
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
