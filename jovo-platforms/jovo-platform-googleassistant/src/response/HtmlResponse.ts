
export class HtmlResponse {

    url?: string;
    data?: Record<string, object>;
    supress?: boolean;

    constructor(obj: {
        url?: string;
        data?: Record<string, object>;
        supress?: boolean;
    }) {

        this.url = obj.url;
        this.data = obj.data;
        this.supress = obj.supress;

    }
}
