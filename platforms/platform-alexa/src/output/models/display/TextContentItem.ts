import { EnumLike } from '@jovotech/framework';
import { IsEnum } from '@jovotech/output';
import { IsValidAlexaString } from '../../decorators/validation/IsValidAlexaString';

export enum DisplayTemplateTextContentItemType {
  Plain = 'PlainText',
  Rich = 'RichText',
}

export type DisplayTemplateTextContentItemTypeLike = EnumLike<DisplayTemplateTextContentItemType>;

export class TextContentItem {
  @IsEnum(DisplayTemplateTextContentItemType)
  type!: DisplayTemplateTextContentItemTypeLike;

  @IsValidAlexaString()
  text!: string;
}
