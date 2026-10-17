import { cookies } from "next/headers";
import { inboxCookieName, inboxTokenMatches } from "../../lib/inbox-access";
import { InboxApp } from "./inbox-app";
import { LoginForm } from "./login-form";

export const metadata = { title: "Notes du site" };

export default async function InboxPage() {
  const secret = process.env.SITEPING_API_KEY ?? "";
  const jar = await cookies();
  const allowed = inboxTokenMatches(secret, jar.get(inboxCookieName())?.value);
  if (!allowed) {
    return <LoginForm missing={secret === ""} />;
  }
  return (
    <div style={{ height: "100vh" }}>
      <InboxApp apiKey={secret} />
    </div>
  );
}
