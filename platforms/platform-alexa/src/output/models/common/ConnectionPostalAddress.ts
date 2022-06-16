export interface ConnectionPostalAddress {
  '@type': 'PostalAddress';
  '@version': '1';
  'streetAddress': string;
  'locality': string;
  'region': string;
  'postalCode': string;
  'country'?: string;
}
