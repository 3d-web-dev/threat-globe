import * as THREE from 'three';
import $ from 'jquery';
import gsap from 'gsap';
import { getLabels } from './columns/handleData';

export const UIController = (scene, camera, orbit) => {

    const container = $('#container')[0];
    const raycaster = new THREE.Raycaster();
    let zoomOut = true;
    let zoomIn = true;
    let screenSaverAnimStarted = false;

    function detectColumn(event) {
        const mouse = new THREE.Vector2(
            ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1,
            - ((event.clientY - container.offsetTop) / container.clientHeight) * 2 + 1
        )
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            if (intersects[0].object.name === 'columns') {
                const labels = getLabels();
                console.log(labels[intersects[0].instanceId])
                $('#label-panel').html(labels[intersects[0].instanceId])
                $('#label-panel').css('left', event.clientX + 10 + 'px');
                $('#label-panel').css('top', event.clientY + 10 + 'px');;
                $('#label-panel').fadeIn()
            } else {
                $('#label-panel').fadeOut()
            }
        }
    }

    function startScreenSaver() {
        console.log('saver is started')
        camera.position.set(35, 70, -15)
        orbit.autoRotate = true;
        orbit.autoRotateSpeed = 1;
    }

    function stopScreenSaver() {
        console.log('saver is stopped')
        screenSaverAnimStarted = false;
        orbit.autoRotate = false;
        setTimeout(() => {
            camera.position.set(0, 0, 100)
        }, 500)
    }

    var timerForLabel;
    var timerForIdle;

    $('#container').on('pointermove', (event) => {
        if (screenSaverAnimStarted) stopScreenSaver()
        clearTimeout(timerForLabel)
        clearTimeout(timerForIdle)
        $('#label-panel').fadeOut()
        timerForLabel = setTimeout(() => {
            detectColumn(event)
        }, 500)

        timerForIdle = setTimeout(() => {
            screenSaverAnimStarted = true;
            startScreenSaver()
        }, 20000)
    })


    $('#zoom-in-btn').on('click', () => {
        if (zoomIn) {
            zoomOut = true;
            moveCamera({ delta: -10, duration: 0.5 })
        }
        clearTimeout(timerForLabel)
        clearTimeout(timerForIdle)
    })
    $('#zoom-out-btn').on('click', () => {
        zoomIn = true;
        if (zoomOut) {
            moveCamera({ delta: 10, duration: 0.5 })
        }
        clearTimeout(timerForLabel)
        clearTimeout(timerForIdle)
    })


    function moveCamera(param = { delta: 0, duration: 0 }) {
        const currentPos = camera.position;
        const D = currentPos.distanceTo(new THREE.Vector3(0, 0, 0))
        const newPos = new THREE.Vector3(
            currentPos.x * (D + param.delta) / D,
            currentPos.y * (D + param.delta) / D,
            currentPos.z * (D + param.delta) / D
        )

        gsap.to(camera.position, {
            duration: param.duration, x: newPos.x, y: newPos.y, z: newPos.z, onUpdate: () => {
                if (param.delta < 0 && D < 80) zoomIn = false;
                if (param.delta > 0 && D > 140) zoomOut = false;
            }
        })


    }

    window.camera = camera

}