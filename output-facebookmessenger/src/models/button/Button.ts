import { IsEnum } from '@jovotech/output';

export enum ButtonType {
  Link = 'web_url',
  Postback = 'postback',
  Call = 'phone_number',
  Login = 'account_link',
  Logout = 'account_unlink',
  Game = 'game_play',
}

export class Button<T extends ButtonType = ButtonType> {
  [key: string]: unknown;

  @IsEnum(ButtonType)
  type: T;
}
