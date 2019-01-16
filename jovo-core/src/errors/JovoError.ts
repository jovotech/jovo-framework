

export enum ErrorCode {
    ERR = 'ERR',
}


export class JovoError extends Error {

    code: ErrorCode | string = ErrorCode.ERR;
    module: string | undefined;
    details: string | undefined;
    hint: string | undefined;
    seeMore: string | undefined;

    constructor(message: string,
                code: ErrorCode | string = ErrorCode.ERR,
                module?: string,
                details?: string,
                hint?: string,
                seeMore?: string) {
        super(message);
        this.module = module;
        this.details = details;
        this.hint = hint;
        this.code = code;
        this.seeMore = seeMore;
    }
}
