import assert from "node:assert/strict";
import { inferCustomOwnerType } from "../src/lib/owner-type";

run("treats blank and General owners as general custom owners", () => {
  assert.equal(inferCustomOwnerType("", "global"), "other");
  assert.equal(inferCustomOwnerType("General", "global"), "other");
});

run("treats named global and app shortcuts as app-owned shortcuts", () => {
  assert.equal(inferCustomOwnerType("Aerospace", "global"), "mac-app");
  assert.equal(inferCustomOwnerType("Aerospace", "app"), "mac-app");
});

run("treats named webapp shortcuts as webapp-owned shortcuts", () => {
  assert.equal(inferCustomOwnerType("Gmail", "webapp"), "webapp");
});

function run(name: string, test: () => void) {
  test();
  console.log(`ok - ${name}`);
}
