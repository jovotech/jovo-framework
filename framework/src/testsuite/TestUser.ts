import { JovoUser } from '..';
import { TestJovo } from './TestJovo';

export class TestUser extends JovoUser<TestJovo> {
  get id(): string | undefined {
    return this.jovo?.$request?.userId;
  }
}
