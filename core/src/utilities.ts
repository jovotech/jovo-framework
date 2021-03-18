export async function findAsync<T = unknown>(
  array: T[],
  callback: (item: T) => Promise<boolean> | boolean,
): Promise<T | undefined> {
  const returns = array.map(callback);
  const results = await Promise.all(returns);
  const index = results.findIndex((result) => result);
  return array[index];
}
