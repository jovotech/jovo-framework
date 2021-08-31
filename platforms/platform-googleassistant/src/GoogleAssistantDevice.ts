import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Capability as NativeCapability } from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';

export enum GoogleAssistantCapability {
  InteractiveCanvas = 'GOOGLE_ASSISTANT:INTERACTIVE_CANVAS',
  WebLink = 'GOOGLE_ASSISTANT:WEB_LINK',
}

export type GoogleAssistantCapabilityType =
  | CapabilityType
  | GoogleAssistantCapability
  | `${GoogleAssistantCapability}`
  | NativeCapability
  | `${NativeCapability}`;

export class GoogleAssistantDevice extends JovoDevice<
  GoogleAssistant,
  GoogleAssistantCapabilityType
> {}
