"use client";

import { SitepingInbox } from "@siteping/dashboard";

export function InboxApp() {
  return (
    <SitepingInbox
      projects="les-prunelles"
      endpoint="/api/inbox"
      locale="fr"
      theme="light"
      accentColor="#005aad"
      author={{ name: "Les Prunelles" }}
    />
  );
}
