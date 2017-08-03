precision highp float;

const vec3 ambientColor = vec3(0.2, 0.2, 0.2);
const vec3 lightDirection = normalize(vec3(0.0, 0.0, -10.0));

uniform sampler2D uNormalSampler;
uniform sampler2D uSampler;
uniform bool bUseBumpMapping;
uniform float uBumpHeight;

varying vec2 vTexturePosition;
varying vec3 vVertexNormal;
varying vec3 vVertexBiNormal;

void main(void) {

    vec4 originalTexture = texture2D(uSampler, vTexturePosition);

    if (bUseBumpMapping == false) {
        gl_FragColor = originalTexture;
    } else {
        // the range of texture2D's xy is [0, 1], [0, 1] * 2 - 1 = [-1, 1]
        vec2 bump = (texture2D(uNormalSampler, vTexturePosition.xy).xy * 2.0 - 1.0) * uBumpHeight;
        vec3 tangent = cross(vVertexNormal, vVertexBiNormal);
        vec3 nb = vVertexNormal + bump.x * normalize(tangent) + bump.y * vVertexBiNormal;
        nb = normalize(nb);
        vec3 diffuseColor = originalTexture.xyz;
        gl_FragColor = vec4(max(dot(nb, -lightDirection), 0.0) * diffuseColor + ambientColor, 1.0);
    }
}
