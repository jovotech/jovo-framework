import { JovoResponse } from 'jovo-core';
import { CorePlatformResponse, CorePlatformResponseJSON } from 'jovo-platform-core';
export declare class WebAppResponse extends CorePlatformResponse implements JovoResponse {
    static reviver(key: string, value: any): any;
    static fromJSON(json: CorePlatformResponseJSON | string): WebAppResponse;
    constructor();
}
