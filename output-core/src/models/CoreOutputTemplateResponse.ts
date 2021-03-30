import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  JovoResponse,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { TransformAction } from '../decorators/transformation/TransformAction';
import { Action } from './action/Action';
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
  @IsArray()
  @ValidateNested({ each: true })
  @TransformAction()
  actions?: Action[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @TransformAction()
  reprompts?: Action[];

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
