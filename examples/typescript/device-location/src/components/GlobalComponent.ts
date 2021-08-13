import { Component, BaseComponent, Global, Intents } from '@jovotech/framework';
import { AskForPermissionConsentCardOutput } from '@jovotech/platform-alexa';
import { LoveHatePizzaComponent } from './LoveHatePizzaComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$redirect(LoveHatePizzaComponent);
  }

  @Intents(['UseDeviceLocationIntent'])
  async HandleDeviceLocation() {
    if (!this.$alexa) {
      return this.$send({
        message: 'Device location not supported on this platform',
        listen: false,
      });
    }

    try {
      const location = await this.$alexa.$user.getDeviceLocation();
      return this.$send({
        message: `Got your device location: ${location.city}, ${location.postalCode} (${location.countryCode})`,
        listen: false,
      });
    } catch (e) {
      if (e.type === 'NO_USER_PERMISSION') {
        return this.$send(AskForPermissionConsentCardOutput, {
          message:
            'To grant this skill permission to access your device location, go to the Alexa app on your phone.',
          permissions: ['read::alexa:device:all:address:country_and_postal_code'],
        });
      }
    }
  }
}
