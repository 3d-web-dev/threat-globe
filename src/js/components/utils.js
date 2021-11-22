import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = url;
  });
}

export function buildEnvironment(scene, assets) {
  const skyGeo = new THREE.SphereGeometry(12000, 32, 32);
  const skyMat = new THREE.MeshBasicMaterial({
    map: assets.skyMap,
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const ambientLight = new THREE.HemisphereLight(0xffffff, 0xeeeeee, 0.9);
  scene.add(ambientLight);

  const directionalLight = new THREE.PointLight(0xffffff, 1);
  directionalLight.position.set(5, 8, 0);
  scene.add(directionalLight);

  createLenseflare(scene, assets);
}

function createLenseflare(scene, assets) {
  const textureFlare0 = assets.lensflare1;
  const textureFlare3 = assets.lensflare2;

  addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
  addLight(0.08, 0.8, 0.5, 0, 0, -1000);
  addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

  function addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    light.add(lensflare);
  }
}

export const loadAssets = (func) => {
  Promise.all([
    new Promise((resolve) => {
      new GLTFLoader().load("./img/models/satellite.glb", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/earthMap.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/earthBumpMap.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/earthSpecMap.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/space.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/cloudmap.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/cloudmaptrans.jpg", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/lensflare0.png", resolve);
    }),
    new Promise((resolve) => {
      new THREE.TextureLoader().load("./img/textures/lensflare3.png", resolve);
    }),
    loadImage("./img/textures/map.png")
    // fetch('src/js/components/globe/server.json')
  ]).then((assetsArray) => {
    const assets = {
      satellite: assetsArray[0].scene.children[0],
      earthMap: assetsArray[1],
      earthBumpMap: assetsArray[2],
      earthSpecularMap: assetsArray[3],
      skyMap: assetsArray[4],
      cloudMap: assetsArray[5],
      cloudAlphaMap: assetsArray[6],
      lensflare1: assetsArray[7],
      lensflare2: assetsArray[8],
      map: assetsArray[9]
    };

    func(assets);
  });
};
