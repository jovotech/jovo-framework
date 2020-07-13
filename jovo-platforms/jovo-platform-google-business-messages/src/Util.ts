export class Util {
  /**
   * Generates a random string [a-z][A-Z][0-9] with `length` number of characters.
   * @param {number} length
   */
  static generateRandomString(length: number) {
    let randomString = '';
    const stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));
    }

    return randomString;
  }
}
