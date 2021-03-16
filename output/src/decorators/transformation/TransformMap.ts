import { plainToClass, Transform } from '../..';

export function TransformMap<T extends Record<string, unknown>>(
  type: new () => T,
): PropertyDecorator {
  return Transform(({ value }) => {
    const result: Record<string, T> = {};
    const entries = Object.entries<T>(value);
    for (let i = 0, len = entries.length; i < len; i++) {
      const [key, obj] = entries[i];
      result[key] = plainToClass<T, T>(type, obj);
    }
    return result;
  }) as PropertyDecorator;
}
