(window.webpackJsonp=window.webpackJsonp||[]).push([[5],[function(t,e,n){"use strict";let o,i,l;function a(t){var e;(e=document.createElement("style")).innerHTML='\n\t\t.uiSysTop{\n\t\tdisplay: flex;\n\t\talign-items: flex-start;\n\t\tposition: relative;\n\t\tmax-width: 600px;\n\t\theight: 64px;\n\t\tborder-radius: 32px;\n\t\ttransform: translate(-50%);\n\t\tbox-shadow: 3px 3px 3px #0005;\n\t\tleft: 50%;\n\t\tbackground: #E0F9D5;\n\t\tmargin: 12px;\n\t\tanimation: uiSysUnfold 1s;\n\t\toverflow: hidden;\n\t\tline-height: 16px;\n\t}\n\t.uiSysTop div{\n\n\t\tmargin: 16px;\n\t\tmargin-left: 0px;\n\t\tflex: 0 0 64px;\n\t}\n\t.uiSysTop span{\n\t\tmargin-right: 48px;\n\t\tmargin-top: 8px;\n\t\tline-height: normal;\n\t\tvertical-align: middle;\n\t\tflex: 1;\n\n\t}\n\t@keyframes uiSysUnfold{\n\t\t0%{\n\t\t\tmax-width: 64px;\n\t\t\ttop: -64px;\n\t\t\topacity: 0.2;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t\ttop:0px;\n\t\t\topacity: 1;\n\t\t}\n\t\t100%{\n\t\t\ttop: 0px;\n\t\t}\n\t}\n\t@keyframes uiSysFold{\n\t\t100%{\n\t\t\tmax-width: 64px;\n\t\t\ttop: -64px;\n\t\t\topacity: 0.2;\n\t\t\theight: 0;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t\ttop:0px;\n\t\t\topacity: 1;\n\t\t}\n\t\t0%{\n\t\t\ttop: 0px;\n\n\t\t}\n\t}\n\t@keyframes uiSysMini{\n\t\t100%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\n\t\t}\n\t\t0%{\n\t\t\t\n\t\t}\n\t}\n\t@keyframes uiSysMax{\n\t\t0%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t50%{\n\t\t\tmax-width: 64px;\n\t\t}\n\t\t100%{\n\t\t\tleft: 50%;\n\t\t}\n\t}\n\n\t.uiHolderSysTop{\n\t\twidth: 600px;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 50%;\n\t\ttransform: translate(-50%);\n\t\t/*border: 3px #0999 dotted;*/\n\t\ttransition: height 1s;\n\t}\n\t.uiIcon{\n\t\tfloat: left;\n\t\twidth: 32px;\n\t\theight: 32px;\n\t\tbackground-repeat: no-repeat;\n\t    background-size:32px;\n\t    background-position: center center;\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>\');\n\t}\n\t.uiIconWarning{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>\') !important;\n\t}\n\t.uiIconError{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>\') !important;\n\t}\n\t.uiIconNet{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/></svg>\') !important;\n\t}\n\t.uiIconPerson{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>\') !important;\n\t\t\n\t}\n\t.uiIconTime{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>\') !important;\n\t}\n\n\t.uiIconSuccess{\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>\') !important;\n\t}\n\t\n\t.uiCloseButton{\n\t\tposition: absolute;\n\t\tright: 0;\n\t\twidth: 24px;\n\t\theight: 24px;\n\t\tbackground-repeat: no-repeat;\n\t    background-size:16px;\n\t    background-position: center center;\n\t\tbackground-image: url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>\');\n\t\t\n\t}\n\n\t.uiCursorMessage{\n\t\tmin-width: 64px;\n\t\theight: 64px;\n\t\tborder: 5px solid white;\n\t\tbackground-color: #FBAB7E;\n\t\tbackground-image: linear-gradient(270deg, #FBAB7E 0%, #F7CE68 100%);\n\n\t\tcolor: white;\n\t\tfont-size: 24px;\n\t\tfont-weight: bold;\n\t\tfont-stretch: ultra-condensed;\n\t\ttransform: translate(-50%,-50%);\n\t\tanimation: uiWobble 0.3s;\n\t\tborder-radius: 32px;\n\t\tbox-sizing: border-box;\n\t\tposition: absolute;\n\t\tline-height: 48px;\n\t\tpadding: 0 8px 0 8px;\n\t\tfont-family: sans-serif;\n\t}\n\n\t@keyframes uiWobble{\n\t\t0%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.6,0.4);\n\t\t}\n\t\t33%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.9,1.15);\n\t\t}\n\t\t66%{\n\t\t\ttransform: translate(-50%,-50%) scale(0.8,0.9);\n\t\t}\n\t\t100%{\n\n\t\t}\n\t}\n\n\t@keyframes uiFade{\n\t\t0%{\n\t\t\topacity: 1;\n\t\t\ttransform: translate(-50%,-50%);\n\t\t}\n\t\t100%{\n\t\t\topacity: 0;\n\t\t\ttransform: translate(-50%,0%)\n\t\t}\n\t}\n\n\t',document.body.appendChild(e),t?o=t:(o=document.querySelector("#main"),o||(o=document.body)),o?(i=document.createElement("duv"),i.className="uiHolderSysTop",o.appendChild(i),l=document.createElement("input"),l.type="text",l.style.position="fixed",l.taxindex="-1",l.style.display="none",l.style.pointerEvents="none",o.appendChild(l)):console.error("UI.js:: uh oh! no system dom element found"),window.addEventListener("keyup",(function(t){if(32==t.keyCode){let t=Math.random(),e=t>.2?t>.4?t>.6?"warn":"error":"person":"time";s(function(t){let e="",n=20*Math.random();for(let o=0;o<n;o++)e+=t;return e}("this is a test "),e)}else 90==t.keyCode?DEVVAR=s("No network connection oh darrrrrrn \n We'll keep tryna connect in the background ;)","net",!0):27==t.keyCode&&DEVVAR.remove()}))}function s(t,e,n){let a=document.createElement("div");a.className="uiSysTop";let s=document.createElement("div"),r=" ";if("object"==typeof e&&null!==e)e.type&&(r+=e.type),e.color&&(a.style.backgroundColor=e.color);else switch(e){case"warn":r+="uiIconWarning",a.style.backgroundColor="#EFEF79";break;case"error":r+="uiIconError",a.style.backgroundColor="#D25E5E";break;case"net":r+="uiIconNet",a.style.backgroundColor="#FFC65E";break;case"person":r+="uiIconPerson",a.style.backgroundColor="#D257FF";break;case"time":r+="uiIconTime",a.style.backgroundColor="#5094D9";break;case"success":r+="uiIconSuccess",a.style.backgroundColor="#95F17F"}s.className="uiIcon"+r;let d=document.createElement("span");function p(){a.style.animation=n?"0.5s uiSysMini forwards":"0.5s uiSysFold forwards",setTimeout((function(){n?(a.style.position="absolute",a.style.left="-64px",a.addEventListener("click",(function(t){a.style.animation="0.5s uiSysMax forwards",setTimeout((function(){a.style.animation="0.5s uiSysMini forwards"}),3500)}))):a.remove()}),500)}if(d.innerText=t,d.addEventListener("click",(function(t){!function(t){l.value=t.innerText,l.style.display="block",l.select(),document.execCommand("copy"),l.blur(),l.style.display="none"}(d),function(t,e,n){let i=document.createElement("div");i.className="uiCursorMessage",i.style.left=t+"px",i.style.top=e+"px",i.innerText=n,o.appendChild(i),setTimeout((function(){i.style.animation="1s uiFade forwards",setTimeout((function(){i.remove()}),1e3)}),1500)}(t.clientX,t.clientY,"Copied")})),a.appendChild(s),a.appendChild(d),!n){let t=document.createElement("div");t.className="uiCloseButton",a.appendChild(t),t.addEventListener("click",(function(t){p()}))}return setTimeout((function(){p()}),3500),i.appendChild(a),a}var r;n.r(e),n.d(e,"pendApp",(function(){return X})),n.d(e,"clearPendApp",(function(){return Y}));const d=[t=>{Promise.all([n.e(0),n.e(1)]).then(n.bind(null,8)).then(t)},t=>{Promise.all([n.e(0),n.e(2)]).then(n.bind(null,9)).then(t)},t=>{Promise.all([n.e(0),n.e(3)]).then(n.bind(null,10)).then(t)}];var p,c,h,u,y,x,m,g,f,w,v,b,k=!1,M=1,C=0,E=0,z=!1,H=1,S=void 0,I={x:0,y:0};function L(t){let e=p[t];e&&(e.classList.add("appMax"),e.focused=!0,e.style.zIndex=0,r?T(t,e):(v=t,X(t)),m=e)}function T(t,e){let n=r.getAlphaCanvas();n.style.opacity=1,n.remove();let o=document.querySelector("#afterImage");o.remove(),e.appendChild(n),m?(m.appendChild(o),o.style.opacity=1,setTimeout(()=>{o.style.opacity=0},1)):(o.style.opacity=0,0==e?p[1].appendChild(o):p[0].appendChild(o)),r.bufferPrint(),r.flipScene(t)}function B(t){if(m&&(m.classList.remove("appMax"),m.style.zIndex=2,m.focused=void 0,window.history.pushState({},"","/"),!t&&r)){let t=r.getAlphaCanvas();setTimeout(()=>{t.style.opacity=0},1),t.style.opacity=1}}function F(){clearTimeout(b),b=setTimeout((function(){c.setAttribute("width",window.innerWidth+"px"),c.setAttribute("height",window.innerHeight+"px"),V(),r&&r.resize(),s("inner "+window.innerWidth+"; screen "+window.screen.width,"success")}),250)}function q(t){let e=0,n=[],o=0==M||2==M;t?(e=p.length,n=p):p.forEach(t=>{-1!=t.spot&&(n.push(t),e++)}),o?(u.style.height=64*(e>0?e:1)+"px",u.style.width="64px"):(u.style.width=64*(e>0?e:1)+"px",u.style.height="64px");let i=u.getBoundingClientRect();y=i;let l,a=i.width,s=i.height;l=o?s/e:a/e,t||(o?n.sort((function(t,e){return parseInt(t.style.top)-parseInt(e.style.top)})):n.sort((function(t,e){return parseInt(t.style.left)-parseInt(e.style.left)})));for(let r=0;r<e;r++)g[r]=o?{x:i.left+a/2,y:32+i.top+r*l}:{x:32+i.left+r*l,y:i.top+s/2},S&&S==n[r]&&(I=g[r]),t&&(p[r].spot=r,g[r].app=n[r]),R(n[r],g[r].x,g[r].y);if(-1==H){let t=barHandle.getBoundingClientRect();if(o){let e=t.left+t.width/2;D({x:e,y:t.top},{x:e,y:t.bottom})}else{let e=t.top+t.height/2;D({x:t.left,y:e},{x:t.right,y:e})}}}function A(){if(H>-1)if(H<4){if(H){let t={},e=barHandle.getBoundingClientRect(),n={x:e.width/2,y:e.height/2};if(0==M||2==M)switch(H){case 3:t={x:e.left+n.x,y:e.top};break;case 2:t={x:e.left+n.x,y:e.top+n.y};break;default:t={x:e.left+n.x,y:e.bottom}}else switch(H){case 3:t={x:e.left,y:e.top+n.y};break;case 2:t={x:e.left+n.x,y:e.top+n.y};break;default:t={x:e.right,y:e.top+n.y}}let o=f.x-t.x,i=f.y-t.y,l=Math.sqrt(o*o+i*i);f.x-=o/2,f.y-=i/2,l<1&&H<4&&H++}let t={x:f.x-w[0].x,y:f.y-w[0].y},e=Math.sqrt(t.x*t.x+t.y*t.y);if(e>40){let n;n=H>1?{x:f.x,y:f.y}:{x:f.x-20*(z?1:-1)*t.y/e,y:f.y+20*(z?1:-1)*t.x/e};Math.abs(t.x)>Math.abs(t.y)?t.x:t.y;z=!z,W(n)}}else{if(H%5==1){let t=w.shift();console.log("chop off points "+w.length),w.length<=3?(H=-1,q()):W(t)}-1!=H&&H++}requestAnimationFrame(A)}function W(t){let e="M"+f.x+" "+f.y,n={x:t.x,y:t.y};for(let t=0;t<w.length;t++){let o=(w[t].y-n.y)/2,i=(w[t].x-n.x)/2,l=n.x+i,a=n.y+o;e+="Q"+n.x+" "+n.y+" "+l+" "+a;let s={x:w[t].x,y:w[t].y};w[t]={x:n.x,y:n.y},n=s}h.setAttribute("d",e)}function D(t,e){let n="M"+t.x+" "+t.y+"L"+e.x+" "+e.y;h.setAttribute("d",n)}function P(t){if(function(t){if(k){C++;let e=t.clientX,n=t.clientY,o=e-window.innerWidth/2,i=n-window.innerHeight/2,l=Math.atan2(i,o)/Math.PI,a=Math.abs(l);a<.25?2!=M&&(M=2,V()):a<.75?l<0?3!=M&&(M=3,V()):1!=M&&(M=1,V()):0!=M&&(M=0,V())}}(t),S){if(C++,S.pos={x:t.clientX+S.offset.x,y:t.clientY+S.offset.y},t.clientY>y.top&&t.clientY<y.bottom&&t.clientX>y.left&&t.clientX<y.right){let t=I,e={x:t.x-S.pos.x,y:t.y-S.pos.y};S.pos={x:t.x-e.x/3,y:t.y-e.y/3},S.moving&&(S.moving=void 0,S.spot=0,q())}else S.moving||(S.moving=!0,S.spot=-1,q());S.style.left=S.pos.x+"px",S.style.top=S.pos.y+"px"}else 0==H&&(E>2&&(E=0,f={x:t.clientX,y:t.clientY}),E++)}function V(){2==M?(u.style.left=window.innerWidth-64+"px",u.style.top="50%",q(),barHandle.style.transform="translate(-200%,-50%)",barHandle.style.width="32px",barHandle.style.height="80%",x.style.top="28px"):3==M?(barHandle.style.transform="translate(-50%,100%)",u.style.left="50%",u.style.top="64px",x.style.top="calc(100% - 128px)",q(),barHandle.style.height="32px",barHandle.style.width="80%"):1==M?(barHandle.style.transform="translate(-50%,-200%)",u.style.left="50%",u.style.top=window.innerHeight-64+"px",x.style.top="28px",q(),barHandle.style.height="32px",barHandle.style.width="80%"):(barHandle.style.transform="translate(100%,-50%)",u.style.left="64px",u.style.top="50%",q(),barHandle.style.width="32px",barHandle.style.height="80%",x.style.top="28px")}function N(t){k&&(k=!1,H=1,console.log(C),C<10&&B()),S?(S.classList.remove("appMove"),console.log(C),C<10?m&&m==S?(S.classList.remove("appMax"),S.focused=void 0,m=void 0,S.style.zIndex=2,window.history.pushState({},"","/")):(B(!0),L(S.appId),window.history.pushState({appId:S.appId},S.name,"?id="+S.appId+"&app="+S.id)):(q(),console.log("fix bar also"))):(q(),console.log("fix bar")),S=void 0,C=0}function R(t,e,n,o){o||(t.pos={x:e,y:n}),t.style.left=e+"px",t.style.top=n+"px"}function X(t){let e=p[t],n=e.querySelector("cube");n||(n=document.createElement("cube"),e.appendChild(n))}function Y(t){let e=p[t].querySelector("cube");e&&e.remove()}!function(t){let e=document.querySelectorAll(".app");p=[],e.forEach(t=>{p.push(t)}),p.forEach((t,e)=>{t.style.top=Math.random()*window.innerWidth+"px",t.style.left=Math.random()*window.innerHeight+"px",t.offset={x:0,y:0},t.appId=e,t.addEventListener("pointerdown",e=>{!function(t,e){t.focused||(S=t,t.pos={x:parseInt(t.style.left),y:parseInt(t.style.top)},I={x:t.pos.x,y:t.pos.y},t.offset={x:t.pos.x-e.clientX,y:t.pos.y-e.clientY},t.classList.add("appMove"),t.moving=void 0)}(t,e)}),t.addEventListener("dragstart",t=>{t.preventDefault()})}),window.addEventListener("pointerup",N),h=document.querySelector("path"),c=document.querySelector("svg"),x=document.querySelector("#mainTitle"),f={x:window.innerWidth/2,y:-200},window.addEventListener("resize",F),function(){w=[];for(let t=0;t<10;t++)w.push({x:f.x,y:f.y})}(),window.addEventListener("pointermove",P),function(){u=document.querySelector("#bar");let t=document.querySelector("#barHandle");t.addEventListener("pointerdown",t=>{y.left,y.top;if(k=!0,w.length<10){let t=w[0],e=Array(7).fill(t);w=e.concat(w)}H=0}),t.addEventListener("dragstart",t=>{t.preventDefault()}),g=[],t.style.transform="translate(-50%,-200%)",u.style.left="50%",u.style.top=window.innerHeight-64+"px",q(!0)}(),F(),A(),setInterval(()=>{p.forEach(t=>{if(!t.focused){let e=t.getBoundingClientRect(),n=e.left,o=e.top,i=(e.right-e.left)/2,l=(e.bottom-e.top)/2;n<0?t.style.left=i+"px":n>window.innerWidth-2*i&&(t.style.left=window.innerWidth-i+"px"),o<0?t.style.top=l+"px":o>window.innerHeight-2*l&&(t.style.top=window.innerHeight-l+"px")}})},3e3);let o=document.querySelector("#brightness");if(o.addEventListener("click",t=>{o.classList.contains("brightnessDark")?(document.body.style.backgroundColor="black",document.body.style.stroke="white",x.style.border="white 5px solid",x.style.stroke="white"):(document.body.style.backgroundColor="white",document.body.style.stroke="black",x.style.border="black 5px solid",x.style.stroke="black"),o.classList.toggle("brightnessDark")}),window.location.search.length){let t=new URLSearchParams(window.location.search).get("id");t&&t.length&&L(parseInt(t))}Promise.all([n.e(0),n.e(4)]).then(n.bind(null,2)).then(t=>{(r=t).init(d,v),console.log("3d Renderer loaded"),null!=v&&T(v,p[v])}),a(document.querySelector("#main"))}()}],[[0,6]]]);