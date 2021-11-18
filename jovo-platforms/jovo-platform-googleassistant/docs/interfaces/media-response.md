# Media Response API

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/interfaces/media-response

Learn how to use the Google Action Media Response with Jovo.

* [Introduction](#introduction)
* [Features](#features)
  * [Play a File](#play-a-file)
* [Directives](#directive)


## Introduction

The Google Action Media Response allows you to play audio content, which is longer than 120 seconds. While using the Media Response you lose control of the `stop`, `cancel` and `resume` commands, since Google handles these themselves, without your app even receiving the request.

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


You can check out the official documentation [here](https://developers.google.com/actions/assistant/responses#media_responses).

## Features

### Play a File

```javascript
// @language=javascript

// Adds audio file to the response
this.$googleAction.$mediaResponse.play(url, name);

// @language=typescript

// Adds audio file to the response
this.$googleAction!.$mediaResponse.play(url: string, name: string);
```

To send the response you can use either `tell()` or `ask()`, which have both different use cases. 

```javascript
// @language=javascript

this.$googleAction.$mediaResponse.play('https://www.url.to/file.mp3', 'song one');
this.tell('Enjoy the song!');

// @language=typescript

this.$googleAction!.$mediaResponse.play('https://www.url.to/file.mp3', 'song one');
this.tell('Enjoy the song!');
```

If you use `tell()` it will be handled as a [final response](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#finalresponse) and you won't receive a callback that the audio playback is completed. 

The `ask()` method on the other hand will keep the session open so you can receive the callback, but it forces you to add [Suggestion Chips](https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/visual-output#suggestion-chips) to your response.


```javascript
// @language=javascript

this.$googleAction.$mediaResponse.play('https://www.url.to/file.mp3', 'song one');
this.$googleAction.showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');

// @language=typescript

this.$googleAction!.$mediaResponse.play('https://www.url.to/file.mp3', 'song one');
this.$googleAction!.showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');
```

### Set Track Metadata

The function `play` has an optional value, you can add some information as description, image, alt... according to [Google Media Response](https://developers.google.com/actions/assistant/responses#media_responses).

```javascript
// @language=javascript

this.$googleAction.$mediaResponse.play(
  'https://www.url.to/file.mp3', 
  'song one', 
  {
    "description": "A description",
    "icon": {
      "url": "https://www.somewhere.com/image.png", 
      "alt": "A accessibility text"
    }
  }
);

// @language=typescript

this.$googleAction!.$mediaResponse.play(
  'https://www.url.to/file.mp3', 
  'song one', 
  {
    "description": "A description",
    "icon": {
      "url": "https://www.somewhere.com/image.png", 
      "alt": "A accessibility text"
    }
  }
);
```


## Directive

The callback after the audio playback is finished will be mapped to the `GoogleAction.Finished` intent, which has to be placed in either the `'MEDIARESPONSE'` or the `'AUDIOPLAYER'` directive of your handler.

```javascript
'MEDIARESPONSE': {
  'GoogleAction.Finished': function() { 
    // ...
  },
},
```

You can also use the `'AUDIOPLAYER'` directive for cross-platform compatibility with the Alexa Audioplayer:

```javascript
'AUDIOPLAYER': {
  'GoogleAction.Finished': function() { 
    // ...
  },
},
```