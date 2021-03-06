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
     //import( /* webpackChunkName: "App4About" */ './about.html').then(module=>{
    // 	console.log('here')
    // 	console.log(module)
   // })
    //require('html-loader!./about.html');

    fetch('/about').then(function (response) {
		return response.text();
	}).then(function (html) {
		// This is the HTML from our response as a text string
		
		dom.innerHTML+=html
		initAbout(dom)
		//console.log(html);
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});

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

function open(){
	console.log('opened')
}
function close(){

}





let mainDom
let main;
let overlay;
let resizeTimer;
let px = 0;
let moveTarget;
let currentSection
let clickerOverlay;

function initAbout(dom) {
    main = dom.querySelector('main')
    let underlay = main.querySelector('.portfolio-underlay')
    overlay = main.querySelector('.portfolio-overlay')
    clickerOverlay = main.querySelector('.portfolio-clicker')

    main.querySelectorAll('section').forEach((section, i) => {
        let holder = document.createElement('div')
        holder.className = 'section-holder'
        holder.id = 'portfolio-section-holder' + i;
        section.id = 'portfolio-section' + i;
        underlay.appendChild(holder)
        section.tabIndex = i
        //holder.appendChild(section)

        section.className = 'shrink'
        //section.remove();

        section.addEventListener("focus", ev => {
            selectSection(ev.target)
        });

        section.addEventListener('click', ev => {
            selectSection(section)

        })
        clickerOverlay.addEventListener('click', ev => {
            closeAll();
        })
        /*
        section.addEventListener('pointerdown',ev=>{
        	moveTarget=section
        	px=ev.clientX
        })
        window.addEventListener('pointerup',ev=>{
        	//if(moveTarget)

        	moveTarget=null;

        })

        section.addEventListener('pointermove',ev=>{
        	if(moveTarget && moveTarget==section){
        		let x=ev.clientX

        		let vx=x-px;
        		console.log(vx)
        		px=x;
        		if(Math.abs(vx)>20)
        			closeAll();
        	}
        })*/

        /*
        //maybe this isnt a good idea after all
        section.addEventListener('scroll', ev=>{
            let element = event.target;
            if (element.scrollHeight - element.scrollTop === element.clientHeight)
            {
                console.log('bottom');
                if(section.nextElementSibling==null)
                	selectSection( section.parentElement.firstElementChild)
                else
               		selectSection( section.nextElementSibling)
            }
        });*/



    })
    setTimeout(function() { fit() }, 1); //make sure DOM is done
    let portraitHolder = main.querySelector('.portrait-holder')
    let portfolioHolder=main.querySelector('.portfolio-section-block')
    portfolioHolder.addEventListener('scroll',ev=>{
    	if(ev.target.scrollTop>0){
    		portraitHolder.style.height='128px';
    		portraitHolder.style.transform='scale(0.5,0.5)'
            portfolioHolder.style.height='calc(100% - 128px)'
    	}else{
            portraitHolder.style.height=''
            portraitHolder.style.transform=''
            portfolioHolder.style.height=''
        }
    })
    window.addEventListener('keydown', ev => {
        /*if(ev.which==32)
        	fit();*/
        console.log(ev.which)

        if (currentSection) {
            if (ev.which == 27) {
                closeAll();
            } else if (ev.which == 37) { //left
                if (currentSection.previousElementSibling == null || currentSection.previousElementSibling == clickerOverlay)
                    selectSection(currentSection.parentElement.lastElementChild)
                else
                    selectSection(currentSection.previousElementSibling)
            } else if (ev.which == 39 || ev.which == 32) { //right
                if (currentSection.nextElementSibling == null)
                    selectSection(currentSection.parentElement.children[1])
                else
                    selectSection(currentSection.nextElementSibling)
            }
        } else if (ev.which == 27 || ev.which == 39 || ev.which == 32) {
            selectSection(main.querySelector('section'))
        }


    })
    window.addEventListener('resize', ev => {
        if (resizeTimer)
            clearTimeout(resizeTimer)
        resizeTimer = setTimeout(function() {
            unhideOverlay();
        }, 200)
        hideOverlay();
    })
}

function selectSection(section) {
    if (section) {
        main.querySelectorAll('section').forEach(s => {
            if (s.className != 'shrink') {
                s.className = 'shrink'
            }
        })

        section.className = ''
        section.style.left = '50%';
        let sHeight=section.parentElement.parentElement.scrollTop
        let height=section.parentElement.parentElement.offsetHeight
        section.style.top = ((height/2 +sHeight)) +'px';
        section.focus();
        fit();
        currentSection = section;
        clickerOverlay.classList.add('clicker-active');
    } else
        closeAll();

}

function fit() {
    let holders = main.querySelectorAll('.section-holder')
    main.querySelectorAll('section').forEach((section, i) => {
        section.scrollTo(0, 0)
        if (section.className == 'shrink') {
            let holder = holders[i]
            section.style.left = holder.offsetLeft + 'px';
            section.style.top = holder.offsetTop + 'px';
            section.style.zIndex = 0;
        } else
            section.style.zIndex = 3;
    });
    clickerOverlay.style.zIndex = 2;
}

function closeAll() {
    main.querySelectorAll('section').forEach(s => {
        if (s.className != 'shrink') {
            s.className = 'shrink'
        }
    })
    fit();
    currentSection = null;
    clickerOverlay.classList.remove('clicker-active');
}

function hideOverlay() {
    overlay.style.opacity = 0;

}

function unhideOverlay() {
    fit();
    overlay.style.opacity = 1;
}















export {init,animate,deinit}