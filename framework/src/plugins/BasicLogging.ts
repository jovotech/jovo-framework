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

export interface BasicLoggingConfig extends PluginConfig {
  request?: boolean;
  response?: boolean;
  requestObjects?: string[];
  responseObjects?: string[];
  maskedRequestObjects?: string[];
  maskedResponseObjects?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maskValue?: any;
  excludedRequestObjects?: string[];
  excludedResponseObjects?: string[];
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
      enabled: true,
      request: false,
      maskValue: '[ Hidden ]',
      requestObjects: [],
      maskedRequestObjects: [],
      excludedRequestObjects: [],
      response: false,
      maskedResponseObjects: [],
      excludedResponseObjects: [],
      responseObjects: [],
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

    if (this.config.maskedRequestObjects && this.config.maskedRequestObjects.length > 0) {
      this.config.maskedRequestObjects.forEach((maskPath: string) => {
        const value = _get(requestCopy, maskPath);
        if (value) {
          let newValue = this.config.maskValue;
          if (typeof newValue === 'function') {
            newValue = this.config.maskValue(value);
          }
          _set(requestCopy, maskPath, newValue);
        }
      });
    }

    if (this.config.excludedRequestObjects && this.config.excludedRequestObjects.length > 0) {
      this.config.excludedRequestObjects.forEach((excludePath: string) => {
        _unset(requestCopy, excludePath);
      });
    }

    /* eslint-disable no-console */
    if (this.config.styling) {
      console.log(chalk.bgWhite.black('\n\n >>>>> Request - ' + new Date().toISOString() + ' '));
    }

    if (this.config.requestObjects && this.config.requestObjects.length > 0) {
      this.config.requestObjects.forEach((path: string) => {
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

    if (this.config.maskedResponseObjects && this.config.maskedResponseObjects.length > 0) {
      this.config.maskedResponseObjects.forEach((maskPath: string) => {
        const value = _get(responseCopy, maskPath);
        if (value) {
          let newValue = this.config.maskValue;
          if (typeof newValue === 'function') {
            newValue = this.config.maskValue(value);
          }
          _set(responseCopy, maskPath, newValue);
        }
      });
    }

    if (this.config.excludedResponseObjects && this.config.excludedResponseObjects.length > 0) {
      this.config.excludedResponseObjects.forEach((excludePath: string) => {
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
    if (this.config.responseObjects && this.config.responseObjects.length > 0) {
      this.config.responseObjects.forEach((path: string) => {
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
