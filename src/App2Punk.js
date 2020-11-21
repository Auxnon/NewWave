import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

var skull;
var aniFactor = 0;
const speed=20
var dir = speed;

var group
function init(index,dom, complete) {
    let scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    var sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(0, 1, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
    var sunTarget = new THREE.Object3D();
    sunTarget.position.set(-20, 0, -20);
    scene.add(sunTarget);
    sunLight.target = sunTarget;


    Render.loadModel('assets/skull.glb', function(m) {
        skull = m;
        m.position.set(0, 160, 70)
        m.scale.set(6, 6, 6)
        m.rotation.y = -Math.PI / 2 //pi2 to pi
        scene.add(m);
        complete();
        window.skull=skull
    })
    group= new THREE.Group();

    let mats=[new THREE.MeshStandardMaterial({ color: 0x6E2E6F }),new THREE.MeshStandardMaterial({ color: 0x432E6F }),new THREE.MeshStandardMaterial({ color: 0x142A7D })]
    for(let j=0;j<5;j++){
      if(j!=2)
        for(let i=0;i<16;i++){
          let high=20+Math.random()*68
          let cube = new THREE.Mesh(new THREE.BoxBufferGeometry(26, 26, high),mats[Math.floor(Math.random()*3)]);
          cube.position.set((j-2)*40,-60+i*40,-20+high/2)
          group.add(cube)
        }
    }
    scene.add(group)
   
    //let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)
    //let cube = new THREE.Mesh(geo, );
    return scene
}

function animate(delta) {
    if(skull) {
        aniFactor += dir*delta;
        if(aniFactor > 100) {
            dir = -speed
            aniFactor = 100
        } else if(aniFactor < 0) {
            dir = speed
            aniFactor = 0
        }
        skull.children[1].rotation.z=-0.6*(aniFactor%10)/10.0

        skull.rotation.y = Math.PI + (Math.PI * aniFactor / 100.0)
        skull.rotation.z = (-Math.PI / 8) * (50 - Math.abs(aniFactor - 50)) / 50

        group.rotation.x=-Math.PI/8 +(aniFactor/100.0)*Math.PI/16
    }

}

function deinit() {

}




export { init, animate, deinit }