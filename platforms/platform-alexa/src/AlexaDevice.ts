import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Alexa } from './Alexa';
import { AlexaRequest } from './AlexaRequest';

import {
  getDeviceLocation,
  getDeviceAddress,
  DeviceLocation,
  DeviceAddressLocation,
} from './api/DeviceLocationApi';

import { getSystemTimeZone } from './api/SettingsApi';

export enum AlexaCapability {
  Apl = 'ALEXA:APL',
  Html = 'ALEXA:HTML',
}

export type AlexaCapabilityType = CapabilityType | AlexaCapability | `${AlexaCapability}`;

export class AlexaDevice extends JovoDevice<Alexa, AlexaCapabilityType> {
  get id(): string | undefined {
    return this.jovo.$request.context?.System.device.deviceId;
  }

  async getLocation(): Promise<DeviceLocation> {
    const request: AlexaRequest = this.jovo.$request;
    return getDeviceLocation(
      request.getApiEndpoint(),
      request.getDeviceId(),
      request.getApiAccessToken(),
    );
  }

  async getAddress(): Promise<DeviceAddressLocation> {
    const request: AlexaRequest = this.jovo.$request;
    return getDeviceAddress(
      request.getApiEndpoint(),
      request.getDeviceId(),
      request.getApiAccessToken(),
    );
  }

  async getTimeZone(): Promise<string> {
    const request: AlexaRequest = this.jovo.$request;
    return getSystemTimeZone(
      request.getApiEndpoint(),
      request.getDeviceId(),
      request.getApiAccessToken(),
    );
  }
}
