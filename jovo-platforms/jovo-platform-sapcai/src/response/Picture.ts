import { BasicCard } from './BasicCard';

export class Picture extends BasicCard {
    content?: string;

    constructor(content: string) {
        super('picture');
        this.content = content;
    }
}
