import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createTruck(){
 const root=new THREE.Group();root.name='Vamshidhar_Custom_Semi';
 const red=new THREE.MeshPhysicalMaterial({color:0xb20d28,metalness:.42,roughness:.24,clearcoat:1,clearcoatRoughness:.18});
 const darkRed=new THREE.MeshStandardMaterial({color:0x810b21,metalness:.5,roughness:.34});
 const white=new THREE.MeshPhysicalMaterial({color:0xf4f4f2,metalness:.16,roughness:.33,clearcoat:.45});
 const black=new THREE.MeshStandardMaterial({color:0x15171b,roughness:.65});
 const rubber=new THREE.MeshStandardMaterial({color:0x17191c,roughness:.89});
 const tread=new THREE.MeshStandardMaterial({color:0x24262a,roughness:.9});
 const chrome=new THREE.MeshStandardMaterial({color:0xb6bcc3,metalness:.93,roughness:.22});
 const trim=new THREE.MeshStandardMaterial({color:0x4d5259,metalness:.78,roughness:.42});
 const glass=new THREE.MeshPhysicalMaterial({color:0x10222e,metalness:.7,roughness:.06,clearcoat:1,envMapIntensity:1.6});
 const lamps=new THREE.MeshStandardMaterial({color:0xf8fbff,emissive:0xdfeaff,emissiveIntensity:1.1,metalness:.25,roughness:.2});
 const amber=new THREE.MeshStandardMaterial({color:0xff8d27,emissive:0xff7300,emissiveIntensity:.5});
 const tailMat=new THREE.MeshStandardMaterial({color:0xb90020,emissive:0xcd0022,emissiveIntensity:.5});
 function mesh(geo,mat,parent=root){const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,x,y,z,mat=red,parent=root,r=.08){const m=mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),mat,parent);m.position.set(x,y,z);return m;}
 function cylinder(r,l,x,y,z,mat=chrome,parent=root){const m=mesh(new THREE.CylinderGeometry(r,r,l,28),mat,parent);m.rotation.x=Math.PI/2;m.position.set(x,y,z);return m;}
 function tube(points,r,mat,parent=root){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,8,false),mat,parent);}
 function profile(pts,depth,mat,z=0,parent=root,bevel=.07){const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(...p):s.moveTo(...p));s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:10});const m=mesh(g,mat,parent);m.position.z=z-depth/2;return m;}
 function plane(points,mat,parent=root){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();const m=mesh(g,mat,parent);m.material.side=THREE.DoubleSide;return m;}
 // Longitudinal chassis rails, cross-members and visible suspension.
 for(const z of [-.75,.75])box(6.05,.24,.18,.55,.8,z,black);
 for(const x of [-2.2,-1.2,-.2,.8,1.8,2.8])box(.13,.19,1.7,x,.75,0,trim);
 box(2.8,.22,2.1,-.9,1.05,0,trim);
 cylinder(.62,.15,-1.4,1.27,0,black).rotation.x=0;
 for(const z of [-1.03,1.03]){cylinder(.31,1.45,.0,.9,z,chrome).rotation.y=Math.PI/2;box(1.45,.04,.58,0,1.22,z,trim);for(let i=0;i<6;i++)box(.035,.025,.58,-.6+i*.24,1.25,z,chrome);}
 // Custom, beveled aerodynamic cab shell; sloped windshield and sculpted roof.
 const cab=profile([[.0,1.15],[3.7,1.15],[3.7,2.03],[3.27,2.55],[2.98,3.63],[2.62,4.07],[.28,4.1],[-.03,3.84]],2.42,red);
 cab.name='Sculpted_Cab';
 profile([[.13,4.03],[2.6,4.0],[2.2,4.37],[.22,4.38],[-.1,4.12]],2.28,red);
 // Black sculpted lower bumper and grille face.
 profile([[3.5,.91],[3.91,1.05],[3.93,1.53],[3.71,1.66]],2.45,darkRed);
 box(.14,.73,1.79,3.77,1.98,0,black,root,.02);
 for(let i=0;i<9;i++)box(.055,.035,1.66,3.86,1.66+i*.076,0,chrome,root,.01);
 box(.07,.15,.32,3.92,1.96,0,chrome,root,.02);
 box(.07,.15,.24,3.94,1.95,0,red,root,.01);
 for(const z of [-.96,.96]){box(.13,.24,.37,3.87,1.38,z,black);box(.15,.065,.32,3.96,1.44,z,lamps,root,.02);box(.15,.05,.32,3.96,1.33,z,lamps,root,.01);box(.05,.045,.18,3.98,1.22,z,amber,root,.01);}
 box(.05,.17,.49,3.98,1.08,0,white,root,.01);
 // Front glass follows the rake of the cab, instead of standing vertically.
 plane([[3.385,2.66,-1.02],[3.385,2.66,1.02],[3.112,3.6,1.0],[3.112,3.6,-1.0]],glass);
 tube([[3.33,2.62,-1.07],[3.03,3.64,-1.07],[3.03,3.64,1.07],[3.33,2.62,1.07]],.035,black);
 tube([[3.32,2.62,-1.07],[3.32,2.62,1.07]],.045,black);
 for(const z of [-.52,.52])tube([[3.36,2.7,z-.27],[3.2,3.02,z],[3.14,3.18,z+.21]],.025,black);
 // Doors, side windows, panel seams, mirrors, entry steps and cab marker lamps.
 for(const side of [-1,1]){
  const z=side*1.27;
  profile([[1.46,2.5],[3.17,2.5],[2.89,3.6],[1.46,3.6]],.035,black,z,root,.02);
  profile([[1.57,2.64],[3.01,2.64],[2.79,3.46],[1.57,3.46]],.042,glass,z+side*.024,root,.01);
  box(.055,.96,.05,2.6,3.06,z+side*.04,black,root,.01);
  tube([[1.36,3.7,z],[1.36,1.6,z],[3.17,1.6,z],[3.17,2.39,z]],.014,darkRed);
  box(.26,.07,.06,1.64,2.36,z+side*.02,chrome,root,.02);
  for(const x of [.25,.4,.55,.7])box(.06,.55,.035,x,3.35,z,darkRed,root,.01);
  box(1.12,.11,.44,1.23,.79,side*1.18,trim,root,.02);
  box(1.08,.1,.33,1.23,1.02,side*1.18,chrome,root,.02);
  tube([[3.05,3.39,z],[3.29,3.34,side*1.63],[3.32,2.78,side*1.63]],.035,black);
  box(.22,.54,.18,3.31,3.0,side*1.64,black);
  box(.14,.45,.025,3.31,3.0,side*1.75,chrome,root,.025);
  box(.22,.08,.05,.6,1.35,z,amber,root,.02);
  box(1.04,.47,.065,.6,1.65,z,red,root,.03);
 }
 for(const z of [-.95,-.48,0,.48,.95])box(.17,.07,.14,2.53,4.12,z,amber,root,.02);
 // Fender arches have real curvature, with a contrasting inner wheel-well.
 for(const side of [-1,1]){
  const arc=mesh(new THREE.TorusGeometry(.67,.095,10,40,Math.PI),red);arc.position.set(2.52,.65,side*1.24);
  for(const x of [-1.95,-.87]){const f=mesh(new THREE.TorusGeometry(.65,.1,10,32,Math.PI),black);f.position.set(x,.65,side*1.15);}
 }
 const wheelSpins=[],steering=[];
 function wheel(x,z,parent=root,front=false){
  const steer=new THREE.Group();steer.position.set(x,.58,z);parent.add(steer);const spin=new THREE.Group();steer.add(spin);
  const tire=mesh(new THREE.TorusGeometry(.405,.16,16,48),rubber,spin);tire.scale.z=1.34;
  const sideSign=z<0?-1:1;
  cylinder(.302,.31,0,0,0,trim,spin);
  cylinder(.265,.045,0,0,sideSign*.175,chrome,spin);
  cylinder(.12,.073,0,0,sideSign*.205,chrome,spin);
  const holes=new THREE.Group();spin.add(holes);
  for(let i=0;i<10;i++){const a=i*Math.PI/5; cylinder(.037,.015,Math.cos(a)*.209,Math.sin(a)*.209,sideSign*.203,black,holes); cylinder(.016,.02,Math.cos(a)*.145,Math.sin(a)*.145,sideSign*.226,chrome,holes);}
  // 48 angled tread ribs and raised sidewall detail per tire.
  const ribs=new THREE.InstancedMesh(new THREE.BoxGeometry(.024,.018,.3),tread,48);const ribMatrix=new THREE.Matrix4(),ribRotation=new THREE.Quaternion();for(let i=0;i<48;i++){const a=i*Math.PI/24;ribRotation.setFromAxisAngle(new THREE.Vector3(0,0,1),a-Math.PI/2);ribMatrix.compose(new THREE.Vector3(Math.cos(a)*.563,Math.sin(a)*.563,0),ribRotation,new THREE.Vector3(1,1,1));ribs.setMatrixAt(i,ribMatrix);}spin.add(ribs);
  for(const zi of [-.12,.12]){const ring=mesh(new THREE.TorusGeometry(.444,.008,6,48),tread,spin);ring.position.z=zi;}
  wheelSpins.push(spin);if(front)steering.push(steer);return steer;
 }
 for(const x of [2.52,-.87,-1.95])for(const z of [-1.23,1.23]){wheel(x,z,root,x===2.52);cylinder(.075,2.15,x,.58,0,black);}
 // Trailer group rotates around the fifth-wheel coupling.
 const trailer=new THREE.Group();trailer.name='Articulated_Trailer';trailer.position.set(-1.45,0,0);root.add(trailer);
 box(10.5,2.67,2.5,-4.55,2.75,0,white,trailer,.1);
 box(10.45,.15,2.49,-4.55,1.35,0,chrome,trailer,.025);
 box(10.45,.08,2.49,-4.55,4.12,0,chrome,trailer,.025);
 for(const z of [-1.25,1.25]){
  for(let i=0;i<48;i++)box(.025,2.53,.018,-9.64+i*.216,2.75,z,white,trailer,.004);
  box(10.35,.055,.025,-4.55,1.52,z,darkRed,trailer,.008);
  for(let i=0;i<12;i++)box(.11,.06,.028,-9.6+i*.9,1.45,z,amber,trailer,.01);
  box(3.1,.28,.12,-7.7,1.07,z,black,trailer,.04);
 }
 for(const z of [-.9,.9])box(9.8,.18,.16,-4.3,1.14,z,black,trailer,.02);
 for(const x of [-8.5,-7.4])for(const z of [-1.25,1.25])wheel(x,z,trailer);
 box(.15,.3,2.65,-9.92,1.08,0,trim,trailer,.02);
 box(.035,2.45,2.35,-9.835,2.73,0,white,trailer,.01);
 for(const z of [-.87,-.31,.31,.87]){box(.04,2.32,.025,-9.89,2.75,z,chrome,trailer,.005);for(const y of [1.8,2.7,3.6])box(.05,.06,.18,-9.92,y,z,chrome,trailer,.01);}
 for(const z of [-1,1])box(.04,.13,.29,-10.03,1.24,z,tailMat,trailer,.01);
 for(const z of [-1.2,1.2])box(.055,.41,.35,-9.04,.42,z,black,trailer,.025);
 for(const z of [-.82,.82]){box(.11,.87,.11,-2.7,.86,z,trim,trailer,.02);box(.33,.05,.28,-2.7,.4,z,black,trailer,.01);}
 // Trailer livery is a texture on its genuine 3D surface.
 const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=512;const ctx=canvas.getContext('2d');ctx.fillStyle='#f2f2f0';ctx.fillRect(0,0,2048,512);ctx.fillStyle='#bc102c';ctx.font='bold 140px Arial';ctx.fillText('VAMSHIDHAR',90,225);ctx.fillStyle='#474950';ctx.font='44px Arial';ctx.fillText('C O M M I T   T O   C L O U D',98,325);ctx.fillStyle='#bd102b';ctx.fillRect(90,385,460,8);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const labelMat=new THREE.MeshStandardMaterial({map:tex,roughness:.55});
 for(const side of [-1,1]){const label=mesh(new THREE.PlaneGeometry(6.8,1.7),labelMat,trailer);label.position.set(-4.35,2.88,side*1.279);if(side<0)label.rotation.y=Math.PI;}

 // Chrome exhaust stacks, sun visor, mud flaps and a soft contact shadow under each unit.
 for(const z of [-1.08,1.08]){const stack=cylinder(.085,3.15,-.36,2.8,z,chrome);stack.rotation.x=0;const tip=cylinder(.1,.22,-.36,4.42,z,trim);tip.rotation.x=0;box(.3,.42,.3,-.36,1.32,z,trim,root,.05);}
 const visor=box(.42,.05,2.3,3.2,3.74,0,black,root,.02);visor.rotation.z=-.22;
 for(const z of [-1.23,1.23])box(.035,.52,.5,-2.66,.5,z,black,root,.01);
 for(const z of [-1.25,1.25])box(.035,.52,.5,-9.2,.5,z,black,trailer,.01);
 const sc=document.createElement('canvas');sc.width=512;sc.height=256;const sx=sc.getContext('2d');sx.shadowColor='rgba(0,0,0,.9)';sx.shadowBlur=46;sx.fillStyle='rgba(0,0,0,.85)';sx.fillRect(86,84,340,88);
 const shadowTex=new THREE.CanvasTexture(sc);const shadowMat=new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false,opacity:.62,toneMapped:false});
 function contact(w,d,x,parent){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),shadowMat);m.rotation.x=-Math.PI/2;m.position.set(x,.03,0);m.renderOrder=2;parent.add(m);return m;}
 contact(8.6,5.2,.9,root);contact(15,5.2,-4.6,trailer);
 root.userData={wheelSpins,steering,trailer};return root;
}
