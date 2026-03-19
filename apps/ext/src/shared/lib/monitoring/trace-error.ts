export const traceError = (operation: string, error: unknown): void => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error";

  console.error(`[${operation}] Error:`, errorMessage, {
    fullError: error,
  });
};
