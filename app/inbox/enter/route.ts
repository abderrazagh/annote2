import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { inboxCookieName, signInboxSession, verifyInboxTicket } from "../../../lib/inbox-access";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.SITEPING_API_KEY ?? "";
  const ticket = new URL(request.url).searchParams.get("ticket") ?? "";
  const home = new URL("/inbox", request.url);
  if (!verifyInboxTicket(secret, ticket)) {
    return NextResponse.redirect(home);
  }
  const jar = await cookies();
  jar.set(inboxCookieName(), signInboxSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return NextResponse.redirect(home);
}
