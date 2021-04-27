export async function findAsync<T = unknown>(
  array: T[],
  callback: (item: T) => Promise<boolean> | boolean,
): Promise<T | undefined> {
  const returns = array.map(callback);
  const results = await Promise.all(returns);
  const index = results.findIndex((result) => result);
  return array[index];
}

export function forEachDeep<T = any>(
  value: T,
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
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      forEachDeep(value[key as keyof T], handler, path ? `${path}.${key}` : key);
    });
  }
}
