import * as THREE from 'three'

let labels = [];

export function handleData(data) {
    var newData = [];
    labels = [];
    Object.keys(data).forEach(key => {
        data[key].forEach(dot => {
            newData.push(dot);
            labels.push(key);
        })
    })


    return newData;
}


export function getLabels() {
    return labels;
}


export function generateValues(data) {
    let posArray = [];
    let newData = [];
    data.forEach((item, index) => {
        const pos = getPos(item.lat, item.lng, 0)
        posArray.push(pos)
    })

    let min = Infinity, max = 0
    data.forEach((item, index) => {
        let numOfPoints = 0;
        const currentPoint = posArray[index]
        posArray.forEach(otherPoint => {
            if (currentPoint.distanceTo(otherPoint) < 0.5)
                numOfPoints++;
        })

        newData.push({ ...item, value: numOfPoints })

        if (numOfPoints < min) min = numOfPoints;
        if (numOfPoints > max) max = numOfPoints;
    })

    return { data: newData, min, max }
}



export function getPos(lat, lng, intensity) {

    const GLOBE_RADIUS = 25 + intensity;
    var x = GLOBE_RADIUS * Math.cos(lat * Math.PI / 180) * Math.cos(lng * Math.PI / 180);
    var y = GLOBE_RADIUS * Math.cos(lat * Math.PI / 180) * Math.sin(lng * Math.PI / 180);
    var z = GLOBE_RADIUS * Math.sin(lat * Math.PI / 180);
    return new THREE.Vector3(x, y, z);
}





export function getColor(intensity, min, max) {

    let r = Math.floor((intensity - min) / (max - min) * 255)
    let b = Math.floor((max - intensity) / (max - min) * 255)
    const str = `rgb(${r},0,${b})`
    return new THREE.Color(str)
}