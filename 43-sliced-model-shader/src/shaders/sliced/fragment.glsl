varying vec3 vPosition;
uniform float uSliceStart;
uniform float uSliceArc;

void main() {
  // float uSliceStart = 1.0;
  // float uSliceArc = 1.5;
  
  float angle = atan(vPosition.y, vPosition.x);

  if(angle > uSliceStart && angle < uSliceStart + uSliceArc) {
    discard;
  }

  // csm_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  
  csm_FragColor = vec4(vec3(angle), 1.0);  
}
