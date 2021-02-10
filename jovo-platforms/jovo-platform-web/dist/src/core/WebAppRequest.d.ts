import { JovoRequest } from 'jovo-core';
import { CorePlatformRequest, CorePlatformRequestJSON } from 'jovo-platform-core';
export declare class WebAppRequest extends CorePlatformRequest implements JovoRequest {
    static fromJSON(json: CorePlatformRequestJSON | object | string): WebAppRequest;
    static reviver(key: string, value: any): any;
    type: string;
}
