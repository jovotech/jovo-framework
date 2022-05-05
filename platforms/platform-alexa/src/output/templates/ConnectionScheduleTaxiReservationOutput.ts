import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from '../../interfaces';

export interface ConnectionScheduleTaxiReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  partySize?: number;
  pickupLocation?: ConnectionPostalAddress;
  pickupTime?: string;
  dropoffLocation?: ConnectionPostalAddress;
}

@Output()
export class ConnectionScheduleTaxiReservationOutput extends BaseOutput<ConnectionScheduleTaxiReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleTaxiReservationOutputOptions {
    return {
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
                  uri: "connection://AMAZON.ScheduleTaxiReservation/1",
                  input: {
                    "@type": "ScheduleTaxiReservationRequest",
                    "@version": "1",
                    partySize: this.options.partySize,
                    pickupLocation: this.options.pickupLocation,
                    pickupTime: this.options.pickupTime,
                    dropoffLocation: this.options.dropoffLocation,
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
