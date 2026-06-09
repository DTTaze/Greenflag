import { Injectable, NotImplementedException } from '@nestjs/common';

import { CARRIER_TYPE } from '@shared/enums';

import { IShippingProvider } from '../interfaces/shipping-provider.interface';
import { GhnShippingStrategy } from '../strategies/ghn-shipping.strategy';
import { GhtkShippingStrategy } from '../strategies/ghtk-shipping.strategy';

@Injectable()
export class ShippingFactoryService {
  constructor(
    private readonly ghnStrategy: GhnShippingStrategy,
    private readonly ghtkStrategy: GhtkShippingStrategy,
  ) {}

  public getProvider(carrier: CARRIER_TYPE): IShippingProvider {
    switch (carrier) {
      case CARRIER_TYPE.GHN:
        return this.ghnStrategy;
      case CARRIER_TYPE.GHTK:
        return this.ghtkStrategy;
      default:
        throw new NotImplementedException(
          `Shipping provider for carrier ${carrier} is not implemented`,
        );
    }
  }
}
