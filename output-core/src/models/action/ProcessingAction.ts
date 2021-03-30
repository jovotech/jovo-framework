import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';
import { Action, ActionType } from './Action';

export enum ProcessingActionType {
  Hidden = 'HIDDEN',
  Typing = 'TYPING',
  Spinner = 'SPINNER',
}

export type ProcessingActionTypeLike = ProcessingActionType | `${ProcessingActionType}`;

export class ProcessingAction extends Action<ActionType.Processing> {
  @IsEnum(ProcessingActionType)
  processingType: ProcessingActionTypeLike;

  @IsOptional()
  @IsInt()
  durationInMs?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}
