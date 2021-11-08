import { IsNotEmpty, IsString } from '@jovotech/output';

export class Promotion {
  @IsString()
  @IsNotEmpty()
  coupon!: string;
}
