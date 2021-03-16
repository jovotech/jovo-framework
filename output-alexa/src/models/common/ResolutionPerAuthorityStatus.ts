import { IsEnum } from '@jovotech/output';

export enum ResolutionPerAuthorityStatusCode {
  SuccessMatch = 'ER_SUCCESS_MATCH',
  SuccessNoMatch = 'ER_SUCCESS_NO_MATCH',
  ErrorTimeout = 'ER_ERROR_TIMEOUT',
  ErrorException = 'ER_ERROR_EXCEPTION',
}

export class ResolutionPerAuthorityStatus {
  @IsEnum(ResolutionPerAuthorityStatusCode)
  code: ResolutionPerAuthorityStatusCode;
}
