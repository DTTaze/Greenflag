import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import * as dotenv from 'dotenv';

dotenv.config({
  path: ['../.env', '.env'],
});

const serviceName = process.env.SERVICE_NAME || 'greenflag-backend';
const otelEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

const otelSDK = new NodeSDK({
  serviceName,
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: `${otelEndpoint}/v1/traces`,
      timeoutMillis: 15000,
    }),
  ),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${otelEndpoint}/v1/metrics`,
    }),
    exportIntervalMillis: 10000,
  }),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
    ],
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-ioredis': { enabled: true },
      '@opentelemetry/instrumentation-http': { enabled: true },
    }),
  ],
});

otelSDK.start();

console.log(`[OTel] SDK setup successfully. Exporting to ${otelEndpoint}`);

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('[OTel] SDK shut down successfully'),
      (err: any) => console.log('[OTel] Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});

export default otelSDK;
