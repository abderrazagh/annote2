import { createSitepingHandler } from "@siteping/adapter-prisma";
import { inboxCookieName, inboxCookieValue, verifyInboxSession } from "../../../lib/inbox-access";
import { prisma } from "../../../lib/prisma";

const secret = process.env.SITEPING_API_KEY ?? "";

export const { GET, POST, PATCH, DELETE, OPTIONS } = createSitepingHandler({
  prisma,
  access: {
    authenticate(request: Request) {
      const token = inboxCookieValue(request.headers.get("cookie") ?? "", inboxCookieName());
      if (!verifyInboxSession(secret, token)) {
        return null;
      }
      return { role: "editor" };
    },
    canReadAuthorEmail() {
      return true;
    },
    canCommentAsTeam() {
      return true;
    },
  },
});
