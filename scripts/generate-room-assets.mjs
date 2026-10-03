/** Original, texture-free, low-poly room assets. Run `npm run assets:build`.
 * Meshes are merged by material before export to keep draw calls low.
 * All objects use meters and local origins, allowing independent replacement.
 */
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = `data:${blob.type};base64,${Buffer.from(value).toString("base64")}`;
      this.onloadend?.();
    });
  }
};

const materials = new Map();
function material(color, metalness = 0, emissive = false) {
  const key = `${color}-${metalness}-${emissive}`;
  if (!materials.has(key))
    materials.set(
      key,
      new THREE.MeshStandardMaterial({
        color,
        roughness: metalness ? 0.36 : 0.72,
        metalness,
        ...(emissive ? { emissive: color, emissiveIntensity: 0.45 } : {}),
      }),
    );
  return materials.get(key);
}
const c = {
  oak: "#b98255",
  oakLight: "#d6aa77",
  oakDark: "#865c3e",
  black: "#283139",
  metal: "#414a4b",
  cream: "#e9e4d7",
  white: "#f8f5eb",
  sage: "#648d9c",
  green: "#486b47",
  terra: "#bf883f",
  blue: "#6a93ab",
  screen: "#20363b",
};
function mesh(
  group,
  geometry,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  metallic = 0,
  glow = false,
) {
  const m = new THREE.Mesh(geometry, material(color, metallic, glow));
  m.position.set(...position);
  m.rotation.set(...rotation);
  group.add(m);
  return m;
}
function box(g, s, p, color, r = [0, 0, 0], radius = 0) {
  return mesh(
    g,
    radius
      ? new RoundedBoxGeometry(...s, 2, radius)
      : new THREE.BoxGeometry(...s),
    color,
    p,
    r,
  );
}
function cyl(g, top, bottom, height, p, color, r = [0, 0, 0], segments = 16) {
  return mesh(
    g,
    new THREE.CylinderGeometry(top, bottom, height, segments),
    color,
    p,
    r,
  );
}
function sphere(g, scale, p, color) {
  const m = mesh(g, new THREE.SphereGeometry(1, 12, 8), color, p);
  m.scale.set(...scale);
  return m;
}
function rod(g, a, b, radius, color) {
  const start = new THREE.Vector3(...a),
    end = new THREE.Vector3(...b),
    delta = end.clone().sub(start);
  const m = cyl(
    g,
    radius,
    radius,
    delta.length(),
    start.clone().add(end).multiplyScalar(0.5).toArray(),
    color,
  );
  m.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    delta.normalize(),
  );
  return m;
}
function desk() {
  const g = new THREE.Group();
  box(g, [3.7, 0.16, 1.5], [0, 1.46, 0], c.oakLight, [0, 0, 0], 0.045);
  box(g, [3.64, 0.04, 1.44], [0, 1.365, 0], c.oakDark);
  for (const x of [-1.62, 1.62]) {
    box(g, [0.1, 1.35, 0.1], [x, 0.69, -0.57], c.black);
    box(g, [0.1, 1.35, 0.1], [x, 0.69, 0.57], c.black);
    box(g, [0.1, 0.1, 1.22], [x, 0.1, 0], c.black);
  }
  box(g, [3.2, 0.1, 0.08], [0, 0.52, -0.59], c.black);
  for (let i = 0; i < 12; i++)
    box(
      g,
      [3.56, 0.002, 0.009],
      [0, 1.541, -0.67 + i * 0.12],
      i % 2 ? "#c79966" : "#dcb889",
    );
  return g;
}
function monitor() {
  const g = new THREE.Group();
  box(g, [0.64, 0.035, 0.39], [0, 0.022, 0.04], c.metal, [0, 0, 0], 0.016);
  box(g, [0.085, 0.34, 0.075], [0, 0.19, -0.06], c.metal);
  box(g, [1.38, 0.84, 0.085], [0, 0.66, -0.06], c.black, [0, 0, 0], 0.035);
  box(g, [1.29, 0.735, 0.012], [0, 0.674, -0.009], c.screen);
  box(g, [1.29, 0.043, 0.015], [0, 1.019, 0.003], "#405255");
  for (let i = 0; i < 3; i++)
    sphere(
      g,
      [0.014, 0.014, 0.007],
      [-0.6 + i * 0.04, 1.019, 0.014],
      [c.terra, c.oakLight, c.sage][i],
    );
  box(g, [0.23, 0.64, 0.015], [-0.514, 0.66, 0.004], "#293f44");
  for (let i = 0; i < 8; i++) {
    const width = [0.44, 0.57, 0.26, 0.47, 0.61, 0.34, 0.51, 0.29][i];
    box(
      g,
      [width, 0.016, 0.016],
      [-0.1 + width * 0.19, 0.916 - i * 0.069, 0.009],
      ["#bd9575", "#87ac9d", "#8ea9bb", "#ddd3b9"][i % 4],
    );
    box(g, [0.105, 0.012, 0.016], [-0.53, 0.916 - i * 0.069, 0.013], "#829a94");
  }
  sphere(g, [0.016, 0.008, 0.006], [0.6, 0.285, -0.006], c.sage);
  return g;
}
function laptop() {
  const g = new THREE.Group();
  box(g, [0.95, 0.035, 0.63], [0, 0.025, 0], "#aeb4b4", [0, 0, 0], 0.017);
  box(g, [0.79, 0.007, 0.31], [0, 0.047, -0.075], c.black);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 11; j++)
      box(
        g,
        [0.055, 0.008, 0.046],
        [-0.349 + j * 0.069, 0.054, -0.185 + i * 0.069],
        "#5b6668",
      );
  box(g, [0.25, 0.005, 0.14], [0, 0.047, 0.18], "#939e9f");
  const lid = new THREE.Group();
  lid.position.set(0, 0.05, -0.29);
  lid.rotation.x = -0.19;
  g.add(lid);
  box(lid, [0.95, 0.61, 0.035], [0, 0.3, 0], c.metal, [0, 0, 0], 0.012);
  box(lid, [0.87, 0.52, 0.008], [0, 0.31, 0.022], "#e3eadc");
  box(lid, [0.87, 0.055, 0.009], [0, 0.544, 0.028], "#668066");
  box(lid, [0.4, 0.025, 0.009], [-0.15, 0.446, 0.028], "#6f8266");
  for (let i = 0; i < 3; i++) {
    box(
      lid,
      [0.22, 0.19, 0.011],
      [-0.275 + i * 0.274, 0.268, 0.029],
      ["#cad5b8", "#d4c4a2", "#b5c9c8"][i],
    );
    box(
      lid,
      [0.15, 0.013, 0.012],
      [-0.275 + i * 0.274, 0.134, 0.03],
      "#7c8b77",
    );
    box(lid, [0.1, 0.011, 0.012], [-0.298 + i * 0.274, 0.101, 0.03], "#adb7a0");
  }
  return g;
}
function bookshelf() {
  const g = new THREE.Group();
  for (const x of [-0.64, 0.64])
    box(g, [0.075, 2.6, 0.58], [x, 1.36, 0], c.oak);
  box(g, [1.35, 2.54, 0.045], [0, 1.36, -0.27], "#c69b6d");
  for (const y of [0.09, 0.76, 1.43, 2.1, 2.68])
    box(g, [1.37, 0.075, 0.64], [0, y, 0.01], c.oakLight);
  const palette = [
    "#72887e",
    "#b98065",
    "#e0c99e",
    "#617c8d",
    "#a8ac94",
    "#d2b39c",
    "#4c6263",
  ];
  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 6; i++) {
      const h = [0.45, 0.52, 0.38, 0.49, 0.43, 0.5][(i + row) % 6];
      const x = -0.49 + i * 0.17,
        y = 0.8 + row * 0.67;
      box(
        g,
        [0.135, h, 0.38],
        [x, y + h / 2, 0.02],
        palette[(i + row * 2) % palette.length],
        [0, 0, i === 5 ? -0.1 : 0],
      );
      box(g, [0.094, 0.017, 0.005], [x, y + h * 0.77, 0.214], "#e9dfc4");
      box(g, [0.092, 0.01, 0.005], [x, y + h * 0.69, 0.214], "#e9dfc4");
    }
  box(g, [0.53, 0.34, 0.45], [-0.29, 0.3, 0.03], "#b6b5a5", [0, 0, 0], 0.025);
  box(g, [0.18, 0.06, 0.013], [-0.29, 0.35, 0.263], "#e5e1d5");
  for (let i = 0; i < 3; i++)
    box(g, [0.47, 0.085, 0.39], [0.29, 0.17 + i * 0.09, 0.03], palette[i]);
  return g;
}
function chair() {
  const g = new THREE.Group();
  cyl(g, 0.065, 0.065, 0.5, [0, 0.34, 0], c.metal);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    rod(
      g,
      [0, 0.16, 0],
      [Math.sin(a) * 0.47, 0.095, Math.cos(a) * 0.47],
      0.035,
      c.metal,
    );
    sphere(
      g,
      [0.065, 0.065, 0.075],
      [Math.sin(a) * 0.47, 0.065, Math.cos(a) * 0.47],
      c.black,
    );
  }
  box(g, [0.86, 0.17, 0.79], [0, 0.68, 0], c.sage, [0, 0, 0], 0.075);
  box(g, [0.79, 0.94, 0.14], [0, 1.13, 0.35], "#748572", [0.1, 0, 0], 0.065);
  box(g, [0.62, 0.075, 0.055], [0, 1.03, 0.448], "#566c5b", [0.1, 0, 0], 0.02);
  for (const x of [-0.49, 0.49]) {
    box(g, [0.045, 0.35, 0.045], [x, 0.79, 0.1], c.metal);
    box(g, [0.095, 0.065, 0.46], [x, 0.98, 0.025], c.metal, [0, 0, 0], 0.025);
  }
  return g;
}
function plant() {
  const g = new THREE.Group();
  cyl(g, 0.31, 0.23, 0.53, [0, 0.28, 0], c.terra, [0, 0, 0], 24);
  cyl(g, 0.324, 0.324, 0.07, [0, 0.55, 0], "#c58262", [0, 0, 0], 24);
  cyl(g, 0.285, 0.285, 0.01, [0, 0.586, 0], "#4c4030");
  for (let i = 0; i < 11; i++) {
    const a = i * 2.4,
      h = 1.1 + (i % 4) * 0.22,
      reach = 0.21 + (i % 3) * 0.1;
    const tip = [Math.sin(a) * reach, h, Math.cos(a) * reach];
    rod(g, [0, 0.55, 0], tip, 0.013, "#5c7245");
    const leaf = sphere(
      g,
      [0.105, 0.32, 0.042],
      tip,
      ["#57764d", "#789057", "#425f3e"][i % 3],
    );
    leaf.rotation.set(0.3 * Math.cos(a), a, -0.45 * Math.sin(a));
  }
  return g;
}
function lamp() {
  const g = new THREE.Group();
  cyl(g, 0.2, 0.23, 0.055, [0, 0.028, 0], c.cream, [0, 0, 0], 24);
  rod(g, [0, 0.045, 0], [0, 0.56, -0.06], 0.025, c.oakDark);
  rod(g, [0, 0.56, -0.06], [0.23, 0.83, -0.06], 0.025, c.oakDark);
  sphere(g, [0.05, 0.05, 0.05], [0, 0.56, -0.06], c.cream);
  cyl(g, 0.09, 0.21, 0.23, [0.23, 0.76, -0.06], c.cream, [0, 0, -0.3], 24);
  mesh(
    g,
    new THREE.CircleGeometry(0.182, 24),
    "#ffe6ad",
    [0.26, 0.65, -0.06],
    [-Math.PI / 2, 0, -0.3],
    0,
    true,
  );
  return g;
}
function frames() {
  const g = new THREE.Group();
  const items = [
    [-0.83, 0.1, 0.78, 1.02],
    [0.15, 0.24, 0.73, 0.88],
    [0.98, -0.16, 0.6, 0.67],
  ];
  for (let i = 0; i < items.length; i++) {
    const [x, y, w, h] = items[i];
    box(g, [w, h, 0.08], [x, y, 0], i === 1 ? c.oakDark : c.oakLight);
    box(g, [w - 0.07, h - 0.07, 0.012], [x, y, 0.046], c.white);
    if (i === 0) {
      mesh(g, new THREE.CircleGeometry(0.2, 32), c.terra, [x, y + 0.1, 0.056]);
      box(g, [0.4, 0.025, 0.012], [x, y - 0.25, 0.06], c.oakDark);
      box(g, [0.25, 0.012, 0.012], [x, y - 0.3, 0.06], c.oakDark);
    } else if (i === 1) {
      box(g, [0.4, 0.43, 0.012], [x, y + 0.03, 0.056], c.sage);
      mesh(g, new THREE.CircleGeometry(0.145, 24), "#e5c8a0", [
        x + 0.07,
        y + 0.1,
        0.07,
      ]);
      box(g, [0.31, 0.02, 0.012], [x, y - 0.29, 0.06], c.oakDark);
    } else {
      mesh(g, new THREE.CircleGeometry(0.12, 6), "#cfb16f", [
        x,
        y + 0.03,
        0.056,
      ]);
      box(g, [0.29, 0.019, 0.012], [x, y - 0.2, 0.06], c.oakDark);
    }
  }
  return g;
}
function resume() {
  const g = new THREE.Group();
  box(g, [0.4, 0.032, 0.55], [0, 0.025, 0], c.oakDark, [0, 0, 0], 0.012);
  box(g, [0.35, 0.009, 0.49], [0, 0.047, 0], c.white);
  box(g, [0.12, 0.013, 0.045], [0, 0.06, -0.25], c.metal);
  box(g, [0.17, 0.003, 0.032], [-0.055, 0.054, -0.15], c.terra);
  for (let i = 0; i < 6; i++)
    box(
      g,
      [i % 3 === 0 ? 0.15 : 0.25, 0.003, 0.01],
      [i % 3 === 0 ? -0.05 : 0, 0.054, -0.065 + i * 0.043],
      "#a6aaa0",
    );
  return g;
}
function phone() {
  const g = new THREE.Group();
  box(g, [0.22, 0.025, 0.4], [0, 0.09, 0], c.black, [-0.3, 0, 0], 0.012);
  box(g, [0.184, 0.009, 0.337], [0, 0.109, 0], "#809891", [-0.3, 0, 0], 0.008);
  box(g, [0.065, 0.012, 0.018], [0, 0.158, -0.136], c.black);
  box(g, [0.12, 0.04, 0.19], [0, 0.024, -0.07], c.oakDark);
  return g;
}
function accessories() {
  const g = new THREE.Group();
  box(g, [1.72, 0.014, 0.64], [0, 0.012, 0.06], "#7b877f", [0, 0, 0], 0.04);
  box(g, [0.87, 0.025, 0.3], [-0.18, 0.036, 0.04], "#d9dcce", [0, 0, 0], 0.012);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 12; j++)
      box(
        g,
        [0.055, 0.012, 0.047],
        [-0.559 + j * 0.067, 0.054, -0.069 + i * 0.064],
        i === 0 && j === 0 ? c.terra : c.white,
      );
  sphere(g, [0.093, 0.045, 0.14], [0.58, 0.044, 0.06], c.cream);
  cyl(g, 0.11, 0.09, 0.22, [-1.13, 0.12, 0.14], c.cream, [0, 0, 0], 24);
  cyl(g, 0.091, 0.091, 0.006, [-1.13, 0.233, 0.14], "#614734", [0, 0, 0], 24);
  mesh(
    g,
    new THREE.TorusGeometry(0.075, 0.019, 8, 16),
    c.cream,
    [-1.01, 0.15, 0.14],
  );
  return g;
}
function optimize(group) {
  group.updateMatrixWorld(true);
  const buckets = new Map();
  group.traverse((child) => {
    if (!child.isMesh) return;
    const transformed = child.geometry.clone().applyMatrix4(child.matrixWorld);
    const geometry = transformed.index
      ? transformed.toNonIndexed()
      : transformed;
    geometry.deleteAttribute("uv");
    if (!buckets.has(child.material)) buckets.set(child.material, []);
    buckets.get(child.material).push(geometry);
  });
  const result = new THREE.Group();
  for (const [mat, geometries] of buckets) {
    const geometry = mergeGeometries(geometries);
    const m = new THREE.Mesh(geometry, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    result.add(m);
    for (const item of geometries) item.dispose();
  }
  return result;
}
const output = path.resolve("public/models");
await mkdir(output, { recursive: true });
const exporter = new GLTFExporter();
for (const [name, build] of Object.entries({
  desk,
  monitor,
  laptop,
  bookshelf,
  chair,
  plant,
  lamp,
  frames,
  resume,
  phone,
  accessories,
})) {
  const scene = optimize(build());
  const binary = await exporter.parseAsync(scene, {
    binary: true,
    onlyVisible: true,
  });
  await writeFile(path.join(output, `${name}.glb`), Buffer.from(binary));
  console.log(
    `${name}.glb: ${(binary.byteLength / 1024).toFixed(1)} KB, ${scene.children.length} draw calls`,
  );
}
