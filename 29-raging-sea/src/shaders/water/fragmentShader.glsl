uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main() {
  float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 wColor = mix(uDepthColor, uSurfaceColor, mixStrength);

  gl_FragColor = vec4(wColor, 1.0);
}