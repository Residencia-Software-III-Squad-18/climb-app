import { describe, expect, it } from "vitest";

import { parseGoogleOAuthHash } from "@/services/google-oauth";

describe("parseGoogleOAuthHash", () => {
  it("reads OAuth success data from a query string", () => {
    const result = parseGoogleOAuthHash(
      "?google_oauth=success&google_access_token=google-token&app_access_token=app-token&app_refresh_token=refresh&app_user_id=7&app_user_email=user%40climb.com.br&app_user_name=User%20Climb",
    );

    expect(result?.status).toBe("success");

    if (result?.status !== "success") {
      throw new Error("Expected success result");
    }

    expect(result.session.accessToken).toBe("google-token");
    expect(result.authSession?.accessToken).toBe("app-token");
    expect(result.authSession?.usuario.email).toBe("user@climb.com.br");
  });

  it("reads OAuth errors from a hash fragment", () => {
    const result = parseGoogleOAuthHash("#google_oauth=error&google_oauth_error=Falhou");

    expect(result).toEqual({
      status: "error",
      error: "Falhou",
    });
  });
});
