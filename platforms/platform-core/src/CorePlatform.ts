import { ExtensibleConfig, Jovo, Platform } from '@jovotech/core';
import {
  CorePlatformOutputTemplateConverterStrategy,
  CorePlatformResponse,
} from '@jovotech/output-core';
import { CorePlatformApp } from './CorePlatformApp';
import { CorePlatformRequest } from './CorePlatformRequest';

export interface CorePlatformConfig extends ExtensibleConfig {
  requestType: CorePlatformRequest['type'];
}

export class CorePlatform extends Platform<
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformConfig
> {
  // TODO: determine how useful this is and if this is required somewhere
  // Creates a class with the given name that only supports requests with the given type.
  // Allows making new platforms on the fly
  static create(
    name: string,
    type: CorePlatformConfig['requestType'],
  ): new (...args: any[]) => CorePlatform {
    // workaround to make the anonymous' class name equal to `name`
    const obj = {
      [name]: class extends CorePlatform {
        getDefaultConfig(): CorePlatformConfig {
          return {
            ...super.getDefaultConfig(),
            requestType: type,
          };
        }
      },
    };
    return obj[name];
  }

  outputTemplateConverterStrategy = new CorePlatformOutputTemplateConverterStrategy();
  requestClass = CorePlatformRequest;
  jovoClass = CorePlatformApp;

  getDefaultConfig(): CorePlatformConfig {
    return {
      requestType: 'jovo-platform-core',
    };
  }

  isRequestRelated(request: Record<string, any> | CorePlatformRequest): boolean {
    return request.version && request.request?.type && request.type === this.config.requestType;
  }

  prepareResponse(
    response: CorePlatformResponse,
    jovo: Jovo,
  ): CorePlatformResponse | Promise<CorePlatformResponse> {
    this.setResponseSessionData(response, jovo);
    return response;
  }

  setResponseSessionData(response: CorePlatformResponse, jovo: Jovo): this {
    response.session.data = jovo.$session.$data;
    return this;
  }
}
