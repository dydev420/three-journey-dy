uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl;

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Glitch effect
  float glitchTime = uTime - modelPosition.y;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.69) + sin(glitchTime * 8.42);
  glitchStrength /= 3.0;
  glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
  glitchStrength *= 0.25;
  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

  // Final position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // Model Normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}