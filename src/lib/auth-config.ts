const DEV_AUTH_SECRET = "caveplus-local-dev-secret-change-me-in-production";

export const authSecret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? DEV_AUTH_SECRET : undefined);
