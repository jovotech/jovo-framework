import { ExtensibleConfig, Jovo, BaseApp } from 'jovo-core';
import { Config as CorePlatformConfig, CorePlatform } from 'jovo-platform-core';
import _merge = require('lodash.merge');
import { WebApp } from './core/WebApp';
import { WebAppRequest } from './core/WebAppRequest';
import { WebAppResponse } from './core/WebAppResponse';
import { WebPlatformRequestBuilder } from './core/WebPlatformRequestBuilder';
import { WebPlatformResponseBuilder } from './core/WebPlatformResponseBuilder';
import { WebPlatformCore } from './modules/WebPlatformCore';

export interface Config extends CorePlatformConfig {}

export class WebPlatform extends CorePlatform<WebAppRequest, WebAppResponse> {
  constructor(config?: ExtensibleConfig) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp) {
    super.install(app);
    this.remove('CorePlatformCore');
    this.use(new WebPlatformCore());
  }

  getAppType(): string {
    return 'WebApp';
  }

  protected get appClass() {
    return WebApp;
  }

  protected augmentJovoPrototype() {
    Jovo.prototype.$webApp = undefined;
    Jovo.prototype.webApp = function (this: Jovo) {
      if (this.constructor.name !== 'WebApp') {
        throw Error(`Can't handle request. Please use this.isWebApp()`);
      }
      return this as WebApp;
    };
    Jovo.prototype.isWebApp = function (this: Jovo) {
      return this.constructor.name === 'WebApp';
    };
  }

  protected getRequestBuilder(): WebPlatformRequestBuilder {
    return new WebPlatformRequestBuilder();
  }

  protected getResponseBuilder(): WebPlatformResponseBuilder {
    return new WebPlatformResponseBuilder();
  }
}
