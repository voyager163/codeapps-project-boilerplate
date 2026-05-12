import { beforeEach, describe, expect, it, vi } from "vitest"

const { initializeLogger } = vi.hoisted(() => ({
  initializeLogger: vi.fn(),
}))

vi.mock("@microsoft/power-apps/telemetry", () => ({
  initializeLogger,
}))

describe("initializeAppTelemetry", () => {
  beforeEach(() => {
    vi.resetModules()
    initializeLogger.mockReset()
  })

  it("registers the app logger with the Power Apps telemetry API", async () => {
    initializeLogger.mockResolvedValue(undefined)

    const { appLogger, initializeAppTelemetry } =
      await import("./app-telemetry")

    await initializeAppTelemetry()

    expect(initializeLogger).toHaveBeenCalledWith(appLogger)
  })

  it("does not reject when telemetry initialization fails", async () => {
    initializeLogger.mockRejectedValue(new Error("Telemetry unavailable"))
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    const { initializeAppTelemetry } = await import("./app-telemetry")

    await expect(initializeAppTelemetry()).resolves.toBeUndefined()

    warn.mockRestore()
  })
})
