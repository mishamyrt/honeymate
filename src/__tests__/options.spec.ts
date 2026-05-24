import { expect, test } from "vitest";

import { Direction, Effect, Origin } from "../effect";
import {
  parseDirection,
  parseEffect,
  parseEffectType,
  parseOptions,
  parseOrigin,
  parseSpinner,
} from "../options";

function dataset(values: Record<string, string> = {}): DOMStringMap {
  return values as DOMStringMap;
}

test("parses effect type", () => {
  expect(parseEffectType(undefined)).toBe(Effect.Fade);
  expect(parseEffectType(Effect.Zoom)).toBe(Effect.Zoom);
  expect(parseEffectType(Effect.Helix)).toBe(Effect.Helix);
  expect(parseEffectType(Effect.Slide)).toBe(Effect.Slide);
  expect(parseEffectType(Effect.Relax)).toBe(Effect.Relax);
  expect(() => parseEffectType("unknown")).toThrow("Unknown effect: unknown");
});

test("parses transform origin", () => {
  expect(parseOrigin(undefined)).toBe(Origin.Bottom);
  expect(parseOrigin(Origin.Top)).toBe(Origin.Top);
  expect(parseOrigin(Origin.Left)).toBe(Origin.Left);
  expect(parseOrigin(Origin.Right)).toBe(Origin.Right);
  expect(parseOrigin(Origin.Bottom)).toBe(Origin.Bottom);
  expect(() => parseOrigin("center")).toThrow("Unknown origin: center");
});

test("parses direction with documented priority", () => {
  expect(parseDirection(dataset())).toEqual([Direction.Up, 32]);
  expect(parseDirection(dataset({ up: "10" }))).toEqual([Direction.Up, 10]);
  expect(parseDirection(dataset({ left: "20", up: "10" }))).toEqual([Direction.Left, 20]);
  expect(parseDirection(dataset({ down: "30", left: "20" }))).toEqual([Direction.Down, 30]);
  expect(parseDirection(dataset({ right: "40", down: "30" }))).toEqual([Direction.Right, 40]);
});

test("parses effect params", () => {
  expect(parseEffect(dataset())).toEqual({
    duration: 640,
    type: Effect.Fade,
    scale: 0.87,
    origin: Origin.Bottom,
    direction: Direction.Up,
    offset: 32,
  });

  expect(
    parseEffect(
      dataset({
        duration: "300",
        effect: Effect.Relax,
        scale: "0.5",
        origin: Origin.Top,
        left: "12",
      }),
    ),
  ).toEqual({
    duration: 300,
    type: Effect.Relax,
    scale: 0.5,
    origin: Origin.Top,
    direction: Direction.Left,
    offset: 12,
  });
});

test("parses spinner params", () => {
  expect(parseSpinner(dataset())).toBeNull();
  expect(parseSpinner(dataset({ spin: "true" }))).toEqual({
    color: "#000",
    size: 24,
  });
  expect(parseSpinner(dataset({ spin: "true", spinColor: "#663399", spinSize: "48" }))).toEqual({
    color: "#663399",
    size: 48,
  });
});

test("parses full options object", () => {
  expect(
    parseOptions(
      dataset({
        await: "hero",
        continue: "true",
        expose: "true",
        hold: "120",
        effect: Effect.Zoom,
        duration: "700",
        scale: "0.9",
        origin: Origin.Right,
        down: "16",
        spin: "true",
        spinColor: "#fff",
        spinSize: "32",
      }),
    ),
  ).toEqual({
    awaitId: "hero",
    continue: true,
    expose: true,
    hold: 120,
    effect: {
      duration: 700,
      type: Effect.Zoom,
      scale: 0.9,
      origin: Origin.Right,
      direction: Direction.Down,
      offset: 16,
    },
    spinner: {
      color: "#fff",
      size: 32,
    },
  });
});
