precision highp float;

uniform sampler2D uShadowMap;

varying vec4 vPositionFromLight;

const vec4 bitShift = vec4(1.0, 1.0 / 256.0, 1.0 / (256.0 * 256.0), 1.0 / (256.0 * 256.0 * 256.0));

float unpackDepth(vec4 textureColor) {
    return dot(textureColor, bitShift);
}

void main(void) {
    vec3 shadowCoord = (vPositionFromLight.xyz / vPositionFromLight.w) / 2.0 + 0.5;

    float depth = unpackDepth(texture2D(uShadowMap, shadowCoord.xy));

    float visibility = (shadowCoord.z > depth + 0.0004) ? 0.7 : 1.0;

    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * visibility, 1.0);
}
