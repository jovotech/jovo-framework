import { Order } from 'jovo-platform-googleassistant/dist/src/core/Interfaces';

const now = new Date().toISOString();
// tslint:disable-next-line:no-default-export
export default {
  createTime: new Date().toISOString(),
  lastUpdateTime: new Date().toISOString(),
  merchantOrderId: 'merchantOrderId', // A unique ID String for the order
  userVisibleOrderId: 'merchantOrderId',
  transactionMerchant: {
    id: 'book_store_1',
    name: 'Book Store',
  },
  contents: {
    lineItems: [
      {
        id: 'memoirs_1',
        name: 'My Memoirs',
        priceAttributes: [
          {
            type: 'REGULAR',
            name: 'Item Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 3990000,
            },
            taxIncluded: true,
          },
          {
            type: 'TOTAL',
            name: 'Total Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 3990000,
            },
            taxIncluded: true,
          },
        ],
        notes: [
          'Note from the author.',
        ],
        purchase: {
          quantity: 1,
        },
      },
      {
        id: 'memoirs_2',
        name: 'Memoirs of a person',
        priceAttributes: [
          {
            type: 'REGULAR',
            name: 'Item Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 5990000,
            },
            taxIncluded: true,
          },
          {
            type: 'TOTAL',
            name: 'Total Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 5990000,
            },
            taxIncluded: true,
          },
        ],
        notes: [
          'Special introduction by author.',
        ],
        purchase: {
          quantity: 1,
        },
      },
      {
        id: 'memoirs_3',
        name: 'Their memoirs',
        priceAttributes: [
          {
            type: 'REGULAR',
            name: 'Item Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 15750000,
            },
            taxIncluded: true,
          },
          {
            type: 'TOTAL',
            name: 'Total Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 15750000,
            },
            taxIncluded: true,
          },
        ],
        purchase: {
          quantity: 1,
          itemOptions: [
            {
              id: 'memoirs_epilogue',
              name: 'Special memoir epilogue',
              prices: [
                {
                  type: 'REGULAR',
                  state: 'ACTUAL',
                  name: 'Item Price',
                  amount: {
                    currencyCode: 'USD',
                    amountInMicros: 3990000,
                  },
                  taxIncluded: true,
                },
                {
                  type: 'TOTAL',
                  name: 'Total Price',
                  state: 'ACTUAL',
                  amount: {
                    currencyCode: 'USD',
                    amountInMicros: 3990000,
                  },
                  taxIncluded: true,
                },
              ],
              quantity: 1,
            },
          ],
        },
      },
      {
        id: 'memoirs_4',
        name: 'Our memoirs',
        priceAttributes: [
          {
            type: 'REGULAR',
            name: 'Item Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 6490000,
            },
            taxIncluded: true,
          },
          {
            type: 'TOTAL',
            name: 'Total Price',
            state: 'ACTUAL',
            amount: {
              currencyCode: 'USD',
              amountInMicros: 6490000,
            },
            taxIncluded: true,
          },
        ],
        notes: [
          'Special introduction by author.',
        ],
        purchase: {
          quantity: 1,
        },
      },
    ],
  },
  buyerInfo: {
    email: 'janedoe@gmail.com',
    firstName: 'Jane',
    lastName: 'Doe',
    displayName: 'Jane Doe',
  },
  priceAttributes: [
    {
      type: 'SUBTOTAL',
      name: 'Subtotal',
      state: 'ESTIMATE',
      amount: {
        currencyCode: 'USD',
        amountInMicros: 32220000,
      },
      taxIncluded: true,
    },
    {
      type: 'DELIVERY',
      name: 'Delivery',
      state: 'ACTUAL',
      amount: {
        currencyCode: 'USD',
        amountInMicros: 2000000,
      },
      taxIncluded: true,
    },
    {
      type: 'TAX',
      name: 'Tax',
      state: 'ESTIMATE',
      amount: {
        currencyCode: 'USD',
        amountInMicros: 2780000,
      },
      taxIncluded: true,
    },
    {
      type: 'TOTAL',
      name: 'Total Price',
      state: 'ESTIMATE',
      amount: {
        currencyCode: 'USD',
        amountInMicros: 37000000,
      },
      taxIncluded: true,
    },
  ],
  followUpActions: [
    {
      type: 'VIEW_DETAILS',
      title: 'View details',
      openUrlAction: {
        url: 'http://example.com',
      },
    },
    {
      type: 'CALL',
      title: 'Call us',
      openUrlAction: {
        url: 'tel:+16501112222',
      },
    },
    {
      type: 'EMAIL',
      title: 'Email us',
      openUrlAction: {
        url: 'mailto:person@example.com',
      },
    },
  ],
  termsOfServiceUrl: 'http://www.example.com',
  note: 'The Memoir collection',
  purchase: {
    status: 'CREATED',
    userVisibleStatusLabel: 'CREATED',
    type: 'RETAIL',
    returnsInfo: {
      isReturnable: false,
      daysToReturn: 1,
      policyUrl: 'http://www.example.com',
    },
    fulfillmentInfo: {
      id: 'FULFILLMENT_SERVICE_ID',
      fulfillmentType: 'DELIVERY',
      expectedFulfillmentTime: {
        timeIso8601: '2025-09-25T18:00:00.877Z',
      },
      price: {
        type: 'REGULAR',
        name: 'Delivery Price',
        state: 'ACTUAL',
        amount: {
          currencyCode: 'USD',
          amountInMicros: 2000000,
        },
        taxIncluded: true,
      },
      fulfillmentContact: {
        email: 'johnjohnson@gmail.com',
        firstName: 'John',
        lastName: 'Johnson',
        displayName: 'John Johnson',
      },
    },
    purchaseLocationType: 'ONLINE_PURCHASE',
  },
} as any;
