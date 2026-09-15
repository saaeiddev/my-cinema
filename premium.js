import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const $ = (s) => document.querySelector(s);
const canvas = $('#cinema-canvas');
const isMobile = matchMedia('(max-width: 760px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const genres = [
  { fa:'اکشن', en:'ACTION', mood:0xff7b35, description:'فیلم‌های اکشن بر پایه هیجان، تعقیب‌وگریز، مبارزه، خطر و اتفاقات سریع ساخته می‌شوند. این ژانر معمولاً از بدلکاری، جلوه‌های ویژه و سکانس‌های پرانرژی برای ایجاد ضرباهنگ بالا استفاده می‌کند.', features:['ریتم سریع','تعقیب و گریز','مبارزه','جلوه‌های ویژه','قهرمان محوری'], examples:['The Dark Knight','Mad Max: Fury Road','John Wick'], icon:'action' },
  { fa:'ترسناک', en:'HORROR', mood:0x8f1831, description:'ژانر ترسناک با ایجاد اضطراب، ناشناخته‌ها و فضای تهدیدآمیز تلاش می‌کند حس ترس و تعلیق را برانگیزد. نورپردازی محدود، صدا و طراحی فضا نقش مهمی در تجربه این ژانر دارند.', features:['تعلیق','فضای تاریک','ناشناخته','شوک‌های کنترل‌شده','طراحی صدا'], examples:['The Shining','Alien','The Conjuring'], icon:'horror' },
  { fa:'کمدی', en:'COMEDY', mood:0xf2c65c, description:'کمدی از موقعیت، شخصیت، دیالوگ و زمان‌بندی برای ایجاد خنده و سبک‌کردن فضا استفاده می‌کند. این ژانر می‌تواند از طنز روزمره تا هجو اجتماعی و کمدی فیزیکی گسترده باشد.', features:['ریتم شوخ‌طبعانه','موقعیت طنز','دیالوگ','اغراق','پایان سبک‌تر'], examples:['The Grand Budapest Hotel','Groundhog Day','The Mask'], icon:'comedy' },
  { fa:'عاشقانه', en:'ROMANCE', mood:0xe56c8b, description:'فیلم‌های عاشقانه بر شکل‌گیری، پیچیدگی و تحول رابطه عاطفی میان شخصیت‌ها تمرکز دارند. موسیقی، بازی‌های احساسی و لحظات صمیمی معمولاً هسته تجربه را می‌سازند.', features:['روابط انسانی','احساس','کشمکش عاطفی','موسیقی نرم','شیمی شخصیت‌ها'], examples:['Before Sunrise','La La Land','Pride & Prejudice'], icon:'romance' },
  { fa:'وسترن', en:'WESTERN', mood:0xc78645, description:'وسترن جهان مرزی، بیابان، قانون، شرافت و تقابل انسان با محیط را روایت می‌کند. تصویرسازی افق‌های باز، دوئل و تنهایی شخصیت‌ها از نشانه‌های کلاسیک آن است.', features:['فضای مرزی','دوئل','بیابان','قانون و بی‌قانونی','قهرمان تنها'], examples:['The Good, the Bad and the Ugly','Unforgiven','True Grit'], icon:'western' },
  { fa:'جنایی', en:'CRIME', mood:0x5aa1a8, description:'ژانر جنایی حول جرم، تحقیق، پلیس، مجرم و پیامدهای اخلاقی انتخاب‌ها شکل می‌گیرد. روایت می‌تواند از دید کارآگاه، قربانی یا حتی مجرم پیش برود.', features:['تحقیق','جرم','سرنخ','اخلاق خاکستری','تعلیق روایی'], examples:['Heat','Se7en','The Departed'], icon:'crime' },
  { fa:'درام', en:'DRAMA', mood:0x9d6b55, description:'درام بر شخصیت، تضادهای انسانی و پیامدهای واقعی تصمیم‌ها تمرکز دارد. هدف اصلی آن ایجاد همدلی و درگیرکردن مخاطب با تجربه‌های عاطفی و اجتماعی است.', features:['شخصیت‌محوری','تعارض انسانی','واقع‌گرایی','تحول شخصیت','بار احساسی'], examples:['The Shawshank Redemption','Manchester by the Sea','A Separation'], icon:'drama' },
  { fa:'علمی تخیلی', en:'SCIENCE FICTION', mood:0x48aee8, description:'علمی تخیلی ایده‌های علمی، فناوری آینده، فضا و پرسش‌های فلسفی درباره انسان را به جهان‌های فرضی می‌برد. طراحی جهان و مفهوم مرکزی معمولاً نقش بنیادین دارد.', features:['فناوری آینده','فضا','جهان‌سازی','ایده علمی','پرسش فلسفی'], examples:['2001: A Space Odyssey','Interstellar','Blade Runner 2049'], icon:'scifi' },
  { fa:'ماجراجویی', en:'ADVENTURE', mood:0x6fb26b, description:'ماجراجویی شخصیت‌ها را به سفر، کشف سرزمین‌ها و عبور از موانع می‌برد. حس اکتشاف، خطر و یافتن چیزهای ناشناخته موتور اصلی روایت است.', features:['سفر','اکتشاف','خطر','نقشه و هدف','محیط‌های متنوع'], examples:['Raiders of the Lost Ark','Life of Pi','The Mummy'], icon:'adventure' },
  { fa:'فانتزی', en:'FANTASY', mood:0xa56ed5, description:'فانتزی قوانین واقعیت را گسترش می‌دهد و با جادو، اسطوره و جهان‌های خیالی تجربه‌ای فراتر از زندگی روزمره می‌سازد. نمادها و اسطوره‌ها در آن بسیار پررنگ‌اند.', features:['جادو','اسطوره','جهان خیالی','موجودات افسانه‌ای','قهرمانی'], examples:['The Lord of the Rings','Pan’s Labyrinth','Stardust'], icon:'fantasy' },
  { fa:'معمایی', en:'MYSTERY', mood:0x6f86a9, description:'ژانر معمایی اطلاعات را مرحله‌به‌مرحله در اختیار مخاطب می‌گذارد تا همراه شخصیت‌ها حقیقت را کشف کند. سرنخ، پنهان‌کاری و غافلگیری عناصر کلیدی هستند.', features:['سرنخ','راز','کشف تدریجی','سوءظن','چرخش داستانی'], examples:['Knives Out','Memento','Zodiac'], icon:'mystery' },
  { fa:'هیجان‌انگیز', en:'THRILLER', mood:0xd14a36, description:'تریلر با فشار زمانی، خطر نزدیک و عدم قطعیت، مخاطب را در وضعیت تنش نگه می‌دارد. تدوین، موسیقی و اطلاعات محدود ابزارهای اصلی ایجاد هیجان‌اند.', features:['تنش','خطر نزدیک','فشار زمانی','غافلگیری','ریتم کنترل‌شده'], examples:['Prisoners','Sicario','Gone Girl'], icon:'thriller' },
  { fa:'انیمیشن', en:'ANIMATION', mood:0x4ebdc3, description:'انیمیشن با جان‌بخشیدن به طراحی، تصویر و حرکت می‌تواند هر جهان ممکنی را خلق کند. این رسانه از روایت کودکانه تا آثار پیچیده و بزرگسالانه گسترده است.', features:['طراحی حرکت','جهان‌سازی آزاد','بیان بصری','اغراق کنترل‌شده','سبک‌های متنوع'], examples:['Spirited Away','Ratatouille','Spider-Man: Into the Spider-Verse'], icon:'animation' }
];

const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference:'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.35 : 1.9));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050404);
scene.fog = new THREE.FogExp2(0x080504, isMobile ? 0.024 : 0.018);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
pmrem.dispose();

const camera = new THREE.PerspectiveCamera(47, innerWidth / innerHeight, 0.1, 120);
camera.position.set(isMobile ? 0 : 0.4, isMobile ? 5.3 : 5.55, isMobile ? 18.5 : 21.5);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.enablePan = false;
controls.enableZoom = false;
controls.rotateSpeed = 0.18;
controls.minAzimuthAngle = -0.13;
controls.maxAzimuthAngle = 0.13;
controls.minPolarAngle = 1.29;
controls.maxPolarAngle = 1.52;
controls.target.set(0, 4.5, -7.3);
controls.enabled = !reducedMotion;

function woodTexture() {
  const c = document.createElement('canvas'); c.width=1024; c.height=1024;
  const x=c.getContext('2d');
  x.fillStyle='#351a0f'; x.fillRect(0,0,1024,1024);
  for(let i=0;i<32;i++){
    const y=i*32; x.fillStyle=i%2?'#3e2114':'#2c160d'; x.fillRect(0,y,1024,30);
    x.strokeStyle='rgba(226,164,94,.12)'; x.lineWidth=1; x.beginPath(); x.moveTo(0,y+1); x.lineTo(1024,y+1); x.stroke();
    for(let j=0;j<18;j++){x.strokeStyle=`rgba(255,225,183,${0.015+Math.random()*.035})`;x.beginPath();x.moveTo(Math.random()*1024,y+4+Math.random()*24);x.bezierCurveTo(300,y+Math.random()*30,720,y+Math.random()*30,1024,y+4+Math.random()*24);x.stroke();}
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(5,12); t.colorSpace=THREE.SRGBColorSpace; t.anisotropy=renderer.capabilities.getMaxAnisotropy(); return t;
}
function plasterTexture() {
  const c=document.createElement('canvas'); c.width=c.height=512; const x=c.getContext('2d');
  const img=x.createImageData(512,512); for(let i=0;i<img.data.length;i+=4){const v=27+Math.random()*14;img.data[i]=v*1.45;img.data[i+1]=v*.7;img.data[i+2]=v*.65;img.data[i+3]=255;} x.putImageData(img,0,0);
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,2); t.colorSpace=THREE.SRGBColorSpace; return t;
}
const woodMap=woodTexture(), wallMap=plasterTexture();
const mat={
  wall:new THREE.MeshPhysicalMaterial({map:wallMap,color:0x6b3131,roughness:.93,metalness:0}),
  wood:new THREE.MeshPhysicalMaterial({map:woodMap,color:0xffffff,roughness:.34,metalness:.05,clearcoat:.55,clearcoatRoughness:.24}),
  velvet:new THREE.MeshPhysicalMaterial({color:0x620915,roughness:.82,metalness:0,sheen:1,sheenColor:new THREE.Color(0x8f2530),sheenRoughness:.7}),
  velvetDark:new THREE.MeshPhysicalMaterial({color:0x270207,roughness:.9,sheen:.6,sheenColor:new THREE.Color(0x4e1018)}),
  brass:new THREE.MeshPhysicalMaterial({color:0xc49a57,roughness:.25,metalness:.92,clearcoat:.3,clearcoatRoughness:.16}),
  blackMetal:new THREE.MeshPhysicalMaterial({color:0x111214,roughness:.22,metalness:.94,clearcoat:.18}),
  redSeat:new THREE.MeshPhysicalMaterial({color:0x6f0d18,roughness:.72,metalness:0,sheen:1,sheenColor:new THREE.Color(0xa42a36),sheenRoughness:.62}),
  screen:new THREE.MeshPhysicalMaterial({color:0xd8d1c2,roughness:.98,emissive:0x2b2118,emissiveIntensity:.16})
};

const addMesh=(geo,material,position,rotation=[0,0,0],parent=scene)=>{const m=new THREE.Mesh(geo,material);m.position.set(...position);m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
const box=(w,h,d,material,x,y,z,parent=scene)=>addMesh(new RoundedBoxGeometry(w,h,d,4,.045),material,[x,y,z],[0,0,0],parent);

// Architectural shell
box(24,.32,40,mat.wood,0,-.12,0);
box(24,11,.55,mat.wall,0,5.4,-18.6);
box(.5,11,40,mat.wall,-12,5.4,.1); box(.5,11,40,mat.wall,12,5.4,.1);
box(24,.36,40,new THREE.MeshPhysicalMaterial({color:0x170d0b,roughness:.9}),0,10.8,.1);

// Wall panels, pilasters and moldings
for(const side of [-1,1]){
  for(let i=0;i<5;i++){
    const z=-14.2+i*6.5;
    box(.22,6.2,4.8,new THREE.MeshPhysicalMaterial({color:0x421f20,roughness:.88}),side*11.72,5.25,z);
    box(.28,6.8,.34,mat.brass,side*11.43,5.3,z-2.38);
    box(.28,6.8,.34,mat.brass,side*11.43,5.3,z+2.38);
    box(.31,.22,4.9,mat.brass,side*11.43,8.62,z);
    box(.31,.22,4.9,mat.brass,side*11.43,2.02,z);
  }
}
for(let z=-15.5;z<15;z+=5.2){box(23,.16,.18,mat.brass,0,9.9,z);}

// Ceiling coffers
for(let x=-9;x<=9;x+=3){box(.12,.18,35,mat.brass,x,10.55,0);}
for(let z=-14;z<=14;z+=4.6){box(20,.18,.12,mat.brass,0,10.55,z);}

// Proscenium and screen
box(17.7,8.7,.5,mat.blackMetal,0,5,-17.95);
const screen=box(13.2,6.15,.12,mat.screen,0,5.15,-17.58);screen.castShadow=false;
box(18.6,.52,.78,mat.brass,0,9.35,-17.45); box(18.6,.52,.78,mat.brass,0,.98,-17.45);
for(const x of [-8.92,8.92]){
  const shaft=addMesh(new THREE.CylinderGeometry(.42,.52,7.9,28),mat.brass,[x,5.08,-17.3]);
  box(1.3,.42,1.05,mat.brass,x,1.05,-17.3); box(1.4,.38,1.05,mat.brass,x,9.18,-17.3);
  for(let y=1.55;y<8.8;y+=.5){const fl=addMesh(new THREE.TorusGeometry(.44,.025,8,24,Math.PI),mat.brass,[x,y,-16.84],[Math.PI/2,0,0]); fl.rotation.z=Math.PI/2;}
}
// Stage lip
box(18,.5,3.9,mat.wood,0,.27,-16.1);

// Velvet curtain folds
for(const side of [-1,1]){
  const g=new THREE.Group(); scene.add(g);
  for(let i=0;i<13;i++){
    const r=.26+(i%2)*.07; const fold=addMesh(new THREE.CylinderGeometry(r,r,8.25,20),mat.velvet,[side*(8.08+i*.23),5.18,-16.95-i*.015],[0,0,0],g); fold.scale.x=.72;
  }
}
for(let i=0;i<18;i++){
  const swag=addMesh(new THREE.TorusGeometry(6.8-i*.04,.22,14,64,Math.PI),i%3===0?mat.velvetDark:mat.velvet,[0,9.1-i*.08,-16.72],[0,0,Math.PI]);
  swag.scale.y=.15;
}

// Lighting
scene.add(new THREE.HemisphereLight(0x8d705f,0x050404,.42));
const ceilingKey=new THREE.SpotLight(0xffc688,58,45,Math.PI/4.6,.7,1.6);ceilingKey.position.set(0,10.2,7);ceilingKey.target.position.set(0,3,-10);ceilingKey.castShadow=true;ceilingKey.shadow.mapSize.set(isMobile?512:1024,isMobile?512:1024);scene.add(ceilingKey,ceilingKey.target);
const screenGlow=new THREE.RectAreaLight(0xffd6a0,7.2,12.7,5.7);screenGlow.position.set(0,5.1,-17.2);screenGlow.lookAt(0,5.1,0);scene.add(screenGlow);

function sconce(side,z){
  const g=new THREE.Group();g.position.set(side*11.25,5.65,z);scene.add(g);
  addMesh(new THREE.CylinderGeometry(.22,.27,.18,24),mat.brass,[0,0,0],[0,0,Math.PI/2],g);
  addMesh(new THREE.TorusGeometry(.26,.045,8,24,Math.PI),mat.brass,[side<0?.18:-.18,.18,0],[0,0,side<0?-Math.PI/2:Math.PI/2],g);
  const bulbMat=new THREE.MeshPhysicalMaterial({color:0xffd39a,emissive:0xffa84f,emissiveIntensity:4,roughness:.2,transmission:.12});
  addMesh(new THREE.SphereGeometry(.16,18,14),bulbMat,[side<0?.34:-.34,.2,0],[],g);
  const p=new THREE.PointLight(0xffb96e,1.55,6,2);p.position.set(side<0?.36:-.36,.2,0);g.add(p);
}
for(const side of [-1,1])for(let z=-13;z<=11;z+=6)sconce(side,z);

// Chandeliers
for(const z of [-7,4]){
  const ring=addMesh(new THREE.TorusGeometry(1.35,.08,12,48),mat.brass,[0,8.85,z],[Math.PI/2,0,0]);
  for(let i=0;i<10;i++){
    const a=i/10*Math.PI*2; const x=Math.cos(a)*1.35, zz=Math.sin(a)*1.35;
    const bulb=addMesh(new THREE.SphereGeometry(.08,10,8),new THREE.MeshBasicMaterial({color:0xffc988}),[x,8.72,z+zz]);
    const p=new THREE.PointLight(0xffb86d,.35,3.6,2);p.position.copy(bulb.position);scene.add(p);
  }
}

// Aisle lights
for(let z=-12;z<12;z+=2.3){for(const x of [-1.1,1.1]){const b=addMesh(new THREE.SphereGeometry(.055,10,8),new THREE.MeshBasicMaterial({color:0xffa451}),[x,.18,z]);const p=new THREE.PointLight(0xff9f4d,.25,2.5,2);p.position.copy(b.position);scene.add(p);}}

// Vintage posters
function posterTexture(title,year,c1,c2){
  const c=document.createElement('canvas');c.width=700;c.height=1050;const x=c.getContext('2d');
  const gr=x.createLinearGradient(0,0,700,1050);gr.addColorStop(0,c1);gr.addColorStop(1,c2);x.fillStyle=gr;x.fillRect(0,0,700,1050);
  x.fillStyle='rgba(255,241,215,.9)';x.textAlign='center';x.font='700 98px Georgia';x.fillText(title,350,420);x.font='34px Georgia';x.fillText(year,350,480);
  x.strokeStyle='rgba(255,221,165,.55)';x.lineWidth=9;x.strokeRect(40,40,620,970);
  x.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<12;i++)x.fillRect(85,620+i*23,530,4);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
[['NOIR','1946','#2d2430','#090909'],['WEST','1957','#663317','#120905'],['SPACE','1968','#153155','#05070d'],['ROMANCE','1954','#713043','#170a0f']].forEach((p,i)=>{
  for(const side of [-1,1]){
    const poster=addMesh(new THREE.PlaneGeometry(1.7,2.55),new THREE.MeshPhysicalMaterial({map:posterTexture(...p),roughness:.54,clearcoat:.25}),[side*11.7,4.2,-11+i*6.6],[0,side===1?-Math.PI/2:Math.PI/2,0]);
    poster.castShadow=false;
  }
});

// Seats: detailed fallback first, replaced by high-quality GLB if loaded
const seatsRoot=new THREE.Group();scene.add(seatsRoot);
function makeFallbackSeat(){
  const g=new THREE.Group();
  const back=addMesh(new RoundedBoxGeometry(1.02,1.55,.34,6,.12),mat.redSeat,[0,1.35,.18],[-.12,0,0],g);
  const cushion=addMesh(new RoundedBoxGeometry(1.04,.34,.93,6,.12),mat.redSeat,[0,.58,-.08],[-.07,0,0],g);
  const armMat=new THREE.MeshPhysicalMaterial({color:0x2a1510,roughness:.42,clearcoat:.3});
  for(const x of [-.6,.6]){addMesh(new RoundedBoxGeometry(.13,.16,.88,4,.05),armMat,[x,.84,-.02],[0,0,0],g);addMesh(new THREE.CylinderGeometry(.05,.07,.85,10),mat.blackMetal,[x,.28,.05],[],g);}
  addMesh(new THREE.CylinderGeometry(.06,.09,.82,12),mat.blackMetal,[0,.2,.12],[],g);
  return g;
}
const seatPositions=[];
const rows=isMobile?4:6, cols=isMobile?8:12;
for(let r=0;r<rows;r++){
  const z=10-r*2.35, y=r*.16;
  for(let c=0;c<cols;c++){
    const x=(c-(cols-1)/2)*1.43;if(Math.abs(x)<1.05)continue;
    seatPositions.push([x,y,z]);const s=makeFallbackSeat();s.position.set(x,y,z);s.rotation.y=(x/12)*-.035;seatsRoot.add(s);
  }
}

// Projector pedestal and premium antique camera asset target
const projectorRoot=new THREE.Group();projectorRoot.position.set(isMobile?-5.5:-7.25,.65,-1.9);projectorRoot.rotation.y=.06;scene.add(projectorRoot);
const projectorHit=[];const addProjectorHit=o=>{o.traverse?.(x=>{if(x.isMesh)projectorHit.push(x)});return o};
box(2.8,.22,1.65,mat.wood,0,.72,0,projectorRoot);
for(const x of [-.9,.9])for(const z of [-.48,.48]) addMesh(new THREE.CylinderGeometry(.07,.1,1.35,12),mat.blackMetal,[x,.02,z],[],projectorRoot);
const fallbackBody=addMesh(new RoundedBoxGeometry(2.3,1.45,1.35,8,.14),mat.blackMetal,[0,1.72,0],[],projectorRoot);addProjectorHit(fallbackBody);
const lensBody=addMesh(new THREE.CylinderGeometry(.27,.39,1.35,32),mat.blackMetal,[.52,1.7,-1.18],[Math.PI/2,0,0],projectorRoot);addProjectorHit(lensBody);
const lens=addMesh(new THREE.CylinderGeometry(.24,.24,.08,32),new THREE.MeshPhysicalMaterial({color:0x25546b,emissive:0x5fb8df,emissiveIntensity:.15,roughness:.08,metalness:.48,transmission:.12}),[.52,1.7,-1.88],[Math.PI/2,0,0],projectorRoot);addProjectorHit(lens);

const reelMat=new THREE.MeshPhysicalMaterial({color:0x8e8a83,metalness:.94,roughness:.17,clearcoat:.25});
const reels=[];
function makeReel(x,y,z){const g=new THREE.Group();g.position.set(x,y,z);projectorRoot.add(g);const rim=addMesh(new THREE.TorusGeometry(.7,.075,16,56),reelMat,[0,0,0],[],g);const hub=addMesh(new THREE.CylinderGeometry(.15,.15,.14,28),mat.brass,[0,0,.02],[Math.PI/2,0,0],g);for(let i=0;i<5;i++){const sp=addMesh(new RoundedBoxGeometry(.1,1.08,.07,3,.02),reelMat,[0,0,.02],[0,0,i*Math.PI/5],g);}reels.push(g);addProjectorHit(g);return g;}
makeReel(-.64,3.15,.7);makeReel(.72,3.12,.7);
const film=addMesh(new THREE.PlaneGeometry(.14,1.75),new THREE.MeshPhysicalMaterial({color:0x170d08,roughness:.5,side:THREE.DoubleSide}),[.05,2.4,.75],[],projectorRoot);
for(let y=1.65;y<3.15;y+=.14)addMesh(new RoundedBoxGeometry(.1,.075,.02,2,.01),new THREE.MeshBasicMaterial({color:0x8b6138}),[.05,y,.77],[],projectorRoot);

// Projector beam
const beamStart=new THREE.Vector3();projectorRoot.localToWorld(beamStart.set(.52,1.7,-1.95));
const beamTarget=new THREE.Vector3(0,5.1,-17.35);const beamDir=new THREE.Vector3().subVectors(beamTarget,beamStart);const beamLen=beamDir.length();
const beamGeo=new THREE.CylinderGeometry(.1,4.7,beamLen,32,1,true);const beamMat=new THREE.MeshBasicMaterial({color:0xffe0a7,transparent:true,opacity:.055,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
const beam=new THREE.Mesh(beamGeo,beamMat);beam.position.copy(beamStart).add(beamTarget).multiplyScalar(.5);beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),beamDir.clone().normalize());scene.add(beam);
const projectorLight=new THREE.SpotLight(0xffd39a,1.7,24,Math.PI/9,.6,1.6);projectorLight.position.copy(beamStart);projectorLight.target.position.copy(beamTarget);scene.add(projectorLight,projectorLight.target);

const dustCount=isMobile?280:700,dustPos=new Float32Array(dustCount*3);for(let i=0;i<dustCount;i++){const t=Math.random(),r=t*2.2*Math.sqrt(Math.random()),a=Math.random()*Math.PI*2;const p=beamStart.clone().lerp(beamTarget,t);p.x+=Math.cos(a)*r;p.y+=Math.sin(a)*r*.5;dustPos[i*3]=p.x;dustPos[i*3+1]=p.y;dustPos[i*3+2]=p.z;}const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dustPos,3));const dust=new THREE.Points(dg,new THREE.PointsMaterial({color:0xffe3b9,size:isMobile?.018:.027,transparent:true,opacity:.25,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(dust);

// Genre emblem on screen
const iconRoot=new THREE.Group();iconRoot.position.set(-3.75,5.15,-17.35);iconRoot.scale.setScalar(isMobile?.72:1);scene.add(iconRoot);let iconGroup=null;
const iconMat=(color,metal=.35,rough=.28)=>new THREE.MeshPhysicalMaterial({color,metalness:metal,roughness:rough,clearcoat:.28,emissive:new THREE.Color(color).multiplyScalar(.08),emissiveIntensity:.18});
function clearIcon(){if(!iconGroup)return;iconRoot.remove(iconGroup);iconGroup.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!Array.isArray(o.material))o.material.dispose?.()});iconGroup=null;}
function addHeart(g,color){const s=new THREE.Shape();s.moveTo(0,-.65);s.bezierCurveTo(-1.35,.12,-.72,1.08,0,.45);s.bezierCurveTo(.72,1.08,1.35,.12,0,-.65);const m=addMesh(new THREE.ExtrudeGeometry(s,{depth:.24,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:3}),iconMat(color,.2,.3),[0,0,0],[],g);m.scale.setScalar(.78);}
function buildIcon(type,mood){clearIcon();const g=new THREE.Group();iconRoot.add(g);iconGroup=g;const c=mood;
  if(type==='romance')addHeart(g,c);
  else if(type==='scifi'){addMesh(new THREE.SphereGeometry(.65,28,20),iconMat(0x4ba6d8,.25,.22),[0,0,0],[],g);addMesh(new THREE.TorusGeometry(1.05,.045,10,64),new THREE.MeshBasicMaterial({color:0x9be8ff}),[0,0,0],[1.05,0,.25],g);}
  else if(type==='western'){addMesh(new THREE.CylinderGeometry(1.05,1.05,.17,32),iconMat(0x8f5a31,.05,.7),[0,0,0],[],g).scale.z=.65;addMesh(new THREE.CylinderGeometry(.52,.7,.75,28),iconMat(0xa16736,.05,.7),[0,.42,0],[],g);}
  else if(type==='crime'||type==='mystery'){addMesh(new THREE.TorusGeometry(.62,.1,14,38),iconMat(c,.72,.2),[-.28,.2,0],[],g);const h=addMesh(new THREE.CylinderGeometry(.09,.13,1.15,16),iconMat(0x6c4d30,.2,.42),[.52,-.42,0],[0,0,-Math.PI/4],g);}
  else if(type==='fantasy'){addMesh(new RoundedBoxGeometry(.16,2.25,.1,3,.02),iconMat(0xdde8ed,.88,.12),[0,.1,0],[0,0,.25],g);addMesh(new THREE.OctahedronGeometry(.58),iconMat(0x9c63dc,.2,.16),[.65,-.25,.15],[],g);}
  else if(type==='thriller'){addMesh(new THREE.CylinderGeometry(.72,.72,.18,36),iconMat(0x34383a,.8,.18),[0,0,0],[Math.PI/2,0,0],g);addMesh(new RoundedBoxGeometry(.06,.72,.04,2,.01),iconMat(0xe05343,.25,.3),[0,.2,.13],[0,0,.52],g);}
  else if(type==='horror'){addMesh(new THREE.SphereGeometry(.7,28,22),iconMat(0xd6cdbb,.06,.7),[0,.15,0],[],g).scale.y=.88;for(const x of[-.25,.25])addMesh(new THREE.SphereGeometry(.12,12,10),iconMat(0x110000,0,.4),[x,.28,.62],[],g);addMesh(new RoundedBoxGeometry(.62,.3,.45,4,.06),iconMat(0xbab19f,.05,.74),[0,-.5,.12],[],g);}
  else if(type==='action'){const b=addMesh(new THREE.CylinderGeometry(.15,.24,1.7,24),iconMat(0xd9b669,.9,.18),[-.1,0,0],[0,0,Math.PI/2],g);for(let i=0;i<10;i++)addMesh(new THREE.ConeGeometry(.045,.7,5),iconMat(c,.08,.35),[.65,0,0],[0,0,i*Math.PI*2/10],g);}
  else if(type==='adventure'){addMesh(new THREE.CylinderGeometry(.82,.82,.16,40),iconMat(0xb48e51,.78,.2),[0,0,0],[Math.PI/2,0,0],g);addMesh(new THREE.ConeGeometry(.11,1.1,4),iconMat(0xd64132,.2,.3),[0,0,.12],[0,0,Math.PI],g);}
  else {for(const s of[-1,1]){const m=addMesh(new THREE.SphereGeometry(.62,24,18),iconMat(s<0?0xd2a96f:0x7a5545,.18,.5),[s*.5,0,0],[0,s*.18,0],g);m.scale.set(.9,1.12,.45);}}
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});g.scale.setScalar(.001);
}

// High quality ready-made CC0 assets (Khronos glTF Sample Assets)
const gltfLoader=new GLTFLoader();
const chairURL='https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb';
const cameraURL='https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AntiqueCamera/glTF-Binary/AntiqueCamera.glb';
async function upgradeSeats(){
  try{
    const gltf=await gltfLoader.loadAsync(chairURL);const base=gltf.scene;base.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(base),sz=new THREE.Vector3();bb.getSize(sz);const scale=1.52/Math.max(sz.y,1e-3);
    seatsRoot.clear();
    for(const [x,y,z] of seatPositions){const c=base.clone(true);c.scale.setScalar(scale);c.rotation.y=Math.PI+(x/12)*-.035;c.position.set(x,y,z);c.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material){o.material=o.material.clone();o.material.roughness=Math.max(.38,o.material.roughness??.5);}}});const b=new THREE.Box3().setFromObject(c);c.position.y+=y-b.min.y+.02;seatsRoot.add(c);}
  }catch(err){console.warn('Premium chair asset unavailable; keeping detailed procedural seats.',err);}
}
async function upgradeProjector(){
  try{
    const gltf=await gltfLoader.loadAsync(cameraURL);const model=gltf.scene;model.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(model),sz=new THREE.Vector3();bb.getSize(sz);const scale=2.4/Math.max(sz.x,sz.y,sz.z);model.scale.setScalar(scale);model.rotation.y=Math.PI;model.position.set(0,1.1,.08);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;projectorHit.push(o);if(o.material){o.material=o.material.clone();o.material.envMapIntensity=1.2;}}});projectorRoot.add(model);fallbackBody.visible=false;lensBody.visible=false;
  }catch(err){console.warn('Premium antique camera asset unavailable; keeping detailed projector fallback.',err);}
}
upgradeSeats();upgradeProjector();

let current=0,transitioning=false,hovered=false,projectorActive=false,audioEnabled=false,qualityHigh=!isMobile;
let pointer=new THREE.Vector2(99,99),touchStart=null,targetParallax=new THREE.Vector2();
function writeGenre(g,index){$('#genre-fa').textContent=g.fa;$('#genre-en').textContent=g.en;$('#genre-description').textContent=g.description;$('#genre-features').innerHTML=g.features.map(v=>`<li>${v}</li>`).join('');$('#genre-examples').innerHTML=g.examples.map(v=>`<li>${v}</li>`).join('');$('#genre-number').textContent=String(index+1).padStart(2,'0');$('#genre-label').textContent=g.fa;$('#status-progress').style.width=`${((index+1)/genres.length)*100}%`;}
function animateScaleIn(g){if(reducedMotion){g.scale.setScalar(1);return;}let s=.001;const start=performance.now();const tick=()=>{const t=Math.min(1,(performance.now()-start)/720);const e=1-Math.pow(1-t,3);s=.001+(1.08-.001)*e;if(t>.8)s=1+(1-t)*.4;g.scale.setScalar(s);if(t<1)requestAnimationFrame(tick);};tick();}
function changeGenre(dir=1,fromProjector=false){if(transitioning)return;transitioning=true;projectorActive=true;const ft=$('#film-transition');ft?.classList.remove('active');void ft?.offsetWidth;ft?.classList.add('active');setTimeout(()=>{current=(current+dir+genres.length)%genres.length;const g=genres[current];writeGenre(g,current);buildIcon(g.icon,g.mood);animateScaleIn(iconGroup);screenGlow.color.setHex(g.mood);screenGlow.intensity=isMobile?5.5:8.2;},320);setTimeout(()=>{ft?.classList.remove('active');transitioning=false;projectorActive=false;},980);playClick();}

// Audio after opt-in
let audioCtx=null;function playClick(){if(!audioEnabled)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),gain=audioCtx.createGain();o.type='square';o.frequency.setValueAtTime(160,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(58,audioCtx.currentTime+.16);gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.22);o.connect(gain).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.24);}catch(_){}}

const raycaster=new THREE.Raycaster();
function setPointer(e){const r=canvas.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;targetParallax.set(pointer.x,pointer.y);}
canvas.addEventListener('pointermove',e=>{setPointer(e);if(hovered){const tip=$('#projector-tip');tip.style.left=`${e.clientX+14}px`;tip.style.top=`${e.clientY-12}px`;}});
canvas.addEventListener('pointerdown',e=>{setPointer(e);if(e.pointerType==='touch')touchStart=e.clientX;});
canvas.addEventListener('pointerup',e=>{if(e.pointerType==='touch'&&touchStart!==null){const dx=e.clientX-touchStart;touchStart=null;if(Math.abs(dx)>45){changeGenre(dx<0?1:-1);return;}}raycaster.setFromCamera(pointer,camera);if(raycaster.intersectObjects(projectorHit,true).length)changeGenre(1,true);});
function setHover(v){if(v===hovered)return;hovered=v;document.body.classList.toggle('projector-hover',v);$('#projector-tip')?.classList.toggle('visible',v);}

$('#next-btn')?.addEventListener('click',()=>changeGenre(1));
$('#prev-btn')?.addEventListener('click',()=>changeGenre(-1));
addEventListener('keydown',e=>{if(e.key==='ArrowLeft')changeGenre(1);if(e.key==='ArrowRight')changeGenre(-1);if(e.key==='Escape')closeModal();});
$('#sound-btn')?.addEventListener('click',async()=>{audioEnabled=!audioEnabled;$('#sound-btn').textContent=audioEnabled?'🔊':'🔇';$('#sound-btn').setAttribute('aria-pressed',String(audioEnabled));if(audioEnabled){playClick();if(audioCtx?.state==='suspended')await audioCtx.resume();}});
$('#quality-btn')?.addEventListener('click',()=>{qualityHigh=!qualityHigh;renderer.setPixelRatio(Math.min(devicePixelRatio,qualityHigh?(isMobile?1.45:2):1));renderer.shadowMap.enabled=qualityHigh;$('#quality-btn').textContent=qualityHigh?'HD':'ECO';});

const modalData={home:['MY CINEMA','این سالن، تجربه اصلی MY CINEMA است. روی دوربین/پروژکتور قدیمی کلیک کنید تا ژانر بعدی روی پرده نمایش داده شود.'],genres:['ژانرهای سینما',`در این تجربه ${genres.length} ژانر سینمایی با هویت بصری مستقل وجود دارد: ${genres.map(g=>g.fa).join('، ')}.`],about:['درباره پروژه','نسخه Premium با Three.js، نورپردازی فیزیکی، متریال‌های PBR، صندلی سه‌بعدی آماده CC0 و مدل Antique Camera آماده CC0 ساخته شده است.'],help:['راهنما','روی دوربین قدیمی کلیک کنید یا از دکمه‌های قبلی و بعدی استفاده کنید. کلیدهای جهت‌دار و Swipe موبایل نیز فعال هستند.']};
function openModal(key){const d=modalData[key];if(!d)return;$('#modal-title').textContent=d[0];$('#modal-body').innerHTML=`<p>${d[1]}</p>`;$('#modal').classList.add('open');$('#modal').setAttribute('aria-hidden','false');}
function closeModal(){$('#modal').classList.remove('open');$('#modal').setAttribute('aria-hidden','true');}
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.nav)));$('#modal-close')?.addEventListener('click',closeModal);$('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal();});

writeGenre(genres[0],0);buildIcon(genres[0].icon,genres[0].mood);animateScaleIn(iconGroup);

// Fast loader exit: heavy GLB assets stream in progressively after the room is visible.
const loader=$('#loader'),bar=$('#loader-bar'),pct=$('#loader-percent');let progress=0;const loadTimer=setInterval(()=>{progress=Math.min(100,progress+16+Math.floor(Math.random()*18));if(bar)bar.style.width=progress+'%';if(pct)pct.textContent=progress+'%';if(progress>=100){clearInterval(loadTimer);setTimeout(()=>{if(loader){loader.style.transition='opacity .65s ease';loader.style.opacity='0';loader.style.pointerEvents='none';setTimeout(()=>loader.remove(),700);}},120);}},70);

function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,qualityHigh?(isMobile?1.45:1.9):1));}
addEventListener('resize',resize,{passive:true});

const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);const t=clock.getElapsedTime();controls.update();
  if(!reducedMotion){camera.position.x+=(targetParallax.x*.22-camera.position.x)*.008;if(iconGroup){iconGroup.rotation.y=Math.sin(t*.7)*.13;iconGroup.position.y=Math.sin(t*1.25)*.08;}dust.rotation.z=Math.sin(t*.18)*.003;}
  raycaster.setFromCamera(pointer,camera);setHover(raycaster.intersectObjects(projectorHit,true).length>0);
  const reelSpeed=projectorActive?7.5:.18;reels[0].rotation.z+=.012*reelSpeed;reels[1].rotation.z-=.011*reelSpeed;film.position.y=2.4+(projectorActive?Math.sin(t*30)*.07:0);
  const pulse=projectorActive?(0.12+Math.sin(t*26)*.045):.052;beamMat.opacity=THREE.MathUtils.lerp(beamMat.opacity,pulse,.12);projectorLight.intensity=THREE.MathUtils.lerp(projectorLight.intensity,projectorActive?4.2:1.7,.08);
  renderer.render(scene,camera);
}
loop();
