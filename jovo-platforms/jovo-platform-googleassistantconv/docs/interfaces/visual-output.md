# Visual Output

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/visual-output

Learn more about how to build Google Actions with visual output using the Jovo Framework.

- [Introduction to Visual Output](#introduction-to-visual-output)
- [Simple Response](#simple-response)
- [Basic Card](#basic-card)
- [Table Card](#table-card)
- [Selection](#selection)
  - [List](#list)
  - [Collection](#collection)
  - [ON_ELEMENT_SELECTED](#onelementselected)
- [Suggestion Chips](#suggestion-chips)

## Introduction to Visual Output

Visual output is used to describe or enhance the voice interaction.

## Simple Response

With [Simple Responses](https://developers.google.com/assistant/conversational/prompts-simple), you can provide basic text output in the form of chat bubbles to your users. They consist of visual text output and use SSML or TTS for sound.

```javascript
// @language=javascript

const firstSimpleResponse = 'First Simple Response!';
this.$googleAction.addFirstSimple({
	speech: SpeechBuilder.toSSML(firstSimpleResponse),
	text: firstSimpleResponse,
});

const lastSimpleResponse = 'Last Simple Response!';
this.$googleAction.addLastSimple({
	speech: SpeechBuilder.toSSML(lastSimpleResponse),
	text: lastSimpleResponse,
});


// @language=typescript

const firstSimpleResponse: string = 'First Simple Response!';
this.$googleAction!.addFirstSimple({
	speech: SpeechBuilder.toSSML(firstSimpleResponse),
	text: firstSimpleResponse,
});

const lastSimpleResponse: string = 'Last Simple Response!';
this.$googleAction!.addLastSimple({
	speech: SpeechBuilder.toSSML(lastSimpleResponse),
	text: lastSimpleResponse,
});
```

## Basic Card

[Basic Cards](https://developers.google.com/assistant/conversational/prompts-rich#basic_card) are used for the most basic cases of visual output. They can be used to display plain text, images and a button in addition to the speech output.

```javascript
// @language=javascript

this.$googleAction.addBasicCard({
	title: 'Title',
	subtitle: 'Subtitle',
	text: 'Text',
	image: {
		url: 'https://via.placeholder.com/450x350?text=Basic+Card',
		alt: 'Image text',
	},
});

// @language=typescript

this.$googleAction!.addBasicCard({
	title: 'Title',
	subtitle: 'Subtitle',
	text: 'Text',
	image: {
		url: 'https://via.placeholder.com/450x350?text=Basic+Card',
		alt: 'Image text',
	},
});
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L33) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L37)

## Image Card

[Image Cards](https://developers.google.com/assistant/conversational/prompts-rich#image-cards) represent a simpler alternative to Basic Cards, which you can use when you just want to present an image.

```javascript
// @language=javascript

this.$googleAction.addImageCard({
	url: 'https://via.placeholder.com/450x350?text=Image+Card',
  alt: 'Image text',
  height: 350,
  width: 450
});

// @language=typescript

this.$googleAction!.addImageCard({
	url: 'https://via.placeholder.com/450x350?text=Image+Card',
	alt: 'Image text',
  height: 350,
  width: 450
});
```

## Table Card

[Table Cards](https://developers.google.com/assistant/conversational/prompts-rich#table_cards) are used for displaying tabular data.

```javascript
// @language=javascript

this.$googleAction.addTable({
	columns: [
		{
			header: 'Column A',
		},
		{
			header: 'Column B',
		}
	],
	image: {
		alt: 'Google Assistant Logo',
		height: 0,
		url: 'https://developers.google.com/assistant/assistant_96.png',
		width: 0,
	},
	rows: [
		{
			cells: [
				{
					text: 'A1',
				},
				{
					text: 'B1',
				}
			],
		},
		{
			cells: [
				{
					text: 'A2',
				},
				{
					text: 'B2',
				}
			],
		},
	],
	subtitle: 'Table Subtitle',
	title: 'Table Title',
});

// @language=typescript

this.$googleAction!.addTable({
	columns: [
		{
			header: 'Column A',
		},
		{
			header: 'Column B',
		}
	],
	image: {
		alt: 'Google Assistant Logo',
		height: 0,
		url: 'https://developers.google.com/assistant/assistant_96.png',
		width: 0,
	},
	rows: [
		{
			cells: [
				{
					text: 'A1',
				},
				{
					text: 'B1',
				}
			],
		},
		{
			cells: [
				{
					text: 'A2',
				},
				{
					text: 'B2',
				}
			],
		},
	],
	subtitle: 'Table Subtitle',
	title: 'Table Title',
});
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/cards/src/app.js#L47) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistant/cards/src/app.ts#L51)

## Selection

You can use one of the following selection types to let the user choose one out of several options as a response.

### List

A [List](https://developers.google.com/assistant/conversational/prompts-selection#list) can be used to display a vertical list of selectable items. Lists must contain at least 2 items, but at most 30.

```javascript
// @language=javascript

this.$googleAction.addList({
  title: 'ExampleList'.
  subtitle: 'ExampleSubTitle',
  items: [
    {
      key: 'listItem1'
    },
    {
      key: 'listItem2'
    }
  ]
});

// @language=typescript

this.$googleAction!.addList({
  title: 'ExampleList'.
  subtitle: 'ExampleSubTitle',
  items: [
    {
      key: 'listItem1'
	  },
    {
      key: 'listItem2'
    }
  ]
});
```

Each list provides an array of list items, containing keys for each item you want to show in your list. To add a list entry, you can utilize type overrides:

```javascript
// @language=javascript

this.$googleAction.addTypeOverrides([
  {
    name: 'ListEntries',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'listItem1',
          synonyms: ['List Item 1', 'First Item'],
          display: {
            title: 'List Item 1',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=List+Item+1',
	            alt: 'Image text',
            }
          }
        },
        {
          name: 'listItem2',
          synonyms: ['List Item 2', 'Second Item'],
          display: {
            title: 'List Item 2',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=List+Item+2',
	            alt: 'Image text',
            }
          }
        }
      ]
    }
  }
]);

// @language=typescript

this.$googleAction!.addTypeOverrides([
  {
    name: 'ListEntries',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'listItem1',
          synonyms: ['List Item 1', 'First Item'],
          display: {
            title: 'List Item 1',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=List+Item+1',
	            alt: 'Image text',
            }
          }
        },
        {
          name: 'listItem2',
          synonyms: ['List Item 2', 'Second Item'],
          display: {
            title: 'List Item 2',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=List+Item+2',
	            alt: 'Image text',
            }
          }
        }
      ]
    }
  }
]);
```

### Collection

Contrary to [Lists](#lists), [Collections](https://developers.google.com/assistant/conversational/prompts-selection#collection) display a horizontal list of selectable items, that allow for richer content to be displayed. Collections must also contain at least 2 items, but only a maximum of 10 items.

```javascript
// @language=javascript

this.$googleAction.addCollection({
  title: 'ExampleCollection'.
  subtitle: 'ExampleSubTitle',
  items: [
    {
      key: 'collectionItem1'
    },
    {
      key: 'collectionItem2'
    }
  ]
});

// @language=typescript

this.$googleAction!.addCollection({
  title: 'ExampleCollection'.
  subtitle: 'ExampleSubTitle',
  items: [
    {
      key: 'collectionItem1'
    },
    {
      key: 'collectionItem2'
    }
  ]
});
```

Analogous to vertical lists, each collection provides an array of items, containing keys for each item you want to show in your list. To add an entry, you can utilize type overrides:

```javascript
// @language=javascript

this.$googleAction.addTypeOverrides([
  {
    name: 'CollectionEntries',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'collectionItem1',
          synonyms: ['Collection Item 1', 'First Item'],
          display: {
            title: 'Collection Item 1',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=Collection+Item+1',
	            alt: 'Image text',
            }
          }
        },
        {
          name: 'collectionItem2',
          synonyms: ['Collection Item 2', 'Second Item'],
          display: {
            title: 'Collection Item 2',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=Collection+Item+2',
	            alt: 'Image text',
            }
          }
        }
      ]
    }
  }
]);

// @language=typescript

this.$googleAction!.addTypeOverrides([
  {
    name: 'CollectionEntries',
    mode: 'TYPE_REPLACE',
    synonym: {
      entries: [
        {
          name: 'collectionItem1',
          synonyms: ['Collection Item 1', 'First Item'],
          display: {
            title: 'Collection Item 1',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=Collection+Item+1',
	            alt: 'Image text',
            }
          }
        },
        {
          name: 'collectionItem2',
          synonyms: ['Collection Item 2', 'Second Item'],
          display: {
            title: 'Collection Item 2',
            description: 'Example Description',
            image: {
              url: 'https://via.placeholder.com/450x350?text=Collection+Item+2',
	            alt: 'Image text',
            }
          }
        }
      ]
    }
  }
]);
```

### ON_ELEMENT_SELECTED

After the user selects one of the items in your visual selection, they will be redirected to the `ON_ELEMENT_SELECTED` intent, if available. There you can use `this.getSelectedElementId()` to get the `key` of the selected item:

```javascript
// @language=javascript

ON_ELEMENT_SELECTED() {
  const selectedElement = this.getSelectedElementId();
  if (selectedElement === 'item1') {
    this.tell('You chose item one');
  }
}

// @language=typescript
ON_ELEMENT_SELECTED() {
  const selectedElement: string | undefined = this.getSelectedElementId();
  if (selectedElement === 'item1') {
    this.tell('You chose item one');
  }
}
```

## Suggestion Chips

Use suggestion chips to add possible responses as a hint as to how the user can interact with your Conversational Action next.

```javascript
// @language=javascript

this.$googleAction.showSuggestions(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);

// @language=typescript

this.$googleAction!.showSuggestions(['Suggestion 1', 'Suggestion 2', 'Suggestion 3']);
```

[Official Documentation](https://developers.google.com/actions/assistant/responses#suggestion-chip)

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/rich/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/rich/)