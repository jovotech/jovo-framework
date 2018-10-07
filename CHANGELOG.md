# Jovo Framework Changelog

## 1.4.12 (October 7, 2018)
* [#261](https://github.com/jovotech/jovo-framework-nodejs/pull/261) Added Alexa ApiEndpoint fallback [@shmatul](https://github.com/shmatul)
* [#259](https://github.com/jovotech/jovo-framework-nodejs/pull/259) Added addAskForNotificationPermission for GoogleAction [@gwythyr](https://github.com/gwythyr)

## 1.4.11 (October 2, 2018)
* Fixed handler merging and GadgetController

## 1.4.10 (September 26, 2018)
* [#254](https://github.com/jovotech/jovo-framework-nodejs/pull/254) Fix for webhook exception handling during unit tests  - [@IGx89](https://github.com/IGx89)
* Added SpeechBuilder export
* Fixed Alexa ContactAPI (temperatureUnit)

## 1.4.9 (September 14, 2018)
* [#248](https://github.com/jovotech/jovo-framework-nodejs/pull/248) Added context to askForSignIn()  - [@kouz75](https://github.com/kouz75)
* [#247](https://github.com/jovotech/jovo-framework-nodejs/pull/247) Added Azure Functions error handling fixes  - [@IGx89](https://github.com/IGx89)

## 1.4.8 (September 11, 2018)
* Fixed bug in handler (Intents were called after tell/ask in NEW_SESSION, NEW_USER, ON_REQUEST )

## 1.4.7 (September 07, 2018)
* Added Jovo Debugger config file integration (Beta)
* Fixed async functionality in handleLambda() method 


## 1.4.6 (August 30, 2018)
* Added Display Template Preview to Jovo Debugger plugin


## 1.4.5 (August 22, 2018)
* Added Alexa Settings API integration (Timezone, Distance Measurement Unit, Temperature Measurement Unit)

## 1.4.4 (August 20, 2018)
* [#233](https://github.com/jovotech/jovo-framework-nodejs/pull/233) Added Table Card to Google Actions  - [@donth77](https://github.com/donth77)


## 1.4.3 (August 14, 2018)
* [#227](https://github.com/jovotech/jovo-framework-nodejs/pull/227) Alexa - AudioPlayer - add PlaybackController events - [@kouz75](https://github.com/kouz75)
* [#223](https://github.com/jovotech/jovo-framework-nodejs/pull/223) Added Botanalytics integration - [@BeyhanEsen](https://github.com/BeyhanEsen)
* Added routing of unknown requests to `Unhandled`-Handler


## 1.4.2 (August 09, 2018)
* Added database data to Jovo Debugger
* Added Google Action voice match helper

## 1.4.1 (August 08, 2018)
* Accept contact properties as string in AskForContactPermissionCard

## 1.4.0 (August 02, 2018)
* [#204](https://github.com/jovotech/jovo-framework-nodejs/pull/204) Added Alexa Gadgets API - [@omenocal](https://github.com/omenocal)
* Added Alexa 'Request Customer Contact Information' Card+API call
* Added language model tester

## 1.3.6 (July 31, 2018)
* Fixed merge errors

## 1.3.5 (July 31, 2018)
* [#205](https://github.com/jovotech/jovo-framework-nodejs/pull/205) Fixed setFullscreenImage in BodyTemplate6 - [@vitaliidanchul](https://github.com/vitaliidanchul)
* Added setAccessToken to GoogleAction request classes

## 1.3.4 (July 16, 2018)
* Fixed merge errors

## 1.3.3 (July 12, 2018)
* Fixed routing bugs

## 1.3.2 (June 29, 2018)
* [#190](https://github.com/jovotech/jovo-framework-nodejs/pull/190) Added CanFulfillIntentRequest - [@omenocal](https://github.com/omenocal)


## 1.3.1 (June 28, 2018)
* Improved Jovo Debugger plugin

## 1.3.0 (June 22, 2018)
* Added Jovo Debugger plugin to Jovo Webhook (Beta) http://webhook.jovo.cloud/your-webhook-id
* [#184](https://github.com/jovotech/jovo-framework-nodejs/pull/184) Added Alexa Video Preamble Option - [@MerryOscar](https://github.com/MerryOscar)
* [#183](https://github.com/jovotech/jovo-framework-nodejs/pull/183) Added support for audio track metadata in the Alexa Audio Player - [@blforce](https://github.com/blforce)
* [#169](https://github.com/jovotech/jovo-framework-nodejs/pull/169) Prevent (and gracefully handle) DynamoDB error - [@fgnass](https://github.com/fgnass)
* [#166](https://github.com/jovotech/jovo-framework-nodejs/pull/166) Register plugins without a name - [@fgnass](https://github.com/fgnass)
* [#164](https://github.com/jovotech/jovo-framework-nodejs/pull/164) Improve error handling - [@fgnass](https://github.com/fgnass)

## 1.2.3 (June 21, 2018)
* Fixed Jovo Debugger related issues

## 1.2.2 (June 15, 2018)
* Fixed bugs in input mapping
* Added better debugging (alpha release for talk.to.me hackathon berlin)


## 1.2.1 (June 04, 2018)
* Fixed bugs in error handling
* Fixed googleAction()/alexaSkill() 'undefined' bugs in Alexa Skill / Google Action requests


## 1.2.0 (May 17, 2018)
* [#153](https://github.com/jovotech/jovo-framework-nodejs/pull/153): Added Voice App Unit Testing (Beta) - [@Milksnatcher](https://github.com/Milksnatcher).
* [#150](https://github.com/jovotech/jovo-framework-nodejs/pull/150): Added user context functionality - [@KaanKC](https://github.com/KaanKC).
* [#144](https://github.com/jovotech/jovo-framework-nodejs/pull/144): Added In Skill Purchase for Alexa Skills - [@aswetlow](https://github.com/aswetlow).
* [#151](https://github.com/jovotech/jovo-framework-nodejs/pull/151): Added <phoneme> support to SpeechBuilder - [@fgnass](https://github.com/fgnass).
* [#136](https://github.com/jovotech/jovo-framework-nodejs/pull/136): Added app.json config support - [@aswetlow](https://github.com/aswetlow).
* Fixed getPermissionToken() bug (issue #152)
* Fixed nodemon dependecy bug (issue #112)
* Fixed Fixed encoding in Google Action Dialogflow V2 requests
* ...

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
