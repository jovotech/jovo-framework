import { BodyTemplate1 } from '../../src/response/visuals/BodyTemplate1';
import { Template } from '../../src/response/visuals/Template';
import { BodyTemplate2 } from '../../src/response/visuals/BodyTemplate2';
import { BodyTemplate3 } from '../../src/response/visuals/BodyTemplate3';
import { BodyTemplate6 } from '../../src/response/visuals/BodyTemplate6';
import { BodyTemplate7 } from '../../src/response/visuals/BodyTemplate7';
import { ListItem, ListTemplate1 } from '../../src/response/visuals/ListTemplate1';
import { ListTemplate2 } from '../../src/response/visuals/ListTemplate2';
import { ListTemplate3 } from '../../src/response/visuals/ListTemplate3';

process.env.NODE_ENV = 'TEST';

class TemplateImpl extends Template {
  constructor() {
    super('TemplateImpl');
  }
}

test('test setToken', () => {
  const template = new TemplateImpl().setToken('token');
  expect(template.token).toBe('token');
});

test('test setTitle', () => {
  const template = new TemplateImpl().setTitle('title');
  expect(template.title).toBe('title');
});

test('test setBackButton', () => {
  const template = new TemplateImpl().setBackButton('HIDDEN');
  expect(template.backButton).toBe('HIDDEN');

  const template2 = new TemplateImpl().setBackButton('VISIBLE');
  expect(template2.backButton).toBe('VISIBLE');

  const template3 = new TemplateImpl();
  expect(() => template3.setBackButton('FOOBAR')).toThrow('Invalid visibility type');
});
test('test showBackButton', () => {
  const template = new TemplateImpl().showBackButton();
  expect(template.backButton).toBe('VISIBLE');
});

test('test hideBackButton', () => {
  const template = new TemplateImpl().hideBackButton();
  expect(template.backButton).toBe('HIDDEN');
});

test('test setBackgroundImage', () => {
  const template = new TemplateImpl().setBackgroundImage('url');
  expect(template.backgroundImage).toEqual({
    sources: [
      {
        url: 'url',
      },
    ],
  });
});

test('test makeRichText', () => {
  expect(Template.makeRichText('Foo')).toEqual({
    type: 'RichText',
    text: 'Foo',
  });

  const richText = {
    type: 'RichText',
    text: 'Foo',
  };
  expect(Template.makeRichText(richText)).toEqual(richText);
});

test('test makePlainText', () => {
  expect(Template.makePlainText('Foo')).toEqual({
    type: 'PlainText',
    text: 'Foo',
  });

  const plainText = {
    type: 'PlainText',
    text: 'Foo',
  };
  expect(Template.makePlainText(plainText)).toEqual(plainText);
});

test('test makeTextContent', () => {
  expect(Template.makeTextContent('Foo')).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Foo',
    },
  });

  expect(
    Template.makeTextContent({
      type: 'RichText',
      text: 'Foo',
    }),
  ).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Foo',
    },
  });

  expect(
    Template.makeTextContent({
      type: 'PlainText',
      text: 'Foo',
    }),
  ).toEqual({
    primaryText: {
      type: 'PlainText',
      text: 'Foo',
    },
  });

  // with secondaryText

  expect(Template.makeTextContent('Foo', 'Bar')).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Foo',
    },
    secondaryText: {
      type: 'RichText',
      text: 'Bar',
    },
  });

  expect(
    Template.makeTextContent(
      {
        type: 'PlainText',
        text: 'Foo',
      },
      {
        type: 'PlainText',
        text: 'Bar',
      },
    ),
  ).toEqual({
    primaryText: {
      type: 'PlainText',
      text: 'Foo',
    },
    secondaryText: {
      type: 'PlainText',
      text: 'Bar',
    },
  });

  // with tertiaryText

  expect(Template.makeTextContent('Foo', 'Bar', 'FooBar')).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Foo',
    },
    secondaryText: {
      type: 'RichText',
      text: 'Bar',
    },
    tertiaryText: {
      type: 'RichText',
      text: 'FooBar',
    },
  });

  expect(
    Template.makeTextContent(
      {
        type: 'RichText',
        text: 'Foo',
      },
      {
        type: 'RichText',
        text: 'Bar',
      },
      {
        type: 'RichText',
        text: 'FooBar',
      },
    ),
  ).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Foo',
    },
    secondaryText: {
      type: 'RichText',
      text: 'Bar',
    },
    tertiaryText: {
      type: 'RichText',
      text: 'FooBar',
    },
  });
});

test('test makeImage', () => {
  expect(Template.makeImage('url')).toEqual({
    sources: [
      {
        url: 'url',
      },
    ],
  });

  expect(Template.makeImage('url', 'description')).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });

  // ImageShort object

  expect(Template.makeImage({ url: 'url' })).toEqual({
    sources: [
      {
        url: 'url',
      },
    ],
  });

  expect(Template.makeImage({ url: 'url', description: 'description' })).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });

  // Image object

  expect(
    Template.makeImage({
      contentDescription: 'description',
      sources: [
        {
          url: 'url',
        },
      ],
    }),
  ).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });
});

test('test BodyTemplate1', () => {
  const bodyTemplate1 = new BodyTemplate1();
  bodyTemplate1.setTextContent('Hello World');

  expect(bodyTemplate1.type).toBe('BodyTemplate1');
  expect(bodyTemplate1.textContent).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Hello World',
    },
  });
});

test('test BodyTemplate2', () => {
  const bodyTemplate2 = new BodyTemplate2();
  expect(bodyTemplate2.type).toBe('BodyTemplate2');
  bodyTemplate2.setTextContent('Hello World');
  bodyTemplate2.setImage('url', 'description');

  expect(bodyTemplate2.textContent).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Hello World',
    },
  });
  expect(bodyTemplate2.image).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });

  bodyTemplate2.setRightImage('url2');
  expect(bodyTemplate2.image).toEqual({
    sources: [
      {
        url: 'url2',
      },
    ],
  });
});

test('test BodyTemplate3', () => {
  const bodyTemplate3 = new BodyTemplate3();
  bodyTemplate3.setTextContent('Hello World');
  bodyTemplate3.setImage('url', 'description');
  expect(bodyTemplate3.type).toBe('BodyTemplate3');

  expect(bodyTemplate3.textContent).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Hello World',
    },
  });
  expect(bodyTemplate3.image).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });

  bodyTemplate3.setLeftImage('url2');
  expect(bodyTemplate3.image).toEqual({
    sources: [
      {
        url: 'url2',
      },
    ],
  });
});
test('test BodyTemplate6', () => {
  const bodyTemplate6 = new BodyTemplate6();
  bodyTemplate6.setTextContent('Hello World');
  bodyTemplate6.setFullScreenImage('url', 'description');
  expect(bodyTemplate6.type).toBe('BodyTemplate6');

  expect(bodyTemplate6.textContent).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Hello World',
    },
  });
  expect(bodyTemplate6.backgroundImage).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });
});
test('test BodyTemplate7', () => {
  const bodyTemplate7 = new BodyTemplate7();
  bodyTemplate7.setTextContent('Hello World');
  bodyTemplate7.setFullScreenImage('url', 'description');
  bodyTemplate7.setImage('url2', 'description2');
  expect(bodyTemplate7.type).toBe('BodyTemplate7');

  expect(bodyTemplate7.textContent).toEqual({
    primaryText: {
      type: 'RichText',
      text: 'Hello World',
    },
  });
  expect(bodyTemplate7.backgroundImage).toEqual({
    contentDescription: 'description',
    sources: [
      {
        url: 'url',
      },
    ],
  });
  expect(bodyTemplate7.image).toEqual({
    contentDescription: 'description2',
    sources: [
      {
        url: 'url2',
      },
    ],
  });
});

test('test ListTemplate1', () => {
  const listTemplate1 = new ListTemplate1();
  listTemplate1.addItem(
    'token',
    { contentDescription: 'desc', sources: [{ url: 'image_url' }] },
    'primaryText',
    'secondaryText',
    'tertiaryText',
  );

  expect(listTemplate1.type).toBe('ListTemplate1');
  expect(listTemplate1.listItems[0]).toStrictEqual({
    token: 'token',
    image: {
      contentDescription: 'desc',
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
  listTemplate1.listItems = [];

  // Test addItem with no image
  listTemplate1.addItem('token', undefined, 'primaryText', 'secondaryText', 'tertiaryText');

  expect(listTemplate1.type).toBe('ListTemplate1');
  expect(listTemplate1.listItems[0]).toStrictEqual({
    token: 'token',
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
  listTemplate1.listItems = [];

  const listItem: ListItem = {
    token: 'token',
    image: {
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  };

  listTemplate1.addItem(listItem);
  expect(listTemplate1.listItems[0]).toStrictEqual({
    token: 'token',
    image: {
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });

  listTemplate1.listItems = [];
  // setItems
  listTemplate1.setItems([
    {
      token: 'token',
      image: {
        sources: [
          {
            url: 'image_url',
          },
        ],
      },
      textContent: {
        primaryText: {
          type: 'RichText',
          text: 'primaryText',
        },
        secondaryText: {
          type: 'RichText',
          text: 'secondaryText',
        },
        tertiaryText: {
          type: 'RichText',
          text: 'tertiaryText',
        },
      },
    },
  ]);
  expect(listTemplate1.listItems[0]).toStrictEqual({
    token: 'token',
    image: {
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
});

test('test ListTemplate2', () => {
  // same test as in ListTemplate 1
  const listTemplate2 = new ListTemplate2();
  listTemplate2.addItem(
    'token',
    { contentDescription: 'desc', sources: [{ url: 'image_url' }] },
    'primaryText',
    'secondaryText',
    'tertiaryText',
  );

  expect(listTemplate2.type).toBe('ListTemplate2');
  expect(listTemplate2.listItems[0]).toStrictEqual({
    token: 'token',
    image: {
      contentDescription: 'desc',
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
  listTemplate2.listItems = [];

  // ensure an error is thrown if image isn't passed in (it's required for ListTemplate2)
  expect(() => listTemplate2.addItem('token', undefined, 'primaryText')).toThrow('Image is needed');

  // setItems
  listTemplate2.setItems([
    {
      token: 'token',
      image: {
        sources: [
          {
            url: 'image_url',
          },
        ],
      },
      textContent: {
        primaryText: {
          type: 'RichText',
          text: 'primaryText',
        },
        secondaryText: {
          type: 'RichText',
          text: 'secondaryText',
        },
        tertiaryText: {
          type: 'RichText',
          text: 'tertiaryText',
        },
      },
    },
  ]);
  expect(listTemplate2.listItems[0]).toStrictEqual({
    token: 'token',
    image: {
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
});

test('test ListTemplate3', () => {
  // same test as in ListTemplate 1
  const listTemplate3 = new ListTemplate3();
  listTemplate3.addItem(
    'token',
    { contentDescription: 'desc', sources: [{ url: 'image_url' }] },
    'primaryText',
    'secondaryText',
    'tertiaryText',
  );

  expect(listTemplate3.type).toBe('ListTemplate3');
  expect(listTemplate3.listItems[0]).toEqual({
    token: 'token',
    image: {
      contentDescription: 'desc',
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
  listTemplate3.listItems = [];
  // setItems
  listTemplate3.setItems([
    {
      token: 'token',
      image: {
        sources: [
          {
            url: 'image_url',
          },
        ],
      },
      textContent: {
        primaryText: {
          type: 'RichText',
          text: 'primaryText',
        },
        secondaryText: {
          type: 'RichText',
          text: 'secondaryText',
        },
        tertiaryText: {
          type: 'RichText',
          text: 'tertiaryText',
        },
      },
    },
  ]);
  expect(listTemplate3.listItems[0]).toEqual({
    token: 'token',
    image: {
      sources: [
        {
          url: 'image_url',
        },
      ],
    },
    textContent: {
      primaryText: {
        type: 'RichText',
        text: 'primaryText',
      },
      secondaryText: {
        type: 'RichText',
        text: 'secondaryText',
      },
      tertiaryText: {
        type: 'RichText',
        text: 'tertiaryText',
      },
    },
  });
});
