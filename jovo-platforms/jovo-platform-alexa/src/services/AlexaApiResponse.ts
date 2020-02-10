export class AlexaApiResponse {
  httpStatus: number | undefined;
  data: any; // tslint:disable-line

  // tslint:disable-next-line
  constructor(httpStatus: number | undefined, data: any) {
    this.httpStatus = httpStatus;
    this.data = data;
  }
}
