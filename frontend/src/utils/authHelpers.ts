type AuthError = { code: "AUTH_REQUIRED"; message?: string };

export const isAuthRequired = (e: unknown): e is AuthError => {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code?: unknown }).code === "AUTH_REQUIRED"
  );
};

export const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e && "message" in e) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong.";
};
