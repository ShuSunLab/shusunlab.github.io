(() => {
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
/* Original procedural concept scene. No research data or model output is used. */
const canvas = $('#world-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let mode = 'scene', paused = reducedMotion.matches, visible = true, animationId = null, phase = 0, previousTime = 0;
const blocks = [
  [-4.3,-2.8,1.6,1.5,1.1],[-1.7,-3.3,1.5,1.8,2.3],[1,-3.1,1.4,1.6,1.1],[3.2,-2.8,1.1,1.6,1.8],
  [-4.4,.2,1.4,1.5,.7],[-1.5,-.2,1.7,1.8,.5],[1.6,.0,1.1,1.2,2.7],[3.3,.4,.9,1.2,1.2],
  [-3.9,2.9,1.1,1.1,1.5],[-1.6,2.8,1.5,1.3,1.1],[1.0,3.1,1.6,1.2,.6]
];
let cw = 500, ch = 375;
function project(x,y,z) { const angle = .72 + Math.sin(phase * .15) * .09; const rx=x*Math.cos(angle)-y*Math.sin(angle), ry=x*Math.sin(angle)+y*Math.cos(angle); const scale=Math.min(cw/14,ch/10); return [cw*.5+rx*scale,ch*.57+ry*scale*.43-z*scale*.85]; }
function line(a,b,color,width=1) { const p=project(...a),q=project(...b);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke(); }
function polygon(points,fill,stroke) { ctx.beginPath(); points.forEach((p,i)=>{const a=project(...p);if(i===0)ctx.moveTo(...a);else ctx.lineTo(...a);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();} }
function dot(x,y,z,color,radius=1) { const p=project(x,y,z);ctx.fillStyle=color;ctx.beginPath();ctx.arc(p[0],p[1],radius,0,Math.PI*2);ctx.fill(); }
function drawScene() {
  if(!ctx)return;ctx.clearRect(0,0,cw,ch);
  for(let i=-6;i<=6;i++) {line([i,-6,0],[i,6,0],'#98b69520',.6);line([-6,i,0],[6,i,0],'#98b69520',.6);}
  polygon([[-5.6,-5.1,.02],[5.2,-5.1,.02],[5.2,5.2,.02],[-5.6,5.2,.02]],'#8caa7410','#9fbd8c40');
  blocks.slice().sort((a,b)=>(a[0]+a[1])-(b[0]+b[1])).forEach(([x,y,w,d,h],i)=>{
    if(mode==='points') {
      for(let u=0;u<=w;u+=.16)for(let v=0;v<=d;v+=.16)dot(x+u,y+v,h,i%3===0?'#edaa6e':'#c5d5aa',.8);
      for(let z=0;z<h;z+=.18){for(let u=0;u<=w;u+=.18)dot(x+u,y+d,z,'#90ad83',.7);for(let v=0;v<=d;v+=.18)dot(x+w,y+v,z,'#c0c7a0',.7);}
    } else {
      const dep=mode==='depth';const hue=dep?Math.round(17+i*8):90;
      const top=dep?'hsl('+hue+' 57% 66%)':'#b2c69a';const left=dep?'hsl('+hue+' 45% 40%)':'#5c7b59';const right=dep?'hsl('+hue+' 50% 51%)':'#82996e';const edge=dep?'#ffe1b74d':'#d3e3b54d';
      polygon([[x,y,0],[x,y+d,0],[x,y+d,h],[x,y,h]],left,edge);
      polygon([[x,y+d,0],[x+w,y+d,0],[x+w,y+d,h],[x,y+d,h]],left,edge);
      polygon([[x+w,y,0],[x+w,y+d,0],[x+w,y+d,h],[x+w,y,h]],right,edge);
      polygon([[x,y,h],[x+w,y,h],[x+w,y+d,h],[x,y+d,h]],top,edge);
      if(!dep){for(let k=.25;k<w;k+=.35)line([x+k,y+.1,h+.02],[x+k,y+d-.1,h+.02],'#46624d55',.5);}
    }
  });
  const route=[[-4.8,2.2,.1],[-2.5,2.2,.1],[-2.5,1.8,.1],[.1,1.8,.1],[.1,-1.0,.1],[3,-1,.1],[4.8,-1,.1]];
  route.slice(1).forEach((p,i)=>line(route[i],p,'#f1a57b',1.7));
  route.forEach(p=>dot(...p,'#ffcf8b',2.5));
  const segment=Math.floor(phase*.7)%6, fraction=(phase*.7)%1;const a=route[segment],b=route[segment+1];const x=a[0]+(b[0]-a[0])*fraction,y=a[1]+(b[1]-a[1])*fraction;
  dot(x,y,.18,'#fff2cc',4);const spot=project(x,y,.18);ctx.beginPath();ctx.arc(...spot,9,0,Math.PI*2);ctx.strokeStyle='#eaae7f88';ctx.lineWidth=.8;ctx.stroke();
  line([-5.3,4.9,.2],[-3.8,4.9,.2],'#eda77c',1.2);line([-5.3,4.9,.2],[-5.3,3.4,.2],'#c2d2a3',1.2);line([-5.3,4.9,.2],[-5.3,4.9,1.7],'#96b2ae',1.2);
}
function resizeCanvas(){const rect=canvas.getBoundingClientRect();cw=rect.width;ch=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);drawScene();}
function tick(time){animationId=null;if(paused||!visible||document.hidden)return;phase+=previousTime?Math.min((time-previousTime)/1000,.04):0;previousTime=time;drawScene();animationId=requestAnimationFrame(tick);}
function updateMotion(){if(animationId!==null)cancelAnimationFrame(animationId);animationId=null;previousTime=0;$('#motion-toggle').textContent=paused?'▷':'Ⅱ';$('#motion-toggle').setAttribute('aria-label',paused?'Play scene animation':'Pause scene animation');$('#motion-toggle').setAttribute('aria-pressed',String(paused));if(!paused&&visible&&!document.hidden)animationId=requestAnimationFrame(tick);drawScene();}
$$('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));drawScene();}));
$('#motion-toggle').addEventListener('click',()=>{paused=!paused;updateMotion();});
reducedMotion.addEventListener('change',e=>{paused=e.matches;updateMotion();});
document.addEventListener('visibilitychange',updateMotion);
new ResizeObserver(resizeCanvas).observe(canvas);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updateMotion();},{threshold:.01}).observe(canvas);
resizeCanvas();updateMotion();

})();
