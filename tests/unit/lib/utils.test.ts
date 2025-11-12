/// <reference types="vitest" />

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combines arbitrary class names", () => {
    expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("filters falsy values like undefined or null", () => {
    const isActive = false;
    expect(cn("text-sm", isActive && "font-bold", null, undefined)).toBe("text-sm");
  });
});

