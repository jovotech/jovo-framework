import * as FormData from 'form-data';
import { AttachmentType, BASE_URL, IdentityData, Message, QuickReply } from '../..';
import { HttpService } from 'jovo-core';

export interface AttachmentMessageOptions {
  type: AttachmentType;
  data: Buffer | string | number;
  isReusable?: boolean;
  quickReplies?: QuickReply[];
}

export class AttachmentMessage extends Message {
  constructor(
    readonly recipient: IdentityData,
    private readonly options: AttachmentMessageOptions,
  ) {
    super(recipient);
  }

  send(pageAccessToken: string): Promise<any> {
    const isFile = this.isFileData();
    const isUrl = this.isUrlData();
    const isAttachmentId = this.isAttachmentIdData();

    if (isFile) {
      return this.sendFile(pageAccessToken);
    }

    const data = {
      message: {
        attachment: {
          payload: {},
          type: this.options.type,
        },
        quick_replies: this.options.quickReplies,
      },
      recipient: this.recipient,
    };

    if (isUrl) {
      (data.message.attachment.payload as any).url = this.options.data;
      (data.message.attachment.payload as any).is_reusable = this.options.isReusable || true;
    } else if (isAttachmentId) {
      (data.message.attachment.payload as any).attachment_id = this.options.data.toString();
    }

    const config = this.getConfig(pageAccessToken);
    config.data = data;

    return HttpService.request(config);
  }

  private sendFile(pageAccessToken: string) {
    const message = {
      attachment: {
        type: this.options.type,
        payload: { is_reusable: this.options.isReusable || true },
      },
      quick_replies: this.options.quickReplies,
    };

    const form = new FormData();
    form.append('recipient', JSON.stringify(this.recipient));
    form.append('message', JSON.stringify(message));
    form.append('filedata', this.options.data);

    const url = `https://${BASE_URL}${this.getPath(pageAccessToken)}`;

    return HttpService.post(url, form.getBuffer(), form.getHeaders());
  }

  private isUrlData(): boolean {
    return typeof this.options.data === 'string';
  }

  private isAttachmentIdData(): boolean {
    return typeof this.options.data === 'number';
  }

  private isFileData(): boolean {
    return this.options.data instanceof Buffer;
  }
}
