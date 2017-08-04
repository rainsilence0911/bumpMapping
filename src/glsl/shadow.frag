precision mediump float;

const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
const vec4 bitMask = vec4(1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0, 0.0);

void main(void) {
    // Because the gl_FragCoord.z is not linear, most of points' depth is close to 1.0

    vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift);
    rgbaDepth -= rgbaDepth.gbaa * bitMask;

    gl_FragColor = rgbaDepth;
}
