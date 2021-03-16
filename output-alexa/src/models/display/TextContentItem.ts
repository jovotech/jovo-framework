import { IsEnum } from '@jovotech/output';
import { IsValidAlexaString } from '../../decorators/validation/IsValidAlexaString';

export enum DisplayTemplateTextContentItemType {
  Plain = 'PlainText',
  Rich = 'RichText',
}

export class TextContentItem {
  @IsEnum(DisplayTemplateTextContentItemType)
  type: DisplayTemplateTextContentItemType;

  @IsValidAlexaString()
  text: string;
}
