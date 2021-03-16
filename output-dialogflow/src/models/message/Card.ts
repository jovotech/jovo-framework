import {
  Card as BaseCard,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';

export class Card {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image_uri?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Button)
  buttons?: Button[];

  toCard?(): BaseCard {
    const card: BaseCard = {
      title: '',
    };
    if (this.title) {
      card.title = this.title;
    }
    if (this.subtitle) {
      card.subtitle = this.subtitle;
    }
    if (this.image_uri) {
      card.imageUrl = this.image_uri;
    }
    return card;
  }
}

export class Button {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postback?: string;
}
