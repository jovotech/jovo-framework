import {
  GoogleAssistantResponse,
  Capability as GoogleAssistantNativeCapability,
} from '@jovotech/output-googleassistant';

import { Capability, JovoDevice } from '@jovotech/framework';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistant } from './GoogleAssistant';

export type GoogleAssistantCapability = Capability;

export class GoogleAssistantDevice extends JovoDevice<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant,
  GoogleAssistantCapability
> {
  setCapabilitiesFromRequest(): void {
    const supportedCapabilites = this.jovo.$request.device?.capabilities;

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.Speech)) {
      this.addCapability('audio');
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.LongFormAudio)) {
      this.addCapability('long-form-audio');
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.RichResponse)) {
      this.addCapability('screen');
    }
  }
}
