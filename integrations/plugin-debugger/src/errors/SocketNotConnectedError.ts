import { JovoError } from '@jovotech/framework';

export class SocketNotConnectedError extends JovoError {
  constructor(readonly webhookUrl: string) {
    super({
      message: `Not connected to socket at ${webhookUrl}.`,
    });
  }
}
