'use strict';

const opentelemetry = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const provider = new BasicTracerProvider({
  resource: new Resource({
    'service.name': 'we-are-devs-demo',
  }),
});
// Add a SpanProcessor and an Exporter.
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.addSpanProcessor(new SimpleSpanProcessor(new JaegerExporter()));

// Initialize the OpenTelemetry APIs to use the BasicTracerProvider.
provider.register();

//
// From here it's the same as in "02-server-add-tracing"
//

const tracer = opentelemetry.trace.getTracer("server");

function main(nrOfJobs) {
  // Create the main span
  const mainSpan = tracer.startSpan("main");
  mainSpan.setAttribute("nr-of-jobs", nrOfJobs);

  console.log("main starts") 
  
  for (let i = 0; i < nrOfJobs; i += 1) {
    doWork(i, mainSpan);
  }

  console.log("main ends")

  mainSpan.end();
}

function doWork(nr, parentSpan) {
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
  const childSpan = tracer.startSpan("doWork", undefined, ctx);
  childSpan.setAttribute("worker-nr", nr);

  for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
    // empty
  }
  console.log("job #" + nr);

  childSpan.end();
}

// start our app
main(10);
