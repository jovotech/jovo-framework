import { HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import { SapCai } from '../SapCai';
import { SapCaiSkill } from '..';
declare class Config implements PluginConfig {
    enabled?: boolean;
    useLaunch?: boolean;
}
export declare class SapCaiCore implements Plugin {
    config: Config;
    install(cai: SapCai): void;
    uninstall(cai: SapCai): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(caiSkill: SapCaiSkill): Promise<void>;
    type(caiSkill: SapCaiSkill): Promise<void>;
    session(caiSkill: SapCaiSkill): Promise<void>;
    output(caiSkill: SapCaiSkill): void;
    response(caiSkill: SapCaiSkill): Promise<void>;
}
export {};
