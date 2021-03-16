import { IsEnum } from '@jovotech/output';

export enum TemplateType {
  Generic = 'generic',
  Button = 'button',
  Media = 'media',
  Receipt = 'receipt',
}

export class Template<T extends TemplateType = TemplateType> {
  [key: string]: unknown;

  @IsEnum(TemplateType)
  template_type: T;
}
