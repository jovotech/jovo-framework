# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Visuals
Learn more about how to build Alexa Skills with visual output using the Jovo Framework.

* [Introduction to Visual Output](#introduction-to-visual-output)
* [Features](#features)
  * [Cards](#cards)
    * [Simple Card](#simple-card)
    * [Standard Card](#standard-card)
    * [Account Linking Card](#account-linking-card)
    * [Permission Card](#permission-card)
  * [Display Templates](#display-templates)
    * [Body Template](#body-template)
  * [Video](#video)

## Introduction to Visual Ouput

Visual output is used to describe or enhance the voice interaction. This ranges from simple [cards](#cards) with additional information to a [video](#video), but some of these features are only availabe for certain devises.

## Features

### Cards

Cards are used for the most basic cases of visual output. They can be used to display plain text and images or to ask for certain permissions (account linking, to-do/shopping lists, etc.) in addition to the speech output.

```javascript
this.alexaSkill().showStandardCard('Hello World', 'This is a standard card');

this.tell('I added a card to the response!');
```

#### Simple Card

The simple card can only contain plain text, which is split up into a title and content.

```javascript
this.alexaSkill().showSimpleCard('Title', 'Content');
// or
const {AlexaSkill} = require('jovo-framework');

this.alexaSkill().showCard(
    new SimpleCard()
        .setTitle('Title')
        .setContent('Content')
);
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#creating-a-basic-home-card-to-display-text)

#### Standard Card

The standard card allows you to add an image in addition to the plain text, which has to be provided in two different sizes.

```javascript
this.alexaSkill().showStandardCard('Title', 'Content', {
    smallImageUrl: 'https://via.placeholder.com/720x480',
    largeImageUrl: 'https://via.placeholder.com/1200x800',
});
// or
const {AlexaSkill} = require('jovo-framework');

this.alexaSkill().showCard(
    new AlexaSkill.StandardCard()
        .setTitle('Title')
        .setText('Text')
        .setSmallImageUrl('https://via.placeholder.com/720x480')
        .setLargeImageUrl('https://via.placeholder.com/1200x800')
);
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#creating-a-home-card-to-display-text-and-an-image)

#### Account Linking Card

The account linking card is used to prompt the user to connect their account by providing the authorization url you defined in the configuration of your Skill in the Amazon developer console.

```javascript
this.alexaSkill().showAccountLinkingCard();
// or
const {AlexaSkill} = require('jovo-framework');

this.alexaSkill().showCard(new AlexaSkill.LinkAccountCard());
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html#defining-a-card-for-use-with-account-linking)

#### Permission Card

To get access to the user's address data or their lists you have to first ask for permission using a card. There is the `AddressPermission`,`CountryAndPostalCodePermission` and `ListPermission` card:
```javascript
// country and postal code permission
this.alexaSkill().showAskForCountryAndPostalCodeCard();

// address permission
this.alexaSkill().showAskforAddressCard();

// list permission
this.alexaSkill().showAskForListPermissionCard(['read', 'write']);
// or
this.alexaSkill().showAskForListPermissionCard(['read']);

this.alexaSkill().showAskForListPermissionCard(['write']);
```

Find out more about the [Device Address API](#https://developer.amazon.com/docs/custom-skills/device-address-api.html) and the [Alexa Lists](#https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html)

### Display Templates

Display Templates can be used to include content on the screen of the Echo Show or Spot. There is a variety of templates, each having a different composition and features.
[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html) 

#### Body Templates

The body template is only capable of displaying images and text. There are multiple body templates, each having a different composition.

[BodyTemplate1](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate1-for-simple-text-and-image-views)
```javascript
let bodyTemplate1 = this.alexaSkill().templateBuilder('BodyTemplate1');
bodyTemplate1
  .setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text');

this.alexaSkill().showDisplayTemplate(bodyTemplate1);
```

[BodyTemplate2](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate2-for-image-views-and-limited-centered-text)
```javascript
let bodyTemplate2 = this.alexaSkill().templateBuilder('BodyTemplate2');
bodyTemplate2
  .setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Test', 'Tertiary Text')
  .setRightImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.alexaSkill().showDisplayTemplate(bodyTemplate2);
```

[BodyTemplate3](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate3-for-image-views-and-limited-left-aligned-text)
```javascript
let bodyTemplate3 = this.alexaSkill().templateBuilder('BodyTemplate3');
bodyTemplate3
  .setToken('token')
  .setTitle('Title')
  .setTextContent('Primary Text', 'Secondary Text', 'Tertiary Text')
  .setLeftImage({
    description: 'Description',
    url: 'https://via.placeholder.com/350x150',
  });

this.alexaSkill().showDisplayTemplate(bodyTemplate3);
```

[BodyTemplate6](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#bodytemplate6-for-text-and-optional-background-image)
```javascript
let bodyTemplate6 = this.alexaSkill().templateBuilder('BodyTemplate6');
bodyTemplate6
  .setToken('token')
  .setTextContent('Primary Text', 'Secondary Text'. 'Tertiary Text')
  .setFullScreenImage({
    description: 'Description',
    url: 'https://via.placeholder.com/1200x1000',
});

this.alexaSkill().showDisplayTemplate(bodyTemplate6);
```

#### List Templates

As the name says, the list template is used to display a set of scrollabe items (text and images).

[ListTemplate1](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#listtemplate1-for-text-lists-and-optional-images)
```javascript
let listTemplate1 = this.alexaSkill().templateBuilder('ListTemplate1');
listTemplate1
  .setTitle('Title')
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

this.alexaSkill().showDisplayTemplate(listTemplate1);
```

[ListTemplate2](https://developer.amazon.com/docs/custom-skills/display-interface-reference.html#listtemplate2-for-list-images-and-optional-text)
```javascript
let listTemplate2 = this.alexaSkill().templateBuilder('ListTemplate2');
listTemplate2
  .setTitle('Title')
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

this.alexaSkill().showDisplayTemplate(listTemplate2);
```

### Video

To launch videos on an Echo Show you can use the `VideoApp` interface:
```javascript
this.alexaSkill().showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');
```
[Official Amazon reference](#https://developer.amazon.com/docs/custom-skills/videoapp-interface-reference.html)