const $ = (s) => document.querySelector(s);

const genres = [
  {fa:'اکشن',en:'ACTION',icon:'✦',mood:'#ff7b35',description:'فیلم‌های اکشن بر پایه هیجان، تعقیب‌وگریز، مبارزه، خطر و اتفاقات سریع ساخته می‌شوند. این ژانر معمولاً از بدلکاری، جلوه‌های ویژه و سکانس‌های پرانرژی برای ایجاد ضرباهنگ بالا استفاده می‌کند.',features:['ریتم سریع','تعقیب و گریز','مبارزه','جلوه‌های ویژه','قهرمان محوری'],examples:['The Dark Knight','Mad Max: Fury Road','John Wick']},
  {fa:'ترسناک',en:'HORROR',icon:'☠',mood:'#8f1831',description:'ژانر ترسناک با ایجاد اضطراب، ناشناخته‌ها و فضای تهدیدآمیز تلاش می‌کند حس ترس و تعلیق را برانگیزد. نورپردازی محدود، صدا و طراحی فضا نقش مهمی در تجربه این ژانر دارند.',features:['تعلیق','فضای تاریک','ناشناخته','شوک‌های کنترل‌شده','طراحی صدا'],examples:['The Shining','Alien','The Conjuring']},
  {fa:'کمدی',en:'COMEDY',icon:'◡',mood:'#f2c65c',description:'کمدی از موقعیت، شخصیت، دیالوگ و زمان‌بندی برای ایجاد خنده و سبک‌کردن فضا استفاده می‌کند. این ژانر می‌تواند از طنز روزمره تا هجو اجتماعی و کمدی فیزیکی گسترده باشد.',features:['ریتم شوخ‌طبعانه','موقعیت طنز','دیالوگ','اغراق','پایان سبک‌تر'],examples:['The Grand Budapest Hotel','Groundhog Day','The Mask']},
  {fa:'عاشقانه',en:'ROMANCE',icon:'♥',mood:'#e56c8b',description:'فیلم‌های عاشقانه بر شکل‌گیری، پیچیدگی و تحول رابطه عاطفی میان شخصیت‌ها تمرکز دارند. موسیقی، بازی‌های احساسی و لحظات صمیمی معمولاً هسته تجربه را می‌سازند.',features:['روابط انسانی','احساس','کشمکش عاطفی','موسیقی نرم','شیمی شخصیت‌ها'],examples:['Before Sunrise','La La Land','Pride & Prejudice']},
  {fa:'وسترن',en:'WESTERN',icon:'★',mood:'#c78645',description:'وسترن جهان مرزی، بیابان، قانون، شرافت و تقابل انسان با محیط را روایت می‌کند. تصویرسازی افق‌های باز، دوئل و تنهایی شخصیت‌ها از نشانه‌های کلاسیک آن است.',features:['فضای مرزی','دوئل','بیابان','قانون و بی‌قانونی','قهرمان تنها'],examples:['The Good, the Bad and the Ugly','Unforgiven','True Grit']},
  {fa:'جنایی',en:'CRIME',icon:'⌕',mood:'#5aa1a8',description:'ژانر جنایی حول جرم، تحقیق، پلیس، مجرم و پیامدهای اخلاقی انتخاب‌ها شکل می‌گیرد. روایت می‌تواند از دید کارآگاه، قربانی یا حتی مجرم پیش برود.',features:['تحقیق','جرم','سرنخ','اخلاق خاکستری','تعلیق روایی'],examples:['Heat','Se7en','The Departed']},
  {fa:'درام',en:'DRAMA',icon:'◐',mood:'#9d6b55',description:'درام بر شخصیت، تضادهای انسانی و پیامدهای واقعی تصمیم‌ها تمرکز دارد. هدف اصلی آن ایجاد همدلی و درگیرکردن مخاطب با تجربه‌های عاطفی و اجتماعی است.',features:['شخصیت‌محوری','تعارض انسانی','واقع‌گرایی','تحول شخصیت','بار احساسی'],examples:['The Shawshank Redemption','Manchester by the Sea','A Separation']},
  {fa:'علمی تخیلی',en:'SCIENCE FICTION',icon:'◉',mood:'#48aee8',description:'علمی تخیلی ایده‌های علمی، فناوری آینده، فضا و پرسش‌های فلسفی درباره انسان را به جهان‌های فرضی می‌برد. طراحی جهان و مفهوم مرکزی معمولاً نقش بنیادین دارد.',features:['فناوری آینده','فضا','جهان‌سازی','ایده علمی','پرسش فلسفی'],examples:['2001: A Space Odyssey','Interstellar','Blade Runner 2049']},
  {fa:'ماجراجویی',en:'ADVENTURE',icon:'✥',mood:'#6fb26b',description:'ماجراجویی شخصیت‌ها را به سفر، کشف سرزمین‌ها و عبور از موانع می‌برد. حس اکتشاف، خطر و یافتن چیزهای ناشناخته موتور اصلی روایت است.',features:['سفر','اکتشاف','خطر','نقشه و هدف','محیط‌های متنوع'],examples:['Raiders of the Lost Ark','Life of Pi','The Mummy']},
  {fa:'فانتزی',en:'FANTASY',icon:'✧',mood:'#a56ed5',description:'فانتزی قوانین واقعیت را گسترش می‌دهد و با جادو، اسطوره و جهان‌های خیالی تجربه‌ای فراتر از زندگی روزمره می‌سازد. نمادها و اسطوره‌ها در آن بسیار پررنگ‌اند.',features:['جادو','اسطوره','جهان خیالی','موجودات افسانه‌ای','قهرمانی'],examples:['The Lord of the Rings','Pan’s Labyrinth','Stardust']},
  {fa:'معمایی',en:'MYSTERY',icon:'?',mood:'#6f86a9',description:'ژانر معمایی اطلاعات را مرحله‌به‌مرحله در اختیار مخاطب می‌گذارد تا همراه شخصیت‌ها حقیقت را کشف کند. سرنخ، پنهان‌کاری و غافلگیری عناصر کلیدی هستند.',features:['سرنخ','راز','کشف تدریجی','سوءظن','چرخش داستانی'],examples:['Knives Out','Memento','Zodiac']},
  {fa:'هیجان‌انگیز',en:'THRILLER',icon:'◷',mood:'#d14a36',description:'تریلر با فشار زمانی، خطر نزدیک و عدم قطعیت، مخاطب را در وضعیت تنش نگه می‌دارد. تدوین، موسیقی و اطلاعات محدود ابزارهای اصلی ایجاد هیجان‌اند.',features:['تنش','خطر نزدیک','فشار زمانی','غافلگیری','ریتم کنترل‌شده'],examples:['Prisoners','Sicario','Gone Girl']},
  {fa:'انیمیشن',en:'ANIMATION',icon:'◎',mood:'#4ebdc3',description:'انیمیشن با جان‌بخشیدن به طراحی، تصویر و حرکت می‌تواند هر جهان ممکنی را خلق کند. این رسانه از روایت کودکانه تا آثار پیچیده و بزرگسالانه گسترده است.',features:['طراحی حرکت','جهان‌سازی آزاد','بیان بصری','اغراق کنترل‌شده','سبک‌های متنوع'],examples:['Spirited Away','Ratatouille','Spider-Man: Into the Spider-Verse']}
];

function seatMarkup(count){
  return Array.from({length:count},(_,i)=>`<span class="cinema-seat" style="--i:${i}"><i class="seat-back"></i><i class="seat-cushion"></i><i class="seat-arm a"></i><i class="seat-arm b"></i><i class="seat-leg"></i></span>`).join('');
}
function spokes(){ return '<b></b>'.repeat(6); }

function startCompatibilityMode(){
  document.body.classList.add('compat-mode','premium-compat');
  $('#webgl-fallback')?.setAttribute('hidden','');
  const canvas=$('#cinema-canvas'); if(canvas) canvas.style.display='none';

  const scene=document.createElement('div');
  scene.id='compat-scene';
  scene.innerHTML=`
    <div class="theater-depth"></div>
    <div class="ceiling"><i></i><i></i><i></i><i></i><span class="chandelier c1">${spokes()}</span><span class="chandelier c2">${spokes()}</span></div>
    <div class="sidewall left"><div class="wall-panel p1"></div><div class="wall-panel p2"></div><div class="wall-panel p3"></div><div class="sconce s1"></div><div class="sconce s2"></div><div class="poster poster-a">NOIR<small>1946</small></div><div class="poster poster-b">SPACE<small>1968</small></div></div>
    <div class="sidewall right"><div class="wall-panel p1"></div><div class="wall-panel p2"></div><div class="wall-panel p3"></div><div class="sconce s1"></div><div class="sconce s2"></div><div class="poster poster-c">WEST<small>1957</small></div><div class="poster poster-d">ROMANCE<small>1954</small></div></div>
    <div class="proscenium"><div class="proscenium-gold top"></div><div class="proscenium-gold left"></div><div class="proscenium-gold right"></div><div class="curtain left"></div><div class="curtain right"></div><div class="valance"></div><div class="screen-frame"><div class="screen"><div class="screen-glow"></div><div id="compat-icon" class="compat-icon">✦</div><div class="film-lines"></div></div></div></div>
    <div class="stage"></div>
    <div class="floor"><div class="carpet"></div><div class="aisle-lights l"></div><div class="aisle-lights r"></div></div>
    <div class="seat-row row-back">${seatMarkup(10)}</div>
    <div class="seat-row row-mid">${seatMarkup(10)}</div>
    <div class="seat-row row-front">${seatMarkup(10)}</div>
    <button id="compat-projector" class="projector" type="button" aria-label="نمایش ژانر بعدی">
      <span class="projector-reel reel-a">${spokes()}</span><span class="projector-reel reel-b">${spokes()}</span>
      <span class="projector-body"><i class="panel"></i><i class="vent"></i><i class="knob"></i><i class="lens-barrel"><em></em></i></span>
      <span class="film-strip"></span><span class="projector-neck"></span><span class="projector-tripod t1"></span><span class="projector-tripod t2"></span><span class="projector-tripod t3"></span><span class="projector-base"></span>
      <span class="beam"></span><span class="beam-dust"></span>
    </button>
    <div class="compat-hint">روی پروژکتور قدیمی کلیک کنید</div>`;
  $('#app').prepend(scene);

  let current=0,audioEnabled=false,touchStart=null,audioCtx=null;
  const projector=$('#compat-projector'),icon=$('#compat-icon');
  function renderGenre(index,animate=true){
    current=(index+genres.length)%genres.length;const g=genres[current];
    scene.style.setProperty('--mood',g.mood);scene.dataset.genre=g.en;
    $('#genre-fa').textContent=g.fa;$('#genre-en').textContent=g.en;$('#genre-description').textContent=g.description;
    $('#genre-features').innerHTML=g.features.map(v=>`<li>${v}</li>`).join('');$('#genre-examples').innerHTML=g.examples.map(v=>`<li>${v}</li>`).join('');
    $('#genre-number').textContent=String(current+1).padStart(2,'0');$('#genre-label').textContent=g.fa;$('#status-progress').style.width=`${((current+1)/genres.length)*100}%`;
    icon.textContent=g.icon;
    if(animate){ icon.classList.remove('change');void icon.offsetWidth;icon.classList.add('change');projector.classList.add('playing');$('#film-transition')?.classList.add('active');setTimeout(()=>projector.classList.remove('playing'),1050);setTimeout(()=>$('#film-transition')?.classList.remove('active'),820);playClick(); }
  }
  const next=()=>renderGenre(current+1),prev=()=>renderGenre(current-1);
  projector.addEventListener('click',next);$('#next-btn')?.addEventListener('click',next);$('#prev-btn')?.addEventListener('click',prev);
  addEventListener('keydown',e=>{if(e.key==='ArrowLeft')next();if(e.key==='ArrowRight')prev();if(e.key==='Escape')closeModal();});
  scene.addEventListener('touchstart',e=>touchStart=e.touches[0]?.clientX,{passive:true});scene.addEventListener('touchend',e=>{if(touchStart==null)return;const d=(e.changedTouches[0]?.clientX??touchStart)-touchStart;if(Math.abs(d)>45)(d<0?next:prev)();touchStart=null;},{passive:true});

  function playClick(){if(!audioEnabled)return;try{audioCtx||=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='square';o.frequency.setValueAtTime(130,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(45,audioCtx.currentTime+.22);g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.04,audioCtx.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.3);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.32);}catch(_){}}
  $('#sound-btn')?.addEventListener('click',()=>{audioEnabled=!audioEnabled;$('#sound-btn').textContent=audioEnabled?'🔊':'🔇';$('#sound-btn').setAttribute('aria-pressed',String(audioEnabled));if(audioEnabled)playClick();});

  const modal=$('#modal');function openModal(kind){const data={genres:['ژانرها','۱۳ ژانر سینمایی با فضای بصری مستقل روی پرده نمایش داده می‌شود.'],about:['درباره پروژه','این نسخه سازگار با رندر چندلایه CSS و جزئیات معماری، صندلی‌های چندبخشی و پروژکتور کلاسیک بازطراحی شده تا بدون WebGL هم ظاهر سینمایی‌تری داشته باشد.'],help:['راهنما','روی پروژکتور کلیک کنید؛ از دکمه‌ها، کلیدهای جهت‌دار یا Swipe هم می‌توانید استفاده کنید.']};if(kind==='home'){renderGenre(0);return;}const d=data[kind];if(!d)return;$('#modal-title').textContent=d[0];$('#modal-body').innerHTML=`<p>${d[1]}</p>`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');}
  function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');}
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.nav)));$('#modal-close')?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});

  renderGenre(0,false);
  const loader=$('#loader'),bar=$('#loader-bar'),pct=$('#loader-percent');let p=0;const timer=setInterval(()=>{p=Math.min(100,p+18+Math.floor(Math.random()*15));if(bar)bar.style.width=p+'%';if(pct)pct.textContent=p+'%';if(p>=100){clearInterval(timer);setTimeout(()=>{if(loader){loader.style.transition='opacity .55s ease';loader.style.opacity='0';loader.style.pointerEvents='none';setTimeout(()=>loader.remove(),600);}},120);}},65);
}

startCompatibilityMode();