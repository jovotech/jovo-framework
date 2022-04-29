import { IsOptional, Type, ValidateNested } from '@jovotech/output';
import { IsValidDirectivesArray } from '../decorators/validation/IsValidDirectivesArray';
import { AplaRenderDocumentDirective } from './apla/AplaRenderDocumentDirective';
import { OutputSpeech } from './common/OutputSpeech';
import { Directive } from './Directive';

export class Reprompt {
  @IsOptional()
  @ValidateNested()
  @Type(() => OutputSpeech)
  outputSpeech?: OutputSpeech;

  @IsOptional()
  @IsValidDirectivesArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Directive, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: AplaRenderDocumentDirective, name: 'Alexa.Presentation.APLA.RenderDocument' },
      ],
    },
  })
  directives?: Directive[];
}
