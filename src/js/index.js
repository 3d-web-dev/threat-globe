import "../sass/styles.scss";
import $ from "jquery";
import Scene from "./Scene";
import { handleData } from "./components/columns/handleData";
import { generateValues } from "./components/columns/handleData";

const APP = window.APP || {};

const initApp = () => {
  window.APP = APP;

  const container = $("#container")[0];
  APP.Scene = new Scene(container);
};

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  initApp();
} else {
  document.addEventListener("DOMContentLoaded", initApp);
}

// var worker = new Worker("src/js/worker.js", { type: "module" });

// setTimeout(() => {
//   fetch("src/js/components/globe/server.json").then((data) => {
//     data.json().then((jsonData) => {
//       const jsonForSend = {
//         data: handleData(jsonData)
//       };
//       const data = JSON.stringify(jsonForSend);
//       worker.postMessage(data);
//     });
//   });
// }, 2000);

// worker.onmessage = function (e) {
//   const jsonData = JSON.parse(e.data);
//   APP.Scene.updateColumns(jsonData.data);
// };

fetch("./server.json").then((data) => {
  data.json().then((jsonData) => {
    const data = handleData(jsonData);
    APP.Scene.updateColumns(generateValues(data));
  });
});
