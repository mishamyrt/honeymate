/**
 * Returns an in-view waiter that uses an IntersectionObserver to detect when elements are in view.
 */
export function createInViewWaiter(observerOptions?: IntersectionObserverInit) {
  const waiters = new WeakMap<
    Element,
    Set<(entry: IntersectionObserverEntry) => void>
  >();

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const resolvers = waiters.get(entry.target);
      if (!resolvers) continue;

      for (const resolve of resolvers) {
        resolve(entry);
      }

      waiters.delete(entry.target);
      observer.unobserve(entry.target);
    }
  }, observerOptions);

  function waitFor(element: Element): Promise<IntersectionObserverEntry> {
    return new Promise((resolve) => {
      let resolvers = waiters.get(element);

      if (!resolvers) {
        resolvers = new Set();
        waiters.set(element, resolvers);
        observer.observe(element);
      }

      const wrappedResolve = (entry: IntersectionObserverEntry) => {
        resolve(entry);
      };

      resolvers.add(wrappedResolve);
    });
  }

  function destroy() {
    observer.disconnect();
  }

  return {
    waitFor,
    destroy,
  };
}
