# Alexa Visual Output

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-alexa/interfaces/visual-output

Learn more about how to build Alexa Skills with visual output using the Jovo Framework.

* [Introduction to Alexa Visual Output](#introduction-to-alexa-visual-output)
* [Cards](#cards)
  * [Simple Card](#simple-card)
  * [Standard Card](#standard-card)
* [Display Templates](#display-templates)
  * [Body Templates](#body-templates)
  * [List Templates](#body-templates)
* [Alexa Presentation Language](#alexa-presentation-language)
* [Video App Interface](#video-app-interface)

## Introduction to Visual Ouput

Visual output is used to describe or enhance the voice interaction. This ranges from simple [cards](#cards), Echo Show and Echo Spot [Display Templates](#display-templates) to displaying a [video](#video).

## Cards

Cards are used for the most basic cases of visual output. They can be used to display plain text and images or to ask for certain permissions (Account Linking, to-do/shopping lists, etc.) in addition to the speech output.

```javascript
// @language=javascript

this.$alexaSkill.showStandardCard('Hello World', 'This is a standard card');

this.tell('I added a card to the response!');

// @language=typescript

this.$alexaSkill!.showStandardCard('Hello World', 'This is a standard card');

this.tell('I added a card to the response!');
```

### Simple Card

The simple card can only contain plain text, which is split up into a title and content.

```javascript
// @language=javascript

this.$alexaSkill.showSimpleCard('Title', 'Content');

// or

this.$alexaSkill.showCard(
    new AlexaSkill.SimpleCard()
        .setTitle('Title')
        .setContent('Content')
);

// @language=typescript

this.$alexaSkill!.showSimpleCard('Title', 'Content');

// or

this.$alexaSkill!.showCard(
    new AlexaSkill.SimpleCard()
        .setTitle('Title')
        .setContent('Content')
);
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#creating-a-basic-home-card-to-display-text).


### Standard Card

The standard card allows you to add an image in addition to the plain text, which has to be provided in two different sizes.

```javascript
// @language=javascript

this.$alexaSkill.showStandardCard('Title', 'Content', {
    smallImageUrl: 'https://via.placeholder.com/720x480',
    largeImageUrl: 'https://via.placeholder.com/1200x800',
});

// or

this.$alexaSkill.showCard(
    new AlexaSkill.StandardCard()
        .setTitle('Title')
        .setText('Text')
        .setSmallImageUrl('https://via.placeholder.com/720x480')
        .setLargeImageUrl('https://via.placeholder.com/1200x800')
);

// @language=typescript

this.$alexaSkill!.showStandardCard('Title', 'Content', {
    smallImageUrl: 'https://via.placeholder.com/720x480',
    largeImageUrl: 'https://via.placeholder.com/1200x800',
});

// or

this.$alexaSkill!.showCard(
    new AlexaSkill.StandardCard()
        .setTitle('Title')
        .setText('Text')
        .setSmallImageUrl('https://via.placeholder.com/720x480')
        .setLargeImageUrl('https://via.placeholder.com/1200x800')
);
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#creating-a-home-card-to-display-text-and-an-image).


## Display Templates

Display Templates can be used to include content on the screen of the Echo Show or Spot. There is a variety of templates, each having a different composition and features. You can find the
[official Amazon reference here](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html).

To be able to use display templates for devices like Echo Show, add the following configurations to your `project.js`:

```js
alexaSkill: {
  manifest: {
    apis: {
        custom: {
            interfaces: [
                {
                    type: 'RENDER_TEMPLATE'
                }
            ]
        }
    }
  }
}
```

Then, use the Jovo CLI to deploy to the Amazon Developer Portal:

```sh
# Build platforms folder
$ jovo3 build

# Upload to Alexa
$ jovo3 deploy
```

Alternatively, you can enable it in the Interfaces tab in the Amazon Developer Console:

![Alexa Console: Enable Display Interface](../../img/alexa-enable-display-interface.jpg)

You can check whether the current device supports the Display interface using the following helper method:

```js
// @language=javascript
this.$alexaSkill.$request.hasDisplayInterface();

// @language=typescript
this.$alexaSkill?.$request?.hasDisplayInterface();
```

### Body Templates

Body templates are only capable of displaying images and text. There are multiple body templates, each having a different composition.

[BodyTemplate1](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate1-for-simple-text-and-image-views):

```javascript
// @language=javascript

let bodyTemplate1 = this.$alexaSkill.templateBuilder('BodyTemplate1');

bodyTemplate1.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text');

this.$alexaSkill.showDisplayTemplate(bodyTemplate1);

// @language=typescript

let bodyTemplate1 = this.$alexaSkill!.templateBuilder('BodyTemplate1');

bodyTemplate1.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text');

this.$alexaSkill!.showDisplayTemplate(bodyTemplate1);
```

[BodyTemplate2](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate2-for-image-views-and-limited-centered-text):

```javascript
// @language=javascript

let bodyTemplate2 = this.$alexaSkill.templateBuilder('BodyTemplate2');
bodyTemplate2.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text')
  .setRightImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.$alexaSkill.showDisplayTemplate(bodyTemplate2);

// @language=typescript

let bodyTemplate2 = this.$alexaSkill!.templateBuilder('BodyTemplate2');
bodyTemplate2.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text')
  .setRightImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.$alexaSkill!.showDisplayTemplate(bodyTemplate2);
```

[BodyTemplate3](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate3-for-image-views-and-limited-left-aligned-text):

```javascript
// @language=javascript

let bodyTemplate3 = this.$alexaSkill.templateBuilder('BodyTemplate3');

bodyTemplate3.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Text', 'Tertiary Text')
  .setLeftImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.$alexaSkill.showDisplayTemplate(bodyTemplate3);

// @language=typescript

let bodyTemplate3 = this.$alexaSkill!.templateBuilder('BodyTemplate3');

bodyTemplate3.setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Text', 'Tertiary Text')
  .setLeftImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.$alexaSkill!.showDisplayTemplate(bodyTemplate3);
```

[BodyTemplate6](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate6-for-text-and-optional-background-image):

```javascript
// @language=javascript

let bodyTemplate6 = this.$alexaSkill.templateBuilder('BodyTemplate6');

bodyTemplate6.setToken('token')
  .setTextContent('Primary Text', 'Secondary Text', 'Tertiary Text')
  .setFullScreenImage({
    description: 'Description',
    url: 'https://via.placeholder.com/1200x1000',
});

this.$alexaSkill.showDisplayTemplate(bodyTemplate6);

// @language=typescript

let bodyTemplate6 = this.$alexaSkill!.templateBuilder('BodyTemplate6');

bodyTemplate6.setToken('token')
  .setTextContent('Primary Text', 'Secondary Text', 'Tertiary Text')
  .setFullScreenImage({
    description: 'Description',
    url: 'https://via.placeholder.com/1200x1000',
});

this.$alexaSkill!.showDisplayTemplate(bodyTemplate6);
```

### List Templates

The list template is used to display a set of scrollable and selectable items (text and images).

[ListTemplate1](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#listtemplate1-for-text-lists-and-optional-images):

```javascript
// @language=javascript

let listTemplate1 = this.$alexaSkill.templateBuilder('ListTemplate1');

listTemplate1.setTitle('Title')
  .setToken('token')
  .addItem(
    'token',
    {
      description: 'Description',
      url: 'https://via.placeholder.com/1200x1000',
    },
    'primary text',
    'secondary text',
    'tertiary text'
  ).addItem(
    'token',
    null,
    'primary text',
    'secondary text',
    'tertiary text'
  );

this.$alexaSkill.showDisplayTemplate(listTemplate1);

// @language=typescript

let listTemplate1 = this.$alexaSkill!.templateBuilder('ListTemplate1');

listTemplate1.setTitle('Title')
  .setToken('token')
  .addItem(
    'token',
    {
      description: 'Description',
      url: 'https://via.placeholder.com/1200x1000',
    },
    'primary text',
    'secondary text',
    'tertiary text'
  ).addItem(
    'token',
    null,
    'primary text',
    'secondary text',
    'tertiary text'
  );

this.$alexaSkill!.showDisplayTemplate(listTemplate1);
```

[ListTemplate2](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#listtemplate2-for-list-images-and-optional-text):

```javascript
// @language=javascript

let listTemplate2 = this.$alexaSkill.templateBuilder('ListTemplate2');

listTemplate2.setTitle('Title')
  .setToken('token')
  .addItem(
    'token',
    {
      description: 'Description',
      url: 'https://via.placeholder.com/1200x1000',
    },
    'primary text',
    'secondary text',
    'tertiary text'
  ).addItem(
    'token',
    null,
    'primary text',
    'secondary text',
    'tertiary text'
  );

this.$alexaSkill.showDisplayTemplate(listTemplate2);

// @language=typescript

let listTemplate2 = this.$alexaSkill!.templateBuilder('ListTemplate2');

listTemplate2.setTitle('Title')
  .setToken('token')
  .addItem(
    'token',
    {
      description: 'Description',
      url: 'https://via.placeholder.com/1200x1000',
    },
    'primary text',
    'secondary text',
    'tertiary text'
  ).addItem(
    'token',
    null,
    'primary text',
    'secondary text',
    'tertiary text'
  );

this.$alexaSkill!.showDisplayTemplate(listTemplate2);
```

## Alexa Presentation Language

> Tutorial: [Using the Alexa Presentation Language (APL) with Jovo](https://www.jovo.tech/tutorials/alexa-presentation-language)

With Jovo, you can also use the Alexa Presentation Language (APL). To add APL directives, use the following method:

```js
// @language=javascript

this.$alexaSkill.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: {},
        datasources: {},
});

// @language=typescript

this.$alexaSkill!.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: {},
        datasources: {},
});
```

You can either directly add documents and data sources, or require them from JSON files:

```js
// @language=javascript

// Example
ShowTemplateIntent() {
    // Retrieve document and data from folder
    this.$alexaSkill.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: require(`./path/to/document.json`),
            datasources: require(`./path/to/data-sources.json`),
    });

    this.tell(`Take a look.`);
},

// @language=typescript

// Example
ShowTemplateIntent() {
    // Retrieve document and data from folder
    this.$alexaSkill!.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: '1.0',
            document: require(`./path/to/document.json`),
            datasources: require(`./path/to/data-sources.json`),
    });

    this.tell(`Take a look.`);
},
```

To enable APL, add the following configurations to your `project.js`:

```js
alexaSkill: {
  manifest: {
    apis: {
        custom: {
            interfaces: [
                {
                    type: 'ALEXA_PRESENTATION_APL'
                }
            ]
        }
    }
  }
}
```

Then, use the Jovo CLI to deploy to the Amazon Developer Portal:

```sh
# Build platforms folder
$ jovo3 build

# Upload to Alexa
$ jovo3 deploy
```

You can check whether the current device supports the APL interface using the following helper method:

```js
// @language=javascript
this.$alexaSkill.$request.hasAPLInterface();
this.$alexaSkill.$request.hasAPLTInterface();

// @language=typescript
this.$alexaSkill?.$request?.hasAPLInterface();
this.$alexaSkill?.$request?.hasAPLTInterface();
```

## Video App Interface

To launch videos on an Echo Show you can use the `VideoApp` interface:

```javascript
// @language=javascript

this.$alexaSkill.showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');

// @language=typescript

this.$alexaSkill!.showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');
```

You can also optionally add a preamble message that Alexa will read before the video plays:

```javascript
// @language=javascript

this.$alexaSkill.showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');
this.tell('Get ready to watch your video!');

// @language=typescript

this.$alexaSkill!.showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle', 'Get ready to watch your video!');
this.tell('Get ready to watch your video!');
```

Find the [official Amazon reference here](https://developer.amazon.com/docs/custom-skills/videoapp-interface-reference.html).

To enable the video app interface, add the following configurations to your `project.js`:

```js
alexaSkill: {
  manifest: {
    apis: {
        custom: {
            interfaces: [
                {
                    type: 'VIDEO_APP'
                }
            ]
        }
    }
  }
}
```

Then, use the Jovo CLI to deploy to the Amazon Developer Portal:

```sh
# Build platforms folder
$ jovo3 build

# Upload to Alexa
$ jovo3 deploy
```