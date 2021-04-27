import { BaseOutput, OutputConstructor } from '../BaseOutput';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Output<OUTPUT extends BaseOutput = BaseOutput>(
  name?: string,
): (target: OutputConstructor<OUTPUT>) => void {
  return function (target) {
    MetadataStorage.getInstance().addOutputMetadata(target, name || target.name);
    return;
  };
}
