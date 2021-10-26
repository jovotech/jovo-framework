import { ClientRequest, ClientResponse } from '..';

export abstract class NetworkTransportStrategy {
  constructor(readonly endpointUrl: string) {}

  abstract send(request: ClientRequest): Promise<ClientResponse>;
}
