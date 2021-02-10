import { User } from 'jovo-core';
import { BixbyCapsule } from '../core/BixbyCapsule';
export declare class BixbyUser extends User {
    bixbyCapsule: BixbyCapsule;
    constructor(bixbyCapsule: BixbyCapsule);
    getId(): string;
}
