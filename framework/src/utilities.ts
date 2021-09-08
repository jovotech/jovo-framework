// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function forEachDeep<T = any>(
  value: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (val: T[keyof T] | any, path: string) => void,
  path = '',
): void {
  if (path) {
    handler(value, path);
  }
  if (Array.isArray(value)) {
    value.forEach((val, index) => {
      forEachDeep(val, handler, `${path}[${index}]`);
    });
  } else if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      forEachDeep(value[key as keyof T], handler, path ? `${path}.${key}` : key);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMethodKeys<PROTOTYPE = any>(prototype: PROTOTYPE): Array<keyof PROTOTYPE> {
  return Object.getOwnPropertyNames(prototype).filter((key) => {
    if (key === 'constructor') {
      return false;
    }
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    return (
      typeof prototype[key as keyof PROTOTYPE] === 'function' &&
      typeof descriptor?.value === 'function'
    );
  }) as Array<keyof PROTOTYPE>;
}
