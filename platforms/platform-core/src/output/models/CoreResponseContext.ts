import { IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { CoreResponseUser } from './CoreResponseUser';
import { Session } from './Session';

export class Request {
  @IsOptional()
  @IsString()
  id?: string;
}

export class CoreResponseContext {
  @ValidateNested()
  @Type(() => Request)
  request!: Request;

  @ValidateNested()
  @Type(() => Session)
  session!: Session;

  @ValidateNested()
  @Type(() => CoreResponseUser)
  user!: CoreResponseUser;
}
