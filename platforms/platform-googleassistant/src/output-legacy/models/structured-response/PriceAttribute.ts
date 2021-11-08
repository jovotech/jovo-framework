import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Money } from './Money';

export enum State {
  Unspecified = 'STATE_UNSPECIFIED',
  Estimate = 'ESTIMATE',
  Actual = 'ACTUAL',
}

// TODO: check type of 'type'. In the docs it was described as enum but the link to the enum is broken.
export class PriceAttribute {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsEnum(State)
  state!: State;

  @IsBoolean()
  taxIncluded!: boolean;

  @ValidateNested()
  @Type(() => Money)
  amount!: Money;
}
