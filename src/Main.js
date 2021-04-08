import * as UI from "./UI.js";
import './style/mainStyle.css';

/*CSS classes used

#brightness
.brightness--dark
*/

var Render;

//We could have technically done imports as a variable input to the Render class import statement
//But webpack won't convert the chunk parameters correctly unless it's explicitly within an import statement
const SCENE_IMPORT = [
    undefined,
    i => { import( /* webpackChunkName: "App1SkyIsland" */ './App1SkyIsland').then(i) },
    i => { import( /* webpackChunkName: "App2Punk" */ './App2Punk').then(i) },
    i => { import( /* webpackChunkName: "App3Data" */ './App3Data').then(i) },
    i => { import( /* webpackChunkName: "App4About" */ './App4About').then(i) },
    i => { import( /* webpackChunkName: "App5Chat" */ './App5Chat').then(i) },
    undefined,
    i => { import( /* webpackChunkName: "App7Room" */ './App7Room').then(i) }
]

//for now we need all these filled with some kind of data, no undefineds
const HASHES = { "sky": 1, "punk": 2, "data": 3, "portfolio": 4, "chat": 5, "donate": 6, "room": 7 }

//doms
let apps;
let svg;
let path;
let bar;
let barBox;
let appHome;
let mainTitle;

let focused;
let barMove = false;
let barPos = 1;
let appPoints;
let moveFactor = 0;

let count = 0;
let tick = false;
let barLineFactor = 1;

let targetMove = undefined;
let targetPoint = { x: 0, y: 0 }

let mouseObj;
let points;

let pendingRenderId; //if not undefined, wait for Render to load and then apply the scene

let resizeDebouncer;
let positionalData = { x: 0, y: 0 }

let currentAppId = -1;
let appSortingMode = false;

//I DO THIS FOR THE GREATER GOOD
window.TAU = Math.PI * 2;

function init(argument) {
    window.UI = UI
    let preApps = document.querySelectorAll('.app');
    apps = [undefined]
    preApps.forEach(app => { //convert out of a nodelist to an array, it matters trust me
        let i = parseInt(app.id.replace('app', ''))
        apps[i] = (app)
    });

    apps.forEach((app, index) => {
        if (app) {
            app.style.top = Math.random() * window.innerWidth + 'px'
            app.style.left = Math.random() * window.innerHeight + 'px'
            app.offset = { x: 0, y: 0 };
            app.appId = index; //lets not parseInt constantly
            app.container = index > 5 ? 1 : 0;
            app.addEventListener('pointerdown', ev => { appSelect(app, ev); })
            app.addEventListener('dragstart', ev => { ev.preventDefault() })
            app.style.zIndex = index > 5 ? -1 : 1;
        }
    });

    window.addEventListener('pointerup', winMouseUp)
    path = document.querySelector('path')
    svg = document.querySelector('svg')
    mainTitle = document.querySelector('#main-title');
    mouseObj = { x: window.innerWidth / 2, y: -200 }

    window.addEventListener('resize', resize);
    initLine();
    window.addEventListener('pointermove', mousemove)
    window.addEventListener('pointerdown', mousemove)
    mainTitle.addEventListener('click', ev => {
        closeApp();
    })
    let sortButton = document.querySelector('button#app-sort-button');
    if (sortButton)
        sortButton.addEventListener('click', ev => {
            appSortingMode = !appSortingMode
            if (appSortingMode)
                ev.target.classList.add('sorting--enabled')
            else
                ev.target.classList.remove('sorting--enabled')

            barCalculate();
        });

    barInit();

    resize();
    animate();
    setInterval(() => { boundaryCheck() }, 10000)
    let brightness = document.querySelector('#brightness');
    brightness.addEventListener('click', ev => {
        if (brightness.classList.contains('brightness--dark')) {
            document.body.classList.add('dark-mode')
            //document.body.style.stroke = 'white';
            //mainTitle.style.border = 'white 5px solid';
            //mainTitle.style.stroke = 'white';
        } else {
            document.body.classList.remove('dark-mode')
            //document.body.style.stroke = 'black';
            //mainTitle.style.border = 'black 5px solid';
            //mainTitle.style.stroke = 'black';
        }
        brightness.classList.toggle('brightness--dark')
    })

    /*//old query method
    if(window.location.search.length) {
        let params = new URLSearchParams(window.location.search);
        let id = params.get('id');
        if(id && id.length) {
            openApp(parseInt(id))
        }
    }*/
    if (window.location.hash.length) {
        let st = window.location.hash.substring(1)
        let id = HASHES[st]
        if (id != undefined)
            openApp(id)
    }
    // button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    //     const print = module.default;

    //     print();
    //   });

    import( /* webpackChunkName: "Render" */ './Render').then(module => {
        Render = module;
        Render.init(SCENE_IMPORT, pendingRenderId); //if undefined it will just use 0, so we can directly input regardless
        console.log('3d Renderer loaded')
        if (pendingRenderId != undefined) {
            openAppApplyRender(pendingRenderId, apps[pendingRenderId])
        }
    });

    UI.init(document.body, 4);

}
init();

function openApp(id) {
    currentAppId = id;
    let app = apps[id];
    if (app) {
        app.classList.add('app-max')
        app.focused = true;
        app.style.zIndex = 0;
        if (Render) {
            openAppApplyRender(id, app)
        } else {
            pendingRenderId = id;
            pendApp(id);
        }
        focused = app;
    }
}

function openAppApplyRender(id, app) {
    //let d = Render.getAlphaCanvas();
    //d.style.opacity = 1;
    //d.remove();

    let afterImage = document.querySelector('#afterImage');

    afterImage.remove();


    //app.appendChild(d);

    if (focused) {
        focused.appendChild(afterImage);
        afterImage.style.opacity = 1;
        setTimeout(() => { afterImage.style.opacity = 0; }, 1);
    } else { //silly I know but it's just easier to keep the afterImage within the dom, even if in this logical case it's not used
        afterImage.style.opacity = 0;
        if (app == 1)
            apps[2].appendChild(afterImage);
        else
            apps[1].appendChild(afterImage);
    }
    Render.bufferPrint();
    Render.flipScene(id, app)
}

function closeApp(disableFade) {
    if (focused) {
        focused.classList.remove('app-max')
        if (focused.container == 1)
            focused.style.zIndex = -1;
        else
            focused.style.zIndex = 1;
        focused.focused = undefined; //wow why did i name this like this
        window.history.pushState({}, '', '/');
        if (Render) {
            Render.closeModule(); //the loaded script is loaded in the Render class, yucky but it handles all the lazy loading for models so it worked out

            if (!disableFade) {
                let d = Render.getAlphaCanvas();
                setTimeout(() => { d.style.opacity = 0; }, 1);
                d.style.opacity = 1;
            }
        }
    }
    mainTitle.classList.remove('shrink')

    currentAppId = 0;
}



function resize() {

    clearTimeout(resizeDebouncer);
    resizeDebouncer = setTimeout(function() {
        svg.setAttribute('width', window.innerWidth + "px")
        svg.setAttribute('height', window.innerHeight + "px")
        barAdjust();
        if (Render) {
            Render.resize();
        }
        //UI.systemMessage('inner ' + window.innerWidth + '; screen ' + window.screen.width, 'success')
    }, 250);


}

function rand() {
    return Math.random() * 100 - 50;
}

function initLine() {
    points = [];
    for (let i = 0; i < 10; i++) {
        points.push({ x: mouseObj.x, y: mouseObj.y });
    }
}



function barInit() {
    appHome = document.querySelector('#app-center')
    bar = document.querySelector('#bar')
    let barHandle = document.querySelector('#barHandle')
    barHandle.addEventListener('pointerdown', ev => {
        let xx = barBox.left //-(barBox.right-barBox.left)/2
        let yy = barBox.top //-(barBox.bottom-barBox.top)/2

        barMove = true; //{x:ev.clientX-xx,y:ev.clientY-yy};

        if (points.length < 10) { //rebuild are point array
            let startPoint = points[0];
            let array = Array(7).fill(startPoint);
            points = array.concat(points)
        }

        barLineFactor = 0;
    })
    barHandle.addEventListener('dragstart', ev => { ev.preventDefault() })
    /*barHandle.addEventListener('pointerup',ev=>{
        barMove=false;
    })*/

    appPoints = [];

    barHandle.style.transform = 'translate(-50%,-200%)';
    bar.style.left = '50%';
    bar.style.top = (window.innerHeight - 64) + 'px';

    barCalculate(true);
}

function barCalculate(notate) {

    //first determine  how many apps will be visably part of the app bar
    let count = 0;
    let appsInRow = [];
    let appsInHome = []
    let sideWays = barPos == 0 || barPos == 2;

    apps.forEach(app => {
        if (app) {
            if (app.container == 0) {
                appsInRow.push(app)
                count++;
            } else {
                appsInHome.push(app)
            }
        }
    })
    /* } else {
        count = apps.length;
        appsInRow = apps;
    }*/
    if (sideWays) {
        bar.style.height = (count > 0 ? count : 1) * 64 + 'px'
        bar.style.width = '64px'
    } else {
        bar.style.width = (count > 0 ? count : 1) * 64 + 'px'
        bar.style.height = '64px'
    }

    let barRect = bar.getBoundingClientRect();
    barBox = barRect
    let width = barRect.width;
    let height = barRect.height;

    let ratio;
    if (sideWays)
        ratio = height / (count);
    else
        ratio = width / (count);

    if (!notate) {
        if (sideWays)
            appsInRow.sort(function(a, b) {
                return parseInt(a.style.top) - parseInt(b.style.top);
            });
        else
            appsInRow.sort(function(a, b) {
                return parseInt(a.style.left) - parseInt(b.style.left);
            });
    }

    let relativeIndex = -1;
    appsInRow.forEach((app, relativeIndex) => {

        let i = app.appId;
        if (sideWays)
            appPoints[i] = { x: barRect.left + width / 2, y: 32 + barRect.top + (relativeIndex) * ratio };
        else
            appPoints[i] = { x: 32 + barRect.left + (relativeIndex) * ratio, y: barRect.top + height / 2 };


        if (targetMove && targetMove == app) //appsInRow[i])
            targetPoint = appPoints[i]

        if (notate) {
            app.spot = relativeIndex;
            appPoints[i].app = app; //appsInRow[i]
        }
        _moveEle(app, appPoints[i].x, appPoints[i].y) //appsInRow[i]

    })
    if (appSortingMode) {
        let homeRect = appHome.getBoundingClientRect();
        let rows = (appsInHome.length * (56 + 28) + 28) / homeRect.width;
        rows = Math.ceil(rows)
        let perRow = appsInHome.length / rows
        console.log('rows', rows)
        let homeRatio = (homeRect.width - 112) / (appsInHome.length - 1)
        appsInHome.forEach((app, relativeIndex) => {
            let i = app.appId;
            appPoints[i] = { x: 56 + homeRect.left + (relativeIndex) * homeRatio, y: homeRect.top + 56 };
            _moveEle(app, appPoints[i].x, appPoints[i].y)
        })
    }
        if (barLineFactor == -1) {
            let handle = barHandle.getBoundingClientRect();
            if (sideWays) {
                let xx = handle.left + handle.width / 2
                drawSimpleBarLine({ x: xx, y: handle.top }, { x: xx, y: handle.bottom })
            } else {
                let yy = handle.top + handle.height / 2
                drawSimpleBarLine({ x: handle.left, y: yy }, { x: handle.right, y: yy })
            }

        }
    
    if (Render)
        Render.adjustModule(barPos)
}

function animate() {
    if (barLineFactor > -1) {
        if (barLineFactor < 4) {
            if (barLineFactor) {
                let target = {};
                let rect = barHandle.getBoundingClientRect();
                let mid = { x: rect.width / 2, y: rect.height / 2 }

                if (barPos == 0 || barPos == 2) {
                    switch (barLineFactor) {
                        case 3:
                            target = { x: rect.left + mid.x, y: rect.top };
                            break;
                        case 2:
                            target = { x: rect.left + mid.x, y: rect.top + mid.y };
                            break;
                        default:
                            target = { x: rect.left + mid.x, y: rect.bottom }
                    }
                } else {
                    switch (barLineFactor) {
                        case 3:
                            target = { x: rect.left, y: rect.top + mid.y };
                            break;
                        case 2:
                            target = { x: rect.left + mid.x, y: rect.top + mid.y };
                            break;
                        default:
                            target = { x: rect.right, y: rect.top + mid.y }
                    }
                }

                let dx = mouseObj.x - target.x;
                let dy = mouseObj.y - target.y;
                let dr = Math.sqrt(dx * dx + dy * dy)
                mouseObj.x -= dx / 2
                mouseObj.y -= dy / 2
                if (dr < 1 && barLineFactor < 4)
                    barLineFactor++;
            }


            let diff = { x: mouseObj.x - points[0].x, y: mouseObj.y - points[0].y }
            let dr = Math.sqrt(diff.x * diff.x + diff.y * diff.y)

            if (dr > 40) {
                let nextVector;
                if (barLineFactor > 1) { //straight to next point
                    nextVector = { x: mouseObj.x, y: mouseObj.y };
                } else { //wiggle the line
                    nextVector = { x: mouseObj.x - (tick ? 1 : -1) * 20 * diff.y / dr, y: mouseObj.y + (tick ? 1 : -1) * 20 * diff.x / dr };
                }

                let dir = Math.abs(diff.x) > Math.abs(diff.y);
                let pos = dir ? diff.x > 0 : diff.y > 0
                tick = !tick

                drawBarLine(nextVector);
            }
        } else {
            if (barLineFactor % 5 == 1) {

                let target = points.shift();
                if (points.length <= 3) {
                    barLineFactor = -1;
                    barCalculate();
                } else {
                    drawBarLine(target)
                }

            }
            if (barLineFactor != -1)
                barLineFactor++;

        }
    }

    requestAnimationFrame(animate);
}

function drawBarLine(nextVector) {
    let st = "M" + mouseObj.x + " " + mouseObj.y;
    let last = { x: nextVector.x, y: nextVector.y };
    for (let i = 0; i < points.length; i++) {
        let halfy = (points[i].y - last.y) / 2
        let halfx = (points[i].x - last.x) / 2
        let midx = last.x + halfx;
        let midy = last.y + halfy;
        st += "Q" + last.x + " " + last.y + " " + midx + " " + midy //+points[i].x+" "+points[i].y

        let prev = { x: points[i].x, y: points[i].y };
        points[i] = { x: last.x, y: last.y };
        last = prev;
    }
    path.setAttribute('d', st)
}

function drawSimpleBarLine(one, two) {
    let st = "M" + one.x + ' ' + one.y + "L" + two.x + ' ' + two.y;
    path.setAttribute('d', st);
}

function mousemove(ev) {
    positionalData = { x: ev.clientX / window.innerWidth, y: ev.clientY / window.innerHeight }
    barMoveHandler(ev);
    if (targetMove) {
        moveFactor++;
        targetMove.pos = { x: ev.clientX + targetMove.offset.x, y: ev.clientY + targetMove.offset.y }

        if (ev.clientY > barBox.top && ev.clientY < barBox.bottom && ev.clientX > barBox.left && ev.clientX < barBox.right) {
            let point = targetPoint;
            let d = { x: point.x - targetMove.pos.x, y: point.y - targetMove.pos.y }
            targetMove.pos = { x: point.x - d.x / 3, y: point.y - d.y / 3 }
            if (targetMove.moving) { //called once per state change
                targetMove.moving = undefined;
                targetMove.container = 0;
                targetMove.style.zIndex = 1;
                barCalculate();
            }

        } else {
            if (!targetMove.moving) { //called once per state change
                targetMove.moving = true;
                targetMove.container = 1;
                targetMove.style.zIndex = -1;

                barCalculate()
            }

        }

        targetMove.style.left = targetMove.pos.x + 'px'
        targetMove.style.top = targetMove.pos.y + 'px'
    } else if (barLineFactor == 0) {
        if (count > 2) {
            count = 0;
            mouseObj = { x: ev.clientX, y: ev.clientY }
        }
        count++
    }
}

function barMoveHandler(ev) {
    if (barMove) {
        moveFactor++;
        let xx = ev.clientX;
        let yy = ev.clientY;
        let dx = xx - window.innerWidth / 2;
        let dy = yy - window.innerHeight / 2;
        let r = Math.atan2(dy, dx) / Math.PI;
        let ar = Math.abs(r)
        if (ar < 0.25) { //right
            if (barPos != 2) {
                barPos = 2;
                barAdjust()
            }
        } else if (ar < 0.75) { //top or bottom
            if (r < 0) { //top
                if (barPos != 3) {
                    barPos = 3;
                    barAdjust()
                }
            } else { //botttom
                if (barPos != 1) {
                    barPos = 1
                    barAdjust()
                }
            }
        } else { //left
            if (barPos != 0) {
                barPos = 0;
                barAdjust()
            }
        }

        /*
                        if(window.innerWidth>window.innerHeight){ //landscape
                            let half=(window.innerWidth - window.innerHeight)/2
                            if(xx<half){ //left
                                bar.style.transform='rotate(90deg)'
                                barHandle.style.transform='translate(-50%,-200%)'
                            }else if(xx>window.innerWidth-half){ //right
                                bar.style.transform='rotate(90deg)'
                                barHandle.style.transform='translate(-50%,100%)'
                            }else{
                                bar.style.transform='rotate(0deg)'
                                if(yy>window.innerHeight/2){
                                    barHandle.style.transform='translate(-50%,-200%)'
                                }else{
                                    barHandle.style.transform='translate(-50%,100%)'
                                }
                            }
                        }else{ //portrait
                            let half=(window.innerHeight - window.innerWidth)/2
                            if(yy<half){ //top
                                bar.style.transform='rotate(0deg)'
                                barHandle.style.transform='translate(-50%,-200%)'
                            }else if(yy>window.innerHeight-half){ //bottom
                                bar.style.transform='rotate(0deg)'
                                barHandle.style.transform='translate(-50%,100%)'
                            }else{
                                bar.style.transform='rotate(90deg)'
                                if(xx>window.innerWidth/2){
                                    barHandle.style.transform='translate(-50%,-200%)'
                                }else{
                                    barHandle.style.transform='translate(-50%,100%)'
                                }
                            }
                        }*/
    }
}

function barAdjust() {
    if (barPos == 2) { //right
        bar.style.left = window.innerWidth - 64 + 'px';
        bar.style.top = '50%'; //window.innerHeight/2;
        barCalculate();
        barHandle.style.transform = 'translate(-200%,-50%)'
        barHandle.style.width = '32px';
        barHandle.style.height = '80%';
        mainTitle.style.top = '8px';
    } else if (barPos == 3) { //top
        barHandle.style.transform = 'translate(-50%,100%)'
        bar.style.left = '50%';
        bar.style.top = '64px' //-196+window.innerWidth/2
        mainTitle.style.top = 'calc(100% - 120px)';
        barCalculate();
        barHandle.style.height = '32px';
        barHandle.style.width = '80%';
    } else if (barPos == 1) { //bottom
        barHandle.style.transform = 'translate(-50%,-200%)'
        bar.style.left = '50%';
        bar.style.top = (window.innerHeight - 64) + 'px'; //-196+window.innerWidth/2
        mainTitle.style.top = '8px';
        barCalculate();
        barHandle.style.height = '32px';
        barHandle.style.width = '80%';
    } else { //left
        barHandle.style.transform = 'translate(100%,-50%)'
        bar.style.left = '64px';
        bar.style.top = '50%'
        barCalculate();
        barHandle.style.width = '32px'
        barHandle.style.height = '80%'
        mainTitle.style.top = '8px';
    }
}
/*
function pointCheck(point,index){
    let d={x:point.x-targetMove.pos.x,y:point.y-targetMove.pos.y}
            let dr=Math.sqrt(d.x*d.x +d.y*d.y);


            if(dr<40){
                targetMove.pos={x:point.x-d.x/3,y:point.y-d.y/3}
                if(targetMove.moving){ //called once per state change
                    targetMove.moving=undefined
                    //targetMove.classList.remove('appMove')
                }
                if(point.app==targetMove){

                }else{ //switcheroo the app icons
                    //let oldPoint=appPoints[targetMove.spot];
                    let swapApp=point.app;
                    targetMove.spot=index;
                    apps.forEach(app=>{
                        if(app==targetMove){

                        }else{
                            if(app.pos.x>targetMove.pos.x){
                                _moveEle(app,64+app.pos.x,app.pos.y,true)
                            }else{
                                _moveEle(app,-64+app.pos.x,app.pos.y,true)
                            }
                        }

                    })


                }
            }else{
                if(!targetMove.moving){ //called once per state change
                    targetMove.moving=true;
                    //targetMove.classList.add('appMove')

                }
            }
}*/

function appSelect(app, ev) {
    if (!app.focused) {
        targetMove = app;

        app.pos = { x: parseInt(app.style.left), y: parseInt(app.style.top) }
        targetPoint = { x: app.pos.x, y: app.pos.y }
        //app.origin={x:app.pos.x,y:app.pos.y}
        app.offset = { x: app.pos.x - ev.clientX, y: app.pos.y - ev.clientY }
        app.classList.add('appMove')
        app.moving = undefined;

    }
}

function winMouseUp(ev) {
    if (barMove) {
        barMove = false;
        barLineFactor = 1;
        console.log(moveFactor)
        if (moveFactor < 10) {
            closeApp();
        }
    }

    if (targetMove) {
        targetMove.classList.remove('appMove')
        console.log(moveFactor)
        if (moveFactor < 10) {
            if (focused && focused == targetMove) {
                targetMove.classList.remove('app-max')
                targetMove.focused = undefined;
                focused = undefined;
                //targetMove.style.zIndex = 2;
                window.history.pushState({}, '', '/');

            } else {
                switchApp(targetMove.appId)
                //window.history.pushState({ appId: targetMove.appId }, targetMove.name, '?id=' + targetMove.appId + '&app=' + targetMove.id);
            }
        } else {
            barCalculate();

            console.log('fix bar also')
        }
    } else {
        barCalculate();
        console.log('fix bar')
    }
    targetMove = undefined;

    moveFactor = 0;

}

function boundaryCheck() {
    apps.forEach(app => {
        if (app && !app.focused) {
            let rect = app.getBoundingClientRect();

            let x = rect.left;
            let y = rect.top;
            let w2 = (rect.right - rect.left) / 2;
            let h2 = (rect.bottom - rect.top) / 2

            if (x < 0) {
                app.style.left = w2 + 'px'
            } else if (x > window.innerWidth - w2 * 2) {
                app.style.left = window.innerWidth - w2 + 'px'
            }
            if (y < 0) {
                app.style.top = h2 + 'px'
            } else if (y > window.innerHeight - h2 * 2) {
                app.style.top = window.innerHeight - h2 + 'px'
            }

        }

    })
}

function _moveEle(ele, x, y, bool) {
    if (!bool)
        ele.pos = { x: x, y: y }
    ele.style.left = x + 'px'
    ele.style.top = y + 'px'
}

function pendApp(id) {
    let app = apps[id]
    let cube = app.querySelector('cube')
    if (!cube) {
        cube = document.createElement('cube');
        app.appendChild(cube);
    }
}

function clearPendApp(id, canvas) {
    let app = apps[id]
    let cube = app.querySelector('cube')
    if (cube)
        cube.remove()

    if (canvas)
        app.appendChild(canvas); //FIX clearly we goofed soemthing in the loading process, this only happens with with portfolio?
}

function getPos() {
    return positionalData
}

function getCurrentAppId() {
    return currentAppId;
}

function shrinkTitle() {
    mainTitle.classList.add('shrink')
}

function getBarSide() {
    barPos
}

function switchApp(id) {

    closeApp(true);
    if (typeof id == "string") {
        id = HASHES[id]
        if (id == undefined)
            return;
    }
    openApp(id);
    let ar = Object.keys(HASHES)
    let hashString = ar[id - 1] //as we offset our app ids to start at 1, new arrays need id -1
    if (hashString)
        window.location.hash = '#' + hashString
}

/**
OlD curve code
            let last={x:mouseObj.x,y:mouseObj.y,dir:dir,pos:pos};
            let lastMode=-1;
            for(let i=0;i<points.length;i++){
                //st+="M"+last.x+" "+last.y
                let halfy=(points[i].y-last.y)/2
                let halfx=(points[i].x-last.x)/2
                if(lastMode==-1){
                    lastMode=(Math.abs(halfx)<Math.abs(halfy))?1:0
                }
                if(points[i].dir==last.dir){
                    if(!last.dir){ //up down dir //points[i].dir
                        st+="Q"+last.x+" "+(last.y+halfy)+" "+(last.x+halfx)+" "+(last.y+halfy);
                        st+="Q"+points[i].x+" "+(last.y+halfy)+" "+points[i].x+" "+points[i].y;
                    }else{ //left right dir
                        st+="Q"+(last.x+halfx)+" "+last.y+" "+(last.x+halfx)+" "+(last.y+halfy);
                        st+="Q"+(last.x+halfx)+" "+points[i].y+" "+points[i].x+" "+points[i].y;
                        
                    }
                }else{ //curve in then
                    if(last.dir){ // true is x left right
                        if((halfy>0)!=last.pos){
                            st+="C"+(last.x)+" "+(last.y-halfy)+" "+(last.x+halfx)+" "+(last.y-halfy)+" "+(last.x+halfx)+" "+(last.y+halfy);

                            st+="Q"+(last.x+halfx)+" "+(last.y+halfy)+" "+points[i].x+" "+points[i].y;
                                                    console.log('special')


                        }else{
                            st+="Q"+(points[i].x)+" "+last.y+" "+points[i].x+" "+points[i].y;
                        }
                        
                    }else{
                        st+="Q"+(last.x)+" "+points[i].y+" "+points[i].x+" "+points[i].y;
                    }
                }

                let prev={x:points[i].x,y:points[i].y,dir:points[i].dir,pos:points[i].pos};
                points[i]={x:last.x,y:last.y,dir:last.dir,pos:last.pos};
                last=prev;
            }
**/

export { switchApp, pendApp, clearPendApp, apps, getPos, getCurrentAppId, shrinkTitle, getBarSide }