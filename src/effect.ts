/**
 * Available effects.
 */
export enum Effect {
  Fade = "fade",
  Zoom = "zoom",
  Helix = "helix",
  Slide = "slide",
  Relax = "relax",
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
  offset: number;
}

/**
 * Maps transition properties to their easing functions
 */
type TransitionProperties = Record<string, string>;

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
}: EffectParams): Partial<CSSStyleDeclaration> {
  const props: Partial<CSSStyleDeclaration> = {
    opacity: "0",
  };
  switch (type) {
    case Effect.Zoom:
      props.transform = `scale(${scale})`;
      props.transition = formatTransition(duration, {
        transform: "cubic-bezier(0,.7,.3,1)",
      });
      break;
    case Effect.Helix:
      props.transform = `scale(${scale}) rotate(90deg)`;
      props.transition = formatTransition(duration, {
        transform: "cubic-bezier(0,.75,.25,1)",
      });
      break;
    case "slide":
      props.transform = formatSlideTranslate(direction, offset);
      props.transformOrigin = origin;
      props.transition = formatTransition(duration, {
        transform: "cubic-bezier(0,.9,.1,1)",
      });
      break;
    case Effect.Relax:
      props.transform = `scaleY(${scale})`;
      props.transformOrigin = origin;
      props.transition = formatTransition(duration, {
        transform: "cubic-bezier(0,0,0,1)",
      });
      break;
    default:
      props.transition = formatTransition(duration, {});
  }
  return props;
}

/**
 * Generates CSS transform string for slide transition
 */
export function formatSlideTranslate(direction: Direction, offset: number) {
  const axis = direction <= Direction.Down ? "Y" : "X";
  if (direction === Direction.Up || direction === Direction.Left) {
    offset = -offset;
  }
  return `translate${axis}(${offset}px)`;
}

/**
 * Generates CSS transition string.
 * Includes opacity transition with `ease-out` easing by default.
 */
export function formatTransition(
  duration: number,
  properties: TransitionProperties,
) {
  const defaultProperties: TransitionProperties = { opacity: "ease-out" };
  return Object.entries({ ...defaultProperties, ...properties })
    .map(([property, easing]) => `${property} ${duration}ms ${easing}`)
    .join(", ");
}
