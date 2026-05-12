import {
  initializeLogger,
  type ILogger,
  type Metric,
} from "@microsoft/power-apps/telemetry"

export const appLogger: ILogger = {
  logMetric(metric: Metric) {
    if (import.meta.env.DEV) {
      console.debug("[Power Apps telemetry]", metric)
    }
  },
}

let telemetryInitialization: Promise<void> | undefined

export function initializeAppTelemetry(
  logger: ILogger = appLogger
): Promise<void> {
  telemetryInitialization ??= initializeLogger(logger).catch(
    (error: unknown) => {
      telemetryInitialization = undefined

      if (import.meta.env.DEV) {
        console.warn("Power Apps telemetry initialization failed", error)
      }
    }
  )

  return telemetryInitialization
}

export function logAppMetric(metric: Metric): void {
  appLogger.logMetric?.(metric)
}
