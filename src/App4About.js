import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

let portrait;
let eye
let eyeTimer=0;

function init(index,dom,complete) {
	let scene=new THREE.Scene();
	var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    var sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(-1, -6, 10);
    scene.add(sunLight);
	Render.loadModel('assets/portrait.glb', function(m) {
        portrait = m;
        m.position.set(0, 0, 0)
        m.scale.set(20, 20, 20)

        //m.rotation.y = -Math.PI / 2 //pi2 to pi
        scene.add(m);
        portrait.children.forEach(c=>{
        	if(c.name=="Eye")
        		eye=c;
        })
        complete();

        window.portrait=portrait
    })
    // import( /* webpackChunkName: "App4About" */ './about.html').then(module=>{
    // 	console.log('here')
    // 	console.log(module)
    // })

    return scene;
}

function animate(delta){
	
	if(portrait){
		let pos=Main.getPos()
		portrait.rotation.y=(-.25+pos.x/2.0)*Math.PI
		portrait.rotation.x=(.375+pos.y/4.0)*Math.PI
		if(eye){
			eyeTimer++;
			if(eyeTimer>400 && eyeTimer<420){

				let v
				if(eyeTimer>410)
					v=(eyeTimer-410)/10
				else
					v=(1-(eyeTimer-400)/10)
				eye.scale.set(1,v,1)

			}else if(eyeTimer>=420)
				eyeTimer=0;
		}
	}
	

}

function deinit(){

}

export {init,animate,deinit}