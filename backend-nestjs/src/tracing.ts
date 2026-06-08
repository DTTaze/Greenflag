import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { B3Propagator } from '@opentelemetry/propagator-b3';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import dotenv from 'dotenv';

dotenv.config({
  path: ['.env'],
});

const otelSDK = new NodeSDK({
  serviceName:
    process.env.SERVICE_NAME || 'boilerplate-backend-nestjs-postgresql',
  metricReader: process.env.PROMETHEUS_EXPORTER_PORT
    ? new PrometheusExporter({
        port: Number(process.env.PROMETHEUS_EXPORTER_PORT),
      })
    : undefined,
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url:
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
        'http://10.10.0.1:4318/v1/traces',
      timeoutMillis: 15000,
    }),
  ),
  contextManager: new AsyncLocalStorageContextManager(),
  // Responsible for propagating trace context across service boundaries via HTTP headers (or other text-based carriers).
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(), // Jaeger's uber-trace-id header
      new W3CTraceContextPropagator(), // W3C traceparent/tracestate headers
      new W3CBaggagePropagator(), // W3C baggage header
      new B3Propagator(), // Zipkin B3 headers
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK immediately
otelSDK.start();

console.log('otel setup successfully');

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err: any) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});

export default otelSDK;
