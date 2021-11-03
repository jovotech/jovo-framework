import { JovoResponse, OutputTemplate, OutputTemplateConverter } from '@jovotech/output';
import { BaseOutput, OutputConstructor } from './BaseOutput';
import { DeepPartial } from './index';
import { Jovo } from './Jovo';
import { JovoDevice } from './JovoDevice';
import { JovoRequest } from './JovoRequest';
import { JovoUser } from './JovoUser';
import { Platform } from './Platform';

export abstract class AsyncJovo<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
  USER extends JovoUser<JOVO> = JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO> = JovoDevice<JOVO>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
> extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> {
  async $send(outputTemplateOrMessage: OutputTemplate | OutputTemplate[] | string): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructor: OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>,
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void>;
  async $send<OUTPUT extends BaseOutput>(
    outputConstructorOrTemplateOrMessage:
      | string
      | OutputConstructor<OUTPUT, REQUEST, RESPONSE, this>
      | OutputTemplate
      | OutputTemplate[],
    options?: DeepPartial<OUTPUT['options']>,
  ): Promise<void> {
    const currentOutputLength = this.$output.length;
    if (typeof outputConstructorOrTemplateOrMessage === 'function') {
      await super.$send(outputConstructorOrTemplateOrMessage, options);
    } else {
      await super.$send(outputConstructorOrTemplateOrMessage);
    }
    // get only the newly added output
    const newOutput = this.$output.slice(currentOutputLength);

    const outputConverter = new OutputTemplateConverter(
      this.$platform.outputTemplateConverterStrategy,
    );

    let response = await outputConverter.toResponse(newOutput);
    response = await this.$platform.finalizeResponse(response, this as unknown as JOVO);

    if (Array.isArray(response)) {
      for (const responseItem of response) {
        await this.sendResponse(responseItem);
      }
    } else if (response) {
      await this.sendResponse(response);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract sendResponse(response: RESPONSE): Promise<any>;
}
