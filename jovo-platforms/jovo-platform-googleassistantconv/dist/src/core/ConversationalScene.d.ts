import { NextScene, Scene, Slot, SlotFillingStatus } from './Interfaces';
export declare class ConversationalScene implements Scene {
    name: string;
    next: NextScene;
    slotFillingStatus: SlotFillingStatus;
    slots: Record<string, Slot>;
    constructor(scene: Scene);
    isSlotFillingCollecting(): boolean;
    isSlotFillingFinal(): boolean;
    getSlots(): Record<string, Slot>;
}
