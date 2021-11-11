import {
  ArrayMaxSize,
  Equals,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { ADDRESS_COUNTRY_LENGTH, RECEIPT_TEMPLATE_ELEMENTS_MAX_SIZE } from '../../constants';
import { TemplateBase, TemplateType } from './Template';

export class ReceiptAddress {
  @IsString()
  @IsNotEmpty()
  street_1!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  street_2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  postal_code!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @Length(ADDRESS_COUNTRY_LENGTH)
  country!: string;
}

export class ReceiptSummary {
  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  shipping_cost?: number;

  @IsOptional()
  @IsNumber()
  total_tax?: number;

  @IsNumber()
  total_cost!: number;
}

export class ReceiptAdjustment {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  amount!: number;
}

export class ReceiptTemplateElement {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  currency?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}

export class ReceiptTemplate extends TemplateBase<TemplateType.Receipt | 'receipt'> {
  @Equals(TemplateType.Receipt)
  template_type!: TemplateType.Receipt | 'receipt';

  @IsOptional()
  @IsBoolean()
  sharable?: boolean;

  @IsString()
  @IsNotEmpty()
  recipient_name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  merchant_name?: string;

  @IsString()
  @IsNotEmpty()
  order_number!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  payment_method!: string;

  @IsOptional()
  @IsNumberString()
  timestamp?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(RECEIPT_TEMPLATE_ELEMENTS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => ReceiptTemplateElement)
  elements?: ReceiptTemplateElement[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ReceiptAddress)
  address?: ReceiptAddress;

  @ValidateNested()
  @Type(() => ReceiptSummary)
  summary!: ReceiptSummary;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiptAdjustment)
  adjustments?: ReceiptAdjustment[];
}
