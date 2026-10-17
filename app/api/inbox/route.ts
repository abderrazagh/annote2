import { createSitepingHandler } from "@siteping/adapter-prisma";
import { inboxCookieName, inboxCookieValue, inboxSecret, verifyInboxSession } from "../../../lib/inbox-access";
import { prisma } from "../../../lib/prisma";

export const { GET, POST, PATCH, DELETE, OPTIONS } = createSitepingHandler({
  prisma,
  access: {
    authenticate(request: Request) {
      const token = inboxCookieValue(request.headers.get("cookie") ?? "", inboxCookieName());
      if (!verifyInboxSession(inboxSecret(), token)) {
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
