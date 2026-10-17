import { NextResponse } from "next/server";
import { inboxCookieName, signInboxSession, verifyInboxTicket } from "../../../lib/inbox-access";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = (process.env.SITEPING_API_KEY ?? "").trim();
  const ticket = new URL(request.url).searchParams.get("ticket") ?? "";
  const home = new URL("/inbox", request.url);
  if (!verifyInboxTicket(secret, ticket)) {
    return NextResponse.redirect(home);
  }
  const response = NextResponse.redirect(home);
  response.cookies.set(inboxCookieName(), signInboxSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
