import { JovoError } from '@jovotech/framework';

export class SocketConnectionFailedError extends JovoError {
  constructor(readonly webhookUrl: string, error: Error) {
    super({
      message: `Could not connect to socket server at ${webhookUrl}: ${error.message}.`,
    });
  }
}
