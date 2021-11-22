import * as THREE from 'three';
import { getPos } from './handleData';
import column_vs from '../../../glsl/column_vs.glsl'
import column_fs from '../../../glsl/column_fs.glsl'

let mesh;

export const buildColumns = (columnData) => {

    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            'uTime': { value: 0 },
            "s": { type: "f", value: -1.0 },
            "b": { type: "f", value: 1.0 },
            "p": { type: "f", value: 2.0 },
            glowColor: { type: "c", value: new THREE.Color(0x00ffff) }
        },
        vertexShader: column_vs,
        fragmentShader: column_fs,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
    })

    // const modifiedData = generateValues(data);
    // const min = modifiedData.min;
    // const max = modifiedData.max;

    const geo = new THREE.ConeGeometry(2, 30, 12);
    geo.rotateX(Math.PI / 2)

    mesh = new THREE.InstancedMesh(geo, shaderMat, columnData.data.length);

    const matrix = new THREE.Matrix4();
    // modifiedData.data.forEach((item, index) => {

    columnData.data.forEach((item, index) => {
        const threshold = 500;
        const height = -8 + (item.value > threshold ? threshold : item.value) / 100
        const pos = getPos(item.lat, item.lng, height);
        matrix.setPosition(pos.x, pos.y, pos.z)
        const up = new THREE.Vector3(pos.x, pos.y, pos.z);
        matrix.lookAt(up, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
        mesh.setMatrixAt(index, matrix);
        // const color = getColor(item.value, min, max)
        // mesh.setColorAt(index, color);
    })



    mesh.rotation.x = -Math.PI / 2;
    mesh.name = 'columns'
    var s = 0;

    mesh.userData.tick = () => {
        if (s < 1) {
            s += 1 / 120
            mesh.scale.set(s, s, s)
        }
        shaderMat.uniforms.uTime.value += 1.0 / 60.0;
    }

    return mesh;
}


// export const updateColumn = (modifiedData) => {
//     console.log(modifiedData)
//     const matrix = new THREE.Matrix4();
//     modifiedData.data.forEach((item, index) => {
//         const threshold = 500;
//         const height = -8 + (item.value > threshold ? threshold : item.value) / 100
//         const pos = getPos(item.lat, item.lng, height);
//         matrix.setPosition(pos.x, pos.y, pos.z)
//         const up = new THREE.Vector3(pos.x, pos.y, pos.z);
//         matrix.lookAt(up, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
//         mesh.setMatrixAt(index, matrix);
//     })
//     mesh.instanceMatrix.needsUpdate = true;
// }