// No-op instrumentation for production hosts like Render.
// You can later add OpenTelemetry / Sentry here if needed.
module.exports = function registerInstrumentation() {
  return
}