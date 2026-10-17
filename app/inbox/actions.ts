"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { inboxCookieName, inboxToken, inboxTokenMatches } from "../../lib/inbox-access";

export async function openInbox(_previous: { error: string }, formData: FormData): Promise<{ error: string }> {
  const secret = process.env.SITEPING_API_KEY ?? "";
  const given = String(formData.get("key") ?? "");
  if (!inboxTokenMatches(secret, inboxToken(given))) {
    return { error: "Clé refusée." };
  }
  const jar = await cookies();
  jar.set(inboxCookieName(), inboxToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/inbox");
}
