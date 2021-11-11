import { Browser as SupportedBrowser, detect, OperatingSystem } from 'detect-browser';

export type Browser = SupportedBrowser | 'brave';

export interface CustomBrowserInfo {
  readonly type: 'browser';
  readonly name: Browser;
  readonly version: string;
  readonly os: OperatingSystem | null;
}

export class BrowserDetector {
  static detect(): CustomBrowserInfo | null {
    if (!this.detectedData) {
      const detectedData = detect() as CustomBrowserInfo | null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (detectedData?.name === 'chrome' && (navigator as any).brave) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (detectedData as any).name = 'brave';
      }

      this.detectedData = detectedData;
    }
    return this.detectedData;
  }

  static isChrome(): boolean {
    const detectedData = this.detectedData || this.detect();
    if (!detectedData) {
      return false;
    }
    return detectedData.name === 'chrome';
  }
  private static detectedData: CustomBrowserInfo | null = null;
}
