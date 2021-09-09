import { JovoUser } from '..';
import { TestJovo } from './TestJovo';

export class TestUser extends JovoUser<TestJovo> {
  id = 'TestUser';
}
