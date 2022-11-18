const { DebuggerConfig } = require('@jovotech/plugin-debugger');

const debuggerConfig = new DebuggerConfig({
  locales: ['en'],
  buttons: [
    {
      label: 'LAUNCH',
      input: {
        type: 'LAUNCH',
      },
    },
    {
      label: 'Yes',
      input: {
        intent: 'YesIntent',
      },
    },
    {
      label: 'No',
      input: {
        intent: 'NoIntent',
      },
    },
    // ...
  ],
});

module.exports = debuggerConfig;
