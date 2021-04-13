import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

//called at first run, plugs in all the goods
let group
let plane;
let targetNode;
let sunLight
const SHADOW_SIZE = 2048;

let xMatrix,zMatrix;


function init(index, dom, complete) {
    zMatrix = new THREE.Quaternion(),xMatrix = new THREE.Quaternion();;
    xMatrix.setFromAxisAngle( new THREE.Vector3( 1,0,0 ),Math.PI/2);
    let scene = new THREE.Scene();
    group = new THREE.Group();
    let geom = new THREE.BoxBufferGeometry(10, 10, 1);
    let mat = new THREE.MeshStandardMaterial({ color: 0xFFCD00});//, side: THREE.BackSide });
    let room = new THREE.Mesh(geom, mat)
    room.position.z=-4
    room.recieveShadow=true;
    group.add(room)
    group.scale.set(10, 10, 10)
    group.position.z = 20;

    let ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(0, 0, 100);
    sunLight.castShadow = true;
    //sunLight.castShadow = true;
    let sunTarget = new THREE.Object3D();
    sunTarget.position.set(200, 0, 20);



    let seat = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x78725B }))
    seat.position.set(0, 0, -2)
    seat.castShadow=true;
    targetNode=seat
    group.add(seat)


    //sunLight.target = seat;
    scene.add(sunLight.target);
    window.sunLight=sunLight




    window.sunTarget=sunTarget


    sunLight.shadow.mapSize.width = SHADOW_SIZE; // default
    sunLight.shadow.mapSize.height = SHADOW_SIZE; // default
    sunLight.shadow.camera.near = 1; // default
    sunLight.shadow.camera.far = 100;   
    // default

    let d1=75;
    sunLight.shadow.camera.left = -d1;
    sunLight.shadow.camera.right = d1;
    sunLight.shadow.camera.top = d1;
    sunLight.shadow.camera.bottom = -d1;
    

    sunLight.shadow.radius = 2.2; //2.2;
    sunLight.shadow.bias = -.0005;

    

    scene.add(ambientLight)
    scene.add(sunLight)
    let debugLightHelper = new THREE.CameraHelper(sunLight.shadow.camera);
    scene.add(debugLightHelper)
    debugLightHelper.update();
    window.debugLightHelper=debugLightHelper
    /*
        let pillar = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 6), new THREE.MeshStandardMaterial({ color: 0xFF274B }))
        pillar.position.set(0, 5, 0)
        group.add(pillar);
    */
    

    let texture = new THREE.TextureLoader().load("assets/room/bitmap.png");
    texture.wrapS = THREE.RepeatWrapping;
    /*
        const uniforms = {
            texture1: { type: "t", value: texture }
        };

        const vertexShader = `
              void main() {
        gl_Position =   projectionMatrix * 
                        modelViewMatrix * 
                        vec4(position,1.0);
      }
          `;
        let fragmentShader = `
              uniform sampler2D texture1;
      const vec2  size = vec2(1024, 512);
      
      void main() {
        gl_FragColor = texture2D(texture1,gl_FragCoord.xy/size.xy); 
      }
          `

        const myMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });*/



    let doubleMat = new THREE.MeshBasicMaterial({ color: 0xFFCD00, side: THREE.DoubleSide, map: texture, transparent: true });
    let planeGeo = new THREE.PlaneGeometry(2, 3)
    planeGeo.faceVertexUvs[0].forEach(ar => {
        ar.forEach(v => {
            if (v.x == 1)
                v.x = 0.2;
        })
    })
    plane = new THREE.Mesh(planeGeo, doubleMat)
    plane.position.set(0, -3, -.25)
    plane.rotation.set(TAU / 4, 0, 0)
    group.add(plane)


    Render.loadModel('assets/room/couch.glb', m => {
        //=.children[0]
        m.position.set(0, -3, -2.5)
        m.rotation.set(0, 0, TAU / 2)
        m.material= new THREE.MeshPhongMaterial({ color: 0xFF274B });
        m.castShadow=true;
        m.recieveShadow = true;
        
        group.add(m)
    })

    Render.loadModel('assets/room/tv.glb', m => {
        //=.children[0]
        m.position.set(0, 4, -2.5)
        //m.rotation.set(0,0,TAU/2)
        //window.m=m;
        m.castShadow=true;
        m.recieveShadow = true;
        group.add(m)

    })

    scene.add(group)
    dom.style.stroke = 'none'
    let svg = convertSVG(null, dom);
    complete();
    return scene;

}

let iterate = 0
let timer = 0;
let offsets = [0, 0.2, 0.4, 0.6, 0.8, -0.8, -0.6, -0.4]
let current = 0;

function animate(delta) {
    group.rotation.z += delta / 1.0;
    if(group.rotation.z>Math.PI)
        group.rotation.z=-Math.PI

    let pos=Main.getPos()
    sunLight.target.position.set(pos.x*100-50,pos.y*10-5,0);
    targetNode.position.set(pos.x*10-5,pos.y*10-5,-2);

    
    zMatrix.setFromAxisAngle( new THREE.Vector3( 0,0,1 ),-group.rotation.z );
    zMatrix.multiply(xMatrix)
    //console.log(zMatrix)
    //plane.lookAt(Render.getCamera().position);
    plane.quaternion.copy(zMatrix)
    //plane.rotation.x=TAU/4
    //plane.rotation.y=0;
    let degree = (TAU / offsets.length) / 2
    let z = group.rotation.z;

    //z=(z > 0 ? z : (TAU + z))+degree
    let dir = z > 0



    z = Math.abs(z) / Math.PI;

    let offset = 0

    if (z < .125)
        offset = 0.8 // 0
    else if (z < 0.375)
        offset = .6 //.25
    else if (z < 0.625)
        offset = .4 //.5
    else if (z < 0.875)
        offset = .2
    /*  
    } else {
        if (z < .125)
            offset = 0.8 // 0
        else if (z < 0.375)
            offset = .6 //.25
        else if (z < 0.625)
            offset = .4 //.5
        else if (z < 0.875)
            offset = 0
         else
            offset = 0.2

    }
*/


    /* let angle=Math.round((offsets.length-1)*( z/TAU))
     if(angle>7)
         angle-=7*/


    //console.log(z,angle)
    //if (offset != current) {
    let texture = plane.material.map
    // window.texture = texture

    //texture.center.set(1, .5);
    //texture.repeat.set(dir ? 1 : -1, 1);
    plane.scale.set(dir ? 1 : -1, 1, 1)

    //texture.repeat.x = dir ? 1 : -1;

    //console.log(dir?'+++':'---',z, offset)
    /*
    iterate++;
    if(iterate>=offsets.length)
        iterate=0
    let offset=offsets[Math.abs(angle)]
    if(offset<0)
        texture.repeat.x = - 1;
    else
        texture.repeat.x = 1;*/

    texture.offset.x = offset

    current = offset
    //}

}

//unused for now, would deload everything for memory reasons
function deinit() {

}

//called when toggled to this app, on a page load with app ideally it would run init and immediately run open after
//also passes in the canvas in case the app wants to do something wacky with it like resize it or place it somewhere else
//return true if changes were made and it wont follow the default
function open(canvas) {

}
//called when app is closed out for another one
function close() {

}

function convertSVG(ele, dom) {
    /*let {width,height}=ele.getBBox();
    let svg=ele.cloneNode(true);
    let blob=new Blob([svg.outerHTML],{type: 'image/svg+xml;charset=utf-8'});
    let url=;//window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);*/
    let width = 64,
        height = 64;
    let image = new Image();
    image.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext('2d');
        canvas.style.position = 'absolute',
            canvas.style.left = 0
        canvas.style.top = 0;
        canvas.style.transform = 'scale(10,10)'
        context.drawImage(image, 0, 0, width, height);
        dom.appendChild(canvas)

    }
    fetch('assets/room/check.svg')
        .then(response => response.text())
        .then(svgString => {
            //let outty=dom.insertAdjacentHTML("afterbegin", svg)
            const fragment = document.createRange().createContextualFragment(svgString);
            let svg = fragment.children[0]
            topper(svg)
            svgProcess(svg)
            dom.appendChild(svg)
            //document.getElementById('parent').appendChild(fragment);
/*

            let { w, h } = svg.getBBox();
            width = w;
            height = h;
            let svg2 = fragment.cloneNode(true);
            let blob = new Blob([svg2.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
            let url = window.URL || window.webkitURL || window;
            let blobURL = URL.createObjectURL(blob);
            image.src = blobURL;

*/
        });
    /*

        image.src='assets/room/check.svg';//blobURL;
        dom.appendChild(image)*/
}


function topper(ele){
    ele.style.position = 'absolute',
        ele.style.left = 0
        ele.style.top = 0;
}



function svgProcess(svg){
    let og=[];
    let paths=svg.querySelectorAll("path");
    svgShake(paths,og)
}


    function svgShake(paths,og){ //DEV FIX this function is ugly as sin / inefficient
        if(paths.length){
            for(let k=0;k<paths.length;k++){
                let path=paths[k];
                
                let d;
                if(!og[k]){
                    d=path.getAttribute('d');
                    og[k]=d;
                }else{
                    d=og[k];
                }
                console.log('before '+d)
                

                let ns=""
                let points=chunkPath(d);
                for(let i=0;i<points.length-1;i+=2){
                    let letter=points[i];
                    ns+=letter;
                    letter=letter.toUpperCase();
                    if(letter=="M" || letter=="L" || letter=="C" || letter=="S"){
                        let s=points[i+1].trim();
                        //let params=s.split(" ");
                        let params=s.split(/(?=-)| /ig);
                        /*if(selectedPath){
                            let selector=$("<div class='selector'/>");
                            selector.css({left:xy[0]+"px",top:xy[1]+"px"});
                            selector.attr("id","S"+i);
                        //let circle=$("<circle cx="+xy[0]+" cy="+xy[1]+" r=4 fill=cyan />");
                            selectorArea.append(selector);
                        //overlay.append(circle);
                            selector.on("mousedown",dragPoint).on("touchstart",dragPoint);
                        }*/

                        for(let j=0;j<params.length;j++){
                            let val=parseFloat(params[j]);
                            val+=((Math.floor(100*Math.random())/100) - 0.5)*1.5;
                            ns+=val+" ";
                        }
                    }else if( letter=="V" || letter=="H"){
                        //registerPoint(parseInt(xy[0]),parseInt(xy[1]),id,i);
                        let s=points[i+1].trim();
                        let val=parseFloat(s);
                            val+=((Math.floor(100*Math.random())/100) - 0.5)*1.5;
                            ns+=val+" ";
                    }else if(letter=="A"){
                        let s=points[i+1].trim();
                        let params=s.split(/(?=-)| /ig);
                        if(params.length<7){
                            if(params.length<6){
                                let p=params[3][0];
                                let p2=params[3][1];
                                params.splice(3,0,p);
                                params.splice(4,0,p2);
                            }else{
                                 let p=params[3][0];
                                 params.splice(3,0,p);
                            }
                        }
                        //let val=parseFloat(s);
                        for(let j=0;j<params.length;j++){
                            if(j!=3 || j!=4){ //avoid modifying the flags
                                let val=parseFloat(params[j]);
                                val+=((Math.floor(100*Math.random())/100) - 0.5)*1.5;
                                ns+=val+" ";
                            }else{
                                 ns+=params[j]+" ";
                            }
                        }

                    }else if(letter=="Z"){

                    }
                }
                console.log('after' + ns)
                //path.setAttribute('d',ns);

            }
        }

    }
    function chunkPath(path){
        let array=path.split(/([MLZCHVSA])/ig);
        array.shift();
        return array;
    }

export { init, animate, deinit, open, close }