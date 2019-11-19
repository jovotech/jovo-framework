import { AskForPermissionsConsentCard } from './AskForPermissionsConsentCard';

export class AskForListPermissionsCard extends AskForPermissionsConsentCard {
  constructor(types?: string[]) {
    super();

    if (types) {
      const validTypes = ['read', 'write'];
      for (const type of types) {
        if (!validTypes.includes(type)) {
          throw new Error('Invalid permission type');
        }

        if (type === 'read') {
          this.addReadPermission();
        }

        if (type === 'write') {
          this.addWritePermission();
        }
      }
    }
  }
  /**
   * Adds read permission
   * @return {AskForListPermissionsCard}
   */
  addReadPermission(): this {
    this.addPermission('read::alexa:household:list');
    return this;
  }

  /**
   * Adds write permission
   * @return {AskForListPermissionsCard}
   */
  addWritePermission(): this {
    this.addPermission('write::alexa:household:list');
    return this;
  }

  /**
   * Adds read and write permission
   * @return {AskForListPermissionsCard}
   */
  addFullPermission(): this {
    this.addReadPermission();
    this.addWritePermission();
    return this;
  }
}
