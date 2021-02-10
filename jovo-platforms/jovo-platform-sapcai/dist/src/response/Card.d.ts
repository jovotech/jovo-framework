import { BasicCard } from './BasicCard';
import { Button } from './Button';
export declare class CardContent {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    buttons?: Button[];
}
export declare class Card extends BasicCard {
    content?: CardContent;
    constructor(content: CardContent);
}
