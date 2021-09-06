import { EnumLike, IsEnum } from '@jovotech/output';
import { CallButton } from './CallButton';
import { GameButton } from './GameButton';
import { LinkButton } from './LinkButton';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { PostbackButton } from './PostbackButton';

export enum ButtonType {
  Link = 'web_url',
  Postback = 'postback',
  Call = 'phone_number',
  Login = 'account_link',
  Logout = 'account_unlink',
  Game = 'game_play',
}

export type ButtonTypeLike = EnumLike<ButtonType>;

export class ButtonBase<TYPE extends ButtonTypeLike = ButtonTypeLike> {
  [key: string]: unknown;

  @IsEnum(ButtonType)
  type: TYPE;
}

export type Button =
  | CallButton
  | GameButton
  | LinkButton
  | LoginButton
  | LogoutButton
  | PostbackButton;
