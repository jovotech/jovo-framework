import {
  AnyObject,
  ExtensibleConfig,
  ExtensibleInitConfig,
  Jovo,
  Platform,
  registerPlatformSpecificJovoReference,
} from '@jovotech/framework';
import { CoreOutputTemplateConverterStrategy } from '@jovotech/output-core';

import { CoreResponse } from '.';
import { Core } from './Core';
import { CoreDevice } from './CoreDevice';
import { CoreRequest } from './CoreRequest';
import { CoreRequestBuilder } from './CoreRequestBuilder';
import { CoreUser } from './CoreUser';

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
  /**
   Returns a new platform-class with the given name that extends CorePlatform.

   In order to make the type-system aware of the new class, some module augmentations have to be done.
   For a reference, take a look at the example below.

   Example:

   declare module '@jovotech/framework/dist/types/Extensible' {
     interface ExtensiblePluginConfig {
       WebPlatform?: CorePlatformConfig<'web'>;
     }

     interface ExtensiblePlugins {
       WebPlatform?: CorePlatform<'web'>;
     }
   }

   declare module '@jovotech/framework/dist/types/Jovo' {
     interface Jovo {
       $web?: Core;
     }
   }

   // create the class
   const WebPlatform = CorePlatform.createCustomPlatform('WebPlatform', 'web');
   // instantiate the class
   const webPlatform = new WebPlatform();
  */
  static createCustomPlatform<PLATFORM extends string>(
    className: string,
    platform: PLATFORM,
    jovoReferenceKey = `$${platform}`,
  ): new (config?: ExtensibleInitConfig<CorePlatformConfig>) => CorePlatform<PLATFORM> {
    // Workaround to make the anonymous' class name equal to className
    const obj = {
      [className]: class extends CorePlatform<PLATFORM> {
        getDefaultConfig(): CorePlatformConfig<PLATFORM> {
          return {
            ...super.getDefaultConfig(),
            platform,
          };
        }
        get name(): string {
          return className;
        }
      },
    };

    // Make the Core-instance that is related to this new class available to Jovo
    registerPlatformSpecificJovoReference(jovoReferenceKey as keyof Jovo, Core);

    return obj[className];
  }

  outputTemplateConverterStrategy = new CoreOutputTemplateConverterStrategy();
  requestClass = CoreRequest;
  jovoClass = Core;
  userClass = CoreUser;
  deviceClass = CoreDevice;
  requestBuilder = CoreRequestBuilder;

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
