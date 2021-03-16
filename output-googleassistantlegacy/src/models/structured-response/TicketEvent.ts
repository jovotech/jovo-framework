import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { EventCharacter } from './EventCharacter';
import { Location } from './Location';
import { Time } from './Time';

// TODO check type of 'type' - docs did not provide possible enum-values
export class TicketEvent {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => EventCharacter)
  eventCharacters: EventCharacter[];

  @ValidateNested()
  @Type(() => Time)
  startDate: Time;

  @ValidateNested()
  @Type(() => Time)
  endDate: Time;

  @ValidateNested()
  @Type(() => Time)
  doorTime: Time;
}
