import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";
import * as Helper from "./Helper.js";

let shapes;
let groupMove;
let groupPivot;

let barGroups = [];





function init(index, dom, complete) {
    initStyle();
    let section=document.createElement('div')
    section.className='data-section'
    let input=document.createElement('textarea')
    let button=document.createElement('button')
    input.value= "70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14";

    button.innerText="Make Graph"
    button.addEventListener('click',ev=>{

        let array=input.value.split(',')
        if(array && array.length>0)
            barGraph(array,groupMove)
    })

    let normalize=document.createElement('input')
    normalize.setAttribute('type','checkbox');
    let scaleBox=document.createElement('input')
    scaleBox.setAttribute('type','text');

    section.appendChild(input)
    section.appendChild(normalize)
    section.appendChild(scaleBox)
    section.appendChild(button)
    dom.appendChild(section)

    let scene = new THREE.Scene();
    groupMove = new THREE.Group();
    groupPivot = new THREE.Group();
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

    shapes = [];
    /*let cubeGeometry = new THREE.BoxBufferGeometry(20, 20, 40);
    let cubeMaterial = Render.specterMaterial; //new THREE.MeshBasicMaterial( { color:0xD53229 } )

    let cubeO = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeO.position.set(-40, 0, 0);
    shapes.push(cubeO);
    groupMove.add(cubeO);*/
    Render.specterMaterial.color = 0xD53229;
    let pyramid1 = new THREE.Mesh(new THREE.ConeGeometry(20, 20, 4), new THREE.MeshStandardMaterial({ color: 0x6A00FE }));
    pyramid1.position.set(-50, 0, 0);
    shapes.push(pyramid1)
    groupPivot.add(pyramid1);

    let pyramid2 = new THREE.Mesh(new THREE.ConeGeometry(20, 20, 4), new THREE.MeshStandardMaterial({ color: 0xD53229 }));
    pyramid2.position.set(50, 0, 0);
    shapes.push(pyramid2)
    groupPivot.add(pyramid2);

    barGraph([70.114, 69.14, 69.14, 68.653, 68.653, 69.14, 68.653, 69.627, 69.627, 68.653, 69.627, 69.14, 69.14, 68.653, 70.114, 69.14, 69.14, 69.14, 68.653, 69.14], groupMove);
    groupPivot.add(groupMove)
    scene.add(groupPivot)
    //barGraph([Math.log(2),Math.log(4),Math.log(6),Math.log(8),Math.log(10),Math.log(12),Math.log(14)],scene,new THREE.Vector3(0,40,0))
    complete();

    return scene;
}

function animate(delta) {

    shapes.forEach(c => {
        c.rotation.x = Math.PI / 2
        c.rotation.y += delta * 2;
    })
    let pos = Main.getPos();
    let max=(barGroups.length)*40

    groupMove.position.y -= (pos.y-0.5)*8
    if (groupMove.position.y > -40) {
        groupMove.position.y = -40;
    } else if (groupMove.position.y < -max) {
        groupMove.position.y = -max;
    }

    groupPivot.rotation.z = ((pos.x / 2.0) - 0.25) * TAU
    

}

function deinit() {

}


function barGraph(data, scene, offset) {
    /* let cubeO=new THREE.Mesh(cubeGeometry,cubeMaterial);
         cubeO.position.set(-40,0,0);
         shapesTwo.push(cubeO)
         scenes[1].add(cubeO);
         Render.specterMaterial.color=0xD53229;*/
    data=data.map(parseFloat) // cool
    let size=20;
    if (!offset)
        offset = new THREE.Vector3(0, 0, 0)

    let factor = 80 / data.length
    let geo = new THREE.BoxBufferGeometry(1, 1, 1) //factor / 2
    let lowColor = 0x6A00FE;
    let highColor = 0xD53229;
    let lowRGB = Helper.hexToRGB(lowColor)
    let highRGB = Helper.hexToRGB(highColor)
    let rDelta = highRGB[0] - lowRGB[0]
    let gDelta = highRGB[1] - lowRGB[1]
    let bDelta = highRGB[2] - lowRGB[2]

    let lowest = Math.min.apply(Math, data)
    let highest = Math.max.apply(Math, data)
    let valueDelta = highest - lowest;
    

    let barGroup = new THREE.Group();
    let cubeBase = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: lowColor }));
    let bottomHeight=size*lowest/highest
    cubeBase.scale.set(80, 1, bottomHeight);
    barGroup.add(cubeBase)

    for (let i = 0; i < data.length; i++) {
        let val = (data[i] - lowest) / highest;
        let scaleFactor = .01 + val * size
        let color = Helper.rgbToBinary(Math.floor(lowRGB[0] + rDelta * val), Math.floor(lowRGB[1] + gDelta * val), Math.floor(lowRGB[2] + bDelta * val))
        //console.log(scale)
        //if(i==0){
        let cube = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color }));
        cube.position.set(-40 + (i+0.5) * factor, 0, scaleFactor/2 +bottomHeight/2)
        cube.scale.set(factor, 1, scaleFactor)
        barGroup.add(cube)
        //}
    }
    barGroups.push(barGroup)
    if (barGroups.length > 10)
        scene.remove(barGroups.shift());
    barGroups.forEach((g, i) => {
        g.position.y = (barGroups.length-i) * 40
    })

    scene.add(barGroup)
}

function getHeat() {
    fetch('/temp/', { headers: { "Content-Type": "application/json; charset=utf-8" } })
        .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
        .then(response => {
            console.log(response.temps)

        })
}
function initStyle(){
    let styleDom=document.createElement('style')
    styleDom.innerHTML = `
        .data-section{
            position: absolute;
            top: 148px;
            left: 50%;
            transform: translate(-50%);
            width: 256px;
            height: auto;
            border-radius: 16px;
            background: #fff4;
            padding: 16px;
        }
        .data-section button{
            display: block;
            margin: 8px;
            position: relative;
            left: 50%;
            transform: translate(-50%);
            padding: 8px;
            border-radius: 4px;
        }
        
        .data-section textarea{
            width: 100%;
            box-sizing: border-box; 
            padding: 16px;
            resize: vertical;
            border: none;
            border-radius: 16px 16px 0 16px;
        }
        .data-section textarea:focus{
            box-shadow: 0 0 3px black;
            outline: none;
        }
        .data-section input[type=text]{
            width: 32px;
        }
        .data-section input[type=text]:before{
            content:'Scale';
        }
        

    `
    document.body.appendChild(styleDom)
}

export { init, animate, deinit }