import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Core } from './Core';

export type CoreCapabilityType = CapabilityType;

export class CoreDevice extends JovoDevice<Core, CoreCapabilityType> {}
