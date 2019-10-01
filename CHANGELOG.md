# Jovo Framework Changelog


## 2.2.16 (2019-09-20)

#### :rocket: New Feature

* `jovo-analytics-voicehero` [#574](https://github.com/jovotech/jovo-framework/pull/574) Added VoiceHero Analytics Integration  ([@jkcchan](https://github.com/jkcchan))
* `jovo-platform-sapcai` [#577](https://github.com/jovotech/jovo-framework/pull/577) Added support to SAP Conversational AI Platform ([@StErMi](https://github.com/StErMi), [@Veake](https://github.com/Veake))


#### :bug: Bug Fix
* `jovo-db-mongodb`  Fixes MongoDB connection initialization ([@aswetlow](https://github.com/aswetlow))
* `jovo-cms-airtable` [#570](https://github.com/jovotech/jovo-framework/pull/570) Fixes Airtable multipage table bug ([@hanllo](https://github.com/hanllo))
* `jovo-platform-dialogflow` [#575](https://github.com/jovotech/jovo-framework/pull/575) Fixes isNewSession for Dialogflow platform ([@gpalozzi](https://github.com/gpalozzi))
* `jovo-framework` Updated vulnerable packages
* `jovo-framework` Several bugfixes in Jovo components (still WIP and in Beta) ([@KaanKC](https://github.com/KaanKC))


#### Committers: 7
- hanllo ([@hanllo](https://github.com/hanllo))
- Jacob Chan ([@gpalozzi](https://github.com/jkcchan))
- Gabriele Palozzi ([@gpalozzi](https://github.com/gpalozzi))
- Emanuele Ricci ([@StErMi](https://github.com/StErMi))
- Max R. ([@Veake](https://github.com/Veake))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))

## 2.2.15 (2019-08-06)

#### :rocket: New Feature

* `jovo-platform-alexa` [#549](https://github.com/jovotech/jovo-framework/pull/549) Added support for random hints  ([@frivas](https://github.com/frivas))
* `jovo-platform-alexa` Improves Dynamic Entities. Sample code: 90b98ab692471f595165128a764d8c1c136ba1d4
* `jovo-platform-googleassistant` Adds interactive canvas integration. Sample Code: e8f81dea801bddd70caf69c819092e33d27b023a
* `jovo-framework` Adds custom handler object to `this` (WIP for TS projects)


#### :bug: Bug Fix
* `jovo-framework` [#545](https://github.com/jovotech/jovo-framework/pull/545) Prevents validators to fail after redirect ([@gpalozzi](https://github.com/gpalozzi))
* `jovo-cms-airtable` [#555](https://github.com/jovotech/jovo-framework/pull/555) Fixes multiple bugs of the Airtable integration  ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-alexa` [#491](https://github.com/jovotech/jovo-framework/pull/491) Fixes slot resolutions for Dynamic Entities ([@kouz75](https://github.com/kouz75))


#### Committers: 5
- Francisco Rivas ([@frivas](https://github.com/frivas))
- Gabriele Palozzi ([@gpalozzi](https://github.com/gpalozzi))
- scouzinier ([@kouz75](https://github.com/kouz75))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))


## 2.2.14 (2019-07-19)


#### :rocket: New Feature
* `jovo-framework` Adds simpler SSL integration

#### :bug: Bug Fix
* `jovo-core` Fixes sessionData as a copy to the request object bug issue #544
* `jovo-platform-googleassistant` Fixes optional parameters in addAudio

#### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))

## 2.2.13 (2019-07-10)

#### :bug: Bug Fix
* `jovo-platform-dialogflow` [#535](https://github.com/jovotech/jovo-framework/pull/535) Fixes Dialogflow Session Attributes ([@BronxBombers](https://github.com/BronxBombers))
* `jovo-platform-googleassistant` [#539](https://github.com/jovotech/jovo-framework/pull/539) Fixes hasScreenInterface ([@freiSMS](https://github.com/freiSMS))
* `jovo-platform-alexa` Fixes APL directives in combination with InSkillPurchase directives
* `jovo-platform-googleassistant` Fixes ON_HEALTH_CHECK requests issue #517 (again)


#### Committers: 3
- Alex ([@aswetlow](https://github.com/aswetlow))
- BronxBombers ([@BronxBombers](https://github.com/BronxBombers))
- freiSMS ([@freiSMS](https://github.com/freiSMS))


## 2.2.12 (2019-07-01)

#### :rocket: New Feature
* `jovo-platform-dialogflow` [#531](https://github.com/jovotech/jovo-framework/pull/531) Adds Twilio Dialogflow Integration ([@BronxBombers](https://github.com/BronxBombers))


#### :nail_care: Enhancement
* `jovo-framework` [#533](https://github.com/jovotech/jovo-framework/pull/533) Adds possibility to partially exclude and replace the log  ([@Veake](https://github.com/Veake))


#### :bug: Bug Fix
* `jovo-platform-googleassistant` Fixes ON_HEALTH_CHECK requests issue #517
* `jovo-platform-googleassistant` Fixes askForNotification issue #529


#### Committers: 3
- Alex ([@aswetlow](https://github.com/aswetlow))
- Max R. ([@Veake](https://github.com/Veake))
- BronxBombers ([@BronxBombers](https://github.com/BronxBombers))

## 2.2.10 (2019-06-19)


#### :bug: Bug Fix
* `jovo-framework` [#525](https://github.com/jovotech/jovo-framework/pull/525) Fixing a bug in server.js that breaks the express server  ([@daveradical](https://github.com/daveradical))


#### Committers: 1
- daveradical ([@daveradical](https://github.com/daveradical))


## 2.2.9 (2019-06-07)


#### :bug: Bug Fix
* `jovo-core` Fix error in plugin configs (fix issue #521)

 

#### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))


## 2.2.8 (2019-06-05)

#### :nail_care: Enhancement
* `jovo-framework` [#515](https://github.com/jovotech/jovo-framework/pull/515) Adds Conversational Components (BETA)  ([@KaanKC](https://github.com/KaanKC))
* `jovo-core` Updates TSLint rules (WIP)

#### :bug: Bug Fix
* `jovo-platform-googleassistant` Fixes ON_HEALTH_CHECK requests
 

#### Committers: 2
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))

## 2.2.7 (2019-06-03)

## Breaking Changes

* `jovo-cms-googlesheets` Values without variations (one row) previously returned an array with one element. This was not the expected behavior.
Since this version single values are return as a string. (Doesn't break anything if you use the SpeechBuilder)<br><br>
Old version: this.$cms.t('key')[0]\
Fixed version: this.$cms.t('key')


#### :rocket: New Feature
* `jovo-framework` [#503](https://github.com/jovotech/jovo-framework/pull/503) Adds Conversational Components (BETA)  ([@KaanKC](https://github.com/KaanKC))
* `jovo-framework` [#511](https://github.com/jovotech/jovo-framework/pull/511) Adds Input validation ([@rubenaeg](https://github.com/stephen-wilcox))
* `jovo-platform-alexa` [#506](https://github.com/jovotech/jovo-framework/pull/506) Adds hasAutomotive getter ([@natrixx](https://github.com/natrixx))
* `jovo-platform-alexa` [#506](https://github.com/jovotech/jovo-framework/pull/506) Adds viewport info for alexaRequests ([@freiSMS](https://github.com/freiSMS))

#### :nail_care: Enhancement
* `jovo-core` [#507](https://github.com/jovotech/jovo-framework/pull/507) Refactored loading of the config-data ([@Veake](https/github.com/Veake))


#### :bug: Bug Fix
* `jovo-cms-googlesheets` Fix response sheet parser. Single values will be transformed to a string
* `jovo-platform-alexa` [#497](https://github.com/jovotech/jovo-framework/pull/497) Address getReprompt issue for Alexa ([@natrixx](https://github.com/natrixx))
* `jovo-plugin-debugger` [#496](https://github.com/jovotech/jovo-framework/pull/496) Fix AUDIOPLAYER.AlexaSkill.PlaybackFinished intent name in debugger ([@curiousdustin](https://github.com/curiousdustin))

 

#### Committers: 7
- Ruben A. ([@rubenaeg](httpsgithub.comrubenaeg))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Max R. ([@Veake](https://github.com/Veake))
- natrixx ([@natrixx](https://github.com/natrixx))
- Dustin Bahr ([@curiousdustin](https://github.com/curiousdustin))
- freiSMS ([@freiSMS](https://github.com/freiSMS))
- Alex ([@aswetlow](https://github.com/aswetlow))

## 2.2.5 (2019-05-07)

#### :bug: Bug Fix
 `jovo-cms-googlesheets` [#494](https://github.com/jovotech/jovo-framework/pull/494) Fix empty Cells on CMS bug ([@rubenaeg](https/github.com/rubenaeg))

#### Committers 1
- Ruben A. ([@rubenaeg](httpsgithub.comrubenaeg))


## 2.2.4 (2019-05-03)
* `jovo-framework` Improve Conversation test runtime handling (`send(req)`, `sendToServer(req)`, `sendToApp(req, app)`)


## 2.2.3 (2019-05-03)

#### :rocket: New Feature
* `jovo-platform-googleassistant` [#479](https://github.com/jovotech/jovo-framework/pull/479) Add google res getters   ([@natrixx](https://github.com/natrixx))
* `jovo-framework` [#488](https://github.com/jovotech/jovo-framework/pull/488) Send test requests directly to app object (issue #469)  ([@stephen-wilcox](https://github.com/stephen-wilcox))

#### :nail_care: Enhancement
* `jovo-platform-dialogflow`, `jovo-platform-googleassistant` Improve robustness of the Dialogflow/Googleassistant integration

#### :bug: Bug Fix
* `jovo-platform-dialogflow` Fix Dialogflow testsuite issue #481
* `jovo-platform-dialogflow` Fix missing `X.original` input parameter
* `jovo-framework` [#490](https://github.com/jovotech/jovo-framework/pull/490) Add missing dependencies (in dev setup) ([@stephen-wilcox](https://github.com/stephen-wilcox))


#### Committers: 3
- natrixx ([@natrixx](https://github.com/natrixx))
- Stephen Wilcox ([@stephen-wilcox](https://github.com/stephen-wilcox))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.2.2 (2019-04-18)


#### :nail_care: Enhancement
* `jovo-platform-alexa` [#470](https://github.com/jovotech/jovo-framework/pull/470) Add Alexa response getters  ([@natrixx](https://github.com/natrixx))
* `jovo-framework` [#474](https://github.com/jovotech/jovo-framework/pull/474) Adds helpers to check for request types ([@KaanKC](https://github.com/KaanKC))
* `jovo-framework` [#463](https://github.com/jovotech/jovo-framework/pull/463) Refactoring and unit tests ([@KaanKC](https://github.com/KaanKC))
* `jovo-airtable-cms` [#461](https://github.com/jovotech/jovo-framework/pull/461) Add AirtableCMS Unit Tests ([@rubenaeg](https://github.com/rubenaeg))
* `jovo-platform-alexa` [#475](https://github.com/jovotech/jovo-framework/pull/475) Adds CanfulfillIntentRequest example | 🐛 Sets canFulfillRequest() param to possibly undefined ([@KaanKC](https://github.com/KaanKC))


#### :bug: Bug Fix
* `jovo-db-firestore` [#473](https://github.com/jovotech/jovo-framework/pull/473) Fix Saves updatedAt only if it's defined (issue #472) ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-dialogflow` [#464](https://github.com/jovotech/jovo-framework/pull/464) Fixed hasState(), hasSessionData() (issue #462) ([@natrixx](https://github.com/natrixx))
* `jovo-db-mysql` Fix default connection config


#### Committers: 3
- natrixx ([@natrixx](https://github.com/natrixx))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))



## 2.2.1 (2019-04-08)

#### :bug: Bug Fix
* `jovo-framework` Fix unit testing FileDB initialization (issue #455)


#### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.2.0 (2019-04-04)

#### :rocket: New Feature
* `jovo-framework` [#446](https://github.com/jovotech/jovo-framework/pull/446) DB save optimization only saves to db if changes were made  ([@KaanKC](https://github.com/KaanKC))
* `jovo-framework` [#442](https://github.com/jovotech/jovo-framework/pull/442) Update addText to accept arbitrary SSML wrapping elements  ([@jnthnwn](https://github.com/jnthnwn))
* `jovo-framework` [#451](https://github.com/jovotech/jovo-framework/pull/451) Adds updatedAt to databases  ([@KaanKC](https://github.com/KaanKC))



#### :nail_care: Enhancement
* `jovo-framework` Improved Typescript compatibility (Examples)
* `jovo-cms-googlesheets` [#450](https://github.com/jovotech/jovo-framework/pull/450) Add Unit Tests for GoogleSheetsCMS integration ([@rubenaeg](https://github.com/rubenaeg))
* `jovo-framework` [#443](https://github.com/jovotech/jovo-framework/pull/443) Tests for db integrations  ([@KaanKC](https://github.com/KaanKC))



#### Committers: 4
- Jonathan Wan ([@jnthnwn](https://github.com/jnthnwn))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))



jnthnwn
## 2.1.5 (2019-03-27)

#### :rocket: New Feature
* `jovo-cms-airtable` [#432](https://github.com/jovotech/jovo-framework/pull/432) Adds Platform-specific Responses, CMS-Caching for Airtable Integration ([@rubenaeg](https://github.com/rubenaeg))


#### :bug: Bug Fix
* `jovo-platform-dialogflow` Fix session handling in Dialogflow contexts (issue #430)
* `jovo-platform-alexa` Fix CanFulFillIntent response object (issue #438)


#### Committers: 2
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.1.4 (2019-03-22)

#### :rocket: New Feature
* [#428](https://github.com/jovotech/jovo-framework/pull/428) :sparkles: CMS-Caching, Platform-Specific Responses ([@rubenaeg](https://github.com/rubenaeg))

#### :bug: Bug Fix
* [#428](https://github.com/jovotech/jovo-framework/pull/428) I18Next Tests ([@rubenaeg](https://github.com/rubenaeg))
* `jovo-db-dynamodb` Fix mandatory config property
* `jovo-framework` Fix Typescript compilation issues


#### Committers: 1
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))


## 2.1.3 (2019-03-14)

#### :nail_care: Enhancement
* `jovo-db-mysql` [#419](https://github.com/jovotech/jovo-framework/pull/419) Increased storage to MEDIUMTEXT  ([@dominik-meissner](https://github.com/dominik-meissner))
* `all` Improve publish process for framework contributions

#### Committers: 2
- [@dominik-meissner](https://github.com/dominik-meissner)
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.1.2 (2019-03-12)

#### :rocket: New Feature
* `jovo-cms-airtable` [#411](https://github.com/jovotech/jovo-framework/pull/411) ✨ Adds Airtable CMS Integration ([@KaanKC](https://github.com/KaanKC))

#### :bug: Bug Fix
* `jovo-platform-googleassistant` Fixes lifespan of session context

#### Committers: 2
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))




## 2.1.1 (2019-03-11)


:nail_care: Enhancement
* `jovo-framework` [#414](https://github.com/jovotech/jovo-framework/pull/414) ♻️ GoogleSheetsCMS integration should reject JovoError instead of string ([@KaanKC](https://github.com/KaanKC))
* `jovo-core` [#415](https://github.com/jovotech/jovo-framework/pull/415) 🐛 Fixes: JovoError doesn't print module ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-googleassistant` [#410](https://github.com/jovotech/jovo-framework/pull/410) 🐛 Fixes Google Assistant handler merge #412  ([@kouz75](https://github.com/kouz75))
* `jovo-platform-alexa` Fixes ContactAPI access token bug
* `jovo-platform-googleassistant` Fixes lifespan of session context

#### Committers: 3
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- scouzinier ([@kouz75](https://github.com/kouz75))
- Alex ([@aswetlow](https://github.com/aswetlow))


## 2.1.0 (2019-03-05)

#### :rocket: New Feature
* `jovo-platform-alexa` [#384](https://github.com/jovotech/jovo-framework/pull/384) Adds Amazon Pay helper methods and docs ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-googleassistant` [#406](https://github.com/jovotech/jovo-framework/pull/406) Adds Google Transactions for Digital Goods  ([@renatoalencar](https://github.com/renatoalencar))
* `jovo-framework` Adds database integration to unit tests (`conversion.$user.$data`)
* `jovo-platform-dialogflow` Add custom payloads for Dialogflow agents (starting with Facebook Messenger and Slack) - Work in progress


#### :bug: Bug Fix

* `jovo-platform-googleassistant` [#393](https://github.com/jovotech/jovo-framework/pull/393) Adds missing ON_DATETIME intent | Adds askForDateTime & askForConfirmation  ([@KaanKC](https://github.com/KaanKC))
* `jovo-framework` [#398](https://github.com/jovotech/jovo-framework/pull/398) Fixes setAlexaHandler/setGoogleAssistantHandler with a list of objects. ([@kouz75 ](https://github.com/kouz75 ))
* `jovo-platform-googleassistant` [#401](https://github.com/jovotech/jovo-framework/pull/401) Fixes askForPlace(), adds helper, tests and docs  ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-alexa` [#407](https://github.com/jovotech/jovo-framework/pull/407) Fixes fix missing playerActivity  ([@kouz75](https://github.com/kouz75))
* `jovo-platform-googleassistant` Fixes GoogleAction user id generation #390
* `jovo-db-mysql` Fixes NEW_USER bug in MySQL integration
* `jovo-platform-alexa` Fixes typo in PermissionCard getter
* `jovo-plugin-debugger` Fixes audioplayer requests in Jovo Debugger


#### :nail_care: Enhancement
* `jovo-framework` Adds DynamoDB DAX support 
* `jovo-framework` Adds AWS X-Ray #238
* `jovo-framework` Adds keepSessionDataOnSessionEnded (keeps session data in response object)
* `jovo-framework` Adds getRoute and getMappedIntentName helpers
* `jovo-platform-alexa` Adds isDialogX functions #347
* `jovo-platform-alexa` Adds askFormRemindersPermissionCard
* `jovo-plugin-debugger` Adds askFormRemindersPermissionCard


#### Committers: 4
- Renato Alencar ([@renatoalencar](https://github.com/renatoalencar))
- scouzinier ([@kouz75](https://github.com/kouz75))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.0.16 (2019-02-21)

#### :rocket: New Feature
* `jovo-platform-googleassistant` [#383](https://github.com/jovotech/jovo-framework/pull/383) Support to daily updates and daily routines ([@renatoalencar](https://github.com/renatoalencar))
* `jovo-platform-googleassistant` [#384](https://github.com/jovotech/jovo-framework/pull/384) Adds Google Action Push Notifications ([@KaanKC](https://github.com/KaanKC))
* `jovo-platform-alexa` [#387](https://github.com/jovotech/jovo-framework/pull/387) Adds Alexa Geolocation support (also known as Location Services) ([@KaanKC](https://github.com/KaanKC))
* `jovo-framework` [#375](https://github.com/jovotech/jovo-framework/pull/375) Implemented Azure Functions context logging ([@IGx89](https://github.com/IGx89))


#### :bug: Bug Fix

* `jovo-cms-i18next` Fixed i18n file extension bug (in Typescript projects)
* `jovo-platform-alexa` Fixed directives override (DisplayTemplates)


#### :nail_care: Enhancement
* `jovo-platform-framework` [#389](https://github.com/jovotech/jovo-framework/pull/389) Improve middleware hooks  ([@aswetlow](https://github.com/aswetlow))
* `jovo-platform-alexa` Added `shouldEndSession(boolean | null)` to handle the shouldEndSession property explicitly
* `jovo-platform-alexa` Added `getSkillId()` helper method

#### Committers: 4
- Renato Alencar ([@renatoalencar](https://github.com/renatoalencar))
- Matthew Lieder ([@IGx89](https://github.com/IGx89))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 2.0.15 (2019-02-12)

#### :rocket: New Feature
* `jovo-platform-alexa` [#379](https://github.com/jovotech/jovo-framework/pull/379) Adds Alexa Proactive Event API ([@KaanKC](https://github.com/KaanKC))

#### :bug: Bug Fix

* `jovo-framework` Fixed `Unhandled()` delegation in nested states bug
* `jovo-framework` Fixed error delegation to host 
* `jovo-cms-i18next` Added configurable i18next config properties
* `jovo-platform-alexa` Fixed error code in AlexaDeviceAddress service


#### :nail_care: Enhancement
* `jovo-framework` Added `console.dd(obj)` (dump and die). Logs object and calls process.exit(). (Same as dd() in Laravel)
* `jovo-cms-i18next` Updated version of i18next module to 14.1.0


#### Committers: 2
- Alex ([@aswetlow](https://github.com/aswetlow))
- Kaan Kilic ([@KaanKC](https://github.com/KaanKC))


## 2.0.14 (2019-02-01)

#### :rocket: New Feature
* `jovo-framework` Added this.skipIntentHandling() in NEW_SESSION, NEW_USER, ON_REQUEST

#### :bug: Bug Fix

* `jovo-framework` Fixed returns in NEW_SESSION, NEW_USER, ON_REQUEST (skips further intent handling)

#### :nail_care: Enhancement

* `jovo-db-mysql' Refactored MySQL integration (ConnectionPool)
*  Improved logging in `jovo-cms-i18next`, `jovo-db-filedb`, `jovo-db-mysql`, `jovo-db-dynamodb`

#### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))


## 2.0.13 (2019-01-29)

#### :rocket: New Feature
* `jovo-cms-spreadsheets` [#370](https://github.com/jovotech/jovo-framework/pull/370) Added ObjectArray sheet (google-cms-spreadsheets) ([@aswetlow](https://github.com/aswetlow))

#### :bug: Bug Fix
* `jovo-framework` [#370](https://github.com/jovotech/jovo-framework/pull/370) Fixed setLocale in conversation method ([@aswetlow](https://github.com/aswetlow))
* `jovo-framework` [#370](https://github.com/jovotech/jovo-framework/pull/370) Fixed special characters in Cloudwatch logs ([@aswetlow](https://github.com/aswetlow))
* `jovo-core` [#370](https://github.com/jovotech/jovo-framework/pull/370) Updated internal Logging Class ([@aswetlow](https://github.com/aswetlow))
* `jovo-core` [#370](https://github.com/jovotech/jovo-framework/pull/370) Fixed getSpeech()  ([@aswetlow](https://github.com/aswetlow))

* `jovo-platform-googleassistant` [#368](https://github.com/jovotech/jovo-framework/pull/368) Fix displayText not display ([@kouz75](https://github.com/kouz75))


#### Committers: 2
- Alex ([@aswetlow](https://github.com/aswetlow))
- scouzinier ([@kouz75](https://github.com/kouz75))

## 2.0.12 (2019-01-24)

#### :bug: Bug Fix
* [#364](https://github.com/jovotech/jovo-framework/pull/364) Bugfixes ([@aswetlow](https://github.com/aswetlow))
   * `jovo-framework` app.onRequest() and app.onResponse()
   * `jovo-platform-alexa` Added deleteShouldEndSession() to $alexaSkill
   * `jovo-platform-googleassistant` Fix multiple reprompts in Google Assistant ask() #359

* `jovo-platform-googleassistant` [#361](https://github.com/jovotech/jovo-framework/pull/361) Typo removed ([@dominik-meissner](https://github.com/dominik-meissner))

#### Committers: 2
- Alex ([@aswetlow](https://github.com/aswetlow))
- [@dominik-meissner](https://github.com/dominik-meissner)



---


## 2.0.10 (January 18, 2019)
* `jovo-db-firestore` [#350](https://github.com/jovotech/jovo-framework-nodejs/pull/350) ✨ Adds Google Firestore integration [@KaanKC](https://github.com/IGx89)
* `jovo-core` [#349](https://github.com/jovotech/jovo-framework-nodejs/pull/349) TestSuite is now generic, with platform-specific interfaces available [@IGx89](https://github.com/IGx89)
* `jovo-platform-alexa` Fixed hasScreenInterface check in DisplayTemplate requests
* `jovo-plugin-debugger` Added setAPLInterface to Echo Show/Echo Spot requests
* `jovo-platform-alexa` Added `addAplDirective()` helper method


## 2.0.9 (January 16, 2019)
* `jovo-core` Fixed throw Error in parallel execution
* `jovo-core` Fixed middleware bug issue #346
* `jovo-db-filedb` Fixed null values in db.json after delete


## 2.0.8 (January 15, 2019)
* `jovo-platform-alexa` [#344](https://github.com/jovotech/jovo-framework-nodejs/pull/344) showVideo(...) should not drop session attributes [@IGx89](https://github.com/IGx89)
* `jovo-core` Refactored handler core to provide a request-specific (Alexa handler, GoogleAssistant handler) handler execution
* `jovo-core` Fixed log level conversion process.env.JOVO_LOG_LEVEL = 'verbose'
* `jovo-platform-alexa` Fixed hasSlotValue(key) bug in Alexa dialog interface
* `jovo-cms-googlesheets` Fixed GoogleSheets multiple responses sheets bug
* `jovo-framework` Updated gulp file to version 4  [@janober](https://github.com/janober)


## 2.0.7 (January 15, 2019)
* Messed up release, sorry


## 2.0.6 (January 10, 2019)
* `jovo-platform-alexa` [#338](https://github.com/jovotech/jovo-framework-nodejs/pull/338) Fixed issue where $gameEngine.respond would drop the session attributes [@IGx89](https://github.com/IGx89)
* `jovo-db-cosmosdb` [#341](https://github.com/jovotech/jovo-framework-nodejs/pull/341) Added Azure Cosmos DB integration [@KaanKC](https://github.com/KaanKC)
* `jovo-platform-alexa` [#336](https://github.com/jovotech/jovo-framework-nodejs/pull/336) Wrong response.httpStatus & Typo removed  [@dominik-meissner](https://github.com/dominik-meissner)
* `jovo-framework` Improved error output (work in progress)


## 2.0.5 (January 08, 2019)
* `jovo-framework` Added simple `verbose` mode (work in progress)
* `jovo-platform-alexa` Fixed AudioPlayer metadata bug (issue #328)
* `jovo-platform-alexa` Fixed Alexa cards bug
* `jovo-platform-alexa` Fixed SpeechBuilder object in DialogInterface methods
* `jovo-platform-dialogflow` Fixed session handling


## 2.0.4 (January 03, 2019)

* `jovo-platform-alexa` [#315](https://github.com/jovotech/jovo-framework-nodejs/pull/315) Image shouldn't be required for ListTemplate1 [@IGx89](https://github.com/IGx89)
* `jovo-framework` Fixed examples and declaration files
* `jovo-platform-alexa` Fixed Multiple directives bug (issue #317)
* `jovo-platform-alexa` Added getReminder(alertToken) method
* `jovo-platform-googleassistant` Added $googleAction.$user helper methods
* `jovo-platform-googleassistant` Added more unit tests


## 2.0.3 (January 02, 2019)

* `jovo-cms-i18next` Added js language resource file compatibility
* `jovo-plugin-debugger` Changed debugger.json file path to `/project/debugger.json`
* `jovo-framework` `jovo-platform-alexa` Added missing v1 methods (`$user.isNewUser()`, `$alexaSkill.getEndReason()`)
* `jovo-platform-alexa` Fixed incorrect responses bug
* `jovo-framework` Fixed `intentsToSkipUnhandled` bug
* `jovo-analytics-dashbot` Fixed Dashbot import bug
* `jovo-framework` Fixed example projects folder structure
* `jovo-framework` [#314](https://github.com/jovotech/jovo-framework-nodejs/pull/314) Fix for intent exception causing unhandled rejection [@IGx89](https://github.com/IGx89)
* `jovo-platform-alexa` [#313](https://github.com/jovotech/jovo-framework-nodejs/pull/313) SimpleCard didn't include content [@KaanKC](https://github.com/KaanKC)
* `jovo-platform-alexa` [#311](https://github.com/jovotech/jovo-framework-nodejs/pull/311) Fix APL directives with v2 [@kouz75](https://github.com/kouz75)


## 2.0.2 (December 22, 2018)

* `jovo-platform-alexa` Added v1 methods to v2
* `jovo-db-dynamodb` Fixed AWS config
* `jovo-framework` [#307](https://github.com/jovotech/jovo-framework-nodejs/pull/307) Fixes: Plugin config couldn't be added in config.js [@KaanKC](https://github.com/KaanKC)
