import {UnknownObject} from '@jovotech/common';
import {BaseComponent, ComponentData} from './index';

export type ExtractDelegatedEventData<
    T extends BaseDelegateComponent<Record<string, unknown>>,
    KEY extends keyof T['__resolve'],
> = T extends BaseDelegateComponent<infer RESOLVE> ? RESOLVE[KEY] : never;

export abstract class BaseDelegateComponent<
    RESOLVE extends UnknownObject,
    DATA extends ComponentData = ComponentData,
    CONFIG extends UnknownObject = UnknownObject,
> extends BaseComponent<DATA, CONFIG> {
    // used to permit the ExtractDelegatedEventData work.
    // If you find a better way that not require "declare", be my guest! :D
    declare __resolve: RESOLVE;

    override async $resolve<ARGS extends RESOLVE[KEY], KEY extends keyof RESOLVE = keyof RESOLVE>(
        eventName: Extract<KEY, string>,
        ...eventArgs: ARGS extends Array<unknown> ? [...ARGS] : [ARGS]
    ): Promise<void> {
        // because of the JovoProxy class, this implementation of the $resolve will not be called.
        // But it's ok, we need only types work.
        return super.$resolve(eventName as string, ...(eventArgs as unknown[]));
    }
}
