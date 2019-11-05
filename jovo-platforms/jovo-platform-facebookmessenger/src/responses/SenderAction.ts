import { IdentityData, Message, SenderActionType } from '..';

export class SenderAction extends Message {
  constructor(readonly recipient: IdentityData, public sender_action: SenderActionType) {
    super(recipient);
  }
}
