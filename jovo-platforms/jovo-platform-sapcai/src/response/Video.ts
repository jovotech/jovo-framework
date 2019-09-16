import { BasicCard } from './BasicCard';

export class Video extends BasicCard {
    content?: string;

    constructor(content: string) {
        super('video');
        this.content = content;
    }
}
