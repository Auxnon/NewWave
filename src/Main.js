import * as Render from "./Render.js";

function init(){
	Render.init();




	var toggle=false;

	var opened=document.querySelector('#seg3');
	opened.style.width='76%';




	document.querySelectorAll(".column").forEach((c,i)=>{
		c.addEventListener('mouseover',ev=>{
			if(!c.children.length){
				/*var e = ev.toElement || ev.relatedTarget;
		        if (e.parentNode == this || e == this) {
		           return;
		        }*/


				let d;
				if(toggle)
					d=Render.getAlphaCanvas();
				else
					d=Render.getBetaCanvas();

				d.style.opacity=1;

				toggle=!toggle;

				if(d.reserved)
					d.remove();

				//d.style.opacity=1;
				c.appendChild(d);
				/*setTimeout(()=>{
					//d.style.opacity=1;
				},10);*/


			}
			if(opened!=c){
					opened.style.width='';
					opened=c;
					if(i<4)
					opened.style.width='76%';

				Render.flipScene(i);
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