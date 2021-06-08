import chalk from 'chalk';
import colorize from 'json-colorizer';
import _get from 'lodash.get';
import _set from 'lodash.set';
import _unset from 'lodash.unset';
import { App, HandleRequest, Jovo } from '../index';
import { Plugin, PluginConfig } from '../Plugin';

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    BasicLogging?: BasicLoggingConfig;
  }

  interface ExtensiblePlugins {
    BasicLogging?: BasicLogging;
  }
}

export interface BasicLoggingConfig extends PluginConfig {
  logging?: boolean;
  request?: boolean;
  response?: boolean;
  requestObjects?: string[];
  responseObjects?: string[];
  maskRequestObjects?: string[];
  maskResponseObjects?: string[];
  maskValue?: any;
  excludeRequestObjects?: string[];
  excludeResponseObjects?: string[];
  styling?: boolean;
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
      logging: undefined,
      request: false,
      maskValue: '[ Hidden ]',
      requestObjects: [],
      maskRequestObjects: [],
      excludeRequestObjects: [],
      response: false,
      maskResponseObjects: [],
      excludeResponseObjects: [],
      responseObjects: [],
      space: '   ',
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

  install(parent: App): Promise<void> | void {
    parent.middlewareCollection.use('after.request', this.logRequest);
    parent.middlewareCollection.use('after.response', this.logResponse);
  }

  logRequest = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    jovo.$data._BASIC_LOGGING_START = new Date().getTime();

    if (!this.config.request) {
      return;
    }

    const requestCopy = JSON.parse(JSON.stringify(jovo.$request));

    if (this.config.maskRequestObjects && this.config.maskRequestObjects.length > 0) {
      this.config.maskRequestObjects.forEach((maskPath: string) => {
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

    if (this.config.excludeRequestObjects && this.config.excludeRequestObjects.length > 0) {
      this.config.excludeRequestObjects.forEach((excludePath: string) => {
        _unset(requestCopy, excludePath);
      });
    }

    if (this.config.styling) {
      console.log(chalk.bgWhite.black('\n\n >>>>> Request - ' + new Date().toISOString() + ' '));
    }

    if (this.config.requestObjects && this.config.requestObjects.length > 0) {
      this.config.requestObjects.forEach((path: string) => {
        // tslint:disable-next-line
        console.log(colorize(JSON.stringify(_get(requestCopy, path), null, 2)));
      });
    } else {
      // tslint:disable-next-line
      console.log(colorize(JSON.stringify(requestCopy, null, 2)));

      // tslint:disable-next-line:no-console
      console.log();
    }

    console.log(colorize(JSON.stringify(jovo.$request, null, 2), this.config.colorizeSettings));
  };
  logResponse = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    jovo.$data._BASIC_LOGGING_STOP = new Date().getTime();
    const duration = jovo.$data._BASIC_LOGGING_STOP - jovo.$data._BASIC_LOGGING_START;

    if (!this.config.response) {
      return;
    }

    const responseCopy = JSON.parse(JSON.stringify(jovo.$response));

    if (this.config.maskResponseObjects && this.config.maskResponseObjects.length > 0) {
      this.config.maskResponseObjects.forEach((maskPath: string) => {
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

    if (this.config.excludeResponseObjects && this.config.excludeResponseObjects.length > 0) {
      this.config.excludeResponseObjects.forEach((excludePath: string) => {
        _unset(responseCopy, excludePath);
      });
    }
    // tslint:disable-next-line:no-console

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
        if (!handleRequest.jovo) {
          return;
        }
        // tslint:disable-next-line
        console.log(
          colorize(JSON.stringify(_get(responseCopy, path), null, 2), this.config.colorizeSettings),
        );
      });
    } else {
      // tslint:disable-next-line
      console.log(colorize(JSON.stringify(responseCopy, null, 2), this.config.colorizeSettings));
    }
  };
}
