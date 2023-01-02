---
title: 'Google BigQuery Integration'
excerpt: 'The Google BigQuery Jovo integration allows you to monitor and analyze conversations between your Jovo app and its users.'
url: 'https://www.jovo.tech/marketplace/analytics-bigquery'
---

# Google BigQuery Integration

Use the BigQuery Analytics plugin to automatically track events for sessions, intents, entities, etc.and also track custom events in code.

## Introduction

[BigQuery](https://cloud.google.com/bigquery) allows you to easily collect, process, and analyze data streams in real time.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/analytics-bigquery
```

Here is an example how include the plugin in your `app.ts`:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';

// ...

app.configure({
  plugins: [
    new BigQueryAnalytics({/*..*/}),
    // ...
  ],
});
```

## Configuration

The following configurations can be added:

```typescript
new BigQueryAnalytics({
    appId: 'my-app',
    datasetId: 'my_dataset',
    tableId: 'events', 
    libraryConfig: {/* ... */},
    dryRun: false,
    insertRowOptions: {/* ... */},
    logging: true,
    onAddEvent: async (jovo: Jovo, event: AnalyticsEvent) => {
      event.timeZone = '';
    },
}),
```

- `appId`: Required. Matches appId column in BigQuery table. Logged with every event to distiguish one app's log entries from another.
- `datasetId`: Required. The name of the BigQuery Dataset to write to.
- `tableId`: Required. The name of the BigQuery Table to write to.
- `libraryConfig`: Required. BigQuery options including credentials file. See [libraryConfig](#libraryconfig) for more information.
- `dryRun`: Required. Default is `false`. When true, the plugin's `sendEvents` function does not insert the events into the BigQuery table.
- `insertRowOptions`: Required. Used to configure the insert of rows into BigQuery. See [insertRowOptions](#insertrowoptions) for more information.
- `logging`: Required. Default is `false`. When `true`, logs plugin calls for `addEvent` and `sendEvents`. See [logging](#logging) for more information.
- `onAddEvent`: Optional. Allows modification of the `event` before it is sent to BigQuery. See [onAddEvent](#onaddevent) for more information.

### libraryConfig

Add the [service account](#bigquery) JSON file to the `src` folder.

The BigQuery client config includes:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';
import serviceAccount from './serviceAccount.json';

new BigQueryAnalytics({
  libraryConfig: {
    projectId: serviceAccount.project_id,
    keyFilename: './src/serviceAccount.json',
  },
    // ...
}),
```

- `projectId`: BigQuery project id.
- `keyFilename`: Path to the service account JSON file.

### insertRowOptions

Configure the options for inserting rows into BigQuery. 

The insert row options include:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';

new BigQueryAnalytics({
  insertRowOptions: { 
    skipInvalidRows: true, 
    ignoreUnknownValues: true 
  },
    // ...
}),
```
- `skipInvalidRows`: If `true` (default), insert all valid rows of a request, even if invalid rows exist.
- `ignoreUnknownValues`: If `true` (default), accept rows that contain values that do not match the schema. The unknown values are ignored.

See [BigQuery Table insert](https://cloud.google.com/nodejs/docs/reference/bigquery/latest/bigquery/table#_google_cloud_bigquery_Table_insert_member_1_) for more details.

### logging

You can configure all logging options with a simple `true` or `false` (default):

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';

new BigQueryAnalytics({
  logging: true,
    // ...
}),
```
All request and response events are added to an array with `addEvent` and then later sent to BigQuery with `sendEvents`.

You can enable logging for specific plugin functions:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';

new BigQueryAnalytics({
  logging: {
    addEvent: true,
    sendEvents: true,
  },
    // ...
}),
```
- `addEvent`: This logs the event just after the optional call to the `onAddEvent` function defined in config.
- `sendEvents`: Sends the events to BigQuery. If there are errors inserting the rows, they will be logged.

### onAddEvent

As a final chance to update an event before it is added to the list of event to log, define the `onAddEvent` function:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';

new BigQueryAnalytics({
  onAddEvent: async (jovo: Jovo, event: AnalyticsEvent) => {
    event.timeZone = '';
  },
    // ...
}),
```

This shows how you can use the TimeZone plugin to set the timezone:

```typescript
import { BigQueryAnalytics } from '@jovotech/analytics-bigquery';
import { TimeZonePlugin } from '@jovo-community/plugin-timezone';

plugins: [
  new TimeZonePlugin(), 
  new BigQueryAnalytics({
    onAddEvent: async (jovo: Jovo, event: AnalyticsEvent) => {
      event.timeZone = await jovo.$timeZone.getTimeZone();
    },
      // ...
  }),
]
```

## Event Tracking

### Common Properties
All calls to `$bigQuery.addEvent(event)` track the following properties:
- `eventId` (string) - generated UUID for the event
- `appId` (string) - the appId from config
- `eventDate` (string) - UTC date in ISO 8601 format
- `epochMilliseconds` (number) - the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
- `epochSeconds` (number) - the number of seconds elapsed since January 1, 1970 00:00:00 UTC
- `locale` (string) - the locale from the request (ex: 'en' or 'en-US')
- `timeZone` (string) - timeZone from the request (ex: 'America/Phoenix') if it exists. Use `onAddEvent` for platforms that don't pass the timeZone in the request.
- `userId` (string) - platform-supplied user id
- `sessionId` (string) - platform-supplied session id
- `requestId` (string) - generated UUID that groups all events for a given request

#### Built-in Events
The following events are tracked automatically and add additional properties (as shown):

- device_capabilities
  - `deviceId` (string) - the platform-supplied device id
  - `supportScreen` (boolean) - if device supports a screen
  - `supportAudio` (boolean) - if device supports SSML audio
  - `supportLongformAudio` (boolean) - if device supports long-form audio
  - `supportVideo` (boolean) - if device supports video

- error
  - `errorName` (string) - the name of the error
  - `message` (string) - the error message
  - `stack` (string) - the error stack trace

- execute_handler
  - `component` (string) - the name of the component
  - `handler` (string) - the name of the handler

- intent
  - `intent` (string) - the resolved intent

- intent_entity
  - `intent` (string) - the resolved intent
  - `entityName` (string) - the name of the entity
  - `entityId` (string) - the id of the entity
  - `entityResolved` (string) - the resolved value of the entity
  - `entityValue` (string) - the value of the entity

- new_user (only common properties)

- request_start (only common properties)

- request_end
  - `elapsed` (number) - milliseconds since request_start event

- session_start (only common properties)

- session_end
  - `elapsed` (number) - milliseconds since session_start event
  - `reason` (string) - reason for the session to end ('user' or 'error')

- transcript
  - `transcriptText` (string) - the text transcription from ASR

### Custom Events

Include your own custom events by calling `$bigQuery.addEvent(event)` or `$bigQuery.addError(error)`.

For any custom properties you add in code, update the Google BigQuery table schema to include them.

#### Event

```typescript
await this.$bigQuery.addEvent({
    eventType: 'game_start',
    player: 'player-name',
});
```

#### Error

```typescript
try {
  //...
} catch (error) {
  await this.$bigQuery.addError(error);
}
```

## BigQuery

To set up BigQuery, you need to create a service account, download the JSON file, and include it in your project's `src` folder. Typically, we name the file `serviceAccount.json`.

Steps:

1. In the [console](https://console.cloud.google.com), create a new Google Cloud project.
2. Select the project.
3. Create a Service Account and set the Service Account ID.
4. Assign the Service Account the role of "BigQuery Data Editor".
5. Select the Service Account and on the Keys tab, click the Add Key button.
6. Create a new key with JSON key type.
7. The JSON file will download. Copy the file to your Jovo project's `src` folder and rename it to `serviceAccount.json`.
8. In your Google project, open BigQuery and create a `dataset` and a `table`.
9. Define the table schema using the [starter schema](./starter-schema.json)


To learn more about service account credentials, see [Authenticating with a service account key file](https://cloud.google.com/bigquery/docs/authentication/service-account-file#node.js). The service account must include the BigQuery Data Editor role to insert rows to the table.

Before you can log to the BigQuery table, you need to create the table and define a schema. Use this [starter schema](./starter-schema.json) and paste into the text area when you toggle on "Edit as text".