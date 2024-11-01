uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPostion;


#include ../includes/perlineClassic3D.glsl

float waveElevation(vec3 position) {
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                        sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                        uBigWavesElevation;

    for(float i = 1.0; i <= uSmallIterations; i++)
    {
        elevation -= abs(perlineClassic3D(vec3(position.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    // Base Position
    float shift = 0.01;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 neighbourPositionA = modelPosition.xyz + vec3(shift, 0.0, 0.0);
    vec3 neighbourPositionB = modelPosition.xyz + vec3(0.0, 0.0, -shift);

    // Elevation
    float elevation = waveElevation(modelPosition.xyz);
    modelPosition.y += elevation;
    neighbourPositionA.y += waveElevation(neighbourPositionA);
    neighbourPositionB.y += waveElevation(neighbourPositionB);
    
    // Compute Normals
    vec3 toA = normalize(neighbourPositionA - modelPosition.xyz);
    vec3 toB = normalize(neighbourPositionB - modelPosition.xyz);
    vec3 computeNormal = cross(toA, toB);

    // Final Position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
    // vNormal = (modelMatrix  * vec4(normal, 0.0)).xyz;
    vNormal = computeNormal;
    vPostion = modelPosition.xyz;
}