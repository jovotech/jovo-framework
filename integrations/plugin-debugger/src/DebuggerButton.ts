import { JovoInput } from '@jovotech/framework';
import { PlainObjectType } from './interfaces';

// Omit all functions and make `type` optional
export type DebuggerButtonInput = Omit<PlainObjectType<JovoInput>, 'type'> &
  Partial<Pick<JovoInput, 'type'>>;

export interface DebuggerButtonBase {
  label: string;
}

export interface InputDebuggerButton extends DebuggerButtonBase {
  input: DebuggerButtonInput | DebuggerButtonInput[];
}

export interface RequestDebuggerButton extends DebuggerButtonBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any | any[];
}

export interface SequenceDebuggerButton extends DebuggerButtonBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sequence: Array<DebuggerButtonInput | any>;
}

export type DebuggerButton = InputDebuggerButton | RequestDebuggerButton | SequenceDebuggerButton;
