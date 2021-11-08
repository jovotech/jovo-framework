import { IsArray, IsInt, IsNotEmpty, IsString, Type, ValidateNested } from '@jovotech/output';
import { PriceAttribute } from './PriceAttribute';

export class ItemOption {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => PriceAttribute)
  prices!: PriceAttribute[];

  @IsString()
  @IsNotEmpty()
  note!: string;

  @IsInt()
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => ItemOption)
  subOptions!: ItemOption[];
}
