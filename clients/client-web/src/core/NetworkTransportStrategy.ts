import { ClientRequest, ClientResponse } from '..';

export abstract class NetworkTransportStrategy {
  abstract send(endpointUrl: string, request: ClientRequest): Promise<ClientResponse>;
}
