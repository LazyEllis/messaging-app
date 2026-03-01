import { test, expect } from "vitest";
import { getChannelName } from "./utils";

const user = { id: 1, name: "John Doe" };

test("returns the name of the other recipient for DM channels", () => {
  const channel = {
    id: 1,
    name: null,
    type: "DM",
    owner: null,
    recipients: [user, { id: 2, name: "Jane Doe" }],
  };

  expect(getChannelName(user, channel)).toBe("Jane Doe");
});

test("returns the name of the channel for group channels", () => {
  const channel = {
    id: 1,
    name: "Group Chat",
    type: "GROUP",
    owner: user,
    recipients: [
      user,
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "David Smith" },
    ],
  };

  expect(getChannelName(user, channel)).toBe("Group Chat");
});
