# Media Response

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/media-response

Learn how to use the Google Action Media Response with Jovo.

* [Introduction](#introduction)
* [Features](#features)
  * [Play a File](#play-a-file)
  * [Media Progress](#media-progress)
* [Directives](#directives)


## Introduction

The Google Action Media Response allows you to play audio content, which is longer than the 240 seconds SSML limit. While using the Media Response, you lose control of the `play`, `pause`, `stop` and `start over` commands, since Google handles these themselves, without your app even receiving the request.

You can access the Media Response features in two ways:

```js
// @language=javascript

// Recommended
this.$googleAction.$mediaResponse

// Alternative
this.$googleAction.$audioPlayer

// @language=typescript

// Recommended
this.$googleAction!.$mediaResponse

// Alternative
this.$googleAction!.$audioPlayer
```

You can check out the official documentation [here](https://developers.google.com/assistant/conversational/prompts-media).

## Features

### Play a File

Google Conversational Actions expect a MediaResponse object, which will be shown inside a media card:

```javascript
// @language=javascript

this.$googleAction.$audioPlayer.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});

// @language=typescript

this.$googleAction!.$audioPlayer!.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});
```

Optionally, you can also provide an array of media response objects to `playAudio()`.

To send the response, you can use either `this.tell()` or `this.ask()`, which have both different use cases. 

```javascript
// @language=javascript

this.$googleAction.$audioPlayer.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});
this.tell('Enjoy the song!');

// @language=typescript

this.$googleAction!.$audioPlayer!.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});
this.tell('Enjoy the song!');
```

If you use `this.tell()` it will be handled as a final response and you won't receive a callback regarding the media status. 

`this.ask()` on the other hand will keep the session open, so you can receive the callback, but it forces you to add [Suggestion Chips](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/visual-output#suggestion-chips) to your response.


```javascript
// @language=javascript

this.$googleAction.$audioPlayer.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});
this.$googleAction.showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');

// @language=typescript

this.$googleAction!.$audioPlayer!.playAudio({
	name: 'Media name',
	description: 'Media description',
	url: 'https://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3',
	image: {
		large: {
			alt: 'Jazz in Paris album art',
			height: 0,
			url: 'https://storage.googleapis.com/automotive-media/album_art.jpg',
			width: 0,
		},
	},
});
this.$googleAction!.showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');
```

### Media Progress

If you want to access the current progress of the media playback, use `getProgress()`:

```javascript
// @language=javascript

this.$googleAction.$audioPlayer.getProgress();

// @language=typescript

this.$googleAction!.$audioPlayer!.getProgress();
```

## Directives

During or after the media plays, your Jovo app can receive the media status as a directive, which have to be placed in either the `'MEDIARESPONSE'` or the `'AUDIOPLAYER'` directive of your handler.

```javascript
'AUDIOPLAYER': {
	'GoogleAction.Paused'() {
		this.tell('Playback paused.');
	},
	'GoogleAction.Stopped'() {
    this.tell('Playback stopped.)
	},
	'GoogleAction.Finished'() {
		this.tell('Playback finished.');
	},
	'GoogleAction.Failed'() {
		this.tell('Playback failed.');
	},
}
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/media-response/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/media-response/)
