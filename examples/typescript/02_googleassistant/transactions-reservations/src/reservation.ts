import { Order } from 'jovo-platform-googleassistant/dist/src/core/Interfaces';

const now = new Date().toISOString();
// tslint:disable-next-line:no-default-export
export default {
  createTime: now,
  lastUpdateTime: now,
  merchantOrderId: 'UNIQUE_ORDER_ID3',
  userVisibleOrderId: 'USER_VISIBLE_ORDER_ID3',
  transactionMerchant: {
    id: 'https://www.example.com',
    name: 'Example Merchant',
  },
  contents: {
    lineItems: [
      {
        id: 'LINE_ITEM_ID',
        name: 'Dinner reservation',
        description: 'A world of flavors all in one destination.',
        reservation: {
          status: 'PENDING',
          userVisibleStatusLabel: 'Reservation is pending.',
          type: 'RESTAURANT',
          reservationTime: {
            timeIso8601: '2020-01-16T01:30:15.01Z',
          },
          userAcceptableTimeRange: {
            timeIso8601: '2020-01-15/2020-01-17',
          },
          partySize: 6,
          staffFacilitators: [
            {
              name: 'John Smith',
            },
          ],
          location: {
            zipCode: '94086',
            city: 'Sunnyvale',
            postalAddress: {
              regionCode: 'US',
              postalCode: '94086',
              administrativeArea: 'CA',
              locality: 'Sunnyvale',
              addressLines: [
                '222, Some other Street',
              ],
            },
          },
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
  followUpActions: [
    {
      type: 'VIEW_DETAILS',
      title: 'View details',
      openUrlAction: {
        url: 'https://example.com',
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
  termsOfServiceUrl: 'https://www.example.com',
} as Order;
