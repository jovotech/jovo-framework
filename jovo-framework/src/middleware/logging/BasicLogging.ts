import { request } from 'express';
import { BaseApp, HandleRequest, Log, Logger, LogLevel, Plugin, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import _unset = require('lodash.unset');

export interface Config extends PluginConfig {
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
  space?: string;
  styling?: boolean;
}

export class BasicLogging implements Plugin {
  // tslint:disable: object-literal-sort-keys
  config: Config = {
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
    space: '\t',
    styling: false,
  };
  // tslint:enable
  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    // tslint:disable
    this.requestLogger = this.requestLogger.bind(this);
    this.responseLogger = this.responseLogger.bind(this);
    // tslint:enable
  }

  install(app: BaseApp) {
    if (this.config.logging === true) {
      this.config.request = true;
      this.config.response = true;
    } else if (this.config.logging === false) {
      this.config.request = false;
      this.config.response = false;
    }

    app.on('request', this.requestLogger);
    app.on('after.response', this.responseLogger);
  }

  uninstall(app: BaseApp) {
    app.removeListener('request', this.requestLogger);
    app.removeListener('after.response', this.responseLogger);
  }

  requestLogger = (handleRequest: HandleRequest) => {
    if (Logger.isLogLevel(LogLevel.VERBOSE)) {
      Log.verbose(Log.subheader(`Request JSON`, 'jovo-framework'));
      Log.yellow().verbose(
        JSON.stringify(handleRequest.host.getRequestObject(), null, this.config.space),
      );
      return;
    }

    if (!this.config.request) {
      return;
    }

    const requestCopy = JSON.parse(JSON.stringify(handleRequest.host.getRequestObject()));

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

    if (this.config.requestObjects && this.config.requestObjects.length > 0) {
      this.config.requestObjects.forEach((path: string) => {
        // tslint:disable-next-line
        console.log(JSON.stringify(_get(requestCopy, path), null, this.config.space));
      });
    } else {
      // tslint:disable-next-line
      console.log(JSON.stringify(requestCopy, null, this.config.space));
    }
  };

  responseLogger = (handleRequest: HandleRequest) => {
    if (Logger.isLogLevel(LogLevel.VERBOSE)) {
      Log.verbose(Log.subheader(`Response JSON`, 'jovo-framework'));
      Log.yellow().verbose(JSON.stringify(handleRequest.jovo!.$response, null, this.config.space));
      return;
    }

    if (!this.config.response) {
      return;
    }
    if (!handleRequest.jovo) {
      return;
    }

    const responseCopy = JSON.parse(JSON.stringify(handleRequest.jovo.$response));

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

    if (this.config.responseObjects && this.config.responseObjects.length > 0) {
      this.config.responseObjects.forEach((path: string) => {
        if (!handleRequest.jovo) {
          return;
        }
        // tslint:disable-next-line
        console.log(JSON.stringify(_get(responseCopy, path), null, this.config.space));
      });
    } else {
      // tslint:disable-next-line
      console.log(this.style(JSON.stringify(responseCopy, null, this.config.space)));
    }
  };

  style(text: string) {
    if (this.config.styling) {
      text = text.replace(/<speak>(.+?)<\/speak>/g, `<speak>\x1b[36m$1\x1b[0m</speak>`);
      text = text.replace(/"_JOVO_STATE_": "(.+?)"/g, `"_JOVO_STATE_": "\x1b[33m$1\x1b[0m"`);
    }
    return text;
  }
}
