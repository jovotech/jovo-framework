import { Card, IsNotEmpty, IsString, IsUrl, ValidateIf } from '@jovotech/output';
import { Action, ActionType } from './Action';

export enum VisualActionType {
  BasicCard = 'BASIC_CARD',
  ImageCard = 'IMAGE_CARD',
}

export type VisualActionTypeLike = VisualActionType | `${VisualActionType}`;

export class VisualAction<
  TYPE extends VisualActionTypeLike = VisualActionTypeLike
> extends Action<ActionType.Visual> {
  visualType: TYPE;

  @ValidateIf((o) => o.title || o.visualType === VisualActionType.BasicCard)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ValidateIf((o) => o.body || o.visualType === VisualActionType.BasicCard)
  @IsString()
  @IsNotEmpty()
  body?: string;

  @ValidateIf((o) => o.visualType === VisualActionType.ImageCard)
  @IsUrl()
  imageUrl?: string;

  toCard?(): Card {
    return {
      title: this.title || '',
      subtitle: this.body,
      imageUrl: this.imageUrl,
    };
  }
}
