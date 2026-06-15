import { afterEach, expect, test, vi } from "vitest";

import { createSpinner, insertSpinner } from "../spinner";

class FakeElement {
  attributes = new Map<string, string>();
  children: FakeElement[] = [];
  style: Record<string, number | string> = {};
  animate = vi.fn();

  private html = "";

  constructor(
    public tagName: string,
    public namespaceURI: string | null = null,
  ) {}

  appendChild(child: FakeElement) {
    this.children.push(child);
    return child;
  }

  get firstElementChild() {
    return this.children[0] || null;
  }

  get innerHTML() {
    return this.html;
  }

  set innerHTML(value: string) {
    this.html = value;

    const svg = new FakeElement("svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "xMidYMid");

    const circle = new FakeElement("circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "35");
    circle.setAttribute("stroke-width", "10");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke-dasharray", "90 60");

    svg.appendChild(circle);
    this.children = [svg];
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

test("creates spinner svg", () => {
  stubDocument();

  const container = createSpinner({ size: 48, color: "#663399" }) as unknown as FakeElement;
  const spinner = container.firstElementChild;
  const circle = spinner?.firstElementChild;

  expect(spinner?.tagName).toBe("svg");
  expect(spinner?.style.width).toBe(48);
  expect(spinner?.style.height).toBe(48);
  expect(spinner?.getAttribute("viewBox")).toBe("0 0 100 100");
  expect(spinner?.animate).toHaveBeenCalledWith(
    [{ transform: "rotate(0turn)" }, { transform: "rotate(1turn)" }],
    {
      duration: 850,
      iterations: Infinity,
    },
  );
  expect(circle?.tagName).toBe("circle");
  expect(circle?.style.stroke).toBe("#663399");
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
    display: "grid",
    placeContent: "center",
    transition: "opacity .23s ease-out",
  });
  expect(container.children[0].tagName).toBe("svg");

  remove();

  expect(container.style.opacity).toBe("0");
  expect(body.children).toHaveLength(1);

  vi.advanceTimersByTime(500);

  expect(body.children).toHaveLength(0);
});
