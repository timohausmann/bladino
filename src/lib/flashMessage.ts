/**
 * One-shot messages across redirects (e.g. logout → login banner).
 *
 * TanStack Router has no dedicated flash-message API. Alternatives:
 * - `search` params — pollutes the URL (`?loggedOut=true`)
 * - `navigate({ state })` — History API state, not in URL; requires global
 *   `HistoryState` typing and is lost on full page reload / external links
 *
 * sessionStorage fits redirect flashes: clean URL, tab-scoped, survives SPA
 * navigation, auto-cleared on tab close. Stores one message at a time.
 */
const FLASH_KEY = "bladino.flash";

export type FlashMessage = "loggedOut";

export function setFlashMessage(message: FlashMessage): void {
  sessionStorage.setItem(FLASH_KEY, message);
}

export function consumeFlashMessage(): FlashMessage | null {
  const message = sessionStorage.getItem(FLASH_KEY) as FlashMessage | null;
  if (message) {
    sessionStorage.removeItem(FLASH_KEY);
  }
  return message;
}
