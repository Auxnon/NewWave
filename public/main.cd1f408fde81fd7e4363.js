(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/*! exports provided: pendApp, clearPendApp, apps, getPos */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"pendApp\", function() { return pendApp; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clearPendApp\", function() { return clearPendApp; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"apps\", function() { return apps; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getPos\", function() { return getPos; });\n/* harmony import */ var _UI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI.js */ \"./src/UI.js\");\n\n\nvar Render;\n\n//We could have technically done imports as a variable input to the Render class import statement\n//But webpack won't convert the chunk parameters correctly unless it's explicitly within an import statement\nconst SCENE_IMPORT = [\n    i => { Promise.all(/*! import() | App1SkyIsland */[__webpack_require__.e(\"libs\"), __webpack_require__.e(\"Render\"), __webpack_require__.e(\"App1SkyIsland\")]).then(__webpack_require__.bind(null, /*! ./App1SkyIsland */ \"./src/App1SkyIsland.js\")).then(i) },\n    i => { Promise.all(/*! import() | App2Punk */[__webpack_require__.e(\"libs\"), __webpack_require__.e(\"Render\"), __webpack_require__.e(\"App2Punk\")]).then(__webpack_require__.bind(null, /*! ./App2Punk */ \"./src/App2Punk.js\")).then(i) },\n    i => { Promise.all(/*! import() | App3Data */[__webpack_require__.e(\"libs\"), __webpack_require__.e(\"Render\"), __webpack_require__.e(\"App3Data\")]).then(__webpack_require__.bind(null, /*! ./App3Data */ \"./src/App3Data.js\")).then(i) },\n    i => { Promise.all(/*! import() | App4About */[__webpack_require__.e(\"libs\"), __webpack_require__.e(\"Render\"), __webpack_require__.e(\"App4About\")]).then(__webpack_require__.bind(null, /*! ./App4About */ \"./src/App4About.js\")).then(i) }\n]\n\n//doms\nvar apps;\nvar svg;\nvar path;\nvar bar;\nvar barBox;\nvar mainTitle;\n\nvar focused;\nvar barMove = false;\nvar barPos = 1;\nvar appPoints;\nvar moveFactor = 0;\n\nvar count = 0;\nvar tick = false;\nvar barLineFactor = 1;\n\nvar targetMove = undefined;\nvar targetPoint = { x: 0, y: 0 }\n\nvar mouseObj;\nvar points;\n\nvar pendingRenderId; //if not undefined, wait for Render to load and then apply the scene\n\nvar resizeDebouncer;\nlet positionalData={x:0,y:0}\n\nfunction init(argument) {\n    let preApps = document.querySelectorAll('.app');\n    apps = []\n    preApps.forEach(app => { //convert out of a nodelist to an array, it matters trust me\n        apps.push(app)\n    });\n\n    apps.forEach((app, index) => {\n        app.style.top = Math.random() * window.innerWidth + 'px'\n        app.style.left = Math.random() * window.innerHeight + 'px'\n        app.offset = { x: 0, y: 0 };\n        app.appId = index;\n        app.addEventListener('pointerdown', ev => { appSelect(app, ev); })\n        app.addEventListener('dragstart', ev => { ev.preventDefault() })\n    });\n\n    window.addEventListener('pointerup', winMouseUp)\n    path = document.querySelector('path')\n    svg = document.querySelector('svg')\n    mainTitle = document.querySelector('#mainTitle');\n    mouseObj = { x: window.innerWidth / 2, y: -200 }\n\n    window.addEventListener('resize', resize);\n    initLine();\n    window.addEventListener('pointermove', mousemove)\n\n    barInit();\n\n    resize();\n    animate();\n    setInterval(() => { boundaryCheck() }, 3000)\n    let brightness = document.querySelector('#brightness');\n    brightness.addEventListener('click', ev => {\n        if(brightness.classList.contains('brightnessDark')) {\n            document.body.style.backgroundColor = 'black';\n            //document.body.style.stroke = 'white';\n            mainTitle.style.border = 'white 5px solid';\n            //mainTitle.style.stroke = 'white';\n        } else {\n            document.body.style.backgroundColor = 'white'\n            //document.body.style.stroke = 'black';\n            mainTitle.style.border = 'black 5px solid';\n            //mainTitle.style.stroke = 'black';\n        }\n        brightness.classList.toggle('brightnessDark')\n    })\n\n    if(window.location.search.length) {\n        let params = new URLSearchParams(window.location.search);\n        let id = params.get('id');\n        if(id && id.length) {\n            openApp(parseInt(id))\n        }\n    }\n\n\n    // button.onclick = e => import(/* webpackChunkName: \"print\" */ './print').then(module => {\n    //     const print = module.default;\n\n    //     print();\n    //   });\n\n    Promise.all(/*! import() | Render */[__webpack_require__.e(\"libs\"), __webpack_require__.e(\"Render\")]).then(__webpack_require__.bind(null, /*! ./Render */ \"./src/Render.js\")).then(module => {\n        Render = module;\n        Render.init(SCENE_IMPORT, pendingRenderId); //if undefined it will just use 0, so we can directly input regardless\n        console.log('3d Renderer loaded')\n        if(pendingRenderId != undefined) {\n            openAppApplyRender(pendingRenderId, apps[pendingRenderId])\n        }\n    });\n\n    _UI_js__WEBPACK_IMPORTED_MODULE_0__[\"init\"](document.querySelector('#main'));\n\n}\ninit();\n\nfunction openApp(id) {\n    let app = apps[id];\n    if(app) {\n        app.classList.add('appMax')\n        app.focused = true;\n        app.style.zIndex = 0;\n        if(Render) {\n            openAppApplyRender(id, app)\n        } else {\n            pendingRenderId = id;\n            pendApp(id);\n        }\n        focused = app;\n    }\n}\n\nfunction openAppApplyRender(id, app) {\n    let d = Render.getAlphaCanvas();\n    d.style.opacity = 1;\n    d.remove();\n\n    let afterImage = document.querySelector('#afterImage');\n\n    afterImage.remove();\n\n\n    app.appendChild(d);\n\n    if(focused) {\n        focused.appendChild(afterImage);\n        afterImage.style.opacity = 1;\n        setTimeout(() => { afterImage.style.opacity = 0; }, 1);\n    } else { //silly I know but it's just easier to keep the afterImage within the dom, even if in this logical case it's not used\n        afterImage.style.opacity = 0;\n        if(app == 0)\n            apps[1].appendChild(afterImage);\n        else\n            apps[0].appendChild(afterImage);\n    }\n    Render.bufferPrint();\n    Render.flipScene(id)\n}\n\nfunction closeApp(disableFade) {\n    if(focused) {\n        focused.classList.remove('appMax')\n        focused.style.zIndex = 2;\n        focused.focused = undefined; //wow why did i name this like this\n        window.history.pushState({}, '', '/');\n        if(!disableFade && Render) {\n            let d = Render.getAlphaCanvas();\n            setTimeout(() => { d.style.opacity = 0; }, 1);\n            d.style.opacity = 1;\n        }\n    }\n}\n\n\n\nfunction resize() {\n\n    clearTimeout(resizeDebouncer);\n    resizeDebouncer = setTimeout(function() {\n        svg.setAttribute('width', window.innerWidth + \"px\")\n        svg.setAttribute('height', window.innerHeight + \"px\")\n        barAdjust();\n        if(Render) {\n            Render.resize();\n        }\n        _UI_js__WEBPACK_IMPORTED_MODULE_0__[\"systemMessage\"]('inner ' + window.innerWidth + '; screen ' + window.screen.width, 'success')\n    }, 250);\n\n\n}\n\nfunction rand() {\n    return Math.random() * 100 - 50;\n}\n\nfunction initLine() {\n    points = [];\n    for(let i = 0; i < 10; i++) {\n        points.push({ x: mouseObj.x, y: mouseObj.y });\n    }\n}\n\n\n\nfunction barInit() {\n    bar = document.querySelector('#bar')\n    let barHandle = document.querySelector('#barHandle')\n    barHandle.addEventListener('pointerdown', ev => {\n        let xx = barBox.left //-(barBox.right-barBox.left)/2\n        let yy = barBox.top //-(barBox.bottom-barBox.top)/2\n\n        barMove = true; //{x:ev.clientX-xx,y:ev.clientY-yy};\n\n        if(points.length < 10) { //rebuild are point array\n            let startPoint = points[0];\n            let array = Array(7).fill(startPoint);\n            points = array.concat(points)\n        }\n\n        barLineFactor = 0;\n    })\n    barHandle.addEventListener('dragstart', ev => { ev.preventDefault() })\n    /*barHandle.addEventListener('pointerup',ev=>{\n    \tbarMove=false;\n    })*/\n\n    appPoints = [];\n\n    barHandle.style.transform = 'translate(-50%,-200%)';\n    bar.style.left = '50%';\n    bar.style.top = (window.innerHeight - 64) + 'px';\n\n    barCalculate(true);\n}\n\nfunction barCalculate(notate) {\n\n    //first determine  how many apps will be visably part of the app bar\n    let count = 0;\n    let appsInRow = [];\n    let sideWays = barPos == 0 || barPos == 2;\n\n    if(!notate) {\n        apps.forEach(app => {\n            if(app.spot != -1) {\n                appsInRow.push(app)\n                count++;\n            }\n        })\n    } else {\n        count = apps.length;\n        appsInRow = apps;\n    }\n    if(sideWays) {\n        bar.style.height = (count > 0 ? count : 1) * 64 + 'px'\n        bar.style.width = '64px'\n    } else {\n        bar.style.width = (count > 0 ? count : 1) * 64 + 'px'\n        bar.style.height = '64px'\n    }\n\n\n\n\n    let rect = bar.getBoundingClientRect();\n    barBox = rect\n    let width = rect.width;\n    let height = rect.height;\n\n    let ratio;\n    if(sideWays)\n        ratio = height / (count);\n    else\n        ratio = width / (count);\n\n    if(!notate) {\n        if(sideWays)\n            appsInRow.sort(function(a, b) {\n                return parseInt(a.style.top) - parseInt(b.style.top);\n            });\n        else\n            appsInRow.sort(function(a, b) {\n                return parseInt(a.style.left) - parseInt(b.style.left);\n            });\n    }\n\n\n    for(let i = 0; i < count; i++) {\n        if(sideWays)\n            appPoints[i] = { x: rect.left + width / 2, y: 32 + rect.top + (i) * ratio };\n        else\n            appPoints[i] = { x: 32 + rect.left + (i) * ratio, y: rect.top + height / 2 };\n\n\n        if(targetMove && targetMove == appsInRow[i])\n            targetPoint = appPoints[i]\n\n        if(notate) {\n            apps[i].spot = i;\n            appPoints[i].app = appsInRow[i]\n        }\n        _moveEle(appsInRow[i], appPoints[i].x, appPoints[i].y)\n    }\n    if(barLineFactor == -1) {\n        let handle = barHandle.getBoundingClientRect();\n        if(sideWays) {\n            let xx = handle.left + handle.width / 2\n            drawSimpleBarLine({ x: xx, y: handle.top }, { x: xx, y: handle.bottom })\n        } else {\n            let yy = handle.top + handle.height / 2\n            drawSimpleBarLine({ x: handle.left, y: yy }, { x: handle.right, y: yy })\n        }\n\n    }\n}\n\nfunction animate() {\n    if(barLineFactor > -1) {\n        if(barLineFactor < 4) {\n            if(barLineFactor) {\n                let target = {};\n                let rect = barHandle.getBoundingClientRect();\n                let mid = { x: rect.width / 2, y: rect.height / 2 }\n\n                if(barPos == 0 || barPos == 2) {\n                    switch (barLineFactor) {\n                        case 3:\n                            target = { x: rect.left + mid.x, y: rect.top };\n                            break;\n                        case 2:\n                            target = { x: rect.left + mid.x, y: rect.top + mid.y };\n                            break;\n                        default:\n                            target = { x: rect.left + mid.x, y: rect.bottom }\n                    }\n                } else {\n                    switch (barLineFactor) {\n                        case 3:\n                            target = { x: rect.left, y: rect.top + mid.y };\n                            break;\n                        case 2:\n                            target = { x: rect.left + mid.x, y: rect.top + mid.y };\n                            break;\n                        default:\n                            target = { x: rect.right, y: rect.top + mid.y }\n                    }\n                }\n\n                let dx = mouseObj.x - target.x;\n                let dy = mouseObj.y - target.y;\n                let dr = Math.sqrt(dx * dx + dy * dy)\n                mouseObj.x -= dx / 2\n                mouseObj.y -= dy / 2\n                if(dr < 1 && barLineFactor < 4)\n                    barLineFactor++;\n            }\n\n\n            let diff = { x: mouseObj.x - points[0].x, y: mouseObj.y - points[0].y }\n            let dr = Math.sqrt(diff.x * diff.x + diff.y * diff.y)\n\n            if(dr > 40) {\n                let nextVector;\n                if(barLineFactor > 1) { //straight to next point\n                    nextVector = { x: mouseObj.x, y: mouseObj.y };\n                } else { //wiggle the line\n                    nextVector = { x: mouseObj.x - (tick ? 1 : -1) * 20 * diff.y / dr, y: mouseObj.y + (tick ? 1 : -1) * 20 * diff.x / dr };\n                }\n\n                let dir = Math.abs(diff.x) > Math.abs(diff.y);\n                let pos = dir ? diff.x > 0 : diff.y > 0\n                tick = !tick\n\n                drawBarLine(nextVector);\n            }\n        } else {\n            if(barLineFactor % 5 == 1) {\n\n                let target = points.shift();\n                console.log('chop off points ' + points.length)\n                if(points.length <= 3) {\n                    barLineFactor = -1;\n                    barCalculate();\n                } else {\n                    drawBarLine(target)\n                }\n\n            }\n            if(barLineFactor != -1)\n                barLineFactor++;\n\n        }\n    }\n    /*if(targetMove)\n    \tmoveFactor++;*/\n\n    requestAnimationFrame(animate);\n}\n\nfunction drawBarLine(nextVector) {\n    let st = \"M\" + mouseObj.x + \" \" + mouseObj.y;\n    let last = { x: nextVector.x, y: nextVector.y };\n    for(let i = 0; i < points.length; i++) {\n        let halfy = (points[i].y - last.y) / 2\n        let halfx = (points[i].x - last.x) / 2\n        let midx = last.x + halfx;\n        let midy = last.y + halfy;\n        st += \"Q\" + last.x + \" \" + last.y + \" \" + midx + \" \" + midy //+points[i].x+\" \"+points[i].y\n\n        let prev = { x: points[i].x, y: points[i].y };\n        points[i] = { x: last.x, y: last.y };\n        last = prev;\n    }\n    path.setAttribute('d', st)\n}\n\nfunction drawSimpleBarLine(one, two) {\n    let st = \"M\" + one.x + ' ' + one.y + \"L\" + two.x + ' ' + two.y;\n    path.setAttribute('d', st);\n}\n\nfunction mousemove(ev) {\n    positionalData={x:ev.clientX/window.innerWidth,y:ev.clientY/window.innerHeight}\n    barMoveHandler(ev);\n    if(targetMove) {\n        moveFactor++;\n        targetMove.pos = { x: ev.clientX + targetMove.offset.x, y: ev.clientY + targetMove.offset.y }\n\n        if(ev.clientY > barBox.top && ev.clientY < barBox.bottom && ev.clientX > barBox.left && ev.clientX < barBox.right) {\n            let point = targetPoint;\n            let d = { x: point.x - targetMove.pos.x, y: point.y - targetMove.pos.y }\n            targetMove.pos = { x: point.x - d.x / 3, y: point.y - d.y / 3 }\n            if(targetMove.moving) { //called once per state change\n                targetMove.moving = undefined;\n                targetMove.spot = 0;\n                barCalculate();\n            }\n\n        } else {\n            if(!targetMove.moving) { //called once per state change\n                targetMove.moving = true;\n                targetMove.spot = -1;\n\n                barCalculate()\n            }\n\n        }\n\n        targetMove.style.left = targetMove.pos.x + 'px'\n        targetMove.style.top = targetMove.pos.y + 'px'\n    } else if(barLineFactor == 0) {\n        if(count > 2) {\n            count = 0;\n            mouseObj = { x: ev.clientX, y: ev.clientY }\n        }\n        count++\n    }\n}\n\nfunction barMoveHandler(ev) {\n    if(barMove) {\n        moveFactor++;\n        let xx = ev.clientX;\n        let yy = ev.clientY;\n        let dx = xx - window.innerWidth / 2;\n        let dy = yy - window.innerHeight / 2;\n        let r = Math.atan2(dy, dx) / Math.PI;\n        let ar = Math.abs(r)\n        if(ar < 0.25) { //right\n            if(barPos != 2) {\n                barPos = 2;\n                barAdjust()\n            }\n        } else if(ar < 0.75) { //top or bottom\n            if(r < 0) { //top\n                if(barPos != 3) {\n                    barPos = 3;\n                    barAdjust()\n                }\n            } else { //botttom\n                if(barPos != 1) {\n                    barPos = 1\n                    barAdjust()\n                }\n            }\n        } else { //left\n            if(barPos != 0) {\n                barPos = 0;\n                barAdjust()\n            }\n        }\n\n        /*\n        \t\t\t\tif(window.innerWidth>window.innerHeight){ //landscape\n        \t\t\t\t\tlet half=(window.innerWidth - window.innerHeight)/2\n        \t\t\t\t\tif(xx<half){ //left\n        \t\t\t\t\t\tbar.style.transform='rotate(90deg)'\n        \t\t\t\t\t\tbarHandle.style.transform='translate(-50%,-200%)'\n        \t\t\t\t\t}else if(xx>window.innerWidth-half){ //right\n        \t\t\t\t\t\tbar.style.transform='rotate(90deg)'\n        \t\t\t\t\t\tbarHandle.style.transform='translate(-50%,100%)'\n        \t\t\t\t\t}else{\n        \t\t\t\t\t\tbar.style.transform='rotate(0deg)'\n        \t\t\t\t\t\tif(yy>window.innerHeight/2){\n        \t\t\t\t\t\t\tbarHandle.style.transform='translate(-50%,-200%)'\n        \t\t\t\t\t\t}else{\n        \t\t\t\t\t\t\tbarHandle.style.transform='translate(-50%,100%)'\n        \t\t\t\t\t\t}\n        \t\t\t\t\t}\n        \t\t\t\t}else{ //portrait\n        \t\t\t\t\tlet half=(window.innerHeight - window.innerWidth)/2\n        \t\t\t\t\tif(yy<half){ //top\n        \t\t\t\t\t\tbar.style.transform='rotate(0deg)'\n        \t\t\t\t\t\tbarHandle.style.transform='translate(-50%,-200%)'\n        \t\t\t\t\t}else if(yy>window.innerHeight-half){ //bottom\n        \t\t\t\t\t\tbar.style.transform='rotate(0deg)'\n        \t\t\t\t\t\tbarHandle.style.transform='translate(-50%,100%)'\n        \t\t\t\t\t}else{\n        \t\t\t\t\t\tbar.style.transform='rotate(90deg)'\n        \t\t\t\t\t\tif(xx>window.innerWidth/2){\n        \t\t\t\t\t\t\tbarHandle.style.transform='translate(-50%,-200%)'\n        \t\t\t\t\t\t}else{\n        \t\t\t\t\t\t\tbarHandle.style.transform='translate(-50%,100%)'\n        \t\t\t\t\t\t}\n        \t\t\t\t\t}\n        \t\t\t\t}*/\n    }\n}\n\nfunction barAdjust() {\n    if(barPos == 2) { //right\n        bar.style.left = window.innerWidth - 64 + 'px';\n        bar.style.top = '50%'; //window.innerHeight/2;\n        barCalculate();\n        barHandle.style.transform = 'translate(-200%,-50%)'\n        barHandle.style.width = '32px';\n        barHandle.style.height = '80%';\n        mainTitle.style.top = '28px';\n    } else if(barPos == 3) { //top\n        barHandle.style.transform = 'translate(-50%,100%)'\n        bar.style.left = '50%';\n        bar.style.top = '64px' //-196+window.innerWidth/2\n        mainTitle.style.top = 'calc(100% - 128px)';\n        barCalculate();\n        barHandle.style.height = '32px';\n        barHandle.style.width = '80%';\n    } else if(barPos == 1) { //bottom\n        barHandle.style.transform = 'translate(-50%,-200%)'\n        bar.style.left = '50%';\n        bar.style.top = (window.innerHeight - 64) + 'px'; //-196+window.innerWidth/2\n        mainTitle.style.top = '28px';\n        barCalculate();\n        barHandle.style.height = '32px';\n        barHandle.style.width = '80%';\n    } else { //left\n        barHandle.style.transform = 'translate(100%,-50%)'\n        bar.style.left = '64px';\n        bar.style.top = '50%'\n        barCalculate()\n        barHandle.style.width = '32px'\n        barHandle.style.height = '80%'\n        mainTitle.style.top = '28px';\n    }\n}\n/*\nfunction pointCheck(point,index){\n\tlet d={x:point.x-targetMove.pos.x,y:point.y-targetMove.pos.y}\n\t\t\tlet dr=Math.sqrt(d.x*d.x +d.y*d.y);\n\n\n\t\t\tif(dr<40){\n\t\t\t\ttargetMove.pos={x:point.x-d.x/3,y:point.y-d.y/3}\n\t\t\t\tif(targetMove.moving){ //called once per state change\n\t\t\t\t\ttargetMove.moving=undefined\n\t\t\t\t\t//targetMove.classList.remove('appMove')\n\t\t\t\t}\n\t\t\t\tif(point.app==targetMove){\n\n\t\t\t\t}else{ //switcheroo the app icons\n\t\t\t\t\t//let oldPoint=appPoints[targetMove.spot];\n\t\t\t\t\tlet swapApp=point.app;\n\t\t\t\t\ttargetMove.spot=index;\n\t\t\t\t\tapps.forEach(app=>{\n\t\t\t\t\t\tif(app==targetMove){\n\n\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\tif(app.pos.x>targetMove.pos.x){\n\t\t\t\t\t\t\t\t_moveEle(app,64+app.pos.x,app.pos.y,true)\n\t\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\t\t_moveEle(app,-64+app.pos.x,app.pos.y,true)\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t})\n\n\n\t\t\t\t}\n\t\t\t}else{\n\t\t\t\tif(!targetMove.moving){ //called once per state change\n\t\t\t\t\ttargetMove.moving=true;\n\t\t\t\t\t//targetMove.classList.add('appMove')\n\n\t\t\t\t}\n\t\t\t}\n}*/\n\nfunction appSelect(app, ev) {\n    if(!app.focused) {\n        targetMove = app;\n\n        app.pos = { x: parseInt(app.style.left), y: parseInt(app.style.top) }\n        targetPoint = { x: app.pos.x, y: app.pos.y }\n        //app.origin={x:app.pos.x,y:app.pos.y}\n        app.offset = { x: app.pos.x - ev.clientX, y: app.pos.y - ev.clientY }\n        app.classList.add('appMove')\n        app.moving = undefined;\n\n    }\n}\n\nfunction winMouseUp(ev) {\n    if(barMove) {\n        barMove = false;\n        barLineFactor = 1;\n        console.log(moveFactor)\n        if(moveFactor < 10) {\n            closeApp();\n        }\n    }\n\n    if(targetMove) {\n        targetMove.classList.remove('appMove')\n        console.log(moveFactor)\n        if(moveFactor < 10) {\n            if(focused && focused == targetMove) {\n                targetMove.classList.remove('appMax')\n                targetMove.focused = undefined;\n                focused = undefined;\n                targetMove.style.zIndex = 2;\n                window.history.pushState({}, '', '/');\n\n            } else {\n                closeApp(true);\n\n                openApp(targetMove.appId);\n\n                window.history.pushState({ appId: targetMove.appId }, targetMove.name, '?id=' + targetMove.appId + '&app=' + targetMove.id);\n            }\n        } else {\n            barCalculate();\n\n            console.log('fix bar also')\n        }\n    } else {\n        barCalculate();\n        console.log('fix bar')\n    }\n    targetMove = undefined;\n\n    moveFactor = 0;\n\n}\n\nfunction boundaryCheck() {\n    apps.forEach(app => {\n        if(!app.focused) {\n            let rect = app.getBoundingClientRect();\n\n            let x = rect.left;\n            let y = rect.top;\n            let w2 = (rect.right - rect.left) / 2;\n            let h2 = (rect.bottom - rect.top) / 2\n\n            if(x < 0) {\n                app.style.left = w2 + 'px'\n            } else if(x > window.innerWidth - w2 * 2) {\n                app.style.left = window.innerWidth - w2 + 'px'\n            }\n            if(y < 0) {\n                app.style.top = h2 + 'px'\n            } else if(y > window.innerHeight - h2 * 2) {\n                app.style.top = window.innerHeight - h2 + 'px'\n            }\n\n        }\n\n    })\n}\n\nfunction _moveEle(ele, x, y, bool) {\n    if(!bool)\n        ele.pos = { x: x, y: y }\n    ele.style.left = x + 'px'\n    ele.style.top = y + 'px'\n}\n\nfunction pendApp(id) {\n    let app = apps[id]\n    let cube = app.querySelector('cube')\n    if(!cube) {\n        cube = document.createElement('cube');\n        app.appendChild(cube);\n    }\n}\n\nfunction clearPendApp(id) {\n    let app = apps[id]\n    let cube = app.querySelector('cube')\n    if(cube)\n        cube.remove()\n}\n\nfunction getPos(){\n    return positionalData\n}\n\n\n/**\nOlD curve code\n\t\t\tlet last={x:mouseObj.x,y:mouseObj.y,dir:dir,pos:pos};\n\t\t\tlet lastMode=-1;\n\t\t\tfor(let i=0;i<points.length;i++){\n\t\t\t\t//st+=\"M\"+last.x+\" \"+last.y\n\t\t\t\tlet halfy=(points[i].y-last.y)/2\n\t\t\t\tlet halfx=(points[i].x-last.x)/2\n\t\t\t\tif(lastMode==-1){\n\t\t\t\t\tlastMode=(Math.abs(halfx)<Math.abs(halfy))?1:0\n\t\t\t\t}\n\t\t\t\tif(points[i].dir==last.dir){\n\t\t\t\t\tif(!last.dir){ //up down dir //points[i].dir\n\t\t\t\t\t\tst+=\"Q\"+last.x+\" \"+(last.y+halfy)+\" \"+(last.x+halfx)+\" \"+(last.y+halfy);\n\t\t\t\t\t\tst+=\"Q\"+points[i].x+\" \"+(last.y+halfy)+\" \"+points[i].x+\" \"+points[i].y;\n\t\t\t\t\t}else{ //left right dir\n\t\t\t\t\t\tst+=\"Q\"+(last.x+halfx)+\" \"+last.y+\" \"+(last.x+halfx)+\" \"+(last.y+halfy);\n\t\t\t\t\t\tst+=\"Q\"+(last.x+halfx)+\" \"+points[i].y+\" \"+points[i].x+\" \"+points[i].y;\n\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t}else{ //curve in then\n\t\t\t\t\tif(last.dir){ // true is x left right\n\t\t\t\t\t\tif((halfy>0)!=last.pos){\n\t\t\t\t\t\t\tst+=\"C\"+(last.x)+\" \"+(last.y-halfy)+\" \"+(last.x+halfx)+\" \"+(last.y-halfy)+\" \"+(last.x+halfx)+\" \"+(last.y+halfy);\n\n\t\t\t\t\t\t\tst+=\"Q\"+(last.x+halfx)+\" \"+(last.y+halfy)+\" \"+points[i].x+\" \"+points[i].y;\n\t\t\t\t\t\t\t\t\t\t\t\t\tconsole.log('special')\n\n\n\t\t\t\t\t\t}else{\n\t\t\t\t\t\t\tst+=\"Q\"+(points[i].x)+\" \"+last.y+\" \"+points[i].x+\" \"+points[i].y;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t}else{\n\t\t\t\t\t\tst+=\"Q\"+(last.x)+\" \"+points[i].y+\" \"+points[i].x+\" \"+points[i].y;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tlet prev={x:points[i].x,y:points[i].y,dir:points[i].dir,pos:points[i].pos};\n\t\t\t\tpoints[i]={x:last.x,y:last.y,dir:last.dir,pos:last.pos};\n\t\t\t\tlast=prev;\n\t\t\t}\n**/\n\n\n\n//# sourceURL=webpack:///./src/Main.js?");

/***/ }),

/***/ "./src/UI.js":
/*!*******************!*\
  !*** ./src/UI.js ***!
  \*******************/
/*! exports provided: init, systemMessage, cursorMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"systemMessage\", function() { return systemMessage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cursorMessage\", function() { return cursorMessage; });\n//version 2\n\n\nlet main;\nlet sysTop;\nlet textDump;\n\nfunction init(mainDom){\n\n\tstyleInit();\n\tif(mainDom){\n\t\tmain=mainDom\n\t}else{\n\t\tmain=document.querySelector(\"#main\")\n\t\tif(!main)\n\t\t\tmain=document.body\n\t}\n\n\n\tif(main){\n\t\tsysTop=document.createElement('duv');\n\t\tsysTop.className='uiHolderSysTop';\n\t\tmain.appendChild(sysTop);\n\n\t\t//systemMessage(_spam('this is a test'))\n\t\t\n\n\t\ttextDump=document.createElement('input')\n\t\ttextDump.type='text'\n\t\ttextDump.style.position='fixed'\n\n\t\ttextDump.taxindex='-1'\t\t\t\n\t\ttextDump.style.display='none'\n\t\ttextDump.style.pointerEvents= 'none';\n\n\t\tmain.appendChild(textDump)\n\n\t}else{\n\t\tconsole.error('UI.js:: uh oh! no system dom element found')\n\t}\n\n\n\t//dev\n\twindow.addEventListener('keyup',function(ev){\n\t\tif(ev.keyCode==32){\n\t\t\tlet v=Math.random();\n\t\t\tlet type=v>0.2?v>0.4?v>0.6?'warn':'error':'person':'time';\n\t\t\t\n\t\t\tsystemMessage(_spam('this is a test '),type)\n\t\t}else if(ev.keyCode==90){\n\t\t\tDEVVAR=systemMessage('No network connection oh darrrrrrn \\n We\\'ll keep tryna connect in the background ;)','net',true)\n\t\t}else if(ev.keyCode==27){\n\t\t\tDEVVAR.remove();\n\t\t}\n\t})\n\n} \n\nfunction systemMessage(m,type,persistant){\n\tlet dom=document.createElement('div');\n\tdom.className='uiSysTop';\n\n\tlet icon=document.createElement('div');\n\tlet extra=' ';\n\n\tif(typeof type === 'object' && type !== null){\n\t\tif(type.type)\n\t\t\textra+=type.type\n\t\tif(type.color)\n\t\t\tdom.style.backgroundColor=type.color\n\t}else{\n\t\tswitch(type){\n\t\t\tcase 'warn': extra+='uiIconWarning'; dom.style.backgroundColor='#EFEF79';break;\n\t\t\tcase 'error': extra+='uiIconError'; dom.style.backgroundColor='#D25E5E';break;\n\t\t\tcase 'net': extra+='uiIconNet'; dom.style.backgroundColor='#FFC65E';break;\n\t\t\tcase 'person': extra+='uiIconPerson'; dom.style.backgroundColor='#D257FF';break;\n\t\t\tcase 'time': extra+='uiIconTime'; dom.style.backgroundColor='#5094D9';break;\n\t\t\tcase 'success': extra+='uiIconSuccess'; dom.style.backgroundColor='#95F17F';break;\n\t\t}\n\t}\n\n\t\n\ticon.className='uiIcon'+extra;\n\tlet span=document.createElement('span');\n\tspan.innerText=m;\n\n\tspan.addEventListener('click',function(ev){\n\t\t_copyText(span)\n\t\tcursorMessage(ev.clientX,ev.clientY,'Copied');\n\t})\n\n\tdom.appendChild(icon);\n\tdom.appendChild(span);\n\n\n\tfunction _endMessage() {\n\t\tdom.style.animation=persistant?'0.5s uiSysMini forwards':'0.5s uiSysFold forwards';\n\t\tsetTimeout(function(){\n\t\t\tif(persistant){\n\t\t\t\tdom.style.position='absolute'\n\t\t\t\tdom.style.left='-64px'\n\t\t\t\tdom.addEventListener('click',function(ev) {\n\t\t\t\t\tdom.style.animation='0.5s uiSysMax forwards';\n\t\t\t\t\tsetTimeout(function(){\n\t\t\t\t\t\tdom.style.animation='0.5s uiSysMini forwards';\n\t\t\t\t\t},3500)\n\t\t\t\t})\n\t\t\t}else{\n\t\t\t\tdom.remove();\n\t\t\t}\n\n\t\t},500);\n\t}\n\tif(!persistant){\n\t\tlet closeButton=document.createElement('div');\n\t\tcloseButton.className='uiCloseButton';\n\t\tdom.appendChild(closeButton);\n\n\t\tcloseButton.addEventListener('click',function(ev){\n\t\t\t_endMessage();\n\t\t})\n\t}\n\n\tsetTimeout(function(){\n\t\t_endMessage();\n\t},3500)\n\n\tsysTop.appendChild(dom);\n\treturn dom;\n}\n\nfunction cursorMessage(x,y,message){\n\tlet dom=document.createElement('div');\n\tdom.className='uiCursorMessage';\n\tdom.style.left=x+'px'\n\tdom.style.top=y+'px'\n\tdom.innerText=message;\n\tmain.appendChild(dom);\n\tsetTimeout(function(){\n\t\tdom.style.animation='1s uiFade forwards'\n\t\tsetTimeout(function(){\n\t\t\tdom.remove();\n\t\t},1000)\n\t},1500)\n}\n\n\n\nfunction _spam(m){\n\tlet st='';\n\tlet max=Math.random()*20\n\tfor(let i=0;i<max;i++){\n\t\tst+=m;\n\t}\n\treturn st;\n}\nfunction _copyText(dom){\n\ttextDump.value=dom.innerText;\n\ttextDump.style.display='block'\n\ttextDump.select();\n\t\t//_copyText.setSelectionRange(0, 99999); /*For mobile devices*/\n\n\tdocument.execCommand(\"copy\");\n\ttextDump.blur();\n\ttextDump.style.display='none'\n\t\n}\n\nfunction styleInit(){\n\tvar sheet = document.createElement('style')\n\tsheet.innerHTML =`\n\t\t.uiSysTop{\n\t\tdisplay: flex;\n\t\talign-items: flex-start;\n\t\tposition: relative;\n\t\tmax-width: 600px;\n\t\theight: 64px;\n\t\tborder-radius: 32px;\n\t\ttransform: translate(-50%);\n\t\tbox-shadow: 3px 3px 3px #0005;\n\t\tleft: 50%;\n\t\tbackground: #E0F9D5;\n\t\tmargin: 12px;\n\t\tanimation: uiSysUnfold 1s;\n\t\toverflow: hidden;\n\t\tline-height: 16px;\n\t}\n\t.uiSysTop div{\n\n\t\tmargin: 16px;\n\t\tmargin-left: 0px;\n\t\tflex: 0 0 64px;\n\t}\n\t.uiSysTop span{\n\t\tmargin-right: 48px;\n\t\tmargin-top: 8px;\n\t\tline-height: normal;\n\t\tvertical-align: middle;\n\t\tflex: 1;\n\n\t}\n\t@keyframes uiSysUnfold{\n\t\t0%{\n\t\t\tmax-width: 64px;\n\t\t\ttop: -64px;\n\t\t\topacity: 0.2;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t\ttop:0px;\n\t\t\topacity: 1;\n\t\t}\n\t\t100%{\n\t\t\ttop: 0px;\n\t\t}\n\t}\n\t@keyframes uiSysFold{\n\t\t100%{\n\t\t\tmax-width: 64px;\n\t\t\ttop: -64px;\n\t\t\topacity: 0.2;\n\t\t\theight: 0;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t\ttop:0px;\n\t\t\topacity: 1;\n\t\t}\n\t\t0%{\n\t\t\ttop: 0px;\n\n\t\t}\n\t}\n\t@keyframes uiSysMini{\n\t\t100%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\n\t\t}\n\t\t0%{\n\t\t\t\n\t\t}\n\t}\n\t@keyframes uiSysMax{\n\t\t0%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t100%{\n\t\t\tleft: 50%;\n\t\t}\n\t}\n\n\t.uiHolderSysTop{\n\t\twidth: 600px;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 50%;\n\t\ttransform: translate(-50%);\n\t\t/*border: 3px #0999 dotted;*/\n\t\ttransition: height 1s;\n\t}\n\t.uiIcon{\n\t\tfloat: left;\n\t\twidth: 32px;\n\t\theight: 32px;\n\t\tbackground-repeat: no-repeat;\n\t    background-size:32px;\n\t    background-position: center center;\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z\"/></svg>');\n\t}\n\t.uiIconWarning{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z\"/></svg>') !important;\n\t}\n\t.uiIconError{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/></svg>') !important;\n\t}\n\t.uiIconNet{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z\"/></svg>') !important;\n\t}\n\t.uiIconPerson{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\"/></svg>') !important;\n\t\t\n\t}\n\t.uiIconTime{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z\"/></svg>') !important;\n\t}\n\n\t.uiIconSuccess{\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z\"/></svg>') !important;\n\t}\n\t\n\t.uiCloseButton{\n\t\tposition: absolute;\n\t\tright: 0;\n\t\twidth: 24px;\n\t\theight: 24px;\n\t\tbackground-repeat: no-repeat;\n\t    background-size:16px;\n\t    background-position: center center;\n\t\tbackground-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/></svg>');\n\t\t\n\t}\n\n\t.uiCursorMessage{\n\t\tmin-width: 64px;\n\t\theight: 64px;\n\t\tborder: 5px solid white;\n\t\tbackground-color: #FBAB7E;\n\t\tbackground-image: linear-gradient(270deg, #FBAB7E 0%, #F7CE68 100%);\n\n\t\tcolor: white;\n\t\tfont-size: 24px;\n\t\tfont-weight: bold;\n\t\tfont-stretch: ultra-condensed;\n\t\ttransform: translate(-50%,-50%);\n\t\tanimation: uiWobble 0.3s;\n\t\tborder-radius: 32px;\n\t\tbox-sizing: border-box;\n\t\tposition: absolute;\n\t\tline-height: 48px;\n\t\tpadding: 0 8px 0 8px;\n\t\tfont-family: sans-serif;\n\t}\n\n\t@keyframes uiWobble{\n\t\t0%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.6,0.4);\n\t\t}\n\t\t33%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.9,1.15);\n\t\t}\n\t\t66%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.8,0.9);\n\t\t}\n\t\t100%{\n\n\t\t}\n\t}\n\n\t@keyframes uiFade{\n\t\t0%{\n\t\t\topacity: 1;\n\t\t\ttransform: translate(-50%,-50%);\n\t\t}\n\t\t100%{\n\t\t\topacity: 0;\n\t\t\ttransform: translate(-50%,0%)\n\t\t}\n\t}\n\n\t`\n\tdocument.body.appendChild(sheet);\n}\n\n\n\n//# sourceURL=webpack:///./src/UI.js?");

/***/ })

},[["./src/Main.js","runtime"]]]);