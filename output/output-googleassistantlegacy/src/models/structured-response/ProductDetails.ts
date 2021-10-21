import { IsNotEmpty, IsObject, IsOptional, IsString } from '@jovotech/output';

export class ProductDetails {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gtin?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  plu?: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsObject()
  productAttributes: Record<string, string | number>;
}
