import { SapCaiResponse } from './SapCaiResponse';
import { ResponseBuilder } from 'jovo-core';
export declare class SapCaiResponseBuilder implements ResponseBuilder<SapCaiResponse> {
    create(json: any): SapCaiResponse;
}
