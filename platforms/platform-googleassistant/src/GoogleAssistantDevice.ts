import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { GoogleAssistant } from './GoogleAssistant';
import { Capability as NativeCapability } from './output';

export enum GoogleAssistantCapability {
  InteractiveCanvas = 'INTERACTIVE_CANVAS',
  WebLink = 'WEB_LINK',
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
