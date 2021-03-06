import * as THREE from "./lib/three.module.js";
import * as Render from "./Render.js";

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

//called at first run, plugs in all the goods
function init(index,dom,complete) {

}

//runs every frame
function animate(delta){

}

//unused for now, would deload everything for memory reasons
function deinit(){

}

//called when toggled to this app, on a page load with app ideally it would run init and immediately run open after
function open(){

}
//called when app is closed out for another one
function close(){

}

export {init,animate,deinit}