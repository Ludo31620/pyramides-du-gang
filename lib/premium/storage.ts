import {
  DEFAULT_USER_ENTITLEMENTS,
  type UserEntitlements,
} from "./types";

const PREMIUM_STORAGE_KEY =
  "pyramide-du-gang-entitlements";

export function getUserEntitlements():
  UserEntitlements {
  if (
    typeof window ===
    "undefined"
  ) {
    return DEFAULT_USER_ENTITLEMENTS;
  }

  const storedValue =
    window.localStorage.getItem(
      PREMIUM_STORAGE_KEY
    );

  if (!storedValue) {
    return DEFAULT_USER_ENTITLEMENTS;
  }

  try {
    const parsedValue =
      JSON.parse(
        storedValue
      ) as Partial<UserEntitlements>;

    return {
      premium:
        parsedValue.premium === true,
    };
  } catch {
    return DEFAULT_USER_ENTITLEMENTS;
  }
}

export function saveUserEntitlements(
  entitlements:
    UserEntitlements
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    PREMIUM_STORAGE_KEY,
    JSON.stringify(
      entitlements
    )
  );
}

export function setPremiumForTesting(
  premium: boolean
): UserEntitlements {
  const entitlements:
    UserEntitlements = {
    premium,
  };

  saveUserEntitlements(
    entitlements
  );

  return entitlements;
}