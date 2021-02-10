"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const jovo_platform_googleassistant_1 = require("jovo-platform-googleassistant");
const jovo_platform_alexa_1 = require("jovo-platform-alexa");
const jovo_plugin_debugger_1 = require("jovo-plugin-debugger");
const jovo_db_filedb_1 = require("jovo-db-filedb");
const app = new jovo_framework_1.App();
exports.app = app;
app.use(new jovo_platform_googleassistant_1.GoogleAssistant(), new jovo_platform_alexa_1.Alexa(), new jovo_plugin_debugger_1.JovoDebugger(), new jovo_db_filedb_1.FileDb());
app.setHandler({
    LAUNCH() {
        this.$user.$data.foo = 'bar';
        return this.toIntent('HelloWorldIntent');
    },
    HelloWorldIntent() {
        this.followUpState('IntroductionState')
            .ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },
    'IntroductionState': {
        MyNameIsIntent() {
            this.toStatelessIntent('MyNameIsIntent');
        },
    },
    MyNameIsIntent() {
        this.$user.$data.name = this.$inputs.name.value;
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
    NameFromDbIntent() {
        const name = this.$user.$data.name;
        this.tell('Hey ' + name + ', nice to meet you!');
    },
    CheckPowerUserIntent() {
        const sessionsCount = this.$user.$metaData.sessionsCount;
        if (sessionsCount > 10) {
            this.tell('Hey buddy!');
        }
        else {
            this.tell('Hello sir!');
        }
    },
});
//# sourceMappingURL=app.js.map