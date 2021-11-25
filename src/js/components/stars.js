import * as THREE from 'three'

const getRandomParticelPos = (particleCount) => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        arr[i] = (Math.random() - 0.5) * 4000;
        if (Math.abs(arr[i]) < 5000) arr[i] = arr[i] * 2;
    }
    return arr;
};

export const buildStars = (scene) => {
    const group = new THREE.Group();
    scene.add(group)

    const loader = new THREE.TextureLoader();

    // material
    const materials = [
        new THREE.PointsMaterial({
            size: 60,
            map: loader.load("src/img/images/star1.png"),
            transparent: true
            // color: "#ff0000"
        }),
        new THREE.PointsMaterial({
            size: 50,
            map: loader.load("src/img/images/star2.png"),
            transparent: true
            // color: "#0000ff"
        })
    ];

    let stars = [];

    for (var i = 0; i < 3; ++i) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(getRandomParticelPos(Math.floor(Math.random() * 20)), 3)
        );
        const star = new THREE.Points(
            geometry, materials[i % 2]
        )

        stars.push(star)
        group.add(star)
    }


    group.userData.tick = () => {
        stars.forEach(star => {
            star.rotation.x += Math.random() / 50;
        })
    }
    return group
}