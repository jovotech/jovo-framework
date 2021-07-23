import { Capability, JovoDevice } from '@jovotech/framework';
import { Core } from './Core';

export type CorePlatformCapability = Capability;

export class CorePlatformDevice extends JovoDevice<Core, CorePlatformCapability> {
  setCapabilitiesFromRequest(): void {
    // needs to be implemented
  }
}
