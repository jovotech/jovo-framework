
export class HtmlResponse {

    url?: string;
    data?: Record<string, object>;
    suppress?: boolean;

    constructor(obj: {
        url?: string;
        data?: Record<string, object>;
        suppress?: boolean;
    }) {

        this.url = obj.url;
        this.data = obj.data;
        this.suppress = obj.suppress;

    }
}
