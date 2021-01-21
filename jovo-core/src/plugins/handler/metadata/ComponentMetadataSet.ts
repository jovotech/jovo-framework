import { ComponentMetadata } from './ComponentMetadata';

export class ComponentMetadataSet extends Set<ComponentMetadata> {
  add(value: ComponentMetadata): this {
    if (this.has(value)) {
      return this;
    }
    return super.add(value);
  }

  delete(value: ComponentMetadata): boolean {
    if (!this.has(value)) {
      return false;
    }
    return super.delete(value);
  }

  has(value: ComponentMetadata): boolean {
    return Array.from(this.values()).some((metadata) => this.isSameMetadata(metadata, value));
  }

  private isSameMetadata(a: ComponentMetadata, b: ComponentMetadata) {
    return a.target === b.target;
  }
}
