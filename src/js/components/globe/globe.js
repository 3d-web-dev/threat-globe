import * as THREE from "three";
import general_vs from "../../../glsl/general_vs.glsl";
import atmosphere_fs from "../../../glsl/atmosphere_fs.glsl";
import glow_vs from "../../../glsl/glow_vs.glsl";
import glow_fs from "../../../glsl/glow_fs.glsl";

import { buildColumns } from "../columns/buildColumns";
import { buildSurfaceDots } from "./buildSurfaceDots";

const radius = 25;
const atmosphereSize = 0.01;
const atmosphereGlowSize = 8;
const segment = 50;

export function buildGlobe(camera, assets) {
  const globe = new THREE.Group();
  const earthGeo = new THREE.SphereGeometry(radius, segment, segment);
  const earthMat = new THREE.MeshPhongMaterial({
    map: assets.earthMap,
    bumpMap: assets.earthBumpMap,
    bumpScale: 20,
    specularMap: assets.earthSpecularMap,
    shininess: 10,
    specular: new THREE.Color("grey")
  });

  const earth = new THREE.Mesh(earthGeo, earthMat);
  globe.add(earth);

  const atmosphereGeo = new THREE.SphereGeometry(radius + atmosphereSize, segment, segment);
  const atmosphereMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      tex: { value: assets.earthMap },
      color: { value: new THREE.Color(0x1298ff) }
    },
    vertexShader: general_vs,
    fragmentShader: atmosphere_fs,
    transparent: true
  });

  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  globe.add(atmosphere);

  const atmosphericGlowGeo = new THREE.SphereGeometry(radius + atmosphereSize + atmosphereGlowSize, segment, segment);
  const atmosphericGlowMat = new THREE.ShaderMaterial({
    uniforms: {
      c: { value: 0.7 }, //intensity
      p: { value: 7.0 }, //fade
      glowColor: { value: new THREE.Color(0x12cfef) },
      viewVector: { value: camera.position }
    },
    vertexShader: glow_vs,
    fragmentShader: glow_fs,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const atmosphericGlowMesh = new THREE.Mesh(atmosphericGlowGeo, atmosphericGlowMat);
  globe.add(atmosphericGlowMesh);

  const dots = buildSurfaceDots(assets.map);
  globe.add(dots);

  // const columns = buildColumns(assets.data);
  // globe.add(columns)

  globe.userData.tick = () => {
    atmosphereMat.uniforms.uTime.value += 1 / 100;
    // columns.userData.tick()
  };

  return globe;
}
