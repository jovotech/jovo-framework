import { ArrayMaxSize, ArrayMinSize, IsArray, Type, ValidateNested } from '@jovotech/output';
import { LineItem } from './LineItem';

export class Contents {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({
    each: true,
  })
  @Type(() => LineItem)
  lineItems: LineItem[];
}
