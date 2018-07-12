# Unit Testing for Voice Apps

...

* [Introduction to Unit Testing](#introduction-to-unit-testing)


## Introduction to Unit Testing

## Getting Started with the Jovo Test Suite

Take a look at this template:



The Jovo Test Suite ...
Mocha and Chai

Require: 

```shell
# Install mocha, learn more:
$ npm install mocha --save-dev

# Install chai, learn more:
$ npm install chai --save-dev
```

```javascript
"scripts": {
    "test": "mocha test --recursive"
},
```

```shell
$ npm test
```

```javascript
const expect = require('chai').expect;
const getPlatformRequestBuilder = require('jovo-framework').util.getPlatformRequestBuilder;
const {send} = require('jovo-framework').TestSuite;
```

Request Builder:

```javascript
for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlow')) {

    // Add tests here

}
```

```javascript
describe('GROUP', function() {
    it('should ...', function(done) {
        send(rb.intent('SomeIntent'))
            .then((res) => {
                expect(res.isTell('Some speech.')).to.equal(true);
                done();
            })
    })

    // Add more it's for this group here
})
```


You can now use the Jovo TestSuite to integrate unit tests into your voice app project.

```javascript
for (let rb of getPlatformRequestBuilder('AlexaSkill', 'GoogleActionDialogFlow')) {
    describe('LAUNCH_INTENT', function () {
        it('should successfully go into LaunchIntent for ' + rb.type(), function (done) {
            send(rb.launch())
                .then((res) => {
                    expect(res.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')).to.equal(true);
                    done();
                });
        });
    });
}
```

Unit Testing is a feature that is currently in `beta`. For a sample project that uses testing, take a look at this GitHub repository: [milksnatcher/DefaultTests](https://github.com/Milksnatcher/DefaultTests).


<!--[metadata]: {"title": "Unit Testing for Voice Apps", 
                "description": "Learn how to write unit tests for Alexa Skills and Google Actions with the Jovo Framework.",
                "activeSections": ["advanced", "advanced_testing"],
                "expandedSections": "advanced",
                "inSections": "advanced",
                "breadCrumbs": {"Docs": "docs/",
				"Advanced Features": "docs/advanced",
                "Unit Testing": ""
                                },
		"commentsID": "framework/docs/unit-testing",
		"route": "docs/unit-testing"
                }-->
