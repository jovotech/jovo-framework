import { EnumLike } from '@jovotech/framework';

export enum OnCompletion {
  ResumeSession = 'RESUME_SESSION',
  SendErrorsOnly = 'SEND_ERRORS_ONLY',
}

export type OnCompletionLike = EnumLike<OnCompletion> | string;
