uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Normal
  vec3 normal = normalize(vNormal);
  if(!gl_FrontFacing) {
    normal *= -1.0;
  }

  // Stripes
  float stripes = mod((vPosition.y * 20.0) - uTime, 1.0);
  stripes = pow(stripes, 3.0);

  // Fresnel
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(viewDirection, normal) + 1.0;
  fresnel = pow(fresnel, 2.0);

   // Falloff
  float falloff = smoothstep(0.8, 0.0, fresnel);

  // Holograph
  float hologrpahic = stripes * fresnel;
  hologrpahic += fresnel * 1.25;
  hologrpahic *= falloff;

  // Final color
  gl_FragColor = vec4(uColor, hologrpahic);
  // gl_FragColor = vec4(normal, fresnel);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
