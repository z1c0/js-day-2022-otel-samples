'use strict';

const opentelemetry = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { BasicTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');


module.exports = (serviceName) => {
  const provider = new BasicTracerProvider({
    resource: new Resource({
      'service.name' : serviceName,
    })
  });
  
  // Add a SpanProcessor and an Exporter.
  provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter()));

  // Initialize the OpenTelemetry APIs to use the BasicTracerProvider.
  provider.register();

  return opentelemetry;
};