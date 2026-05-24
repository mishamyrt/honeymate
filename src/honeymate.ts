import { createEffectStyles } from "./effect";
import { createInViewWaiter } from "./inView";
import { type Options, parseOptions } from "./options";
import { insertSpinner } from "./spinner";
import { waitImages } from "./wait";

interface HoneyRecord {
  node: HTMLElement;
  options: Options;
  awaited: HoneyRecord | null;
  rect: DOMRect | null;
  removeSpinner: (() => void) | null;
  loadPromise: Promise<void> | null;
}

function loadElement(record: HoneyRecord): Promise<void> {
  if (!record.loadPromise) {
    record.loadPromise = loadElementOnce(record);
  }
  return record.loadPromise;
}

function sleep(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function loadElementOnce(record: HoneyRecord): Promise<void> {
  await Promise.all([
    waitImages(record.node),
    record.awaited ? loadElement(record.awaited) : null,
  ]);

  if (record.options.hold > 0) {
    await sleep(record.options.hold);
  }
}

async function showElement(
  record: HoneyRecord,
  inViewWaiter: ReturnType<typeof createInViewWaiter> | null,
): Promise<void> {
  const inView =
    record.options.expose && inViewWaiter
      ? inViewWaiter.waitFor(record.node)
      : null;

  await Promise.all([loadElement(record), inView]);

  if (record.removeSpinner) {
    record.removeSpinner();
  }

  Object.assign(record.node.style, { opacity: "1", transform: "" });
}

export function runHoneymate() {
  const elements = document.querySelectorAll<HTMLElement>(".honey");
  const records = Array.from<HoneyRecord>({ length: elements.length });
  const byElement = new WeakMap<Element, HoneyRecord>();
  let hasExposed = false;

  for (let i = 0; i < elements.length; i++) {
    const node = elements[i];
    const options = parseOptions(node.dataset);
    const record: HoneyRecord = {
      node,
      options,
      awaited: null,
      rect: null,
      removeSpinner: null,
      loadPromise: null,
    };

    records[i] = record;
    byElement.set(node, record);
    hasExposed = hasExposed || options.expose;
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    if (record.options.continue) {
      record.awaited = records[i - 1];
    } else if (record.options.awaitId) {
      record.awaited = byElement.get(
        document.getElementById(record.options.awaitId)!,
      )!;
    }
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record.options.spinner) {
      record.rect = record.node.getBoundingClientRect();
    }
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const effect = createEffectStyles(record.options.effect);
    queueMicrotask(() => {
      Object.assign(record.node.style, effect);
    });

    if (record.options.spinner) {
      record.removeSpinner = insertSpinner(
        record.rect!,
        record.options.spinner,
      );
    }
  }

  const inViewWaiter = hasExposed ? createInViewWaiter() : null;

  const displays = Array.from<Promise<void>>({ length: records.length });
  for (let i = 0; i < records.length; i++) {
    displays[i] = showElement(records[i], inViewWaiter);
  }

  if (inViewWaiter) {
    Promise.all(displays).then(() => inViewWaiter.destroy());
  }
}
