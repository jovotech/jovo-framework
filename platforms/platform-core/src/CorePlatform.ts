import { ExtensibleConfig, Jovo, Platform } from '@jovotech/core';
import {
  CorePlatformOutputTemplateConverterStrategy,
  CorePlatformResponse,
} from '@jovotech/output-core';
import { CorePlatformApp } from './CorePlatformApp';
import { CorePlatformRequest } from './CorePlatformRequest';

export interface CorePlatformConfig extends ExtensibleConfig {}

export class CorePlatform extends Platform<
  CorePlatformRequest,
  CorePlatformResponse,
  CorePlatformConfig
> {
  outputTemplateConverterStrategy = new CorePlatformOutputTemplateConverterStrategy();
  requestClass = CorePlatformRequest;
  jovoClass = CorePlatformApp;

  getDefaultConfig(): CorePlatformConfig {
    return {};
  }

  isRequestRelated(request: Record<string, any> | CorePlatformRequest): boolean {
    return this.isCorePlatformRequest(request) && request.type === 'jovo-platform-core';
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

  protected isCorePlatformRequest(request: Record<string, any> | CorePlatformRequest): boolean {
    return request.version && request.type && request.request?.type;
  }
}
