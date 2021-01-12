import { DeepPartial } from '.';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Extensible, ExtensibleConfig, ExtensibleInitConfig } from './Extensible';
import { JovoRequest } from './JovoRequest';
import { JovoResponse } from './JovoResponse';

export const DEFAULT_PLATFORM_MIDDLEWARES = [
  '$init',
  '$request',
  '$session',
  '$user',
  '$type',
  '$nlu',
  '$inputs',
  '$output',
  '$response',
];

export abstract class Platform<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse,
  C extends ExtensibleConfig = ExtensibleConfig,
  N extends string[] = [
    '$init',
    '$request',
    '$session',
    '$user',
    '$type',
    '$nlu',
    '$inputs',
    '$output',
    '$response',
  ]
> extends Extensible<C, N> {
  readonly middlewareCollection = new MiddlewareCollection(...DEFAULT_PLATFORM_MIDDLEWARES);

  constructor(config?: DeepPartial<Omit<C & ExtensibleInitConfig, 'plugin'>>) {
    super(config);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isPlatformRequest(request: Record<string, any>): boolean;
}
