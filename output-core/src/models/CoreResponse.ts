import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  JovoResponse,
  OutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Context } from './Context';
import { Session } from './Session';
import { User } from './User';

// TODO: Find better names for output and repromptOutputs!
export class CoreResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutputTemplate)
  output: OutputTemplate[];

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;

  @ValidateNested()
  @Type(() => Session)
  session: Session;

  @ValidateNested()
  @Type(() => Context)
  context: Context;
}
