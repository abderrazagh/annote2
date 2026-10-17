import { NextResponse } from "next/server";
import { inboxCookieName, inboxPublicOrigin, inboxSecret, signInboxSession, verifyInboxTicket } from "../../../lib/inbox-access";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = inboxSecret();
  const ticket = new URL(request.url).searchParams.get("ticket") ?? "";
  const origin = inboxPublicOrigin(
    request.url,
    request.headers.get("x-forwarded-host"),
    request.headers.get("x-forwarded-proto"),
    process.env.SITEPING_PUBLIC_URL ?? "",
  );
  const location = origin === "" ? "/inbox" : `${origin}/inbox`;
  const response = NextResponse.redirect(new URL("/inbox", "http://127.0.0.1"));
  response.headers.set("Location", location);
  if (!verifyInboxTicket(secret, ticket)) {
    return response;
  }
  const proto = (request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", ""))
    .split(",")[0]
    ?.trim();
  response.cookies.set(inboxCookieName(), signInboxSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: proto === "https",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
