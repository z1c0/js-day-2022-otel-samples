'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      'service.name' : serviceName,
    })
  });
  
  // Add a SpanProcessor and an Exporter.
  provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter({ serviceName: "WeAreDevelopers-demo" })));
  const otlpOptions = {
    url: 'https://opc60984.dev.dynatracelabs.com/api/v2/otlp/v1/traces',
    headers: {
        Authorization: 'Api-Token ' + process.env.DT_CONNECTION_AUTH_TOKEN
    },
  };
  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter(otlpOptions)));

  // Initialize the OpenTelemetry APIs to use the BasicTracerProvider.
  provider.register();

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
    ],
  });

  opentelemetry.diag.setLogger(new opentelemetry.DiagConsoleLogger(), opentelemetry.DiagLogLevel.DEBUG);

  return opentelemetry;
};