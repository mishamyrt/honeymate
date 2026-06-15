import { Direction, Effect, EffectParams, Origin } from "./effect";
import type { SpinnerParams } from "./spinner";

export interface Options {
  awaitId: string | null;
  continue: boolean;
  expose: boolean;
  effect: EffectParams;
  hold: number;
  spinner: SpinnerParams | null;
}

/**
 * Transform dataset to HoneyElement options
 */
export function parseOptions(dataset: DOMStringMap): Options {
  return {
    awaitId: dataset.await || null,
    continue: dataset.continue === "true",
    expose: dataset.expose === "true",
    effect: parseEffect(dataset),
    hold: parseDecimal(dataset.hold) || 50,
    spinner: parseSpinner(dataset),
  };
}

/**
 * Parses the effect parameters from the dataset.
 */
export function parseEffect(dataset: DOMStringMap): EffectParams {
  const [direction, offset] = parseDirection(dataset);
  const effectType = parseEffectType(dataset.effect);
  return {
    duration: parseDecimal(dataset.duration) || 640,
    type: effectType,
    scale: parseFloat(dataset.scale as string) || (effectType === Effect.Focus ? 1.22 : 0.87),
    origin: parseOrigin(dataset.origin),
    strength: parseDecimal(dataset.strength) || 20,
    direction,
    offset,
  };
}

/**
 * Parses the direction from the dataset.
 * Returns a tuple of the direction and the direction offset.
 */
export function parseDirection(dataset: DOMStringMap): [Direction, string] {
  if (dataset.right) {
    return [Direction.Right, dataset.right];
  } else if (dataset.down) {
    return [Direction.Down, dataset.down];
  } else if (dataset.left) {
    return [Direction.Left, dataset.left];
  } else if (dataset.up) {
    return [Direction.Up, dataset.up];
  }

  return [Direction.Up, "32px"];
}

/**
 * Parse effect parameters from dataset
 */
export function parseEffectType(effect: string | undefined): Effect {
  if (!effect) {
    return Effect.Fade;
  }
  switch (effect) {
    case Effect.Fade:
    case Effect.Zoom:
    case Effect.Helix:
    case Effect.Slide:
    case Effect.Relax:
    case Effect.Focus:
      return effect;
    default:
      throw new Error(`Unknown effect: ${effect}`);
  }
}

/**
 * Parse origin parameters from dataset
 */
export function parseOrigin(origin: string | undefined): Origin {
  if (!origin) {
    return Origin.Bottom;
  }
  switch (origin) {
    case Origin.Top:
    case Origin.Left:
    case Origin.Right:
    case Origin.Bottom:
      return origin;
    default:
      throw new Error(`Unknown origin: ${origin}`);
  }
}

/**
 * Parse spinner parameters from dataset
 */
export function parseSpinner(dataset: DOMStringMap): SpinnerParams | null {
  if (!dataset.spin) {
    return null;
  }
  return {
    color: dataset.spinColor || "#000",
    size: parseDecimal(dataset.spinSize) || 24,
  };
}

/**
 * Parse decimal integer value
 */
export function parseDecimal(value: string | undefined): number {
  if (!value) {
    return NaN;
  }
  return parseInt(value, 10);
}
