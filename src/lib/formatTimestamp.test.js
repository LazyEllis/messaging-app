import { test, expect } from "vitest";
import { formatTimestamp } from "./utils";

test("formats as time-only when the date is today", () => {
  const today = new Date();

  expect(formatTimestamp(today)).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
});

test("formats as 'Yesterday at [time]' when the date is yesterday", () => {
  const today = new Date();
  const yesterday = today.setDate(today.getDate() - 1);

  expect(formatTimestamp(yesterday)).toMatch(
    /^Yesterday at \d{1,2}:\d{2} (AM|PM)$/,
  );
});

test("formats as '[date] [time]' when date is neither today nor yesterday", () => {
  const date = new Date("2026-01-01");

  expect(formatTimestamp(date)).toMatch(
    /^\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2} (AM|PM)$/,
  );
});
