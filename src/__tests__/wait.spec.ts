import { afterEach, expect, test, vi } from "vitest";

import {
  getBackgroundImage,
  getMediaLoaded,
  isImageElement,
  isVideoElement,
  waitImage,
  waitMedia,
  waitVideo,
} from "../wait";

interface FakeNode {
  tagName: string;
  src?: string;
  background?: string;
  backgroundImage?: string;
  addEventListener?: (event: string, callback: () => void) => void;
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

test("detects video elements", () => {
  expect(isVideoElement({ tagName: "VIDEO" } as Element)).toBe(true);
  expect(isVideoElement({ tagName: "DIV" } as Element)).toBe(false);
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
    getMediaLoaded({ tagName: "IMG", src: "photo.jpg" } as unknown as Element),
  ).toBe("photo.jpg");
  expect(
    getMediaLoaded({
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

test("waits for video canplaythrough", async () => {
  let listener: (() => void) | null = null;
  const video = {
    tagName: "VIDEO",
    addEventListener: vi.fn((event: string, callback: () => void) => {
      expect(event).toBe("canplaythrough");
      listener = callback;
    }),
  };

  const promise = waitVideo(video as unknown as HTMLVideoElement);

  expect(video.addEventListener).toHaveBeenCalledWith(
    "canplaythrough",
    expect.any(Function),
  );

  // @ts-expect-error
  listener?.();

  await expect(promise).resolves.toBeUndefined();
});

test("waits for media in node and descendants", async () => {
  const loadedUrls: string[] = [];
  let videoListener: (() => void) | null = null;

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
  const video = {
    tagName: "VIDEO",
    addEventListener: vi.fn((event: string, callback: () => void) => {
      expect(event).toBe("canplaythrough");
      videoListener = callback;
    }),
  };
  const background = { tagName: "DIV", background: "url(child-bg.png)" };
  const node = {
    tagName: "DIV",
    background: "url(root.png)",
    querySelectorAll: vi.fn(() => [image, video, background]),
  };

  const promise = waitMedia(node as unknown as Element);
  // @ts-expect-error
  videoListener?.();

  await promise;

  expect(node.querySelectorAll).toHaveBeenCalledWith("*");
  expect(video.addEventListener).toHaveBeenCalledWith(
    "canplaythrough",
    expect.any(Function),
  );
  expect(loadedUrls).toEqual(["root.png", "child.jpg", "child-bg.png"]);
});
