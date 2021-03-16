import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";

let skull;
let aniFactor = 0;
const speed = 20
let dir = speed;

let group
let moveGroups;

function init(index, dom, complete) {
    let scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    let sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(0, 1, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
    let sunTarget = new THREE.Object3D();
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
        window.skull = skull
    })
    group = new THREE.Group();

    let mats = [new THREE.MeshStandardMaterial({ color: 0x6E2E6F }), new THREE.MeshStandardMaterial({ color: 0x432E6F }), new THREE.MeshStandardMaterial({ color: 0x142A7D })]
    moveGroups = []
    for (let j = 0; j < 5; j++) {


        if (j != 2)
            for (let i = 0; i < 20; i++) {
                if (!moveGroups[i]) {
                    moveGroups[i] = new THREE.Group();
                    moveGroups[i].position.y = -160 + i * 40
                    group.add(moveGroups[i])
                }

                let high = 20 + Math.random() * 68
                let cube = new THREE.Mesh(new THREE.BoxBufferGeometry(26, 26, high), mats[Math.floor(Math.random() * 3)]);
                cube.position.set((j - 2) * 40, 0, -20 + high / 2)
                moveGroups[i].add(cube)

            }
    }
    let road = new THREE.Mesh(new THREE.BoxBufferGeometry(44, 32 * 40, 0.2), new THREE.MeshStandardMaterial({ color: 0x791BC6 }));
    road.position.set(0, 16 * 40 - 200, -20)
    group.add(road)


    let sunMat = new THREE.MeshBasicMaterial({ color: 0xFF687C }); //0xFF687C
    let sunGroup = new THREE.Group();

    let circ = new THREE.Mesh(new THREE.CircleGeometry(128, 6, 0, Math.PI), sunMat);
    let p1 = new THREE.Mesh(new THREE.PlaneGeometry(256, 16), sunMat);
    let p2 = new THREE.Mesh(new THREE.PlaneGeometry(240, 16), sunMat);
    let p3 = new THREE.Mesh(new THREE.PlaneGeometry(210, 16), sunMat);
    let p4 = new THREE.Mesh(new THREE.PlaneGeometry(150, 16), sunMat);

    p1.position.set(0, -15, 0)
    p2.position.set(0, -30 - 8, 0)
    p3.position.set(0, -45 - 24, 0)
    p4.position.set(0, -60 - 40, 0)
    sunGroup.add(circ)
    sunGroup.add(p1)
    sunGroup.add(p2)
    sunGroup.add(p3)
    sunGroup.add(p4)

    sunGroup.rotation.x = Math.PI / 2
    sunGroup.position.set(0, 64 * 40, 256)


    group.add(sunGroup)

    //let circle= new THREE.Mesh(new THREE.BoxBufferGeometry(44, 64*40, 0.2),);

    //let geo = new THREE.BoxBufferGeometry(factor / 2, 10, 15)
    //let cube = new THREE.Mesh(geo, );
    scene.add(group)
    return scene
}

function animate(delta) {
    if (skull) {
        aniFactor += dir * delta;
        if (aniFactor > 100) {
            dir = -speed
            aniFactor = 100
        } else if (aniFactor < 0) {
            dir = speed
            aniFactor = 0
        }
        skull.children[1].rotation.z = -0.6 * (aniFactor % 10) / 10.0

        skull.rotation.y = Math.PI + (Math.PI * aniFactor / 100.0)
        skull.rotation.z = (-Math.PI / 8) * (50 - Math.abs(aniFactor - 50)) / 50

        let pos = Main.getPos()
        group.position.x = pos.x * 32 - 16
        group.position.z = -(1 - pos.y) * 20

        group.rotation.x = -Math.PI / 6 + (aniFactor / 100.0) * Math.PI / 16
        moveGroups.forEach(move => {
            move.position.y -= 2+(1-pos.y)*16;
            if (move.position.y < -200)
                move.position.y = -60 + moveGroups.length * 32
        })
    }
}

function deinit() {

}




export { init, animate, deinit }