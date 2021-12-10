import { Socket } from 'socket.io-client';
import { Writable } from 'stream';
import { JovoDebuggerEvent } from '.';

export function propagateStreamAsLog(stream: Writable, socket: typeof Socket): void {
  const originalWriteFn = stream.write;
  stream.write = function (chunk: Buffer, ...args: unknown[]) {
    socket.emit(JovoDebuggerEvent.AppConsoleLog, chunk.toString(), new Error().stack);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return originalWriteFn.call(this, chunk, ...args);
  };
}
