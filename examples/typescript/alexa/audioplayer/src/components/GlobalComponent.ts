import { BaseComponent, Component, Global } from '@jovotech/framework';
import { AudioPlayerComponent } from './AudioPlayerComponent';

@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    return this.$redirect(AudioPlayerComponent);
  }
}
