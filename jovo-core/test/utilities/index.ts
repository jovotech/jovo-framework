export function delay(amountInMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, amountInMs);
  });
}

export * from './plugin';
export * from './extensible';
export * from './platform';
export * from './component';
