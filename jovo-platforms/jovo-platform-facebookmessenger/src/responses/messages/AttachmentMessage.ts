import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { HttpService } from 'jovo-core';
import { AttachmentType, BASE_URL, IdentityData, Message, QuickReply, TextQuickReply } from '../..';

export interface AttachmentMessageFile {
  path: string;
  fileName: string;
  mimeType?: string;
}

export interface AttachmentMessageOptions {
  type: AttachmentType;
  data: AttachmentMessageFile | string | number;
  isReusable?: boolean;
  quickReplies?: Array<QuickReply | string>;
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
        quick_replies: this.options.quickReplies
          ? this.options.quickReplies.map((quickReply) => {
              return typeof quickReply === 'string' ? new TextQuickReply(quickReply) : quickReply;
            })
          : undefined,
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
      quick_replies: this.options.quickReplies
        ? this.options.quickReplies.map((quickReply) => {
            return typeof quickReply === 'string' ? new TextQuickReply(quickReply) : quickReply;
          })
        : undefined,
    };

    const { path, mimeType, fileName } = this.options.data as AttachmentMessageFile;

    const form = new FormData();
    form.append('recipient', JSON.stringify(this.recipient));
    form.append('message', JSON.stringify(message));
    form.append('filedata', createReadStream(path), {
      filename: fileName,
      contentType: mimeType || undefined,
    });

    const url = `${BASE_URL}${this.getPath(pageAccessToken)}`;

    return HttpService.post(url, form, { headers: form.getHeaders() });
  }

  private isUrlData(): boolean {
    return typeof this.options.data === 'string';
  }

  private isAttachmentIdData(): boolean {
    return typeof this.options.data === 'number';
  }

  private isFileData(): boolean {
    return typeof this.options.data === 'object';
  }
}
