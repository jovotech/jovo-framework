import { IsBoolean, IsEnum } from '@jovotech/output';

export enum PresentationRequirement {
  Unspecified = 'REQUIREMENT_UNSPECIFIED',
  Optional = 'REQUIREMENT_OPTIONAL',
  Required = 'REQUIREMENT_REQUIRED',
}

export class DisclosurePresentationOptions {
  @IsEnum(PresentationRequirement)
  presentationRequirement: PresentationRequirement;

  @IsBoolean()
  initiallyExpanded: boolean;
}
