import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  QuickReplyValue,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Action, ActionType } from './Action';

export class QuickReply {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsDefined()
  value: unknown;

  toQuickReply?(): QuickReplyValue {
    return {
      value: (this.value as string | undefined) || this.label,
      text: this.label || '',
    };
  }
}

export class QuickReplyAction extends Action<ActionType.QuickReply> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuickReply)
  replies: QuickReply[];
}
