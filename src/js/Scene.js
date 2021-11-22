import * as THREE from "three";
import $ from "jquery";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { buildEnvironment, loadAssets } from "./components/utils";
import { buildGlobe } from "./components/globe/globe";
import { buildStars } from "./components/stars";
import { UIController } from "./components/UIController";
import { buildColumns } from "./components/columns/buildColumns";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export default class Scene {
  constructor($container) {
    this.container = $container;
    this.columns = null;
    this.start();

    this.bindEvent();
  }

  bindEvent() {
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  start() {
    this.mainScene = new THREE.Scene();
    this.mainScene.background = new THREE.Color(0x112233);
    // this.mainScene.add(new THREE.AxesHelper(50));

    this.initCamera();
    this.initLights();

    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enablePan = false;
    this.orbit.enableZoom = false;
    this.orbit.enableDamping = true;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.mainScene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(this.container.clientWidth, this.container.clientHeight), 0.5, 0.4, 0.85));

    UIController(this.mainScene, this.camera, this.orbit);
    loadAssets((assets) => {
      buildEnvironment(this.mainScene, assets);
      this.stars = buildStars(this.mainScene);
      this.globe = buildGlobe(this.camera, assets);
      this.mainScene.add(this.globe);
      this.satellite_one = assets.satellite;
      this.satellite_one.scale.multiplyScalar(0.75);
      this.satellite_two = assets.satellite.clone();
      this.satellite_two.rotation.y = (2 * Math.PI) / 3;
      this.mainScene.add(this.satellite_one, this.satellite_two);
      gsap.to(this.camera.position, {
        duration: 3,
        x: 0,
        z: 100,
        ease: "bounce"
      });
      this.update();
      $("#loader").fadeOut();
    });
  }

  initCamera() {
    const fov = 45;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 20000);
    this.camera.position.set(-50, 0, 50);
  }

  initLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 3, 5);
    this.mainScene.add(ambientlight, dirLight);
  }

  onResize() {
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H);
    this.composer.setSize(W, H);
  }

  update() {
    if (this.columns) this.columns.userData.tick();
    this.globe.userData.tick();
    this.satellite_one.rotation.y += 1 / 100;
    this.satellite_two.rotation.y += 1 / 100;
    this.stars.userData.tick();
    this.orbit.update();
    // this.renderer.render(this.mainScene, this.camera)
    this.composer.render();
    requestAnimationFrame(this.update.bind(this));
  }

  updateColumns(data) {
    if (this.columns) {
      this.columns.dispose();
      this.mainScene.remove(this.columns);
    }
    this.columns = buildColumns(data);
    this.mainScene.add(this.columns);
  }
}
