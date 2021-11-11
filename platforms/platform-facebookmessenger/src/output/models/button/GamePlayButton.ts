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

export class GamePlayButton extends ButtonBase<ButtonType.GamePlay | 'game_play'> {
  @Equals(ButtonType.GamePlay)
  type!: ButtonType.GamePlay | 'game_play';

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  payload?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameMetaData)
  game_metadata?: GameMetaData;
}
