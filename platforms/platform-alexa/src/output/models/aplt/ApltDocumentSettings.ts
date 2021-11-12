import { IsNumber } from '@jovotech/output';

export class ApltDocumentSettings {
  @IsNumber()
  idleTimeout!: number;
}
