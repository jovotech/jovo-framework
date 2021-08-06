import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  OutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Context } from './Context';
import { CoreResponse } from './CoreResponse';
import { Session } from './Session';
import { User } from './User';

export class CoreOutputTemplateResponse implements Partial<CoreResponse> {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutputTemplate)
  output?: OutputTemplate[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutputTemplate)
  repromptOutput?: OutputTemplate[];

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;

  @IsOptional()
  @ValidateNested()
  @Type(() => Session)
  session?: Session;

  @IsOptional()
  @ValidateNested()
  @Type(() => Context)
  context?: Context;
}
