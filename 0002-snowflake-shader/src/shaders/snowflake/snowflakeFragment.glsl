varying vec3 vColor;

void main() {

  // P1 Draw Circle
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = step(0.5, strength);
  strength = 1.0 - strength;

  // P2 Draw Diffuse Point
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // P3 Draw Light Point
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength = 1.0 - strength;
  // strength = pow(strength, 10.0);

  gl_FragColor = vec4(vColor, strength);
}