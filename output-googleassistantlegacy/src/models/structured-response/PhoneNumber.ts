import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from '@jovotech/output';

export class PhoneNumber {
  @IsPhoneNumber(null)
  e164PhoneNumber: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  extension?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  preferredDomesticCarrierCode?: string;
}
