import { app } from './app';
import { JovoDebugger } from '@jovotech/plugin-debugger';

const config = {
  logging: false,
  plugins: [new JovoDebugger()],
};

export { config };
