uniform float uTime;
uniform sampler2D uPerlinTexture;

varying vec2 vUv;

void main() {

  // Scale and Animate
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.05;

  // Read texture
  float smoke = texture(uPerlinTexture, smokeUv).r;
  // smoke = 1.0 - smoke;

  // Remap texture values
  smoke = smoothstep(0.4, 1.0, smoke);

  // Edge
  smoke *= smoothstep(0.0, 0.2, vUv.x);
  smoke *= smoothstep(1.0, 0.8, vUv.x);
  smoke *= smoothstep(0.0, 0.1, vUv.y);
  smoke *= smoothstep(1.0, 0.4, vUv.y);
  
  // Final output color
  gl_FragColor = vec4(0.6, 0.3, 0.2, smoke);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}