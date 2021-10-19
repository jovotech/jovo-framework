import { NormalizedOutputTemplatePlatforms } from './NormalizedOutputTemplatePlatforms';
import { DenormalizePlatformOutputTemplate } from './PlatformOutputTemplate';

// Construct an object-type that has the same keys as NormalizedOutputTemplatePlatforms but every value is denormalized
export type OutputTemplatePlatforms = {
  [P in keyof NormalizedOutputTemplatePlatforms]:
    | DenormalizePlatformOutputTemplate<Exclude<NormalizedOutputTemplatePlatforms[P], undefined>>
    | undefined;
};
