const getPos = (lat, lng, intensity) => {
  const GLOBE_RADIUS = 25 + intensity;
  var x = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180) * Math.cos((lng * Math.PI) / 180);
  var y = GLOBE_RADIUS * Math.cos((lat * Math.PI) / 180) * Math.sin((lng * Math.PI) / 180);
  var z = GLOBE_RADIUS * Math.sin((lat * Math.PI) / 180);
  return { x: x, y: y, z: z };
};

function dist(a, b) {
  const d = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2);
  return Math.sqrt(d);
}

const generateValues = (data) => {
  let posArray = [];
  let newData = [];
  data.forEach((item, index) => {
    const pos = getPos(item.lat, item.lng, 0);
    posArray.push(pos);
  });

  let min = Infinity,
    max = 0;
  data.forEach((item, index) => {
    let numOfPoints = 0;
    const currentPoint = posArray[index];
    posArray.forEach((otherPoint) => {
      if (dist(currentPoint, otherPoint) < 0.5) numOfPoints++;
    });

    newData.push({ ...item, value: numOfPoints });

    if (numOfPoints < min) min = numOfPoints;
    if (numOfPoints > max) max = numOfPoints;
  });

  return { data: newData, min, max };
};

onmessage = function (e) {
  const jsonData = JSON.parse(e.data);
  const modifiedData = generateValues(jsonData.data);
  postMessage(JSON.stringify({ data: modifiedData }));
};
