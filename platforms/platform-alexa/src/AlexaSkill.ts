import { Jovo } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { Device } from './interfaces';

export class AlexaSkill extends Jovo<AlexaRequest, AlexaResponse> {
  hasScreenInterface(): boolean {
    return this.hasDisplayInterface() || this.hasAPLInterface();
  }

  hasDisplayInterface(): boolean {
    return !!this.supportedInterfaces.Display;
  }

  hasAPLInterface(): boolean {
    return !!this.supportedInterfaces['Alexa.Presentation.APL'];
  }

  getSkillId(): string | undefined {
    return (
      this.$request.session?.application?.applicationId ||
      this.$request.context?.System?.application?.applicationId
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get supportedInterfaces(): NonNullable<Device['supportedInterfaces']> {
    return this.$request.context?.System?.device?.supportedInterfaces || {};
  }
}
