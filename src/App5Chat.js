import * as Online from "./Online.js";

import './chatStyle.css';

//pass in name, and a pointer to a complete function which dictates everything has loaded, 
//we keep track inside the mini class by counting  resources and incrementing till count is complete then, complte()
//animate is called every render, deint... not used yet

//called at first run, plugs in all the goods
function init(index, dom, complete) {

    initChat(dom)
    Online.guest();
}

//runs every frame
function animate(delta) {

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


/*

import * as Render from "./Render.js";
import * as Control from "./Control.js";
import * as Online from "./Online.js";
import * as BarUI from "./BarUI.js";
import * as Helper from "./Helper.js";
import * as PlayerManager from "./PlayerManager.js";
import * as Drawer from "./Drawer.js"; 
import * as UI from "./UI.js";*/

var chatPane;
//var chatBlock;
var chatInput;
var chatBottom;

function initChat(mainDom) {


    chatPane = document.createElement('div');
    chatPane.classList.add('chat-pane');

    //mainDom.appendChild(chatButton);
    mainDom.appendChild(chatPane);
    //mainDom.appendChild(chatBlock);



    chatBottom = document.createElement('div');
    chatBottom.classList.add('chat-bottom');

    chatInput = document.createElement('input');
    let color = "0xffff55"; //World.getOwnPlayer().color
    color = '#' + color.substring(2, color.length);
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

    mainDom.appendChild(chatBottom)

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
            if (chatInput.value.length > 0 || Drawer.getState() == 'chat') {
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




    //setTimeout(()=>{Mail.init()},800);

}
var pastDom = null;
var pastPlayerId = -1;
var lastDom = null;
var lastPlayerId = -1

function addBubble(s, player, model) {

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
    chatBubble.innerHTML += s;


    let chatRow = document.createElement('div');
    chatRow.classList.add('chat-row')

    if (player.id == PlayerManager.getOwnPlayer().id)
        chatRow.classList.add('chat-right')

    chatBubble.classList.add('chat-bubble');
    if (lastPlayerId >= 0 && lastPlayerId == player.id) {
        if (pastPlayerId == player.id) {
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
        nameTag.innerHTML = player.username;
        let tagRow = document.createElement('div');
        if (player.id == PlayerManager.getOwnPlayer().id)
            tagRow.style.textAlign = 'right'
        //nameTag.style.background=color;
        tagRow.appendChild(nameTag);
        chatPane.appendChild(tagRow);
    }

    pastDom = lastDom;
    pastPlayerId = lastPlayerId;
    lastDom = chatBubble;
    lastPlayerId = player.id;


    chatRow.appendChild(chatBubble)
    chatPane.appendChild(chatRow)
    chatPane.scrollTop = chatPane.scrollHeight;

    return chatBubble;

}

function submit() {
    if (chatInput.value.length > 0 || Drawer.getState() == 'chat') { //redundant
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

function hook(id, message) {
    let player = PlayerManager.getUser(id) //World.getPlayer(id);
    let color = 'black'
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
    //	Control.addConfetti(window.innerWidth-30,window.innerHeight-30,225);
    if (!player)
        player = { username: 'Unknown', id: -1, color: 'black' }
    addBubble(message, player);
    BarUI.setNotifier(2, 1)
    //makeEpic('test')
}

function lastChats(chats) {
    chats.forEach(chat => {
        hook(chat[0], chat[1])
    });
    makeDivider('Last 10 messages')
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
/*
function makeDivider(message) {
    let dom = document.createElement('div');
    dom.className = 'chat-divider'
    let p = document.createElement('p');
    p.innerText = message
    dom.appendChild(p)
    chatPane.appendChild(dom)
}*/

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

function popBubble(anchor) {
    anchor.bubble.remove();
    anchor.bubble = null;
}

function updateBubble(anchor) {
    anchor.bubble
}






export { init, animate, deinit, open, close,hook, }