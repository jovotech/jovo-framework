# Google Action Updates

How to keep Google Action users updated with Jovo.

* [Introduction](#introduction)
* [Daily Updates](#daily-updates)
* [Routine Suggestions](#routine-suggestions)
* [App Logic](#app-logic)
* [User Experience](#user-experience)

## Introduction

Updates as long as notifications, are used to keep users engaged interacting with the users with daily relevant information. Check the official documentation [here](https://developers.google.com/actions/assistant/updates/overview).

## Daily Updates

Using Daily Updates, you can manage to trigger updates everyday at scheduled time, choosen by the user. The user receives a notification that when clicked triggers the intent specified when configured the update.

More information [here](https://developers.google.com/actions/assistant/updates/daily) at the official documentation.

### Daily Updates Setup

You need to activate daily updates for at least one of your intents, the official documentation tells to do that this way:

Open the Actions console in a web browser, then:

1. Navigate to **Build** > **Actions**.
2. Click the Action matching the additional triggering intent for which you'd like to enable daily updates.
3. Scroll down to the **User engagement** section and turn on **Would you like to offer daily updates to users**.
4. Enter a **Content title**.
5. Click **Save**.

## Routine Suggestions

Google Assistant provides a featured called Routines, which is configured to trigger some intents from a basic routine command like "good morning" or "i'm in home".

### Routine Suggestions Setup

Like daily updates you need to inform Google Actions that your intent can be elegible to be a routine update.

Open the Actions console in a web browser, then do the following:

1. Navigate to **Build** > **Actions**.
2. Click the Action matching the additional triggering intent you'd like to enable updates for.
3. Scroll down to the **User engagement** section and turn on **Would you like to let users add this Action to Google Assistant Routines?**.
4. Enter a **Content title**.
5. Click **Save**.

## App Logic

If you setup an intent to be an update intent, when the user pass through the flow with success Google Assistant suggest to the user to be updated. So, no need for code here. But if you want to trigger the update registering from inside the voice app yourself, you can use Jovo's API in order to do that.

The `$updates` property from the `$googleAction` platform property has some methods to do that.

```javascript
app.setHandler({
  LAUNCH() {
    this.$googleAction.$updates.askForRegisterUpdate("SayHello");
  },

  ON_REGISTER_UPDATE() {
    if (this.$googleAction.$updates.isRegisterUpdateOk()) {
      this.ask("Registered for daily updates");
    } else {
      this.ask("Cancelled by the user");
    }
  },

  SayHello() {
    this.ask("Hello friend!");
  }
})
```

If you set `SayHello` as an update intent it will work just fine.

In order to use with routines, you just have to pass the `frequency` parameter as `ROUTINES`:

```javascript
this.$googleAction.$updates.askForRegisterUpdate("SayHello", "ROUTINES");
```

## User Experience

Avoide asking the user to receive updates multiple times, so keep this information within user data:

```javascript
app.setHandler({
  LAUNCH() {
    if (!this.$user.data.dailyUpdatesAsked) {
      this.$googleAction.showSuggestionChips(['yes', 'no']);
      this.ask("Would you like to receive updates?");
    } else {
      this.toIntent("SayHello");
    }
  },

  YesIntent() {
    this.$googleAction.$updates.askForRegisterUpdate("SayHello");
  },

  SayHello() {
    this.ask("Hello friend!");
  },

  ...
});
```

<!--[metadata]: {"description": "Learn how to use daily updates and routine suggestions with Jovo.",
		            "route": "google-assistant/updates"}-->
