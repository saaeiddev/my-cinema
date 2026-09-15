import * as THREE from 'three';

// Defensive compatibility patch: treat omitted Euler components as zero.
// Some premium scene helpers intentionally omit rotation arrays for unrotated meshes.
const originalSet = THREE.Euler.prototype.set;
THREE.Euler.prototype.set = function(x = 0, y = 0, z = 0, order) {
  return originalSet.call(this, x ?? 0, y ?? 0, z ?? 0, order);
};
