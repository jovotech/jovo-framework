import { ClassDecoratorMetadata } from './ClassDecoratorMetadata';
import { AnyObject, Constructor, Abstract } from '@jovotech/common';
import { Jovo } from '../Jovo';

export interface InjectableOptions {}

export class InjectableMetadata<PROVIDER = AnyObject> extends ClassDecoratorMetadata {
  constructor(readonly target: Constructor<PROVIDER>, readonly options?: InjectableOptions) {
    super(target);
  }
}

export interface ValueProvider<PROVIDER> {
  provide: InjectionToken;
  useValue: PROVIDER;
}

export interface ClassProvider<PROVIDER> {
  provide: InjectionToken;
  useClass: Constructor<PROVIDER>;
}

export interface FactoryProvider<PROVIDER> {
  provide: InjectionToken;
  useFactory: (jovo: Jovo) => PROVIDER;
}

export interface ExistingProvider {
  provide: InjectionToken;
  useExisting: InjectionToken;
}

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any
export type InjectionToken = string | symbol | Constructor<any> | Abstract<any> | Function;
export type Provider<PROVIDER> =
  | Constructor<PROVIDER>
  | ValueProvider<PROVIDER>
  | ClassProvider<PROVIDER>
  | FactoryProvider<PROVIDER>
  | ExistingProvider;
