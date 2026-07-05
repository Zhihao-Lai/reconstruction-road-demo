const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(root, "pointclouds/manifest.json"), "utf8"));
const items = Array.isArray(manifest) ? manifest : manifest.items;

assert.ok(Array.isArray(items), "manifest must contain an items array");

const missing = [];
for (const scene of items) {
  for (const rel of [scene.cloud, scene.preview, ...(scene.inputs || [])]) {
    if (rel && !fs.existsSync(path.join(root, rel))) {
      missing.push(rel);
    }
  }
  for (const lod of Object.values(scene.lods || {})) {
    if (lod.cloud && !fs.existsSync(path.join(root, lod.cloud))) {
      missing.push(lod.cloud);
    }
  }
}

assert.deepEqual(missing, []);
