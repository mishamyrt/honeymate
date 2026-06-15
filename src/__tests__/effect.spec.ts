import { expect, test } from "vitest";

import {
  createEffectStyles,
  Direction,
  Effect,
  formatSlideTranslate,
  formatTransition,
  Origin,
} from "../effect";

test("formats transition", () => {
  expect(formatTransition(100, { opacity: "ease-in" })).toBe("opacity 100ms ease-in");

  expect(formatTransition(200, { opacity: "ease-out", transform: "linear" })).toBe(
    "opacity 200ms ease-out, transform 200ms linear",
  );

  expect(formatTransition(300, {})).toBe("opacity 300ms ease-out");
});

test("formats transform translate for slide effect", () => {
  expect(formatSlideTranslate(Direction.Up, "100px")).toBe("translateY(-100px)");
  expect(formatSlideTranslate(Direction.Down, "150px")).toBe("translateY(150px)");
  expect(formatSlideTranslate(Direction.Left, "100px")).toBe("translateX(-100px)");
  expect(formatSlideTranslate(Direction.Right, "200px")).toBe("translateX(200px)");

  expect(formatSlideTranslate(Direction.Up, "0px")).toBe("translateY(-0px)");
});

test("returns zoom effect properties", () => {
  const zoom = createEffectStyles({
    duration: 100,
    type: Effect.Zoom,
    scale: 2,
    direction: Direction.Up,
    offset: "0",
    origin: Origin.Bottom,
    strength: 20,
  });

  expect(zoom).toEqual({
    opacity: "0",
    transform: "scale(2)",
    transition: "opacity 100ms ease-out, transform 100ms cubic-bezier(0,.7,.3,1)",
  });
});

test("returns helix effect properties", () => {
  const helix = createEffectStyles({
    duration: 100,
    type: Effect.Helix,
    scale: 1,
    direction: Direction.Up,
    offset: "0",
    origin: Origin.Bottom,
    strength: 20,
  });

  expect(helix).toEqual({
    opacity: "0",
    transform: "scale(1) rotate(90deg)",
    transition: "opacity 100ms ease-out, transform 100ms cubic-bezier(0,.75,.25,1)",
  });
});

test("returns slide effect properties", () => {
  const slide = createEffectStyles({
    duration: 50,
    type: Effect.Slide,
    scale: 0,
    direction: Direction.Up,
    offset: "50px",
    origin: Origin.Bottom,
    strength: 20,
  });

  expect(slide).toEqual({
    opacity: "0",
    transform: "translateY(-50px)",
    transformOrigin: "bottom",
    transition: "opacity 50ms ease-out, transform 50ms cubic-bezier(0,.9,.1,1)",
  });
});

test("returns relax effect properties", () => {
  const relax = createEffectStyles({
    duration: 111,
    type: Effect.Relax,
    scale: 0.5,
    direction: Direction.Up,
    offset: "0",
    origin: Origin.Bottom,
    strength: 20,
  });

  expect(relax).toEqual({
    opacity: "0",
    transform: "scaleY(0.5)",
    transformOrigin: "bottom",
    transition: "opacity 111ms ease-out, transform 111ms cubic-bezier(0,0,0,1)",
  });
});

test("returns focus effect properties", () => {
  const focus = createEffectStyles({
    duration: 120,
    type: Effect.Focus,
    scale: 1.22,
    direction: Direction.Up,
    offset: "0",
    origin: Origin.Bottom,
    strength: 8,
  });

  expect(focus).toEqual({
    opacity: "0",
    transform: "scale(1.22)",
    filter: "blur(8px)",
    transition:
      "opacity 120ms ease-out, filter 120ms cubic-bezier(0,0,0,1), transform 120ms cubic-bezier(0,0,0,1)",
  });
});
