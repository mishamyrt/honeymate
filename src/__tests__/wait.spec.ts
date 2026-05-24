import { afterEach, expect, test, vi } from "vitest";

import {
  getBackgroundImage,
  getImageUrl,
  isImageElement,
  waitImage,
  waitImages,
} from "../wait";

interface FakeNode {
  tagName: string;
  src?: string;
  background?: string;
  backgroundImage?: string;
  querySelectorAll?: (selector: string) => FakeNode[];
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubComputedStyle() {
  vi.stubGlobal(
    "getComputedStyle",
    vi.fn((node: FakeNode) => ({
      background: node.background || "",
      backgroundImage: node.backgroundImage || "",
    })),
  );
}

test("detects image elements", () => {
  expect(isImageElement({ tagName: "IMG" } as Element)).toBe(true);
  expect(isImageElement({ tagName: "DIV" } as Element)).toBe(false);
});

test("gets background image URL", () => {
  stubComputedStyle();

  expect(
    getBackgroundImage({
      tagName: "DIV",
      background: 'url("hero.jpg")',
    } as unknown as Element),
  ).toBe("hero.jpg");
  expect(
    getBackgroundImage({
      tagName: "DIV",
      background: "url(icon.svg)",
    } as unknown as Element),
  ).toBe("icon.svg");
  expect(getBackgroundImage({ tagName: "DIV" } as Element)).toBeNull();
});

test("gets image URL from image element or background", () => {
  stubComputedStyle();

  expect(
    getImageUrl({ tagName: "IMG", src: "photo.jpg" } as unknown as Element),
  ).toBe("photo.jpg");
  expect(
    getImageUrl({
      tagName: "DIV",
      background: "url(bg.webp)",
    } as unknown as Element),
  ).toBe("bg.webp");
});

test("waits for image load and error", async () => {
  const images: Array<{
    onload: (() => void) | null;
    onerror: (() => void) | null;
    src: string;
  }> = [];

  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = "";

      constructor() {
        images.push(this);
      }
    },
  );

  const loadPromise = waitImage("loaded.jpg");
  expect(images[0].src).toBe("loaded.jpg");
  images[0].onload?.();
  await expect(loadPromise).resolves.toBeUndefined();

  const errorPromise = waitImage("broken.jpg");
  expect(images[1].src).toBe("broken.jpg");
  images[1].onerror?.();
  await expect(errorPromise).resolves.toBeUndefined();
});

test("waits for images in node and descendants", async () => {
  const loadedUrls: string[] = [];

  stubComputedStyle();
  vi.stubGlobal(
    "Image",
    class {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private value = "";

      set src(url: string) {
        this.value = url;
        loadedUrls.push(url);
        queueMicrotask(() => this.onload?.());
      }

      get src() {
        return this.value;
      }
    },
  );

  const image = { tagName: "IMG", src: "child.jpg" };
  const background = { tagName: "DIV", background: "url(child-bg.png)" };
  const node = {
    tagName: "DIV",
    background: "url(root.png)",
    querySelectorAll: vi.fn(() => [image, background]),
  };

  await waitImages(node as unknown as Element);

  expect(node.querySelectorAll).toHaveBeenCalledWith("*");
  expect(loadedUrls).toEqual(["root.png", "child.jpg", "child-bg.png"]);
});
