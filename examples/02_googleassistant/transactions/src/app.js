const {App} = require('jovo-framework');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new GoogleAssistant({
        transactions: {
            androidPackageName: 'com.example.app',
            keyFile: './keyfile.json'
        }
    }),
    new JovoDebugger(),
);


app.setHandler({
    LAUNCH() {
        // return this.toIntent('ShowConsumablesIntent');
        return this.toIntent('TransactionCheckRequirementsIntent');
    },

    async ShowConsumablesIntent() {
        const consumables = await this.$googleAction.$transaction.getConsumables(['com.example.app.testproduct1337']);
        console.log(consumables);
        this.tell('ok');
    },

    TransactionCheckRequirementsIntent() {
        this.$googleAction.$transaction.checkRequirements({
            requestDeliveryAddress: true,
        }, {
            googleProvidedOptions: {
                prepaidCardDisallowed: false,
                supportedCardNetworks: ['AMEX', 'VISA'],
                tokenizationParameters: {
                    tokenizationType: "PAYMENT_GATEWAY",
                    "parameters": {
                        "gateway": "stripe",
                        "stripe:version": "2018-10-31",
                        "stripe:publishableKey": "<STRIPE_KEY>"
                    }
                }
            },
            // actionProvidedOptions: {
            //     "paymentType": "PAYMENT_CARD",
            //     "displayName": "VISA-1234"
            // },
        });

        this.ask('Check');
    },
    ON_TRANSACTION: {
        TRANSACTION_REQUIREMENTS_CHECK() {
            // this.tell('requirements check')
            if (this.$googleAction.$transaction.isRequirementsCheckOk()) {
                this.$googleAction.$transaction.askForDeliveryAddress('Address?');
            } else if (this.$googleAction.$transaction.isRequirementsCheckUserActionRequired()) {
                this.tell('Further action is required')
            }

        },
        DELIVERY_ADDRESS() {
            if (this.$googleAction.$transaction.isDeliveryAddressAccepted()) {
                this.$googleAction.$transaction.transactionDecision({
                    requestDeliveryAddress: false,
                },
                {
                    // actionProvidedOptions: {
                    //     "paymentType": "PAYMENT_CARD",
                    //     "displayName": "VISA-1234"
                    // },
                    googleProvidedOptions: {
                        prepaidCardDisallowed: false,
                        supportedCardNetworks: ['AMEX', 'VISA'],
                        tokenizationParameters: {
                            tokenizationType: "PAYMENT_GATEWAY",
                            "parameters": {
                                "gateway": "stripe",
                                "stripe:version": "2018-10-31",
                                "stripe:publishableKey": "<STRIPE_KEY>"
                            }
                        }
                    },
                },
                order)
            } else if (this.$googleAction.$transaction.isDeliveryAddressRejected()) {
                this.tell('We need your address to proceed.')
            }
        },
        TRANSACTION_DECISION() {
            if (this.$googleAction.$transaction.isOrderAccepted()) {
                this.$googleAction.$transaction.createOrder('Order created', {
                    actionOrderId: 'unique-13399',
                    orderState: {
                        state: 'CREATED',
                        label: 'Created'
                    },
                    receipt: {
                        userVisibleOrderId: "orderID unique-13399"
                    },
                    updateTime: new Date().toISOString(),
                    orderManagementActions: [
                        {
                            button: {
                                openUrlAction: {
                                    // Replace the URL with your own customer service page
                                    url: 'http://example.com/customer-service',
                                },
                                title: 'Customer Service',
                            },
                            type: 'CUSTOMER_SERVICE',
                        },
                    ],
                    userNotification: {
                        text: 'Notification text.',
                        title: 'Notification Title',
                    },
                })
            }
        },
        COMPLETE_PURCHASE() {
            if (this.$googleAction.$transaction.isOrderAccepted()) {
                this.$googleAction.$transaction.createOrder('Order created', {
                    actionOrderId: 'unique-133993',
                    orderState: {
                        state: 'CREATED',
                        label: 'Created'
                    },
                    receipt: {
                        userVisibleOrderId: "orderID unique-133992"
                    },
                    updateTime: new Date().toISOString(),
                    orderManagementActions: [
                        {
                            button: {
                                openUrlAction: {
                                    // Replace the URL with your own customer service page
                                    url: 'http://example.com/customer-service',
                                },
                                title: 'Customer Service',
                            },
                            type: 'CUSTOMER_SERVICE',
                        },
                    ],
                    userNotification: {
                        text: 'Notification text.',
                        title: 'Notification Title',
                    },
                })
            }
        }
    },
});



const order = {
    id: 'unique-133992',
    cart: {
        merchant: {
            id: 'book_store_1',
            name: 'Book Store',
        },
        lineItems: [
            {
                name: 'Their memoirs',
                id: 'memoirs_3',
                price: {
                    amount: {
                        currencyCode: 'USD',
                        nanos: 150000000,
                        units: 0,
                    },
                    type: 'ACTUAL',
                },
                quantity: 1,
                subLines: [
                    {
                        lineItem: {
                            name: 'Special memoir epilogue',
                            id: 'memoirs_epilogue',
                            price: {
                                amount: {
                                    currencyCode: 'USD',
                                    nanos: 990000000,
                                    units: 0,
                                },
                                type: 'ACTUAL',
                            },
                            quantity: 1,
                            type: 'REGULAR',
                        },
                    },
                ],
                type: 'REGULAR',
            },
            {
                name: 'Our memoirs',
                id: 'memoirs_4',
                price: {
                    amount: {
                        currencyCode: 'USD',
                        nanos: 100000000,
                        units: 0,
                    },
                    type: 'ACTUAL',
                },
                quantity: 1,
                subLines: [
                    {
                        note: 'Special introduction by author',
                    },
                ],
                type: 'REGULAR',
            },
        ],
        notes: 'The Memoir collection',
        otherItems: [],
    },
    otherItems: [
        {
            name: 'Subtotal',
            id: 'subtotal',
            price: {
                amount: {
                    currencyCode: 'USD',
                    nanos: 250000000,
                    units: 0,
                },
                type: 'ESTIMATE',
            },
            type: 'SUBTOTAL',
        },
        {
            name: 'Tax',
            id: 'tax',
            price: {
                amount: {
                    currencyCode: 'USD',
                    nanos: 0,
                    units: 0,
                },
                type: 'ESTIMATE',
            },
            type: 'TAX',
        },
    ],
    totalPrice: {
        amount: {
            currencyCode: 'USD',
            nanos: 250000000,
            units: 0,
        },
        type: 'ESTIMATE',
    },
};

module.exports.app = app;
