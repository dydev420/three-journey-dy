vec3 directionalLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 viewDirection, float specularPower) {
  vec3 lightDirection = normalize(position);
  vec3 lightReflection = reflect(-lightDirection, normal);

  float shading = dot(normal, lightDirection);
  shading = max(0.0, shading);

  float specular = -dot(lightReflection, viewDirection);
  specular = max(0.0, specular);
  specular = pow(specular, specularPower);
  
  return color * intensity * (shading + specular);
}
