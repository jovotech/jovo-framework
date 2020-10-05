import { NextScene, Scene, Slot, SlotFillingStatus } from './Interfaces';

export class ConversationalScene implements Scene {
  name: string;
  next: NextScene;
  slotFillingStatus: SlotFillingStatus;
  slots: Record<string, Slot>;

  constructor(scene: Scene) {
    this.name = scene.name;
    this.next = scene.next;
    this.slotFillingStatus = scene.slotFillingStatus;
    this.slots = scene.slots;
  }

  isSlotFillingCollecting() {
    return this.slotFillingStatus === 'COLLECTING';
  }

  isSlotFillingFinal() {
    return this.slotFillingStatus === 'FINAL';
  }

  getSlots() {
    return this.slots;
  }
}
