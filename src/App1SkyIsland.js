import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";

let greenModel;

function init(index, dom, complete) {

    let scene = new THREE.Scene();

    Render.loadModel('assets/island.glb', function(m) {
        greenModel = m;
        greenModel.position.set(0, 260, -40)
        greenModel.scale.set(10, 10, 10)
        scene.add(greenModel);
        complete();
    })
    /*
        Render.loadModel('assets/tree.gltf',function(m){
           //m.scale.set(10,10,10)
           // m.position.set(0,160,-40)
           greenModel.add(m);
        })*/
    {
        var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(ambientLight);
        var sunLight = new THREE.DirectionalLight(0xffffff, 1); //DirectionalLight
        sunLight.position.set(100, 100, 200);
        window.sunLight=sunLight
        window.Main=Main
        sunLight.castShadow = true;
        scene.add(sunLight);
        var sunTarget = new THREE.Object3D();
        sunTarget.position.set(-20, 0, -20);
        scene.add(sunTarget);
        sunLight.target = sunTarget;
    }


    console.log(index + ' loaded')
    return scene;
}

var value = 0;
var dir = 1;

function animate(delta) {
    if (greenModel) {
        value += 0.05 * dir * delta
        if (value > 1 || value < 0) {
            dir = -dir
        }
        greenModel.rotation.y = 5.4 + value * 0.6 //5.2 - 6
        //m.position.set(0,260,-40)
        let pos = Main.getPos();
        greenModel.position.set(30 - 30 * value + (pos.x - 0.2) * 30, -80 + 340 * value, 20 - 60 * value + (pos.y - 0.5) * -30)
        // x: 30, y: -80, z: 20
        //console.log(greenModel.rotation.y)
    }
}

function deinit() {

}

export { init, animate, deinit }