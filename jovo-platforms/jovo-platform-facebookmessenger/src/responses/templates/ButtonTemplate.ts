import { TemplateType } from '../..';
import { Button } from '../Button';
import { Template, TemplatePayload } from '../Template';

export type ButtonTemplateOptions = Omit<ButtonTemplatePayload, 'template_type'>;

export interface ButtonTemplatePayload extends TemplatePayload<TemplateType.Button> {
  text: string;
  buttons: Button[];
}

export class ButtonTemplate extends Template<ButtonTemplatePayload> {}
