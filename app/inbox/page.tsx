import { cookies, headers } from "next/headers";
import { inboxCookieName, inboxCookieValue, inboxSecret, verifyInboxSession } from "../../lib/inbox-access";
import { InboxApp } from "./inbox-app";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notes du site" };

export default async function InboxPage() {
  const headerList = await headers();
  const jar = await cookies();
  const token = inboxCookieValue(headerList.get("cookie") ?? "", inboxCookieName()) ?? jar.get(inboxCookieName())?.value;
  const allowed = verifyInboxSession(inboxSecret(), token);
  if (!allowed) {
    return (
      <main style={{ maxWidth: 520, margin: "12vh auto", fontFamily: "Source Sans 3, Segoe UI, sans-serif", color: "#00284d" }}>
        <h1>Notes</h1>
        <p>Ouvrez cette page depuis WordPress : tableau de bord, menu Notes. Seul un compte autorisé à modifier les pages peut entrer.</p>
      </main>
    );
  }
  return (
    <div style={{ height: "100vh" }}>
      <InboxApp />
    </div>
  );
}
