import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export function SsoCallback() {
  return (
    <AuthenticateWithRedirectCallback
      signInForceRedirectUrl="/welcome"
      signUpForceRedirectUrl="/welcome"
    />
  );
}
