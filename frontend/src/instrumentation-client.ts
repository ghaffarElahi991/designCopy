import { NAVIGATION_START_EVENT } from "@/lib/navigation-events";

export function onRouterTransitionStart(url: string) {
  try {
    const current = new URL(window.location.href);
    const destination = new URL(url, current);

    if (
      destination.origin === current.origin &&
      destination.pathname === current.pathname &&
      destination.search === current.search
    ) {
      return;
    }
  } catch {
    // Let the router handle unusual URLs while still providing visual feedback.
  }

  window.dispatchEvent(
    new CustomEvent(NAVIGATION_START_EVENT, {
      detail: { url },
    })
  );
}
