import {
  createRoot,
  _roots,
} from "@react-three/fiber/dist/react-three-fiber.esm.js";
import { test } from "node:test";
import assert from "node:assert/strict";

test("R3F Timer adapter preserves frame deltas, pause/resume and manual advancement", (t) => {
  let now = 1000;
  const warnings = [];
  t.mock.method(performance, "now", () => now);
  t.mock.method(console, "warn", (message) => warnings.push(message));
  const canvas = {};
  createRoot(canvas);
  const state = _roots.get(canvas).store.getState();
  // No renderer is needed for timing; invalidate only needs the XR flag.
  state.gl = { xr: { isPresenting: false } };
  const { clock } = state;
  try {
    assert.equal(clock.getDelta(), 0);
    now += 250;
    assert.equal(clock.getDelta(), 0.25);
    now += 125;
    assert.equal(clock.getElapsedTime(), 0.375);
    clock.stop();
    now += 5000;
    assert.equal(clock.getDelta(), 0);
    assert.equal(clock.elapsedTime, 0.375);
    clock.start();
    now += 100;
    assert.equal(clock.getDelta(), 0.1);
    assert.equal(clock.elapsedTime, 0.1);
    state.setFrameloop("never");
    assert.equal(clock.elapsedTime, 0);
    assert.equal(clock.running, false);
    // R3F assigns these properties directly for a manually advanced frame loop.
    clock.oldTime = 0;
    clock.elapsedTime = 2;
    assert.equal(clock.getDelta(), 0);
    assert.equal(clock.elapsedTime, 2);
    state.setFrameloop("demand");
    now += 50;
    assert.equal(clock.getDelta(), 0.05);
    assert.equal(
      warnings.filter((message) => /THREE.Clock/.test(message)).length,
      0,
    );
  } finally {
    clock.dispose();
    _roots.delete(canvas);
  }
});
