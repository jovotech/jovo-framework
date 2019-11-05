import { Button, ButtonType } from '../..';

export class CallButton extends Button {
  payload: string;

  constructor(public title: string, phoneNumber: string) {
    super(ButtonType.Call);
    this.payload = phoneNumber;
  }
}
