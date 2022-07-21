import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPostalAddress } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';

export interface ConnectionScheduleTaxiReservationOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  partySize?: number;
  pickupLocation?: ConnectionPostalAddress;
  pickupTime?: string;
  dropoffLocation?: ConnectionPostalAddress;
}

@Output()
export class ConnectionScheduleTaxiReservationOutput extends BaseOutput<ConnectionScheduleTaxiReservationOutputOptions> {
  getDefaultOptions(): ConnectionScheduleTaxiReservationOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
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
                  uri: 'connection://AMAZON.ScheduleTaxiReservation/1',
                  input: {
                    '@type': 'ScheduleTaxiReservationRequest',
                    '@version': '1',
                    'partySize': this.options.partySize,
                    'pickupLocation': this.options.pickupLocation,
                    'pickupTime': this.options.pickupTime,
                    'dropoffLocation': this.options.dropoffLocation,
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
