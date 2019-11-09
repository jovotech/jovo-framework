import { IdentityData, Message, TemplateType } from '..';

export interface TemplatePayload<T> {
  template_type: T;
}

export abstract class Template<P extends TemplatePayload<TemplateType>> extends Message {
  message: {
    attachment: {
      type: 'template';
      payload: P;
    };
  };

  constructor(readonly recipient: IdentityData, payload: P) {
    super(recipient);

    this.message = {
      attachment: {
        payload,
        type: 'template',
      },
    };
  }
}
