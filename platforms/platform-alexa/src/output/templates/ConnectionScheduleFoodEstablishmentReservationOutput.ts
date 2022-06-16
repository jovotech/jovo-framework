import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';

export interface ConnectionRestaurant {
  '@type': 'Restaurant';
  '@version': '1';
  'name': string;
  'location': ConnectionPostalAddress;
}

export interface ConnectionScheduleFoodEstablishmentReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  startTime?: string;
  partySize?: number;
  restaurant: ConnectionRestaurant;
}

@Output()
export class ConnectionScheduleFoodEstablishmentReservationOutput extends BaseOutput<ConnectionScheduleFoodEstablishmentReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleFoodEstablishmentReservationOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      restaurant: {
        '@type': 'Restaurant',
        '@version': '1',
        'name': '',
        'location': {
          '@type': 'PostalAddress',
          '@version': '1',
          'streetAddress': '',
          'locality': '',
          'region': '',
          'postalCode': '',
        },
      },
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    const shouldEndSession =
      this.options.onCompletion === OnCompletion.SendErrorsOnly
        ? true
        : this.options.shouldEndSession;

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession,
              directives: [
                {
                  type: 'Connections.StartConnection',
                  uri: 'connection://AMAZON.ScheduleFoodEstablishmentReservation/1',
                  input: {
                    '@type': 'ScheduleFoodEstablishmentReservationRequest',
                    '@version': '1',
                    'startTime': this.options.startTime,
                    'partySize': this.options.partySize,
                    'restaurant': this.options.restaurant,
                  },
                  token: this.options.token,
                  onCompletion: this.options.onCompletion,
                },
              ],
            },
          },
        },
      },
    };
  }
}
