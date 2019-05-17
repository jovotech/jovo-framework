export class GoogleActionAPIResponse {
    httpStatus: number | undefined;
    data: any; // tslint:disable-line

    constructor(httpStatus: number | undefined, data: any) { // tslint:disable-line
        this.httpStatus = httpStatus;
        this.data = data;
    }
}
