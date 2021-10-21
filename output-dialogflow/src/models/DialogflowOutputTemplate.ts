import { DenormalizePlatformOutputTemplate } from '@jovotech/output';
import { NormalizedDialogflowOutputTemplate } from './NormalizedDialogflowOutputTemplate';

export type DialogflowOutputTemplate =
  DenormalizePlatformOutputTemplate<NormalizedDialogflowOutputTemplate>;
