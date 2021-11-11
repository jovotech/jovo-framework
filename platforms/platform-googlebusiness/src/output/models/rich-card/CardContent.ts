import {
  ArrayMaxSize,
  Card,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import {
  CARD_CONTENT_DESCRIPTION_MAX_LENGTH,
  CARD_CONTENT_SUGGESTIONS_MAX_SIZE,
  CARD_CONTENT_TITLE_MAX_LENGTH,
} from '../../constants';
import { Suggestion } from '../Suggestion';
import { Media } from './Media';

export class CardContent {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CARD_CONTENT_TITLE_MAX_LENGTH)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CARD_CONTENT_DESCRIPTION_MAX_LENGTH)
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Media)
  media?: Media;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(CARD_CONTENT_SUGGESTIONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => Suggestion)
  suggestions?: Suggestion[];

  toCard?(): Card {
    const card: Card = {
      title: this.title || '',
    };
    if (this.description) {
      card.content = this.description;
    }
    if (this.media) {
      card.imageUrl = this.media.contentInfo.fileUrl;
      card.imageAlt = this.media.contentInfo.altText;
    }
    return card;
  }
}
