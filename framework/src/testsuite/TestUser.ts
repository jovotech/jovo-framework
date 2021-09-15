import { JovoUser } from '..';
import { TestJovo } from './TestJovo';

export class TestUser extends JovoUser<TestJovo> {
  get id(): string {
    return this.jovo?.$request?.userId || 'TestUser';
  }
}
