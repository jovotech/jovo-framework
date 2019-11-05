import { MediaType, TemplateType } from '../../Enums';
import { Button } from '../Button';
import { Template, TemplatePayload } from '../Template';

export type MediaTemplateOptions = Omit<MediaTemplatePayload, 'template_type'>;

export interface MediaTemplatePayload extends TemplatePayload<TemplateType.Media> {
  elements: MediaTemplateElement[];
  sharable?: boolean;
}

export interface MediaTemplateElement {
  media_type: MediaType;
  attachment_id?: string;
  url?: string;
  buttons: Button[];
}

export class MediaTemplate extends Template<MediaTemplatePayload> {}
