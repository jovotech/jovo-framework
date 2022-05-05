import { Socket } from 'socket.io-client';
import { Writable } from 'stream';
import { JovoDebuggerEvent } from '.';

export function propagateStreamAsLog(stream: Writable, socket: typeof Socket): void {
  const originalWriteFn = stream.write;
  stream.write = function (chunk: Buffer, ...args: unknown[]) {
    socket.emit(JovoDebuggerEvent.AppConsoleLog, chunk.toString(), new Error().stack);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (originalWriteFn as any).call(this, chunk, ...args);
  };
}
