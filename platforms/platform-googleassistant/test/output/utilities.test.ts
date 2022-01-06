import { Sequencer, Audio, Speech, Mixer, Silence } from '@jovotech/output';
import { genRichAudioSSML, genRichAudioText } from '../../src/output/utilities';

describe('#genRichAudioSSML', () => {
  it('should generate SSML for audio after text', () => {
    expect(
      genRichAudioSSML({
        type: 'Sequencer',
        items: [
          {
            type: 'Speech',
            content: 'Text content',
          } as Speech,
          {
            type: 'Audio',
            source: 'https://audio.mp3',
          } as Audio,
        ],
      } as Sequencer),
    ).toBe(
      '<seq><media><p>Text content</p></media><media><audio src="https://audio.mp3" /></media></seq>',
    );
  });

  it('should generate SSML for audio before and after text', () => {
    const output = genRichAudioSSML({
      type: 'Sequencer',
      items: [
        {
          type: 'Mixer',
          items: [
            {
              type: 'Sequencer',
              items: [
                {
                  type: 'Silence',
                  duration: 400,
                } as Silence,
                {
                  type: 'Speech',
                  content: 'Text content',
                } as Speech,
              ],
            } as Sequencer,
            {
              type: 'Audio',
              source: 'https://end.audio.mp3',
            } as Audio,
          ],
        } as Mixer,
        {
          type: 'Audio',
          source: 'https://start.audio.mp3',
        } as Audio,
      ],
    } as Sequencer);

    const speech = `<seq><media><break time="400ms" /></media><media><p>Text content</p></media></seq>`;
    const endAudio = `<media><audio src="https://end.audio.mp3" /></media>`;
    const startAudio = `<media><audio src="https://start.audio.mp3" /></media>`;

    const innerMixer = `<par>${speech}${endAudio}</par>`;
    const outerSeq = `<seq>${innerMixer}${startAudio}</seq>`;

    expect(output).toBe(outerSeq);
  });
});

describe('#genRichAudioText', () => {
  it('should generate text only', () => {
    expect(
      genRichAudioText({
        type: 'Sequencer',
        items: [
          {
            type: 'Speech',
            content: 'Text content',
          } as Speech,
          {
            type: 'Audio',
            source: 'https://audio.mp3',
          } as Audio,
        ],
      } as Sequencer),
    ).toBe('Text content');
  });

  it('should generate text only with fullstop separators', () => {
    const output = genRichAudioText({
      type: 'Sequencer',
      items: [
        {
          type: 'Mixer',
          items: [
            {
              type: 'Sequencer',
              items: [
                {
                  type: 'Silence',
                  duration: 400,
                } as Silence,
                {
                  type: 'Speech',
                  content: 'Text content',
                } as Speech,
              ],
            } as Sequencer,
            {
              type: 'Audio',
              source: 'https://end.audio.mp3',
            } as Audio,
          ],
        } as Mixer,
        {
          type: 'Speech',
          content: 'Text content 2',
        } as Speech,
      ],
    } as Sequencer);

    expect(output).toBe(`Text content. Text content 2`);
  });
});
