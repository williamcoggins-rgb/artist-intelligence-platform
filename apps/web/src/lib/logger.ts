/**
 * Structured JSON logger for API routes.
 * Every log entry includes timestamp, route, and contextual metadata.
 */
export function apiLog(
  level: "info" | "warn" | "error",
  route: string,
  message: string,
  meta?: Record<string, unknown>
) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    route,
    message,
    ...meta,
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/**
 * Extract serializable error info from an unknown thrown value.
 */
export function errorMeta(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { error: error.message, stack: error.stack };
  }
  return { error: String(error) };
}
