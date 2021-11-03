import { Type, ValidateNested } from '@jovotech/output';
import { Oauth } from './Oauth';

export class AuthenticationRequest {
  @ValidateNested()
  @Type(() => Oauth)
  oauth: Oauth;
}
