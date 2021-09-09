import { Jovo } from '..';
import { JovoDevice } from '../JovoDevice';
import { TestPlatform } from './TestPlatform';
import { TestRequest } from './TestRequest';
import { TestResponse } from './TestResponse';
import { TestUser } from './TestUser';

export class TestJovo extends Jovo<
  TestRequest,
  TestResponse,
  TestJovo,
  TestUser,
  JovoDevice<TestJovo>,
  TestPlatform
> {}
