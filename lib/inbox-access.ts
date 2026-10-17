import { createHmac, timingSafeEqual } from "node:crypto";

const INBOX_COOKIE = "siteping_inbox";
const TICKET_MS = 2 * 60 * 1000;
const SESSION_MS = 30 * 60 * 1000;

const INTERNAL_HOSTS = new Set(["0.0.0.0", "127.0.0.1", "localhost", "::", "::1"]);

function originFrom(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "";
    }
    if (INTERNAL_HOSTS.has(url.hostname)) {
      return "";
    }
    return url.origin;
  } catch {
    return "";
  }
}

export function inboxPublicOrigin(
  requestUrl: string,
  forwardedHost: string | null,
  forwardedProto: string | null,
  configured: string,
): string {
  const fromConfig = originFrom(configured.trim());
  if (fromConfig !== "") {
    return fromConfig;
  }
  const host = (forwardedHost ?? "").split(",")[0]?.trim() ?? "";
  const hostname = host.replace(/^\[|\]$/g, "").split(":")[0] ?? "";
  if (host !== "" && !INTERNAL_HOSTS.has(hostname)) {
    const proto = forwardedProto === "http" ? "http" : "https";
    return `${proto}://${host}`;
  }
  return originFrom(requestUrl);
}

export function inboxSecret(): string {
  const value = process.env["SITEPING_API_KEY"];
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

export function inboxSessionMaxAge(): number {
  return SESSION_MS / 1000;
}

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
  secret = secret.trim().replace(/^['"]+|['"]+$/g, "");
  token = token.trim().replace(/^['"]+|['"]+$/g, "");
  if (token.includes("%")) {
    try {
      token = decodeURIComponent(token);
    } catch {
      return false;
    }
  }
  if (secret === "") {
    return false;
  }
  const split = token.split(".");
  if (split.length !== 2 || !/^\d+$/.test(split[0])) {
    return false;
  }
  const exp = Number(split[0]);
  if (!Number.isFinite(exp) || exp + 120000 < now) {
    return false;
  }
  return matches(sign(secret, `${kind}.${split[0]}`), split[1]);
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
