export class OutputHelpers {
  static randomize<T>(items: T[]): T | undefined {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
}
