uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;


#include ../include/remap;

void main() {
  float progress = uProgress * aTimeMultiplier;
  vec3 newPosition = position;

  // Exploding (No clamp also has nice efffect)
  float explosionProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  explosionProgress = clamp(explosionProgress, 0.0, 1.0);
  explosionProgress = 1.0 - pow(1.0 - explosionProgress, 3.0);
  newPosition *= explosionProgress;

  // Falling
  float fallProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallProgress = clamp(fallProgress, 0.0, 1.0);
  fallProgress = 1.0 - pow(1.0 - fallProgress, 3.0);
  newPosition.y -= fallProgress * 0.2;

  // Scaling
  float sizeOpenProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeCloseProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpenProgress, sizeCloseProgress);
  sizeProgress = clamp(sizeProgress, 0.0, 1.0);


  // Twinkling
  float twinkleProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinkleProgress = clamp(twinkleProgress, 0.0, 1.0);
  float sizeTwinkle = sin(progress * 30.0) * 0.5 + 0.5;
  sizeTwinkle = 1.0 - sizeTwinkle * twinkleProgress;

  // Final position
  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

    // Final size
  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkle;
  gl_PointSize *= 1.0 / -viewPosition.z;

  // Windows hack to make particle dissapear when size < 1
  if(gl_PointSize <= 1.0) {
    gl_Position = vec4(9999.9);
  }
}
