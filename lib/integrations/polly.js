const AWS = require('aws-sdk');
const crypto = require('crypto');

module.exports = function(config) {
    let module = {};
    AWS.config.update(config.awsConfig);
    let s3 = new AWS.S3();
    // Create an Polly client
    const Polly = new AWS.Polly({
        // signatureVersion: 'v4',
        // region: 'us-east-1'
    });

    const pollyParams = {
        'OutputFormat': 'mp3',
        'VoiceId': config.voiceId,
        'TextType': 'ssml',
    };

    module.ssml = function(text) {
        return new Promise((resolve, reject) => {
            return getUrl(text).then((url) => resolve('<speak><audio src="'+url+'"/></speak>'));
        });
    };

    module.url = function(text) {
        return new Promise((resolve, reject) => {
            return getUrl(text).then((url) => resolve(url));
        });
    };

    /**
     * Returns url of audio
     * @param {string} ssml
     * @return {Promise<any>}
     */
    function getUrl(ssml) {
        return new Promise((resolve, reject) => {
            let key = pollyParams.VoiceId + '/' + crypto.createHash('md5').update(ssml).digest('hex') + '.mp3';
            headObject(key).then((url) => {
                if (url) {
                    resolve(url);
                } else {
                    return synthesize(ssml)
                        .then((data) => putObjectToS3(data, ssml, key)
                        .then((url) => resolve(url)));
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    /**
     * Check existing for existing audio
     * @param {string} key
     * @return {Promise<any>}
     */
    function headObject(key) {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: config.s3bucket,
                Key: key,
            };
            s3.headObject(params, function(err, data) {
                if (err) {
                    resolve();
                } else {
                    resolve('https://s3.amazonaws.com/' + config.s3bucket + '/' + key);
                }
            });
        });
    }
    /**
     * Text to Speech
     * @param {string} text
     * @return {Promise} with audioStream
     */
    function synthesize(text) {
        pollyParams.Text = text;
        return new Promise((resolve, reject) => {
            Polly.synthesizeSpeech(pollyParams, (err, data) => {
                if (err) {
                    reject(err);
                } else if (data) {
                    if (data.AudioStream instanceof Buffer) {
                        resolve(data.AudioStream);
                    }
                }
            });
        });
    }

    /**
     * Puts file into a S3 bucket and makes it public
     * @param {*} data
     * @param {string} ssml
     * @param {string} key
     * @return {Promise}
     */
    function putObjectToS3(data, ssml, key) {
        return new Promise((resolve, reject) => {
            let params = {
                Bucket: config.s3bucket,
                Key: key,
                Body: data,
                ACL: 'public-read',
                Tagging: 'ssml='+escapeXml(ssml),
            };
            s3.putObject(params, function(err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve('https://s3.amazonaws.com/' + config.s3bucket + '/' + key);
            });
        });
    }

    /**
     * Escapes tag value
     * @param {string} tagValue
     * @return {string|*|void}
     */
    function escapeXml(tagValue) {
        return tagValue.replace(/[^a-zA-Z0-9 ]/g, '_');
    }
    return module;
};

