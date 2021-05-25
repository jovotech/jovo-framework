export enum ReceiptType {
  Unspecified = 'RECEIPT_TYPE_UNSPECIFIED',
  Delivered = 'DELIVERED',
  Read = 'READ',
}

export type ReceiptTypeLike = `${ReceiptType}` | ReceiptType;

export interface Receipt {
  message: string;
  receiptType: ReceiptTypeLike;
}
