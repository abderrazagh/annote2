"use client";

import { useActionState } from "react";
import { openInbox } from "./actions";

export function LoginForm({ missing }: { missing: boolean }) {
  const [state, action, pending] = useActionState(openInbox, { error: "" });

  return (
    <main style={{ maxWidth: 420, margin: "12vh auto", fontFamily: "Source Sans 3, Segoe UI, sans-serif", color: "#00284d" }}>
      <h1>Notes du site</h1>
      {missing ? (
        <p>La clé SitePing n’est pas configurée sur ce serveur. Les changements de statut restent bloqués.</p>
      ) : (
        <form action={action}>
          <p>Entrez la clé SitePing du serveur pour ouvrir la liste des notes.</p>
          <label htmlFor="siteping-key">Clé</label>
          <input id="siteping-key" name="key" type="password" autoComplete="current-password" required style={{ display: "block", width: "100%", margin: "8px 0 16px", minHeight: 44 }} />
          {state.error !== "" ? <p role="alert">{state.error}</p> : null}
          <button type="submit" disabled={pending} style={{ minHeight: 44, padding: "0 16px" }}>
            Ouvrir
          </button>
        </form>
      )}
    </main>
  );
}
