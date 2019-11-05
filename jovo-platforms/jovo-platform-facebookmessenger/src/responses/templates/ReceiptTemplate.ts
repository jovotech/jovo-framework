import { TemplateType } from '../../Enums';
import { Template, TemplatePayload } from '../Template';

export type ReceiptTemplateOptions = Omit<ReceiptTemplatePayload, 'template_type'>;

export interface ReceiptTemplatePayload extends TemplatePayload<TemplateType.Receipt> {
  recipient_name: string;
  merchant_name?: string;
  order_number: string;
  currency: string;
  payment_method: string;
  timestamp?: string;
  elements?: ReceiptTemplateElement[];
  sharable?: boolean;
  address?: ReceiptTemplateAddress;
  summary: ReceiptTemplateSummary;
  adjustments?: ReceiptTemplateAdjustment[];
}

export interface ReceiptTemplateElement {
  title: string;
  subtitle?: string;
  quantity?: number;
  price: string;
  currency?: string;
  image_url?: string;
}

export interface ReceiptTemplateAddress {
  street_1: string;
  street_2?: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

export interface ReceiptTemplateAdjustment {
  name?: string;
  amount?: number;
}

export interface ReceiptTemplateSummary {
  subtotal?: number;
  shipping_cost?: number;
  total_tax?: number;
  total_cost: number;
}

export class ReceiptTemplate extends Template<ReceiptTemplatePayload> {}
