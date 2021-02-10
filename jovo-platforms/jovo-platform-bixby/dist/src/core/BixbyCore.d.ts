import { Plugin, HandleRequest } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from './BixbyCapsule';
export declare class BixbyCore implements Plugin {
    install(bixby: Bixby): void;
    init(handleRequest: HandleRequest): void;
    request(capsule: BixbyCapsule): void;
    type(capsule: BixbyCapsule): void;
    session(capsule: BixbyCapsule): void;
    output(capsule: BixbyCapsule): void;
    response(capsule: BixbyCapsule): void;
}
