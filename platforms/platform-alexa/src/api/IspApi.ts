import { JovoError, UnknownObject } from '@jovotech/framework';
import { AlexaApiOptions, sendApiRequest } from './AlexaApi';

export type InSkillProductType = 'CONSUMABLE' | 'SUBSCRIPTION' | 'ENTITLEMENT';
export type EntitledType = 'ENTITLED' | 'NOT_ENTITLED';
export type EntitledReasonType = 'PURCHASED' | 'NOT_PURCHASED' | 'AUTO_ENTITLED';
export type PurchasableType = 'PURCHASABLE' | 'NOT_PURCHASABLE';
export type PurchaseModeType = 'LIVE' | 'TEST';

export interface InSkillProduct {
  productId: string;
  referenceName: string;
  type: InSkillProductType;
  name: string;
  summary: string;
  entitled: EntitledType;
  entitlementReason: EntitledReasonType;
  purchasable: PurchasableType;
  activeEntitlementCount: number;
  purchaseMode: PurchaseModeType;
}

export interface ProductListResponse {
  inSkillProducts: InSkillProduct[];
  nextToken: null | string;
  truncated: boolean;
}

export interface InSkillProductsParams extends UnknownObject {
  purchasable?: PurchasableType;
  entitled?: EntitledType;
  productType?: InSkillProductType;
  nextToken?: string;
  maxResults?: number; // number between 1 and 100
}

export async function getProductList(
  apiEndpoint: string,
  permissionToken: string,
  language: string,
  params?: InSkillProductsParams,
): Promise<ProductListResponse> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v1/users/~current/skills/~current/inSkillProducts`,
    permissionToken,
    headers: {
      'Accept-Language': language,
    },
    params,
  };

  try {
    const response = await sendApiRequest<ProductListResponse>(options);
    return response.data;
  } catch (error) {
    if (error.isAxiosError) {
      const { message } = error.response.data;
      throw new JovoError({ message });
    }
    throw new JovoError({ message: error.message });
  }
}
