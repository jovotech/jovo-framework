import { IsBoolean, IsInt, IsUrl } from '@jovotech/output';

export class PurchaseReturnsInfo {
  @IsBoolean()
  isReturnable!: boolean;

  @IsInt()
  daysToReturn!: number;

  @IsUrl()
  policyUrl!: string;
}
