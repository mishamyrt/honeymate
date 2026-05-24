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
    hold: parseInt(dataset.hold as string, 10) || 50,
    spinner: parseSpinner(dataset),
  };
}

/**
 * Parses the effect parameters from the dataset.
 */
export function parseEffect(dataset: DOMStringMap): EffectParams {
  const [direction, offset] = parseDirection(dataset);
  return {
    duration: parseInt(dataset.duration as string, 10) || 640,
    type: parseEffectType(dataset.effect),
    scale: parseFloat(dataset.scale as string) || 0.87,
    origin: parseOrigin(dataset.origin),
    direction,
    offset,
  };
}

/**
 * Parses the direction from the dataset.
 * Returns a tuple of the direction and the direction offset.
 */
export function parseDirection(dataset: DOMStringMap): [Direction, number] {
  if (dataset.right) {
    return [Direction.Right, parseInt(dataset.right, 10)];
  } else if (dataset.down) {
    return [Direction.Down, parseInt(dataset.down, 10)];
  } else if (dataset.left) {
    return [Direction.Left, parseInt(dataset.left, 10)];
  } else if (dataset.up) {
    return [Direction.Up, parseInt(dataset.up, 10)];
  }

  return [Direction.Up, 32];
}

/**
 * Parse effect parameters from dataset
 */
export function parseEffectType(effect: string | undefined): Effect {
  if (!effect) {
    return Effect.Fade;
  }
  switch (effect) {
    case Effect.Zoom:
    case Effect.Helix:
    case Effect.Slide:
    case Effect.Relax:
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
    size: parseInt(dataset.spinSize as string, 10) || 24,
  };
}
