import { IsEnum, IsNumber } from '@jovotech/output';

export enum Unit {
  Unspecified = 'UNIT_UNSPECIFIED',
  Milligram = 'MILLIGRAM',
  Gram = 'GRAM',
  Kilogram = 'KILOGRAM',
  Ounce = 'OUNCE',
  Pound = 'POUND',
}

export class MerchantUnitMeasure {
  @IsNumber()
  measure: number;

  @IsEnum(Unit)
  unit: Unit;
}
