import { createHmac, timingSafeEqual } from "node:crypto";

const INBOX_COOKIE = "siteping_inbox";

export function inboxCookieName(): string {
  return INBOX_COOKIE;
}

export function inboxToken(secret: string): string {
  return createHmac("sha256", secret).update("siteping-inbox").digest("hex");
}

export function inboxTokenMatches(secret: string, token: string | undefined): boolean {
  if (secret === "" || token === undefined || token.length === 0) {
    return false;
  }
  const expected = Buffer.from(inboxToken(secret));
  const actual = Buffer.from(token);
  if (expected.length !== actual.length) {
    return false;
  }
  return timingSafeEqual(expected, actual);
}
