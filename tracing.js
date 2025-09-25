'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// 👇 Aquí está la clave: usamos el Azure exporter oficial
const { AzureMonitorTraceExporter } = require('@azure/monitor-opentelemetry-exporter');

// Exportador de trazas a Azure
const azureExporter = new AzureMonitorTraceExporter({
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
});

// SDK de OpenTelemetry
const sdk = new NodeSDK({
    traceExporter: azureExporter, // Aquí mandamos trazas a Azure
    instrumentations: [getNodeAutoInstrumentations()],
    metricReader: new PeriodicExportingMetricReader({
        exporter: azureExporter, // También envía métricas
    }),
});

// Iniciar SDK
sdk.start()
    .then(() => {
        console.log("✅ OpenTelemetry inicializado y enviando datos a Azure Monitor");
    })
    .catch((error) => {
        console.error("❌ Error al iniciar OpenTelemetry:", error);
    });

// Cierre limpio en caso de que apagues el servicio
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log("SDK cerrado correctamente"))
        .catch((error) => console.error("Error cerrando SDK", error))
        .finally(() => process.exit(0));
});
