import { Button } from '../response';
export interface EntityValue {
    isBuiltInEntity: boolean;
    value: any;
    type: string | null;
}
export interface Message {
    type: string;
    content: MessageContent;
}
export declare type MessageContent = string | MessageContentObject | MessageContentObject[];
export interface MessageContentObject {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    buttons?: Button[];
    elements?: MessageContentObject[];
}
