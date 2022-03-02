# Changelog

## [@jovotech/client-web@4.2.3](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.2.2...@jovotech/client-web@4.2.3)

> 1 March 2022

- 🐛 Fixes retrieving skillId from `jovo.project.js` [`#1248`](https://github.com/jovotech/jovo-framework/pull/1248)
- :bug: added missing parameter for recursive getImportStatus call [`#1247`](https://github.com/jovotech/jovo-framework/pull/1247)
- :construction_worker: Update npm scripts, satisfy linter [`#1245`](https://github.com/jovotech/jovo-framework/pull/1245)

## [@jovotech/client-web@4.2.2](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.2.1...@jovotech/client-web@4.2.2)

> 17 February 2022

- :bug: Fix askProfile config in jovo.project.js [`#1241`](https://github.com/jovotech/jovo-framework/pull/1241)
- :bug: Fixes output merging [`#1239`](https://github.com/jovotech/jovo-framework/pull/1239)
- implement `$device.getTimeZone()` on Alexa [`#1213`](https://github.com/jovotech/jovo-framework/pull/1213)
- :bookmark: Publish @jovotech/plugin-debugger@4.2.1 [`#1205`](https://github.com/jovotech/jovo-framework/pull/1205)

## [@jovotech/client-web@4.2.1](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.2.0...@jovotech/client-web@4.2.1)

> 10 February 2022

- Fix bug in handling of APL user events [`#1212`](https://github.com/jovotech/jovo-framework/pull/1212)
- Fix Alexa getUserId getter/setter [`#1228`](https://github.com/jovotech/jovo-framework/pull/1228)
- :bug: Fix missing OutputHelpers export [`#1229`](https://github.com/jovotech/jovo-framework/pull/1229)
- ✅ Implement tests for Framework and Platforms [`#1199`](https://github.com/jovotech/jovo-framework/pull/1199)
- :recycle: Move "." functionality to CLI [`#1204`](https://github.com/jovotech/jovo-framework/pull/1204)

## [@jovotech/client-web@4.2.0](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.1.2...@jovotech/client-web@4.2.0)

> 26 January 2022

- :adhesive_bandage: Fix issues with the `build:platform` process [`#1185`](https://github.com/jovotech/jovo-framework/pull/1185)
- AudioPlayerActivity Types added [`#1165`](https://github.com/jovotech/jovo-framework/pull/1165)
- :memo: Fix typos in `hooks`  [`#1194`](https://github.com/jovotech/jovo-framework/pull/1194)

## [@jovotech/client-web@4.1.2](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.1.1...@jovotech/client-web@4.1.2)

> 20 January 2022

## [@jovotech/client-web@4.1.1](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.0.0...@jovotech/client-web@4.1.1)

> 18 January 2022

- Fixes merging of undefined values in output templates [`#1170`](https://github.com/jovotech/jovo-framework/pull/1170)
- Fixes null value in state config [`#1186`](https://github.com/jovotech/jovo-framework/pull/1186)
- :recycle: Refactor process termination [`#1179`](https://github.com/jovotech/jovo-framework/pull/1179)
- 🐛  Fixes isNewSession in GoogleActionRequest [`#1178`](https://github.com/jovotech/jovo-framework/pull/1178)
- update tslog library [`#1169`](https://github.com/jovotech/jovo-framework/pull/1169)
- :bookmark: Publish [`#1164`](https://github.com/jovotech/jovo-framework/pull/1164)
- :sparkles: Add --skip-validation flag [`#1163`](https://github.com/jovotech/jovo-framework/pull/1163)
- :ambulance: Add bundle externals for Alexa to package.json [`#1155`](https://github.com/jovotech/jovo-framework/pull/1155)
- :bug: Set id in resource path manually [`#1153`](https://github.com/jovotech/jovo-framework/pull/1153)
- :label: Fix some typings [`#1151`](https://github.com/jovotech/jovo-framework/pull/1151)
- :bug: Fix Task config property [`#1152`](https://github.com/jovotech/jovo-framework/pull/1152)
- ✨ Initial Alexa ISP helpers [`#1145`](https://github.com/jovotech/jovo-framework/pull/1145)
- :sparkles: Introduce getInitConfig() [`#1144`](https://github.com/jovotech/jovo-framework/pull/1144)
- :sparkles: Introduce Alexa Conversations [`#1140`](https://github.com/jovotech/jovo-framework/pull/1140)
- :sparkles: Implement isJovoCliError [`#1141`](https://github.com/jovotech/jovo-framework/pull/1141)

## [@jovotech/client-web@4.0.0](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.0.0-beta.3...@jovotech/client-web@4.0.0)

> 18 November 2021

- :recycle: Add `skipTests: true` to FileDb default config [`#1121`](https://github.com/jovotech/jovo-framework/pull/1121)
- 🐛 Fix headline style in JovoLogger [`#1120`](https://github.com/jovotech/jovo-framework/pull/1120)

## [@jovotech/client-web@4.0.0-beta.3](https://github.com/jovotech/jovo-framework/compare/@jovotech/client-web@4.0.0-beta.2...@jovotech/client-web@4.0.0-beta.3)

> 17 November 2021

- Remove table view on `jovo run` + undefined properties in logger [`#1118`](https://github.com/jovotech/jovo-framework/pull/1118)
- Fix process.stdin handling  [`#1116`](https://github.com/jovotech/jovo-framework/pull/1116)

## [@jovotech/client-web@4.0.0-beta.2](https://github.com/jovotech/jovo-framework/compare/v3.5...@jovotech/client-web@4.0.0-beta.2)

> 16 November 2021

- ✨ Move JovoDebugger code from CLI to plugin [`#1111`](https://github.com/jovotech/jovo-framework/pull/1111)
- ✨ Add pretty logging [`#1103`](https://github.com/jovotech/jovo-framework/pull/1103)
- :sparkles: Introduce CMS integrations [`#1089`](https://github.com/jovotech/jovo-framework/pull/1089)
- :label: Fix typings [`#1105`](https://github.com/jovotech/jovo-framework/pull/1105)
- :sparkles: Introduce JavaScript Boilerplates [`#1109`](https://github.com/jovotech/jovo-framework/pull/1109)
- :sparkles: Add NextScene output, onScene GoogleAssistantHandle [`#1088`](https://github.com/jovotech/jovo-framework/pull/1088)
- :recycle: Adjust Jovo Debugger plugin [`#1093`](https://github.com/jovotech/jovo-framework/pull/1093)
- **Breaking change:** :recycle: :boom:  Standardize request headers [`#1080`](https://github.com/jovotech/jovo-framework/pull/1080)
- :bookmark: Publish [`#1092`](https://github.com/jovotech/jovo-framework/pull/1092)
- :bug: Set entities manually [`#1090`](https://github.com/jovotech/jovo-framework/pull/1090)
- :sparkles: Add Instagram platform integration [`#1069`](https://github.com/jovotech/jovo-framework/pull/1069)
- :sparkles: Add Dashbot Analytics integration [`#1076`](https://github.com/jovotech/jovo-framework/pull/1076)
- ✨ Platform handles (Alexa Reminders) [`#1071`](https://github.com/jovotech/jovo-framework/pull/1071)
- ✨ Skip health checks [`#1068`](https://github.com/jovotech/jovo-framework/pull/1068)
- :sparkles: Introduce Instagram [`#40`](https://github.com/jovotech/jovo-framework/pull/40)
- :bookmark: Publish [`#1067`](https://github.com/jovotech/jovo-framework/pull/1067)
- :rewind: Reverse d10b5c3 [`#1065`](https://github.com/jovotech/jovo-framework/pull/1065)
- :bug: Resolve project path correctly [`#1062`](https://github.com/jovotech/jovo-framework/pull/1062)
- 🐛🏷️ Fix invalid typing of `InputTypeLike` [`#1064`](https://github.com/jovotech/jovo-framework/pull/1064)
- :bookmark: Publish [`#1063`](https://github.com/jovotech/jovo-framework/pull/1063)
- :recycle: Refactor CLI Plugins [`#1046`](https://github.com/jovotech/jovo-framework/pull/1046)
- :sparkles: Add system intents to model [`#1056`](https://github.com/jovotech/jovo-framework/pull/1056)
- :ambulance: Apply TestSuite hotfixes [`#1052`](https://github.com/jovotech/jovo-framework/pull/1052)
- :bookmark: Publish [`#1045`](https://github.com/jovotech/jovo-framework/pull/1045)
- ✨ Introduce TestSuite [`#1033`](https://github.com/jovotech/jovo-framework/pull/1033)
- 🐛 Add global intents to actions.yml [`#1032`](https://github.com/jovotech/jovo-framework/pull/1032)
- ✨ Add hasSessionEnded() to JovoResponse [`#29`](https://github.com/jovotech/jovo-framework/pull/29)
- 🐛 Fix copying resources [`#1021`](https://github.com/jovotech/jovo-framework/pull/1021)
- ✨ Improve model validation [`#1020`](https://github.com/jovotech/jovo-framework/pull/1020)
- ✨ Add accessToken property to JovoUser [`#1027`](https://github.com/jovotech/jovo-framework/pull/1027)
- Async Model [`#996`](https://github.com/jovotech/jovo-framework/pull/996)
- 🚚 Only use $ for direct properties of `Jovo` [`#986`](https://github.com/jovotech/jovo-framework/pull/986)
- :recycle: Update CorePlatform response [`#16`](https://github.com/jovotech/jovo-framework/pull/16)
- Improve type for device capabilities [`#985`](https://github.com/jovotech/jovo-framework/pull/985)
- ✨ Alexa reminders  [`#972`](https://github.com/jovotech/jovo-framework/pull/972)
- ✨ Implement this.$device (wip) [`#966`](https://github.com/jovotech/jovo-framework/pull/966)
- 🚚 Rename platform resources [`#962`](https://github.com/jovotech/jovo-framework/pull/962)
- ✨ Implement Alexa Customer Profile API [`#970`](https://github.com/jovotech/jovo-framework/pull/970)
- ✨ Implement Alexa Customer Profile API [`#969`](https://github.com/jovotech/jovo-framework/pull/969)
- ✨ Initial DynamoDb implementation (wip) [`#953`](https://github.com/jovotech/jovo-framework/pull/953)
- ✨ Introduce plugin-specific context [`#939`](https://github.com/jovotech/jovo-framework/pull/939)
- ⬆️ Update dependencies [`#936`](https://github.com/jovotech/jovo-framework/pull/936)
- ✨ Add Dialogflow CLI Plugin [`#928`](https://github.com/jovotech/jovo-framework/pull/928)
- 🚚 Abstract JovoCli class, pass instance to plugins [`#926`](https://github.com/jovotech/jovo-framework/pull/926)
- ✨ Add CLI plugins for Alexa and Google Assistant [`#925`](https://github.com/jovotech/jovo-framework/pull/925)

## [v3.5](https://github.com/jovotech/jovo-framework/compare/v3.3...v3.5)

> 22 February 2021

- **Breaking change:** :boom: Move setResponse from response to after.response middleware + fix missing unit test methods [`#901`](https://github.com/jovotech/jovo-framework/pull/901)
- Add error handling to analytics integrations [`#898`](https://github.com/jovotech/jovo-framework/pull/898)
- 🏷️ Update + export types [`#895`](https://github.com/jovotech/jovo-framework/pull/895)
- ✨ Transactions for Google Assistant Conversational Actions [`#892`](https://github.com/jovotech/jovo-framework/pull/892)
- :recycle: Add Conversational Actions functionality to Jovo Debugger [`#890`](https://github.com/jovotech/jovo-framework/pull/890)
- :sparkles: Plugin to save conversation data into a database [`#888`](https://github.com/jovotech/jovo-framework/pull/888)
- 🐛 Fix bug related to audio in the request for CorePlatform and WebPlatform  [`#879`](https://github.com/jovotech/jovo-framework/pull/879)
- persist user.context within unit tests :adhesive_bandage:  [`#875`](https://github.com/jovotech/jovo-framework/pull/875)
- feat: add Google Optimize support [`#876`](https://github.com/jovotech/jovo-framework/pull/876)
- merging changes from upstream [`#2`](https://github.com/jovotech/jovo-framework/pull/2)
- update [`#1`](https://github.com/jovotech/jovo-framework/pull/1)

- :goal_net: Add error handling to analytics integrations [`#897`](https://github.com/jovotech/jovo-framework/issues/897)

## [v3.3](https://github.com/jovotech/jovo-framework/compare/v3.2...v3.3)

> 3 December 2020

- Add missing and broken Google Conversational Action features [`#871`](https://github.com/jovotech/jovo-framework/pull/871)
- ✨ Abstract the initialization of the platform handlers into a single function [`#868`](https://github.com/jovotech/jovo-framework/pull/868)
- ✨ Use postbackData of suggestions if possible [`#870`](https://github.com/jovotech/jovo-framework/pull/870)
- ✨ Abstract quick replies [`#869`](https://github.com/jovotech/jovo-framework/pull/869)
- Adds PostgreSQL integration [`#859`](https://github.com/jovotech/jovo-framework/pull/859)
- 📝 Update example request & responses for CorePlatform & WebPlatform [`#864`](https://github.com/jovotech/jovo-framework/pull/864)
- FIx bugs in Google Assistant Integration [`#862`](https://github.com/jovotech/jovo-framework/pull/862)
- :bug: Fix RequestBuilder [`#858`](https://github.com/jovotech/jovo-framework/pull/858)
- ✨ Improve Web-Client browser-detection [`#848`](https://github.com/jovotech/jovo-framework/pull/848)
- :bug: Fix ignored APL-A directive #849 [`#855`](https://github.com/jovotech/jovo-framework/pull/855)
- Fixes several Google Conversational Actions issues [`#856`](https://github.com/jovotech/jovo-framework/pull/856)

## [v3.2](https://github.com/jovotech/jovo-framework/compare/v3.1...v3.2)

> 29 October 2020

- ♻️💥 Refactor Web-Client [`#841`](https://github.com/jovotech/jovo-framework/pull/841)
- ✨ Add re-export to jovo-platform-web [`#839`](https://github.com/jovotech/jovo-framework/pull/839)
- Genesys integration [`#838`](https://github.com/jovotech/jovo-framework/pull/838)
- ✨ Implement configurable user-session-data-key [`#835`](https://github.com/jovotech/jovo-framework/pull/835)
- OneDash analytics added [`#826`](https://github.com/jovotech/jovo-framework/pull/826)
- :recycle: Enhance Google AssisConversational Actions  [`#831`](https://github.com/jovotech/jovo-framework/pull/831)

- :bug:  Fix #823 and #816 [`#823`](https://github.com/jovotech/jovo-framework/issues/823)

## [v3.1](https://github.com/jovotech/jovo-framework/compare/v3.0...v3.1)

> 29 September 2020

- :sparkles: Make fancy JSON output   [`#827`](https://github.com/jovotech/jovo-framework/pull/827)
- ✨ Implement web-platform [`#824`](https://github.com/jovotech/jovo-framework/pull/824)
- 🐛 Fix potential bug for Firestore [`#822`](https://github.com/jovotech/jovo-framework/pull/822)
- 🐛 Fix saving of user-session-id [`#818`](https://github.com/jovotech/jovo-framework/pull/818)
- :sparkles: Add Dialogflow Phone Gateway integration [`#820`](https://github.com/jovotech/jovo-framework/pull/820)
- :bug: fix endreason for "stop" not set [`#812`](https://github.com/jovotech/jovo-framework/pull/812)
- Fixes storing session to DB [`#806`](https://github.com/jovotech/jovo-framework/pull/806)
- ✨ Implement asynchronous responses for GoogleBusiness [`#803`](https://github.com/jovotech/jovo-framework/pull/803)
- 🐛 Fix bug  [`#802`](https://github.com/jovotech/jovo-framework/pull/802)
- ✨ Implement partial usage of SLU-integrations [`#798`](https://github.com/jovotech/jovo-framework/pull/798)
- 💬 Add SSML Support for Bixby [`#799`](https://github.com/jovotech/jovo-framework/pull/799)
- 🐛 Fix changed AzureAsr url [`#797`](https://github.com/jovotech/jovo-framework/pull/797)
- 🏷️ Correct NlpjsNlu config typings [`#796`](https://github.com/jovotech/jovo-framework/pull/796)
- ⬆️ Upgrade dependencies of jovo-nlu-nlpjs [`#795`](https://github.com/jovotech/jovo-framework/pull/795)
- ♻️ Improve DialogflowNlu session-id for detectIntent-requests [`#793`](https://github.com/jovotech/jovo-framework/pull/793)
- 🐛 Fix FacebookMessenger bug [`#792`](https://github.com/jovotech/jovo-framework/pull/792)
- 🔥 Replace `googleapis` with `google-auth-library` [`#791`](https://github.com/jovotech/jovo-framework/pull/791)
- ⬆️ Bump lodash from 4.17.15 to 4.17.19 in /jovo-integrations/jovo-db-datastore [`#787`](https://github.com/jovotech/jovo-framework/pull/787)
- Google business docs [`#789`](https://github.com/jovotech/jovo-framework/pull/789)
- Renaming Google Business Messages integration [`#788`](https://github.com/jovotech/jovo-framework/pull/788)
- Adds Google Business Messages integration [`#786`](https://github.com/jovotech/jovo-framework/pull/786)
- ♻️ Normalize configuration-handling & error-messages of ASR-, NLU-, SLU- and TTS-integrations [`#781`](https://github.com/jovotech/jovo-framework/pull/781)
- :bug: Unexpected .addAudio() behaviour [`#775`](https://github.com/jovotech/jovo-framework/pull/775)
- 🐛 Fixed bug that would cause CorePlatformRequests to be handled by Alexa [`#767`](https://github.com/jovotech/jovo-framework/pull/767)
- 🐛 Improved profile-loading [`#766`](https://github.com/jovotech/jovo-framework/pull/766)
- 🐛 [FB-Messenger] Fixed bug that wrong config would be used [`#763`](https://github.com/jovotech/jovo-framework/pull/763)
- 🐛 Added fix for windows bug that would cause first second to be omitted [`#764`](https://github.com/jovotech/jovo-framework/pull/764)
- used logGoogleData for Google Action [`#757`](https://github.com/jovotech/jovo-framework/pull/757)
- :ok_hand: Adjust Bixby Examples [`#756`](https://github.com/jovotech/jovo-framework/pull/756)
- 🐛 Fixed PlatformStorage bug [`#755`](https://github.com/jovotech/jovo-framework/pull/755)
- Add _JOVO_TEXT_ to return non SSML text [`#754`](https://github.com/jovotech/jovo-framework/pull/754)
- Lindenbaum: adds support for the /inactivity endpoint [`#753`](https://github.com/jovotech/jovo-framework/pull/753)
- Add advanced config to support key overloading [`#751`](https://github.com/jovotech/jovo-framework/pull/751)
- Update fork from master [`#1`](https://github.com/jovotech/jovo-framework/pull/1)
- :recycle: Update load, save, delete parameters [`#752`](https://github.com/jovotech/jovo-framework/pull/752)
- 🐛 Fixed web client bug [`#749`](https://github.com/jovotech/jovo-framework/pull/749)
- 🐛 Fixed bug related to JovoWebClientVue [`#748`](https://github.com/jovotech/jovo-framework/pull/748)
- Lindenbaum: updating deps to hoisted version [`#747`](https://github.com/jovotech/jovo-framework/pull/747)
- Chatbase: fixes error when speech was undefined [`#746`](https://github.com/jovotech/jovo-framework/pull/746)
- 🐛 Fixed Safari-related bugs for the web-client [`#745`](https://github.com/jovotech/jovo-framework/pull/745)
- Lindenbaum: adds de-DE files to examples [`#744`](https://github.com/jovotech/jovo-framework/pull/744)
- Chatbase: used wrong helper to access google user id [`#743`](https://github.com/jovotech/jovo-framework/pull/743)
- WIP: Lindenbaum Platform Integration [`#730`](https://github.com/jovotech/jovo-framework/pull/730)
- Components: parse stateBeforeDelegate in delegate() [`#742`](https://github.com/jovotech/jovo-framework/pull/742)
- Autopilot: adds delay to clearing db folder after tests [`#739`](https://github.com/jovotech/jovo-framework/pull/739)
- bug Chatbase: access request using helper not directly [`#735`](https://github.com/jovotech/jovo-framework/pull/735)
- Add getPermissionIsCardThrown [`#734`](https://github.com/jovotech/jovo-framework/pull/734)
- Autopilot: fixes tests [`#732`](https://github.com/jovotech/jovo-framework/pull/732)
- 🐛🚨 [FacebookMessenger] Fixed bug & satisfied linter [`#718`](https://github.com/jovotech/jovo-framework/pull/718)
- 🐛✨ Facebook Messenger - Improvements/Bugfixes [`#717`](https://github.com/jovotech/jovo-framework/pull/717)
- 🐛 Corrected logic for retrieving project-ids in staged environments [`#716`](https://github.com/jovotech/jovo-framework/pull/716)
- 🐛 Added log event message cast to string [`#713`](https://github.com/jovotech/jovo-framework/pull/713)
- Components: fixes infinite loop in getActiveComponentsRootState() [`#711`](https://github.com/jovotech/jovo-framework/pull/711)
- fixes multiple Autopilot bugs [`#707`](https://github.com/jovotech/jovo-framework/pull/707)
- 🐛 Added additional condition to check if handler return type is null [`#706`](https://github.com/jovotech/jovo-framework/pull/706)
- Updates prettier to v2.0.2 [`#704`](https://github.com/jovotech/jovo-framework/pull/704)
- 🚧 Refactored NlpjsNlu dependencies [`#703`](https://github.com/jovotech/jovo-framework/pull/703)
- Updates to Typescript 3.8.3 | Adds Dashbot - Jovo Core Platform Integration [`#702`](https://github.com/jovotech/jovo-framework/pull/702)
- ✨ NlpjsNlu - Implemented possibility to prepare model via callback [`#699`](https://github.com/jovotech/jovo-framework/pull/699)
- 🐛 Added missing setup-middleware calls [`#698`](https://github.com/jovotech/jovo-framework/pull/698)
- Autopilot: bug fixes and new helper methods [`#697`](https://github.com/jovotech/jovo-framework/pull/697)
- Autopilot: fixes AutopilotResponse.fromJSON(), isAsk(), isTell() | converts output to SSML and general clean up [`#690`](https://github.com/jovotech/jovo-framework/pull/690)
- ♻️ Refactored all async install methods [`#689`](https://github.com/jovotech/jovo-framework/pull/689)

- :bug: Fix progressiveResponses check, fixes #794 [`#794`](https://github.com/jovotech/jovo-framework/issues/794)

## [v3.0](https://github.com/jovotech/jovo-framework/compare/v2.1...v3.0)

> 2 March 2020

- 👌 Adjust Bixby AudioPlayer Functionality [`#688`](https://github.com/jovotech/jovo-framework/pull/688)
- ♻️ Implement Bixby AudioPlayer directives [`#682`](https://github.com/jovotech/jovo-framework/pull/682)
- ✨ Implemented showQuickReplies [`#681`](https://github.com/jovotech/jovo-framework/pull/681)
- ✨📝  Implement setBixbyHandler, Add code examples and layout paragraph to Bixby docs [`#680`](https://github.com/jovotech/jovo-framework/pull/680)
- ✨Improvements for the Core platform [`#679`](https://github.com/jovotech/jovo-framework/pull/679)
- 🐛 Fixed invalid config-handling [`#678`](https://github.com/jovotech/jovo-framework/pull/678)
- 🐛 Fixed WitAiSlu bug [`#675`](https://github.com/jovotech/jovo-framework/pull/675)
- Add missing V3 version bumps [`#673`](https://github.com/jovotech/jovo-framework/pull/673)
- v3: adds Jovo Debugger custom sequences to docs [`#665`](https://github.com/jovotech/jovo-framework/pull/665)
- New Feature: add isAsk and isTell helper methods in Dialogflow response [`#664`](https://github.com/jovotech/jovo-framework/pull/664)
- 🐛 Fix malformed response for Google Assistant Table Cards [`#661`](https://github.com/jovotech/jovo-framework/pull/661)
- 📝 Fix docs for Google Assistant Visual Output [`#658`](https://github.com/jovotech/jovo-framework/pull/658)
- ✨ Bixby Platform Integration [`#653`](https://github.com/jovotech/jovo-framework/pull/653)
- 🎨 Enhance MongoDb Docs with Troubleshooting Section [`#652`](https://github.com/jovotech/jovo-framework/pull/652)
- ✨ Alexa & GoogleAssistant Feature Parity [`#649`](https://github.com/jovotech/jovo-framework/pull/649)
- Adds Twilio Autopilot integration [`#651`](https://github.com/jovotech/jovo-framework/pull/651)
- Apply permission api fix to all endpoints [`#648`](https://github.com/jovotech/jovo-framework/pull/648)
- a [`#1`](https://github.com/jovotech/jovo-framework/pull/1)
- 🐛 Fixed ExpressJS bug [`#647`](https://github.com/jovotech/jovo-framework/pull/647)
- 🐛 Fixed Lambda-bug [`#646`](https://github.com/jovotech/jovo-framework/pull/646)
- Amazon Pay Integration [`#644`](https://github.com/jovotech/jovo-framework/pull/644)
- WIP of independent integration test package | Update to ComponentPlugin unit tests [`#622`](https://github.com/jovotech/jovo-framework/pull/622)
- ✨📌Implemented Luis; Set TypeScript version to 3.7.3 [`#635`](https://github.com/jovotech/jovo-framework/pull/635)
- fixes alexaSkill.getUserId() bug [`#631`](https://github.com/jovotech/jovo-framework/pull/631)
- :sparkles: Add KeyObject sheet type to GoogleSheet CMS integration [`#625`](https://github.com/jovotech/jovo-framework/pull/625)
- ✨ Handler uses the request-config in favor of the app-config [`#626`](https://github.com/jovotech/jovo-framework/pull/626)
- 🐛 DialogflowNlu: Fixed bug that would cause request-config to be overridden [`#623`](https://github.com/jovotech/jovo-framework/pull/623)
- :ok_hand: Adjust GoogleAnalyticsPlugin [`#621`](https://github.com/jovotech/jovo-framework/pull/621)
- 🎨 Improved code, DialogflowNlu & FacebookMessenger now use the request-config [`#620`](https://github.com/jovotech/jovo-framework/pull/620)
- ✨🐛 Implemented request-config / fixed config-related bugs [`#619`](https://github.com/jovotech/jovo-framework/pull/619)
- 🚑✨ Fixed authentication issues / implemented possibility to override config [`#617`](https://github.com/jovotech/jovo-framework/pull/617)
- 🐛 Fixed bugs of jovo-platform-facebookmessenger [`#616`](https://github.com/jovotech/jovo-framework/pull/616)
- 💥✨Adjusted State Handling to prevent leaving active Conversational Components [`#609`](https://github.com/jovotech/jovo-framework/pull/609)
- 📝 updates code examples and fixes dead links in component docs [`#602`](https://github.com/jovotech/jovo-framework/pull/602)
- 📝 Updates component's folder name in the examples [`#604`](https://github.com/jovotech/jovo-framework/pull/604)
- ✨ Implemented Dialogflow NLU plugin [`#613`](https://github.com/jovotech/jovo-framework/pull/613)
- :memo: Fix images on workflow docs [`#612`](https://github.com/jovotech/jovo-framework/pull/612)
- ✨ Facebook-messenger platform [`#611`](https://github.com/jovotech/jovo-framework/pull/611)
- ✨ session-data can be saved in the database [`#610`](https://github.com/jovotech/jovo-framework/pull/610)
- ✨Preparation for the Jovo-Assistant [`#608`](https://github.com/jovotech/jovo-framework/pull/608)
- add hasAPLTInterface for character displays devices [`#606`](https://github.com/jovotech/jovo-framework/pull/606)
- fixed removing shouldEndSession in showVideo call [`#607`](https://github.com/jovotech/jovo-framework/pull/607)
- Add GetDeviceName + hasWebBrowserInterface for GAction [`#578`](https://github.com/jovotech/jovo-framework/pull/578)
- Updated Firestore database integration to accept an already initialized instance in the constructor [`#601`](https://github.com/jovotech/jovo-framework/pull/601)
- :alien: Fix deprecated MongoDb Constructor [`#603`](https://github.com/jovotech/jovo-framework/pull/603)
- Updates Conversational Component Examples [`#600`](https://github.com/jovotech/jovo-framework/pull/600)
- ⬆️ updates @google-cloud/datastore to v3^ [`#596`](https://github.com/jovotech/jovo-framework/pull/596)
- 🐛 adds missing handleRequest object to Dialogflow/GoogleAction platform object creation [`#585`](https://github.com/jovotech/jovo-framework/pull/585)
- Fix GoogleActionSpeechBuilder.addAudio() to match docs+implementation+common sense [`#584`](https://github.com/jovotech/jovo-framework/pull/584)
- :sparkles: Added support to SAP Conversational AI Platform [`#577`](https://github.com/jovotech/jovo-framework/pull/577)
- 🚧 Components: Updates delegate(), bug fixes, default data, type changes [`#538`](https://github.com/jovotech/jovo-framework/pull/538)
- 🐛 Add request samples for Dialogflow requests [`#579`](https://github.com/jovotech/jovo-framework/pull/579)
- 🐛 Fix isNewSession for Dialogflow platform [`#575`](https://github.com/jovotech/jovo-framework/pull/575)
- airtable multipage table bug fix [`#570`](https://github.com/jovotech/jovo-framework/pull/570)
- VoiceHero Analytics Integration [`#574`](https://github.com/jovotech/jovo-framework/pull/574)
- Pr/491 [`#556`](https://github.com/jovotech/jovo-framework/pull/556)
-  🐛 Fixes multiple bugs of the Airtable integration [`#555`](https://github.com/jovotech/jovo-framework/pull/555)
- :sparkles: Added support for random hints [`#549`](https://github.com/jovotech/jovo-framework/pull/549)
- Fix: Prevent validators to fail after redirect [`#545`](https://github.com/jovotech/jovo-framework/pull/545)
- :memo: Add Jovo CLI Convert, Prepare Docs [`#534`](https://github.com/jovotech/jovo-framework/pull/534)
- :sparkles: Hosting using nodejs built-in http server [`#540`](https://github.com/jovotech/jovo-framework/pull/540)
- Fixed Dialogflow Session Attributes Issues [`#535`](https://github.com/jovotech/jovo-framework/pull/535)
- :bug: hasScreenInterface did watch for audio cap [`#539`](https://github.com/jovotech/jovo-framework/pull/539)
- Added possibility to partially exclude and replace the log. [`#533`](https://github.com/jovotech/jovo-framework/pull/533)
- Components: updates response interface [`#530`](https://github.com/jovotech/jovo-framework/pull/530)
- Twilio Dialogflow Integration [`#531`](https://github.com/jovotech/jovo-framework/pull/531)
- Added configuration options to PulseLabs plugin [`#528`](https://github.com/jovotech/jovo-framework/pull/528)
- EventEmitter typing issue [`#526`](https://github.com/jovotech/jovo-framework/pull/526)
- Fixing a bug in server.js that breaks the express server [`#525`](https://github.com/jovotech/jovo-framework/pull/525)
- Added getScreenResolution method for Alexa devices [`#523`](https://github.com/jovotech/jovo-framework/pull/523)
- Fixed dialogflow session attributes issue [`#524`](https://github.com/jovotech/jovo-framework/pull/524)
- :sparkles: Add Pulse Labs Plugin [`#522`](https://github.com/jovotech/jovo-framework/pull/522)
-  Fix Bug with multiple Response Sheets not extending each other [`#519`](https://github.com/jovotech/jovo-framework/pull/519)
- 📝Component Docs | ✨ Component: delegate from within a state | ♻️ Update Component example [`#515`](https://github.com/jovotech/jovo-framework/pull/515)
- ✅ 🐛 Fixes bug where mongodb connection was closed abruptly | ✅ Sets NODE_ENV to UNIT_TEST to fix MaxListenersExceededWarnings [`#514`](https://github.com/jovotech/jovo-framework/pull/514)
- :sparkles: [Feature] Input validation [`#511`](https://github.com/jovotech/jovo-framework/pull/511)
- Refactored loading of the config-data. [`#507`](https://github.com/jovotech/jovo-framework/pull/507)
- Adding viewport info for alexaRequests [`#510`](https://github.com/jovotech/jovo-framework/pull/510)
- #505 add hasAutomotive getter [`#506`](https://github.com/jovotech/jovo-framework/pull/506)
- 🚧 Adds Conversational Components [`#503`](https://github.com/jovotech/jovo-framework/pull/503)
- Fix AUDIOPLAYER.AlexaSkill.PlaybackFinished intent name in debugger. [`#496`](https://github.com/jovotech/jovo-framework/pull/496)
- Address getRepropmt issue for Alexa [`#497`](https://github.com/jovotech/jovo-framework/pull/497)
- :ambulance: Fix empty Cells on CMS bug [`#494`](https://github.com/jovotech/jovo-framework/pull/494)
- Send test requests directly to app object [`#488`](https://github.com/jovotech/jovo-framework/pull/488)
- Add missing dependencies [`#490`](https://github.com/jovotech/jovo-framework/pull/490)
- Add Google Action Response getters [`#485`](https://github.com/jovotech/jovo-framework/pull/485)
- Add google res getters [`#482`](https://github.com/jovotech/jovo-framework/pull/482)
- Add google res getters [`#479`](https://github.com/jovotech/jovo-framework/pull/479)
- ♻️ Adds CanfulfillIntentRequest example |  🐛 Sets canFulfillRequest() param to possibly undefined [`#475`](https://github.com/jovotech/jovo-framework/pull/475)
- 🚸 Adds helpers to check for request types [`#474`](https://github.com/jovotech/jovo-framework/pull/474)
- 🐛 DB: Saves updatedAt only if it's defined [`#473`](https://github.com/jovotech/jovo-framework/pull/473)
- Add alexa res getters [`#470`](https://github.com/jovotech/jovo-framework/pull/470)
- Add tests for `hasState` and `hasSessionData`  [`#468`](https://github.com/jovotech/jovo-framework/pull/468)
- Add Alexa Getters `hasStandardCard` and `hasSimpleCard` [`#466`](https://github.com/jovotech/jovo-framework/pull/466)
- attempt to fix #462  [`#464`](https://github.com/jovotech/jovo-framework/pull/464)
- Refactor JovoUser.ts and add tests for it [`#463`](https://github.com/jovotech/jovo-framework/pull/463)
- :white_check_mark: Add AirtableCMS Unit Tests [`#461`](https://github.com/jovotech/jovo-framework/pull/461)
- :ambulance: Fix Platform-specific Responses not working with private … [`#452`](https://github.com/jovotech/jovo-framework/pull/452)
- Update addText to accept arbitrary SSML wrapping elements [`#442`](https://github.com/jovotech/jovo-framework/pull/442)
- ✨ Adds updatedAt to databases [`#451`](https://github.com/jovotech/jovo-framework/pull/451)
- :white_check_mark: Add Unit Tests for GoogleSheetsCMS integration [`#450`](https://github.com/jovotech/jovo-framework/pull/450)
- ⚡️ DB save optimization only saves to db if changes were made [`#446`](https://github.com/jovotech/jovo-framework/pull/446)
- refactor & tests for db integrations [`#443`](https://github.com/jovotech/jovo-framework/pull/443)
- :recycle: Fix I18Next TsLint issues [`#440`](https://github.com/jovotech/jovo-framework/pull/440)
- :white_check_mark: Update I18Next Tests [`#439`](https://github.com/jovotech/jovo-framework/pull/439)
- :sparkles: Add Platform-specific Responses, CMS-Caching for Airtable Integration [`#432`](https://github.com/jovotech/jovo-framework/pull/432)
- :sparkles: CMS-Caching, Platform-Specific Responses, I18Next Tests [`#428`](https://github.com/jovotech/jovo-framework/pull/428)

- Merge pull request #464 from natrixx/fixResGetterGoogle [`#462`](https://github.com/jovotech/jovo-framework/issues/462)

## [v2.1](https://github.com/jovotech/jovo-framework/compare/v2.0...v2.1)

> 14 March 2019

- :recycle: Improve dev builds [`#420`](https://github.com/jovotech/jovo-framework/pull/420)
- Increased storage to MEDIUMTEXT [`#419`](https://github.com/jovotech/jovo-framework/pull/419)
- ✨Adds Airtable CMS Integration [`#411`](https://github.com/jovotech/jovo-framework/pull/411)
- fix getSelectedElementId return wrong value [`#416`](https://github.com/jovotech/jovo-framework/pull/416)
- ✨ Adds dialogflow slot filling example [`#413`](https://github.com/jovotech/jovo-framework/pull/413)
- fix  Google Assistant handler not merge correctly [`#410`](https://github.com/jovotech/jovo-framework/pull/410)
- ♻️ GoogleSheetsCMS integration should reject JovoError instead of string [`#414`](https://github.com/jovotech/jovo-framework/pull/414)
- 🐛 Fixes: JovoError doesn't print module [`#415`](https://github.com/jovotech/jovo-framework/pull/415)
- fix missing playerActivity [`#407`](https://github.com/jovotech/jovo-framework/pull/407)
- Build Google Transactions for Digital Goods [`#406`](https://github.com/jovotech/jovo-framework/pull/406)
- Fixes askForPlace(), adds helper, tests and docs [`#401`](https://github.com/jovotech/jovo-framework/pull/401)
- ✨📝Adds Amazon Pay helper methods and docs [`#395`](https://github.com/jovotech/jovo-framework/pull/395)
- setAlexaHandler/setGoogleAssistantHandler don't works with a list of object. [`#398`](https://github.com/jovotech/jovo-framework/pull/398)
- 👌 Adds geolocation interface to $alexaSkill [`#388`](https://github.com/jovotech/jovo-framework/pull/388)
- Middleware hooks [`#389`](https://github.com/jovotech/jovo-framework/pull/389)
- ✨ Adds Alexa Geolocation support (also known as Location Services) [`#387`](https://github.com/jovotech/jovo-framework/pull/387)
- ✨ Adds Google Action Push Notifications [`#384`](https://github.com/jovotech/jovo-framework/pull/384)
- Implemented Azure Functions context logging [`#375`](https://github.com/jovotech/jovo-framework/pull/375)
- Support to daily updates and daily routines [`#383`](https://github.com/jovotech/jovo-framework/pull/383)
- ✨ Adds param to sendEvent() to switch between live and dev url || Adds example to examples folder [`#380`](https://github.com/jovotech/jovo-framework/pull/380)
- ✨ Adds Alexa Proactive Event API [`#379`](https://github.com/jovotech/jovo-framework/pull/379)
- 👌 jovo-db-firestore refactor [`#371`](https://github.com/jovotech/jovo-framework/pull/371)
- Dev [`#370`](https://github.com/jovotech/jovo-framework/pull/370)
- fix displayText not display [`#368`](https://github.com/jovotech/jovo-framework/pull/368)
- Bugfixes [`#364`](https://github.com/jovotech/jovo-framework/pull/364)
- Typo removed [`#361`](https://github.com/jovotech/jovo-framework/pull/361)
-  🐛 Fixes bug where outDir was ./dist/src/ in `jovo-db-firestore` [`#353`](https://github.com/jovotech/jovo-framework/pull/353)
- TestSuite is now generic, with platform-specific interfaces available [`#349`](https://github.com/jovotech/jovo-framework/pull/349)
- 🐛 Adds GoogleCloudFunction export [`#348`](https://github.com/jovotech/jovo-framework/pull/348)
- ✨ Adds Google Firestore integration [`#350`](https://github.com/jovotech/jovo-framework/pull/350)
- showVideo(...) should not drop session attributes [`#344`](https://github.com/jovotech/jovo-framework/pull/344)
- New handler [`#345`](https://github.com/jovotech/jovo-framework/pull/345)
- Fixing issue where $gameEngine.respond would drop the session attributes [`#338`](https://github.com/jovotech/jovo-framework/pull/338)
- ✨ Adds Azure Cosmos DB integration [`#341`](https://github.com/jovotech/jovo-framework/pull/341)
- Wrong response.httpStatus & Typo removed [`#336`](https://github.com/jovotech/jovo-framework/pull/336)

## [v2.0](https://github.com/jovotech/jovo-framework/compare/v1.4...v2.0)

> 9 January 2019

- Set Field for primaryKey to 255 chars [`#332`](https://github.com/jovotech/jovo-framework/pull/332)
- Image shouldn't be required for ListTemplate1 [`#315`](https://github.com/jovotech/jovo-framework/pull/315)
- Fix for intent exception causing unhandled rejection [`#314`](https://github.com/jovotech/jovo-framework/pull/314)
- Fix APL directives with v2 [`#311`](https://github.com/jovotech/jovo-framework/pull/311)
-  🐛 SimpleCard didn't include content [`#313`](https://github.com/jovotech/jovo-framework/pull/313)
- 🐛 Fixes: Plugin config couldn't be added in config.js [`#307`](https://github.com/jovotech/jovo-framework/pull/307)
- Alexa Chatbase Analytics Update [`#302`](https://github.com/jovotech/jovo-framework/pull/302)
- V2 [`#5`](https://github.com/jovotech/jovo-framework/pull/5)
- :sparkles: MongoDb Integration [`#301`](https://github.com/jovotech/jovo-framework/pull/301)
- Add support for APL-based touch [`#278`](https://github.com/jovotech/jovo-framework/pull/278)
- Enhancement/chatbase [`#276`](https://github.com/jovotech/jovo-framework/pull/276)
- Update to latest [`#3`](https://github.com/jovotech/jovo-framework/pull/3)
- Refresh [`#2`](https://github.com/jovotech/jovo-framework/pull/2)
- Sync with Master [`#1`](https://github.com/jovotech/jovo-framework/pull/1)
- Fix: handle requests without session attributes [`#264`](https://github.com/jovotech/jovo-framework/pull/264)
- Fix SequenceBuilder being added multiple times [`#265`](https://github.com/jovotech/jovo-framework/pull/265)
- Add functional of asking user for permission to send push notifications and getting existing permissions [`#259`](https://github.com/jovotech/jovo-framework/pull/259)
- Alexa's submission process fails due to missing apiEndpoint on dummy request [`#261`](https://github.com/jovotech/jovo-framework/pull/261)
- Fix for webhook exception handling during unit tests [`#254`](https://github.com/jovotech/jovo-framework/pull/254)
- add context during signin. [`#248`](https://github.com/jovotech/jovo-framework/pull/248)
- Azure Functions error handling fixes [`#247`](https://github.com/jovotech/jovo-framework/pull/247)
- Update app config docs [`#243`](https://github.com/jovotech/jovo-framework/pull/243)
- :art: Added respond method to Alexa game engine and gadget controller [`#242`](https://github.com/jovotech/jovo-framework/pull/242)
- Update appAlexaSettingsAPI.js [`#240`](https://github.com/jovotech/jovo-framework/pull/240)
- :recycle: Adds all parameters to directives ; setEvents() builds auto… [`#230`](https://github.com/jovotech/jovo-framework/pull/230)
- Add Table Card [`#233`](https://github.com/jovotech/jovo-framework/pull/233)
- Feature/playback controller [`#229`](https://github.com/jovotech/jovo-framework/pull/229)
- typo fix - spelling of latitude and longitude [`#235`](https://github.com/jovotech/jovo-framework/pull/235)
- Alexa - AudioPlayer - add PlaybackController events [`#227`](https://github.com/jovotech/jovo-framework/pull/227)
- feat-botanalytics [`#223`](https://github.com/jovotech/jovo-framework/pull/223)
- 🔨 Added validation method for ISP and en-US locale [`#221`](https://github.com/jovotech/jovo-framework/pull/221)

## [v1.4](https://github.com/jovotech/jovo-framework/compare/v1.3...v1.4)

> 2 August 2018

- ✨ Add Alexa Gadgets API [`#204`](https://github.com/jovotech/jovo-framework/pull/204)
- fix body template 6 [`#205`](https://github.com/jovotech/jovo-framework/pull/205)
- 🐛 Fixed canFulfillRequest response format [`#193`](https://github.com/jovotech/jovo-framework/pull/193)
- 🔨  Validated canFulfill and canUnderstand values [`#191`](https://github.com/jovotech/jovo-framework/pull/191)
- ✨  Add CanFulfillIntentRequest [`#190`](https://github.com/jovotech/jovo-framework/pull/190)
- Update TestSuit to work with GoogleActionDialogFlowV2 [`#185`](https://github.com/jovotech/jovo-framework/pull/185)

## [v1.3](https://github.com/jovotech/jovo-framework/compare/v1.2...v1.3)

> 22 June 2018

- Add Alexa Video Preamble Option [`#184`](https://github.com/jovotech/jovo-framework/pull/184)
- Adding support for audio track metadata in the Alexa Audio Player. [`#183`](https://github.com/jovotech/jovo-framework/pull/183)
- ✨ Adds getToken() to connectionsResponseRequest [`#179`](https://github.com/jovotech/jovo-framework/pull/179)
- Fix testing from within Dialogflow V2 [`#178`](https://github.com/jovotech/jovo-framework/pull/178)
- Prevent (and gracefully handle) DynamoDB errors [`#169`](https://github.com/jovotech/jovo-framework/pull/169)
- ✨ Adds responseError event [`#170`](https://github.com/jovotech/jovo-framework/pull/170)
- Sample code rectified the getAddress to getDeviceAddress [`#171`](https://github.com/jovotech/jovo-framework/pull/171)
- Improve error handling [`#164`](https://github.com/jovotech/jovo-framework/pull/164)
- Register plugins without a name [`#166`](https://github.com/jovotech/jovo-framework/pull/166)

## [v1.2](https://github.com/jovotech/jovo-framework/compare/v1.1...v1.2)

> 17 May 2018

- add testSuite [`#153`](https://github.com/jovotech/jovo-framework/pull/153)
- Add &lt;phoneme&gt; support to SpeechBuilder [`#151`](https://github.com/jovotech/jovo-framework/pull/151)
- User Class Context Update [`#150`](https://github.com/jovotech/jovo-framework/pull/150)
- 🎨 switches to enum instead of hard coded string [`#147`](https://github.com/jovotech/jovo-framework/pull/147)
- :recycle: Refactor session attributes + request parser [`#146`](https://github.com/jovotech/jovo-framework/pull/146)
- :sparkles: Add context to user object [`#145`](https://github.com/jovotech/jovo-framework/pull/145)
- 👌 Moves & Renames userContext.prevLevel to userContext.prev.size  [`#141`](https://github.com/jovotech/jovo-framework/pull/141)
- Azure Functions: only accept request by POST method [`#107`](https://github.com/jovotech/jovo-framework/pull/107)
- :sparkles: In skill purchases [`#144`](https://github.com/jovotech/jovo-framework/pull/144)
-  ✨ User class Context Update [`#138`](https://github.com/jovotech/jovo-framework/pull/138)
- :sparkles: Import config from app.json [`#136`](https://github.com/jovotech/jovo-framework/pull/136)
-  🐛 fixes getTimestamp() on googleAction requests v1 & v2 [`#135`](https://github.com/jovotech/jovo-framework/pull/135)
- add v1.1.5 tests [`#134`](https://github.com/jovotech/jovo-framework/pull/134)
- :recycle: Refactor routing/handler + add tests [`#133`](https://github.com/jovotech/jovo-framework/pull/133)
- :bookmark: Change to v1.1.3 [`#120`](https://github.com/jovotech/jovo-framework/pull/120)
- :recycle: Merge + Fix unit tests [`#119`](https://github.com/jovotech/jovo-framework/pull/119)
- Fix dialogflow V2 input handling (issue #116) [`#117`](https://github.com/jovotech/jovo-framework/pull/117)
- :sparkles: Add multiple handlers to setHandler(handler1, handler2, ...) [`#115`](https://github.com/jovotech/jovo-framework/pull/115)
- :white_check_mark: Add more unit tests [`#114`](https://github.com/jovotech/jovo-framework/pull/114)
- ✨ Adds Chatbase Analytics Integration | 🐛 Other analytics integrations for Alexa Skills will only send data, if there is a session object [`#110`](https://github.com/jovotech/jovo-framework/pull/110)

## [v1.1](https://github.com/jovotech/jovo-framework/compare/v1.0...v1.1)

> 29 March 2018

- add azure functions support [`#104`](https://github.com/jovotech/jovo-framework/pull/104)
- Added aliases for Speechbuilder's 'say-as' methods [`#106`](https://github.com/jovotech/jovo-framework/pull/106)
- Added gcloud datastore integration  [`#99`](https://github.com/jovotech/jovo-framework/pull/99)
- Added Event-listeners to routing [`#100`](https://github.com/jovotech/jovo-framework/pull/100)
- v1 fixes [`#92`](https://github.com/jovotech/jovo-framework/pull/92)
- v 1.0.3 [`#89`](https://github.com/jovotech/jovo-framework/pull/89)
- 1.0.1 [`#1`](https://github.com/jovotech/jovo-framework/pull/1)
- 🔨 Update alexaSkill.js [`#82`](https://github.com/jovotech/jovo-framework/pull/82)

## [v1.0](https://github.com/jovotech/jovo-framework/compare/v0.6...v1.0)

> 15 February 2018

- 🐛 Fixed setSessionAttributes issue on Google Actions [`#75`](https://github.com/jovotech/jovo-framework/pull/75)
- 🔨 Added BodyTemplate7 [`#65`](https://github.com/jovotech/jovo-framework/pull/65)
- Added Image Display Option feature for Google Action Basic Card [`#56`](https://github.com/jovotech/jovo-framework/pull/56)
- Fix bespoken source object calls [`#50`](https://github.com/jovotech/jovo-framework/pull/50)
- 📝 Added clarification for input parameters [`#44`](https://github.com/jovotech/jovo-framework/pull/44)
- ✨ Added intentsToSkipUnhandled functionality [`#34`](https://github.com/jovotech/jovo-framework/pull/34)
- :twisted_rightwards_arrows: Allows jovo-webhook to be called by external proxy command. [`#21`](https://github.com/jovotech/jovo-framework/pull/21)
- Bespoken analytics integration [`#24`](https://github.com/jovotech/jovo-framework/pull/24)
- 🐛 Fixed getState priority [`#25`](https://github.com/jovotech/jovo-framework/pull/25)
- Bespoken analytics [`#1`](https://github.com/jovotech/jovo-framework/pull/1)

## [v0.6](https://github.com/jovotech/jovo-framework/compare/v0.5...v0.6)

> 19 September 2017

## [v0.5](https://github.com/jovotech/jovo-framework/compare/v0.4...v0.5)

> 7 September 2017

## [v0.4](https://github.com/jovotech/jovo-framework/compare/v0.3...v0.4)

> 31 August 2017

- ⚡️ Added some methods to get each platform's specific information [`#18`](https://github.com/jovotech/jovo-framework/pull/18)
- :sparkles: Added render templates for Echo Show + Alexa Request Verifier + Tests [`#19`](https://github.com/jovotech/jovo-framework/pull/19)
- :sparkles: :bug: Alexa list and address integration + Fixed toIntent bug [`#17`](https://github.com/jovotech/jovo-framework/pull/17)

## [v0.3](https://github.com/jovotech/jovo-framework/compare/v0.2.0...v0.3)

> 22 August 2017

- :sparkles: Added more SpeechBuilder functionality [`#16`](https://github.com/jovotech/jovo-framework/pull/16)
- :sparkles: Added isNewSession() for both platforms [`#15`](https://github.com/jovotech/jovo-framework/pull/15)
- :sparkles: Added getTimestamp() [`#14`](https://github.com/jovotech/jovo-framework/pull/14)
- :sparkles: Added skipUsers method for analytics integrations [`#13`](https://github.com/jovotech/jovo-framework/pull/13)
- ⚡️ Some DynamoDB improvements [`#12`](https://github.com/jovotech/jovo-framework/pull/12)
- :zap: Validated small and large imageURl for Alexa cards [`#11`](https://github.com/jovotech/jovo-framework/pull/11)
- 🌐 ✨ Added i18n library [`#10`](https://github.com/jovotech/jovo-framework/pull/10)
- Added lodash to handle set and get session attributes methods [`#9`](https://github.com/jovotech/jovo-framework/pull/9)

## [v0.2.0](https://github.com/jovotech/jovo-framework/compare/v0.1.2...v0.2.0)

> 10 August 2017

- :bug: Fixed issues when redirecting intents [`#8`](https://github.com/jovotech/jovo-framework/pull/8)

## [v0.1.2](https://github.com/jovotech/jovo-framework/compare/v0.1.0...v0.1.2)

> 8 August 2017

- :bug: Fixed unknown intent in state issue [`#7`](https://github.com/jovotech/jovo-framework/pull/7)
- :bug: Fixed getSessionAttribute(name) issue [`#6`](https://github.com/jovotech/jovo-framework/pull/6)
- Fixed getSessionAttribute(name) issue [`#1`](https://github.com/jovotech/jovo-framework/pull/1)
- 📝 Add a Gitter chat badge to README.md [`#1`](https://github.com/jovotech/jovo-framework/pull/1)

## [v0.1.0]()

> 27 July 2017
