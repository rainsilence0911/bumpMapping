attribute vec3 aVertexPosition;

uniform mat4 uPMatrix;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;

uniform mat4 uViewFromLightMatrix;

varying vec4 vPositionFromLight;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vPositionFromLight = uPMatrix * uViewFromLightMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
}
