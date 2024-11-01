varying vec3 vColor;

void main() {
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);

    // Star Glow
    float starRadius = 0.05;
    float alpha = (starRadius / distanceToCenter) - (starRadius * 2.0);

    // vec3 color = mix(uColorA, uColorB, vColor.r);

    // gl_FragColor = vec4(uv, 1.0, 1.0);
    // gl_FragColor = vec4(vec3(alpha), 1.0);
    // gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    gl_FragColor = vec4(vColor, alpha);
    // gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}