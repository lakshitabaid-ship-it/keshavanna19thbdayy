import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1411);
scene.fog = new THREE.FogExp2(0x1a1411, 0.022);
const camera = new THREE.PerspectiveCamera(70, innerWidth/innerHeight, .1, 90);
camera.position.set(0,1.68,8);
const yaw = new THREE.Object3D(), pitch = new THREE.Object3D();
yaw.position.copy(camera.position); yaw.add(pitch); pitch.add(camera); scene.add(yaw);
const clock = new THREE.Clock();

scene.add(new THREE.HemisphereLight(0xd9c6a7,0x281811,1.05));
const key = new THREE.DirectionalLight(0xffd9a1,2.2); key.position.set(-7,10,6); key.castShadow=true; key.shadow.mapSize.set(2048,2048); scene.add(key);
function pointLight(x,y,z,intensity=22,color=0xffc77b,dist=12){const l=new THREE.PointLight(color,intensity,dist,2);l.position.set(x,y,z);scene.add(l);return l;}

const mats={
 wall:new THREE.MeshStandardMaterial({color:0x39271f,roughness:.92}),
 wall2:new THREE.MeshStandardMaterial({color:0x2b1d19,roughness:.9}),
 floor:new THREE.MeshStandardMaterial({color:0x514033,roughness:.72}),
 trim:new THREE.MeshStandardMaterial({color:0x9a7446,metalness:.62,roughness:.38}),
 gold:new THREE.MeshStandardMaterial({color:0xc5a36a,metalness:.7,roughness:.3}),
 dark:new THREE.MeshStandardMaterial({color:0x211815,roughness:.7}),
 parchment:new THREE.MeshStandardMaterial({color:0xd8c7a8,roughness:.95}),
 burgundy:new THREE.MeshStandardMaterial({color:0x4a1e22,roughness:.82}),
 glass:new THREE.MeshStandardMaterial({color:0x8b765b,metalness:.25,roughness:.25,transparent:true,opacity:.35})
};
function box(parent,x,y,z,w,h,d,mat,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;parent.add(m);return m;}
function cylinder(parent,x,y,z,r1,r2,h,mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,16),mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function textTexture(title,sub=''){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');g.fillStyle='#241915';g.fillRect(0,0,512,256);g.strokeStyle='#b99761';g.lineWidth=5;g.strokeRect(16,16,480,224);g.fillStyle='#d9c39b';g.textAlign='center';g.font='34px Georgia';g.fillText(title,256,112);g.fillStyle='#ad9a7d';g.font='14px Arial';g.fillText(sub.toUpperCase(),256,153);const t=new THREE.CanvasTexture(c);return new THREE.MeshStandardMaterial({map:t,roughness:.8});}
function plaque(parent,x,y,z,title,sub,w=2.6,h=.8){const p=box(parent,x,y,z,w,h,.09,mats.dark,false);const face=box(parent,x,y,z-.052,w-.12,h-.12,.018,textTexture(title,sub),false);return p;}
function floorRoom(x,z,w,d){box(scene,x,-.18,z,w,.36,d,mats.floor);for(let i=-Math.floor(w/2)+1;i<Math.floor(w/2);i++)box(scene,x+i*.0,-.0,z,.015,.015,d,mats.gold,false);}
function roomShell(cx,cz,w,d,openSide='south'){
  box(scene,cx,3.1,cz-d/2,w,6,d*.12,mats.wall);
  box(scene,cx-w/2,3.1,cz,w*.12,6,d,mats.wall);
  box(scene,cx+w/2,3.1,cz,w*.12,6,d,mats.wall);
  if(openSide!=='north') box(scene,cx,3.1,cz+d/2,w,6,d*.12,mats.wall);
  box(scene,cx,5.95,cz,w,0.18,d,mats.dark);
  // cornice trim
  box(scene,cx,5.72,cz-d/2,w,.12,.16,mats.gold,false);
  box(scene,cx-w/2,5.72,cz,.16,.12,d,mats.gold,false);
  box(scene,cx+w/2,5.72,cz,.16,.12,d,mats.gold,false);
  floorRoom(cx,cz,w,d);
}
function arch(x,z,width=3.2){
  // Decorative portal frame and open threshold
  box(scene,x-width/2,2.3,z,.22,4.6,.45,mats.gold);
  box(scene,x+width/2,2.3,z,.22,4.6,.45,mats.gold);
  box(scene,x,4.55,z,width,.22,.45,mats.gold);
  box(scene,x-width/2+.22,2.3,z-.03,.07,4.25,.12,mats.trim,false);
  box(scene,x+width/2-.22,2.3,z-.03,.07,4.25,.12,mats.trim,false);
}
function buildMain(){
  // Central hall, with branching rooms
  roomShell(0,0,15,15,'south');
  // rear feature wall and main portal
  arch(0,-7.45,3.6);
  plaque(scene,0,4.25,-7.18,'THE KESHAV MUSEUM','A LIFE IN MANY ROOMS',4.8,1.05);
  // side portals
  arch(-7.42,0,3.0); arch(7.42,0,3.0);
  // portal side walls closed except portal gaps
  box(scene,-7.42,3.1,-2.8,.4,6,8.4,mats.wall); // side decorative return
  // central medallion
  cylinder(scene,0,.02,0,2.0,2.0,.08,mats.gold);
  cylinder(scene,0,.08,0,1.72,1.72,.08,mats.dark);
  const star=new THREE.Mesh(new THREE.TorusGeometry(1.2,.018,8,64),mats.gold);star.rotation.x=Math.PI/2;star.position.y=.14;scene.add(star);
  // directory plinths
  const dirs=[[-4.2,2.1,'CORRESPONDENCE','11 LETTERS'],[0,2.1,'PORTRAITS','25 MOMENTS'],[4.2,2.1,'THE ARCHIVE','FIVE COLLECTIONS']];
  dirs.forEach(([x,z,t,s])=>{box(scene,x,.65,z,1.15,1.3,.65,mats.dark);box(scene,x,.18,z,.9,.12,.45,mats.gold);plaque(scene,x,1.05,z-.34,t,s,1.9,.72);});
  pointLight(0,4,0,32,0xffd39a,16);pointLight(-5,4,-4,12);pointLight(5,4,-4,12);
}
function buildGalleryLetters(){
  const cx=-15,cz=0,w=14,d=15;roomShell(cx,cz,w,d,'east');
  arch(-7.95,0,3);
  plaque(scene,cx,4.6,-7.1,'CORRESPONDENCE ROOM','ELEVEN LETTERS, ELEVEN VOICES',5.2,1);
  for(let i=0;i<11;i++){
    const side=i%2===0?-1:1, row=Math.floor(i/2.1);
    const x=cx+side*5.65, z=-5.2+row*2.05;
    const frame=box(scene,x,2.35,z,.16,1.55,.12,mats.gold);
    const paper=box(scene,x,2.35,z-.1,1.02,1.35,.08,mats.parchment);
    paper.rotation.y=side===-1?.08:-.08;
    box(scene,x,1.62,z-.12,1.05,.08,.12,mats.dark);
    const seal=cylinder(scene,x,2.3,z-.19,.12,.12,.04,mats.burgundy);seal.rotation.x=Math.PI/2;
    paper.userData={kind:'letter',index:i+1,title:`Letter No. ${String(i+1).padStart(2,'0')}`};
    frame.userData=paper.userData;seal.userData=paper.userData;
  }
  pointLight(cx,4,0,26,0xffc67d,13);pointLight(cx-4,3,-4,9);
}
function buildPortraits(){
  const cx=15,cz=0,w=14,d=15;roomShell(cx,cz,w,d,'west');
  arch(7.95,0,3);
  plaque(scene,cx,4.6,-7.1,'PORTRAIT GALLERY','TWENTY-FIVE MOMENTS',5.2,1);
  for(let i=0;i<25;i++){
    const col=i%5,row=Math.floor(i/5);
    const x=cx-5.2+col*2.6,z=-6+row*3.0;
    box(scene,x,2.55,z,.12,2.15,.16,mats.gold);
    box(scene,x,2.55,z-.1,1.22,1.75,.07,mats.dark);
    const canvasMat=new THREE.MeshStandardMaterial({color:[0x796552,0x9b8466,0x66594c,0x8d715d,0x746d5d][i%5],roughness:.9});
    const img=box(scene,x,2.58,z-.15,1.05,1.55,.04,canvasMat,false);
    // restrained placeholder monogram
    const mon=box(scene,x,2.58,z-.18,.04,.5,.02,mats.gold,false);
    img.userData={kind:'portrait',index:i+1,title:`Portrait ${String(i+1).padStart(2,'0')}`};
    mon.userData=img.userData;
  }
  pointLight(cx,4,0,30,0xffd49a,14);pointLight(cx-4,3,-5,8);
}
function buildArchive(){
  const cx=0,cz=-17,w=15,d=14;roomShell(cx,cz,w,d,'south');
  arch(0,-9.95,3.5);
  plaque(scene,cx,4.5,-23.6,'ARCHIVE OF KESHAV','THE DETAILS THAT STAY',5.2,1);
  const names=['THE EARLY YEARS','THE PERSON','THE THINGS HE LOVES','A FEW RARE FACTS','THE KESHAV EFFECT'];
  names.forEach((n,i)=>{
    const x=-5.6+i*2.8;
    box(scene,x,1.8,-18.5,1.9,3.6,.75,mats.dark);
    box(scene,x,3.75,-18.5,2.0,.12,.85,mats.gold);
    box(scene,x,1.8,-18.92,1.6,2.7,.07,mats.burgundy);
    const label=plaque(scene,x,2.2,-18.98,n,'OPEN EXHIBIT',1.55,.72);
    label.userData={kind:'archive',index:i+1,title:n};
    const orb=cylinder(scene,x,3.25,-18.99,.16,.16,.08,mats.gold);orb.rotation.x=Math.PI/2;orb.userData=label.userData;
  });
  pointLight(0,4,-17,30,0xffc77b,14);
}
buildMain();buildGalleryLetters();buildPortraits();buildArchive();

// Entrance doors in front of hall
const leftDoor=new THREE.Group(),rightDoor=new THREE.Group();scene.add(leftDoor,rightDoor);
function doorLeaf(group,hingeX,side){
  group.position.set(hingeX,0,7.48);
  box(group,side*1.05,2.35,0,2.1,4.7,.22,mats.dark);
  box(group,side*1.05,2.35,-.13,1.82,4.4,.05,mats.burgundy);
  box(group,side*1.05,2.35,-.18,1.55,4.1,.04,mats.gold);
  box(group,side*1.05,2.35,-.22,1.38,3.92,.04,mats.dark);
  for(let y of [.7,2.35,4]){box(group,side*1.05,y,-.27,1.1,.045,.03,mats.gold,false);}
  const handle=cylinder(group,side*.35,2.3,-.34,.08,.08,.06,mats.gold);handle.rotation.x=Math.PI/2;
}
doorLeaf(leftDoor,-1.8,1);doorLeaf(rightDoor,1.8,-1);
leftDoor.rotation.y=0;rightDoor.rotation.y=0;

let currentRoom='hall', entered=false, locked=false, move={f:false,b:false,l:false,r:false}, velocity=new THREE.Vector3();
const raycaster=new THREE.Raycaster();let interactables=[];
function refreshInteractables(){interactables=[];scene.traverse(o=>{if(o.userData?.kind)interactables.push(o);});}
refreshInteractables();

const $=s=>document.querySelector(s);
const welcome=$('#welcome'),hud=$('#hud'),directory=$('#directory'),exhibit=$('#exhibit'),pause=$('#pause');
function setRoom(name){
 currentRoom=name;
 const positions={hall:[0,1.68,8],letters:[-15,1.68,5.5],portraits:[15,1.68,5.5],archive:[0,1.68,-10]};
 const p=positions[name];yaw.position.set(...p);
 const dirs={hall:'CENTRAL HALL',letters:'CORRESPONDENCE ROOM',portraits:'PORTRAIT GALLERY',archive:'ARCHIVE OF KESHAV'};
 $('#roomName').textContent=dirs[name];
 $('#interactionHint').textContent=name==='hall'?'APPROACH A PORTAL TO ENTER A GALLERY':'CLICK AN EXHIBIT TO OPEN';
}
function openDirectory(){directory.classList.remove('hidden');document.exitPointerLock?.();}
function closeDirectory(){directory.classList.add('hidden');if(entered&&!exhibit.classList.contains('hidden'))return;canvas.requestPointerLock?.();}
$('#directoryBtn').onclick=openDirectory;$('#closeDirectory').onclick=()=>{directory.classList.add('hidden');canvas.requestPointerLock?.();};
document.querySelectorAll('.destination').forEach(b=>b.onclick=()=>{setRoom(b.dataset.room);directory.classList.add('hidden');canvas.requestPointerLock?.();});
$('#enterBtn').onclick=()=>{
 entered=true;welcome.classList.add('hidden');hud.classList.remove('hidden');
 leftDoor.rotation.y=-1.35;rightDoor.rotation.y=1.35;
 setTimeout(()=>canvas.requestPointerLock?.(),500);
};
$('#closeExhibit').onclick=()=>{exhibit.classList.add('hidden');canvas.requestPointerLock?.();};
$('#resumeBtn').onclick=()=>{pause.classList.add('hidden');canvas.requestPointerLock?.();};
$('#pauseDirectory').onclick=()=>{pause.classList.add('hidden');openDirectory();};
document.addEventListener('pointerlockchange',()=>{locked=document.pointerLockElement===canvas;if(!locked&&entered&&directory.classList.contains('hidden')&&exhibit.classList.contains('hidden'))pause.classList.remove('hidden');else pause.classList.add('hidden');});
document.addEventListener('mousemove',e=>{if(!locked)return;yaw.rotation.y-=e.movementX*.0022;pitch.rotation.x-=e.movementY*.0022;pitch.rotation.x=Math.max(-1.25,Math.min(1.25,pitch.rotation.x));});
document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='w'||k==='arrowup')move.f=true;if(k==='s'||k==='arrowdown')move.b=true;if(k==='a'||k==='arrowleft')move.l=true;if(k==='d'||k==='arrowright')move.r=true;if(k==='m')toggleSound();});
document.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='w'||k==='arrowup')move.f=false;if(k==='s'||k==='arrowdown')move.b=false;if(k==='a'||k==='arrowleft')move.l=false;if(k==='d'||k==='arrowright')move.r=false;});
function showExhibit(data){
 const n=data.index;
 let title=data.title,eyebrow='FROM THE MUSEUM COLLECTION',body='This space is ready for the personal details, photographs and stories that will make this exhibit Keshav’s own.';
 if(data.kind==='letter'){eyebrow=`CORRESPONDENCE · LETTER ${String(n).padStart(2,'0')} OF 11`;title=`A letter for Keshav`;body='Your letter will appear here. We can add the author’s photograph, the complete message and a paper-like reading layout when you provide the content.';}
 if(data.kind==='portrait'){eyebrow=`PORTRAIT GALLERY · ${String(n).padStart(2,'0')} OF 25`;title=`A moment, preserved`;body='This frame is a placeholder for one of the 25 photographs. We will add its image and museum-style caption later.';}
 $('#exhibitContent').innerHTML=`<p class="eyebrow">${eyebrow}</p><h2>${title}</h2><div class="placeholder-image">EXHIBIT IMAGE / PHOTOGRAPH</div><p>${body}</p>`;
 exhibit.classList.remove('hidden');document.exitPointerLock?.();
}
canvas.addEventListener('click',()=>{
 if(!entered||!locked)return;
 raycaster.setFromCamera(new THREE.Vector2(0,0),camera);
 const hits=raycaster.intersectObjects(interactables,false);
 if(hits.length){showExhibit(hits[0].object.userData);return;}
 // Portals: walk-through triggers based on proximity and direction, with clickable transition prompt fallback
 const p=yaw.position;
 if(currentRoom==='hall'){
   if(p.x<-5.4)setRoom('letters');
   else if(p.x>5.4)setRoom('portraits');
   else if(p.z<-5.2)setRoom('archive');
 }
});
function clampRoom(){
 const p=yaw.position;
 // Room-specific soft boundaries. Portals connect spaces.
 if(currentRoom==='hall'){
   p.x=THREE.MathUtils.clamp(p.x,-6.8,6.8);p.z=THREE.MathUtils.clamp(p.z,-6.8,6.8);
   if(p.x<-6.6){setRoom('letters');p.x=-15;}
   if(p.x>6.6){setRoom('portraits');p.x=15;}
   if(p.z<-6.6){setRoom('archive');p.z=-10;}
 }else if(currentRoom==='letters'){
   p.x=THREE.MathUtils.clamp(p.x,-21.1,-8.9);p.z=THREE.MathUtils.clamp(p.z,-6.7,6.7);
   if(p.x>-9.2){setRoom('hall');p.x=-5.8;}
 }else if(currentRoom==='portraits'){
   p.x=THREE.MathUtils.clamp(p.x,8.9,21.1);p.z=THREE.MathUtils.clamp(p.z,-6.7,6.7);
   if(p.x<9.2){setRoom('hall');p.x=5.8;}
 }else{
   p.x=THREE.MathUtils.clamp(p.x,-6.9,6.9);p.z=THREE.MathUtils.clamp(p.z,-23.1,-10.3);
   if(p.z>-10.5){setRoom('hall');p.z=-5.8;}
 }
}
let audioCtx=null,osc=null,gain=null,soundOn=false;
function toggleSound(){
 if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();osc=audioCtx.createOscillator();const osc2=audioCtx.createOscillator();gain=audioCtx.createGain();const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=240;osc.type='sine';osc.frequency.value=110;osc2.type='sine';osc2.frequency.value=164.81;const g2=audioCtx.createGain();g2.gain.value=.24;osc.connect(filter);osc2.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0;osc.start();osc2.start();}
 if(audioCtx.state==='suspended')audioCtx.resume();soundOn=!soundOn;gain.gain.setTargetAtTime(soundOn?.035:0,audioCtx.currentTime,.8);$('#soundBtn').textContent=`SOUND: ${soundOn?'ON':'OFF'}`;
}
$('#soundBtn').onclick=toggleSound;

function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);
 if(locked){
  const dir=new THREE.Vector3((move.r?1:0)-(move.l?1:0),0,(move.b?1:0)-(move.f?1:0));
  if(dir.lengthSq())dir.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw.rotation.y);
  const speed=4.2; yaw.position.addScaledVector(dir,speed*dt);clampRoom();
 }
 // subtle warm lighting movement, almost imperceptible
 renderer.render(scene,camera);
}
animate();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
window.addEventListener('load',()=>setTimeout(()=>$('#loading').classList.add('done'),500));
