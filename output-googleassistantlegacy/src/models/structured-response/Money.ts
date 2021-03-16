import { IsString, IsNotEmpty, Length } from '@jovotech/output';

export class Money {
  @IsString()
  @Length(3, 3)
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  amountInMicros: string;
}
