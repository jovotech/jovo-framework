# Jovo Framework Changelog

### Latest Prerelease Framework Version: 4.0.0-alpha.14

## 2021-06-02

##### `@jovotech/framework [4.0.0-alpha.14]`

- [6a44247](https://github.com/jovotech/jovo-framework/commit/6a44247ca0994096baa1eb11119dfd15adef42f8) :sparkles: Support generating APL from generic output
- [f2eac6f](https://github.com/jovotech/jovo-framework/commit/f2eac6f026d0dd140c9a5d2399ec551cf9f3d8d4) :sparkles: Implement handling of APL-quick-replies for Alexa 
- [d1ab058](https://github.com/jovotech/jovo-framework/commit/d1ab0582403539f3e3a5eebca4fd52f848de10d5) :bug: Fix bug that caused related platform to be loaded from App instead of HandleRequest - Caused changes in mount to be omitted


## 2021-06-01

##### `@jovotech/framework [4.0.0-alpha.13]`
- [4f1b976](https://github.com/jovotech/jovo-framework/commit/4f1b97657d49f97e7453428e7449f7ed1e2c9dc5) :bug: Fix routing bug - Occurred when a global route could not be found and `UNHANDLED` was looked for

##### `@jovotech/platform-googleassistant [4.0.0-alpha.13]`
- [896c86f](https://github.com/jovotech/jovo-framework/commit/896c86f0a61fab4e71de02debc2bfed6d8e1974e) :bug: Fix potential bugs

##### `@jovotech/platform-googlebusiness [4.0.0-alpha.13]`
- [896c86f](https://github.com/jovotech/jovo-framework/commit/896c86f0a61fab4e71de02debc2bfed6d8e1974e) :bug: Fix potential bugs

----

### Latest Stable Framework Version: 3.3.0

## 2020-12-03

##### `jovo-framework [3.3.0]` 
- [#868](https://github.com/jovotech/jovo-framework/pull/868) Abstract the initialization of the platform handlers into a single function ([@m-ripper](https://github.com/m-ripper))
- [#869](https://github.com/jovotech/jovo-framework/pull/869) Abstract quick replies ([@m-ripper](https://github.com/m-ripper))

##### `jovo-db-postgres [3.3.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-db-postgres) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-db-postgres) | [npm](https://www.npmjs.com/package/jovo-db-postgres)
- [#859](https://github.com/jovotech/jovo-framework/pull/859) Adds PostgreSQL integration ([@KaanKC](https://github.com/KaanKC))

##### `jovo-platform-googlebusiness [3.3.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googlebusiness) | [npm](https://www.npmjs.com/package/jovo-platform-googlebusiness)
- [#870](https://github.com/jovotech/jovo-framework/pull/870) Use postbackData of suggestions if possible ([@KaanKC](https://github.com/KaanKC))

##### `jovo-platform-googleassistantconv [3.3.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- [#871](https://github.com/jovotech/jovo-framework/pull/871) Add missing and broken Google Conversational Action features ([@aswetlow](https://github.com/aswetlow))

##### `jovo-plugin-debugger [3.3.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-plugin-debugger) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-plugin-debugger) | [npm](https://www.npmjs.com/package/jovo-plugin-debugger)
- [#866](https://github.com/jovotech/jovo-framework/pull/866) Add `strip-ansi` to remove ANSI-codes from messages that are sent to the Jovo-Debugger ([@m-ripper](https://github.com/m-ripper))


## 2020-11-20

##### `jovo-platform-googleassistantconv [3.2.4]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- [#862](https://github.com/jovotech/jovo-framework/pull/862) Fix removeState ([@aswetlow](https://github.com/aswetlow))

##### `jovo-platform-googleassistant [3.2.3]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistant) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistant) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistant) 
- [#862](https://github.com/jovotech/jovo-framework/pull/862) Fix getUserId() in GoogleActionRequest class ([@aswetlow](https://github.com/aswetlow))

##### `jovo-framework [3.2.2]` 
- [#862](https://github.com/jovotech/jovo-framework/pull/862) Fix error in passing headers from AWS API Gateway ([@aswetlow](https://github.com/aswetlow))


## 2020-11-16

##### `jovo-platform-googleassistantconv [3.2.3]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- Adds Interactive Canvas to Google Conversational Actions ([@aswetlow](https://github.com/aswetlow))


## 2020-11-10

##### `jovo-platform-alexa [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-alexa) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-alexa) | [npm](https://www.npmjs.com/package/jovo-platform-alexa)
- [#855](https://github.com/jovotech/jovo-framework/pull/855) :bug: Fix ignored APL-A directive ([@aswetlow](https://github.com/aswetlow))


## 2020-11-10

##### `jovo-platform-alexa [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-alexa) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-alexa) | [npm](https://www.npmjs.com/package/jovo-platform-alexa)
- [#855](https://github.com/jovotech/jovo-framework/pull/855) :bug: Fix ignored APL-A directive ([@aswetlow](https://github.com/aswetlow))


##### `jovo-platform-googleassistantconv [3.2.2]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- [#856](https://github.com/jovotech/jovo-framework/pull/856) Fixes several Google Conversational Actions issues ([@aswetlow](https://github.com/aswetlow))


##### `jovo-platform-dialogflow [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-dialogflow) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-dialogflow) | [npm](https://www.npmjs.com/package/jovo-platform-dialogflow) 
- [#857](https://github.com/jovotech/jovo-framework/pull/857) Fixes missing $rawResponseJson handling ([@aswetlow](https://github.com/aswetlow))



## 2020-11-05


##### `jovo-client-web [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-client-web) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-client-web) | [npm](https://www.npmjs.com/package/jovo-client-web)
[#848](https://github.com/jovotech/jovo-framework/pull/848) Improve Web-Client browser-detection ([@m-ripper](https://github.com/m-ripper))

##### `jovo-platform-googleassistant [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistant) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistant) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistant) 
- Fix Transaction API v2/v3 incomptibility 

##### `jovo-platform-googleassistantconv [3.2.1]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- Fix missing locale in push notifications object


## 2020-10-29

## 3.2 Jovo for Web 
[Announcement](https://www.jovo.tech/news/2020-10-29-jovo-for-web-v3-2) 



## 2020-10-23

### :sparkles: New Features

##### `jovo-platform-dialogflow [3.1.5]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-dialogflow) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-dialogflow) | [npm](https://www.npmjs.com/package/jovo-platform-dialogflow) 
- [#838](https://github.com/jovotech/jovo-framework/pull/838) Genesys integration [@dominik-meissner](https://github.com/dominik-meissner))

### :nail_care: Enhancements

##### `jovo-dialogflow-web [3.1.5]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-web) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web) | [npm](https://www.npmjs.com/package/jovo-platform-web) 
- [#839](https://github.com/jovotech/jovo-framework/pull/839) Add re-export to jovo-platform-web ([@m-ripper](https://github.com/m-ripper))



## 2020-10-16

### :sparkles: New Features

##### `jovo-analytics-onedash [3.1.4]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-analytics-onedash) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-analytics-onedash) | [npm](https://www.npmjs.com/package/jovo-analytics-onedash) 
- [#826](https://github.com/jovotech/jovo-framework/pull/826) OneDash analytics ([@StepanU](https://github.com/StepanU), [@m-ripper](https://github.com/m-ripper))


### :nail_care: Enhancements

##### `jovo-framework [3.1.4]` 
- [#835](https://github.com/jovotech/jovo-framework/pull/835) ✨ Implement configurable user-session-data-key ([@m-ripper](https://github.com/m-ripper))

### :bug: Bug Fixes

##### `jovo-core [3.1.4]`
- Fix escaping ampersand in urls in SpeechBuilder  (Fixes #823 and #816)


## 2020-10-08

### :nail_care: Enhancements

##### `jovo-platform-googleassistantconv [3.1.3]` 
- [#831](https://github.com/jovotech/jovo-framework/pull/831) :recycle: Enhance Google AssisConversational Actions ([@aswetlow](https://github.com/aswetlow))


## 2020-10-02

### :sparkles: New Features

##### `jovo-platform-googleassistantconv [3.1.2-alpha.0]` 
- [#829](https://github.com/jovotech/jovo-framework/pull/829) :sparkles: Work In Progress: Google Assistant Conversational Actions ([@aswetlow](https://github.com/aswetlow))

## 2020-09-29

### :boom: Breaking Changes

##### `jovo-platform-messenger [3.1.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-messenger) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-messenger) | [npm](https://www.npmjs.com/package/jovo-platform-messenger)

- [#817](https://github.com/jovotech/jovo-framework/pull/817) :recycle: :sparkles: Refactor Facebook Messenger platform - asynchronous Responses ([@m-ripper](https://github.com/m-ripper))

### :sparkles: New Features

##### `jovo-platform-dialogflow [3.1.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-dialogflow) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-dialogflow) | [npm](https://www.npmjs.com/package/jovo-platform-dialogflow)

- [#820](https://github.com/jovotech/jovo-framework/pull/820) :sparkles: Add Dialogflow Phone Gateway integration ([@stephen-wilcox](https://github.com/stephen-wilcox))

##### `jovo-platform-web [3.1.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-web) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-web) | [npm](https://www.npmjs.com/package/jovo-platform-web)
- [#824](https://github.com/jovotech/jovo-framework/pull/824) :sparkles: Implement web-platform ([@m-ripper](https://github.com/m-ripper))

##### `jovo-framework [3.1.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-framework) | [npm](https://www.npmjs.com/package/jovo-framework)
- [#827](https://github.com/jovotech/jovo-framework/pull/827) :sparkles: Make fancy JSON output ([@aswetlow](https://github.com/aswetlow))
- [#828](https://github.com/jovotech/jovo-framework/pull/828) :label: Add type for user-data ([@m-ripper](https://github.com/m-ripper))

##### `jovo-platform-googleassistantconv [3.1.0-alpha.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistantconv) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistantconv)
- [#829](https://github.com/jovotech/jovo-framework/pull/829) :sparkles: Work In Progress: Google Assistant Conversational Actions ([@aswetlow](https://github.com/aswetlow))

### :bug: Bug Fixes

##### `jovo-framework [3.1.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-framework) | [npm](https://www.npmjs.com/package/jovo-framework)
- [#818](https://github.com/jovotech/jovo-framework/pull/818) :bug: Fix saving of user-session-id ([@m-ripper](https://github.com/m-ripper))

##### `jovo-db-firestore [3.1.0-alpha.0]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-db-firestore) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-db-firestore) | [npm](https://www.npmjs.com/package/jovo-db-firestore)
- [#822](https://github.com/jovotech/jovo-framework/pull/822) :bug: Fix potential bug for Firestore ([@m-ripper](https://github.com/m-ripper))

<br>

## 2020-09-17

### :bug: Bug Fix

##### `jovo-analytics-googleanalytics [3.0.32]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-analytics-googleanalytics) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-analytics-googleanalytics) | [npm](https://www.npmjs.com/package/jovo-analytics-googleanalytics)
* [#812](https://github.com/jovotech/jovo-framework/pull/812) Fix endreason for "stop" not set ([@freiSMS](https://github.com/freiSMS))

##### `jovo-platform-googleassistant [3.0.30]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googleassistant) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googleassistant) | [npm](https://www.npmjs.com/package/jovo-platform-googleassistant)
* Fix getDeliveryAddress in Transactions API ([@aswetlow](https://github.com/aswetlow))   


<br> 

## 2020-09-01

### :bug: Bug Fix

##### `jovo-platform-googlebusiness [3.0.9]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googlebusiness) | [npm](https://www.npmjs.com/package/jovo-platform-googlebusiness)
* [#810](https://github.com/jovotech/jovo-framework/pull/810) Implement check for duplicated messages for GoogleBusiness ([@m-ripper](https://github.com/m-ripper))

## 2020-08-31

### :sparkles: New Features

##### `jovo-analytics-googleanalytics [3.0.31]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-analytics-googleanalytics) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-analytics-googleanalytics) | [npm](https://www.npmjs.com/package/jovo-analytics-googleanalytics)
* [#804](https://github.com/jovotech/jovo-framework/pull/804) Google Analytics Features and Fixes ([@freiSMS](https://github.com/freiSMS))

##### `jovo-client-web-vue [3.0.32]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-client-web-vue) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-clients/jovo-client-web-vue) | [npm](https://www.npmjs.com/package/jovo-client-web-vue)
* [#808](https://github.com/jovotech/jovo-framework/pull/808) Move Vue to peerDependencies ([@m-ripper](https://github.com/m-ripper))


## 2020-08-21


### :sparkles: New Features

##### `jovo-platform-bixby [3.0.25]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-bixby) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-bixby) | [npm](https://www.npmjs.com/package/jovo-platform-bixby)
* [#799](https://github.com/jovotech/jovo-framework/pull/799) Add SSML Support for Bixby ([@rubenaeg](https://github.com/rubenaeg))

##### `jovo-platform-googlebusiness [3.0.7]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googlebusiness) | [npm](https://www.npmjs.com/package/jovo-platform-googlebusiness)
* [#803](https://github.com/jovotech/jovo-framework/pull/803) Implement asynchronous responses for GoogleBusiness ([@m-ripper](https://github.com/m-ripper))   

<br><br>
### :nail_care: Enhancements

##### `jovo-platform-googlebusiness [3.0.7]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-googlebusiness) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-googlebusiness) | [npm](https://www.npmjs.com/package/jovo-platform-googlebusiness)
* [#791](https://github.com/jovotech/jovo-framework/pull/791) Replace `googleapis` with `google-auth-library` ([@m-ripper](https://github.com/m-ripper))   

##### `jovo-nlu-dialogflow [3.0.21]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-nlu-dialogflow) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-nlu-dialogflow) | [npm](https://www.npmjs.com/package/jovo-nlu-dialogflow)
* [#793](https://github.com/jovotech/jovo-framework/pull/793) Improve DialogflowNlu session-id for detectIntent-requests ([@m-ripper](https://github.com/m-ripper))   

##### `jovo-analytics-dashbot [3.0.26]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-analytics-dashbot) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-analytics-dashbot) | [npm](https://www.npmjs.com/package/jovo-analytics-dashbot)
* [#806](https://github.com/jovotech/jovo-framework/pull/806) Add dashbotUser to userStorage ([@aswetlow](https://github.com/aswetlow))   


<br>

### :bug: Bug Fix
 
##### `jovo-platform-facebookmessenger [3.0.7]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-facebookmessenger) | [npm](https://www.npmjs.com/package/jovo-platform-facebookmessenger)
* [#792](https://github.com/jovotech/jovo-framework/pull/792) Fix FacebookMessenger bug ([@m-ripper](https://github.com/m-ripper))   


##### `jovo-asr-azure [3.0.21]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-asr-azure) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-asr-azure) | [npm](https://www.npmjs.com/package/jovo-asr-azure)
* [#792](https://github.com/jovotech/jovo-framework/pull/792) Fix FacebookMessenger bug ([@m-ripper](https://github.com/m-ripper))   


##### `jovo-slu-lex [3.0.23]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-slu-lex) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-slu-lex) | [npm](https://www.npmjs.com/package/jovo-slu-lex)
* [#802](https://github.com/jovotech/jovo-framework/pull/802) Fix initialization bug ([@m-ripper](https://github.com/m-ripper))   

##### `jovo-tts-polly [3.0.22]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-tts-polly) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-tts-polly) | [npm](https://www.npmjs.com/package/jovo-tts-polly)
* [#802](https://github.com/jovotech/jovo-framework/pull/802) Fix configuration bug ([@m-ripper](https://github.com/m-ripper))   


##### `jovo-platform-facebookmessenger [3.0.7]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-facebookmessenger) | [npm](https://www.npmjs.com/package/jovo-platform-facebookmessenger)
* [#792](https://github.com/jovotech/jovo-framework/pull/792) Fix FacebookMessenger bug ([@m-ripper](https://github.com/m-ripper))   

##### `jovo-platform-alexa [3.0.30]` [Jovo Marketplace](https://www.jovo.tech/marketplace/jovo-platform-alexa) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-platforms/jovo-platform-alexa) | [npm](https://www.npmjs.com/package/jovo-platform-alexa)
* [#806](https://github.com/jovotech/jovo-framework/pull/806) Fix getSkillId with audio player requests ([@aswetlow](https://github.com/aswetlow))   

##### `jovo-framework [3.0.23]` [Jovo Marketplace](https://www.jovo.tech/marketplace) | [GitHub](https://github.com/jovotech/jovo-framework/tree/master/jovo-framework) | [npm](https://www.npmjs.com/package/jovo-framework)
* [#806](https://github.com/jovotech/jovo-framework/pull/806) Fix store sessionData in DB ([@aswetlow](https://github.com/aswetlow))   


 ### Committers: 3
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))
- Alex ([@aswetlow](https://github.com/aswetlow))


---


## 3.0.20 (2020-07-21)

#### :sparkles: New Features
 * `jovo-platform-googlebusiness` [#786](https://github.com/jovotech/jovo-framework/pull/786) Adds Google Business Messages integration ([@KaanKC](https://github.com/KaanKC))  

 #### Committers: 1
- Kaan Killic ([@KaanKC](https://github.com/KaanKC))

## 3.0.18 (2020-05-28)

#### :bug: Bug Fix
 * `jovo-db-platformstorage` [#755](https://github.com/jovotech/jovo-framework/pull/755) Fixed PlatformStorage bug ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-client-web` [#749](https://github.com/jovotech/jovo-framework/pull/749) Fixed web client bug ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-client-web` [#764](https://github.com/jovotech/jovo-framework/pull/764) Added fix for windows bug that would cause first second to be omitted ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-facebookmessenger` [#764](https://github.com/jovotech/jovo-framework/pull/764) Fixed bug that wrong config would be used ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-facebookmessenger` [#766](https://github.com/jovotech/jovo-framework/pull/766) Improved profile-loading ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-core` [#767](https://github.com/jovotech/jovo-framework/pull/767) Fixed bug that would cause CorePlatformRequests to be handled by Alexa ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-framework` [#775](https://github.com/jovotech/jovo-framework/pull/775) Unexpected .addAudio() behaviour ([@AndresContreras96](https://github.com/AndresContreras96), [@m-ripper](https://github.com/m-ripper))  


#### :nail_care: Enhancements
 * `jovo-platform-bixby` [#742](https://github.com/jovotech/jovo-framework/pull/742) Add _JOVO_TEXT_ to return non SSML text ([@rmtuckerphx](https://github.com/rmtuckerphx))  
 * `jovo-db-dynamodb` [#751](https://github.com/jovotech/jovo-framework/pull/751) Add advanced config to support key overloading ([@rmtuckerphx](https://github.com/rmtuckerphx))  
 * `jovo-framework` [#781](https://github.com/jovotech/jovo-framework/pull/781) Normalize configuration-handling & error-messages of ASR-, NLU-, SLU- and TTS-integrations ([@m-ripper](https://github.com/m-ripper))  


 #### Committers: 3
- Mark Tucker ([@rmtuckerphx](https://github.com/rmtuckerphx))
- AndresContreras96 ([@AndresContreras96](https://github.com/AndresContreras96))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 3.0.17 (2020-05-13)

#### :bug: Bug Fix
 * `jovo-analytics-chatbase` [#743](https://github.com/jovotech/jovo-framework/pull/743) Chatbase: used wrong helper to access google user id ([@KaanKC](https://github.com/KaanKC))  
 * `jovo-client-web` [#745](https://github.com/jovotech/jovo-framework/pull/745) Fixed Safari-related bugs for the web-client ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-dialogflow` Fix missing handleRequest parameter 
 * `jovo-platform-alexa` Fix http status in ReminderAPI 

#### :nail_care: Enhancements
 * `jovo-core` [#742](https://github.com/jovotech/jovo-framework/pull/742) Components: parse stateBeforeDelegate in delegate() ([@KaanKC](https://github.com/KaanKC))  

 #### Committers: 3
- Kaan Killic ([@KaanKC](https://github.com/KaanKC))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Alex ([@aswetlow](https://github.com/aswetlow))


## 3.0.13 - 3.0.14 (2020-05-03)

#### :bug: Bug Fix
 * `jovo-analytics-chatbase` [#735](https://github.com/jovotech/jovo-framework/pull/735) Access request using helper not directly ([@KaanKC](https://github.com/KaanKC))  
 * `jovo-core` Fix getStage() order in Project helper #2a5498f3db73abcd8520123e11d90cba9ef65ab1
 * `jovo-framework` Fix CORS issue in unit tests

#### :nail_care: Enhancements
 * `jovo-platform-alexa` [#734](https://github.com/jovotech/jovo-framework/pull/734) Add getPermissionIsCardThrown ([@rmtuckerphx](https://github.com/rmtuckerphx))  
 * `jovo-platform-alexa` Add types for skill event body objects 
 * `jovo-platform-facebookmessenger` Improve session handling
 * `jovo-platform-facebookmessenger` Add configurable `fetchProfile` functionality 

 #### Committers: 3
- Mark Tucker ([@rmtuckerphx](https://github.com/rmtuckerphx))
- Kaan Killic ([@KaanKC](https://github.com/KaanKC))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 3.0.12 (2020-04-09)

#### :sparkles: New Features
 * `jovo-plugin-auth` Added simple auth methods to secure the endpoint 

#### :bug: Bug Fix
 * `jovo-platform-googleassistant` [#716](https://github.com/jovotech/jovo-framework/pull/716) Corrected logic for retrieving project-ids in staged environments  ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-core` [#713](https://github.com/jovotech/jovo-framework/pull/713) Added log event message cast to string ([@RokasVaitkevicius](https://github.com/RokasVaitkevicius))  


 #### Committers: 3
- RokasVaitkevicius ([@RokasVaitkevicius](https://github.com/RokasVaitkevicius))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Alex ([@aswetlow](https://github.com/aswetlow))



## 3.0.11 (2020-04-06)

#### :sparkles: New Features
 * `jovo-analytics` [#702](https://github.com/jovotech/jovo-framework/pull/702) Added Dashbot - Jovo Core Platform Integration ([@KaanKC](https://github.com/KaanKC))  

#### :bug: Bug Fix
 * `jovo-core` [#706](https://github.com/jovotech/jovo-framework/pull/706) Added additional condition to check if handler return type is null ([@RokasVaitkevicius](https://github.com/RokasVaitkevicius))  
 * `jovo-framework` [#698](https://github.com/jovotech/jovo-framework/pull/698) Added missing setup-middleware calls ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-twilioautopilot` [#707](https://github.com/jovotech/jovo-framework/pull/707) Fixed multiple Autopilot bugs ([@KaanKC](https://github.com/KaanKC))  
 * `jovo-core` [#711](https://github.com/jovotech/jovo-framework/pull/711) Fixed infinite loop in getActiveComponentsRootState() ([@KaanKC](https://github.com/KaanKC))  


 #### :nail_care: Enhancement
 * `jovo-nlu-nlpjs` [#699](https://github.com/jovotech/jovo-framework/pull/699) Implemented possibility to prepare model via callback ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-nlu-nlpjs` [#703](https://github.com/jovotech/jovo-framework/pull/703) Refactored NlpjsNlu dependencies ([@m-ripper](https://github.com/m-ripper))  


* Updated Typescript to 3.8.x
* Updated Prettier to 2.x


 #### Committers: 3
- RokasVaitkevicius ([@RokasVaitkevicius](https://github.com/RokasVaitkevicius))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Kaan Killic ([@KaanKC](https://github.com/KaanKC))




## 3.0.6 (2020-03-04)

#### :bug: Bug Fix
 * `jovo-platform-bixby` [#680](https://github.com/jovotech/jovo-framework/pull/680) Adjust Bixby AudioPlayer Functionality ([@rubenaeg](https://github.com/rubenaeg))
 * `jovo-integratio-debugger` Bring back accidentally removed feature (accept language model files in Javascript)


 #### :nail_care: Enhancement
 * `jovo-core` [#689](https://github.com/jovotech/jovo-framework/pull/689) Refactored all async install methods ([@m-ripper](https://github.com/m-ripper))  


 #### Committers: 3
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))
- Alex ([@aswetlow](https://github.com/aswetlow))


## 3.0.3 - 3.0.5 (2020-02-27) (broken builds)

#### :bug: Bug Fix
* `jovo-slu-witai` [#675](https://github.com/jovotech/jovo-framework/pull/675) Fixed bug in the witai integration ([@m-ripper](https://github.com/m-ripper))  
* `jovo-core` [#678](https://github.com/jovotech/jovo-framework/pull/678) Fixed invalid config-handling ([@m-ripper](https://github.com/m-ripper))  
* [#678](https://github.com/jovotech/jovo-framework/pull/678) Fixed invalid config-handling ([@m-ripper](https://github.com/m-ripper))  

 #### :nail_care: Enhancement
 * `jovo-platform-bixby` [#680](https://github.com/jovotech/jovo-framework/pull/680) Implement setBixbyHandler, Add code examples and layout paragraph to Bixby docs  ([@rubenaeg](https://github.com/rubenaeg))
 * `jovo-platform-core` [#679](https://github.com/jovotech/jovo-framework/pull/679) Improvements for the Core platform ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-core` [#681](https://github.com/jovotech/jovo-framework/pull/681) Implemented showQuickReplies ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-bixby` [#682](https://github.com/jovotech/jovo-framework/pull/682) Implement Bixby AudioPlayer directives  ([@rubenaeg](https://github.com/rubenaeg))


 #### Committers: 3
- Alex ([@aswetlow](https://github.com/aswetlow))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))




## 3.0.3 (2020-02-25)

#### :bug: Bug Fix
* `jovo-slu-witai` [#675](https://github.com/jovotech/jovo-framework/pull/675) Fixed bug in the witai integration ([@m-ripper](https://github.com/m-ripper))  
* `jovo-core` [#678](https://github.com/jovotech/jovo-framework/pull/678) Fixed invalid config-handling ([@m-ripper](https://github.com/m-ripper))  

 #### :nail_care: Enhancement
 * `jovo-platform-bixby` [#680](https://github.com/jovotech/jovo-framework/pull/680) Implement setBixbyHandler, Add code examples and layout paragraph to Bixby docs  ([@rubenaeg](https://github.com/rubenaeg))
 * `jovo-platform-core` [#679](https://github.com/jovotech/jovo-framework/pull/679) Improvements for the Core platform ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-core` [#681](https://github.com/jovotech/jovo-framework/pull/681) Implemented showQuickReplies ([@m-ripper](https://github.com/m-ripper))  
 * `jovo-platform-bixby` [#682](https://github.com/jovotech/jovo-framework/pull/682) Implement Bixby AudioPlayer directives  ([@rubenaeg](https://github.com/rubenaeg))
 * `jovo-core` [#689](https://github.com/jovotech/jovo-framework/pull/689) Refactored all async install methods ([@m-ripper](https://github.com/m-ripper))  


 #### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))
- Max Ripper ([@m-ripper](https://github.com/m-ripper))
- Ruben A. ([@rubenaeg](https://github.com/rubenaeg))



## 3.0.2 (2020-02-25)

#### :bug: Bug Fix
* `jovo-framework` Fixed misplaced azure/function dependency 
* `jovo-framework` Fixed missing component exports 

 #### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))



## 3.0.2 (2020-02-25)

#### :bug: Bug Fix
* `jovo-framework` Fixed misplaced azure/function dependency 
* `jovo-framework` Fixed missing component exports 

 #### Committers: 1
- Alex ([@aswetlow](https://github.com/aswetlow))


## 3.0.1 (2020-02-25)

#### :bug: Bug Fix
* `jovo-framework` Minor bugfixes and improvements (in `jovo-integrations` and `jovo-core-platform`)

 #### Committers: 1
- Max Ripper ([@m-ripper](https://github.com/m-ripper))

