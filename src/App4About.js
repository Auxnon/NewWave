import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";
import * as Main from "./Main.js";
import * as UI from "./UI.js";
import './style/aboutStyle.css'

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

let portrait;
let eye
let eyeTimer = 0;


function init(index, dom, complete) {
    let scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(ambientLight);
    var sunLight = new THREE.DirectionalLight(0xffffff, 0.6); //DirectionalLight
    sunLight.position.set(-1, -6, 10);
    scene.add(sunLight);
    Render.loadModel('assets/portrait.glb', function(m) {
        portrait = m;
        m.position.set(0, 0, -170)
        m.scale.set(60, 60, 60)
        window.portrait = portrait
        window.Render = Render;
        window.Main = Main

        //m.rotation.y = -Math.PI / 2 //pi2 to pi
        scene.add(m);
        portrait.children.forEach(c => {
            if (c.name == "Eye")
                eye = c;
        })

        checkDone(complete)
    }, true)
    //import( /* webpackChunkName: "App4About" */ './about.html').then(module=>{
    //  console.log('here')
    //  console.log(module)
    // })
    //require('html-loader!./about.html');

    fetch('./partials/about.html').then(function(response) {
        return response.text();
    }).then(function(html) {
        // This is the HTML from our response as a text string

        dom.insertAdjacentHTML('beforeend', html)
        /*dom.addEventListener("DOMContentLoaded", function(){
            console.log('TEST7') //FIX
        })*/
        initAbout(dom)
        emailFixer(dom)
        checkDone(complete)
        //console.log(html);
    }).catch(function(err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });

    return scene;
}


function animate(delta) {
    if (portrait) {
        let pos = Main.getPos()
        portrait.rotation.y = (-.25 + pos.x / 2.0) * Math.PI
        portrait.rotation.x = (.375 + pos.y / 6.0) * Math.PI
        if (eye) {
            eyeTimer++;
            if (eyeTimer > 200 && eyeTimer < 220) {

                let v
                if (eyeTimer > 210)
                    v = (eyeTimer - 210) / 10
                else
                    v = (1 - (eyeTimer - 200) / 10)
                eye.scale.set(1, v, 1)

            } else if (eyeTimer >= 220)
                eyeTimer = 0;
        }
    }
}

function deinit() {

}

function open(canvas) {
    //main.querySelector()
    Main.shrinkTitle();

    //console.log('opened')
    //UI.systemMessage('test ' + window.innerWidth + '; screen ' + window.screen.width, 'success')
    if (main) {
        let holder = main.querySelector('.portrait-holder')
        canvas.custom = 256;
        holder.appendChild(canvas)
        Render.resize();
    }

    hideOverlay();
    setTimeout(function() {
        if (main) {
            main.style.display = 'initial';
            fit();
            void main.offsetWidth;
            main.style.opacity = 1;
            setTimeout(() => {
                unhideOverlay();
            }, 900);
        }
    }, 100);
    return true;
}

function checkDone(complete) {
    if (main && portrait)
        complete();
}

function close() {
    if (main) {
        hideOverlay();
        main.style.opacity = 0;
        setTimeout(function() {
            main.style.display = 'none'
        }, 200);
        let canvas = Render.getAlphaCanvas();
        delete canvas.custom
        Render.resize();
        closeAll();
    }

}

///==========non 3d page logic===========

let main;
let overlay;
let resizeTimer;
//let px = 0;
//let moveTarget;
let currentSection
let clickerOverlay;
let portfolioHolder;
let closeButton;
let holders = [];


function initAbout(dom) {
    main = dom.querySelector('main')
    let underlay = main.querySelector('.portfolio-underlay')
    overlay = main.querySelector('.portfolio-overlay')
    clickerOverlay = main.querySelector('.portfolio-clicker')



    main.querySelectorAll('section').forEach((section, i) => {
        let holder = document.createElement('div')
        holder.className = 'section-holder'
        holder.id = 'portfolio-section-holder' + i;
        holders.push(holder)
        section.id = 'portfolio-section' + i;
        underlay.insertBefore(holder, underlay.firstElementChild)
        section.tabIndex = i
        //holder.appendChild(section)
        section.holderId = i;

        section.className = 'shrink'
        //section.remove();

        section.addEventListener("focus", ev => {
            selectSection(ev.target)
        });

        section.addEventListener('click', ev => {
            selectSection(section)
        })
        let image = section.querySelector('image')
        if (image)
            image.addEventListener('load', loadListener)

        let video = section.querySelector('video')
        if (video)
            video.addEventListener('loadeddata', loadListener);


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
    clickerOverlay.addEventListener('click', closeAll)
    closeButton = main.querySelector('#closeButton')
    if (closeButton)
        closeButton.addEventListener('click', closeAll)

    let chatter = main.querySelector('.chat-link')
    if (chatter)
        chatter.addEventListener('click', ev => {
            Main.switchApp("chat") //chat id
        })



    setTimeout(function() { fit() }, 1); //make sure DOM is done
    let portraitHolder = main.querySelector('.portrait-holder')
    portfolioHolder = main.querySelector('.portfolio-section-block')
    portfolioHolder.addEventListener('scroll', ev => {
        if (ev.target.scrollTop > 0) {
            portraitHolder.style.height = '128px';
            portraitHolder.style.transform = 'translate(-50%) scale(0.5,0.5)'
            //portfolioHolder.style.height='calc(100% - 128px)'
        } else {
            portraitHolder.style.height = ''
            portraitHolder.style.transform = ''
            //portfolioHolder.style.height=''
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
            } else if (ev.which == 39) { //right //|| ev.which == 32
                if (currentSection.nextElementSibling == null)
                    selectSection(currentSection.parentElement.children[1])
                else
                    selectSection(currentSection.nextElementSibling)
            }
        } else if (ev.which == 27 || ev.which == 39) { //ev.which == 32
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
        shrinkAll();

        let vid = section.querySelector('video')
        if (vid)
            vid.play();

        portfolioHolder.style.overflowY = 'hidden'
        section.className = ''
        section.style.left = '50%';
        closeButton.style.display = 'block'
        section.addEventListener('scroll', sectionScrollChecker)
        let sHeight = section.parentElement.parentElement.scrollTop
        let height = window.innerHeight; //section.parentElement.parentElement.offsetHeight
        //UI.systemMessage('sheight'+sHeight+' height '+height,'warn')
        section.style.top = ((height / 2 + sHeight) - section.parentElement.offsetTop - 64) + 'px';
        section.focus();

        currentSection = section;
        clickerOverlay.classList.add('clicker-active')
        setTimeout(fit, 1)

    } else
        closeAll();

}

function fit() {

    main.querySelectorAll('section').forEach((section, i) => {

        fitSection(section);
    });
    clickerOverlay.style.zIndex = 2;
}

function fitSection(section) {
    section.scrollTo(0, 0)
    if (section.className == 'shrink') {
        let holder = holders[section.holderId]
        section.style.left = (holder.offsetLeft + 128 - section.offsetWidth / 2) + 'px';
        section.style.top = holder.offsetTop + 'px';
        section.style.zIndex = 0;
    } else
        section.style.zIndex = 3;
}

function loadListener(ev) {
    fitSection(ev.target.parentElement)
    if (ev.target["videoHeight"] == undefined)
        ev.target.removeEventListener('load', loadListener);
    else
        ev.target.removeEventListener('loadeddata', loadListener);
    console.log('late load')
}

function shrinkAll() {
    main.querySelectorAll('section').forEach(s => {
        if (s.className != 'shrink') {
            s.className = 'shrink'
            s.removeEventListener('scroll', sectionScrollChecker)
            let vid = s.querySelector('video')
            if (vid)
                vid.pause();
        }
    })
}

function closeAll() {
    shrinkAll()

    portfolioHolder.style.overflowY = ''
    currentSection = null;
    clickerOverlay.classList.remove('clicker-active');
    closeButton.style.display = ''
    setTimeout(fit, 1)
}

function hideOverlay() {
    overlay.style.opacity = 0;

}

function unhideOverlay() {
    fit();
    overlay.style.opacity = 1;
}

function emailFixer(dom) {
    let fixerInterval;

    let emailButton = dom.querySelector('.mail-link');

    function emailButtonOverride(ev) {
        const string = "CWa[Wleo6]cW_b$Yec"; //'Makeavoy@gmail.com'

        let array = string.split("");



        //if(ev.originalEvent !== undefined){
        UI.systemMessage('Fixing email (Anti-Spam)', 'success')

        let counter = 0;
        fixerInterval = setInterval(() => {
            let shiftedArray = array.map(function(val) {
                return String.fromCharCode(val.charCodeAt() + counter);
            });
            let newString = shiftedArray.join('');
            emailButton.innerText = newString; //''+Math.floor(Math.random()*Math.pow(10,18));
            counter++;
            if (counter > 10) {
                clearInterval(fixerInterval);
                emailButton.removeEventListener('click', emailButtonOverride);
                emailButton.href = "mailto:" + newString;
            }
        }, 200)

        //}
        ev.preventDefault();
        return false;
    }

    emailButton.addEventListener('click', emailButtonOverride)
}

function sectionScrollChecker(ev) {
    console.log('scroll' + ev.target.scrollTop)
}



export { init, animate, deinit, open, close }