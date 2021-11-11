import { AnyObject, ExtensibleConfig, Platform } from '@jovotech/framework';
import { Core } from './Core';
import { CoreDevice } from './CoreDevice';
import { CoreRequest } from './CoreRequest';
import { CoreRequestBuilder } from './CoreRequestBuilder';
import { CoreResponse } from './CoreResponse';
import { CoreUser } from './CoreUser';
import { CoreOutputTemplateConverterStrategy } from './output';

export interface CorePlatformConfig<PLATFORM extends string = 'core' | string>
  extends ExtensibleConfig {
  platform: PLATFORM | string;
}

export class CorePlatform<PLATFORM extends string = 'core' | string> extends Platform<
  CoreRequest,
  CoreResponse,
  Core,
  CoreUser,
  CoreDevice,
  CorePlatform<PLATFORM>,
  CorePlatformConfig
> {
  readonly outputTemplateConverterStrategy = new CoreOutputTemplateConverterStrategy();
  readonly requestClass = CoreRequest;
  readonly jovoClass = Core;
  readonly userClass = CoreUser;
  readonly deviceClass = CoreDevice;
  readonly requestBuilder = CoreRequestBuilder;

  getDefaultConfig(): CorePlatformConfig {
    return {
      platform: 'core',
    };
  }

  isRequestRelated(request: AnyObject | CoreRequest): boolean {
    return (
      request.version &&
      request.timestamp &&
      request.input?.type &&
      request.platform === this.config.platform
    );
  }

  isResponseRelated(response: AnyObject | CoreResponse): boolean {
    return (
      response.version &&
      response.output &&
      response.context &&
      response.context.user &&
      response.context.session &&
      response.platform === this.config.platform
    );
  }

  finalizeResponse(
    response: CoreResponse,
    corePlatformApp: Core,
  ): CoreResponse | Promise<CoreResponse> {
    response.platform = this.config.platform;
    response.context.session.data = corePlatformApp.$session;
    return response;
  }
}
