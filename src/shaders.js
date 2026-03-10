const prefix = `
uniform vec3      iResolution;
uniform float     iTime;
uniform vec4      iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
in vec2 vUv;
out vec4 glFragColor;
#define gl_FragColor glFragColor
`;

const suffix = `
void main() {
    mainImage(glFragColor, gl_FragCoord.xy);
}
`;

import mainShaderRaw from '../../shader.glsl?raw';
import bufferARaw from '../../buffer_a.glsl?raw';
import bufferBRaw from '../../buffer_b.glsl?raw';
import bufferCRaw from '../../buffer_c.glsl?raw';
import imageRaw from '../../image.glsl?raw';

export const mainShader = prefix + mainShaderRaw + suffix;
export const bufferAShader = prefix + bufferARaw + suffix;
export const bufferBShader = prefix + bufferBRaw + suffix;
export const bufferCShader = prefix + bufferCRaw + suffix;
export const imageShader = prefix + imageRaw + suffix;

export const vertexShader = `
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
