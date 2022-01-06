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

export class Sequencer {
  type!: 'Sequencer';

  @IsArray()
  @IsNotEmpty()
  @Type(() => RichAudio, richAudioTypeDiscriminator)
  items!: RichAudio[];
}

export class Audio {
  type!: 'Audio';

  @IsNotEmpty()
  @IsUrl()
  source!: string;
}

export class Speech {
  type!: 'Speech';

  @IsNotEmpty()
  @IsString()
  content!: string;
}

export class Silence {
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
