import { ArrayMaxSize, ArrayMinSize, IsArray, Type, ValidateNested } from '@jovotech/output';
import { CONTENTS_MAX_SIZE, CONTENTS_MIN_SIZE } from '../../constants';
import { LineItem } from './LineItem';

export class Contents {
  @IsArray()
  @ArrayMinSize(CONTENTS_MIN_SIZE)
  @ArrayMaxSize(CONTENTS_MAX_SIZE)
  @ValidateNested({
    each: true,
  })
  @Type(() => LineItem)
  lineItems!: LineItem[];
}
