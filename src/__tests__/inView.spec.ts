import { afterEach, expect, test, vi } from "vitest";

import { createInViewWaiter } from "../inView";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubIntersectionObserver() {
  let callback: IntersectionObserverCallback | null = null;
  let options: IntersectionObserverInit | undefined;
  const observer = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };

  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (nextCallback, nextOptions) {
      callback = nextCallback as IntersectionObserverCallback;
      options = nextOptions as IntersectionObserverInit | undefined;
      return observer;
    }),
  );

  return {
    observer,
    get options() {
      return options;
    },
    intersect(entries: Partial<IntersectionObserverEntry>[]) {
      callback?.(entries as IntersectionObserverEntry[], observer as never);
    },
  };
}

test("observes elements and resolves when they intersect", async () => {
  const mock = stubIntersectionObserver();
  const element = {} as Element;
  const waiter = createInViewWaiter({ rootMargin: "10px" });
  const promise = waiter.waitFor(element);

  expect(mock.options).toEqual({ rootMargin: "10px" });
  expect(mock.observer.observe).toHaveBeenCalledWith(element);

  const entry = { target: element, isIntersecting: true };
  mock.intersect([entry]);

  await expect(promise).resolves.toBe(entry);
  expect(mock.observer.unobserve).toHaveBeenCalledWith(element);
});

test("ignores non-intersecting entries", async () => {
  const mock = stubIntersectionObserver();
  const element = {} as Element;
  const waiter = createInViewWaiter();
  let resolved = false;

  waiter.waitFor(element).then(() => {
    resolved = true;
  });
  mock.intersect([{ target: element, isIntersecting: false }]);
  await Promise.resolve();

  expect(resolved).toBe(false);
  expect(mock.observer.unobserve).not.toHaveBeenCalled();
});

test("resolves multiple waiters for the same element", async () => {
  const mock = stubIntersectionObserver();
  const element = {} as Element;
  const waiter = createInViewWaiter();
  const first = waiter.waitFor(element);
  const second = waiter.waitFor(element);
  const entry = { target: element, isIntersecting: true };

  expect(mock.observer.observe).toHaveBeenCalledTimes(1);

  mock.intersect([entry]);

  await expect(Promise.all([first, second])).resolves.toEqual([entry, entry]);
  expect(mock.observer.unobserve).toHaveBeenCalledTimes(1);
});

test("disconnects observer on destroy", () => {
  const mock = stubIntersectionObserver();

  createInViewWaiter().destroy();

  expect(mock.observer.disconnect).toHaveBeenCalledOnce();
});
