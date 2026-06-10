import { metrics } from '@opentelemetry/api';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter('greenflag-backend');

  private readonly successfulPurchasesCounter = this.meter.createCounter(
    'successful_purchases_total',
    {
      description: 'Total successful purchases',
    },
  );

  private readonly failedPurchasesCounter = this.meter.createCounter(
    'failed_purchases_total',
    {
      description: 'Total failed purchases (refunds)',
    },
  );

  public incrementSuccessfulPurchases(
    quantity = 1,
    attributes: Record<string, string | number> = {},
  ) {
    this.successfulPurchasesCounter.add(quantity, attributes);
  }

  public incrementFailedPurchases(
    quantity = 1,
    attributes: Record<string, string | number> = {},
  ) {
    this.failedPurchasesCounter.add(quantity, attributes);
  }
}
