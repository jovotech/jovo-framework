import { JovoError } from '@jovotech/framework';

export class WebhookIdNotFoundError extends JovoError {
  constructor(readonly configPath: string) {
    super({
      message: `Can not load webhook id from config at ${configPath}.`,
    });
  }
}
