import React, { useEffect, useRef } from 'react';

export function Gargantua({ className = '', style = {} }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
        if (!gl) return;

        const vertexShaderSource = `#version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;

        const fragmentShaderSource = `#version 300 es
            precision highp float;

            uniform vec3 iResolution;
            uniform float iTime;
            uniform vec4 iMouse;

            #define ITERATIONS 50 // Balanced for quality and web performance
            const vec3 MainColor = vec3(1.0);

            // Procedural 3D noise (replacement for iChannel0 noise texture)
            float hash(float n) { return fract(sin(n) * 43758.5453); }
            float noise(vec3 x) {
                vec3 p = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                float n = p.x + p.y * 157.0 + 113.0 * p.z;
                return mix(
                    mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
                    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x), mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y),
                    f.z
                ) * 2.0 - 1.0;
            }

            float saturate(float x) { return clamp(x, 0.0, 1.0); }
            vec3 saturate(vec3 x) { return clamp(x, vec3(0.0), vec3(1.0)); }

            const float pi = 3.14159265;
            float atan2(float y, float x) {
                if (x > 0.0) return atan(y/x);
                if (y >= 0.0 && x < 0.0) return atan(y/x) + pi;
                if (y < 0.0 && x < 0.0) return atan(y/x) - pi;
                if (y > 0.0 && x == 0.0) return pi/2.0;
                if (y < 0.0 && x == 0.0) return -pi/2.0;
                return 0.0;
            }

            void RotateX(inout vec3 z, float rad) {
                float s = sin(rad), c = cos(rad);
                z.yz = vec2(c * z.y - s * z.z, s * z.y + c * z.z);
            }
            void RotateY(inout vec3 z, float rad) {
                float s = sin(rad), c = cos(rad);
                z.xz = vec2(c * z.x - s * z.z, s * z.x + c * z.z);
            }
            void RotateZ(inout vec3 z, float rad) {
                float s = sin(rad), c = cos(rad);
                z.xy = vec2(c * z.x - s * z.y, s * z.x + c * z.y);
            }

            float intersectPlane(vec3 r_o, vec3 r_d, vec3 p_o, vec3 p_n) {
                return dot(p_o - r_o, p_n) / dot(r_d, p_n);
            }

            void Haze(inout vec3 color, inout float alpha, vec3 pos) {
                float torusDist = length(vec2(length(pos.xz) - 0.5, pos.y));
                float bloomDisc = 1.0 / (pow(torusDist, 2.0) + 0.001);
                vec3 col = MainColor;
                bloomDisc *= length(pos) < 0.5 ? 0.0 : 1.0;
                // Massive base bloom multiplier to replace multi-pass gaussian blur
                color += col * bloomDisc * (35.0 / float(ITERATIONS)) * (1.0 - alpha * 1.0);
            }

            void GasDisc(inout vec3 color, inout float alpha, vec3 pos) {
                float dist = length(pos);
                float discAlpha = saturate(1.0 - pow(abs(pos.y), 0.7) * 20.0);
                discAlpha *= saturate(1.0 - pow(abs(1.0 - dist), 2.0) * 1.0);

                vec3 radialCoords = vec3(length(pos.xz), atan2(pos.x, pos.z), pos.y);
                float speed = 0.06;
                float noise1 = 1.0;
                vec3 rc = radialCoords + 0.0;               rc.y += iTime * speed;
                noise1 *= noise(rc * 3.0) * 0.5 + 0.5;      rc.y -= iTime * speed;
                noise1 *= noise(rc * 6.0) * 0.5 + 0.5;      rc.y += iTime * speed;
                noise1 *= noise(rc * 12.0) * 0.5 + 0.5;     rc.y -= iTime * speed;

                float noise2 = 2.0;
                rc = radialCoords + 30.0;
                noise2 *= noise(rc * 3.0) * 0.5 + 0.5;      rc.y += iTime * speed;
                noise2 *= noise(rc * 6.0) * 0.5 + 0.5;      rc.y -= iTime * speed;
                noise2 *= noise(rc * 12.0) * 0.5 + 0.5;     rc.y += iTime * speed;
                noise2 *= noise(rc * 24.0) * 0.5 + 0.5;     rc.y -= iTime * speed;

                float coverage = noise2;
                vec3 dustColor = vec3(1.0) * noise1 * 0.998 + vec3(0.002);
                
                radialCoords.y += iTime * speed * 0.5;
                
                // Smooth warm-white/purpleish base to match the authentic Shadertoy lstSRS feel
                float texNoise = noise(vec3(radialCoords.yx * vec2(0.5, 0.5), 0.0)) * 0.5 + 0.5;
                vec3 texColor = mix(vec3(1.0, 0.9, 0.8), vec3(0.8, 0.8, 1.0), texNoise);
                dustColor *= pow(texColor, vec3(2.0)) * 6.0;

                coverage = saturate(coverage * 1200.0 / float(ITERATIONS));
                dustColor = max(vec3(0.0), dustColor);

                vec3 col = dustColor * coverage * 1.0 * discAlpha;
                float a = coverage * 0.2 * discAlpha;

                color += col * (1.0 - alpha);
                alpha += a * (1.0 - alpha);
            }

            out vec4 fragColor;

            void main() {
                vec2 fragCoord = gl_FragCoord.xy;
                vec2 uv = fragCoord.xy / iResolution.xy;
                vec2 coord = uv * 2.0 - 1.0;
                coord.x *= iResolution.x / iResolution.y;

                vec3 rayPos = vec3(0.0, 0.2, -4.0);
                vec3 rayDir = normalize(vec3(coord, 2.0));

                vec2 mouse = iMouse.xy / iResolution.xy;
                if(iMouse.z <= 0.0) mouse = vec2(0.5, 0.5);
                mouse.x = mouse.x * 2.0 - 1.0;
                
                RotateX(rayPos, -mouse.y * 1.5 + 0.5);
                RotateX(rayDir, -mouse.y * 1.5 + 0.5);
                RotateY(rayPos, mouse.x * -3.0);
                RotateY(rayDir, mouse.x * -3.0);

                vec3 finalColor = vec3(0.0);
                float finalAlpha = 0.0;
                float stepSize = 8.0 / float(ITERATIONS);
                
                vec3 g_rayPos = rayPos;
                vec3 g_rayDir = rayDir;
                float g_rayL = 0.0;
                
                for(int i = 0; i < ITERATIONS; i++) {
                    float grav = 0.08 / pow(length(g_rayPos), 2.0);
                    vec3 gravDir = normalize(-g_rayPos);
                    g_rayDir = normalize(g_rayDir + gravDir * grav * stepSize);
                    g_rayPos += g_rayDir * stepSize;
                    g_rayL += stepSize;
                    
                    if (length(g_rayPos) < 0.2) break;
                    
                    GasDisc(finalColor, finalAlpha, g_rayPos);
                    Haze(finalColor, finalAlpha, g_rayPos);
                }

                if (length(g_rayPos) < 0.2) finalColor *= 0.0;
                
                vec3 color = finalColor;
                color *= 0.0001;
                
                // Tonemapping from Image pass
                color *= 400.0; // Boost exposure slightly for vibrant HDR whites
                color = pow(color, vec3(1.5));
                color = color / (1.0 + color);
                color = pow(color, vec3(1.0 / 1.5));
                
                // Basic dithering to reduce banding
                float dither = noise(vec3(fragCoord * 0.1, iTime));
                color += vec3((dither - 0.5) / 255.0);

                fragColor = vec4(color, 1.0);
            }
        `;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
        const iTimeLoc = gl.getUniformLocation(program, 'iTime');
        const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        let rafId;
        const startTime = Date.now();
        let mouseX = 0;
        let mouseDown = 0;

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            // Aggressively downscale the pixelRatio to 0.5 to protect the GPU.
            const pixelRatio = 0.5;

            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.useProgram(program);
            gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, pixelRatio);
        };

        window.addEventListener('resize', resize);

        const render = () => {
            gl.useProgram(program);

            const time = (Date.now() - startTime) / 1000.0;
            gl.uniform1f(iTimeLoc, time);

            // Auto rotate slightly if mouse is not held down
            const autoRotate = Math.sin(time * 0.2) * 200;
            gl.uniform4f(iMouseLoc, mouseDown ? mouseX : window.innerWidth / 2 + autoRotate, window.innerHeight * 0.4, mouseDown, 0);

            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            rafId = requestAnimationFrame(render);
        };

        const handleMove = (e) => { mouseX = e.clientX || e.touches?.[0]?.clientX; };
        const handleDown = () => { mouseDown = 1.0; };
        const handleUp = () => { mouseDown = 0.0; };

        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('touchmove', handleMove);
        canvas.addEventListener('mousedown', handleDown);
        canvas.addEventListener('touchstart', handleDown);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);

        resize();
        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
            gl.deleteProgram(program);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} style={style} />;
}
