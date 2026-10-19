// Brallent v3 交互：开屏 / 轮换词 / 宣言逐词点亮 / 抽屉 / tour / 轮播 / 数字 / 表单
(function(){
  "use strict";

  /* 开屏 */
  var pre = document.getElementById('preloader'),
      pct = document.getElementById('prePct'),
      fill = document.getElementById('preBarFill'), n = 0;
  var timer = setInterval(function(){
    n += Math.floor(Math.random()*13)+7;
    if(n >= 100){ n = 100; clearInterval(timer);
      setTimeout(function(){ pre.classList.add('done'); }, 400);
    }
    pct.textContent = n + '%'; fill.style.width = n + '%';
  }, 130);

  /* 抽屉 */
  var burger = document.getElementById('burger'),
      drawer = document.getElementById('drawer'),
      mask = document.getElementById('drawerMask');
  function closeDrawer(){ drawer.classList.remove('open'); mask.classList.remove('open'); }
  burger.addEventListener('click', function(){ drawer.classList.add('open'); mask.classList.add('open'); });
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  mask.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });

  /* Hero 轮换词 */
  var words = ['能力持续生长', '组织持续进化', '业务持续增长', '团队人人会用'];
  var rotWord = document.getElementById('rotWord'), wi = 0;
  setInterval(function(){
    rotWord.classList.add('swap');
    setTimeout(function(){
      wi = (wi + 1) % words.length;
      rotWord.textContent = words[wi];
      rotWord.classList.remove('swap');
    }, 300);
  }, 3200);

  /* 宣言逐词点亮 */
  var mText = document.getElementById('mText');
  var segs = mText.textContent.split(/(。|，)/g).filter(function(s){ return s; });
  mText.innerHTML = '';
  var wordSpans = [];
  segs.forEach(function(seg){
    if(seg === '。' || seg === '，'){
      mText.appendChild(document.createTextNode(seg));
    } else {
      for(var i = 0; i < seg.length; i++){
        var sp = document.createElement('span');
        sp.className = 'w'; sp.textContent = seg[i];
        mText.appendChild(sp); wordSpans.push(sp);
      }
    }
  });
  function lightWords(){
    var r = mText.getBoundingClientRect(),
        vh = window.innerHeight,
        p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / (r.height + vh * 0.25)));
    var lit = Math.floor(p * wordSpans.length);
    for(var i = 0; i < wordSpans.length; i++){
      wordSpans[i].classList.toggle('lit', i < lit);
    }
  }
  window.addEventListener('scroll', lightWords, {passive:true});
  lightWords();

  /* 交付 tour */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.ttab')),
      panels = Array.prototype.slice.call(document.querySelectorAll('.tpanel'));
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      panels.forEach(function(p){ p.classList.remove('active'); });
      tab.classList.add('active'); panels[i].classList.add('active');
    });
  });

  /* 数字员工轮播 */
  (function(){
    var root = document.getElementById('staffCarousel'); if(!root) return;
    var track = root.querySelector('.car-track'),
        cards = track.children.length,
        ind = root.querySelector('.car-ind');
    function w(){ return track.children[0].getBoundingClientRect().width + 14; }
    function update(){
      var i = Math.min(cards - 1, Math.max(0, Math.round(track.scrollLeft / w())));
      ind.textContent = (i + 1) + ' / ' + cards;
    }
    root.querySelector('.car-prev').addEventListener('click', function(){ track.scrollBy({left: -w(), behavior: 'smooth'}); });
    root.querySelector('.car-next').addEventListener('click', function(){ track.scrollBy({left: w(), behavior: 'smooth'}); });
    var t;
    track.addEventListener('scroll', function(){ clearTimeout(t); t = setTimeout(update, 120); }, {passive:true});
    update();
  })();

  /* 滚动显现 */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* 数字滚动 */
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, target = +el.dataset.n, t0 = null;
      (function step(ts){
        if(!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1300);
        el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
        if(p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }, {threshold: .5});
  document.querySelectorAll('.count').forEach(function(el){ cio.observe(el); });

  /* 回到顶部 */
  var fabTop = document.getElementById('fabTop');
  window.addEventListener('scroll', function(){
    fabTop.classList.toggle('show', window.scrollY > 600);
  }, {passive:true});
  fabTop.addEventListener('click', function(){ window.scrollTo({top: 0, behavior: 'smooth'}); });

  /* 表单 */
  var form = document.getElementById('contactForm'),
      ok = document.getElementById('formOk');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    ok.hidden = false;
    form.querySelector('button[type=submit]').textContent = '已提交';
    ok.scrollIntoView({block: 'center', behavior: 'smooth'});
  });
})();
