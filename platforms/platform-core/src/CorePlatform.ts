import { AnyObject, ExtensibleConfig, Platform } from '@jovotech/framework';
import { CoreOutputTemplateConverterStrategy } from '@jovotech/output-core';
import { CoreResponse } from '.';
import { Core } from './Core';
import { CoreDevice } from './CoreDevice';
import { CoreRequest } from './CoreRequest';
import { CoreUser } from './CoreUser';

export interface CorePlatformConfig extends ExtensibleConfig {
  type: 'core' | string;
}

export class CorePlatform extends Platform<
  CoreRequest,
  CoreResponse,
  Core,
  CoreUser,
  CoreDevice,
  CorePlatform,
  CorePlatformConfig
> {
  outputTemplateConverterStrategy = new CoreOutputTemplateConverterStrategy();
  requestClass = CoreRequest;
  jovoClass = Core;
  userClass = CoreUser;
  deviceClass = CoreDevice;

  getDefaultConfig(): CorePlatformConfig {
    return {
      type: 'core',
    };
  }

  isRequestRelated(request: AnyObject | CoreRequest): boolean {
    return (
      request.version &&
      request.timestamp &&
      request.input?.type &&
      request.platform === this.config.type
    );
  }

  isResponseRelated(response: AnyObject | CoreResponse): boolean {
    return (
      response.version &&
      response.output &&
      response.context &&
      response.context.user &&
      response.context.session &&
      response.platform === this.config.type
    );
  }

  finalizeResponse(
    response: CoreResponse,
    corePlatformApp: Core,
  ): CoreResponse | Promise<CoreResponse> {
    response.type = this.config.type;
    response.context.session.data = corePlatformApp.$session;
    return response;
  }
}
