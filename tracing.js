'use strict';

// Cargar variables de entorno PRIMERO
require('dotenv').config();

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

// 👇 Aquí está la clave: usamos el Azure exporter oficial
const { AzureMonitorTraceExporter } = require('@azure/monitor-opentelemetry-exporter');

// Verificar si tenemos connection string
const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (!connectionString) {
    console.warn("⚠️  APPLICATIONINSIGHTS_CONNECTION_STRING no encontrada. Tracing deshabilitado.");
} else {
    // Exportador de trazas a Azure
    const azureExporter = new AzureMonitorTraceExporter({
        connectionString: connectionString,
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
    try {
        sdk.start();
        console.log("✅ OpenTelemetry inicializado y enviando datos a Azure Monitor");
    } catch (error) {
        console.error("❌ Error al iniciar OpenTelemetry:", error);
    }

    // Cierre limpio en caso de que apagues el servicio
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log("SDK cerrado correctamente"))
            .catch((error) => console.error("Error cerrando SDK", error))
            .finally(() => process.exit(0));
    });
}
