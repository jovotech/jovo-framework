import { IsNotEmpty, IsNumber, IsString, IsUrl, Type, IsArray, DiscriminatorDescriptor } from '..';

export class RichAudio {
  type!: string;
}

export const richAudioTypeDiscriminator: { discriminator: DiscriminatorDescriptor } = {
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
  content!: string;
}

export class Silence extends RichAudio {
  type!: 'Silence';

  @IsNotEmpty()
  @IsNumber()
  duration!: number;
}

richAudioTypeDiscriminator.discriminator.subTypes = [
  { value: Mixer, name: 'Mixer' },
  { value: Sequencer, name: 'Sequencer' },
  { value: Audio, name: 'Audio' },
  { value: Speech, name: 'Speech' },
  { value: Silence, name: 'Silence' },
];
