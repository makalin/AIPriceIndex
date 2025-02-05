export interface PriceData {
  modelName: string;
  inputPrice: number;
  outputPrice: number;
  effectiveDate: Date;
}

export abstract class BaseProviderService {
  protected abstract providerName: string;
  
  abstract fetchPrices(): Promise<PriceData[]>;
  
  protected async savePrices(prices: PriceData[]): Promise<void> {
    // Implementation will go here
  }
  
  protected async checkPriceChanges(prices: PriceData[]): Promise<void> {
    // Implementation will go here
  }
} 