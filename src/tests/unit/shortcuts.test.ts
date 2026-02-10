import { describe, it, expect } from "vitest";
import { formatKey, parseKeys, matchesEvent, isTypingTarget } from "@/lib/shortcuts/registry";

describe("parseKeys", () => {
  it("parses simple key", () => {
    const result = parseKeys("k");
    expect(result.key).toBe("k");
    expect(result.mod).toBe(false);
    expect(result.shift).toBe(false);
  });

  it("parses Mod+K", () => {
    const result = parseKeys("Mod+K");
    expect(result.mod).toBe(true);
    expect(result.key).toBe("k");
  });

  it("parses Shift+Alt+K", () => {
    const result = parseKeys("Shift+Alt+K");
    expect(result.shift).toBe(true);
    expect(result.alt).toBe(true);
    expect(result.key).toBe("k");
  });

  it("parses sequence keys with 'then'", () => {
    const result = parseKeys("g then d");
    expect(result.sequence).toEqual(["g", "d"]);
  });
});

describe("matchesEvent", () => {
  function makeEvent(overrides: Partial<KeyboardEvent> = {}): KeyboardEvent {
    return {
      key: "k",
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      ...overrides,
    } as KeyboardEvent;
  }

  it("matches simple key", () => {
    const parsed = parseKeys("k");
    expect(matchesEvent(makeEvent({ key: "k" }), parsed)).toBe(true);
  });

  it("does not match wrong key", () => {
    const parsed = parseKeys("k");
    expect(matchesEvent(makeEvent({ key: "j" }), parsed)).toBe(false);
  });

  it("matches Mod+K (ctrlKey on non-Mac JSDOM)", () => {
    const parsed = parseKeys("Mod+K");
    // In JSDOM, navigator.platform is empty so isMac=false, Mod maps to ctrlKey
    expect(
      matchesEvent(makeEvent({ key: "k", ctrlKey: true }), parsed)
    ).toBe(true);
  });

  it("matches Shift modifier", () => {
    const parsed = parseKeys("Shift+A");
    expect(
      matchesEvent(makeEvent({ key: "a", shiftKey: true }), parsed)
    ).toBe(true);
  });
});

describe("isTypingTarget", () => {
  it("returns true for input elements", () => {
    const input = document.createElement("input");
    expect(isTypingTarget(input)).toBe(true);
  });

  it("returns true for textarea elements", () => {
    const textarea = document.createElement("textarea");
    expect(isTypingTarget(textarea)).toBe(true);
  });

  it("returns true for contenteditable elements", () => {
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    expect(isTypingTarget(div)).toBe(true);
  });

  it("returns false for regular div", () => {
    const div = document.createElement("div");
    expect(isTypingTarget(div)).toBe(false);
  });

  it("returns false for button", () => {
    const button = document.createElement("button");
    expect(isTypingTarget(button)).toBe(false);
  });
});

describe("formatKey", () => {
  it("replaces Mod with Ctrl on non-Mac", () => {
    // In JSDOM, navigator.platform is empty, so it's non-Mac
    expect(formatKey("Mod+K")).toBe("Ctrl+K");
  });
});
