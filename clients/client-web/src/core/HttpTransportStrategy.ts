import { ClientRequest, ClientResponse } from '..';
import { NetworkTransportStrategy } from './NetworkTransportStrategy';

export class HttpTransportStrategy extends NetworkTransportStrategy {
  async send(endpointUrl: string, request: ClientRequest): Promise<ClientResponse> {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }
}
