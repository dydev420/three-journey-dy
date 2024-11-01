uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldFrequency;
uniform float uFlowFieldStrength;


#include ../includes/simplexNoise4d.glsl

void main() {
  float time = uTime * 0.2;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticles, uv);
  vec4 base = texture(uBase, uv);

  // Ded particles
  if(particle.a >= 1.0) {
    particle.a = mod(particle.a, 1.0) ;
    particle.xyz = base.xyz;
  }

  // Allive particle
  if(particle.a < 1.0) {
    // Flow Strength
    float flowInfluence = (uFlowFieldInfluence - 0.5) * (-2.0);
    float flowStrength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
    flowStrength = smoothstep(flowInfluence, 1.0, flowStrength);
    // Flow field
    vec3 flowField = vec3(
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.1, time)),
      simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.2, time))
    );
    flowField = normalize(flowField);
    particle.xyz += flowField * uDeltaTime * flowStrength * uFlowFieldStrength;

    // Decay
    particle.a += uDeltaTime * 0.3;
  }

  gl_FragColor = particle;
}
