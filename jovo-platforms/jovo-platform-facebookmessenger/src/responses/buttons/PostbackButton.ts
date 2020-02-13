import { Button, ButtonType } from '../..';

export class PostbackButton extends Button {
  constructor(public title: string, public payload: string = title) {
    super(ButtonType.Postback);
  }
}
