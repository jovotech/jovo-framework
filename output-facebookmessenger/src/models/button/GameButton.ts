import { Equals, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { IsValidGameMetaDataString } from '../../decorators/validation/IsValidGameMetaDataString';
import { ButtonBase, ButtonType } from './Button';

export class GameMetaData {
  @IsOptional()
  @IsValidGameMetaDataString()
  player_id?: string;

  @IsOptional()
  @IsValidGameMetaDataString()
  context_id?: string;
}

export class GameButton extends ButtonBase<ButtonType.Game | 'game_play'> {
  @Equals(ButtonType.Game)
  type: ButtonType.Game;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  payload?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameMetaData)
  game_metadata?: GameMetaData;
}
