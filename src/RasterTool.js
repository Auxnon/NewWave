function init(dom) {

    initSheet();
    main = document.createElement('div')
    main.className = '.drawer-group';

    drawer = main.querySelector('.drawer')

    drawer.setAttribute('width', '32px'); //drawer.offsetWidth+'px')
    drawer.setAttribute('height', '32px'); //drawer.offsetHeight+'px')
    drawer.addEventListener('pointerdown', pointerdown)
    drawer.addEventListener('pointermove', pointermove)
    window.addEventListener('pointerup', pointerup)
    ctx = drawer.getContext('2d');
    ctx.imageSmoothingEnabled = false;


    let topper = main.querySelector('.drawer-top')
    let p1 = d('drawer-paint')
    p1.style.backgroundColor = 'black'
    p1.addEventListener('pointerup', paintChange)
    let p2 = d('drawer-paint')
    p2.style.backgroundColor = 'red'
    p2.addEventListener('pointerup', paintChange)
    let p3 = d('drawer-paint')
    p3.style.backgroundColor = '#65BB00'
    p3.addEventListener('pointerup', paintChange)
    let p4 = d('drawer-paint')
    p4.style.backgroundColor = 'white'
    p4.addEventListener('pointerup', paintChange)

    let download = d('drawer-download')
    download.addEventListener('pointerup', downloadImage)
    let trash = d('drawer-trash')
    trash.addEventListener('pointerup', trashImage)
    topper.appendChild(p1)
    topper.appendChild(p2)
    topper.appendChild(p3)
    topper.appendChild(p4)
    topper.appendChild(download)
    topper.appendChild(trash)



    document.onpaste = function(event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items)); // will give you the mime types
        let index;
        for (index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image;
                    img.onload = function() {
                        setData(img)
                    };
                    img.src = event.target.result;
                }; // data url!

                reader.readAsDataURL(blob);
            }
        }
    }

}

var down = false;
var ctx;
var paintColor = 'black';
var main;
var drawer
var state;

function pointerdown() {
    down = true;
}

function pointermove(ev) {
    if (down) {
        ctx.fillStyle = paintColor;
        let rect = ev.target.getBoundingClientRect();

        ctx.fillRect(32 * (ev.clientX - rect.left) / 132, 32 * (ev.clientY - rect.top) / 132, 2, 2);
    }
}

function pointerup(ev) {
    down = false;
}

function trashImage(ev) {
    wiggle(ev.target)
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, 32, 32);
}

function downloadImage(ev) {
    wiggle(ev.target)
    let target = ev.target.parentElement.parentElement.querySelector('.drawer')
    //let img = convertCanvasToImage(target)
    let img = target.toDataURL("image/png");
    downloader(img)
}

function downloader(img) {
    let a = document.createElement('a');
    a.href = img
    a.download = img //"img";
    //a.download = img;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function wiggle(target) {
    target.style.animationName = '';
    void target.offsetWidth;
    target.style.animationName = 'jello';
}

function paintChange(ev) {
    wiggle(ev.target)
    paintColor = ev.target.style.backgroundColor;
}

function getData() {
    return drawer.toDataURL("image/png");
}

function move(target) {
    target.appendChild(main)
}

function setData(img) {
    ctx.clearRect(0, 0, 32, 32)
    if (!img.src.includes('undefined')) {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.drawImage(img, 0, 0, 32, 32);
    }

}

function d(c) {
    let dom = document.createElement('div')
    if (c)
        dom.className = c;
    return dom
}

function makeButton(target, status, callback) {
    let dom = d('drawer-opener')
    dom.setAttribute('status', status)
    dom.addEventListener('click', ev => {

        let group = target.querySelector('.drawer-group')
        if (group && group.style.display == 'initial') {
            group.style.display = 'none'
            state = undefined;
            if (callback)
                callback(false);
        } else {
            main.style.display = 'initial'
            state = ev.target.getAttribute('status')
            if (state == 'character') {
                main.style.left = '-72px'
                main.style.top = '64px'
            } else {
                main.style.top = '-100px';
                main.style.left = '50%';
            }

            target.appendChild(main)
            if (callback)
                callback(true);
        }
    })
    target.appendChild(dom);
    return dom;
}

function getState() {
    return state;
}

function close() {
    main.style.display = 'none'
    state = undefined;
}



function initSheet() {
    var sheet = document.createElement('style')
    sheet.innerHTML = `
.drawer-group{
    position: absolute;
    top: -204px;
    width: 128px;
    left: 50%;
    transform: translate(-50%,-50%);
}
.drawer {
    display:block;
    width: 128px;
    height: 128px;
    position: relative;
    border-radius: 8px;
    border: gray solid 1px;
    image-rendering: pixelated;
    touch-action: none;
    background-color: #5555;
}

.drawer-top{
position: relative;
pointer-events: none;
width: 156px;
}
.drawer-top *{
    pointer-events: initial;
}

.drawer-paint,
.drawer-trash,
.drawer-download {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    display: inline-block;
    border: gray solid 1px;
    box-sizing: border-box;
    animation: 0.2s;
}


.drawer-trash {
    border: none;
    background-position: center center;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>');
}

.drawer-download {
    border: none;
    background-size: cover;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 5v11.17l-4.88-4.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L13 16.17V5c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>');
}
.drawer-opener{
    width:48px;
    height: 48px;
    border-radius:24px !important;
    background-color: white;
    position: relative;
    display: inline-block;
    background-size: 32px;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.9 13.98l2.1 2.53 3.1-3.99c.2-.26.6-.26.8.01l3.51 4.68c.25.33.01.8-.4.8H6.02c-.42 0-.65-.48-.39-.81L8.12 14c.19-.26.57-.27.78-.02z"/></svg>');
}
.stretch-image{
    width: 64px;
    height 64px;
}
`;
    document.body.appendChild(sheet)
}


export { init, makeButton, getState, getData, setData, close }