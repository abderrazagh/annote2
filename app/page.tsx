"use client";

import { initSiteping } from "@siteping/widget";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const widget = initSiteping({
      endpoint: "/api/siteping",
      projectName: "les-prunelles",
      forceShow: true,
    });
    return () => widget.destroy();
  }, []);

  return (
    <main>
      <p>SitePing est prêt.</p>
      <p>
        <a href="/inbox">Ouvrir les notes</a>
      </p>
    </main>
  );
}
