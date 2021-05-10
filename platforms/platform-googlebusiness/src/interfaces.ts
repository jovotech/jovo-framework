export interface GoogleServiceAccount {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key?: string;
  client_email?: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

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
