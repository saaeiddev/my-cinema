const $ = (s) => document.querySelector(s);

function canCreateWebGL() {
  const canvas = document.createElement('canvas');
  const attrs = {
    alpha: false,
    antialias: false,
    depth: true,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
  };
  for (const name of ['webgl2', 'webgl', 'experimental-webgl']) {
    try {
      const gl = canvas.getContext(name, attrs);
      if (gl) {
        const ext = gl.getExtension && gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        return true;
      }
    } catch (_) {}
  }
  return false;
}

async function boot() {
  if (canCreateWebGL()) {
    try {
      await import('./app.js?v=4');
      return;
    } catch (err) {
      console.warn('MY CINEMA: WebGL renderer failed, switching to compatibility mode.', err);
    }
  }
  startCompatibilityMode();
}

const genres = [
  {fa:'اکشن',en:'ACTION',icon:'💥',mood:'#ff7b35',description:'فیلم‌های اکشن بر پایه هیجان، تعقیب‌وگریز، مبارزه، خطر و اتفاقات سریع ساخته می‌شوند. این ژانر معمولاً از بدلکاری، جلوه‌های ویژه و سکانس‌های پرانرژی برای ایجاد ضرباهنگ بالا استفاده می‌کند.',features:['ریتم سریع','تعقیب و گریز','مبارزه','جلوه‌های ویژه','قهرمان محوری'],examples:['The Dark Knight','Mad Max: Fury Road','John Wick']},
  {fa:'ترسناک',en:'HORROR',icon:'💀',mood:'#8f1831',description:'ژانر ترسناک با ایجاد اضطراب، ناشناخته‌ها و فضای تهدیدآمیز تلاش می‌کند حس ترس و تعلیق را برانگیزد. نورپردازی محدود، صدا و طراحی فضا نقش مهمی در تجربه این ژانر دارند.',features:['تعلیق','فضای تاریک','ناشناخته','شوک‌های کنترل‌شده','طراحی صدا'],examples:['The Shining','Alien','The Conjuring']},
  {fa:'کمدی',en:'COMEDY',icon:'🎭',mood:'#f2c65c',description:'کمدی از موقعیت، شخصیت، دیالوگ و زمان‌بندی برای ایجاد خنده و سبک‌کردن فضا استفاده می‌کند. این ژانر می‌تواند از طنز روزمره تا هجو اجتماعی و کمدی فیزیکی گسترده باشد.',features:['ریتم شوخ‌طبعانه','موقعیت طنز','دیالوگ','اغراق','پایان سبک‌تر'],examples:['The Grand Budapest Hotel','Groundhog Day','The Mask']},
  {fa:'عاشقانه',en:'ROMANCE',icon:'❤️',mood:'#e56c8b',description:'فیلم‌های عاشقانه بر شکل‌گیری، پیچیدگی و تحول رابطه عاطفی میان شخصیت‌ها تمرکز دارند. موسیقی، بازی‌های احساسی و لحظات صمیمی معمولاً هسته تجربه را می‌سازند.',features:['روابط انسانی','احساس','کشمکش عاطفی','موسیقی نرم','شیمی شخصیت‌ها'],examples:['Before Sunrise','La La Land','Pride & Prejudice']},
  {fa:'وسترن',en:'WESTERN',icon:'🤠',mood:'#c78645',description:'وسترن جهان مرزی، بیابان، قانون، شرافت و تقابل انسان با محیط را روایت می‌کند. تصویرسازی افق‌های باز، دوئل و تنهایی شخصیت‌ها از نشانه‌های کلاسیک آن است.',features:['فضای مرزی','دوئل','بیابان','قانون و بی‌قانونی','قهرمان تنها'],examples:['The Good, the Bad and the Ugly','Unforgiven','True Grit']},
  {fa:'جنایی',en:'CRIME',icon:'🔎',mood:'#5aa1a8',description:'ژانر جنایی حول جرم، تحقیق، پلیس، مجرم و پیامدهای اخلاقی انتخاب‌ها شکل می‌گیرد. روایت می‌تواند از دید کارآگاه، قربانی یا حتی مجرم پیش برود.',features:['تحقیق','جرم','سرنخ','اخلاق خاکستری','تعلیق روایی'],examples:['Heat','Se7en','The Departed']},
  {fa:'درام',en:'DRAMA',icon:'🎬',mood:'#9d6b55',description:'درام بر شخصیت، تضادهای انسانی و پیامدهای واقعی تصمیم‌ها تمرکز دارد. هدف اصلی آن ایجاد همدلی و درگیرکردن مخاطب با تجربه‌های عاطفی و اجتماعی است.',features:['شخصیت‌محوری','تعارض انسانی','واقع‌گرایی','تحول شخصیت','بار احساسی'],examples:['The Shawshank Redemption','Manchester by the Sea','A Separation']},
  {fa:'علمی تخیلی',en:'SCIENCE FICTION',icon:'🪐',mood:'#48aee8',description:'علمی تخیلی ایده‌های علمی، فناوری آینده، فضا و پرسش‌های فلسفی درباره انسان را به جهان‌های فرضی می‌برد. طراحی جهان و مفهوم مرکزی معمولاً نقش بنیادین دارد.',features:['فناوری آینده','فضا','جهان‌سازی','ایده علمی','پرسش فلسفی'],examples:['2001: A Space Odyssey','Interstellar','Blade Runner 2049']},
  {fa:'ماجراجویی',en:'ADVENTURE',icon:'🧭',mood:'#6fb26b',description:'ماجراجویی شخصیت‌ها را به سفر، کشف سرزمین‌ها و عبور از موانع می‌برد. حس اکتشاف، خطر و یافتن چیزهای ناشناخته موتور اصلی روایت است.',features:['سفر','اکتشاف','خطر','نقشه و هدف','محیط‌های متنوع'],examples:['Raiders of the Lost Ark','Life of Pi','The Mummy']},
  {fa:'فانتزی',en:'FANTASY',icon:'🗡️',mood:'#a56ed5',description:'فانتزی قوانین واقعیت را گسترش می‌دهد و با جادو، اسطوره و جهان‌های خیالی تجربه‌ای فراتر از زندگی روزمره می‌سازد. نمادها و اسطوره‌ها در آن بسیار پررنگ‌اند.',features:['جادو','اسطوره','جهان خیالی','موجودات افسانه‌ای','قهرمانی'],examples:['The Lord of the Rings','Pan’s Labyrinth','Stardust']},
  {fa:'معمایی',en:'MYSTERY',icon:'🗝️',mood:'#6f86a9',description:'ژانر معمایی اطلاعات را مرحله‌به‌مرحله در اختیار مخاطب می‌گذارد تا همراه شخصیت‌ها حقیقت را کشف کند. سرنخ، پنهان‌کاری و غافلگیری عناصر کلیدی هستند.',features:['سرنخ','راز','کشف تدریجی','سوءظن','چرخش داستانی'],examples:['Knives Out','Memento','Zodiac']},
  {fa:'هیجان‌انگیز',en:'THRILLER',icon:'⏱️',mood:'#d14a36',description:'تریلر با فشار زمانی، خطر نزدیک و عدم قطعیت، مخاطب را در وضعیت تنش نگه می‌دارد. تدوین، موسیقی و اطلاعات محدود ابزارهای اصلی ایجاد هیجان‌اند.',features:['تنش','خطر نزدیک','فشار زمانی','غافلگیری','ریتم کنترل‌شده'],examples:['Prisoners','Sicario','Gone Girl']},
  {fa:'انیمیشن',en:'ANIMATION',icon:'🎞️',mood:'#4ebdc3',description:'انیمیشن با جان‌بخشیدن به طراحی، تصویر و حرکت می‌تواند هر جهان ممکنی را خلق کند. این رسانه از روایت کودکانه تا آثار پیچیده و بزرگسالانه گسترده است.',features:['طراحی حرکت','جهان‌سازی آزاد','بیان بصری','اغراق کنترل‌شده','سبک‌های متنوع'],examples:['Spirited Away','Ratatouille','Spider-Man: Into the Spider-Verse']}
];

function startCompatibilityMode() {
  document.body.classList.add('compat-mode');
  const fallback = $('#webgl-fallback');
  if (fallback) fallback.hidden = true;
  const canvas = $('#cinema-canvas');
  if (canvas) canvas.style.display = 'none';

  const scene = document.createElement('div');
  scene.id = 'compat-scene';
  scene.setAttribute('aria-label','حالت سازگار سینمای تعاملی');
  scene.innerHTML = `
    <div class="compat-room">
      <div class="compat-wall"></div>
      <div class="compat-screen-frame"><div class="compat-screen"><div id="compat-icon" class="compat-icon">💥</div></div></div>
      <div class="compat-curtain left"></div><div class="compat-curtain right"></div>
      <div class="compat-floor"></div><div class="compat-aisle"></div>
      <div class="compat-seat-row" style="bottom:18%;transform:scale(.86)">${'<i class="compat-seat"></i>'.repeat(10)}</div>
      <div class="compat-seat-row" style="bottom:10%;transform:scale(1.02)">${'<i class="compat-seat"></i>'.repeat(10)}</div>
      <button id="compat-projector" class="compat-projector" type="button" aria-label="نمایش ژانر بعدی">
        <i class="compat-reel r1"></i><i class="compat-reel r2"></i><i class="compat-projector-body"></i><i class="compat-projector-stand"></i><i class="compat-beam"></i>
      </button>
      <div class="compat-hint">حالت سازگاری فعال است — برای تعویض ژانر روی آپارات کلیک کنید</div>
    </div>`;
  document.querySelector('#app').prepend(scene);

  let current = 0;
  let audioEnabled = false;
  let audioCtx = null;
  let touchStart = null;
  const projector = $('#compat-projector');
  const icon = $('#compat-icon');

  function renderGenre(index, animate = true) {
    current = (index + genres.length) % genres.length;
    const g = genres[current];
    scene.style.setProperty('--mood', g.mood);
    $('#genre-fa').textContent = g.fa;
    $('#genre-en').textContent = g.en;
    $('#genre-description').textContent = g.description;
    $('#genre-features').innerHTML = g.features.map(v=>`<li>${v}</li>`).join('');
    $('#genre-examples').innerHTML = g.examples.map(v=>`<li>${v}</li>`).join('');
    $('#genre-number').textContent = String(current+1).padStart(2,'0');
    $('#genre-label').textContent = g.fa;
    $('#status-progress').style.width = `${((current+1)/genres.length)*100}%`;
    icon.textContent = g.icon;
    if (animate) {
      icon.classList.remove('change'); void icon.offsetWidth; icon.classList.add('change');
      projector.classList.add('playing');
      $('#film-transition')?.classList.add('active');
      setTimeout(()=>projector.classList.remove('playing'),900);
      setTimeout(()=>$('#film-transition')?.classList.remove('active'),650);
      playClick();
    }
  }

  function next() { renderGenre(current+1); }
  function prev() { renderGenre(current-1); }

  function playClick() {
    if (!audioEnabled) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type='square'; osc.frequency.setValueAtTime(92,audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(48,audioCtx.currentTime+.18);
      gain.gain.setValueAtTime(.0001,audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.015); gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.22);
      osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+.24);
    } catch (_) {}
  }

  projector.addEventListener('click', next);
  $('#next-btn')?.addEventListener('click', next);
  $('#prev-btn')?.addEventListener('click', prev);
  document.addEventListener('keydown', e=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });
  scene.addEventListener('touchstart',e=>touchStart=e.touches[0]?.clientX,{passive:true});
  scene.addEventListener('touchend',e=>{ if(touchStart==null)return; const d=(e.changedTouches[0]?.clientX??touchStart)-touchStart; if(Math.abs(d)>45)(d<0?next:prev)(); touchStart=null; },{passive:true});

  $('#sound-btn')?.addEventListener('click',()=>{
    audioEnabled=!audioEnabled;
    $('#sound-btn').textContent=audioEnabled?'🔊':'🔇';
    $('#sound-btn').setAttribute('aria-pressed',String(audioEnabled));
  });
  $('#quality-btn')?.addEventListener('click',()=>{ $('#quality-btn').textContent='COMPAT'; });

  const modal = $('#modal'), title=$('#modal-title'), body=$('#modal-body');
  function openModal(kind){
    const map={
      about:['درباره پروژه','<p>MY CINEMA یک تجربه تعاملی درباره ژانرهای سینمایی است. این دستگاه در حالت سازگاری بدون WebGL اجرا شده تا روی سیستم‌هایی که شتاب‌دهی گرافیکی مرورگر در دسترس نیست هم قابل استفاده باشد.</p>'],
      help:['راهنما','<p>روی آپارات کلیک کنید یا از دکمه‌های قبلی و بعدی استفاده کنید. کلیدهای جهت‌دار و سوایپ روی موبایل نیز فعال هستند.</p>'],
      genres:['ژانرها','<p>۱۳ ژانر سینمایی همراه با توضیح، ویژگی‌ها و نمونه فیلم‌ها در این تجربه قرار گرفته است.</p>']
    };
    const v=map[kind]; if(!v)return; title.textContent=v[0]; body.innerHTML=v[1]; modal.setAttribute('aria-hidden','false'); modal.classList.add('open');
  }
  document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>{ const k=btn.dataset.nav; if(k==='home'){renderGenre(0);return;} openModal(k); }));
  $('#modal-close')?.addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');});
  modal?.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}});

  renderGenre(0,false);
  const loader=$('#loader'), bar=$('#loader-bar'), pct=$('#loader-percent');
  let p=0;
  const timer=setInterval(()=>{
    p=Math.min(100,p+10+Math.floor(Math.random()*13));
    if(bar)bar.style.width=p+'%'; if(pct)pct.textContent=p+'%';
    if(p>=100){clearInterval(timer);setTimeout(()=>{if(loader){loader.style.opacity='0';loader.style.pointerEvents='none';setTimeout(()=>loader.hidden=true,500)}},180)}
  },60);
}

boot();
