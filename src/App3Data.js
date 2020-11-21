import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

var shapes;

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

    shapes = [];
    let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 40);
    let cubeMaterial = Render.specterMaterial; //new THREE.MeshBasicMaterial( { color:0xD53229 } )

    let cubeO = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeO.position.set(-40, 0, 0);
    shapes.push(cubeO)
    scene.add(cubeO);
    Render.specterMaterial.color = 0xD53229;
    var pyramid = new THREE.Mesh(new THREE.ConeGeometry(20, 20, 4), new THREE.MeshStandardMaterial({ color: 0xD53229 }));
    pyramid.position.set(40, 0, 0);
    shapes.push(pyramid)
    scene.add(pyramid);

    barGraph([70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14], scene,new THREE.Vector3(0,0,30));
    //barGraph([Math.log(2),Math.log(4),Math.log(6),Math.log(8),Math.log(10),Math.log(12),Math.log(14)],scene,new THREE.Vector3(0,40,0))
    complete();
    return scene;
}

function animate(delta) {
    shapes.forEach(c => {
        c.rotation.x = Math.PI / 2
        c.rotation.y += delta*2;
    })
}

function deinit() {

}


function barGraph(data, scene, offset) {
    /* let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
         cubeO.position.set(-40,0,0);
         shapesTwo.push(cubeO)
         scenes[1].add(cubeO);
         Render.specterMaterial.color=0xD53229;*/
         if(!offset)
         	offset=new THREE.Vector3(0,0,0)

    let factor = 80 / data.length
    let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)
    let s = 0xFFD631;
    let e = 0xD53229;



    for(let i = 0; i < data.length; i++) {
        let val = data[i]
        let scale = (72 - val) / 3
        let color = ((e - s) * scale) + s
        console.log(scale)

        let cube = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color }));
        cube.position.set(-40 + i * factor+offset.x, offset.y, scale*4 +offset.z+10)
        cube.scale.set(1, 1, scale)
        scene.add(cube)
    }
}

function getHeat(){
	fetch('/temp/', { headers: { "Content-Type": "application/json; charset=utf-8" }})
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
        console.log(response.temps)
        
    })
}

export { init, animate, deinit }