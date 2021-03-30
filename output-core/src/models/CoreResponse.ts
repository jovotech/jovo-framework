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
import { Session } from './Session';
import { User } from './User';

export class CoreResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsArray()
  @ValidateNested({ each: true })
  @TransformAction()
  actions: Action[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @TransformAction()
  reprompts?: Action[];

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
