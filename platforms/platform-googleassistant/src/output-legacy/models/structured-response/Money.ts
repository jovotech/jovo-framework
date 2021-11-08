import { IsString, IsNotEmpty, Length } from '@jovotech/output';
import { CURRENCY_CODE_LENGTH } from '../../constants';

export class Money {
  @IsString()
  @Length(CURRENCY_CODE_LENGTH, CURRENCY_CODE_LENGTH)
  currencyCode!: string;

  @IsString()
  @IsNotEmpty()
  amountInMicros!: string;
}
