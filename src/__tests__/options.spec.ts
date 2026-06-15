import { expect, test } from "vitest";

import { Direction, Effect, Origin } from "../effect";
import {
  parseDecimal,
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

test("parses decimal number", () => {
  expect(parseDecimal(undefined)).toBe(NaN);
  expect(parseDecimal("")).toBe(NaN);
  expect(parseDecimal("0")).toBe(0);
  expect(parseDecimal("1")).toBe(1);
  expect(parseDecimal("10")).toBe(10);
});

test("parses effect type", () => {
  expect(parseEffectType(undefined)).toBe(Effect.Fade);
  expect(parseEffectType(Effect.Zoom)).toBe(Effect.Zoom);
  expect(parseEffectType(Effect.Helix)).toBe(Effect.Helix);
  expect(parseEffectType(Effect.Slide)).toBe(Effect.Slide);
  expect(parseEffectType(Effect.Relax)).toBe(Effect.Relax);
  expect(parseEffectType(Effect.Focus)).toBe(Effect.Focus);
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
  expect(parseDirection(dataset())).toEqual([Direction.Up, "32px"]);
  expect(parseDirection(dataset({ up: "10px" }))).toEqual([Direction.Up, "10px"]);
  expect(parseDirection(dataset({ left: "20em", up: "10cm" }))).toEqual([Direction.Left, "20em"]);
  expect(parseDirection(dataset({ down: "30px", left: "20px" }))).toEqual([Direction.Down, "30px"]);
  expect(parseDirection(dataset({ right: "40px", down: "30px" }))).toEqual([
    Direction.Right,
    "40px",
  ]);
});

test("parses effect params", () => {
  expect(parseEffect(dataset())).toEqual({
    duration: 640,
    type: Effect.Fade,
    scale: 0.87,
    origin: Origin.Bottom,
    strength: 20,
    direction: Direction.Up,
    offset: "32px",
  });

  expect(
    parseEffect(
      dataset({
        duration: "300",
        effect: Effect.Relax,
        scale: "0.5",
        origin: Origin.Top,
        left: "12px",
      }),
    ),
  ).toEqual({
    duration: 300,
    type: Effect.Relax,
    scale: 0.5,
    origin: Origin.Top,
    strength: 20,
    direction: Direction.Left,
    offset: "12px",
  });

  expect(parseEffect(dataset({ effect: Effect.Focus }))).toEqual({
    duration: 640,
    type: Effect.Focus,
    scale: 1.22,
    origin: Origin.Bottom,
    strength: 20,
    direction: Direction.Up,
    offset: "32px",
  });

  expect(parseEffect(dataset({ effect: Effect.Focus, scale: "1.5", strength: "12" }))).toEqual({
    duration: 640,
    type: Effect.Focus,
    scale: 1.5,
    origin: Origin.Bottom,
    strength: 12,
    direction: Direction.Up,
    offset: "32px",
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

test("parses video event", () => {
  expect(parseOptions(dataset()).event).toBe("canplaythrough");
  expect(parseOptions(dataset({ event: "loadedmetadata" })).event).toBe("loadedmetadata");
});

test("parses full options object", () => {
  expect(
    parseOptions(
      dataset({
        await: "hero",
        continue: "true",
        expose: "true",
        event: "canplay",
        hold: "120",
        effect: Effect.Zoom,
        duration: "700",
        scale: "0.9",
        origin: Origin.Right,
        down: "16px",
        spin: "true",
        spinColor: "#fff",
        spinSize: "32",
      }),
    ),
  ).toEqual({
    awaitId: "hero",
    continue: true,
    expose: true,
    event: "canplay",
    hold: 120,
    effect: {
      duration: 700,
      type: Effect.Zoom,
      scale: 0.9,
      origin: Origin.Right,
      strength: 20,
      direction: Direction.Down,
      offset: "16px",
    },
    spinner: {
      color: "#fff",
      size: 32,
    },
  });
});
