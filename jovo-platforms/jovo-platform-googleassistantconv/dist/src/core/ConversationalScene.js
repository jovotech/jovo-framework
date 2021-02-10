"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConversationalScene {
    constructor(scene) {
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
exports.ConversationalScene = ConversationalScene;
//# sourceMappingURL=ConversationalScene.js.map