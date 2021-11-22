varying float intensity;
uniform vec3 glowColor;
// uniform float uTime;

void main()
{
    vec3 glow=glowColor*intensity/2.;
    gl_FragColor=vec4(glow,1.);
}

// void main(){
    // float intensity=pow(.9-dot(vNormal,vec3(0,0,1.)),12.);
    // gl_FragColor=vec4(.2,.2,1.,1.)*intensity;
    // vec2 uv=6.*vUv;
    // for(int n=1;n<8;++n){
        //     float i=float(n);
        //     uv+=vec2(.7/i*sin(i*uv.y+uTime+.3)+.8,.4/i*sin(uv.x+uTime+.3*i)+1.6);
    // }
    // vec3 color=vec3(.5*sin(uv.x)+.5,.5*sin(uv.y)+.1,sin(uv.x+uv.y));
    // gl_FragColor=vec4(color.rgb,color.r)*intensity;
// }