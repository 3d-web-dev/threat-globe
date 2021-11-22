varying vec3 vNormal;
varying vec3 vPositionNormal;
varying vec2 vUv;

void main(){
    
    vec4 mvPosition=instanceMatrix*vec4(position,1.);
    vUv=uv+position.xy;
    vNormal=normalize(normalMatrix*normal);
    vPositionNormal=normalize((modelViewMatrix*vec4(position,1.)).xyz);
    vec4 modelViewPosition=modelViewMatrix*mvPosition;
    gl_Position=projectionMatrix*modelViewPosition;
    
}