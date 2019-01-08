import * as path from "path";


export class Util {

    static consoleLog(pathDepth = 1) {
        const _privateLog:Function = console.log;
        console.log = (...msgs: any[]) => { // tslint:disable-line
            if (pathDepth === -1) {
                return;
            }
            const newMessages: any[] = []; // tslint:disable-line
            let stack: string = (new Error()).stack!.toString();
            stack = stack.substring(stack.indexOf('\n', 8) + 2);

            for (const msg of msgs) {
                stack = stack.substring(0, stack.indexOf('\n'));
                const matches = /\(([^)]+)\)/.exec(stack);

                if (matches) {
                    stack = matches[1].substring(matches[1].lastIndexOf(path.sep) + 1);
                    const filePathArray = matches[1].split(path.sep);
                    let filePath = '';

                    for (let i = filePathArray.length-pathDepth; i < filePathArray.length; i++) {
                        filePath += path.sep + filePathArray[i];
                    }

                    newMessages.push(filePath.substring(1), '\n');
                    newMessages.push(msg);
                }
            }
            _privateLog.apply(console, newMessages); // eslint-disable-line
        };
    }

}
