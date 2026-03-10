import React, { useEffect, useRef } from 'react';

// The vertex shader is standard boilerplate for a full-screen quad.
const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// The fragment shader contains the user-provided Black Hole Shadertoy code with tonemapping appended.
const fragmentShaderSource = `
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;

vec3 saturate(vec3 x) {
    return clamp(x, vec3(0.0), vec3(1.0));
}

// Procedural fallback for nebulae
vec4 texture(int channel, vec2 uv) {
  return vec4(0.01, 0.01, 0.02, 1.0);
}

// =========================================================================
// BEGIN SHADERTOY CODE
// =========================================================================

#define AA 2  //change to 2 to increase quality
#define _Speed 1.5  //disk rotation speed
#define _Steps  12. //disk texture layers
#define _Size 0.3 //size of BH

float hash(float x){ return fract(sin(x)*152754.742);}
float hash(vec2 x){	return hash(x.x + hash(x.y));}

float value(vec2 p, float f) //value noise
{
    float bl = hash(floor(p*f + vec2(0.,0.)));
    float br = hash(floor(p*f + vec2(1.,0.)));
    float tl = hash(floor(p*f + vec2(0.,1.)));
    float tr = hash(floor(p*f + vec2(1.,1.)));
    
    vec2 fr = fract(p*f);    
    fr = (3. - 2.*fr)*fr*fr;	
    float b = mix(bl, br, fr.x);	
    float t = mix(tl, tr, fr.x);
    return  mix(b,t, fr.y);
}

vec4 background(vec3 ray)
{
    vec2 uv = ray.xy;
    
    if( abs(ray.x) > 0.5)
        uv.x = ray.z;
    else if( abs(ray.y) > 0.5)
        uv.y = ray.z;

        
    float brightness = value( uv*3., 100.); //(poor quality) "stars" created from value noise
    float color = value( uv*2., 20.); 
    brightness = pow(brightness, 256.);
  
    brightness = brightness*100.;
    brightness = clamp(brightness, 0., 1.);
    
    vec3 stars = brightness * mix(vec3(1., .6, .2), vec3(.2, .6, 1), color);

    vec4 nebulae = texture(0, (uv*1.5 ));
    nebulae.xyz += nebulae.xxx + nebulae.yyy + nebulae.zzz; //average color
    nebulae.xyz *= 0.25;
    
    nebulae*= nebulae;
    nebulae*= nebulae;
    nebulae*= nebulae;
    nebulae*= nebulae;
 
	nebulae.xyz += stars;
	return nebulae;
}

vec4 raymarchDisk(vec3 ray, vec3 zeroPos)
{
	vec3 position = zeroPos;      
    float lengthPos = length(position.xz);
    float dist = min(1., lengthPos*(1./_Size) *0.5) * _Size * 0.4 *(1./_Steps) /( abs(ray.y) );

    position += dist*_Steps*ray*0.5;     

    vec2 deltaPos;
    deltaPos.x = -zeroPos.z*0.01 + zeroPos.x;
    deltaPos.y = zeroPos.x*0.01 + zeroPos.z;
    deltaPos = normalize(deltaPos - zeroPos.xz);
    
    float parallel = dot(ray.xz, deltaPos);
    parallel /= sqrt(lengthPos);
    parallel *= 0.5;
    float redShift = parallel +0.3;
    redShift *= redShift;

    redShift = clamp(redShift, 0., 1.);
    
    float disMix = clamp((lengthPos - _Size * 2.)*(1./_Size)*0.24, 0., 1.);
    vec3 insideCol =  mix(vec3(1.0,0.8,0.0), vec3(0.5,0.13,0.02)*0.2, disMix);
    
    insideCol *= mix(vec3(0.4, 0.2, 0.1), vec3(1.6, 2.4, 4.0), redShift);
	insideCol *= 1.25;
    redShift += 0.12;
    redShift *= redShift;

    vec4 o = vec4(0.);

    for(float i = 0. ; i < _Steps; i++)
    {                      
        position -= dist * ray ;  

        float intensity =clamp( 1. - abs((i - 0.8) * (1./_Steps) * 2.), 0., 1.); 
        float lengthPos = length(position.xz);
        float distMult = 1.;

        distMult *=  clamp((lengthPos -  _Size * 0.75) * (1./_Size) * 1.5, 0., 1.);        
        distMult *= clamp(( _Size * 10. -lengthPos) * (1./_Size) * 0.20, 0., 1.);
        distMult *= distMult;

        float u = lengthPos + iTime* _Size*0.3 + intensity * _Size * 0.2;

        vec2 xy ;
        float rot = mod(iTime*_Speed, 8192.);
        xy.x = -position.z*sin(rot) + position.x*cos(rot);
        xy.y = position.x*sin(rot) + position.z*cos(rot);

        float x = abs( xy.x/(xy.y));         
		float angle = 0.02*atan(x);
  
        const float f = 70.;
        float noise = value( vec2( angle, u * (1./_Size) * 0.05), f);
        noise = noise*0.66 + 0.33*value( vec2( angle, u * (1./_Size) * 0.05), f*2.);     

        float extraWidth =  noise * 1. * (1. -  clamp(i * (1./_Steps)*2. - 1., 0., 1.));

        float alpha = clamp(noise*(intensity + extraWidth)*( (1./_Size) * 10.  + 0.01 ) *  dist * distMult , 0., 1.);

        vec3 col = 2.*mix(vec3(0.3,0.2,0.15)*insideCol, insideCol, min(1.,intensity*2.));
        o = clamp(vec4(col*alpha + o.rgb*(1.-alpha), o.a*(1.-alpha) + alpha), vec4(0.), vec4(1.));

        lengthPos *= (1./_Size);
   
        o.rgb+= redShift*(intensity*1. + 0.5)* (1./_Steps) * 100.*distMult/(lengthPos*lengthPos);
    }  
 
    o.rgb = clamp(o.rgb - 0.005, 0., 1.);
    return o ;
}


void Rotate( inout vec3 vector, vec2 angle )
{
	vector.yz = cos(angle.y)*vector.yz
				+sin(angle.y)*vec2(-1,1)*vector.zy;
	vector.xz = cos(angle.x)*vector.xz
				+sin(angle.x)*vec2(-1,1)*vector.zx;
}

void mainImage( out vec4 colOut, in vec2 fragCoord )
{
    colOut = vec4(0.);;
    
    vec2 fragCoordRot;
    fragCoordRot.x = fragCoord.x*0.985 + fragCoord.y * 0.174;
    fragCoordRot.y = fragCoord.y*0.985 - fragCoord.x * 0.174;
    fragCoordRot += vec2(-0.06, 0.12) * iResolution.xy;
    
    for( int j=0; j<AA; j++ )
    for( int i=0; i<AA; i++ )
    {
        vec3 ray = normalize( vec3((fragCoordRot-iResolution.xy*.5  + vec2(i,j)/(float(AA)))/iResolution.x, 1 )); 
        vec3 pos = vec3(0.,0.05,-(20.*iMouse.xy/iResolution.y-10.)*(20.*iMouse.xy/iResolution.y-10.)*.05); 
        vec2 angle = vec2(iTime*0.05,.2); 
        angle.y = (2.*iMouse.y/iResolution.y)*3.14 + 0.1 + 3.14;
        float dist = length(pos);
        Rotate(pos,angle);
        angle.xy -= min(.3/dist , 3.14) * vec2(1, 0.5);
        Rotate(ray,angle);

        vec4 col = vec4(0.); 
        vec4 glow = vec4(0.); 
        vec4 outCol =vec4(100.);

        for(int disks = 0; disks< 20; disks++) //steps
        {

            for (int h = 0; h < 6; h++) 
            {
                float dotpos = dot(pos,pos);
                float invDist = inversesqrt(dotpos); 
                float centDist = dotpos * invDist; 
                float stepDist = 0.92 * abs(pos.y /(ray.y));   
                float farLimit = centDist * 0.5; 
                float closeLimit = centDist*0.1 + 0.05*centDist*centDist*(1./_Size); 
                stepDist = min(stepDist, min(farLimit, closeLimit));
				
                float invDistSqr = invDist * invDist;
                float bendForce = stepDist * invDistSqr * _Size * 0.625; 
                ray =  normalize(ray - (bendForce * invDist )*pos);
                pos += stepDist * ray; 
                
                glow += vec4(1.2,1.1,1, 1.0) *(0.01*stepDist * invDistSqr * invDistSqr *clamp( centDist*(2.) - 1.2,0.,1.));
            }

            float dist2 = length(pos);

            if(dist2 < _Size * 0.1) 
            {
                outCol =  vec4( col.rgb * col.a + glow.rgb *(1.-col.a ) ,1.) ;
                break;
            }

            else if(dist2 > _Size * 1000.) 
            {                   
                vec4 bg = background (ray);
                outCol = vec4(col.rgb*col.a + bg.rgb*(1.-col.a)  + glow.rgb *(1.-col.a    ), 1.);       
                break;
            }

            else if (abs(pos.y) <= _Size * 0.002 )
            {                             
                vec4 diskCol = raymarchDisk(ray, pos);
                pos.y = 0.;
                pos += abs(_Size * 0.001 /ray.y) * ray;  
                col = vec4(diskCol.rgb*(1.-col.a) + col.rgb, col.a + diskCol.a*(1.-col.a));
            }	
        }
   
        if(outCol.r == 100.)
            outCol = vec4(col.rgb + glow.rgb *(col.a +  glow.a) , 1.);

        colOut += outCol/float(AA*AA);
    }

    // APPLY POST-PROCESSING TONEMAPPING
    vec3 color = colOut.rgb;
    
    // Tonemapping and color grading from Shadertoy Image tab
    color *= 120.0; // Between blowout (400) and dark (40)
    
    color = pow(color, vec3(1.5));
    color = color / (1.0 + color);
    color = pow(color, vec3(1.0 / 1.5));

    color = mix(color, color * color * (3.0 - 2.0 * color), vec3(1.0));
    color = pow(color, vec3(1.3, 1.20, 1.0));    

	color = saturate(color * 1.01);
    color = pow(color, vec3(0.7 / 2.2));

    colOut = vec4(color, 1.0);
}

// =========================================================================
// END SHADERTOY CODE
// =========================================================================

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export function BlackHole({ className = '', style = {} }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, click: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }

        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vs || !fs) return;

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const vertices = new Float32Array([
            -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
        const iTimeLoc = gl.getUniformLocation(program, 'iTime');
        const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const pixelRatio = window.devicePixelRatio || 1;

            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform3f(iResolutionLoc, canvas.width, canvas.height, pixelRatio);
        };

        window.addEventListener('resize', resize);
        resize();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const pixelRatio = window.devicePixelRatio || 1;
            mouseRef.current.x = (e.clientX - rect.left) * pixelRatio;
            mouseRef.current.y = (canvas.clientHeight - (e.clientY - rect.top)) * pixelRatio;
        };

        const handleMouseDown = () => { mouseRef.current.click = 1; };
        const handleMouseUp = () => { mouseRef.current.click = 0; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        let animationFrameId;
        const startTime = Date.now();

        const render = () => {
            const time = (Date.now() - startTime) / 1000.0;
            gl.uniform1f(iTimeLoc, time);
            gl.uniform4f(iMouseLoc, mouseRef.current.x, mouseRef.current.y, mouseRef.current.click, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
        };
    }, []);

    // Use a slight CSS drop-shadow/blur proxy to simulate bloom glow globally
    return (
        <div className={`${className} filter drop-shadow-[0_0_8px_rgba(255,200,100,0.3)]`} style={style}>
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
}
