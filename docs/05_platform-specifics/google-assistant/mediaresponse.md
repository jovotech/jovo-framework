# [Platform Specific Features](../) > [Google Assistant](./README.md) > Media Response

Learn more about how to use the Google Action Media Response with Jovo.

* [Introduction](#introduction)
* [Features](#features)
  * [Play a File](#play-a-file)
* [Directives](#directive)


## Introduction

The Google Action Media Response allows you to play audio content, which is longer than 120 seconds. While using the Media Response you loose control of the `stop`, `cancel` and `resume` commands, since Google handles these themselves, without your app even receiving the request.

You can check out the official documentation [here](https://developers.google.com/actions/assistant/responses#media_responses).

## Features

### Play a File

```javascript
// Adds audio file to the response
this.googleAction().audioPlayer().play(url, name);
```

To send the response you can use either `tell()` or `ask()`, which have both different use cases. 
```javascript
this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
this.tell('Enjoy the song!');
```
If you use `tell()` it will be handled as a [final response](https://developers.google.com/actions/reference/rest/Shared.Types/AppResponse#finalresponse) and you wont receive a callback that the audio playback is completed. 

The `ask()` method on the other hand will keep the session open so you can receive the callback, but it forces you to add [Suggestion Chips](./visual.md#suggestion-chips) to your response.
```javascript
this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
this.googleAction().showSuggestionChips(['Chip 1', 'Chip 2']);
this.ask('Enjoy the song');
```

## Directive

The callback after the audio playback is finished will be mapped to the `GoogleAction.Finished` intent, which has to be placed in the `AUDIOPLAYER` state.

```javascript
'AUDIOPLAYER': {
  'GoogleAction.Finished': function() { 
    // ...
  },
},
```