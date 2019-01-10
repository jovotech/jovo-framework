

export enum ErrorCode {
    ERR = 'ERR',
}


export class JovoError extends Error {

    code: ErrorCode | string = ErrorCode.ERR;
    hint: string | undefined;

    constructor(msg: string, code: ErrorCode | string = ErrorCode.ERR, hint?: string) {
        super(msg);
        this.hint = hint;
        this.code = code;
    }



}
