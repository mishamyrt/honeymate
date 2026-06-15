/**
 * Available effects.
 */
export enum Effect {
  Fade = "fade",
  Zoom = "zoom",
  Helix = "helix",
  Slide = "slide",
  Relax = "relax",
  Focus = "focus",
}

/**
 * Slide and Relax effect origin.
 */
export enum Origin {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

/**
 * Slide effect direction.
 */
export enum Direction {
  Up,
  Down,
  Right,
  Left,
}

/**
 * Effect parameters.
 */
export interface EffectParams {
  type: Effect;
  direction: Direction;
  duration: number;
  scale: number;
  origin: Origin;
  offset: string;
  strength: number;
}

const BEZIER = "cubic-bezier(";
const EASE_ZOOM = BEZIER + "0,.7,.3,1)";
const EASE_HELIX = BEZIER + "0,.75,.25,1)";
const EASE_SLIDE = BEZIER + "0,.9,.1,1)";
const EASE_SETTLE = BEZIER + "0,0,0,1)";

type TransitionProperty = "filter" | "transform";

/**
 * Generates effect start point.
 */
export function createEffectStyles({
  duration,
  type,
  scale,
  direction,
  offset,
  origin,
  strength,
}: EffectParams): Partial<CSSStyleDeclaration> {
  const props: Partial<CSSStyleDeclaration> = {
    opacity: "0",
  };
  switch (type) {
    case Effect.Zoom:
      props.transform = `scale(${scale})`;
      props.transition = formatTransition(duration, EASE_ZOOM, "transform");
      break;
    case Effect.Helix:
      props.transform = `scale(${scale}) rotate(90deg)`;
      props.transition = formatTransition(duration, EASE_HELIX, "transform");
      break;
    case "slide":
      props.transform = formatSlideTranslate(direction, offset);
      props.transformOrigin = origin;
      props.transition = formatTransition(duration, EASE_SLIDE, "transform");
      break;
    case Effect.Relax:
      props.transform = `scaleY(${scale})`;
      props.transformOrigin = origin;
      props.transition = formatTransition(duration, EASE_SETTLE, "transform");
      break;
    case Effect.Focus:
      props.transition = formatTransition(duration, EASE_SETTLE, "filter", "transform");
      props.transform = `scale(${scale})`;
      props.filter = `blur(${strength}px)`;
      break;
    default:
      props.transition = formatTransition(duration);
  }
  return props;
}

/**
 * Generates CSS transform string for slide transition
 */
export function formatSlideTranslate(direction: Direction, offset: string) {
  const axis = direction <= Direction.Down ? "Y" : "X";
  if (direction === Direction.Up || direction === Direction.Left) {
    offset = "-" + offset;
  }
  return "translate" + axis + "(" + offset + ")";
}

/**
 * Generates CSS transition string.
 * Includes opacity transition with `ease-out` easing by default.
 */
export function formatTransition(
  duration: number,
  easing = "",
  ...properties: TransitionProperty[]
) {
  let transition = `opacity ${duration}ms ease-out`;
  for (const property of properties) {
    transition += `, ${property} ${duration}ms ${easing}`;
  }
  return transition;
}
