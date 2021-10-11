import { PlatformOutputTemplate } from '@jovotech/output';
import { QuickReply, Template } from '@jovotech/output-facebookmessenger';
import { InstagramOutputTemplateResponse } from './InstagramOutputTemplateResponse';

export class InstagramOutputTemplate extends PlatformOutputTemplate<InstagramOutputTemplateResponse> {
  nativeQuickReplies?: QuickReply[];
  template?: Template;
}
