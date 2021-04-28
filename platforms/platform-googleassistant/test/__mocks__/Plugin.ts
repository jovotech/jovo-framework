import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';

export class Plugin extends JovoCliPlugin {
  type: PluginType = 'command';
  id = 'testPlugin';
}
