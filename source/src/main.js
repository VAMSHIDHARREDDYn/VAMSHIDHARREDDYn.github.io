import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createTruck } from './truck.js';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
if(!reduced.matches)document.documentElement.classList.add('js-motion');
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.07});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const toggle=document.getElementById('motion-toggle');
toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Resume motion':'Pause motion';toggle.setAttribute('aria-pressed',String(paused));document.body.classList.toggle('motion-paused',paused)});
reduced.addEventListener('change',()=>{paused=reduced.matches;document.documentElement.classList.toggle('js-motion',!reduced.matches);document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))});
document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('nvamshidharreddy7262@gmail.com');status.textContent='Email copied';}catch{status.textContent='nvamshidharreddy7262@gmail.com';}});
const journey=document.getElementById('journey'),hero=document.querySelector('.hero'),portrait=document.querySelector('.portrait-wrap');
let targetProgress=0,progress=0,visible=false;
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'200px'}).observe(journey);
function readScroll(){const rect=journey.getBoundingClientRect();targetProgress=THREE.MathUtils.clamp(-rect.top/Math.max(1,journey.offsetHeight-innerHeight),0,1);if(!reduced.matches){let y=THREE.MathUtils.clamp(scrollY/innerHeight,0,1);hero.style.borderRadius=`0 0 ${y*60}px ${y*60}px`;portrait.style.translate=`0 ${y*90}px`;portrait.style.scale=String(1+y*.05);const hc=document.querySelector('.hero-copy');hc.style.opacity=String(Math.max(0,1-y*1.5));hc.style.translate=`0 ${-y*70}px`;document.querySelector('.hero-word').style.transform=`translateY(${y*60}px)`;}}
addEventListener('scroll',readScroll,{passive:true});readScroll();

try{initScene();}catch(e){console.error('3D scene could not start:',e);document.querySelector('.scene-fallback').hidden=false;document.querySelector('.drag-hint').hidden=true;toggle.hidden=true;}
function initScene(){
 const host=document.getElementById('truck-scene');
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0xffffff);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);scene.fog=new THREE.Fog(0xffffff,46,95);
 const camera=new THREE.PerspectiveCamera(34,1,.1,180);
 const environment=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(environment,.04);scene.environment=env.texture;environment.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0xb9bcc6,1.25));
 const key=new THREE.DirectionalLight(0xfffaf4,4);key.position.set(12,25,14);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-25;key.shadow.camera.right=25;key.shadow.camera.top=25;key.shadow.camera.bottom=-25;key.shadow.camera.near=.1;key.shadow.camera.far=70;key.shadow.bias=-.0002;key.shadow.normalBias=.03;key.shadow.radius=4;scene.add(key);scene.add(key.target);
 const fill=new THREE.DirectionalLight(0xdce8ff,1.7);fill.position.set(-10,14,-12);scene.add(fill);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(240,240),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.045;ground.receiveShadow=true;scene.add(ground);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-50,0,3),new THREE.Vector3(-30,0,3),new THREE.Vector3(-13,0,-1),new THREE.Vector3(5,0,-1),new THREE.Vector3(23,0,5),new THREE.Vector3(46,0,8)],false,'catmullrom',.35);const length=curve.getLength();
 function ribbon(start,end,offset,width,y,mat,segments=160){const positions=[],indices=[];for(let i=0;i<=segments;i++){const t=THREE.MathUtils.lerp(start,end,i/segments),p=curve.getPointAt(t),tan=curve.getTangentAt(t),n=new THREE.Vector3(-tan.z,0,tan.x);for(const s of [-1,1]){const q=p.clone().addScaledVector(n,offset+s*width/2);positions.push(q.x,y,q.z);}if(i<segments){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;scene.add(m);return m;}
 const texCanvas=document.createElement('canvas');texCanvas.width=256;texCanvas.height=256;const c=texCanvas.getContext('2d');let seed=22;const data=c.createImageData(256,256);for(let i=0;i<data.data.length;i+=4){seed=(seed*16807)%2147483647;const v=48+(seed%20);data.data[i]=v;data.data[i+1]=v;data.data[i+2]=v+3;data.data[i+3]=255;}c.putImageData(data,0,0);const asphalt=new THREE.CanvasTexture(texCanvas);asphalt.wrapS=asphalt.wrapT=THREE.RepeatWrapping;asphalt.repeat.set(8,2);asphalt.colorSpace=THREE.SRGBColorSpace;
 const roadMat=new THREE.MeshStandardMaterial({map:asphalt,color:0x8d8d94,roughness:.93,side:THREE.DoubleSide});const shoulderMat=new THREE.MeshStandardMaterial({color:0xe5e5e7,roughness:.9,side:THREE.DoubleSide});const stripeMat=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:.18,roughness:1,side:THREE.DoubleSide});
 ribbon(0,1,0,7.7,0,shoulderMat);ribbon(0,1,0,7.1,.008,roadMat);
 ribbon(0,1,-3.3,.075,.016,stripeMat);ribbon(0,1,3.3,.075,.016,stripeMat);
 for(let d=0;d<length;d+=4.5)ribbon(d/length,Math.min(1,(d+2)/length),0,.11,.018,stripeMat,7);
 const T0=.17,T1=.83;const stations=[];let simTime=0;
 // Checkpoint markers: a thin red line across the road and a small sign for each delivery stage.
 const redMat=new THREE.MeshStandardMaterial({color:0xc8102e,roughness:.6,side:THREE.DoubleSide});const postMat=new THREE.MeshStandardMaterial({color:0x26262b,roughness:.5,metalness:.4});
 [['01','BUILD',.0],['02','TEST',1/3],['03','DEPLOY',2/3]].forEach(([num,name,pp])=>{const tt=T0+(T1-T0)*pp+3.9/length;const pt=curve.getPointAt(tt),tg=curve.getTangentAt(tt),nn=new THREE.Vector3(-tg.z,0,tg.x),yw=-Math.atan2(tg.z,tg.x);
  ribbon(tt-.09/length,tt+.09/length,0,6.6,.02,redMat,2);
  const g=new THREE.Group();g.position.copy(pt).addScaledVector(nn,-5.3);g.rotation.y=yw;scene.add(g);
  const post=new THREE.Mesh(new THREE.BoxGeometry(.09,3.3,.09),postMat);post.position.y=1.65;post.castShadow=true;g.add(post);
  const cv=document.createElement('canvas');cv.width=768;cv.height=256;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,768,256);x.fillStyle='#c8102e';x.fillRect(0,0,22,256);x.font='600 54px Arial';x.fillText(num,62,92);x.fillStyle='#202025';x.font='bold 104px Arial';x.fillText(name,58,206);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=8;const sign=new THREE.Mesh(new THREE.BoxGeometry(3,1,.06),[postMat,postMat,postMat,postMat,new THREE.MeshStandardMaterial({map:tx,roughness:.6}),postMat]);sign.position.set(1.42,3.1,0);sign.castShadow=true;g.add(sign);
  // Assembly-line station: a portal frame over the road with its own mechanism (added; nothing else in the scene changes).
  const tS=tt-(name==='BUILD'?7.5:0)/length,gp=curve.getPointAt(tS),gt2=curve.getTangentAt(tS);const st=new THREE.Group();st.position.copy(gp);st.rotation.y=-Math.atan2(gt2.z,gt2.x);scene.add(st);
  const part=(w,h,d,x,y,z,mat=postMat,parent=st)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);b.position.set(x,y,z);b.castShadow=true;parent.add(b);return b;};
  const whiteMat=new THREE.MeshStandardMaterial({color:0xf3f3f1,roughness:.45,metalness:.2});
  const glow=new THREE.MeshStandardMaterial({color:0x3a3a40,emissive:0xc8102e,emissiveIntensity:0,roughness:.4});
  for(const z of [-4.5,4.5]){part(.34,6.3,.34,0,3.15,z);part(.9,.16,.9,0,.08,z);part(.36,.5,.36,0,5.2,z,whiteMat);part(.06,3.6,.36,.18,2.6,z,glow);}
  part(.42,.42,9.34,0,6.3,0);part(.5,.12,8.2,0,6.03,0,whiteMat);part(.12,.06,8,.2,5.95,0,glow);
  let update;
  if(name==='BUILD'){ // two overhead assembly arms that work over the truck as it passes
   const arms=[-2.5,-.6].map((z,i)=>{const sh=new THREE.Group();sh.position.set(0,5.9,z);st.add(sh);part(.5,.3,.5,0,0,0,whiteMat,sh);const up=new THREE.Group();sh.add(up);part(.16,.75,.16,0,-.375,0,postMat,up);const el=new THREE.Group();el.position.y=-.75;up.add(el);part(.24,.24,.24,0,0,0,redMat,el);part(.12,.5,.12,0,-.25,0,whiteMat,el);part(.3,.08,.3,0,-.54,0,postMat,el);return{up,el,i};});
   update=(f,act,time)=>{arms.forEach(({up,el,i})=>{const w=Math.sin(time*2.4+i*1.9)*act;up.rotation.z=(1-act)*1.25+w*.38;el.rotation.z=-(1-act)*2.2-w*.6;up.rotation.x=Math.cos(time*1.7+i)*.18*act;});};
  }else if(name==='TEST'){ // a red scan sheet across the portal while the truck is inside it
   const sheetMat=new THREE.MeshBasicMaterial({color:0xc8102e,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide});const sheet=new THREE.Mesh(new THREE.PlaneGeometry(8.6,5.8),sheetMat);sheet.rotation.y=Math.PI/2;sheet.position.y=2.95;st.add(sheet);
   const bar=part(.1,.1,8.6,0,3,0,new THREE.MeshStandardMaterial({color:0xc8102e,emissive:0xc8102e,emissiveIntensity:1.4}));bar.castShadow=false;
   update=(f,act,time)=>{sheetMat.opacity=act*(.13+.05*Math.sin(time*6));bar.visible=act>.02;bar.position.y=5.35+.45*Math.sin(time*3);};
  }else{ // a boom gate that lifts as the truck arrives, then clears it for release
   const pivot=new THREE.Group();pivot.position.set(-2.2,1.25,-4.5);st.add(pivot);part(.5,1.3,.5,-2.2,.65,-4.5,whiteMat);
   const boom=part(.14,.16,7.4,0,0,3.7,whiteMat,pivot);for(let i=0;i<5;i++)part(.15,.17,.6,0,0,1+i*1.45,redMat,pivot);
   update=(f)=>{const open=THREE.MathUtils.clamp((f+15)/9,0,1);const e2=open*open*(3-2*open);pivot.rotation.x=-e2*1.42;};
  }
  stations.push({tt:tS,glow,update});});
 const truck=createTruck();scene.add(truck);
 // Camera choreography in the truck's own frame (x = forward, z = camera side): close three-quarter, tracking side, rear three-quarter, wide.
 const V=(x,y,z)=>new THREE.Vector3(x,y,z);
 const camPath=new THREE.CatmullRomCurve3([V(10.5,2.5,8.5),V(5,4.6,27),V(-11,8,30),V(10,17,32)],false,'catmullrom',.5);
 const lookPath=new THREE.CatmullRomCurve3([V(1.6,2.15,0),V(-2.6,2,0),V(-4.2,1.7,0),V(-3,1,0)],false,'catmullrom',.5);
 const fovs=[29,31,33,34],vxs=[-.04,.1,.1,.09],vys=[-.05,-.2,-.2,-.14];
 const sample=(a,e)=>{const f=e*(a.length-1),i=Math.min(a.length-2,Math.floor(f));return THREE.MathUtils.lerp(a[i],a[i+1],f-i)};
 const sticky=document.querySelector('.journey-sticky');let bob=0;
 let orbit=0,dragging=false,lastX=0;
 host.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lastX=e.clientX;host.setPointerCapture(e.pointerId);}});
 host.addEventListener('pointermove',e=>{if(dragging){orbit=THREE.MathUtils.clamp(orbit+(e.clientX-lastX)*.005,-.6,.6);lastX=e.clientX;}});
 host.addEventListener('pointerup',()=>{dragging=false});host.addEventListener('pointercancel',()=>{dragging=false});
 let mobile=false;
 function size(){const w=host.clientWidth,h=host.clientHeight;mobile=w<700;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();readScroll();}
 new ResizeObserver(size).observe(host);size();
 const clock=new THREE.Clock();let rendered=false,lastProgress=-1;
 function draw(){requestAnimationFrame(draw);const dt=Math.min(clock.getDelta(),.05);if(!visible&&rendered)return;if(!paused)progress=THREE.MathUtils.lerp(progress,targetProgress,1-Math.exp(-dt*7));if(reduced.matches)progress=.36;
  const t=T0+progress*(T1-T0);const p=curve.getPointAt(t),tan=curve.getTangentAt(t),normal=new THREE.Vector3(-tan.z,0,tan.x);p.addScaledVector(normal,-1.55);truck.position.copy(p);if(!paused){bob+=dt*Math.min(1,Math.abs(targetProgress-progress)*60);}truck.children[0]&&(truck.position.y=0);const yaw=-Math.atan2(tan.z,tan.x);truck.rotation.y=yaw;
  const backT=Math.max(0,t-5.3/length);const backTan=curve.getTangentAt(backT);truck.userData.trailer.rotation.y=-Math.atan2(backTan.z,backTan.x)-yaw;
  const furtherTan=curve.getTangentAt(Math.min(1,t+.02));const steerAngle=THREE.MathUtils.clamp(Math.atan2(furtherTan.z,furtherTan.x)-Math.atan2(tan.z,tan.x),-.2,.2);truck.userData.steering.forEach(w=>w.rotation.y=-steerAngle*4);
  truck.userData.wheelSpins.forEach(w=>w.rotation.z=-progress*length*(T1-T0)/.565);
  const e=progress*progress*(3-2*progress);const look=lookPath.getPoint(e),off=camPath.getPoint(e).sub(look);if(mobile)off.multiplyScalar(2.2);
  const center=p.clone().add(look.applyAxisAngle(new THREE.Vector3(0,1,0),yaw));
  const offset=off.applyAxisAngle(new THREE.Vector3(0,1,0),yaw+orbit);
  camera.position.copy(center).add(offset);camera.position.y=Math.max(.8,camera.position.y);camera.lookAt(center);
  const fov=sample(fovs,e);if(Math.abs(camera.fov-fov)>.01){camera.fov=fov;camera.updateProjectionMatrix();}
  camera.setViewOffset(host.clientWidth,host.clientHeight,mobile?0:host.clientWidth*sample(vxs,e),host.clientHeight*(mobile?-.1:sample(vys,e)),host.clientWidth,host.clientHeight);
  if(!paused&&!reduced.matches)simTime+=dt;stations.forEach(s=>{const f=(t-s.tt)*length+3.9;const i1=THREE.MathUtils.clamp((f+1.5)/2.5,0,1),o1=1-THREE.MathUtils.clamp((f-15)/2.5,0,1);const act=i1*i1*(3-2*i1)*o1*o1*(3-2*o1);s.glow.emissiveIntensity=act*1.6;s.update(f,act,simTime);});
  sticky.style.setProperty('--hp',THREE.MathUtils.clamp((progress-.21)/.13,0,1).toFixed(3));
  key.position.copy(center).add(new THREE.Vector3(12,25,14));key.target.position.copy(center);key.target.updateMatrixWorld();
  if(Math.abs(progress-lastProgress)>.001||!rendered){document.getElementById('route-fill').style.width=`${progress*100}%`;const stage=Math.min(2,Math.floor(progress*3));document.querySelectorAll('.delivery-stage').forEach((el,i)=>el.classList.toggle('active',i===stage));document.getElementById('route-label').textContent=['01 / BUILD','02 / TEST','03 / DEPLOY'][stage];lastProgress=progress;}
  renderer.render(scene,camera);rendered=true;
 }
 draw();
 // Diagnostics are available for structural verification without altering the UI.
 window.__portfolioScene={scene,truck,renderer,camera,curve,version:2};
}

if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.pipeline-visual,.architecture-visual').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*9+'deg');el.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*7+'deg');});el.addEventListener('pointerleave',()=>{el.style.setProperty('--ry','0deg');el.style.setProperty('--rx','0deg');});});}
