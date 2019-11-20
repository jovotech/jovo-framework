import { Card } from './Card';

export class AskForPermissionsConsentCard extends Card {
  permissions: string[] = [];
  constructor() {
    super('AskForPermissionsConsent');
  }

  /**
   * Adds permission to array
   * @param {*} permission
   * @return {AskForPermissionsConsentCard}
   */
  addPermission(permission: string) {
    this.permissions.push(permission);
    return this;
  }

  /**
   * Sets permission array
   * @param {array} permissions
   * @return {AskForPermissionsConsentCard}
   */
  setPermissions(permissions: string[]) {
    this.permissions = permissions;
    return this;
  }
}
