# Jovo Framework Changelog


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

