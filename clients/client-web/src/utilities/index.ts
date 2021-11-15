export * from './AudioHelper';
export * from './Base64Converter';
export * from './BrowserDetector';
export * from './OperatingSystemDetector';

export function delay(amountInMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, amountInMs);
  });
}
