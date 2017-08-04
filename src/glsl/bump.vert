attribute vec3 aVertexPosition;
attribute vec2 aSamplePosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexBiNormal;

uniform mat4 uPMatrix;
uniform mat4 uVMatrix;
uniform mat4 uMMatrix;
uniform mat4 uNormalMatrix;

varying vec2 vTexturePosition;
varying vec3 vVertexNormal;
varying vec3 vVertexBiNormal;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);
    vTexturePosition = aSamplePosition;
    vVertexNormal = (uNormalMatrix * vec4(aVertexNormal, 1.0)).xyz;
    vVertexBiNormal = (uNormalMatrix * vec4(aVertexBiNormal, 1.0)).xyz;
}
