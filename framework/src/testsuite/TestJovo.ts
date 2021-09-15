import { Jovo } from '..';
import { TestDevice } from './TestDevice';
import { TestPlatform } from './TestPlatform';
import { TestRequest } from './TestRequest';
import { TestResponse } from './TestResponse';
import { TestUser } from './TestUser';

export class TestJovo extends Jovo<
  TestRequest,
  TestResponse,
  TestJovo,
  TestUser,
  TestDevice,
  TestPlatform
> {}
