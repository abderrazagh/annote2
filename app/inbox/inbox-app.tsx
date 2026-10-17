"use client";

import { SitepingInbox } from "@siteping/dashboard";

export function InboxApp({ apiKey }: { apiKey: string }) {
  return (
    <SitepingInbox
      projects="les-prunelles"
      endpoint="/api/siteping"
      apiKey={apiKey}
      locale="fr"
      theme="light"
      accentColor="#005aad"
      author={{ name: "Les Prunelles" }}
    />
  );
}
