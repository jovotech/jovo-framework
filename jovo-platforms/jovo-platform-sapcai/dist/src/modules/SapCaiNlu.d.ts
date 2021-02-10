import { SapCai } from '../SapCai';
import { Plugin } from 'jovo-core';
import { SapCaiSkill } from '..';
export declare class SapCaiNlu implements Plugin {
    install(sapcai: SapCai): void;
    uninstall(sapcai: SapCai): void;
    nlu(caiSkill: SapCaiSkill): Promise<void>;
    inputs(caiSkill: SapCaiSkill): void;
}
