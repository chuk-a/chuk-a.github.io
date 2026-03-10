import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mainShader, bufferAShader, bufferBShader, bufferCShader, imageShader, vertexShader } from './shaders';

// Generate noise texture
const createNoiseTexture = (size = 256) => {
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i++) {
        data[i] = Math.random() * 255;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
};

// Generate an organic-looking placeholder texture for wood
const createOrganicTexture = (size = 512) => {
    const data = new Uint8Array(size * size * 4);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const i = (y * size + x) * 4;
            // Simple chaotic pattern
            const v = Math.sin(x * 0.1) * Math.cos(y * 0.1) + Math.sin(x * 0.02 + y * 0.03) * 2.0;
            const normalized = (v + 3.0) / 6.0;
            data[i] = 120 + normalized * 80;
            data[i + 1] = 90 + normalized * 60;
            data[i + 2] = 60 + normalized * 40;
            data[i + 3] = 255;
        }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
};

export function ShadertoyGargantua() {
    const { gl, size } = useThree();

    // Create random textures
    const noiseTex = useMemo(() => createNoiseTexture(), []);
    const woodTex = useMemo(() => createOrganicTexture(), []);

    // Create Ping-pong buffers for A
    const fboA1 = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    }), [size]);
    const fboA2 = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    }), [size]);

    // Create buffers B, C, D
    const fboB = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    }), [size]);
    const fboC = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    }), [size]);
    const fboD = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
        type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    }), [size]);

    const pingpong = useRef({ read: fboA1, write: fboA2 });

    const uniforms = useMemo(() => ({
        iResolution: { value: new THREE.Vector3(size.width, size.height, 1) },
        iTime: { value: 0 },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iChannel0: { value: null },
        iChannel1: { value: null },
        iChannel2: { value: null },
        iChannel3: { value: null }
    }), [size]);

    const matA = useMemo(() => new THREE.ShaderMaterial({
        vertexShader, fragmentShader: mainShader, uniforms: { ...uniforms }, depthWrite: false, glslVersion: THREE.GLSL3
    }), [uniforms]);
    const matB = useMemo(() => new THREE.ShaderMaterial({
        vertexShader, fragmentShader: bufferAShader, uniforms: { ...uniforms }, depthWrite: false, glslVersion: THREE.GLSL3
    }), [uniforms]);
    const matC = useMemo(() => new THREE.ShaderMaterial({
        vertexShader, fragmentShader: bufferBShader, uniforms: { ...uniforms }, depthWrite: false, glslVersion: THREE.GLSL3
    }), [uniforms]);
    const matD = useMemo(() => new THREE.ShaderMaterial({
        vertexShader, fragmentShader: bufferCShader, uniforms: { ...uniforms }, depthWrite: false, glslVersion: THREE.GLSL3
    }), [uniforms]);
    const matImage = useMemo(() => new THREE.ShaderMaterial({
        vertexShader, fragmentShader: imageShader, uniforms: { ...uniforms }, depthWrite: false, glslVersion: THREE.GLSL3
    }), [uniforms]);

    const orthoCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
    const sceneA = useMemo(() => new THREE.Scene().add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matA)), [matA]);
    const sceneB = useMemo(() => new THREE.Scene().add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matB)), [matB]);
    const sceneC = useMemo(() => new THREE.Scene().add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matC)), [matC]);
    const sceneD = useMemo(() => new THREE.Scene().add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matD)), [matD]);
    const sceneImage = useMemo(() => new THREE.Scene().add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), matImage)), [matImage]);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        // Mouse handling (x, y, z=click down, w=click down previous)
        const mx = (state.pointer.x * 0.5 + 0.5) * size.width;
        const my = (state.pointer.y * 0.5 + 0.5) * size.height;
        const pointerDown = state.pointer.down ? 1.0 : 0.0;

        const res = new THREE.Vector3(size.width, size.height, 1);
        const mouse = new THREE.Vector4(mx, my, pointerDown, 0);

        // Buffer A
        matA.uniforms.iTime.value = time;
        matA.uniforms.iResolution.value = res;
        matA.uniforms.iMouse.value = mouse;
        matA.uniforms.iChannel0.value = noiseTex;
        matA.uniforms.iChannel1.value = woodTex;
        matA.uniforms.iChannel2.value = pingpong.current.read.texture;

        gl.setRenderTarget(pingpong.current.write);
        gl.render(sceneA, orthoCamera);

        // Swap pingpong
        let temp = pingpong.current.read;
        pingpong.current.read = pingpong.current.write;
        pingpong.current.write = temp;

        // Buffer B
        matB.uniforms.iTime.value = time;
        matB.uniforms.iResolution.value = res;
        matB.uniforms.iMouse.value = mouse;
        matB.uniforms.iChannel0.value = pingpong.current.read.texture;

        gl.setRenderTarget(fboB);
        gl.render(sceneB, orthoCamera);

        // Buffer C
        matC.uniforms.iTime.value = time;
        matC.uniforms.iResolution.value = res;
        matC.uniforms.iMouse.value = mouse;
        matC.uniforms.iChannel0.value = fboB.texture;

        gl.setRenderTarget(fboC);
        gl.render(sceneC, orthoCamera);

        // Buffer D
        matD.uniforms.iTime.value = time;
        matD.uniforms.iResolution.value = res;
        matD.uniforms.iMouse.value = mouse;
        matD.uniforms.iChannel0.value = fboC.texture;

        gl.setRenderTarget(fboD);
        gl.render(sceneD, orthoCamera);

        // Main Image (render to screen)
        matImage.uniforms.iTime.value = time;
        matImage.uniforms.iResolution.value = res;
        matImage.uniforms.iMouse.value = mouse;
        matImage.uniforms.iChannel0.value = pingpong.current.read.texture;
        matImage.uniforms.iChannel3.value = fboD.texture;

        gl.setRenderTarget(null);
        gl.clear();
        gl.render(sceneImage, orthoCamera);

    }, 1);

    return null;
}
