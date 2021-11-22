import * as THREE from "three";

const GLOBE_RADIUS = 25;

const getPixel = (img) => {
  var pixels = [];

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const image_data = ctx.getImageData(0, 0, 400, 200);

  const step = 1.2; // angle segment

  for (var lat = -90; lat < 90; lat += step) {
    for (var lng = -180; lng < 180; lng += step) {
      const row = 400 - Math.floor((lng * 400) / 360 + 200);
      const col = Math.floor((lat * 200) / 180 + 100);
      if (image_data.data[1600 * col + row * 4 + 3] > 90) {
        const x = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180) * Math.cos((lng * Math.PI) / 180);
        const y = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180) * Math.sin((lng * Math.PI) / 180);
        const z = GLOBE_RADIUS * Math.sin((lat * Math.PI) / 180);
        pixels.push([x, y, z]);
      }
    }
  }
  return pixels;
};

export const buildSurfaceDots = (mapImage) => {
  const pixels = getPixel(mapImage);

  const geo = new THREE.CircleBufferGeometry(0.05, 8);

  const mat = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true });
  const mesh = new THREE.InstancedMesh(geo, mat, pixels.length);
  const matrix = new THREE.Matrix4();

  for (let i = 0; i < pixels.length; i++) {
    matrix.setPosition(pixels[i][0], pixels[i][1], pixels[i][2]);
    var up = new THREE.Vector3(pixels[i][0], pixels[i][1], pixels[i][2]);
    matrix.lookAt(up, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0));
    mesh.setMatrixAt(i, matrix);
  }

  mesh.lookAt(new THREE.Vector3(0, 0, 0));
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  mesh.rotation.x = Math.PI / 2;

  return mesh;
};
