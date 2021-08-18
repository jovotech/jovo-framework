import { Capability, JovoDevice } from '@jovotech/framework';
import { Capability as GoogleAssistantNativeCapability } from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';

export enum GoogleAssistantCapability {
  InteractiveCanvas = 'GOOGLE_ASSISTANT:INTERACTIVE_CANVAS',
  WebLink = 'GOOGLE_ASSISTANT:WEB_LINK',
}

export type GoogleAssistantCapabilityType = Capability | GoogleAssistantCapability;

export class GoogleAssistantDevice extends JovoDevice<
  GoogleAssistant,
  GoogleAssistantCapabilityType
> {
  setCapabilitiesFromRequest(): void {
    const supportedCapabilites = this.jovo.$request.device?.capabilities;

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.Speech)) {
      this.addCapability(Capability.Audio);
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.LongFormAudio)) {
      this.addCapability(Capability.LongformAudio);
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.RichResponse)) {
      this.addCapability(Capability.Screen);
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.WebLink)) {
      this.addCapability(GoogleAssistantCapability.WebLink);
    }

    if (supportedCapabilites?.includes(GoogleAssistantNativeCapability.InteractiveCanvas)) {
      this.addCapability(GoogleAssistantCapability.InteractiveCanvas);
    }
  }
}
