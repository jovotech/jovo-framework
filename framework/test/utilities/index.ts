import { Logger } from '../../src';

Logger.level = 'silent';

export function delay(amountInMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, amountInMs);
  });
}

export * from './component';
export * from './extensible';
export * from './platform';
export * from './plugin';
export * from './server';
