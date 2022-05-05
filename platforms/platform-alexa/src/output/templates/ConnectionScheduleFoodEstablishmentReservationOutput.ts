import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from './ConnectionPostalAddress';

export interface ConnectionRestaurant {
  "@type": "Restaurant",
  "@version": "1",
  name: string;
  location: ConnectionPostalAddress;
}

export interface ConnectionScheduleFoodEstablishmentReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  startTime?: string;
  partySize?: number;
  restaurant: ConnectionRestaurant;
}

@Output()
export class ConnectionScheduleFoodEstablishmentReservationOutput extends BaseOutput<ConnectionScheduleFoodEstablishmentReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleFoodEstablishmentReservationOutputOptions {
    return {
      restaurant: {
        "@type": "Restaurant",
        "@version": "1",
        name: '',
        location: {
          "@type": "PostalAddress",
          "@version": "1",
          streetAddress: '',
          locality: '',
          region: '',
          postalCode: ''
        }
      },
    };
  }

  build(): OutputTemplate | OutputTemplate[] {

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: this.options.shouldEndSession,
              directives: [
                {
                  type: "Connections.StartConnection",
                  uri: "connection://AMAZON.ScheduleFoodEstablishmentReservation/1",
                  input: {
                    "@type": "ScheduleFoodEstablishmentReservationRequest",
                    "@version": "1",
                    startTime: this.options.startTime,
                    partySize: this.options.partySize,
                    restaurant: this.options.restaurant,
                  },
                  token: this.options.token
                }
              ],
            },
          },
        },
      },
    };
  }
}
