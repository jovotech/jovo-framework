import { Action, ActionType, AudioActionData, ProcessingActionData, QuickReply, SpeechActionData, TextActionData } from './Interfaces';
export declare class ActionBuilder {
    private readonly actions;
    constructor();
    addContainer(actions: Action[], type?: ActionType.SequenceContainer | ActionType.ParallelContainer): ActionBuilder;
    addText(data: TextActionData | string): ActionBuilder;
    addSpeech(data: SpeechActionData | string): ActionBuilder;
    addAudio(data: AudioActionData): ActionBuilder;
    addProcessingInformation(data: ProcessingActionData): ActionBuilder;
    addQuickReplies(quickReplies: Array<QuickReply | string>): ActionBuilder;
    reset(): void;
    build(): Action[];
}
