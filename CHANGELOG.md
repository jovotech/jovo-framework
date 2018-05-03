[![Jovo Framework](https://www.jovo.tech/img/we-love-prs.png)](./CONTRIBUTING.md)

<p align="center">
	<a href="https://gitmoji.carloscuesta.me"><img src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square" alt="Gitmoji"></a>
</p>

<br/>

# Jovo Framework Changelog

## 1.1.6 (May 02, 2018)
* [#135](https://github.com/jovotech/jovo-framework-nodejs/pull/135): Fixed getTimestamp() on GoogleAction requests - [@KaanKC](https://github.com/KaanKC).
* [#136](https://github.com/jovotech/jovo-framework-nodejs/pull/136): Import app config from app.json - [@aswetlow](https://github.com/aswetlow).
* Add an additional check to GoogleActionResponse (issue #126) - thx to [@tony-gutierrez](https://github.com/tony-gutierrez)


## 1.1.5 (April 25, 2018)
* [#133](https://github.com/jovotech/jovo-framework-nodejs/pull/133): Refactored routing and added tests  - [@aswetlow](https://github.com/aswetlow).


## 1.1.4 (April 19, 2018)
* Fix Dialogflow V2 session handling
* Fix Dialogflow getAccessToken() bug (issue #126)


## 1.1.3 (April 09, 2018)
* [#116](https://github.com/jovotech/jovo-framework-nodejs/pull/117): Fix dialogflow V2 input handling (issue #116) - [@fgnass](https://github.com/fgnass).


## 1.1.2 (April 05, 2018)
* [#115](https://github.com/jovotech/jovo-framework-nodejs/pull/115): Improved setHandler method - [@aswetlow](https://github.com/aswetlow).
* [#114](https://github.com/jovotech/jovo-framework-nodejs/pull/114): Added more unit tests - [@aswetlow](https://github.com/aswetlow).


## 1.1.1 (March 30, 2018)
* Fixed broken PR merge

## 1.1.0 (March 29, 2018)
* [#96](https://github.com/jovotech/jovo-framework-nodejs/pull/96): Added Chatbase integration - [@KaanKC](https://github.com/KaanKC).
* [#104](https://github.com/jovotech/jovo-framework-nodejs/pull/104): Added Azure Functions support - [@trevorwang](https://github.com/trevorwang).
* [#106](https://github.com/jovotech/jovo-framework-nodejs/pull/106): Added aliases for Speechbuilder's 'say-as' methods - [@FlorianHollandt](https://github.com/FlorianHollandt).
* [#99](https://github.com/jovotech/jovo-framework-nodejs/pull/99): Added gcloud datastore integration - [@mehl](https://github.com/mehl).
* [502c141](https://github.com/jovotech/jovo-framework-nodejs/commit/502c14112484737bee75c5ee815ce1b9423ebb84): Added MediaResponses (AudioPlayer) and CarouselBrowse to Google Actions
* [4d6308b](https://github.com/jovotech/jovo-framework-nodejs/commit/4d6308b89c314e2f34e4cb0f9face494ba264b8a):  Added emits to public methods
* [f2fb9c2](https://github.com/jovotech/jovo-framework-nodejs/commit/f2fb9c2f88ce9da52eb86c7f9fa5f22a3b2cc525):  Added plugin functionality


## 1.0.4 (March 1, 2018)
* Fixed error in handleElementSelectRequest function ([see issue 91](https://github.com/jovotech/jovo-framework-nodejs/issues/91))

## 1.0.3 (February 28, 2018)
* Added Skill/List events for Alexa Skills ([see issue 23](https://github.com/jovotech/jovo-framework-nodejs/issues/23))
* Added more unit tests
* Added this.reprompt SpeechBuilder instance
* Fixed Dialogflow session context bug

## 1.0.2 (February 24, 2018)

* [cc5a888](https://github.com/jovotech/jovo-framework-nodejs/commit/cc5a888977c870e6d44636ae48cbd95efb9e9251): Added `app.onRequest()` and `app.onResponse()` listeners (see issue #85)

## 1.0.1 (February 22, 2018)

* [2ab4fdfsp](https://github.com/jovotech/jovo-framework-nodejs/commit/2ab4fdf1009794c2b5260f833e7dba2e30d603c6): Fixed XML escaping in i18n
* [375b3dc](https://github.com/jovotech/jovo-framework-nodejs/commit/375b3dc9aa0cf2eded7d525d874150989e1c9c42): Added support for Dialogflow API `v2`

## 1.0.0 (February 15, 2018)

* Official launch of Jovo Framework version 1.0 🎉. Read more about it here: [Jovo v1 Release](https://github.com/jovotech/jovo-framework-nodejs/releases/tag/v1.0), [Announcement](https://medium.com/@einkoenig/our-biggest-update-ever-today-were-releasing-jovo-framework-v1-0-7783f39f1728), [Migration Guide](https://www.jovo.tech/blog/v1-migration-guide/)
