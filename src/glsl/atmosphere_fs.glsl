uniform sampler2D tex;
uniform float uTime;
uniform vec3 color;
varying vec3 vNormal;
varying vec2 vUv;
void main(){
    vec3 diffuse=texture2D(tex,vUv).xyz;
    vec2 uv=4.*vUv;
    float f=vNormal.x+cos(uv.y+uTime)+vNormal.y*sin(uTime);
    gl_FragColor=vec4(sin(f*2.)*color+diffuse.xxx/2.,.5);
}