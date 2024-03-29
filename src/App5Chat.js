import * as Online from "./Online.js";
import * as Helper from "./Helper.js";
import { shrinkTitle } from "./Main.js";
import * as THREE from "./lib/three.module.js";

import './style/chatStyle.css';

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

//called at first run, plugs in all the goods
function init(index, dom, complete) {
    //let scene = new THREE.Scene();

    shrinkTitle();
    initChat(dom);
    Online.guest();
    //return scene;
    complete();
}

//runs every frame
function animate(delta) {
    timestampRefreshCounter += delta
    if (timestampRefreshCounter >= 4) {
        timestampRefreshCounter = 0;
        refreshTimestamps();
    }
}

//unused for now, would deload everything for memory reasons
function deinit() {

}

//called when toggled to this app, on a page load with app ideally it would run init and immediately run open after
//also passes in the canvas in case the app wants to do something wacky with it like resize it or place it somewhere else
//return true if changes were made and it wont follow the default
function open(canvas) {
    shrinkTitle();
    //if(chatInput)
    chatWrapper.style.display = ''
    chatInput.focus();
    timestampRefreshCounter = 180;
}
//called when app is closed out for another one
function close() {
    chatWrapper.style.display = 'none'
}

function adjust(pos) {
    chatWrapper.style.left = 0;
    chatWrapper.style.top = 0;
    switch (pos) {
        case 0:
            chatWrapper.style.width = 'calc(100% - 128px)';
            chatWrapper.style.height = '100%';
            chatWrapper.style.left = '128px';
            break;
        case 2:
            chatWrapper.style.width = 'calc(100% - 128px)';
            chatWrapper.style.height = '100%';
            break;
        case 3:
            chatWrapper.style.width = '100%';
            chatWrapper.style.height = 'calc(100% - 128px)';
            chatWrapper.style.top = '128px'
            break;

        default:
            chatWrapper.style.width = '100%';
            chatWrapper.style.height = 'calc(100% - 128px)';
    }
}


/*

import * as Render from "./Render.js";
import * as Control from "./Control.js";
import * as Online from "./Online.js";
import * as BarUI from "./BarUI.js";
import * as Helper from "./Helper.js";
import * as PlayerManager from "./PlayerManager.js";
import * as Drawer from "./Drawer.js"; 
import * as UI from "./UI.js";*/

let chatWrapper; //holds all chat app elements, not the canvas as usual
let chatPane; //holds only actual chat bubbles
//let chatBlock;
let chatInput; //text entry
let timestampRefreshCounter = 0;


//only matters to admin (me?)
let loginMenu;
let roomHider;
let roomSwitcher;
let roomDeleter;


function initChat(mainDom) {

    chatWrapper = div('chat-wrapper')
    chatPane = div('chat-pane');

    //mainDom.appendChild(chatButton);
    chatWrapper.appendChild(chatPane);
    chatWrapper.style.height = 'calc(100% - 128px)' //FIX should set this based on bar pos
    //mainDom.appendChild(chatBlock);



    let chatBottom = div('chat-bottom');

    chatInput = document.createElement('input');
    let color = "black"; //"0xffff55"; //World.getOwnPlayer().color
    //color = '#' + color.substring(2, color.length);
    chatInput.placeholder = "Send me a message!"
    chatInput.style.border = color + " 6px solid"
    chatBottom.appendChild(chatInput);


    //Drawer.makeButton(chatBottom,'chat')

    let sendButton = document.createElement('div')
    sendButton.className = 'chat-send-button'
    sendButton.addEventListener('click', submit)
    chatBottom.appendChild(sendButton)


    //let toggle=document.createElement('div');
    //toggle.classList.add('chatToggle');
    //bottom.appendChild(toggle);

    chatWrapper.appendChild(chatBottom)

    //chatBlock.style.left='100%';


    /*
        chatButton.addEventListener('click',function(ev){
            Control.addConfetti(window.innerWidth-30,window.innerHeight-30,225);
            openChat();
        })*/
    /*
        chatPane.addEventListener('click',function(ev){
            closeChat();
        })
    */
    chatInput.addEventListener('keyup', function(ev) {

        if (ev.which == 13) {
            if (chatInput.value.length > 0) { //|| Drawer.getState() == 'chat') {
                submit();
            } else {
                setTimeout(closeChat, 20);
            }
        } else if (ev.which == 27) {
            closeChat();
        }
    });
    /*toggle.addEventListener('click',function(ev){
        if(toggle.classList.contains('chatToggle')){
            toggle.classList.remove('chatToggle');
            toggle.classList.add('mailToggle');
        }else{
            toggle.classList.remove('mailToggle');
            toggle.classList.add('chatToggle');
        }

    })*/

    //s
    //World.socket.on('chat', chatHook);




    loginMenu = div('login-menu');
    let name = document.createElement('input')
    let pass = document.createElement('input')
    let passButton = document.createElement('button')
    pass.setAttribute('type', 'password')
    passButton.innerText = 'Submit'

    loginMenu.appendChild(name)
    loginMenu.appendChild(pass)
    loginMenu.appendChild(passButton)
    passButton.addEventListener('click', ev => {
        Online.login(name.value, pass.value)
        loginMenu.style.display = ''
    })
    roomSwitcher = div('room-switcher');
    roomSwitcher.style.display = 'none' //explicitly set this so it's easier to toggle
    roomHider = div('room-switcher-hider')
    roomHider.style.display = 'none'
    roomHider.addEventListener('click', ev => {
        wiggleElement(ev.target)

        if (roomSwitcher.style.display == 'none') {
            roomDeleter.style.display = ''
            roomSwitcher.style.display = ''
        } else {
            roomDeleter.style.display = 'none'
            roomSwitcher.style.display = 'none'
        }
    })
    roomDeleter = div('room-deleter');
    roomDeleter.style.display = 'none'
    roomDeleter.addEventListener('click', ev => {
        wiggleElement(ev.target)
        Online.deleteRoom()
    })
    mainDom.appendChild(roomDeleter)
    chatWrapper.appendChild(roomHider)

    chatWrapper.appendChild(roomSwitcher)
    mainDom.appendChild(chatWrapper)
    mainDom.appendChild(loginMenu)
}

function wiggleElement(ele) {
    ele.style.animation = '';
    void ele.offsetWidth;
    ele.style.animation = 'wiggle 0.4s';

}

function div(classname) {
    let ele = document.createElement('div')
    ele.className = classname;
    return ele;
}
var pastDom = null;
var pastPlayerName = "";
var lastDom = null;
var lastPlayerName = "";

function addBubble(s, player, timestamp) {

    let chatBubble = document.createElement('p');
    let color = player.color;
    //chatBubble.style.border=color+' solid 6px'
    chatBubble.style.backgroundColor = color;

    let bool = Helper.testBW(Helper.hexToRGB(color))

    chatBubble.style.color = bool ? '#000000' : '#FFFFFF';
    chatBubble.style.textShadow = '1px 1px 2px ' + (bool ? '#FFFFFF' : '#000000');

    let imageIndex = s.indexOf('data:image')
    if (imageIndex > -1) {
        let lastIndex = s.indexOf('#', imageIndex);
        if (lastIndex > -1) {
            let imgString = s.substring(imageIndex, lastIndex)
            console.log(imgString)
            let img = new Image();
            img.className = 'stretch-image'
            img.src = imgString;
            chatBubble.appendChild(img)
            s = s.substring(lastIndex + 1)
        }
    }

    if (s == "&&&pp&&&") {
        loginMenu.style.display = 'block'
    }

    /*let stt=s.split('');
    stt.forEach((c,i)=>{
        let sp=document.createElement('span');
        sp.style.animationDelay=(i*0.03 +Math.random()/10)+'s';
        sp.innerHTML=c;
        if(c==' ')
            sp.innerHTML='&nbsp'
        chatBubble.appendChild(sp)
    })
    setTimeout(function(){
        chatBubble.innerHTML=s;
    },(s.length*0.03+2)*1000)*/
    chatBubble.innerText += s;


    let chatRow = document.createElement('div');
    chatRow.classList.add('chat-row')

    if (player.username == Online.getUsername())
        chatRow.classList.add('chat-right')

    chatBubble.classList.add('chat-bubble');


    let chatTime = document.createElement('span');
    chatTime.className = 'chat-timestamp'
    chatTime.innerText = timeFormat(timestamp)
    chatTime.setAttribute('time', timestamp)
    if (lastPlayerName && lastPlayerName == player.username) {
        if (pastPlayerName == player.username) {
            lastDom.classList.remove("chat-bubble-footer");
            lastDom.classList.add("chat-bubble-body");
        } else {
            lastDom.classList.add("chat-bubble-header");
        }
        //lastDom.classList.remove("chatBubbleHeader","chatBubbleBody")

        chatBubble.classList.add("chat-bubble-footer");
    } else {
        let nameTag = document.createElement('p');
        nameTag.classList.add('chat-nametag');
        nameTag.innerText = player.username;
        let tagRow = document.createElement('div');
        if (player.username == Online.getUsername())
            tagRow.style.textAlign = 'right'
        //nameTag.style.background=color;
        tagRow.appendChild(nameTag);
        chatPane.appendChild(tagRow);
    }

    pastDom = lastDom;
    pastPlayerName = lastPlayerName;
    lastDom = chatBubble;
    lastPlayerName = player.username;

    if (player.username == Online.getUsername()) {
        chatRow.appendChild(chatTime);
        chatRow.appendChild(chatBubble);
    } else {
        chatRow.appendChild(chatBubble);
        chatRow.appendChild(chatTime);
    }


    chatPane.appendChild(chatRow);
    chatPane.scrollTo(0, chatPane.scrollHeight);


    return chatBubble;

}

function submit() {
    if (chatInput.value.length > 0) { //redundant
        let message = '';
        /*if (Drawer.getState() == 'chat') {
            message += Drawer.getData() + '#'
            Drawer.close();
        }*/
        message += chatInput.value;
        Online.message(message)
        chatInput.value = ''
    }
}

function hook(username, message, timestamp) {

    let player;
    let color = '#8A0';
    if (username.startsWith('Guest')) { //not bothering with user colors for now
        color = '#fff';
    } else if (username == "System") {
        color = '#f50'
    }
    /*if(player){ //TODO
        color=player.color;
        color='#'+color.substring(2,color.length);

        

        
        let anchor=addBubble(message,player,color,player.model);
        setTimeout(function(){
            anchor.bubble.remove();
            anchor.bubble=null;
        },8000)
    }*/
    //if(!Control.isMenuLocked())
    //  Control.addConfetti(window.innerWidth-30,window.innerHeight-30,225);
    if (!player)
        player = { username, id: -1, color }
    addBubble(message, player, timestamp);
    //BarUI.setNotifier(2, 1)
}

function lastChats(chats) {
    chats.forEach(chat => {
        hook(chat[1], chat[2], chat[0])
    });
    //makeDivider('Last 10 messages')
}

function openChat() {
    if (!Control.isMenuLocked()) {
        //chatBlock.style.left='0%';
        //addBubble('test text for great prosperity','red');
        //chatInput.focus();
        //Control.lockMenu(true);
    }
    chatInput.focus();
}

function closeChat() {
    //chatBlock.style.left='100%';
    chatInput.blur();
    //BarUI.closeApp();
    //Control.lockMenu(false);
}

function makeDivider(message) {
    let dom = document.createElement('div');
    dom.className = 'chat-divider';
    let p = document.createElement('p');
    p.innerText = message;
    dom.appendChild(p);
    chatPane.appendChild(dom);
    lastPlayerName = '';
    pastPlayerName = '';
}
/*
function setSize(bool) {
    if (!chatPane || !chatBottom)
        return
    if (bool) {
        chatPane.style.height = 'calc(100vh - 100px)';
        chatBottom.style.bottom = '100px'
    } else {
        chatPane.style.height = 'calc(100vh - 64px)';
        chatBottom.style.bottom = '0px'
    }
}
*/
function popBubble(anchor) {
    anchor.bubble.remove();
    anchor.bubble = null;
}

function updateBubble(anchor) {
    anchor.bubble
}

function setRooms(guests) {
    roomSwitcher.querySelectorAll('.room-button').forEach(r => {
        r.removeEventListener('click', roomClick);
        r.remove();
    })
    guests.forEach(guest => {
        let room = div('room-button');
        room.innerText = guest.room != undefined ? guest.room : "???"
        room.addEventListener('click', roomClick);
        roomSwitcher.appendChild(room);
    });
}

function roomClick(ev) {
    let t = ev.target.innerText
    if (t != "???")
        Online.switchRoom(t)
}

function clear() {
    Object.values(chatPane.children).forEach(child => {
        child.remove();
    })
}

function unhideAdmin() {
    roomHider.style.display = '';
}

function offline() {
    let banner = div('chat-banner');
    banner.innerText = 'Offline\nReload site 😵';
    chatPane.appendChild(banner);
}


function timeFormat(time) {
    let diff = (Date.now() - time) / 1000;
    let hoursRaw = diff / 3600
    let hours = Math.floor(hoursRaw)
    let minutesRaw = (hoursRaw - hours) * 60
    let minutes = Math.floor(minutesRaw)
    let seconds = Math.floor((minutesRaw - minutes) * 60)

    let finalString = hours > 0 ? hours + "hours " : ""
    finalString += minutes > 0 ? minutes + "mins " : ""
    finalString += seconds > 0 ? seconds + "secs " : ""
    if (finalString.length > 0)
        finalString += "ago"
    return finalString;
}

function refreshTimestamps() {
    let stamps = chatPane.querySelectorAll('.chat-timestamp')
    stamps.forEach(stamp => {
        let n = parseInt(stamp.getAttribute('time'))
        if (!isNaN(n))
            stamp.innerText = timeFormat(n);
    })
}




export { init, animate, deinit, open, close, adjust, hook, makeDivider, setRooms, lastChats, clear, unhideAdmin, offline }