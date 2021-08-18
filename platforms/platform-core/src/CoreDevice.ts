import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Core } from './Core';

export type CorePlatformCapabilityType = CapabilityType;

export class CoreDevice extends JovoDevice<Core, CorePlatformCapabilityType> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
