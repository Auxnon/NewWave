 //import io from "socket.io-client"
 import * as io from './lib/socket.io.js';
 import * as Main from "./Main.js";
 import * as UI from "./UI.js";
 import * as Chat from "./App5Chat.js";

 let socket;

 let physReady = false;
 let pendingLogin;
 let username;
 let currentRoom;

 function initSocket() {
     try {

         window.sysMessage = sysMessage //should only work for an 'admin' anyway
         window.deleteAllRooms = deleteAllRooms;

         console.log('trying auth...');
         pendingLogin = UI.systemMessage('attempting communications...', 'net', true)
         socket = io('/oneshot')
         /*.connect('', { //,{transports: ['websocket'],secure: true}
             reconnection: true,
             reconnectionAttempts: 10
         });*/
         //socket = io(':443/dand-dev')

         /*&'makeavoy.com',{
             transports: ['websocket','xhr-polling']
         });*/
         //.connect('/dand-dev',{ secure: true, transports: [ "flashsocket","polling","websocket" ] });
         //https://makeavoy.com/dand-dev
         //'/dand-dev',{transports: ['websocket']}
         //socket = io('/dand-dev',{transports: ['websocket'],secure: true});


         socket.on('connect', function() {
             //Login.hide();
             console.log('connected')
             socket.emit('joined')
             if (pendingLogin)
                 pendingLogin.remove();
             pendingLogin = undefined;
         });

         socket.on('disconnect', function(data) {
             console.log('disconnected ', data)
             if (data.includes('disconnect')) {
                 //Login.show();
                 //socket.io.opts.reconnection = false;
                 UI.systemMessage('Disconnected! Trying refreshing ♥', 'net')
                 Chat.clear();
                 Chat.offline();
             } else {
                 pendingLogin = UI.systemMessage('lost connection, attempting reconnection...', 'net', true)
                 /*socket.connect('', {
                     reconnection: true,
                     reconnectionAttempts: 10
                 });*/
             }
         });

         socket.on('message', function(username, m, timestamp) {
             Chat.hook(username, m, timestamp)
         });
         socket.on('join', function(name) {
             Chat.makeDivider(name + " joined the room");
         })
         socket.on('leave', function(name) {
             Chat.makeDivider(name + " left the room");
         })
         socket.on('guest', function(name) {
             username = name;
         });
         socket.on('admin', function(name, guests,conversation) {
            username = name;
             Chat.setRooms(guests);
             if (guests && guests.length) {
                 let options = {
                     body: ("You now have " + guests.length + " guests!"),
                     icon: './favicon-32x32.png',
                     //link: 'https://Staddy.makeavoy.com'
                 };
                 let notification = new Notification("You now have " + guests.length + " guests!", options);
             }
             if (conversation && conversation.length)
                 Chat.lastChats(conversation)

             
             Chat.unhideAdmin()
         })
         socket.on('switched', function(room, conversation) {
             Chat.clear();

             if (conversation && conversation.length)
                 Chat.lastChats(conversation)
             Chat.makeDivider('Joined ' + room)
         })


         /*
         socket.on('join', function(username) {
             Chat.makeDivider(username + ' has joined!')
         });*/

         socket.on('sysMessage', function(m, type) {
             console.log('sysMessage ', m, type)
             UI.systemMessage(m, type)
         })

         //lastChats();
     } catch (err) {
         UI.systemMessage("Stage2 Auth: " + err, 'error');
         console.log('test')
     }
 }

 function guest() {
     initSocket();
 }

 function login(username, pass) {
     /*let username=document.querySelector('#username').value
     let pass=document.querySelector('#password').value*/
     fetch('/login', {
         method: 'post',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify({ username: username, password: pass })
     }).then(function(response) {
         if (!response.ok) {

             UI.systemMessage(response.status + ":" + response.statusText, 'warn')

             return undefined;
         } else
             return response.json();
     }).then(function(data) {
         if (data) {
             //UI.systemMessage(data.message, 'success')
             //PlayerManager.setOwnPlayer(data.id)
             //initSocket();
         }
     }).catch(e => {
         UI.systemMessage(e, 'error')
         console.error('ERROR ', e);
     });
 }
 /*
  function lastChats() {
      fetch('/lastChats', {
          method: 'post',
          headers: {
              'Content-Type': 'application/json'
          },
          //body: JSON.stringify({ username: username, password: pass })
      }).then(function(response) {
          if (!response.ok) {
              return undefined;
          } else
              return response.json();
      }).then(function(data) {
          if (data) {
              Chat.lastChats(data.array)
          }
      }).catch(e => {
          UI.systemMessage(e, 'error')
          console.error('ERROR ', e);
      });
  }*/

 function message(string) {
     socket.emit('message', string);
 }

 function m(st) {
     if (!st)
         st = 'test'
     socket.emit('message', st);
 }

 function sysMessage(m, type) {
     socket.emit('sysMessage', m, type);
 }

 function getUsername() {
     return username;
 }

 function switchRoom(room) {
     currentRoom = room;
     socket.emit('switch', room);
 }

 function deleteAllRooms() {
     UI.systemMessage('DELETING ALL ROOMS ', 'person')
     socket.emit('deleteAllRooms')
 }

 function deleteRoom() {
     if (currentRoom) {
         UI.systemMessage('deleting room ' + currentRoom, 'person')
         socket.emit('deleteRoom', currentRoom)
         Chat.clear();
     }

 }

 export { guest, login, message, getUsername, switchRoom,deleteRoom }