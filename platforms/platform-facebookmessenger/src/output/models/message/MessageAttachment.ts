import { IsEnum, IsObject, plainToClass, Transform, ValidateNested } from '@jovotech/output';
import { ButtonTemplate } from '../template/ButtonTemplate';
import { GenericTemplate } from '../template/GenericTemplate';
import { MediaTemplate } from '../template/MediaTemplate';
import { ReceiptTemplate } from '../template/ReceiptTemplate';
import { Template, TemplateBase, TemplateType } from '../template/Template';
import { FileAttachment } from './FileAttachment';

export enum MessageAttachmentType {
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  File = 'file',
  Template = 'template',
}

export class MessageAttachment {
  @IsEnum(MessageAttachmentType)
  type!: MessageAttachmentType;

  @IsObject()
  @ValidateNested()
  @Transform(({ value, obj }) => {
    let type:
      | typeof FileAttachment
      | typeof TemplateBase
      | typeof GenericTemplate
      | typeof ButtonTemplate
      | typeof MediaTemplate
      | typeof ReceiptTemplate;
    if (obj.type === MessageAttachmentType.Template) {
      switch (value.template_type as TemplateType) {
        case TemplateType.Generic:
          type = GenericTemplate;
          break;
        case TemplateType.Button:
          type = ButtonTemplate;
          break;
        case TemplateType.Media:
          type = MediaTemplate;
          break;
        case TemplateType.Receipt:
          type = ReceiptTemplate;
          break;
        default:
          type = TemplateBase;
      }
    } else {
      type = FileAttachment;
    }

    return plainToClass<
      | FileAttachment
      | Template
      | GenericTemplate
      | ButtonTemplate
      | MediaTemplate
      | ReceiptTemplate,
      FileAttachment | Template | GenericTemplate | ButtonTemplate | MediaTemplate | ReceiptTemplate
    >(type, value);
  })
  payload!: FileAttachment | Template;
}
