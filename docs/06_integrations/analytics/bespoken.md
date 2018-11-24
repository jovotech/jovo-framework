# [Integrations](../) > [Analytics](./README.md) > Bespoken

Learn how to use Bespoken Analytics for your Alexa Skills and Google Actions built with Jovo.

* [About Bespoken](#about-bespoken)
* [Installation](#bespoken)
   * [Create a Bespoken Dashboard Account](#create-a-bespoken-dashboard-account)
   * [Enable Bespoken Analytics](#enable-bespoken-analytics)
   * [Test Bespoken](#test-bespoken)
   


## About Bespoken

![Bespoken Website](../../img/bespoken-home.jpg)

[Bespoken](https://bespoken.io/) offers monitoring and testing tools for voice apps, including a command line interface, logging, and unit testing.

With the Bespoken Analytics integration for Jovo, you can get access to logging and monitoring features for your Alexa Skills and Google Actions.

## Installation

To use Bespoken Analytics for your voice app, you need to complete the following steps:

1. Create a Bespoken Dashboard account
2. Enable Bespoken Analytics in your Jovo voice app
3. Test your app

### Create a Bespoken Dashboard Account

1. Create a Bespoken account or log in at https://apps.bespoken.io/dashboard/.

2. Click the plus sign on the Home page:

![Bespoken Add a Skill or Action](../../img/bespoken-dashboard.jpg)

3. Set the name for your app and click on "Validate your new skill"
![Bespoken Set source name](../../img/bespoken-dashboard-create.jpg)

4. Click on "Get Started" to the right
![Bespoken Get Started](../../img/bespoken-dashboard-main.jpg)

5. Copy the Secret Key as shown below
![Bespoken Key](../../img/bespoken-dashboard-key.jpg)

### Enable Bespoken Analytics

You have to options to add Bespoken Analytics to your voice app:

* Use the Jovo app config
* Use the add commands

Below is an example for both:

```javascript
// Option 1: Use the Jovo app config
const config = {
    /**
     * Other settings
     */
    analytics: {
        services: {
            BespokenAlexa: {
                key: '<key>',
            },
            BespokenGoogleAction: {
                key: '<key>',
            },
        },
    },
};

// Option 2: Use the add command
app.addBespokenAnalytics(key);
```

### Test Bespoken

Test your voice app, after a bit your session should appear in the created skill.



<!--[metadata]: {"title": "Bespoken Analytics Integration", "description": "Add Bespoken Analytics to your Alexa Skills and Google Actions with Jovo", "activeSections": ["integrations", "analytics"], "expandedSections": "integrations", "inSections": "integrations", "breadCrumbs": {"Docs": "docs/", "Integrations": "docs/integrations", "Analytics": "docs/analytics", "Bespoken": "" }, "commentsID": "docs/analytics/bespoken",
"route": "docs/analytics/bespoken" }-->
