//version 2


let main;
let sysTop;
let textDump;

function init(mainDom){

	styleInit();
	if(mainDom){
		main=mainDom
	}else{
		main=document.querySelector("#main")
		if(!main)
			main=document.body
	}


	if(main){
		sysTop=document.createElement('duv');
		sysTop.className='uiHolderSysTop';
		main.appendChild(sysTop);

		//systemMessage(_spam('this is a test'))
		

		textDump=document.createElement('input')
		textDump.type='text'
		textDump.style.position='fixed'

		textDump.taxindex='-1'			
		textDump.style.display='none'
		textDump.style.pointerEvents= 'none';

		main.appendChild(textDump)

	}else{
		console.error('UI.js:: uh oh! no system dom element found')
	}


	//dev
	window.addEventListener('keyup',function(ev){
		if(ev.keyCode==32){
			let v=Math.random();
			let type=v>0.2?v>0.4?v>0.6?'warn':'error':'person':'time';
			
			systemMessage(_spam('this is a test '),type)
		}else if(ev.keyCode==90){
			DEVVAR=systemMessage('No network connection oh darrrrrrn \n We\'ll keep tryna connect in the background ;)','net',true)
		}else if(ev.keyCode==27){
			DEVVAR.remove();
		}
	})

} 

function systemMessage(m,type,persistant){
	let dom=document.createElement('div');
	dom.className='uiSysTop';

	let icon=document.createElement('div');
	let extra=' ';

	if(typeof type === 'object' && type !== null){
		if(type.type)
			extra+=type.type
		if(type.color)
			dom.style.backgroundColor=type.color
	}else{
		switch(type){
			case 'warn': extra+='uiIconWarning'; dom.style.backgroundColor='#EFEF79';break;
			case 'error': extra+='uiIconError'; dom.style.backgroundColor='#D25E5E';break;
			case 'net': extra+='uiIconNet'; dom.style.backgroundColor='#FFC65E';break;
			case 'person': extra+='uiIconPerson'; dom.style.backgroundColor='#D257FF';break;
			case 'time': extra+='uiIconTime'; dom.style.backgroundColor='#5094D9';break;
			case 'success': extra+='uiIconSuccess'; dom.style.backgroundColor='#95F17F';break;
		}
	}

	
	icon.className='uiIcon'+extra;
	let span=document.createElement('span');
	span.innerText=m;

	span.addEventListener('click',function(ev){
		_copyText(span)
		cursorMessage(ev.clientX,ev.clientY,'Copied');
	})

	dom.appendChild(icon);
	dom.appendChild(span);


	function _endMessage() {
		dom.style.animation=persistant?'0.5s uiSysMini forwards':'0.5s uiSysFold forwards';
		setTimeout(function(){
			if(persistant){
				dom.style.position='absolute'
				dom.style.left='-64px'
				dom.addEventListener('click',function(ev) {
					dom.style.animation='0.5s uiSysMax forwards';
					setTimeout(function(){
						dom.style.animation='0.5s uiSysMini forwards';
					},3500)
				})
			}else{
				dom.remove();
			}

		},500);
	}
	if(!persistant){
		let closeButton=document.createElement('div');
		closeButton.className='uiCloseButton';
		dom.appendChild(closeButton);

		closeButton.addEventListener('click',function(ev){
			_endMessage();
		})
	}

	setTimeout(function(){
		_endMessage();
	},3500)

	sysTop.appendChild(dom);
	return dom;
}

function cursorMessage(x,y,message){
	let dom=document.createElement('div');
	dom.className='uiCursorMessage';
	dom.style.left=x+'px'
	dom.style.top=y+'px'
	dom.innerText=message;
	main.appendChild(dom);
	setTimeout(function(){
		dom.style.animation='1s uiFade forwards'
		setTimeout(function(){
			dom.remove();
		},1000)
	},1500)
}



function _spam(m){
	let st='';
	let max=Math.random()*20
	for(let i=0;i<max;i++){
		st+=m;
	}
	return st;
}
function _copyText(dom){
	textDump.value=dom.innerText;
	textDump.style.display='block'
	textDump.select();
		//_copyText.setSelectionRange(0, 99999); /*For mobile devices*/

	document.execCommand("copy");
	textDump.blur();
	textDump.style.display='none'
	
}

function styleInit(){
	var sheet = document.createElement('style')
	sheet.innerHTML =`
		.uiSysTop{
		display: flex;
		align-items: flex-start;
		position: relative;
		max-width: 600px;
		height: 64px;
		border-radius: 32px;
		transform: translate(-50%);
		box-shadow: 3px 3px 3px #0005;
		left: 50%;
		background: #E0F9D5;
		margin: 12px;
		animation: uiSysUnfold 1s;
		overflow: hidden;
		line-height: 16px;
	}
	.uiSysTop div{

		margin: 16px;
		margin-left: 0px;
		flex: 0 0 64px;
	}
	.uiSysTop span{
		margin-right: 48px;
		margin-top: 8px;
		line-height: normal;
		vertical-align: middle;
		flex: 1;

	}
	@keyframes uiSysUnfold{
		0%{
			max-width: 64px;
			top: -64px;
			opacity: 0.2;
		}
		50%{
			max-width: 64px;
			top:0px;
			opacity: 1;
		}
		100%{
			top: 0px;
		}
	}
	@keyframes uiSysFold{
		100%{
			max-width: 64px;
			top: -64px;
			opacity: 0.2;
			height: 0;
		}
		50%{
			max-width: 64px;
			top:0px;
			opacity: 1;
		}
		0%{
			top: 0px;

		}
	}
	@keyframes uiSysMini{
		100%{
			max-width: 64px;
		}
		50%{
			max-width: 64px;

		}
		0%{
			
		}
	}
	@keyframes uiSysMax{
		0%{
			max-width: 64px;
		}
		50%{
			max-width: 64px;
		}
		100%{
			left: 50%;
		}
	}

	.uiHolderSysTop{
		width: 600px;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%);
		/*border: 3px #0999 dotted;*/
		transition: height 1s;
	}
	.uiIcon{
		float: left;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
	    background-size:32px;
	    background-position: center center;
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"/></svg>');
	}
	.uiIconWarning{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>') !important;
	}
	.uiIconError{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>') !important;
	}
	.uiIconNet{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z"/></svg>') !important;
	}
	.uiIconPerson{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') !important;
		
	}
	.uiIconTime{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>') !important;
	}

	.uiIconSuccess{
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>') !important;
	}
	
	.uiCloseButton{
		position: absolute;
		right: 0;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
	    background-size:16px;
	    background-position: center center;
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
		
	}

	.uiCursorMessage{
		min-width: 64px;
		height: 64px;
		border: 5px solid white;
		background-color: #FBAB7E;
		background-image: linear-gradient(270deg, #FBAB7E 0%, #F7CE68 100%);

		color: white;
		font-size: 24px;
		font-weight: bold;
		font-stretch: ultra-condensed;
		transform: translate(-50%,-50%);
		animation: uiWobble 0.3s;
		border-radius: 32px;
		box-sizing: border-box;
		position: absolute;
		line-height: 48px;
		padding: 0 8px 0 8px;
		font-family: sans-serif;
	}

	@keyframes uiWobble{
		0%{
			transform: translate(-50%,-50%) scale(0.6,0.4);
		}
		33%{
			transform: translate(-50%,-50%) scale(0.9,1.15);
		}
		66%{
			transform: translate(-50%,-50%) scale(0.8,0.9);
		}
		100%{

		}
	}

	@keyframes uiFade{
		0%{
			opacity: 1;
			transform: translate(-50%,-50%);
		}
		100%{
			opacity: 0;
			transform: translate(-50%,0%)
		}
	}

	`
	document.body.appendChild(sheet);
}

export {init,systemMessage,cursorMessage}