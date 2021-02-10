import { BasicCard } from './BasicCard';
import { CardContent } from './Card';
export declare class Carousel extends BasicCard {
    content?: CardContent[];
    constructor(items: CardContent[]);
}
