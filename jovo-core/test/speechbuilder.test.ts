import { SpeechBuilder } from '../src';

test('is empty on initiation', () => {
    const sb = new SpeechBuilder();
    expect(sb.toString()).toBe('');
});

test('is ssml string with <speak> tags', () => {
    const ssmlString = SpeechBuilder.toSSML('test');
    expect(ssmlString).toBe('<speak>test</speak>');
});

test('is ssml string without duplicate <speak> tags', () => {
    const ssmlString = SpeechBuilder.toSSML('<speak>test</speak>');
    expect(ssmlString).toBe('<speak>test</speak>');
});

test('setProsody', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addText('text1').addText('text2').setProsody({rate: 'fast'});
    expect(speechBuilder.toString()).toBe('<prosody rate="fast">text1 text2</prosody>');

    // order shouldn't matter
    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.setProsody({rate: 'fast'}).addText('text1').addText('text2');
    expect(speechBuilder2.toString()).toBe('<prosody rate="fast">text1 text2</prosody>');
});

test('addText', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addText('text1');
    expect(speechBuilder.toString()).toBe('text1');
    speechBuilder.addText('text2');
    expect(speechBuilder.toString()).toBe('text1 text2');

    // test variation
    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addText([ 'text1', 'text2' ]);
    expect(speechBuilder2.toString()).toMatch(/^(text1|text2)/);

    // test variation
    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addText('text1', false);
    expect(speechBuilder3.toString()).toBe('');
    speechBuilder3.addText('text2', true);
    expect(speechBuilder3.toString()).toBe('text2');

    const speechBuilder4 = new SpeechBuilder();
    speechBuilder4.addText('text1', true, 0.0);
    expect(speechBuilder4.toString()).toBe('');
    speechBuilder4.addText('text1', true, 1.0);
    expect(speechBuilder4.toString()).toBe('text1');

    const speechBuilder5 = new SpeechBuilder();
    speechBuilder5.addText('text1', true, 1.0, {
        prosody: {
            pitch: '+1st',
            rate: 'fast',
        },
    });
    expect(speechBuilder5.toString()).toBe('<prosody pitch="+1st" rate="fast">text1</prosody>');

    const speechBuilder6 = new SpeechBuilder();
    speechBuilder6.addText('text1', true, 1.0, {
        emphasis: {
            level: 'moderate',
        },
        prosody: {
            rate: 'fast',
        },
    });
    expect(speechBuilder6.toString()).toBe('<prosody rate="fast"><emphasis level="moderate">text1</emphasis></prosody>');
});

test('addBreak', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addBreak('300ms');
    expect(speechBuilder.toString()).toBe('<break time="300ms"/>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addBreak('x-weak');
    expect(speechBuilder2.toString()).toBe('<break strength="x-weak"/>');

    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addBreak([ '300ms', '1s' ]);
    const regex = /<break time="(300ms|1s)"\/>/;
    expect(speechBuilder3.toString()).toMatch(regex);
});


test('addSentence', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addSentence('This is a sentence');
    expect(speechBuilder.toString()).toBe('<s>This is a sentence</s>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addSentence([ 'sentence1', 'sentence2' ]);
    const regex = /<s>(sentence1|sentence2)<\/s>/;

    expect(speechBuilder2.toString()).toMatch(regex);

});

test('addSayAsCardinal', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addSayAsCardinal(10);
    expect(speechBuilder.toString()).toBe('<say-as interpret-as="cardinal">10</say-as>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addCardinal(10);
    expect(speechBuilder2.toString()).toBe('<say-as interpret-as="cardinal">10</say-as>');

    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addSayAsCardinal([ 10, 20 ]);
    const regex = /<say-as interpret-as="cardinal">(10|20)<\/say-as>/;
    expect(speechBuilder3.toString()).toMatch(regex);

});

test('addSayAsOrdinal', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addSayAsOrdinal(10);
    expect(speechBuilder.toString()).toBe('<say-as interpret-as="ordinal">10</say-as>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addOrdinal(10);
    expect(speechBuilder2.toString()).toBe('<say-as interpret-as="ordinal">10</say-as>');

    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addSayAsOrdinal([ 10, 20 ]);
    const regex = /<say-as interpret-as="ordinal">(10|20)<\/say-as>/;
    expect(speechBuilder3.toString()).toMatch(regex);

});

test('addSayAsCharacters', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addSayAsCharacters('abc');
    expect(speechBuilder.toString()).toBe('<say-as interpret-as="characters">abc</say-as>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addCharacters('abc');
    expect(speechBuilder2.toString()).toBe('<say-as interpret-as="characters">abc</say-as>');

    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addCharacters([ 'abc', 'def' ]);
    const regex = /<say-as interpret-as="characters">(abc|def)<\/say-as>/;
    expect(speechBuilder3.toString()).toMatch(regex);
});

test('addPhoneme', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addPhoneme('quote', '"kvo:t@', 'x-sampa');
    expect(speechBuilder.toString()).toBe('<phoneme alphabet="x-sampa" ph="&quot;kvo:t@">quote</phoneme>');

    const speechBuilder2 = new SpeechBuilder();
    speechBuilder2.addPhoneme('quote', 'ˈkvoːtə');
    expect(speechBuilder2.toString()).toBe('<phoneme alphabet="ipa" ph="ˈkvoːtə">quote</phoneme>');


    const speechBuilder3 = new SpeechBuilder();
    speechBuilder3.addIpa('quote', 'ˈkvoːtə');
    expect(speechBuilder3.toString()).toBe('<phoneme alphabet="ipa" ph="ˈkvoːtə">quote</phoneme>');

    const speechBuilder4 = new SpeechBuilder();
    speechBuilder4.addXSampa('quote', '"kvo:t@');
    expect(speechBuilder4.toString()).toBe('<phoneme alphabet="x-sampa" ph="&quot;kvo:t@">quote</phoneme>');

});

test('test concatenation', () => {
    const speechBuilder = new SpeechBuilder();
    speechBuilder.addText('Hello');
    speechBuilder.addBreak('100ms');
    speechBuilder.addText('I am');
    speechBuilder.addSayAsOrdinal(20);
    speechBuilder.addText('years old');


    const expectedString = 'Hello <break time="100ms"/> I am <say-as interpret-as="ordinal">20</say-as> years old';
    expect(speechBuilder.toString()).toBe(expectedString);
});

test('test escapeXML', () => {
    expect(SpeechBuilder.escapeXml('<')).toBe('&lt;');
    expect(SpeechBuilder.escapeXml('>')).toBe('&gt;');
    expect(SpeechBuilder.escapeXml('&')).toBe('&amp;');
    expect(SpeechBuilder.escapeXml('"')).toBe('&quot;');
    expect(SpeechBuilder.escapeXml('\'')).toBe('&apos;');
    expect(SpeechBuilder.escapeXml('')).toBe('');
});

test('test build()', () => {
    const speechBuilder = new SpeechBuilder();
    expect(speechBuilder.build()).toBe('');
});
