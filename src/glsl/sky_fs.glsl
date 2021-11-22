uniform sampler2D tex;
uniform float uTime;
varying vec2 vUv;
void main(){
    vec3 diffuse=texture2D(tex,vUv).xyz;
    vec3 color=diffuse.xyz*fract(uTime);
    gl_FragColor=vec4(color,1.);
}