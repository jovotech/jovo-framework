


// AWS Lambda
exports.handler = async (event) => {
    //return app.handle(new LambdaWrapper(event, context, callback));
    console.log('handler pre')
    await bla();
    console.log('handler done')
};

function bla() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('bla done');
            resolve();
        }, 500)
    });
}

exports.handler();
