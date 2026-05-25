import { afterEach, expect, test, vi } from "vitest";

import { runHoneymate } from "../honeymate";

interface FakeHoneyElement {
  id: string;
  tagName: string;
  dataset: DOMStringMap;
  style: Partial<CSSStyleDeclaration>;
  querySelectorAll: (selector: string) => FakeHoneyElement[];
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function createElement(id: string, dataset: DOMStringMap): FakeHoneyElement {
  return {
    id,
    tagName: "DIV",
    dataset,
    style: {},
    querySelectorAll: vi.fn(() => []),
  };
}

test("waits for awaited element to show before holding", async () => {
  vi.useFakeTimers();

  const first = createElement("first", { hold: "100" });
  const second = createElement("second", { await: "first", hold: "1" });
  const elements = [first, second];

  vi.stubGlobal("document", {
    querySelectorAll: vi.fn(() => elements),
    getElementById: vi.fn((id: string) => elements.find((element) => element.id === id) || null),
  });
  vi.stubGlobal(
    "getComputedStyle",
    vi.fn(() => ({
      background: "",
      backgroundImage: "",
    })),
  );

  runHoneymate();
  await vi.advanceTimersByTimeAsync(99);

  expect(first.style.opacity).toBe("0");
  expect(second.style.opacity).toBe("0");

  await vi.advanceTimersByTimeAsync(1);

  expect(first.style.opacity).toBe("1");
  expect(second.style.opacity).toBe("0");

  await vi.advanceTimersByTimeAsync(1);

  expect(second.style.opacity).toBe("1");
});
