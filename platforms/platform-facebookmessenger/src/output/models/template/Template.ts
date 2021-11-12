import { EnumLike } from '@jovotech/framework';
import { IsEnum } from '@jovotech/output';
import { ButtonTemplate } from './ButtonTemplate';
import { GenericTemplate } from './GenericTemplate';
import { MediaTemplate } from './MediaTemplate';
import { ReceiptTemplate } from './ReceiptTemplate';

export enum TemplateType {
  Generic = 'generic',
  Button = 'button',
  Media = 'media',
  Receipt = 'receipt',
}

export type TemplateTypeLike = EnumLike<TemplateType>;

export class TemplateBase<TYPE extends TemplateTypeLike = TemplateTypeLike> {
  [key: string]: unknown;

  @IsEnum(TemplateType)
  template_type!: TYPE;
}

export type Template = ButtonTemplate | GenericTemplate | MediaTemplate | ReceiptTemplate;
