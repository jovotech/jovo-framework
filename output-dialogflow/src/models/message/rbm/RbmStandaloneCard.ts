import { IsEnum, IsObject, Type, ValidateIf, ValidateNested } from '@jovotech/output';
import { RbmCardContent } from './RbmCardContent';

export enum CardOrientation {
  Unspecified = 'CARD_ORIENTATION_UNSPECIFIED',
  Horizontal = 'HORIZONTAL',
  Vertical = 'VERTICAL',
}

export enum ThumbnailImageAlignment {
  Unspecified = 'THUMBNAIL_IMAGE_ALIGNMENT_UNSPECIFIED',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export class RbmStandaloneCard {
  @IsEnum(CardOrientation)
  card_orientation: CardOrientation;

  @ValidateIf(
    (o) => o.card_orientation === CardOrientation.Horizontal || o.thumbnail_image_alignment,
  )
  @IsEnum(ThumbnailImageAlignment)
  thumbnail_image_alignment?: ThumbnailImageAlignment;

  @IsObject()
  @ValidateNested()
  @Type(() => RbmCardContent)
  card_content: RbmCardContent;
}
