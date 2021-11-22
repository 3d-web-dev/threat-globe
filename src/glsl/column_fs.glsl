varying vec3 vNormal;
varying vec2 vUv;
uniform float uTime;

void main(){
    float intensity=pow(.9-dot(vNormal,vec3(0,0,1.)),12.);
    vec2 uv=2.*vUv;
    for(int n=1;n<8;++n){
        float i=float(n);
        uv+=vec2(.1/i*sin(i*uv.x+uTime+.3)+.8,.4/i*sin(uv.x+uTime+.3*i)+1.6);
    }
    
    vec3 color=vec3(sin(uv.x+tan(uTime/3.))+.5,.5*sin(uv.y+uTime)+.1,intensity*sin(uv.x+uv.y+uTime));
    gl_FragColor=vec4(color,.2);
}

// uniform vec3 glowColor;
// uniform float b;
// uniform float p;
// uniform float s;
// varying vec3 vNormal;
// varying vec3 vPositionNormal;
// void main()
// {
    //     float a=pow(b+s*abs(dot(vNormal,vPositionNormal)),p);
    //     gl_FragColor=vec4(glowColor,a);
// }