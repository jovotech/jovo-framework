import { ClientRequest, ClientResponse } from '..';
import { NetworkTransportStrategy } from './NetworkTransportStrategy';

export class HttpTransportStrategy extends NetworkTransportStrategy {
  async send(request: ClientRequest): Promise<ClientResponse> {
    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      // TODO maybe we have to omit empty values
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}
