import {Jovo} from "./Jovo";

export abstract class User {
    new = true;
    jovo: Jovo;



    constructor(jovo: Jovo) {
        this.jovo = jovo;
    }

    abstract getId(): string;

    isNew(): boolean {
        return this.new;
    }


    abstract getAccessToken(): string;
}
