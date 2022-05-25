'use strict';

const api = require('@opentelemetry/api');
//
// SDK
//
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

const provider = new BasicTracerProvider();

// Add a SpanProcessor and an Exporter.
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

// Initialize the OpenTelemetry APIs to use the BasicTracerProvider.
provider.register();

//
// From here it's the same as in "02-server-add-tracing"
//

const tracer = api.trace.getTracer("server");

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
  const ctx = api.trace.setSpan(api.context.active(), parentSpan);
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