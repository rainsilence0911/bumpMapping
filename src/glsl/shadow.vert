attribute vec3 aVertexPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uPerspectiveMatrix;

void main(void) {
    gl_Position = uPerspectiveMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
}
