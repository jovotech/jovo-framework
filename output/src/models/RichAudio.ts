import { MessageValue, IsNotEmpty, IsNumber, IsEnum, IsString, IsUrl, Type, IsArray, TypeOptions } from '..';

export enum RichAudioType {
  Mixer = 'Mixer',
  Sequencer = 'Sequencer',
  Audio = 'Audio',
  Speech = 'Speech',
  Silence = 'Silence',
}

export class RichAudio {
  @IsEnum(RichAudioType)
  type!: string;
}

export const richAudioTypeDiscriminator: TypeOptions = {
  keepDiscriminatorProperty: true,
  discriminator: {
    property: 'type',
    subTypes: [],
  },
};

export class Mixer extends RichAudio {
  type!: 'Mixer';

  @IsArray()
  @IsNotEmpty()
  @Type(() => RichAudio, richAudioTypeDiscriminator)
  items!: RichAudio[];
}

export class Sequencer extends RichAudio {
  type!: 'Sequencer';

  @IsArray()
  @IsNotEmpty()
  @Type(() => RichAudio, richAudioTypeDiscriminator)
  items!: RichAudio[];
}

export class Audio extends RichAudio {
  type!: 'Audio';

  @IsNotEmpty()
  @IsUrl()
  source!: string;
}

export class Speech extends RichAudio {
  type!: 'Speech';

  @IsNotEmpty()
  @IsString()
  content!: MessageValue;
}

export class Silence extends RichAudio {
  type!: 'Silence';

  @IsNotEmpty()
  @IsNumber()
  duration!: number;
}

if (richAudioTypeDiscriminator.discriminator) {
  richAudioTypeDiscriminator.discriminator.subTypes = [
    { value: Mixer, name: 'Mixer' },
    { value: Sequencer, name: 'Sequencer' },
    { value: Audio, name: 'Audio' },
    { value: Speech, name: 'Speech' },
    { value: Silence, name: 'Silence' },
  ];
}
