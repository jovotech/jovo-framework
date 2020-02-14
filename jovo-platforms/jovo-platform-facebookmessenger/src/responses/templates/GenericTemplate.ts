import { TemplateType } from '../..';
import { Button } from '../Button';
import { Template, TemplatePayload } from '../Template';

export type GenericTemplateOptions = Omit<GenericTemplatePayload, 'template_type'>;
export interface GenericTemplatePayload extends TemplatePayload<TemplateType.Generic> {
  elements: GenericTemplateElement[];
}
export interface GenericTemplateElement {
  title: string;
  image_url?: string;
  subtitle?: string;
  default_action?: Button;
  buttons?: Button[];
}

export class GenericTemplate extends Template<GenericTemplatePayload> {}
