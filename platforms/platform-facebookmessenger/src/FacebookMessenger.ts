import {
  BaseOutput,
  DeepPartial,
  Jovo,
  OutputConstructor,
  OutputTemplate,
  OutputTemplateConverter,
} from '@jovotech/framework';
import { FacebookMessengerResponse } from '@jovotech/output-facebookmessenger';
import { FacebookMessengerDevice } from './FacebookMessengerDevice';
import { FacebookMessengerPlatform } from './FacebookMessengerPlatform';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { SendMessageResult } from './interfaces';

export class FacebookMessenger extends Jovo<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerUser,
  FacebookMessengerDevice,
  FacebookMessengerPlatform
> {
  async $send(outputTemplate: OutputTemplate | OutputTemplate[]): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<
      OUTPUT,
      FacebookMessengerRequest,
      FacebookMessengerResponse,
      this
    >,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplate:
      | OutputConstructor<OUTPUT, FacebookMessengerRequest, FacebookMessengerResponse, this>
      | OutputTemplate
      | OutputTemplate[],
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    const currentOutputLength = this.$output.length;
    if (typeof outputConstructorOrTemplate === 'function') {
      await super.$send(outputConstructorOrTemplate, options);
    } else {
      await super.$send(outputConstructorOrTemplate);
    }
    const outputConverter = new OutputTemplateConverter(
      this.$platform.outputTemplateConverterStrategy,
    );

    // get only the newly added output
    const newOutput = this.$output.slice(currentOutputLength);

    let response = await outputConverter.toResponse(newOutput);
    response = await this.$platform.finalizeResponse(response, this);

    if (Array.isArray(response)) {
      for (const responseItem of response) {
        await this.$platform.sendData<SendMessageResult>(responseItem);
      }
    } else if (response) {
      await this.$platform.sendData<SendMessageResult>(response);
    }
  }
}
