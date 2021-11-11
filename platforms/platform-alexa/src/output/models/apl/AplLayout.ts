import { AnyObject } from '@jovotech/framework';
import {
  IsArray,
  IsEitherValid,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStringOrInstance,
  Type,
} from '@jovotech/output';
import { AplParameter } from './AplParameter';

export class AplLayout {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsEitherValid<AplLayout>({
    keys: ['item', 'items'],
  })
  item?: AnyObject;
  @IsEitherValid<AplLayout>({
    keys: ['item', 'items'],
  })
  items?: AnyObject[];

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(AplParameter, { each: true })
  @Type(() => AplParameter)
  parameters?: Array<AplParameter | string>;
}
