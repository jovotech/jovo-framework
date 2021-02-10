import { Plugin } from 'jovo-core';
import { Lindenbaum, LindenbaumBot } from '../../../src';
export declare class LindenbaumMockNlu implements Plugin {
    install(lindenbaum: Lindenbaum): void;
    uninstall(lindenbaum: Lindenbaum): void;
    nlu(lindenbaumBot: LindenbaumBot): Promise<void>;
    inputs(lindenbaumBot: LindenbaumBot): Promise<void>;
}
