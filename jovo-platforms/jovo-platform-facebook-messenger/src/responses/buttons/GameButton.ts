import { Button, ButtonType } from '../..';

export type GameMetaData = { player_id: string } | { context_id: string };

export class GameButton extends Button {
  constructor(public title: string, public payload: string, public game_metadata: GameMetaData) {
    super(ButtonType.Game);
  }
}
