import { Plugin } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from '..';
export declare class BixbyNLU implements Plugin {
    install(bixby: Bixby): void;
    nlu(capsule: BixbyCapsule): void;
    inputs(capsule: BixbyCapsule): void;
}
