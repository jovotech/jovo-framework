import * as https from "https";
export class AmazonProfileAPI {

    /**
     * Makes a request to the amazon profile api
     */
    static requestAmazonProfile(acccessToken: string) {
        return new Promise((resolve, reject) => {
            const url = `https://api.amazon.com/user/profile?access_token=${acccessToken}`;
            https.get(url, (res) => {
                const contentType = res.headers['content-type'] || '';

                let error;
                if (res.statusCode !== 200) {
                    error = new Error('Something went wrong');
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Wrong content type');
                }
                if (error) {
                    res.resume();
                    return reject(error);
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        return resolve(JSON.parse(rawData));
                    } catch (e) {
                        return reject(new Error('Something went wrong'));
                    }
                });
            }).on('error', (e) => {
                return reject(new Error('Something went wrong'));
            });
        });
    }
}

