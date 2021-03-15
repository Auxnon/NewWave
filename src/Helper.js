//THREE.Color('#808080').convertSRGBToLinear()
//import * as Render from "./Render.js";


function hexToRGB(h) {
    if(!h)
        return [0,0,0]
    if(typeof h !== 'string')
        h = h.toString(16);

    if(h.startsWith('#'))
        h = h.substring(1)
    else if(h.startsWith('0x'))
        h = h.substring(2)

    let r = 0,
        g = 0,
        b = 0;

    // 3 digits
    if(h.length == 3) {
        r = "0x" + h[0] + h[0];
        g = "0x" + h[1] + h[1];
        b = "0x" + h[2] + h[2];

        // 6 digits
    } else if(h.length == 6) {
        r = "0x" + h[0] + h[1];
        g = "0x" + h[2] + h[3];
        b = "0x" + h[4] + h[5];
    }
    let ar = [parseInt(r), parseInt(g), parseInt(b)]

    return ar;
}

function hexToRGBFloat(h) {
    let ar = hexToRGB(h);
    return ar.map(v => { return v / 256.0 })
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function rgbToBinary(r, g, b){
	return parseInt("0x" + componentToHex(r) + componentToHex(g) + componentToHex(b));
}

function rgbFloatToHex(r, g, b) {
    r = Math.floor(r * 256);
    g = Math.floor(g * 256);
    b = Math.floor(b * 256);
    return rgbToHex(r, g, b)
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = ''; //Math.random()>0.3?0x66B136:0x76610E;
    for(var i = 0; i < 6; i++) {
        let val;
        /*if(i<2)
            val=(Math.random() * 4)+4
        else if(i<4)
            val=(Math.random() * 6)+7
        else*/
        val = Math.random() * 16

        color += letters[Math.floor(val)];
    }
    return parseInt(color);
}

function testBW(rgb) {
    // http://stackoverflow.com/a/3943023/112731
    let val = (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114)
    return val > 186
}
function fp16ToRGBFloat(r,g,b){
    return [r/65535,g/65535,b/65535];
}
function fp16ToHex(r,g,b){
    return rgbFloatToHex(r/65535,g/65535,b/65535);
}/*
let marks=[];
function mark(obj){
    let group=Render.makeGroup()
    let head=Render.cubic(.05,.05,.05,0,0,0)
    let tail=Render.cubicColored(.049,.049,.4,0,0,.2,0x0f6fff)
    group.add(head)
    group.add(tail)
    group.position.x=obj.x?obj.x:0
    group.position.y=obj.y?obj.y:0
    group.position.z=obj.z?obj.z:0
    group.rotation.x=obj.rx?obj.rx:0
    group.rotation.y=obj.ry?obj.ry:0
    group.rotation.z=obj.rz?obj.rz:0
    Render.addModel(group)
    marks.push(group)
}*/
function clearMarks(){
    marks.forEach(m=>{
        Render.removeModel(m)
    })
}

export { rgbToHex,rgbToBinary, rgbFloatToHex, hexToRGB, hexToRGBFloat, getRandomColor, testBW,fp16ToRGBFloat,fp16ToHex}//mark,clearMarks }