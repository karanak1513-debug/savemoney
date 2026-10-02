function createNoise2D() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  return function noise(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const a = perm[X] + Y;
    const aa = perm[a], ab = perm[a + 1];
    const b = perm[X + 1] + Y;
    const ba = perm[b], bb = perm[b + 1];
    
    const x1 = lerp(grad(perm[aa], xf, yf), grad(perm[ba], xf - 1, yf), u);
    const x2 = lerp(grad(perm[ab], xf, yf - 1), grad(perm[bb], xf - 1, yf - 1), u);
    return (lerp(x1, x2, v) + 1) * 0.5;
  };
}

const noise = createNoise2D();
const t0 = Date.now();
let sum = 0;
for (let y = 0; y < 256; y++) {
  for (let x = 0; x < 512; x++) {
    sum += noise(x * 0.05, y * 0.05);
  }
}
const elapsed = Date.now() - t0;
console.log(`Computed 512x256 noise values in ${elapsed}ms. Average: ${sum / (512 * 256)}`);
