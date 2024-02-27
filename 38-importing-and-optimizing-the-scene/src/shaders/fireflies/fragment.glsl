void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float lightValue = 0.05;
  float strength = lightValue / distanceToCenter - lightValue * 2.0;
  gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
