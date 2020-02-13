import { ButtonType } from '..';

export class Button {
  [key: string]: any;
  constructor(readonly type: ButtonType) {}
}
