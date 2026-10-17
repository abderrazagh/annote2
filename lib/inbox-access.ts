import { createHmac, timingSafeEqual } from "node:crypto";

const INBOX_COOKIE = "siteping_inbox";
const TICKET_MS = 2 * 60 * 1000;
const SESSION_MS = 12 * 60 * 60 * 1000;

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
  return matches(inboxToken(secret), token);
}

function sign(secret: string, body: string): string {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

function matches(expected: string, actual: string): boolean {
  const left = Buffer.from(expected);
  const right = Buffer.from(actual);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function signInboxTicket(secret: string, now = Date.now()): string {
  const exp = now + TICKET_MS;
  return `${exp}.${sign(secret, `ticket.${exp}`)}`;
}

export function verifyInboxTicket(secret: string, ticket: string, now = Date.now()): boolean {
  return verify(secret, "ticket", ticket, now);
}

export function signInboxSession(secret: string, now = Date.now()): string {
  const exp = now + SESSION_MS;
  return `${exp}.${sign(secret, `session.${exp}`)}`;
}

export function verifyInboxSession(secret: string, token: string | undefined, now = Date.now()): boolean {
  if (token === undefined) {
    return false;
  }
  return verify(secret, "session", token, now);
}

function verify(secret: string, kind: "ticket" | "session", token: string, now: number): boolean {
  if (secret === "") {
    return false;
  }
  const split = token.split(".");
  if (split.length !== 2) {
    return false;
  }
  const exp = Number(split[0]);
  if (!Number.isFinite(exp) || exp < now) {
    return false;
  }
  return matches(sign(secret, `${kind}.${exp}`), split[1]);
}

export function inboxCookieValue(header: string, name: string): string | undefined {
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) {
      continue;
    }
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}
