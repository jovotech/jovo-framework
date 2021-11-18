# Visual Output

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/visual-output

Learn more about how to build Google Actions with visual output using the Jovo Framework.

- [Introduction to Visual Output](#introduction-to-visual-output)
- [Display Text](#display-text)
- [Basic Card](#basic-card)
- [Table Card](#table-card)
- [Option Item](#option-item)
  - [List Selector](#list-selector)
  - [Carousel Selector](#carousel-selector)
  - [ON_ELEMENT_SELECTED](#onelementselected)
- [Suggestion Chips](#suggestion-chips)

## Introduction to Visual Output

Visual output is used to describe or enhance the voice interaction.

## Display Text

This will display an alternative text instead of the written speech output on your screen surface, e.g. the Google Assistant mobile phone app.

```javascript
// @language=javascript

this.$googleAction.displayText(text);

// Example
let speech = 'Hello World!';
let text = 'Hello Phone!';
this.$googleAction.displayText(text)
    .tell(speech);

// @language=typescript

this.$googleAction!.displayText(text: string);

// Example
let speech = 'Hello World!';
let text = 'Hello Phone!';
this.$googleAction!.displayText(text)
    .tell(speech);
```

[Official Documentation](https://developers.google.com/actions/assistant/responses)

## Basic Card

[Basic Cards](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#basiccard) are used for the most basic cases of visual output. They can be used to display plain text, images and a button in addition to the speech output.

Method | Description
:--- | :---
`setTitle(title)` | Title of the card
`setSubtitle(subtitle)` | Subtitle of the card
`setFormattedText(text)` | Body text of the card
`setImage(imageObject)` | Add an [image object](https://developers.google.com/actions/reference/rest/Shared.Types/Image) to the card
`setImageDisplay(option)` | Choose the [display option](https://developers.google.com/actions/reference/rest/Shared.Types/ImageDisplayOptions)
`addButton(title, url)` | Add a [button](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#button) at the bottom of the card

```javascript
// @language=javascript

// Basic
this.$googleAction.showSimpleCard('Title', 'Content');

this.$googleAction.showImageCard('Title', 'Content', 'imageURL');

// Advanced
const { GoogleAssistant, BasicCard } = require('jovo-platform-googleassistant');

let basicCard = new BasicCard()
  .setTitle('Jovo')
  .setFormattedText('Welcome to the documentation of the Jovo framework')
  .setImage({
      url: 'http://via.placeholder.com/350x150?text=Basic+Card', 
      accessibilityText: 'Jovo Card',
      width: 350,
      height: 150
  })
  .setImageDisplay('WHITE') 
  .addButton('Jovo website', 'https://v3.jovo.tech/');

this.$googleAction.showBasicCard(basicCard);

// @language=typescript

// Basic
this.$googleAction!.showSimpleCard('Title', 'Content');

this.$googleAction!.showImageCard('Title', 'Content', 'imageURL');

// Advanced
import { GoogleAssistant, BasicCard } from 'jovo-platform-googleassistant';

let basicCard = new BasicCard()
  .setTitle('Jovo')
  .setFormattedText('Welcome to the documentation of the Jovo framework')
  .setImage({
      url: 'http://via.placeholder.com/350x150?text=Basic+Card', 
      accessibilityText: 'Jovo Card',
      width: 350,
      height: 150
  })
  .setImageDisplay('WHITE') 
  .addButton('Jovo website', 'https://v3.jovo.tech/');

this.$googleAction!.showBasicCard(basicCard);
```

[Official Documentation](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#basiccard)

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L33) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L37)

## Table Card

[Table Cards](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#tablecard) are used for the display of tabular data. They can be used to display a table of text, images and a button in addition to the speech output.

Method | Description
:--- | :---
`setTitle(title)` | Title of the card
`setSubtitle(subtitle)` | Subtitle of the card
`setImage(imageObj)` | Add an [image object](https://developers.google.com/actions/reference/rest/Shared.Types/Image) to the card
`addRow(cellsText, dividerAfter)` | Add data for a single [row](https://actions-on-google.github.io/actions-on-google-nodejs/interfaces/actionssdk_api_v2.googleactionsv2uielementstablecardrow.html)
`addRows(rowsText) ` | Add data for multiple [rows](https://actions-on-google.github.io/actions-on-google-nodejs/interfaces/actionssdk_api_v2.googleactionsv2uielementstablecardrow.html)
`addColumn(header, horizontalAlignment)` | Add data for a single column. Choose the [horizontal alignment](https://developers.google.com/actions/reference/rest/Shared.Types/HorizontalAlignment)
`addColumns(columnHeaders)` | Add data for multiple columns.
`addButton(title, url)` | Add a [button](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#button) at the bottom of the card

```javascript
// @language=javascript

// Basic
this.$googleAction.showSimpleTable('Table Title', 'Table Subtitle', ['header 1', 'header 2'], [['row 1 item 1', 'row 1 item 2'], ['row 2 item 1', 'row 2 item 2'], ['row 3 item 3', 'row 3 item 2']])

// Advanced
const { GoogleAssistant, Table } = require('jovo-platform-googleassistant');

let tableCard = new Table()
  .setTitle('Jovo')
  .setImage({
      url: 'http://via.placeholder.com/350x150?text=Basic+Card', 
      accessibilityText: 'Jovo Card',
      width: 350,
      height: 150
  })
  .addColumn('header 1','CENTER')
  .addColumn('header 2','LEADING')
  .addColumn('header 3','TRAILING')
  .addRow(['row 1 item 1', 'row 1 item 2', 'row 1 item 3'], false)
  .addRow(['row 2 item 1', 'row 2 item 2', 'row 2 item 3'], true)
  .addRow(['row 3 item 3', 'row 3 item 2', 'row 3 item 3'])
  .addButton('Jovo website', 'https://v3.jovo.tech/');

this.$googleAction.showTable(tableCard);

// @language=typescript

// Basic
this.$googleAction!.showSimpleTable('Table Title', 'Table Subtitle', ['header 1', 'header 2'], [['row 1 item 1', 'row 1 item 2'], ['row 2 item 1', 'row 2 item 2'], ['row 3 item 3', 'row 3 item 2']])

// Advanced
import { GoogleAssistant, Table } from 'jovo-platform-googleassistant';

let tableCard = new Table()
  .setTitle('Jovo')
  .setImage({
      url: 'http://via.placeholder.com/350x150?text=Basic+Card', 
      accessibilityText: 'Jovo Card',
      width: 350,
      height: 150
  })
  .addColumn('header 1','CENTER')
  .addColumn('header 2','LEADING')
  .addColumn('header 3','TRAILING')
  .addRow(['row 1 item 1', 'row 1 item 2', 'row 1 item 3'], false)
  .addRow(['row 2 item 1', 'row 2 item 2', 'row 2 item 3'], true)
  .addRow(['row 3 item 3', 'row 3 item 2', 'row 3 item 3'])
  .addButton('Jovo website', 'https://v3.jovo.tech/');

this.$googleAction!.showTable(tableCard);
```

[Official Documentation](https://developers.google.com/actions/assistant/responses#table_card).

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L47) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L51)

## Option Item

Option Items are cards combined with an [OptionInfo](https://developers.google.com/actions/reference/rest/Shared.Types/OptionInfo), which is used to track the user's choice. They are used with the List and Carousel Selector.

Method | Description
:--- | :---
`setTitle(title)` | Title of the card
`setDescription(text)` | Body text of the card
`setImage(imageObj)` | Add an [image object](https://developers.google.com/actions/reference/rest/Shared.Types/Image) to the card
`setKey(key)` | Unique key to identify the card
`addSynonym(synonym)` | Possible synonyms, which can be used to select the card in dialog

```javascript
// @language=javascript

const { GoogleAssistant, OptionItem } = require('jovo-platform-googleassistant');

let itemOne = new OptionItem();

itemOne
  .setTitle('Option 1')
  .setDescription('Description of option 1')
  .setKey('OptionOne');
  .addSynonym('Option One');

// @language=typescript

import { GoogleAssistant, OptionItem } from 'jovo-platform-googleassistant';

let itemOne = new OptionItem();

itemOne
  .setTitle('Option 1')
  .setDescription('Description of option 1')
  .setKey('OptionOne');
  .addSynonym('Option One');
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L72) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L76)


### List Selector

The list selector can be used to display a vertical list of selectable items.

Method | Description
:--- | :---
`setTitle(title)` | Title of the list
`addItem(optionItem)` | Add an [Option Item](#option-item)

```javascript
// @language=javascript

const { GoogleAssistant, List } = require('jovo-platform-googleassistant');

// Create a list and name it
let list = new List();
list.setTitle('Title');

// Add Items
list.addItem(itemOne);

this.$googleAction.showList(list);

// @language=typescript

impot { GoogleAssistant, List } from 'jovo-platform-googleassistant';

// Create a list and name it
let list = new List();
list.setTitle('Title');

// Add Items
list.addItem(itemOne);

this.$googleAction!.showList(list);
```

[Official Documentation](https://developers.google.com/actions/assistant/responses#list_selector)

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L72) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L76)

### Carousel Selector

The carousel selector can be used to display a horizontal list of selectable items.

Method | Description
:--- | :---
`addItem(optionItem)` | Add an [Option Item](#option-item)

```javascript
// @language=javascript

const { GoogleAssistant, Carousel } = require('jovo-platform-googleassistant');

let carousel = new Carousel();

carousel.addItem(itemOne);

this.$googleAction.showCarousel(carousel);

// @language=typescript

import { GoogleAssistant, Carousel } from 'jovo-platform-googleassistant';

let carousel = new Carousel();

carousel.addItem(itemOne);

this.$googleAction!.showCarousel(carousel);
```


[Official Documentation](https://developers.google.com/actions/assistant/responses#carousel_selector)

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L101) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L105)

### ON_ELEMENT_SELECTED

After the user selects one of the items in your list or carousel, they will be redirected to the `ON_ELEMENT_SELECTED` intent, if availabe.

There you can use `this.getSelectedElementId()` to get the `key` of the selected item

```javascript
ON_ELEMENT_SELECTED() {
  let selectedElement = this.getSelectedElementId();
  if (selectedElement === 'ItemOneKey') {
    this.tell('You chose item one');
  }
},
```
[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L192) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L198)

## Suggestion Chips

Use suggestion chips to add possible responses.

Method | Description
:--- | :---
`showSuggestionChips(chips)` | Add suggestion chips to the response. Only works with `ask` responses.
`showLinkOutSuggestion(name, url)` | Add a [LinkOutSuggestion](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#linkoutsuggestion), which leads to an app or site.

```javascript
// @language=javascript

this.$googleAction.showSuggestionChips(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);

this.$googleAction.showLinkOutSuggestion('Jovo', 'https://v3.jovo.tech/');

// @language=typescript

this.$googleAction!.showSuggestionChips(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);

this.$googleAction!.showLinkOutSuggestion('Jovo', 'https://v3.jovo.tech/');
```

[Official Documentation](https://developers.google.com/actions/assistant/responses#suggestion-chip)

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L67) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L71)