import { Button } from './Button';
import { BasicCard } from './BasicCard';
export declare class QuickReplyContent {
    title?: string;
    buttons?: Button[];
}
export declare class QuickReply extends BasicCard {
    content: QuickReplyContent;
    constructor(content: QuickReplyContent);
}
