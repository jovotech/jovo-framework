import chalk from 'chalk';
import colorize from 'json-colorizer';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _unset from 'lodash.unset';

import { HandleRequest, Jovo } from '../index';
import { Plugin, PluginConfig } from '../Plugin';

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
  maskValue?: unknown;
  styling?: boolean;
  indentation?: string;
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
      maskValue: '[ Hidden ]',
      indentation: '  ',
      styling: true,
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
      return this.logRequest(jovo);
    });
    parent.middlewareCollection.use('response.end', (jovo: Jovo) => {
      return this.logResponse(jovo);
    });
  }

  async logRequest(jovo: Jovo): Promise<void> {
    jovo.$data._BASIC_LOGGING_START = new Date().getTime();

    if (!this.config.request) {
      return;
    }

    const requestCopy = JSON.parse(JSON.stringify(jovo.$request));

    const requestConfig = this.config.request as RequestResponseConfig;

    if (requestConfig.maskedObjects && requestConfig.maskedObjects.length > 0) {
      requestConfig.maskedObjects.forEach((maskPath: string) => {
        const value = _get(requestCopy, maskPath);
        if (value) {
          let newValue = this.config.maskValue;
          if (typeof this.config.maskValue === 'function') {
            newValue = this.config.maskValue(value);
          }
          _set(requestCopy, maskPath, newValue);
        }
      });
    }

    if (requestConfig.excludedObjects && requestConfig.excludedObjects.length > 0) {
      requestConfig.excludedObjects.forEach((excludePath: string) => {
        _unset(requestCopy, excludePath);
      });
    }

    /* eslint-disable no-console */
    if (this.config.styling) {
      console.log(chalk.bgWhite.black('\n\n >>>>> Request - ' + new Date().toISOString() + ' '));
    }

    if (requestConfig.objects && requestConfig.objects.length > 0) {
      requestConfig.objects.forEach((path: string) => {
        console.log(
          colorize(JSON.stringify(_get(requestCopy, path), null, this.config.indentation || 2)),
        );
      });
    } else {
      console.log(colorize(JSON.stringify(requestCopy, null, 2), this.config.colorizeSettings));
    }

    /* eslint-enable no-console */
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

    if (responseConfig.maskedObjects && responseConfig.maskedObjects.length > 0) {
      responseConfig.maskedObjects.forEach((maskPath: string) => {
        const value = _get(responseCopy, maskPath);
        if (value) {
          let newValue = this.config.maskValue;
          if (typeof this.config.maskValue === 'function') {
            newValue = this.config.maskValue(value);
          }
          _set(responseCopy, maskPath, newValue);
        }
      });
    }

    if (responseConfig.excludedObjects && responseConfig.excludedObjects.length > 0) {
      responseConfig.excludedObjects.forEach((excludePath: string) => {
        _unset(responseCopy, excludePath);
      });
    }

    /* eslint-disable no-console */
    if (this.config.styling) {
      console.log(
        chalk.bgGray.white('\n\n <<<<< Response - ' + new Date().toISOString() + ' ') +
          ' ✔️ ' +
          duration +
          'ms',
      );
    }
    if (responseConfig.objects && responseConfig.objects.length > 0) {
      responseConfig.objects.forEach((path: string) => {
        console.log(
          colorize(
            JSON.stringify(_get(responseCopy, path), null, this.config.indentation || 2),
            this.config.colorizeSettings,
          ),
        );
      });
    } else {
      console.log(
        colorize(
          JSON.stringify(responseCopy, null, this.config.indentation || 2),
          this.config.colorizeSettings,
        ),
      );
    }
    /* eslint-enable no-console */
  }
}
