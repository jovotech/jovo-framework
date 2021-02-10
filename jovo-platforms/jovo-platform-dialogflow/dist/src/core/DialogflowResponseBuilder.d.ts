import { ResponseBuilder } from 'jovo-core';
import { DialogflowResponse } from './DialogflowResponse';
import { DialogflowFactory } from './DialogflowFactory';
import { PlatformFactory } from '../index';
export declare class DialogflowResponseBuilder<T extends PlatformFactory = DialogflowFactory> implements ResponseBuilder<DialogflowResponse> {
    private factory;
    constructor(factory: T);
    create(json: any): DialogflowResponse;
}
