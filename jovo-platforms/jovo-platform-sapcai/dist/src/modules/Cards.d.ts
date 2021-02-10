import { Plugin } from 'jovo-core';
import { SapCai, SapCaiSkill } from '..';
export declare class Cards implements Plugin {
    install(sapcai: SapCai): void;
    uninstall(sapcai: SapCai): void;
    output(caiSkill: SapCaiSkill): void;
}
