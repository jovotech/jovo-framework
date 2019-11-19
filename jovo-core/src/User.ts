import { Jovo } from './Jovo';

export class User {
  new = true;
  jovo: Jovo;

  constructor(jovo: Jovo) {
    this.jovo = jovo;
  }

  /**
   * Returns user id
   * @returns {string | undefined}
   */
  getId(): string | undefined {
    return undefined;
  }

  /**
   * Returns true if user is new
   * @return {boolean}
   */
  isNew(): boolean {
    return this.new;
  }

  /**
   * Returns true if user is new
   * @return {boolean}
   */
  isNewUser(): boolean {
    return this.isNew();
  }

  /**
   * Returns user access token
   * @returns {string | undefined}
   */
  getAccessToken(): string | undefined {
    return undefined;
  }
}
