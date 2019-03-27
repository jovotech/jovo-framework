# Jovo Framework Changelog


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
* `jovo-platform-airtable` [#411](https://github.com/jovotech/jovo-framework/pull/411) ✨ Adds Airtable CMS Integration ([@KaanKC](https://github.com/KaanKC))

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
