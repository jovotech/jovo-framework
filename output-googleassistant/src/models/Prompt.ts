import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MessageValue,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { SUGGESTIONS_MAX_SIZE, TEXT_MAX_LENGTH } from '../constants';
import { IsValidContentObject } from '../decorators/validation/IsValidContentObject';
import { Image } from './common/Image';
import { Link } from './common/Link';
import { Suggestion } from './common/Suggestion';
import { Card } from './content/Card';
import { Collection } from './content/Collection';
import { List } from './content/List';
import { Media } from './content/Media';
import { Table } from './content/Table';

export class Canvas {
  @IsUrl({ protocols: ['https', 'http'] })
  url: string;

  @IsOptional()
  @IsArray()
  data?: unknown[];

  @IsOptional()
  @IsBoolean()
  suppressMic?: boolean;
}

export class Simple {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  speech?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(TEXT_MAX_LENGTH)
  text?: string;

  toMessage?(): MessageValue {
    const speech = this.speech || '';
    return this.text
      ? {
          displayText: this.text,
          text: speech,
        }
      : speech;
  }
}

export class Content {
  @IsValidContentObject()
  @Type(() => Card)
  card?: Card;

  @IsValidContentObject()
  @Type(() => Image)
  image?: Image;

  @IsValidContentObject()
  @Type(() => Table)
  table?: Table;

  @IsValidContentObject()
  @Type(() => Media)
  media?: Media;

  @IsValidContentObject()
  @Type(() => Collection)
  collection?: Collection;

  @IsValidContentObject()
  @Type(() => List)
  list?: List;
}

export class Prompt {
  @IsOptional()
  @IsBoolean()
  override?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => Simple)
  firstSimple?: Simple;

  @IsOptional()
  @ValidateNested()
  @Type(() => Content)
  content?: Content;

  @IsOptional()
  @ValidateNested()
  @Type(() => Simple)
  lastSimple?: Simple;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUGGESTIONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => Suggestion)
  suggestions?: Suggestion[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Link)
  link?: Link;

  @IsOptional()
  @ValidateNested()
  @Type(() => Canvas)
  canvas?: Canvas;

  @IsOptional()
  @IsObject()
  orderUpdate?: unknown;
}
