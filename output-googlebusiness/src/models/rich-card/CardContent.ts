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
import { Media } from './Media';
import { Suggestion } from '../Suggestion';

export class CardContent {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Media)
  media?: Media;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
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
