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
  addEventListener?: (
    event: string,
    callback: () => void,
    options?: AddEventListenerOptions,
  ) => void;
  removeEventListener?: (event: string, callback: () => void) => void;
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

  expect(getMediaLoaded({ tagName: "IMG", src: "photo.jpg" } as unknown as Element)).toBe(
    "photo.jpg",
  );
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

test("waits for video readiness events", async () => {
  const listeners = new Map<string, () => void>();
  const video = {
    tagName: "VIDEO",
    readyState: 0,
    error: null,
    addEventListener: vi.fn((event: string, callback: () => void) => {
      listeners.set(event, callback);
    }),
    removeEventListener: vi.fn(),
  };

  const promise = waitVideo(video as unknown as HTMLVideoElement);

  for (const event of ["loadeddata", "canplay", "canplaythrough", "error", "abort"]) {
    expect(video.addEventListener).toHaveBeenCalledWith(event, expect.any(Function), {
      once: true,
    });
  }

  listeners.get("canplay")?.();

  await expect(promise).resolves.toBeUndefined();
  for (const event of ["loadeddata", "canplay", "canplaythrough", "error", "abort"]) {
    expect(video.removeEventListener).toHaveBeenCalledWith(event, expect.any(Function));
  }
});

test("does not wait for already loaded video", async () => {
  const video = {
    tagName: "VIDEO",
    readyState: 2,
    error: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  await expect(waitVideo(video as unknown as HTMLVideoElement)).resolves.toBeUndefined();

  expect(video.addEventListener).not.toHaveBeenCalled();
  expect(video.removeEventListener).not.toHaveBeenCalled();
});

test("waits for media in node and descendants", async () => {
  const loadedUrls: string[] = [];
  const videoListeners = new Map<string, () => void>();

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
    readyState: 0,
    error: null,
    addEventListener: vi.fn((event: string, callback: () => void) => {
      videoListeners.set(event, callback);
    }),
    removeEventListener: vi.fn(),
  };
  const background = { tagName: "DIV", background: "url(child-bg.png)" };
  const node = {
    tagName: "DIV",
    background: "url(root.png)",
    querySelectorAll: vi.fn(() => [image, video, background]),
  };

  const promise = waitMedia(node as unknown as Element);
  videoListeners.get("loadeddata")?.();

  await promise;

  expect(node.querySelectorAll).toHaveBeenCalledWith("*");
  expect(video.addEventListener).toHaveBeenCalledWith("loadeddata", expect.any(Function), {
    once: true,
  });
  expect(loadedUrls).toEqual(["root.png", "child.jpg", "child-bg.png"]);
});
