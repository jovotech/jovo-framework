import { BrowserDetector } from './BrowserDetector';

export class OperatingSystemDetector {
  static isWindows(): boolean {
    const detectedData = BrowserDetector.detect();
    if (!detectedData) {
      return false;
    }
    return !!detectedData.os?.startsWith('Window') && detectedData.os !== 'Windows Mobile';
  }
}
