import { Alexa } from './Alexa';
import {
  getProductList,
  InSkillProduct,
  InSkillProductsParams,
  ProductListResponse,
} from './api/IspApi';
import { PurchaseResult, PurchaseResultLike } from './interfaces';

export class AlexaIsp {
  constructor(private alexa: Alexa) {}

  async getProductList(params?: InSkillProductsParams): Promise<ProductListResponse> {
    return getProductList(
      this.alexa.$request.getApiEndpoint(),
      this.alexa.$request.getApiAccessToken(),
      this.alexa.$request.getLocale()!,
      params,
    );
  }

  async getProductByReferenceName(referenceName: string): Promise<InSkillProduct | undefined> {
    const products = await this.getProductList();
    return products.inSkillProducts.find((product) => product.referenceName === referenceName);
  }

  getPurchaseResult(): PurchaseResultLike | undefined {
    return this.alexa.$request.request?.payload?.purchaseResult;
  }

  getProductId(): string | undefined {
    return this.alexa.$request.request?.payload?.productId;
  }

  toJSON(): AlexaIsp {
    return { ...this, alexa: undefined };
  }
}
