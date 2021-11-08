import { IsISO8601 } from '@jovotech/output';

export class Time {
  @IsISO8601()
  timeIso8601!: string;
}
