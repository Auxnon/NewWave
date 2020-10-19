import * as Render from "./Render.js";

var shapes;
var THREE;

function init(name, THREEi) {
	THREE=THREEi
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

    barGraph([70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14], scene);
    return scene;
}

function animate() {
    shapes.forEach(c => {
        c.rotation.x = Math.PI / 2
        c.rotation.y += 0.02;
    })
}

function deinit() {

}


function barGraph(data, scene) {
    /* let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
         cubeO.position.set(-40,0,0);
         shapesTwo.push(cubeO)
         scenes[1].add(cubeO);
         Render.specterMaterial.color=0xD53229;*/

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
        cube.position.set(-40 + i * factor, 0, 10)
        cube.scale.set(1, 1, scale)
        scene.add(cube)
    }
}

export { init, animate, deinit }