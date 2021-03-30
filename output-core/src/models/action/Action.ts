import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export enum ActionType {
  Text = 'TEXT',
  Speech = 'SPEECH',
  Audio = 'AUDIO',
  Visual = 'VISUAL',
  Processing = 'PROCESSING',
  Custom = 'CUSTOM',
  SequenceContainer = 'SEQ_CONTAINER',
  ParallelContainer = 'PAR_CONTAINER',
  QuickReply = 'QUICK_REPLY',
}

export type ActionTypeLike = ActionType | `${ActionType}`;

export class Action<TYPE extends ActionTypeLike = ActionTypeLike> {
  [key: string]: unknown;

  @IsString()
  @IsEnum(ActionType)
  type: TYPE;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsInt()
  delay?: number;
}
