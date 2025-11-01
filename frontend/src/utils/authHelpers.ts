type AuthError = { code: "AUTH_REQUIRED"; message?: string };

export const isAuthRequired = (e: unknown): e is AuthError => {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: unknown }).code === "AUTH_REQUIRED"
  );
};
