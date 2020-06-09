import * as Render from "./Render.js";

function init(){
	Render.init();




	var toggle=false;

	var opened=document.querySelector('#seg3');




	document.querySelectorAll(".column").forEach((c,i)=>{
		c.addEventListener('mouseover',ev=>{
			if(!c.children.length){
				/*var e = ev.toElement || ev.relatedTarget;
		        if (e.parentNode == this || e == this) {
		           return;
		        }*/


				


				

				/*if(d.reserved)
					d.remove();

				
				c.appendChild(d);*/

				/*setTimeout(()=>{
					//d.style.opacity=1;
				},10);*/

			}
			if(opened!=c){
				let d=Render.getAlphaCanvas();
				d.style.opacity=1;
				d.remove();
				let afterImage=document.querySelector('#afterImage');
				afterImage.remove();

				c.appendChild(d);
					
				opened.appendChild(afterImage);
				afterImage.style.opacity=1;
				setTimeout(()=>{afterImage.style.opacity=0;},1);
				opened.classList.remove('openedColumn');
				Render.bufferPrint();
				opened=c;
				//if(i<4)
				opened.classList.add('openedColumn');

				Render.flipScene(i);

				let mainTitle=document.querySelector('#mainTitle');
				if(mainTitle)
					mainTitle.style.left=window.innerWidth*(0.38 + i*0.06)+'px' //half 76% + offset of tabs
			}
		});

		c.addEventListener('mouseout',ev=>{
			if(c.children.length){
				//c.firstChild.style.opacity=0;
				//setTimeout(()=>{c.firstChild.remove()},1000)
			}
		})
	})

}init();