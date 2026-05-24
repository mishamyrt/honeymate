import { afterEach, expect, test, vi } from "vitest";

import { createSvgElement, getSpinner, insertSpinner } from "../spinner";

class FakeElement {
  attributes = new Map<string, string>();
  children: FakeElement[] = [];
  style: Record<string, string> = {};

  constructor(
    public tagName: string,
    public namespaceURI: string | null = null,
  ) {}

  appendChild(child: FakeElement) {
    this.children.push(child);
    return child;
  }

  removeChild(child: FakeElement) {
    this.children = this.children.filter((item) => item !== child);
    return child;
  }

  setAttribute(key: string, value: string) {
    this.attributes.set(key, value);
  }

  getAttribute(key: string) {
    return this.attributes.get(key) || null;
  }
}

function stubDocument() {
  const body = new FakeElement("body");

  vi.stubGlobal("document", {
    body,
    documentElement: {
      scrollTop: 12,
      scrollLeft: 5,
    },
    createElement: vi.fn((tag: string) => new FakeElement(tag)),
    createElementNS: vi.fn((namespace: string, tag: string) => new FakeElement(tag, namespace)),
  });

  return body;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

test("creates svg element with attributes", () => {
  stubDocument();

  const element = createSvgElement("circle", {
    cx: 50,
    stroke: "#fff",
  }) as unknown as FakeElement;

  expect(element.tagName).toBe("circle");
  expect(element.namespaceURI).toBe("http://www.w3.org/2000/svg");
  expect(element.getAttribute("cx")).toBe("50");
  expect(element.getAttribute("stroke")).toBe("#fff");
});

test("creates spinner svg", () => {
  stubDocument();

  const spinner = getSpinner({ size: 48, color: "#663399" }) as unknown as FakeElement | undefined;
  const circle = spinner?.children[0];

  expect(spinner?.tagName).toBe("svg");
  expect(spinner?.getAttribute("width")).toBe("48");
  expect(spinner?.getAttribute("height")).toBe("48");
  expect(spinner?.getAttribute("viewBox")).toBe("0 0 100 100");
  expect(circle?.tagName).toBe("circle");
  expect(circle?.getAttribute("stroke")).toBe("#663399");
  expect(circle?.getAttribute("stroke-dasharray")).toBe("90 60");
});

test("inserts and removes spinner", () => {
  vi.useFakeTimers();
  const body = stubDocument();

  const remove = insertSpinner({ top: 10, left: 20, width: 200, height: 100 } as DOMRect, {
    size: 24,
    color: "#000",
  });
  const container = body.children[0];

  expect(body.children).toHaveLength(1);
  expect(container.style).toMatchObject({
    top: "22px",
    left: "25px",
    width: "200px",
    height: "100px",
    position: "absolute",
    display: "flex",
  });
  expect(container.children[0].tagName).toBe("svg");

  remove();

  expect(container.style.opacity).toBe("0");
  expect(body.children).toHaveLength(1);

  vi.advanceTimersByTime(500);

  expect(body.children).toHaveLength(0);
});
