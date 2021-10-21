import { IsOptional, Type, ValidateNested, IsString } from '@jovotech/output';
import { Session } from './Session';
import { User } from './User';

export class Request {
  @IsOptional()
  @IsString()
  id?: string;
}

export class Context {
  @ValidateNested()
  @Type(() => Request)
  request: Request;

  @ValidateNested()
  @Type(() => Session)
  session: Session;

  @ValidateNested()
  @Type(() => User)
  user: User;
}
