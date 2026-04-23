import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
app.use('/assets/*', serveStatic({ root: './' }))

// ====================================================
// MANIFEST & SERVICE WORKER
// ====================================================
app.get('/manifest.json', (c) => {
  return c.json({
    "name": "Rung Chuông Vàng - Trường Mầm non Bắc Hà",
    "short_name": "Rung Chuông Vàng",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#1a0a2e",
    "theme_color": "#FFD700",
    "icons": [
      { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any" },
      { "src": "/favicon.svg", "sizes": "192x192", "type": "image/svg+xml", "purpose": "maskable" },
      { "src": "/favicon.svg", "sizes": "512x512", "type": "image/svg+xml", "purpose": "maskable" }
    ]
  })
})

app.get('/sw.js', (c) => {
  c.header('Content-Type', 'application/javascript')
  return c.body(`
    self.addEventListener('install', (e) => { self.skipWaiting(); });
    self.addEventListener('activate', (e) => { return self.clients.claim(); });
    self.addEventListener('fetch', (e) => {
      e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })));
    });
  `)
})

// ====================================================
// SHARED STYLES & SCRIPTS (head content)
// ====================================================
const SHARED_HEAD = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1a0a2e">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script src="https://cdn.tailwindcss.com"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{overflow:hidden;height:100%;height:100dvh;width:100vw;font-family:'Nunito',sans-serif;background:#1a0a2e;touch-action:manipulation}
.fredoka{font-family:'Nunito',sans-serif;font-weight:900}
.stars-bg{position:fixed;inset:0;background:linear-gradient(135deg,#1a0a2e 0%,#2d1b69 50%,#1a0a2e 100%);z-index:0;overflow:hidden}
.star{position:absolute;border-radius:50%;animation:twinkle linear infinite}
@keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
.screen{position:fixed;inset:0;z-index:10;display:none;flex-direction:column;align-items:center;justify-content:center;padding:12px;overflow:hidden}
.screen.active{display:flex}
@keyframes pikaBounce{from{transform:translateY(0) scale(1)}to{transform:translateY(-14px) scale(1.05)}}
@keyframes titlePulse{0%,100%{text-shadow:0 0 20px #FFD700,0 0 40px #FFA500}50%{text-shadow:0 0 40px #FFD700,0 0 80px #FFA500,0 0 100px #FF6B35}}
@keyframes bellRing{0%,100%{transform:rotate(-15deg)}50%{transform:rotate(15deg)}}
@keyframes btnPulse{0%,100%{box-shadow:0 8px 30px rgba(255,215,0,.6),0 0 0 0 rgba(255,215,0,.4)}50%{box-shadow:0 8px 30px rgba(255,215,0,.8),0 0 0 18px rgba(255,215,0,0)}}
@keyframes slideIn{to{opacity:1;transform:translateX(0)}}
@keyframes answerPop{from{transform:scale(.3) rotate(-10deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes correctPulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1.05)}}
@keyframes floatPika{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-15px) rotate(5deg)}}
@keyframes fireworkFly{0%{transform:translate(0,0) scale(0);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(1);opacity:0}}
@keyframes particleFloat{0%{transform:translateY(100vh) rotate(0deg);opacity:1}100%{transform:translateY(-100px) rotate(720deg);opacity:0}}
@keyframes lightning{0%{opacity:1}100%{opacity:0}}
@keyframes scoreIn{from{transform:scale(0) rotate(-180deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes popupIn{from{transform:scale(.5) translateY(40px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
@keyframes flashGreen{0%,100%{background:transparent}50%{background:rgba(0,200,80,.25)}}
@keyframes flashRed{0%,100%{background:transparent}50%{background:rgba(255,60,60,.25)}}
@keyframes countdownPulse{0%{transform:scale(1);color:#FFD700}50%{transform:scale(1.4);color:#FF4444}100%{transform:scale(1);color:#FFD700}}
.screen-flash-green{animation:flashGreen .5s ease}
.screen-flash-red{animation:flashRed .5s ease}
.pikachu-bounce{animation:pikaBounce .8s ease-in-out infinite alternate;filter:drop-shadow(0 0 30px #FFD700)}
.title-glow{animation:titlePulse 2s ease-in-out infinite}
.bell-ring{animation:bellRing 1s ease-in-out infinite;display:inline-block;transform-origin:top center}
.btn-main{background:linear-gradient(135deg,#FFD700,#FFA500);border:3px solid #fff;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:900;color:#1a0a2e;cursor:pointer;animation:btnPulse 2s ease-in-out infinite;transition:transform .2s;text-transform:uppercase;letter-spacing:1px}
.btn-main:active{transform:scale(.96)!important}
.btn-nav{background:linear-gradient(135deg,rgba(255,215,0,.18),rgba(255,165,0,.12));border:2px solid rgba(255,215,0,.5);border-radius:50px;color:#FFD700;font-family:'Nunito',sans-serif;font-weight:900;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.btn-nav:active{transform:scale(.96)!important}
.rule-card{background:linear-gradient(135deg,rgba(255,215,0,.13),rgba(255,165,0,.08));border:2px solid rgba(255,215,0,.35);border-radius:16px;display:flex;align-items:center;gap:12px;animation:slideIn .5s ease forwards;opacity:0;transform:translateX(-50px)}
#screen-grid{justify-content:flex-start;padding:8px 10px}
.grid-wrap{width:100%;max-width:960px;display:flex;flex-direction:column;height:100%;height:100dvh;overflow:hidden}
.grid-header{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap;padding:6px 0 4px}
.grid-actions{flex-shrink:0;display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.grid-container{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;flex:1;align-content:start;overflow:hidden}
.q-cell{background:linear-gradient(135deg,#FFD700,#FFA500);border:2.5px solid #fff;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;font-family:'Nunito',sans-serif;font-weight:900;color:#1a0a2e;position:relative;overflow:hidden;padding:6px 4px;min-height:44px}
.q-cell:active:not(.done){transform:scale(.95)}
.q-cell.done{background:linear-gradient(135deg,#2e7d32,#1b5e20);border-color:rgba(0,255,136,.5);cursor:pointer;opacity:.9}
.q-cell .q-num{font-size:1rem;font-weight:900;line-height:1}
.q-cell .q-check{position:absolute;top:2px;right:3px;font-size:.7rem;color:#00ff88;display:none}
.q-cell.done .q-check{display:block}
.q-cell.wrong-done{background:linear-gradient(135deg,#c62828,#b71c1c);border-color:rgba(255,100,100,.5)}
#screen-question{justify-content:flex-start;padding:6px 10px;overflow-y:auto;overflow-x:hidden}
.q-wrap{width:100%;max-width:880px;display:flex;flex-direction:column;min-height:100%;gap:5px;padding-bottom:8px}
.q-top-bar{flex-shrink:0;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.q-badge{background:linear-gradient(135deg,#FFD700,#FFA500);color:#1a0a2e;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:900;padding:5px 16px;font-size:1rem;white-space:nowrap}
.mode-badge{border-radius:50px;font-family:'Nunito',sans-serif;font-weight:900;padding:4px 12px;font-size:.8rem;white-space:nowrap}
.timer-row{flex-shrink:0;display:flex;align-items:center;gap:8px}
.timer-bar-wrap{flex:1;height:12px;background:rgba(255,255,255,.12);border-radius:10px;overflow:hidden;border:1.5px solid rgba(255,215,0,.25)}
.timer-bar{height:100%;border-radius:10px;transition:width .12s linear;width:100%}
.timer-num{font-family:'Nunito',sans-serif;font-weight:900;font-size:1.8rem;color:#FFD700;min-width:28px;text-align:center;line-height:1}
.timer-num.ticking{animation:countdownPulse .9s ease-in-out}
.q-card{background:linear-gradient(135deg,rgba(26,10,46,.97),rgba(45,27,105,.97));border:2.5px solid #FFD700;border-radius:18px;padding:10px 14px;flex-shrink:0;box-shadow:0 0 30px rgba(255,215,0,.2)}
.q-visual-wrap{display:flex;justify-content:center;align-items:center;margin:4px 0}
.q-visual-img{width:auto;height:auto;max-width:min(260px,50vw);max-height:min(200px,30vh);object-fit:contain;border-radius:12px;filter:drop-shadow(0 4px 16px rgba(255,215,0,.4))}
.q-visual-emoji{font-size:clamp(3.5rem,10vw,6rem);text-align:center;line-height:1;filter:drop-shadow(0 4px 12px rgba(255,215,0,.4))}
.q-text-main{font-size:clamp(1rem,2.4vw,1.5rem);color:#fff;font-weight:800;text-align:center;line-height:1.3}
.q-hint{font-size:.82rem;color:rgba(255,215,0,.7);text-align:center;margin-top:2px}
.choices-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex-shrink:0}
.choice-btn{background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.04));border:2.5px solid rgba(255,215,0,.35);border-radius:14px;padding:12px 18px;cursor:pointer;transition:all .25s;text-align:left;color:#fff;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:14px;position:relative;min-height:72px}
.choice-btn:active:not(.locked){transform:scale(.96)}
.choice-num-circle{width:36px;height:36px;background:linear-gradient(135deg,#FFD700,#FFA500);color:#1a0a2e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.3rem;flex-shrink:0}
.choice-label{font-size:clamp(1.1rem,2vw,1.4rem);font-weight:900;line-height:1.2}
.choice-btn.correct{background:linear-gradient(135deg,#00c851,#007E33)!important;border-color:#00ff88!important;transform:scale(1.04);box-shadow:0 0 28px rgba(0,200,81,.6);animation:correctPulse .5s ease}
.choice-btn.wrong{background:linear-gradient(135deg,#ff4444,#cc0000)!important;border-color:#ff6666!important;opacity:.65}
.choice-btn.selected{background:linear-gradient(135deg,rgba(255,215,0,.28),rgba(255,165,0,.18))!important;border-color:#FFD700!important;transform:translateY(-2px) scale(1.02);box-shadow:0 4px 18px rgba(255,215,0,.45)}
.choice-btn.locked{cursor:default;pointer-events:none}
.q-actions{flex-shrink:0;display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:2px 0 4px}
#countdown-overlay{position:fixed;bottom:70px;right:10px;z-index:200;display:none;flex-direction:column;align-items:center;gap:4px}
#countdown-overlay.active{display:flex}
#countdown-video{width:clamp(100px,18vw,170px);border-radius:12px;border:3px solid #FFD700;box-shadow:0 0 20px rgba(255,215,0,.6)}
#answer-overlay{position:fixed;inset:0;z-index:300;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.7);backdrop-filter:blur(6px)}
#answer-overlay.active{display:flex}
.answer-card{background:linear-gradient(135deg,#1a0a2e,#2d1b69);border:4px solid #FFD700;border-radius:24px;padding:24px 36px;text-align:center;box-shadow:0 0 60px rgba(255,215,0,.5);animation:answerPop .4s cubic-bezier(.175,.885,.32,1.275);max-width:480px;width:90%;max-height:90vh;overflow-y:auto}
.answer-label{font-family:'Nunito',sans-serif;font-weight:900;font-size:1rem;color:rgba(255,215,0,.75);letter-spacing:3px;text-transform:uppercase;margin-bottom:6px}
.answer-text{font-family:'Nunito',sans-serif;font-weight:900;font-size:clamp(1.3rem,3.5vw,2.2rem);color:#FFD700;text-shadow:0 0 20px rgba(255,215,0,.8);margin-bottom:10px;line-height:1.3}
.confetti-emoji{font-size:2.2rem;animation:pulse .5s ease-in-out infinite alternate;display:block;margin-bottom:14px}
#lion-overlay{position:fixed;inset:0;z-index:280;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(6px)}
#lion-overlay.active{display:flex}
.lion-popup{background:linear-gradient(135deg,#2a0a0a,#4a1010);border:4px solid #FF6B00;border-radius:24px;padding:28px 32px;text-align:center;box-shadow:0 0 60px rgba(255,107,0,.5);animation:popupIn .4s cubic-bezier(.175,.885,.32,1.275);max-width:400px;width:88%}
#media-overlay{position:fixed;inset:0;z-index:260;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.9);flex-direction:column;gap:12px}
#media-overlay.active{display:flex}
#media-video{max-width:min(640px,92vw);max-height:65vh;border-radius:16px;border:4px solid #FFD700}
#result-popup{position:fixed;inset:0;z-index:400;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.8);backdrop-filter:blur(8px)}
#result-popup.active{display:flex}
.result-card{background:linear-gradient(135deg,#1a0a2e,#2d1b69);border:4px solid #FFD700;border-radius:28px;padding:28px 36px;text-align:center;box-shadow:0 0 80px rgba(255,215,0,.5);animation:popupIn .5s cubic-bezier(.175,.885,.32,1.275);max-width:480px;width:90%;max-height:88vh;overflow-y:auto}
.score-ring{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,#FFD700,#FFA500);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 0 40px rgba(255,215,0,.6);animation:scoreIn .8s cubic-bezier(.175,.885,.32,1.275)}
.score-big{font-family:'Nunito',sans-serif;font-weight:900;font-size:2.5rem;color:#1a0a2e;line-height:1}
.score-label{font-family:'Nunito',sans-serif;font-weight:900;font-size:.85rem;color:#1a0a2e;opacity:.7}
.float-pika{position:fixed;bottom:12px;right:12px;font-size:2.4rem;z-index:50;animation:floatPika 3s ease-in-out infinite;cursor:pointer;filter:drop-shadow(0 5px 12px rgba(255,215,0,.5))}
.lightning{position:fixed;inset:0;z-index:500;pointer-events:none;background:rgba(255,215,0,.12);display:none;animation:lightning .15s ease}
.firework{position:fixed;pointer-events:none;font-size:1.6rem;z-index:60;animation:fireworkFly 2s ease-out forwards}
.particle{position:fixed;pointer-events:none;border-radius:50%;z-index:55;animation:particleFloat linear forwards}
.btn-media{background:linear-gradient(135deg,rgba(255,100,0,.3),rgba(255,50,0,.2));border:2.5px solid rgba(255,150,0,.6);border-radius:50px;color:#FFD700;font-family:'Nunito',sans-serif;font-weight:900;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:8px;animation:pulse 2s ease-in-out infinite}
.btn-media:active{transform:scale(.96)}
.tts-badge{background:rgba(255,215,0,.12);border:1.5px solid rgba(255,215,0,.3);border-radius:20px;color:rgba(255,215,0,.8);font-size:.72rem;padding:3px 8px;display:inline-flex;align-items:center;gap:3px}
.score-tracker{background:rgba(255,215,0,.12);border:1.5px solid rgba(255,215,0,.3);border-radius:20px;padding:3px 10px;color:#FFD700;font-family:'Nunito',sans-serif;font-weight:900;font-size:.9rem;white-space:nowrap}
@media(max-width:480px){
  .choices-grid{grid-template-columns:1fr;gap:6px}
  .choice-btn{flex-direction:row;min-height:56px;padding:8px 12px;text-align:left;gap:12px;justify-content:flex-start}
  .choice-num-circle{width:32px;height:32px;font-size:1.15rem}
  .choice-label{font-size:1.15rem}
  .grid-container{grid-template-columns:repeat(5,1fr);gap:5px}
  .q-visual-img{max-width:min(200px,55vw);max-height:min(150px,28vh)}
  .answer-card{padding:18px 22px}
  .result-card{padding:20px 24px}
  .lion-popup{padding:20px 22px}
  .score-ring{width:120px;height:120px}
  .score-big{font-size:2rem}
  #countdown-overlay{bottom:60px;right:6px}
  #countdown-video{width:clamp(80px,22vw,130px)}
}
@media(max-width:360px){
  .grid-container{grid-template-columns:repeat(5,1fr);gap:4px}
  .q-cell{min-height:38px}
  .q-cell .q-num{font-size:.85rem}
}
</style>`

// ====================================================
// HOME PAGE - Language Selection
// ====================================================
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="vi">
<head>
${SHARED_HEAD}
<title>🔔 Rung Chuông Vàng - Chọn Ngôn Ngữ</title>
<style>
.lang-card {
  background: linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,165,0,.07));
  border: 2.5px solid rgba(255,215,0,.4);
  border-radius: 24px;
  padding: 28px 32px;
  cursor: pointer;
  transition: all .3s;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-width: 220px;
  max-width: 280px;
}
.lang-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,rgba(255,215,0,.08),transparent);
  opacity: 0;
  transition: opacity .3s;
}
.lang-card:hover {
  border-color: #FFD700;
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 12px 40px rgba(255,215,0,.35);
}
.lang-card:hover::before { opacity: 1; }
.lang-card:active { transform: scale(.97); }
.lang-card .flag { font-size: 4rem; margin-bottom: 12px; display: block; animation: pulse 2s ease-in-out infinite; }
.lang-card .lang-name { font-family:'Nunito',sans-serif; font-weight:900; font-size: 1.6rem; color: #FFD700; margin-bottom: 6px; }
.lang-card .lang-sub { font-family:'Nunito',sans-serif; font-weight:700; font-size: .9rem; color: rgba(255,255,255,.6); }
.lang-card .lang-count { background: rgba(255,215,0,.2); border: 1.5px solid rgba(255,215,0,.4); border-radius: 20px; padding: 4px 14px; font-family:'Nunito',sans-serif; font-weight:900; font-size:.85rem; color: #FFD700; display: inline-block; margin-top: 12px; }
</style>
</head>
<body>
<div class="stars-bg" id="stars-bg"></div>
<div class="lightning" id="lightning"></div>

<div class="screen active" id="screen-home">
  <div style="text-align:center;z-index:1;max-width:680px;width:100%;padding:0 16px">
    <div><span class="bell-ring" style="font-size:3.5rem">🔔</span></div>
    <h2 class="fredoka" style="color:#FFD700;font-size:clamp(.85rem,2vw,1.3rem);letter-spacing:3px;text-transform:uppercase;margin:6px 0 2px">Trường Mầm non Bắc Hà</h2>
    <h1 class="fredoka title-glow" style="color:#FFD700;font-size:clamp(1.8rem,5vw,3.5rem);line-height:1.1;margin-bottom:6px">RUNG CHUÔNG VÀNG</h1>
    <p style="color:rgba(255,255,255,.55);font-size:.9rem;margin-bottom:28px">Khối 5 Tuổi — Chọn ngôn ngữ để bắt đầu</p>

    <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:24px">
      <!-- English Game -->
      <div class="lang-card" onclick="goToGame('english')" id="card-en">
        <img src="https://flagcdn.com/w80/gb.png" class="flag" style="height: 50px; width: auto; margin: 0 auto 12px; display: block; border-radius: 4px;" alt="English">
        <div class="lang-name">Tiếng Anh</div>
        <div class="lang-sub">Pikachu Edition</div>
        <div class="lang-sub" style="margin-top:4px;color:rgba(255,255,255,.45);font-size:.8rem">Màu sắc, con vật, cảm xúc...</div>
        <div class="lang-count">30 câu hỏi</div>
      </div>

      <!-- Vietnamese Game -->
      <div class="lang-card" onclick="goToGame('vietnamese')" id="card-vi" style="border-color:rgba(255,100,100,.4)">
        <img src="https://flagcdn.com/w80/vn.png" class="flag" style="height: 50px; width: auto; margin: 0 auto 12px; display: block; border-radius: 4px;" alt="Vietnamese">
        <div class="lang-name" style="color:#FF7070">Tiếng Việt</div>
        <div class="lang-sub">Khối 5 Tuổi</div>
        <div class="lang-sub" style="margin-top:4px;color:rgba(255,255,255,.45);font-size:.8rem">Toán, Tự nhiên, Khoa học...</div>
        <div class="lang-count" style="background:rgba(255,100,100,.2);border-color:rgba(255,100,100,.4);color:#FF9090">54 câu hỏi</div>
      </div>
    </div>

    <div id="install-wrap" style="display:none">
      <button id="install-btn" class="btn-nav" style="font-size:1rem;padding:10px 24px;border-color:#00ff88;color:#00ff88;background:rgba(0,255,136,0.1)" onclick="installPWA()">📲 Cài đặt App</button>
    </div>
  </div>
</div>

<div class="float-pika" onclick="pikachuClick()" title="Pikachu!">⚡</div>
<audio id="audio-home" src="/assets/intro-music.mp3" loop preload="auto"></audio>

<script>
(function createStars(){
  const bg=document.getElementById('stars-bg');
  for(let i=0;i<60;i++){
    const s=document.createElement('div');s.className='star';
    const sz=Math.random()*5+2;
    s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;background:'+(Math.random()>.5?'#FFD700':'#fff')+';animation-duration:'+(Math.random()*3+2)+'s;animation-delay:'+(Math.random()*3)+'s';
    bg.appendChild(s);
  }
})();
let homeMusicEnabled = true;
function playHomeMusic(){
  if(!homeMusicEnabled) return;
  const a=document.getElementById('audio-home');
  if(!a) return;
  a.volume=0.2;
  a.play().catch(()=>{});
}
function stopHomeMusic(){
  const a=document.getElementById('audio-home');
  if(!a) return;
  a.pause();
  a.currentTime=0;
}
window.addEventListener('pointerdown', function initHomeMusic(){
  playHomeMusic();
  window.removeEventListener('pointerdown', initHomeMusic);
}, { once: true });
window.addEventListener('keydown', function initHomeMusicByKey(){
  playHomeMusic();
  window.removeEventListener('keydown', initHomeMusicByKey);
}, { once: true });
setTimeout(()=>playHomeMusic(), 200);

function goToGame(lang){
  homeMusicEnabled=false;
  stopHomeMusic();
  const el = document.getElementById(lang==='english'?'card-en':'card-vi');
  el.style.transform='scale(0.95)';
  el.style.opacity='0.8';
  flashLightning();
  setTimeout(()=>{ window.location.href='/'+lang; },300);
}
function flashLightning(){
  const el=document.getElementById('lightning');
  el.style.display='block';
  setTimeout(()=>el.style.display='none',150);
}
function pikachuClick(){
  flashLightning();
  const el=document.querySelector('.float-pika');
  el.style.transform='scale(2.2) rotate(20deg)';
  setTimeout(()=>el.style.transform='',500);
}

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();deferredPrompt=e;
  document.getElementById('install-wrap').style.display='block';
});
function installPWA(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=>{ deferredPrompt=null; document.getElementById('install-wrap').style.display='none'; });
  }
}
</script>
</body>
</html>`)
})

// ====================================================
// ENGLISH GAME (from original source)
// ====================================================
app.get('/english', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
${SHARED_HEAD}
<title>🔔 Rung Chuông Vàng - English</title>
</head>
<body>
<div class="stars-bg" id="stars-bg"></div>
<div class="lightning" id="lightning"></div>

<div id="click-to-start" style="position:fixed;inset:0;z-index:9999;background:rgba(26,10,46,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(5px)">
  <div class="pikachu-bounce" style="font-size:5rem;margin-bottom:20px">⚡</div>
  <h1 style="color:#FFD700;font-family:'Nunito',sans-serif;font-weight:900;font-size:2rem;text-transform:uppercase;letter-spacing:2px;animation:pulse 1s infinite alternate">Tap to start!</h1>
</div>

<!-- INTRO -->
<div class="screen" id="screen-intro">
  <div style="text-align:center;z-index:1;max-width:600px;width:100%;padding:0 8px">
    <div><span class="bell-ring" style="font-size:3rem">🔔</span></div>
    <h2 class="fredoka" style="color:#FFD700;font-size:clamp(.9rem,2.2vw,1.5rem);letter-spacing:3px;text-transform:uppercase;margin:4px 0 2px">Trường Mầm non Bắc Hà</h2>
    <h1 class="fredoka title-glow" style="color:#FFD700;font-size:clamp(1.9rem,5.5vw,4rem);line-height:1.1">RUNG CHUÔNG VÀNG</h1>
    <div class="pikachu-bounce" style="font-size:clamp(4rem,12vw,8rem);line-height:1;margin:6px 0">⚡</div>
    <h2 class="fredoka" style="color:#fff;font-size:clamp(1.1rem,3vw,2.2rem);margin-bottom:4px">🎮 PIKACHU EDITION 🎮</h2>
    <p style="color:rgba(255,255,255,.55);font-size:.9rem;margin-bottom:16px">Fun English quiz for kids</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="padding:10px 22px;font-size:.95rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Trang chủ</button>
      <button class="btn-main" style="font-size:clamp(1.1rem,3vw,1.5rem);padding:14px 44px" onclick="stopIntroMusic();introMusicEnabled=false;document.getElementById('screen-intro').classList.remove('active');document.getElementById('screen-grid').classList.add('active');buildGrid();updateProgress();">⚡ START NOW! ⚡</button>
    </div>
  </div>
</div>

<!-- RULES -->
<div class="screen" id="screen-rules" style="overflow-y:auto">
  <div style="z-index:1;width:100%;max-width:660px;padding:8px 0">
    <h1 class="fredoka" style="color:#FFD700;font-size:1.9rem;text-align:center;margin-bottom:14px">📋 Rules</h1>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.1s"><span style="font-size:1.7rem;flex-shrink:0">❓</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">30 English questions</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Colors, animals, objects, feelings...</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.2s"><span style="font-size:1.7rem;flex-shrink:0">⏱️</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">5 seconds per question</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Countdown stays in the corner</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.3s"><span style="font-size:1.7rem;flex-shrink:0">🖐️</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Choose 1, 2, or 3</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Pick your answer before time is up</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.4s"><span style="font-size:1.7rem;flex-shrink:0">🔊</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Auto-read question and answers</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">English TTS only</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:16px;animation-delay:.5s"><span style="font-size:1.7rem;flex-shrink:0">🏆</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Competition mode: 1→30</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Auto flow, timer, and final score</p></div></div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="font-size:.95rem;padding:10px 20px" onclick="document.getElementById('screen-rules').classList.remove('active');document.getElementById('screen-intro').classList.add('active');">← Back</button>
      <button class="btn-main" style="font-size:1.1rem;padding:11px 32px;letter-spacing:0" onclick="stopIntroMusic();introMusicEnabled=false;document.getElementById('screen-rules').classList.remove('active');document.getElementById('screen-grid').classList.add('active');buildGrid();updateProgress();">🎯 START GAME!</button>
    </div>
  </div>
</div>

<!-- QUESTION GRID -->
<div class="screen active" id="screen-grid">
  <div class="grid-wrap" style="z-index:1">
    <div class="grid-header">
      <h1 class="fredoka" style="color:#FFD700;font-size:clamp(1rem,2.2vw,1.5rem)">🔔 RUNG CHUÔNG VÀNG 🇬🇧</h1>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span class="score-tracker" id="progress-text">0/30</span>
        <button class="btn-nav" style="padding:6px 14px;font-size:.85rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Home</button>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(0,255,136,.15),rgba(0,200,81,.05));border:2px solid rgba(0,255,136,.4);border-radius:16px;padding:12px 18px;margin:12px 0 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <h2 class="fredoka" style="color:#00ff88;font-size:1.2rem;margin-bottom:2px">🏆 COMPETITION</h2>
        <p style="color:rgba(255,255,255,.7);font-family:'Nunito',sans-serif;font-size:.8rem;font-weight:700">Run all 30 questions automatically and score.</p>
      </div>
      <button class="btn-main" style="font-size:.95rem;padding:10px 24px;letter-spacing:0;background:linear-gradient(135deg,#00c851,#007e33);border-color:#00ff88;color:#fff;animation:none" onclick="startCompetition()">▶ START COMPETITION</button>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,165,0,.05));border:2px solid rgba(255,215,0,.3);border-radius:16px;padding:14px;flex:1;display:flex;flex-direction:column;min-height:0;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 class="fredoka" style="color:#FFD700;font-size:1.15rem">📚 PRACTICE</h2>
        <button class="btn-nav" style="font-size:.8rem;padding:5px 12px" onclick="resetProgress()">🔄 Reset</button>
      </div>
      <div class="grid-container" id="question-grid" style="overflow-y:auto;padding-right:4px;align-content:start"></div>
    </div>
  </div>
</div>

<!-- QUESTION SCREEN -->
<div class="screen" id="screen-question">
  <div class="q-wrap" style="z-index:1">
    <div class="q-top-bar">
      <div class="q-badge" id="q-num-badge">Question 1/30</div>
      <div class="mode-badge" id="mode-badge" style="background:rgba(255,100,0,.25);border:2px solid rgba(255,150,0,.5);color:#FFA500">📚 Practice</div>
      <div class="score-tracker" id="q-score-live" style="display:none">✅ 0 correct</div>
      <div style="flex:1;min-width:4px;display:flex;justify-content:center"><button class="btn-nav" style="padding:4px 10px;font-size:.8rem;border-color:rgba(255,215,0,0.5)" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Home</button></div>
      <span class="tts-badge" id="tts-status">🔊 Reading...</span>
      <button class="btn-nav" style="padding:5px 12px;font-size:.82rem" onclick="goBack()">📋 Question Grid</button>
    </div>
    <div class="timer-row">
      <div class="timer-bar-wrap"><div class="timer-bar" id="timer-bar"></div></div>
      <div class="timer-num" id="timer-display">5</div>
      <button class="btn-nav" id="btn-countdown" style="padding:6px 14px;font-size:.85rem" onclick="startCountdown()">▶ 5s</button>
    </div>
    <div class="q-card">
      <div class="q-visual-wrap" id="q-visual-wrap"></div>
      <div class="q-text-main" id="q-text-main">Loading...</div>
      <div class="q-hint" id="q-hint"></div>
      <div id="media-btn-wrap" style="text-align:center;margin-top:8px;display:none;gap:8px;justify-content:center;flex-wrap:wrap" class="flex">
        <button class="btn-media" style="font-size:.9rem;padding:7px 20px" id="play-media-btn" onclick="playSpecialMedia()">🎵 Play Media</button>
      </div>
    </div>
    <div class="choices-grid" id="choices-container"></div>
    <div class="q-actions">
      <button class="btn-nav" style="padding:7px 16px;font-size:.85rem" onclick="speakQuestion()">🔊 Read Again</button>
      <button class="btn-main" style="font-size:1rem;padding:10px 28px;letter-spacing:0;animation:btnPulse 2s ease-in-out infinite" id="btn-action-next" onclick="handleNextBtn()">➡ NEXT</button>
    </div>
  </div>
</div>

<div id="countdown-overlay">
  <video id="countdown-video" src="/assets/countdown.mp4" playsinline muted></video>
</div>
<div id="answer-overlay" onclick="nextQuestion()">
  <div class="answer-card" onclick="nextQuestion()" style="cursor:pointer">
    <p class="answer-label">⚡ Correct Answer ⚡</p>
    <p class="answer-text" id="answer-text-display"></p>
    <span class="confetti-emoji" id="answer-emoji">🎊</span>
    <p style="color:rgba(255,255,255,.5);font-size:.8rem;margin-bottom:10px">Tap anywhere to continue</p>
    <button class="btn-main" style="font-size:1rem;padding:11px 32px;letter-spacing:0" id="btn-next" onclick="event.stopPropagation();nextQuestion()">➡ NEXT</button>
  </div>
</div>
<div id="lion-overlay" onclick="closeLionPopup()">
  <div class="lion-popup" onclick="event.stopPropagation()">
    <div style="font-size:4rem;margin-bottom:10px;animation:pulse 1s ease-in-out infinite">🦁</div>
    <h2 id="lion-popup-title" class="fredoka" style="color:#FF8C00;font-size:1.6rem;margin-bottom:6px">LION SOUND!</h2>
    <p id="lion-popup-subtitle" style="color:rgba(255,255,255,.75);font-size:.9rem;margin-bottom:16px">Listen and guess the animal</p>
    <button id="lion-popup-replay-btn" class="btn-media" style="font-size:1rem;padding:10px 28px;margin-bottom:14px" onclick="replayLionSound()">🔊 Replay</button><br>
    <button class="btn-nav" style="padding:8px 22px;font-size:.9rem;margin-top:4px;display:inline-flex" onclick="closeLionPopup()">✕ Close</button>
  </div>
</div>
<div id="media-overlay">
  <video id="media-video" controls playsinline style="max-width:min(640px,92vw);max-height:65vh;border-radius:16px;border:4px solid #FFD700"></video>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
    <button class="btn-nav" style="font-size:.95rem;padding:9px 24px" onclick="closeMedia()">✕ Close Video</button>
    <button class="btn-main" style="font-size:.95rem;padding:9px 24px;letter-spacing:0;animation:none" onclick="revealAnswerFromMedia()">➡ NEXT</button>
  </div>
</div>
<div id="result-popup">
  <div class="result-card">
    <div style="font-size:3rem;margin-bottom:10px;animation:pikaBounce .8s ease-in-out infinite alternate">🏆</div>
    <h1 class="fredoka title-glow" style="color:#FFD700;font-size:clamp(1.5rem,4vw,2.8rem);margin-bottom:12px">RESULT!</h1>
    <div class="score-ring">
      <div class="score-big" id="popup-score-num">0/30</div>
      <div class="score-label">CORRECT</div>
    </div>
    <p id="popup-msg" style="color:#fff;font-size:1.1rem;margin-bottom:6px">🎉 Great job! 🎉</p>
    <p id="popup-sub" style="color:rgba(255,255,255,.6);font-size:.9rem;margin-bottom:20px"></p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="padding:9px 20px;font-size:.95rem" onclick="closeResultPopup();showGrid()">📋 Question Grid</button>
      <button class="btn-nav" style="padding:9px 20px;font-size:.95rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Home</button>
      <button class="btn-main" style="font-size:1rem;padding:10px 28px;letter-spacing:0" onclick="closeResultPopup();resetGame()">🔄 Play Again!</button>
    </div>
  </div>
</div>

<div class="float-pika" onclick="pikachuClick()" title="Pikachu!">⚡</div>
<audio id="audio-intro" src="/assets/intro-music.mp3" loop preload="auto"></audio>
<audio id="audio-lion" src="/assets/lion-sound.mp3" preload="auto"></audio>

<script>
const Q = [
  {img:"q1-yellow.png",question:"What color is it?",hint:"Màu gì đây?",choices:[{icon:"🔴",label:"Red"},{icon:"🔵",label:"Blue"},{icon:"🟡",label:"Yellow"}],correct:2,answer:"3. Yellow",speak:"What color is it? One: Red. Two: Blue. Three: Yellow."},
  {img:"q2-orange.png",question:"What fruit is it?",hint:"Đây là quả gì?",choices:[{icon:"🍎",label:"Apple"},{icon:"🍐",label:"Pear"},{icon:"🍊",label:"Orange"}],correct:2,answer:"3. Orange",speak:"What fruit is it? One: Apple. Two: Pear. Three: Orange."},
  {img:"q3-yoyo.png",question:"What toy is it?",hint:"Đây là đồ chơi gì?",choices:[{icon:"🧸",label:"Teddy"},{icon:"🪀",label:"Yo-yo"},{icon:"🤖",label:"Robot"}],correct:1,answer:"2. Yo-yo",speak:"What toy is it? One: Teddy. Two: Yo-yo. Three: Robot."},
  {img:"q4-elephant.png",question:"What animal is it?",hint:"Đây là con gì?",choices:[{icon:"🦁",label:"Lion"},{icon:"🐒",label:"Monkey"},{icon:"🐘",label:"Elephant"}],correct:2,answer:"3. Elephant",speak:"What animal is it? One: Lion. Two: Monkey. Three: Elephant."},
  {img:"q5-pizza.png",question:"What food is it?",hint:"Đây là món gì?",choices:[{icon:"🍕",label:"Pizza"},{icon:"🥪",label:"Sandwich"},{icon:"🍔",label:"Hamburger"}],correct:0,answer:"1. Pizza",speak:"What food is it? One: Pizza. Two: Sandwich. Three: Hamburger."},
  {img:"q6-apple.png",question:"What color is an apple?",hint:"Quả táo màu gì?",choices:[{icon:"⬛",label:"Black"},{icon:"🟡",label:"Yellow"},{icon:"🔴",label:"Red"}],correct:2,answer:"3. Red",speak:"What color is an apple? One: Black. Two: Yellow. Three: Red."},
  {img:"q7-slide.png",question:"What is it?",hint:"Đây là gì ở sân chơi?",choices:[{icon:"🪜",label:"Seesaw"},{icon:"🛝",label:"Slide"},{icon:"🎠",label:"Swing"}],correct:1,answer:"2. Slide",speak:"What is it? One: Seesaw. Two: Slide. Three: Swing."},
  {img:"q8-ten.png",question:"What number is it?",hint:"Đây là số mấy?",choices:[{icon:"🔟",label:"Ten"},{icon:"7️⃣",label:"Seven"},{icon:"9️⃣",label:"Nine"}],correct:0,answer:"1. Ten",speak:"What number is it? One: Ten. Two: Seven. Three: Nine."},
  {img:"q9-boots.png",question:"What are they?",hint:"Đây là gì?",choices:[{icon:"🩳",label:"Shorts"},{icon:"👢",label:"Boots"},{icon:"🧦",label:"Socks"}],correct:1,answer:"2. Boots",speak:"What are they? One: Shorts. Two: Boots. Three: Socks."},
  {img:"q10-happy.png",question:"How are you?",hint:"Bạn cảm thấy thế nào?",choices:[{icon:"😊",label:"Happy"},{icon:"😢",label:"Sad"},{icon:"😠",label:"Angry"}],correct:0,answer:"1. Happy",speak:"How are you? One: Happy. Two: Sad. Three: Angry."},
  {img:"q11-kitchen.png",question:"What room is it?",hint:"Đây là phòng gì?",choices:[{icon:"🚿",label:"Bathroom"},{icon:"🛋️",label:"Living room"},{icon:"🍳",label:"Kitchen"}],correct:2,answer:"3. Kitchen",speak:"What room is it? One: Bathroom. Two: Living room. Three: Kitchen."},
  {img:"q12-teeth.png",question:"What are they?",hint:"Đây là bộ phận nào?",choices:[{icon:"🦶",label:"Feet"},{icon:"🦷",label:"Teeth"},{icon:"👋",label:"Fingers"}],correct:1,answer:"2. Teeth",speak:"What are they? One: Feet. Two: Teeth. Three: Fingers."},
  {img:"q3-triangle.png",question:"What shape is it?",hint:"Đây là hình gì?",choices:[{icon:"🔺",label:"Triangle"},{icon:"⭕",label:"Circle"},{icon:"🟥",label:"Square"}],correct:0,answer:"1. Triangle",speak:"What shape is it? One: Triangle. Two: Circle. Three: Square."},
  {img:"q14-mummy.png",question:"Who is this?",hint:"Đây là ai?",choices:[{icon:"👧",label:"Sister"},{icon:"👩",label:"Mummy"},{icon:"👨",label:"Daddy"}],correct:1,answer:"2. Mummy",speak:"Who is this? One: Sister. Two: Mummy. Three: Daddy."},
  {img:"q15-bananas.png",question:"How many bananas?",hint:"Có bao nhiêu quả chuối?",choices:[{icon:"1️⃣",label:"One"},{icon:"2️⃣",label:"Two"},{icon:"3️⃣",label:"Three"}],correct:2,answer:"3. Three",speak:"How many bananas? One: One. Two: Two. Three: Three."},
  {img:"q16-doctor.png",question:"Who is she?",hint:"Cô ấy làm nghề gì?",choices:[{icon:"👩‍🏫",label:"Teacher"},{icon:"👩‍⚕️",label:"Doctor"},{icon:"👩‍🌾",label:"Farmer"}],correct:1,answer:"2. Doctor",speak:"Who is she? One: Teacher. Two: Doctor. Three: Farmer."},
  {img:"q17-vietnam.png",question:"Where are you from?",hint:"Bạn đến từ đâu?",choices:[{icon:"🇻🇳",label:"Vietnam"},{icon:"🇯🇵",label:"Japan"},{icon:"🇨🇳",label:"China"}],correct:0,answer:"1. Vietnam",speak:"Where are you from? One: Vietnam. Two: Japan. Three: China."},
  {img:"q18-birthday.png",question:"How old are you?",hint:"Bạn bao nhiêu tuổi?",choices:[{icon:"3️⃣",label:"Three"},{icon:"4️⃣",label:"Four"},{icon:"5️⃣",label:"Five"}],correct:2,answer:"3. Five",speak:"How old are you? One: Three. Two: Four. Three: Five."},
  {img:"q19-elephant4legs.png",question:"How many legs does the elephant have?",hint:"Voi có bao nhiêu chân?",choices:[{icon:"4️⃣",label:"Four"},{icon:"1️⃣",label:"One"},{icon:"2️⃣",label:"Two"}],correct:0,answer:"1. Four",speak:"How many legs does the elephant have? One: Four. Two: One. Three: Two."},
  {img:"q20-hungry.png",question:"How does she feel?",hint:"Cô ấy đang cảm thấy gì?",choices:[{icon:"🥤",label:"Thirsty"},{icon:"😴",label:"Sleepy"},{icon:"😋",label:"Hungry"}],correct:2,answer:"3. Hungry",speak:"How does she feel? One: Thirsty. Two: Sleepy. Three: Hungry."},
  {img:"q21-frog-bed.png",question:"Where is Alfie?",hint:"Alfie đang ở đâu?",choices:[{icon:"⬆️",label:"On"},{icon:"⬇️",label:"Under"},{icon:"➡️",label:"In"}],correct:1,answer:"2. Under",speak:"Where is Alfie? One: On. Two: Under. Three: In."},
  {img:"q22-juice.png",question:"Which drink is this?",hint:"Đây là đồ uống gì?",choices:[{icon:"🧃",label:"Juice"},{icon:"💧",label:"Water"},{icon:"🥛",label:"Milk"}],correct:0,answer:"1. Juice",speak:"Which drink is this? One: Juice. Two: Water. Three: Milk."},
  {img:"q23-family.png",question:"How many people in this family?",hint:"Gia đình có bao nhiêu người?",choices:[{icon:"3️⃣",label:"Three"},{icon:"4️⃣",label:"Four"},{icon:"5️⃣",label:"Five"}],correct:1,answer:"2. Four",speak:"How many people in this family? One: Three. Two: Four. Three: Five."},
  {img:"q10-happy.png",question:"How are you?",hint:"Bạn khỏe không?",choices:[{icon:"🔢",label:"I'm six"},{icon:"😁",label:"I'm good"},{icon:"😢",label:"I'm sad"}],correct:1,answer:"2. I'm good!",speak:"How are you? One: I'm six. Two: I'm good. Three: I'm sad."},
  {img:"q25-monkey.png",question:"What animal likes eating bananas?",hint:"Con gì thích ăn chuối?",choices:[{icon:"🐒",label:"Monkey"},{icon:"🐌",label:"Snail"},{icon:"🐍",label:"Snake"}],correct:0,answer:"1. Monkey",speak:"What animal likes eating bananas? One: Monkey. Two: Snail. Three: Snake."},
  {img:null,emoji:"🔊",question:"Listen to the sound. What animal is it?",hint:"Nghe âm thanh — đây là con gì?",choices:[{icon:"🦁",label:"Lion"},{icon:"🐄",label:"Cow"},{icon:"🐶",label:"Dog"}],correct:0,answer:"1. Lion",speak:"Listen to the sound. What animal is it? One: Lion. Two: Cow. Three: Dog.",media:"lion"},
  {img:"q27-sunny.png",question:"How's the weather?",hint:"Thời tiết hôm nay thế nào?",choices:[{icon:"🌧️",label:"Rainy"},{icon:"💨",label:"Windy"},{icon:"☀️",label:"Sunny"}],correct:2,answer:"3. Sunny",speak:"How's the weather? One: Rainy. Two: Windy. Three: Sunny."},
  {img:"q28-teacher.png",question:"Who is this?",hint:"Đây là ai?",choices:[{icon:"👩‍⚕️",label:"Doctor"},{icon:"👩‍🏫",label:"Teacher"},{icon:"👩‍🌾",label:"Farmer"}],correct:1,answer:"2. Teacher",speak:"Who is this? One: Doctor. Two: Teacher. Three: Farmer."},
  {img:null,emoji:"🏫",question:"Which school are you in?",hint:"Bạn học ở trường nào?",choices:[{icon:"🏫",label:"Nguyen Du"},{icon:"🏫",label:"Tri Duc"},{icon:"🏫",label:"Bac Ha"}],correct:2,answer:"3. Bac Ha Kindergarten",speak:"Which school are you in? One: Nguyen Du Kindergarten. Two: Tri Duc Kindergarten. Three: Bac Ha Kindergarten."},
  {img:null,emoji:"🎵",question:"Listen to the song! What song is it?",hint:"Nghe bài hát — đây là bài nào?",choices:[{icon:"🚶",label:"Walking Walking"},{icon:"💃",label:"Head Shoulders"},{icon:"🐻",label:"Gummy Bear"}],correct:2,answer:"3. Gummy Bear",speak:"Listen to the song! What song is it? One: Walking Walking. Two: Head Shoulders Knees and Toes. Three: Gummy Bear.",media:"gummy"}
];

${GAME_SCRIPT_EN}
</script>
</body>
</html>`)
})

// ====================================================
// VIETNAMESE GAME
// ====================================================
app.get('/vietnamese', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="vi">
<head>
${SHARED_HEAD}
<title>🔔 Rung Chuông Vàng - Tiếng Việt</title>
</head>
<body>
<div class="stars-bg" id="stars-bg"></div>
<div class="lightning" id="lightning"></div>

<div id="click-to-start" style="position:fixed;inset:0;z-index:9999;background:rgba(26,10,46,0.95);display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(5px)">
  <div style="font-size:5rem;margin-bottom:20px;animation:pikaBounce .8s ease-in-out infinite alternate">🇻🇳</div>
  <h1 style="color:#FFD700;font-family:'Nunito',sans-serif;font-weight:900;font-size:2rem;text-transform:uppercase;letter-spacing:2px;animation:pulse 1s infinite alternate">Nhấn để vào game!</h1>
</div>

<!-- INTRO -->
<div class="screen" id="screen-intro">
  <div style="text-align:center;z-index:1;max-width:600px;width:100%;padding:0 8px">
    <div><span class="bell-ring" style="font-size:3rem">🔔</span></div>
    <h2 class="fredoka" style="color:#FFD700;font-size:clamp(.9rem,2.2vw,1.5rem);letter-spacing:3px;text-transform:uppercase;margin:4px 0 2px">Trường Mầm non Bắc Hà</h2>
    <h1 class="fredoka title-glow" style="color:#FFD700;font-size:clamp(1.9rem,5.5vw,4rem);line-height:1.1">RUNG CHUÔNG VÀNG</h1>
    <div style="font-size:clamp(4rem,12vw,7rem);line-height:1;margin:6px 0;animation:pikaBounce .8s ease-in-out infinite alternate;filter:drop-shadow(0 0 30px #FF4444)">🇻🇳</div>
    <h2 class="fredoka" style="color:#fff;font-size:clamp(1.1rem,3vw,2.2rem);margin-bottom:4px">🎮 KHỐI 5 TUỔI 🎮</h2>
    <p style="color:rgba(255,255,255,.55);font-size:.9rem;margin-bottom:16px">Trắc nghiệm Tiếng Việt vui nhộn dành cho bé</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="padding:10px 22px;font-size:.95rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Trang chủ</button>
      <button class="btn-main" style="font-size:clamp(1.1rem,3vw,1.5rem);padding:14px 44px" onclick="showRules()">🔔 BẮT ĐẦU NGAY! 🔔</button>
    </div>
  </div>
</div>

<!-- RULES -->
<div class="screen" id="screen-rules" style="overflow-y:auto">
  <div style="z-index:1;width:100%;max-width:660px;padding:8px 0">
    <h1 class="fredoka" style="color:#FFD700;font-size:1.9rem;text-align:center;margin-bottom:14px">📋 Luật Chơi</h1>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.1s"><span style="font-size:1.7rem;flex-shrink:0">❓</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">30 Câu hỏi Tiếng Việt</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Toán học, Tự nhiên, Xã hội, Khoa học...</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.2s"><span style="font-size:1.7rem;flex-shrink:0">⏱️</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">5 giây mỗi câu</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Đồng hồ đếm ngược ở góc, không che đáp án</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.3s"><span style="font-size:1.7rem;flex-shrink:0">🖐️</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Chọn 1, 2 hoặc 3</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Giơ bảng đáp án sau khi hết 5 giây</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:8px;animation-delay:.4s"><span style="font-size:1.7rem;flex-shrink:0">🔊</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Đọc câu hỏi & đáp án tự động</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">TTS tiếng Việt giúp bé nghe rõ câu hỏi</p></div></div>
    <div class="rule-card" style="padding:12px 18px;margin-bottom:16px;animation-delay:.5s"><span style="font-size:1.7rem;flex-shrink:0">🏆</span><div><p style="color:#FFD700;font-size:1rem;font-weight:800">Chế độ Thi: câu 1→30 tự động</p><p style="color:rgba(255,255,255,.65);font-size:.85rem">Đọc câu, đếm ngược 5s, tính điểm cuối cùng</p></div></div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="font-size:.95rem;padding:10px 20px" onclick="showIntro()">← Quay lại</button>
      <button class="btn-main" style="font-size:1.1rem;padding:11px 32px;letter-spacing:0" onclick="showGrid()">🎯 VÀO GAME!</button>
    </div>
  </div>
</div>

<!-- QUESTION GRID -->
<div class="screen active" id="screen-grid">
  <div class="grid-wrap" style="z-index:1">
    <div class="grid-header">
      <h1 class="fredoka" style="color:#FFD700;font-size:clamp(1rem,2.2vw,1.5rem)">🔔 RUNG CHUÔNG VÀNG 🇻🇳</h1>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
        <span class="score-tracker" id="progress-text">0/54 câu</span>
        <button class="btn-nav" style="padding:6px 14px;font-size:.85rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Home</button>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(0,255,136,.15),rgba(0,200,81,.05));border:2px solid rgba(0,255,136,.4);border-radius:16px;padding:12px 18px;margin:12px 0 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div>
        <h2 class="fredoka" style="color:#00ff88;font-size:1.2rem;margin-bottom:2px">🏆 BẮT ĐẦU THI</h2>
        <p style="color:rgba(255,255,255,.7);font-family:'Nunito',sans-serif;font-size:.8rem;font-weight:700">Tự động lần lượt 54 câu hỏi và chấm điểm.</p>
      </div>
      <button class="btn-main" style="font-size:.95rem;padding:10px 24px;letter-spacing:0;background:linear-gradient(135deg,#00c851,#007e33);border-color:#00ff88;color:#fff;animation:none" onclick="startCompetition()">▶ VÀO THI NGAY</button>
    </div>
    <div style="background:linear-gradient(135deg,rgba(255,215,0,.1),rgba(255,165,0,.05));border:2px solid rgba(255,215,0,.3);border-radius:16px;padding:14px;flex:1;display:flex;flex-direction:column;min-height:0;margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 class="fredoka" style="color:#FFD700;font-size:1.15rem">📚 LUYỆN TẬP</h2>
        <button class="btn-nav" style="font-size:.8rem;padding:5px 12px" onclick="resetProgress()">🔄 Chơi lại</button>
      </div>
      <div class="grid-container" id="question-grid" style="overflow-y:auto;padding-right:4px;align-content:start"></div>
    </div>
  </div>
</div>

<!-- QUESTION SCREEN -->
<div class="screen" id="screen-question">
  <div class="q-wrap" style="z-index:1">
    <div class="q-top-bar">
      <div class="q-badge" id="q-num-badge">Câu 1/54</div>
      <div class="mode-badge" id="mode-badge" style="background:rgba(255,100,0,.25);border:2px solid rgba(255,150,0,.5);color:#FFA500">📚 Luyện tập</div>
      <div class="score-tracker" id="q-score-live" style="display:none">✅ 0 đúng</div>
      <div style="flex:1;min-width:4px;display:flex;justify-content:center"><button class="btn-nav" style="padding:4px 10px;font-size:.8rem;border-color:rgba(255,215,0,0.5)" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Trang chủ</button></div>
      <span class="tts-badge" id="tts-status">🔊 Đọc bài...</span>
      <button class="btn-nav" style="padding:5px 12px;font-size:.82rem" onclick="goBack()">📋 Bảng câu</button>
    </div>
    <div class="timer-row">
      <div class="timer-bar-wrap"><div class="timer-bar" id="timer-bar"></div></div>
      <div class="timer-num" id="timer-display">5</div>
      <button class="btn-nav" id="btn-countdown" style="padding:6px 14px;font-size:.85rem" onclick="startCountdown()">▶ 5s</button>
    </div>
    <div class="q-card">
      <div class="q-visual-wrap" id="q-visual-wrap"></div>
      <div class="q-text-main" id="q-text-main">Loading...</div>
      <div class="q-hint" id="q-hint"></div>
      <div id="media-btn-wrap" style="text-align:center;margin-top:8px;display:none;gap:8px;justify-content:center;flex-wrap:wrap" class="flex">
        <button class="btn-media" style="font-size:.9rem;padding:7px 20px" id="play-media-btn" onclick="playSpecialMedia()">🎵 Nghe / Xem!</button>
      </div>
    </div>
    <div class="choices-grid" id="choices-container"></div>
    <div class="q-actions">
      <button class="btn-nav" style="padding:7px 16px;font-size:.85rem" onclick="speakQuestion()">🔊 Đọc lại</button>
      <button class="btn-main" style="font-size:1rem;padding:10px 28px;letter-spacing:0;animation:btnPulse 2s ease-in-out infinite" id="btn-action-next" onclick="handleNextBtn()">➡ NEXT</button>
    </div>
  </div>
</div>

<div id="countdown-overlay">
  <video id="countdown-video" src="/assets/countdown.mp4" playsinline muted></video>
</div>
<div id="answer-overlay" onclick="nextQuestion()">
  <div class="answer-card" onclick="nextQuestion()" style="cursor:pointer">
    <p class="answer-label">⭐ Đáp án đúng ⭐</p>
    <p class="answer-text" id="answer-text-display"></p>
    <span class="confetti-emoji" id="answer-emoji">🎊</span>
    <p style="color:rgba(255,255,255,.5);font-size:.8rem;margin-bottom:10px">Nhấn bất kỳ để tiếp tục</p>
    <button class="btn-main" style="font-size:1rem;padding:11px 32px;letter-spacing:0" id="btn-next" onclick="event.stopPropagation();nextQuestion()">➡ NEXT</button>
  </div>
</div>
<div id="lion-overlay" onclick="closeLionPopup()">
  <div class="lion-popup" onclick="event.stopPropagation()">
    <div style="font-size:4rem;margin-bottom:10px;animation:pulse 1s ease-in-out infinite">🦁</div>
    <h2 id="lion-popup-title" class="fredoka" style="color:#FF8C00;font-size:1.6rem;margin-bottom:6px">TIẾNG SƯ TỬ!</h2>
    <p id="lion-popup-subtitle" style="color:rgba(255,255,255,.75);font-size:.9rem;margin-bottom:16px">Nghe âm thanh — đây là con gì?</p>
    <button id="lion-popup-replay-btn" class="btn-media" style="font-size:1rem;padding:10px 28px;margin-bottom:14px" onclick="replayLionSound()">🔊 Nghe lại</button><br>
    <button class="btn-nav" style="padding:8px 22px;font-size:.9rem;margin-top:4px;display:inline-flex" onclick="closeLionPopup()">✕ Đóng</button>
  </div>
</div>
<div id="media-overlay">
  <video id="media-video" controls playsinline style="max-width:min(640px,92vw);max-height:65vh;border-radius:16px;border:4px solid #FFD700"></video>
  <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
    <button class="btn-nav" style="font-size:.95rem;padding:9px 24px" onclick="closeMedia()">✕ Đóng video</button>
    <button class="btn-main" style="font-size:.95rem;padding:9px 24px;letter-spacing:0;animation:none" onclick="revealAnswerFromMedia()">➡ NEXT</button>
  </div>
</div>
<div id="result-popup">
  <div class="result-card">
    <div style="font-size:3rem;margin-bottom:10px;animation:pikaBounce .8s ease-in-out infinite alternate">🏆</div>
    <h1 class="fredoka title-glow" style="color:#FFD700;font-size:clamp(1.5rem,4vw,2.8rem);margin-bottom:12px">KẾT QUẢ!</h1>
    <div class="score-ring">
      <div class="score-big" id="popup-score-num">0/54</div>
      <div class="score-label">CÂU ĐÚNG</div>
    </div>
    <p id="popup-msg" style="color:#fff;font-size:1.1rem;margin-bottom:6px">🎉 Chúc mừng các bé! 🎉</p>
    <p id="popup-sub" style="color:rgba(255,255,255,.6);font-size:.9rem;margin-bottom:20px"></p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn-nav" style="padding:9px 20px;font-size:.95rem" onclick="closeResultPopup();showGrid()">📋 Xem bảng câu</button>
      <button class="btn-nav" style="padding:9px 20px;font-size:.95rem" onclick="stopAudio(); stopIntroMusic(); clearTimer(); window.location.href='/'">🏠 Trang chủ</button>
      <button class="btn-main" style="font-size:1rem;padding:10px 28px;letter-spacing:0" onclick="closeResultPopup();resetGame()">🔄 Chơi lại!</button>
    </div>
  </div>
</div>

<div class="float-pika" onclick="pikachuClick()" title="Rung chuông!">🔔</div>
<audio id="audio-intro" src="/assets/intro-music.mp3" loop preload="auto"></audio>

<script>
// ====================================================
// VIETNAMESE QUESTIONS — 54 câu hỏi Khối 5 Tuổi
// ====================================================
const Q = [
  {"id": "1", "img": "vi/cau1.png", "question": "Có bao nhiêu quả táo trong hình sau đây?", "choices": [{"icon": "1️⃣", "label": "5 quả"}, {"icon": "2️⃣", "label": "8 quả."}, {"icon": "3️⃣", "label": "6 quả"}], "correct": 1, "speak": "Có bao nhiêu quả táo trong hình sau đây?  Một: 5 quả  Hai: 8 quả.  Ba: 6 quả"},
  {"id": "2", "img": "vi/cau2.png", "question": "10 quả dâu bớt đi 3 quả còn mấy quả dâu?", "choices": [{"icon": "1️⃣", "label": "7 quả"}, {"icon": "2️⃣", "label": "5 quả."}, {"icon": "3️⃣", "label": "8 quả"}], "correct": 0, "speak": "10 quả dâu bớt đi 3 quả còn mấy quả dâu?  Một: 7 quả  Hai: 5 quả.  Ba: 8 quả"},
  {"id": "3", "img": "vi/cau3.png", "question": "Hình nào sau đây có bốn cạnh dài bằng nhau?", "choices": [{"icon": "1️⃣", "label": "Hình vuông"}, {"icon": "2️⃣", "label": "Hình tròn."}, {"icon": "3️⃣", "label": "Hình tam giác"}], "correct": 0, "speak": "Hình nào sau đây có bốn cạnh dài bằng nhau?  Một: Hình vuông  Hai: Hình tròn.  Ba: Hình tam giác"},
  {"id": "4", "img": "vi/cau4.png", "question": "Khối nào sau đây lăn được?", "choices": [{"icon": "1️⃣", "label": "Khối vuông"}, {"icon": "2️⃣", "label": "Khối chữ nhật."}, {"icon": "3️⃣", "label": "Khối cầu"}], "correct": 2, "speak": "Khối nào sau đây lăn được?  Một: Khối vuông  Hai: Khối chữ nhật.  Ba: Khối cầu"},
  {"id": "5", "img": "vi/cau5.png", "question": "Con cá bơi dưới nước thở bằng gì?", "choices": [{"icon": "1️⃣", "label": "Bằng mang"}, {"icon": "2️⃣", "label": "Bằng mắt."}, {"icon": "3️⃣", "label": "Bằng miệng"}], "correct": 0, "speak": "Con cá bơi dưới nước thở bằng gì?  Một: Bằng mang  Hai: Bằng mắt.  Ba: Bằng miệng"},
  {"id": "6", "img": "vi/cau6.png", "question": "Các con vật sau  đây, con nào có hai chân đẻ trứng?", "choices": [{"icon": "1️⃣", "label": "Gà trống"}, {"icon": "2️⃣", "label": "Gà mái."}, {"icon": "3️⃣", "label": "Con mèo"}], "correct": 1, "speak": "Các con vật sau  đây, con nào có hai chân đẻ trứng?  Một: Gà trống  Hai: Gà mái.  Ba: Con mèo"},
  {"id": "7", "img": "vi/cau7.png", "question": "Đâu là thực phẩm thuộc nhóm chất đạm?", "choices": [{"icon": "1️⃣", "label": "Ngô, khoai"}, {"icon": "2️⃣", "label": "Cá, Thịt."}, {"icon": "3️⃣", "label": "Rau, củ, quả"}], "correct": 1, "speak": "Đâu là thực phẩm thuộc nhóm chất đạm?  Một: Ngô, khoai  Hai: Cá, Thịt.  Ba: Rau, củ, quả"},
  {"id": "8", "img": "vi/cau8.png", "question": "Những loại thực phẩm nào sau đây cung cấp nhiều chất béo?", "choices": [{"icon": "1️⃣", "label": "Ngô, khoai, gạo"}, {"icon": "2️⃣", "label": "Bơ, sữa, dầu ăn."}, {"icon": "3️⃣", "label": "Thịt, cá, tôm, trứng"}], "correct": 1, "speak": "Những loại thực phẩm nào sau đây cung cấp nhiều chất béo?  Một: Ngô, khoai, gạo  Hai: Bơ, sữa, dầu ăn.  Ba: Thịt, cá, tôm, trứng"},
  {"id": "9", "img": "vi/cau9.png", "question": "Pha trộn màu đỏ với màu vàng sẽ được màu gì?", "choices": [{"icon": "1️⃣", "label": "Màu cam"}, {"icon": "2️⃣", "label": "Màu hồng ."}, {"icon": "3️⃣", "label": "Màu tím"}], "correct": 0, "speak": "Pha trộn màu đỏ với màu vàng sẽ được màu gì?  Một: Màu cam   Hai: Màu hồng .  Ba: Màu tím"},
  {"id": "10", "img": "vi/cau10.png", "question": "Vật nào sau đây sẽ nổi trong nước?", "choices": [{"icon": "1️⃣", "label": "Cành cây khô"}, {"icon": "2️⃣", "label": "Khối kim loại."}, {"icon": "3️⃣", "label": "Sỏi đá"}], "correct": 0, "speak": "Vật nào sau đây sẽ nổi trong nước?  Một: Cành cây khô   Hai: Khối kim loại.  Ba: Sỏi đá"},
  {"id": "11", "img": "vi/cau11.png", "question": "Cầu vồng có mấy màu?", "choices": [{"icon": "1️⃣", "label": "Chín màu"}, {"icon": "2️⃣", "label": "Bảy màu."}, {"icon": "3️⃣", "label": "Năm màu"}], "correct": 1, "speak": "Cầu vồng có mấy màu?  Một: Chín màu   Hai: Bảy màu.  Ba: Năm màu"},
  {"id": "12", "img": "vi/cau12.png", "question": "Hoa nào nở vào mùa hè?", "choices": [{"icon": "1️⃣", "label": "Hoa Phượng đỏ"}, {"icon": "2️⃣", "label": "Hoa Mai."}, {"icon": "3️⃣", "label": "Hoa hồng"}], "correct": 0, "speak": "Hoa nào nở vào mùa hè?  Một: Hoa Phượng đỏ  Hai: Hoa Mai.  Ba: Hoa hồng"},
  {"id": "13", "img": "vi/cau13.png", "question": "Đâu là nguồn ánh sáng tự nhiên?", "choices": [{"icon": "1️⃣", "label": "Đèn điện"}, {"icon": "2️⃣", "label": "Mặt trời."}, {"icon": "3️⃣", "label": "Đèn dầu"}], "correct": 1, "speak": "Đâu là nguồn ánh sáng tự nhiên?  Một: Đèn điện  Hai: Mặt trời.  Ba: Đèn dầu"},
  {"id": "14", "img": "vi/cau14.png", "question": "Trường mầm non Bắc Hà nằm  ở phường nào?", "choices": [{"icon": "1️⃣", "label": "Phường Bắc Hà"}, {"icon": "2️⃣", "label": "Phường Nguyễn Du."}, {"icon": "3️⃣", "label": "Phường Nam Hà"}], "correct": 0, "speak": "Trường mầm non Bắc Hà nằm  ở phường nào?  Một: Phường Bắc Hà  Hai: Phường Nguyễn Du.  Ba: Phường Nam Hà"},
  {"id": "15", "img": "vi/cau15.png", "question": "Đâu là biểu tượng của trường mầm non Bắc Hà?", "choices": [{"icon": "1️⃣", "label": "Ảnh số một"}, {"icon": "2️⃣", "label": "Ảnh số hai."}, {"icon": "3️⃣", "label": "Ảnh số ba"}], "correct": 1, "speak": "Đâu là biểu tượng của trường mầm non Bắc Hà?  Một: Ảnh số một  Hai: Ảnh số hai.  Ba: Ảnh số ba"},
  {"id": "16", "img": "vi/cau16.png", "question": "Khi thấy đèn vàng người tham gia giao thông phải làm gì?", "choices": [{"icon": "1️⃣", "label": "Dừng lại"}, {"icon": "2️⃣", "label": "Chạy nhanh."}, {"icon": "3️⃣", "label": "Giảm tốc độ"}], "correct": 2, "speak": "Khi thấy đèn vàng người tham gia giao thông phải làm gì?  Một: Dừng lại  Hai: Chạy nhanh.  Ba: Giảm tốc độ"},
  {"id": "17", "img": "vi/cau17.png", "question": "Muốn đi qua đường cháu sẽ làm gì?", "choices": [{"icon": "1️⃣", "label": "Chạy nhanh qua đường"}, {"icon": "2️⃣", "label": "Nhẹ nhàng đi qua."}, {"icon": "3️⃣", "label": "Nhờ người lớn dắt qua"}], "correct": 2, "speak": "Muốn đi qua đường cháu sẽ làm gì?  Một: Chạy nhanh qua đường  Hai: Nhẹ nhàng đi qua.  Ba: Nhờ người lớn dắt qua"},
  {"id": "18", "img": "vi/cau18.png", "question": "Khi bị lạc con phải làm gì?", "choices": [{"icon": "1️⃣", "label": "Đi tìm bố mẹ hoặc nhờ người lạ đưa về nhà"}, {"icon": "2️⃣", "label": "Tìm công an nhờ gọi điện cho bố mẹ."}, {"icon": "3️⃣", "label": "Khóc lóc"}], "correct": [1,2], "speak": "Khi bị lạc con phải làm gì?  Một: Đi tìm bố mẹ hoặc nhờ người lạ đưa về nhà  Hai: Tìm công an nhờ gọi điện cho bố mẹ.  Ba: Khóc lóc"},
  {"id": "19", "img": "vi/cau19.png", "question": "Quả nào sau đây có múi?", "choices": [{"icon": "1️⃣", "label": "Quả Cam"}, {"icon": "2️⃣", "label": "Quả chuối."}, {"icon": "3️⃣", "label": "Quả nhãn"}], "correct": 0, "speak": "Quả nào sau đây có múi?  Một: Quả Cam  Hai: Quả chuối.  Ba: Quả nhãn"},
  {"id": "20", "img": "vi/cau20.png", "question": "Quả nào sau đây có một hạt?", "choices": [{"icon": "1️⃣", "label": "Quả xoài"}, {"icon": "2️⃣", "label": "Quả na."}, {"icon": "3️⃣", "label": "Quả mít"}], "correct": 0, "speak": "Quả nào sau đây có một hạt?  Một: Quả xoài  Hai: Quả na.  Ba: Quả mít"},
  {"id": "21", "img": "vi/cau21.png", "question": "Màu đỏ trong tiếng anh đọc là gì?", "choices": [{"icon": "1️⃣", "label": "Red"}, {"icon": "2️⃣", "label": "Yellow."}, {"icon": "3️⃣", "label": "Blue"}], "correct": 0, "speak": "Màu đỏ trong tiếng anh đọc là gì?  Một: Red  Hai: Yellow.  Ba: Blue"},
  {"id": "22", "img": "vi/cau22.png", "question": "Đâu là số điện thoại báo cháy?", "choices": [{"icon": "1️⃣", "label": "113"}, {"icon": "2️⃣", "label": "114"}, {"icon": "3️⃣", "label": "115"}], "correct": 1, "speak": "Đâu là số điện thoại báo cháy?  Một: 113  Hai: 114  Ba: 115"},
  {"id": "23", "img": "vi/cau23.png", "question": "Điền số vào ô trống để hợp với quy luật đếm?", "choices": [{"icon": "1️⃣", "label": "Số 5"}, {"icon": "2️⃣", "label": "Số 3"}, {"icon": "3️⃣", "label": "Số 9"}], "correct": 0, "speak": "Điền số vào ô trống để hợp với quy luật đếm?  Một: Số 5  Hai: Số 3  Ba: Số 9"},
  {"id": "24", "img": "vi/cau24.png", "question": "Đồ dùng nào sau đây được làm bằng kim loại?", "choices": [{"icon": "1️⃣", "label": "Bát đĩa"}, {"icon": "2️⃣", "label": "Thìa."}, {"icon": "3️⃣", "label": "Cốc uống nước"}], "correct": 1, "speak": "Đồ dùng nào sau đây được làm bằng kim loại?  Một: Bát đĩa  Hai: Thìa.  Ba: Cốc uống nước"},
  {"id": "25", "img": "vi/cau25.png", "question": "Đâu là loại rác khó phân hủy?", "choices": [{"icon": "1️⃣", "label": "Vỏ chuối"}, {"icon": "2️⃣", "label": "Túi ni lông."}, {"icon": "3️⃣", "label": "Giấy"}], "correct": 1, "speak": "Đâu là loại rác khó phân hủy?  Một: Vỏ chuối  Hai: Túi ni lông.  Ba: Giấy "},
  {"id": "26", "img": "vi/cau26.png", "question": "Đâu là hình ảnh quốc kì Việt Nam?", "choices": [{"icon": "1️⃣", "label": "Nền đỏ, sao vàng 5 cánh"}, {"icon": "2️⃣", "label": "Nền trắng có hình tròn xanh đỏ."}, {"icon": "3️⃣", "label": "Nền sọc trắng, đỏ, góc trái có nhiều ngôi sao"}], "correct": 0, "speak": "Đâu là hình ảnh quốc kì Việt Nam?  Một: Nền đỏ, sao vàng 5 cánh  Hai: Nền trắng có hình tròn xanh đỏ.  Ba: Nền sọc trắng, đỏ, góc trái có nhiều ngôi sao "},
  {"id": "27", "img": "vi/cau27.png", "question": "Lăng Bác Hồ nằm ở địa danh nào sau đây?", "choices": [{"icon": "1️⃣", "label": "TP Đà Nẵng"}, {"icon": "2️⃣", "label": "TP Hồ Chí Minh."}, {"icon": "3️⃣", "label": "Thủ đô Hà Nội"}], "correct": 2, "speak": "Lăng Bác Hồ nằm ở địa danh nào sau đây?  Một: TP Đà Nẵng  Hai: TP Hồ Chí Minh.  Ba: Thủ đô Hà Nội "},
  {"id": "28", "img": "vi/cau28.png", "question": "Ngày sinh nhật Bác Hồ là ngày nào sau đây?", "choices": [{"icon": "1️⃣", "label": "Ngày 20 tháng 10"}, {"icon": "2️⃣", "label": "ngày 19 tháng 5."}], "correct": 1, "speak": "Ngày sinh nhật Bác Hồ là ngày nào sau đây?  Một: Ngày 20 tháng 10  Hai: ngày 19 tháng 5."},
  {"id": "29", "img": "vi/cau29.png", "question": "Ngày mồng 1 tháng 6 là ngày gì?", "choices": [{"icon": "1️⃣", "label": "Ngày Quốc tế lao động"}, {"icon": "2️⃣", "label": "Ngày Quốc tế thiếu nhi."}], "correct": 1, "speak": "Ngày mồng 1 tháng 6 là ngày gì?  Một: Ngày Quốc tế lao động  Hai: Ngày Quốc tế thiếu nhi."},
  {"id": "30", "img": "vi/cau30.png", "question": "Từ “trời nắng” trong tiếng anh đọc như thế nào?", "choices": [{"icon": "1️⃣", "label": "Windy"}, {"icon": "2️⃣", "label": "Sunny."}, {"icon": "3️⃣", "label": "Cloudy"}], "correct": 1, "speak": "Từ “trời nắng” trong tiếng anh đọc như thế nào?  Một: Windy  Hai: Sunny.  Ba: Cloudy "},
  {"id": "31", "img": "vi/cau31.png", "question": "Người sinh ra mẹ gọi  là gì?", "choices": [{"icon": "1️⃣", "label": "Bà ngoại"}, {"icon": "2️⃣", "label": "Bà Nội"}], "correct": 0, "speak": "Người sinh ra mẹ gọi  là gì?  Một: Bà ngoại  Hai: Bà Nội"},
  {"id": "32", "img": "vi/cau32.png", "question": "Bố là con của ai?", "choices": [{"icon": "1️⃣", "label": "Ông bà nội"}, {"icon": "2️⃣", "label": "Ông bà ngoại"}], "correct": 0, "speak": "Bố là con của ai?  Một: Ông bà nội  Hai: Ông bà ngoại"},
  {"id": "33", "img": "vi/cau33.png", "question": "Trong câu chuyện “ Sự tích Hồ Gươm” người đánh cá kéo được thứ gì dưới dòng sông lên?", "choices": [{"icon": "1️⃣", "label": "Con cá to"}, {"icon": "2️⃣", "label": "Con rùa vàng."}, {"icon": "3️⃣", "label": "Thanh kiếm"}], "correct": 2, "speak": "Trong câu chuyện “ Sự tích Hồ Gươm” người đánh cá kéo được thứ gì dưới dòng sông lên?  Một: Con cá to  Hai: Con rùa vàng.  Ba: Thanh kiếm "},
  {"id": "34", "img": "vi/cau34.png", "question": "Trong câu chuyện “cáo thỏ và gà trống” ai đuổi được cáo ra khỏi nhà thỏ?", "choices": [{"icon": "1️⃣", "label": "Bầy chó"}, {"icon": "2️⃣", "label": "Gà trống."}, {"icon": "3️⃣", "label": "Bác gấu"}], "correct": 1, "speak": "Trong câu chuyện “cáo thỏ và gà trống” ai đuổi được cáo ra khỏi nhà thỏ?  Một: Bầy chó  Hai: Gà trống.  Ba: Bác gấu"},
  {"id": "35", "img": "vi/cau35.png", "question": "Trong câu chuyện “ Cây khế ” chim Đại Bàng nói người anh may túi mấy gang để đựng vàng?", "choices": [{"icon": "1️⃣", "label": "6 gang"}, {"icon": "2️⃣", "label": "3 gang."}, {"icon": "3️⃣", "label": "9 gang"}], "correct": 1, "speak": "Trong câu chuyện “ Cây khế ” chim Đại Bàng nói người anh may túi mấy gang để đựng vàng?  Một: 6 gang  Hai: 3 gang.  Ba: 9 gang"},
  {"id": "36", "img": "vi/cau36.png", "question": "Đâu là sản phẩm của nghề nông?", "choices": [{"icon": "1️⃣", "label": "Đồng lúa"}, {"icon": "2️⃣", "label": "Cá tươi."}, {"icon": "3️⃣", "label": "Kẹo Cu đơ"}], "correct": 0, "speak": "Đâu là sản phẩm của nghề nông?  Một: Đồng lúa  Hai: Cá tươi.  Ba: Kẹo Cu đơ"},
  {"id": "37", "img": "vi/cau37.png", "question": "Đâu là trang phục của nghành điện lực?", "choices": [{"icon": "1️⃣", "label": "Bộ màu xanh đen"}, {"icon": "2️⃣", "label": "Bộ màu cam."}, {"icon": "3️⃣", "label": "Bộ màu vàng đất"}], "correct": 1, "speak": "Đâu là trang phục của nghành điện lực?  Một: Bộ màu xanh đen  Hai: Bộ màu cam.  Ba: Bộ màu vàng đất"},
  {"id": "38", "img": "vi/cau38.png", "question": "Who is he?", "choices": [{"icon": "1️⃣", "label": "Farmer"}, {"icon": "2️⃣", "label": "Doctor."}, {"icon": "3️⃣", "label": "Teacher"}], "correct": 1, "speak": "Who is he?  Một: Farmer  Hai: Doctor.  Ba: Teacher"},
  {"id": "39", "img": "vi/cau39.png", "question": "Đâu là biển cảnh báo bề mặt trơn dễ té ngã?", "choices": [{"icon": "1️⃣", "label": "Ảnh số 1"}, {"icon": "2️⃣", "label": "Ảnh số 2"}, {"icon": "3️⃣", "label": "Ảnh số 3"}], "correct": 1, "speak": "Đâu là biển cảnh báo bề mặt trơn dễ té ngã?  Một: Ảnh số 1  Hai: Ảnh số 2  Ba: Ảnh số 3"},
  {"id": "40", "img": "vi/cau40.png", "question": "Đồng hồ đang chỉ vào mấy giờ?", "choices": [{"icon": "1️⃣", "label": "12 giờ"}, {"icon": "2️⃣", "label": "2 giờ"}, {"icon": "3️⃣", "label": "10 giờ"}], "correct": 2, "speak": "Đồng hồ đang chỉ vào mấy giờ?  Một: 12 giờ   Hai: 2 giờ  Ba: 10 giờ"},
  {"id": "41", "img": "vi/cau41.png", "question": "Tên gọi khác của Thành phố Hà Tĩnh gắn liền với tên của một loài hoa?", "choices": [{"icon": "1️⃣", "label": "Hoa Phượng đỏ"}, {"icon": "2️⃣", "label": "Thành Sen"}], "correct": 1, "speak": "Tên gọi khác của Thành phố Hà Tĩnh gắn liền với tên của một loài hoa?  Một: Hoa Phượng đỏ   Hai: Thành Sen"},
  {"id": "42", "img": null, "question": "Hãy nghe đoán xem tên bài hát là gì?", "choices": [{"icon": "1️⃣", "label": "Cả nhà thương nhau"}, {"icon": "2️⃣", "label": "Ba thương con"}], "correct": 0, "speak": "Hãy nghe đoán xem tên bài hát là gì?  Một: Cả nhà thương nhau  Hai: Ba thương con", "media": "music_42", "emoji": "🎵"},
  {"id": "43", "img": null, "question": "Hãy nghe âm thanh và đoán tên nhạc cụ?", "choices": [{"icon": "1️⃣", "label": "Xắc xô"}, {"icon": "2️⃣", "label": "Trống"}, {"icon": "3️⃣", "label": "Đàn ghi ta"}], "correct": 2, "speak": "Hãy nghe âm thanh và đoán tên nhạc cụ?  Một: Xắc xô   Hai: Trống  Ba: Đàn ghi ta", "media": "music_43", "emoji": "🎶"},
  {"id": "44", "img": "vi/cau44.png", "question": "Nét tròn em đọc chữ ", "choices": [{"icon": "1️⃣", "label": "Chữ O"}, {"icon": "2️⃣", "label": "Chữ C"}, {"icon": "3️⃣", "label": "Chữ Ô"}], "correct": 1, "speak": "Nét tròn em đọc chữ o Khuyết đi một nửa sẽ cho chữ gì?  Một: Chữ O   Hai: Chữ C  Ba: Chữ Ô"},
  {"id": "45", "img": "vi/cau45.png", "question": "Trong chữ “ Hoa Hồng” còn thiếu chữ cái nào?", "choices": [{"icon": "1️⃣", "label": "a"}, {"icon": "2️⃣", "label": "o"}, {"icon": "3️⃣", "label": "n"}], "correct": 1, "speak": "Trong chữ “ Hoa Hồng” còn thiếu chữ cái nào?  Một: a   Hai: o  Ba: n"},
  {"id": "46", "img": "vi/cau46.png", "question": "Em bé đang cầm chùm bóng bay bằng tay nào?", "choices": [{"icon": "1️⃣", "label": "Tay phải"}, {"icon": "2️⃣", "label": "Tay trái"}], "correct": 1, "speak": "Em bé đang cầm chùm bóng bay bằng tay nào?  Một: Tay phải  Hai: Tay trái"},
  {"id": "47", "img": "vi/cau47.png", "question": "Hôm nay là thứ Bảy thì hôm qua là thứ mấy?", "choices": [{"icon": "1️⃣", "label": "Chủ nhật"}, {"icon": "2️⃣", "label": "Thứ sáu"}, {"icon": "3️⃣", "label": "Thứ hai"}], "correct": 1, "speak": "Hôm nay là thứ Bảy thì hôm qua là thứ mấy?  Một: Chủ nhật  Hai: Thứ sáu  Ba: Thứ hai", "emoji": "📅"},
  {"id": "48", "img": "vi/cau48.png", "question": "Điền vào ô trống hình ảnh thích hợp?", "choices": [{"icon": "1️⃣", "label": "Hình 1"}, {"icon": "2️⃣", "label": "Hình 2"}, {"icon": "3️⃣", "label": "Hình ba"}], "correct": 1, "speak": "Điền vào ô trống hình ảnh thích hợp?  Một: Hình 1  Hai: Hình 2  Ba: Hình ba"},
  {"id": "49", "img": "vi/cau49.png", "question": "Khối vuông có bao nhiêu mặt?", "choices": [{"icon": "1️⃣", "label": "4 mặt"}, {"icon": "2️⃣", "label": "6 mặt"}, {"icon": "3️⃣", "label": "8 mặt"}], "correct": 1, "speak": "Khối vuông có bao nhiêu mặt?  Một: 4 mặt  Hai: 6 mặt  Ba: 8 mặt"},
  {"id": "50", "img": "vi/cau50.png", "question": "Có bao nhiêu hình vuông trong bức tranh dưới đây?", "choices": [{"icon": "1️⃣", "label": "8 hình"}, {"icon": "2️⃣", "label": "7 hình"}, {"icon": "3️⃣", "label": "6 hình"}], "correct": 0, "speak": "Có bao nhiêu hình vuông trong bức tranh dưới đây?  Một: 8 hình  Hai: 7 hình  Ba: 6 hình"},
  {"id": "51", "img": "vi/cau51.png", "question": "Làm thế nào để quả trứng nổi lên?", "choices": [{"icon": "1️⃣", "label": "Cho giấm vào"}, {"icon": "2️⃣", "label": "Cho dầu ăn vào"}, {"icon": "3️⃣", "label": "Cho muối vào"}], "correct": 2, "speak": "Làm thế nào để quả trứng nổi lên?  Một: Cho giấm vào  Hai: Cho dầu ăn vào  Ba: Cho muối vào"},
  {"id": "52", "img": "vi/cau52.png", "question": "Linh vật của SEA Games 31 là gì?", "choices": [{"icon": "1️⃣", "label": "Trâu vàng"}, {"icon": "2️⃣", "label": "Sao la"}, {"icon": "3️⃣", "label": "Hổ Rimau"}], "correct": 1, "speak": "Linh vật của SEA Games 31 là gì?  Một: Trâu vàng  Hai: Sao la  Ba: Hổ Rimau"},
  {"id": "53", "img": "vi/cau53.png", "question": "Chọn hình thích hợp điền vào ô trống?", "choices": [{"icon": "1️⃣", "label": "Hình 1"}, {"icon": "2️⃣", "label": "Hình 2"}, {"icon": "3️⃣", "label": "Hình 3"}], "correct": 0, "speak": "Chọn hình thích hợp điền vào ô trống?  Một: Hình 1  Hai: Hình 2  Ba: Hình 3"},
  {"id": "54", "img": "vi/cau54.png", "question": "Điền hình thích hợp vào dấu chẩm hỏi?", "choices": [{"icon": "1️⃣", "label": "hình tròn"}, {"icon": "2️⃣", "label": "hình ngôi sao"}, {"icon": "3️⃣", "label": "Hình mặt trời"}], "correct": 1, "speak": "Điền hình thích hợp vào dấu chẩm hỏi?  Một: hình tròn  Hai: hình ngôi sao  Ba: Hình mặt trời"},
];

${GAME_SCRIPT_VI}
</script>
</body>
</html>`)
})

// ====================================================
// GAME SCRIPTS (shared logic, different TTS lang)
// ====================================================
const GAME_SCRIPT_EN = `
let currentIdx=0,answered={},timerInterval=null,timeLeft=5,countdownRunning=false;
let gameMode='practice',compScore=0,selectedChoice=-1,answerRevealed=false;
let introMusicEnabled=true,shuffledChoices=[],shuffledCorrects=[],mediaReady=false;
const TTS_LANG='en-US';
${GAME_SHARED_LOGIC(30, 'en-US', true)}
`

const GAME_SCRIPT_VI = `
let currentIdx=0,answered={},timerInterval=null,timeLeft=5,countdownRunning=false;
let gameMode='practice',compScore=0,selectedChoice=-1,answerRevealed=false;
let introMusicEnabled=true,shuffledChoices=[],shuffledCorrects=[],mediaReady=false;
const TTS_LANG='vi-VN';
${GAME_SHARED_LOGIC(54, 'vi-VN', true)}
`

function GAME_SHARED_LOGIC(totalQ: number, ttsLang: string, hasMedia: boolean): string {
  return `
(function createStars(){
  const bg=document.getElementById('stars-bg');
  for(let i=0;i<60;i++){
    const s=document.createElement('div');s.className='star';
    const sz=Math.random()*5+2;
    s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;background:'+(Math.random()>.5?'#FFD700':'#fff')+';animation-duration:'+(Math.random()*3+2)+'s;animation-delay:'+(Math.random()*3)+'s';
    bg.appendChild(s);
  }
})();
const IS_EN = TTS_LANG === 'en-US';
const TXT = {
  ttsReady: IS_EN ? '🔊 Ready' : '🔊 Sẵn sàng',
  ttsReading: IS_EN ? '🔊 Reading...' : '🔊 Đang đọc...',
  ttsDone: IS_EN ? '✅ Done reading' : '✅ Đã đọc xong',
  ttsError: IS_EN ? '🔇 TTS error' : '🔇 TTS lỗi',
  question: IS_EN ? 'Question' : 'Câu',
  practice: IS_EN ? '📚 Practice' : '📚 Luyện tập',
  competition: IS_EN ? '🏆 Competition' : '🏆 Thi đấu',
  correctWord: IS_EN ? 'correct' : 'đúng',
  answerPrefix: IS_EN ? 'The correct answer is: ' : 'Đáp án đúng là: ',
  finishedPrefix: IS_EN ? 'Finished! You got ' : 'Kết thúc! Bé đã trả lời đúng ',
  overWord: IS_EN ? ' out of ' : ' trên ',
  qWord: IS_EN ? ' questions. ' : ' câu. ',
  excellent: IS_EN ? 'Excellent!' : 'Xuất sắc!',
  good: IS_EN ? 'Great job!' : 'Tốt lắm!',
  keepTrying: IS_EN ? 'Keep trying!' : 'Cố gắng lên nhé!'
};

function flashLightning(){const el=document.getElementById('lightning');el.style.display='block';setTimeout(()=>el.style.display='none',150);}
function spawnParticles(x,y,n=10){const cols=['#FFD700','#FFA500','#FF6B35','#00ff88','#00bfff','#ff69b4'];for(let i=0;i<n;i++){const p=document.createElement('div');p.className='particle';const sz=Math.random()*10+5,d=Math.random()*2+1.5,c=cols[Math.floor(Math.random()*cols.length)];p.style.cssText='width:'+sz+'px;height:'+sz+'px;background:'+c+';left:'+(x+(Math.random()-.5)*120)+'px;top:'+y+'px;animation-duration:'+d+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),d*1000);}}
function fireworks(n=14){const em=['🎊','🎉','⭐','✨','🌟','💛','🟡'];for(let i=0;i<n;i++){setTimeout(()=>{const el=document.createElement('div');el.className='firework';el.textContent=em[Math.floor(Math.random()*em.length)];el.style.cssText='left:'+Math.random()*100+'vw;top:'+Math.random()*100+'vh;--tx:'+(Math.random()-.5)*300+'px;--ty:'+(Math.random()-.5)*300+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),2000);},i*80);}}
function screenFlash(type){const bg=document.getElementById('stars-bg');bg.classList.add(type==='correct'?'screen-flash-green':'screen-flash-red');setTimeout(()=>bg.classList.remove('screen-flash-green','screen-flash-red'),550);}

function playIntroMusic(){if(!introMusicEnabled)return;const a=document.getElementById('audio-intro');a.volume=0.4;a.play().catch(()=>{});}
function stopIntroMusic(){const a=document.getElementById('audio-intro');a.pause();a.currentTime=0;}
function playBeep(f1,f2,dur){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),g=ctx.createGain();osc.connect(g);g.connect(ctx.destination);osc.frequency.setValueAtTime(f1,ctx.currentTime);if(f2)osc.frequency.setValueAtTime(f2,ctx.currentTime+dur*.5);g.gain.setValueAtTime(0.22,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+dur);osc.start();osc.stop(ctx.currentTime+dur);}catch(e){}}
function playCountdownTick(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';osc.connect(g);g.connect(ctx.destination);osc.frequency.setValueAtTime(800,ctx.currentTime);g.gain.setValueAtTime(0.18,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+.12);osc.start();osc.stop(ctx.currentTime+.12);}catch(e){}}
function playCountdownEnd(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sawtooth';osc.connect(g);g.connect(ctx.destination);osc.frequency.setValueAtTime(440,ctx.currentTime);osc.frequency.setValueAtTime(300,ctx.currentTime+.2);osc.frequency.setValueAtTime(200,ctx.currentTime+.4);g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+.6);osc.start();osc.stop(ctx.currentTime+.6);}catch(e){}}
function playCorrect(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const notes=[523,659,784,1047];notes.forEach((freq,i)=>{setTimeout(()=>{const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';osc.connect(g);g.connect(ctx.destination);osc.frequency.setValueAtTime(freq,ctx.currentTime);g.gain.setValueAtTime(0.28,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+.25);osc.start();osc.stop(ctx.currentTime+.25);},i*120);});}catch(e){}}
function playWrong(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sawtooth';osc.connect(g);g.connect(ctx.destination);osc.frequency.setValueAtTime(220,ctx.currentTime);osc.frequency.setValueAtTime(140,ctx.currentTime+.28);g.gain.setValueAtTime(0.25,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+.55);osc.start();osc.stop(ctx.currentTime+.55);}catch(e){}}


let currentAudio = null;
let popupAudioUrl = '';
function playAudioOnly(url, onEnd) {
    if(currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
    currentAudio = new Audio(url);
    currentAudio.onended = () => {
        setTTSStatus(TXT.ttsDone);
        if(onEnd) onEnd();
    };
    currentAudio.onerror = () => {
        console.warn('Audio file not found: ' + url);
        setTTSStatus('🔇 Không tìm thấy file âm thanh');
        if(onEnd) onEnd();
    };
    currentAudio.play().catch(e => {
        console.warn('Playback prevented: ' + url, e);
        setTTSStatus('🔇 Không thể phát âm thanh');
        if(onEnd) onEnd();
    });
}
function playAudioOrTTS(url, ttsScript, onEnd) {
    if(currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
    currentAudio = new Audio(url);
    currentAudio.onended = () => {
        if(onEnd) onEnd();
    };
    currentAudio.onerror = () => {
        console.warn('Audio file not found: ' + url + ' - falling back to TTS');
        speakText(ttsScript, onEnd);
    };
    currentAudio.play().catch(e => {
        console.warn('Playback prevented: ' + url, e);
        speakText(ttsScript, onEnd);
    });
}
function stopAudio() {
    if(currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
    stopTTS();
}
let ttsEnabled=!!window.speechSynthesis;
function speakText(text,onEnd){
  setTTSStatus(TXT.ttsReading);
  const runNativeTTS = () => {
    if(!ttsEnabled||!window.speechSynthesis){ setTTSStatus(TXT.ttsError); if(onEnd)onEnd(); return; }
    window.speechSynthesis.cancel();
    const utt=new SpeechSynthesisUtterance(text);
    utt.lang='${ttsLang}';utt.rate=0.85;utt.pitch=1.1;utt.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const v=voices.find(x=>x.lang.startsWith('${ttsLang.split('-')[0]}')&&x.name.toLowerCase().includes('female'))
            ||voices.find(x=>x.lang.startsWith('${ttsLang.split('-')[0]}'));
    if(v)utt.voice=v;
    utt.onend=()=>{setTTSStatus(TXT.ttsDone);if(onEnd)onEnd();};
    utt.onerror=()=>{setTTSStatus(TXT.ttsError);if(onEnd)onEnd();};
    window.speechSynthesis.speak(utt);
  };

  const tl = '${ttsLang}'.split('-')[0];
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + tl + '&q=' + encodeURIComponent(text);
  
  if(currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
  currentAudio = new Audio(url);
  currentAudio.onended = () => {
      setTTSStatus(TXT.ttsDone);
      if(onEnd) onEnd();
  };
  currentAudio.onerror = () => {
      console.warn('Google TTS failed, falling back to window.speechSynthesis');
      runNativeTTS();
  };
  currentAudio.play().catch(e => {
      console.warn('Google TTS playback prevented', e);
      runNativeTTS();
  });
}
function speakQuestion(){
  if(!currentQ())return;
  const script=shuffledChoices.length>0?buildTTSScript(currentQ(),shuffledChoices):currentQ().speak;
  
  const isViet = (TTS_LANG === 'vi-VN');
  if(isViet) {
      setTTSStatus(TXT.ttsReading);
      const soundUrl = '/assets/audio/vi/cau' + currentQ().id + '.wav';
      playAudioOnly(soundUrl);
  } else {
      speakText(script);
  }
}
function stopTTS(){if(window.speechSynthesis)window.speechSynthesis.cancel();setTTSStatus(TXT.ttsReady);}
function setTTSStatus(txt){const el=document.getElementById('tts-status');if(el)el.textContent=txt;}
function currentQ(){return Q[currentIdx];}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();window.speechSynthesis.getVoices();}
function setLionPopupContent(title, subtitle, replayLabel){
  const t=document.getElementById('lion-popup-title');
  const s=document.getElementById('lion-popup-subtitle');
  const b=document.getElementById('lion-popup-replay-btn');
  if(t)t.textContent=title;
  if(s)s.textContent=subtitle;
  if(b)b.textContent=replayLabel;
}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');}
function showIntro(){clearTimer();stopAudio();closeAnswer();showScreen('screen-intro');introMusicEnabled=true;playIntroMusic();}
function showRules(){stopIntroMusic();introMusicEnabled=false;stopAudio();showScreen('screen-rules');}
function showGrid(){clearTimer();stopAudio();stopIntroMusic();introMusicEnabled=false;closeAnswer();buildGrid();showScreen('screen-grid');updateProgress();}
function goBack(){clearTimer();stopAudio();showGrid();}

function buildGrid(){
  const grid=document.getElementById('question-grid');grid.innerHTML='';
  Q.forEach((q,i)=>{
    const done=answered.hasOwnProperty(i),correct=answered[i]===true;
    const cell=document.createElement('div');
    cell.className='q-cell'+(done?(correct?' done':' done wrong-done'):'');
    cell.id='qcell-'+i;
    cell.innerHTML='<span class="q-num">'+(i+1)+'</span><span class="q-check">'+(correct?'✓':'✗')+'</span>';
    cell.title=(IS_EN?'Question ':'Câu ')+(i+1)+': '+q.question;
    cell.onclick=()=>{console.log('Grid Cell clicked', i); gameMode='practice';openQuestion(i);};
    grid.appendChild(cell);
  });
}
function updateProgress(){
  const done=Object.keys(answered).length,correct=Object.values(answered).filter(v=>v===true).length;
  document.getElementById('progress-text').textContent=done+'/'+${totalQ}+' | ✅ '+correct+' '+TXT.correctWord;
}
function startCompetition(){console.log("startCompetition clicked"); stopIntroMusic();introMusicEnabled=false;answered={};compScore=0;gameMode='competition';currentIdx=0;buildGrid();updateProgress();openQuestion(0);}
function resetProgress(){answered={};compScore=0;gameMode='practice';buildGrid();updateProgress();}

function openQuestion(idx){
  console.log("openQuestion started with idx:", idx);
  currentIdx=idx;selectedChoice=-1;answerRevealed=false;
  clearTimer();stopAudio();closeAnswer();
  const q=Q[idx];
  console.log("Q fetched:", q);
  document.getElementById('q-num-badge').textContent=TXT.question+' '+(idx+1)+'/'+${totalQ};
  if(gameMode==='competition'){
    document.getElementById('mode-badge').textContent=TXT.competition;
    document.getElementById('mode-badge').style.cssText='background:rgba(0,200,80,.25);border:2px solid rgba(0,255,130,.5);color:#00ff88';
    document.getElementById('q-score-live').style.display='';
    document.getElementById('q-score-live').textContent='✅ '+compScore+' '+TXT.correctWord;
  } else {
    document.getElementById('mode-badge').textContent=TXT.practice;
    document.getElementById('mode-badge').style.cssText='background:rgba(255,100,0,.25);border:2px solid rgba(255,150,0,.5);color:#FFA500';
    document.getElementById('q-score-live').style.display='none';
  }
  console.log("openQuestion phase 2");
  const vWrap=document.getElementById('q-visual-wrap');
  if(q.img){vWrap.innerHTML='<img class="q-visual-img" src="/assets/images/'+q.img+'" alt="question image" loading="eager"><span class="q-visual-emoji" style="display:none">'+(q.emoji||'❓')+'</span>';}
  else{vWrap.innerHTML='<span class="q-visual-emoji">'+(q.emoji||'❓')+'</span>';}
  document.getElementById('q-text-main').textContent=q.question;
  document.getElementById('q-hint').textContent=(!IS_EN&&q.hint)?'('+q.hint+')':'';
  
  ${hasMedia ? `
    const mw=document.getElementById('media-btn-wrap');
  const mb=document.getElementById('play-media-btn');
  if(q.media==='lion'){mw.style.display='flex';mb.innerHTML=IS_EN?'🦁 Listen to lion sound!':'🦁 Nghe tiếng sư tử!';}
  else if(q.media==='gummy'){mw.style.display='flex';mb.innerHTML=IS_EN?'🐻 Watch Gummy Bear!':'🐻 Xem Gummy Bear!';}
  else if(q.media==='music_42'){mw.style.display='flex';mb.innerHTML=IS_EN?'🎵 Listen to the song!':'🎵 Nghe ca nhà thương nhau!';}
  else if(q.media==='music_43'){mw.style.display='flex';mb.innerHTML=IS_EN?'🎶 Listen to instrument sound!':'🎶 Nghe nhạc cụ!';}
  else{mw.style.display='none';}
  mediaReady=!q.media;
  ` : `mediaReady=true;`}

  shuffledChoices=buildChoicesForQuestion(q);
  const sourceCorrect=Array.isArray(q.correct)?q.correct:[q.correct];
  shuffledCorrects=shuffledChoices.map((c,i)=>sourceCorrect.includes(c.origIdx)?i:-1).filter(i=>i>=0);
  console.log("openQuestion phase 3, shuffledCorrects:", shuffledCorrects);
  const cont=document.getElementById('choices-container');cont.innerHTML='';
  shuffledChoices.forEach((ch,i)=>{
    const btn=document.createElement('div');btn.className='choice-btn';btn.id='choice-'+i;
    btn.innerHTML='<div class="choice-num-circle">'+(i+1)+'</div><div class="choice-label">'+ch.label+'</div>';
    btn.onclick=()=>selectChoice(i);cont.appendChild(btn);
  });
  timeLeft=5;countdownRunning=false;updateTimerBar();
  document.getElementById('btn-countdown').textContent='▶ 5s';
  setTTSStatus(TXT.ttsReading);
  const actionBtn=document.getElementById('btn-action-next');
  if(actionBtn)actionBtn.textContent='➡ NEXT';
  console.log("About to call showScreen(screen-question)");
  showScreen('screen-question');
  const ttsScript=buildTTSScript(q,shuffledChoices);
  if(gameMode==='competition'){
    setTimeout(()=>{
      if(IS_EN){
        speakText(ttsScript,()=>{
          ${hasMedia ? `if(q.media){setTimeout(()=>playSpecialMedia(),400);}else{setTimeout(()=>startCountdown(),400);}` : `setTimeout(()=>startCountdown(),400);`}
        });
      }else{
        const soundUrl='/assets/audio/vi/cau'+q.id+'.wav';
        playAudioOnly(soundUrl,()=>{
          ${hasMedia ? `if(q.media){setTimeout(()=>playSpecialMedia(),400);}else{setTimeout(()=>startCountdown(),400);}` : `setTimeout(()=>startCountdown(),400);`}
        });
      }
    },300);
  } else {
    setTimeout(()=>{
      if(IS_EN){speakText(ttsScript);}
      else{playAudioOnly('/assets/audio/vi/cau'+q.id+'.wav');}
    },300);
  }
}

function buildTTSScript(q,shuffled){
  const nums=IS_EN?['One','Two','Three']:['Một','Hai','Ba'];
  const choiceText=shuffled.map((c,i)=>nums[i]+': '+c.label).join('. ');
  return q.question+'. '+choiceText+'.';
}
function buildChoicesForQuestion(q){
  const arr=q.choices.map((c,i)=>({...c,origIdx:i}));
  if(IS_EN){
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  }
  return arr;
}

let lastTickSecond=6;
function startCountdown(){
  if(countdownRunning)return;countdownRunning=true;clearTimer();
  timeLeft=5;lastTickSecond=5;updateTimerBar();
  document.getElementById('btn-countdown').textContent='⏳';
  const ov=document.getElementById('countdown-overlay'),vid=document.getElementById('countdown-video');
  ov.classList.add('active');vid.currentTime=0;vid.play().catch(()=>{});
  timerInterval=setInterval(()=>{
    timeLeft-=0.1;
    const secNow=Math.ceil(timeLeft);
    if(secNow<lastTickSecond&&secNow>=0){lastTickSecond=secNow;playCountdownTick();const td=document.getElementById('timer-display');td.classList.remove('ticking');void td.offsetWidth;td.classList.add('ticking');}
    if(timeLeft<=0){
      timeLeft=0;clearTimer();countdownRunning=false;updateTimerBar();
      document.getElementById('btn-countdown').textContent='✅';
      ov.classList.remove('active');vid.pause();playCountdownEnd();
      if(gameMode==='competition'&&!answerRevealed){setTimeout(()=>revealAnswer(),500);}
    }
    updateTimerBar();
  },100);
  setTimeout(()=>{ov.classList.remove('active');vid.pause();},6000);
}
function clearTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
  const ov=document.getElementById('countdown-overlay');if(ov)ov.classList.remove('active');
  const vid=document.getElementById('countdown-video');if(vid)vid.pause();
}
function updateTimerBar(){
  const pct=Math.max(0,(timeLeft/5)*100);
  const bar=document.getElementById('timer-bar');
  bar.style.width=pct+'%';
  if(pct>60)bar.style.background='linear-gradient(90deg,#00c851,#69ff47)';
  else if(pct>25)bar.style.background='linear-gradient(90deg,#FFD700,#FFA500)';
  else bar.style.background='linear-gradient(90deg,#ff4444,#cc0000)';
  document.getElementById('timer-display').textContent=Math.max(0,Math.ceil(timeLeft));
}

function selectChoice(i){
  if(answerRevealed)return;
  selectedChoice=i;
  document.querySelectorAll('.choice-btn').forEach((b,j)=>{b.classList.remove('selected');if(j===i)b.classList.add('selected');});
  flashLightning();
  if(gameMode==='competition'){clearTimer();setTimeout(()=>revealAnswer(),400);}
}

function revealAnswer(){
  if(answerRevealed)return;answerRevealed=true;
  const q=currentQ();clearTimer();stopAudio();
  const btns=document.querySelectorAll('.choice-btn');
  btns.forEach((b,i)=>{b.classList.remove('selected');b.classList.add('locked');if(shuffledCorrects.includes(i))b.classList.add('correct');else b.classList.add('wrong');});
  const isCorrect=shuffledCorrects.includes(selectedChoice);
  answered[currentIdx]=isCorrect;
  if(gameMode==='competition'&&isCorrect)compScore++;
  updateProgress();
  const cell=document.getElementById('qcell-'+currentIdx);
  if(cell){cell.classList.add('done');if(!isCorrect)cell.classList.add('wrong-done');cell.querySelector('.q-check').textContent=isCorrect?'✓':'✗';}
  if(gameMode==='competition'){document.getElementById('q-score-live').textContent='✅ '+compScore+' '+TXT.correctWord;}
  if(isCorrect){playCorrect();screenFlash('correct');spawnParticles(window.innerWidth/2,window.innerHeight*.4,16);fireworks(10);}
  else{playWrong();screenFlash('wrong');}
  const correctShuffled=shuffledCorrects.map(i=>({idx:i,choice:shuffledChoices[i]})).filter(x=>x.choice);
  const answerDisplay=correctShuffled.map(x=>(x.idx+1)+'. '+x.choice.label).join(' | ');
  document.getElementById('answer-text-display').textContent=answerDisplay;
  document.getElementById('answer-emoji').textContent=isCorrect?'🎊':'😅';
  const isLast=currentIdx>=Q.length-1;
  const nextLabel=isLast&&gameMode==='competition'?'🏁 KẾT THÚC':'➡ NEXT';
  document.getElementById('btn-next').textContent=nextLabel;
  const actionBtn=document.getElementById('btn-action-next');if(actionBtn)actionBtn.textContent=nextLabel;
  document.getElementById('answer-overlay').classList.add('active');
  
  const isViet = (TTS_LANG === 'vi-VN');
  const ttsScript = TXT.answerPrefix + correctShuffled.map(x=>x.choice.label).join('. ');
  if(isViet) {
      setTimeout(() => {
          const soundUrl = '/assets/audio/vi/cau' + q.id + '_ans.wav';
          playAudioOnly(soundUrl);
      }, 300);
  } else {
      setTimeout(() => speakText(ttsScript), 300);
  }
}
function closeAnswer(){document.getElementById('answer-overlay').classList.remove('active');}
function handleNextBtn(){if(!answerRevealed){revealAnswer();}else{nextQuestion();}}
function nextQuestion(){
  closeAnswer();stopAudio();
  if(gameMode==='competition'){const next=currentIdx+1;if(next>=Q.length){showResultPopup();return;}openQuestion(next);}
  else{let next=currentIdx+1;if(next>=Q.length){showGrid();return;}openQuestion(next);}
}

${hasMedia ? `
function playLionSound(){const a=document.getElementById('audio-lion');if(a){a.volume=0.9;a.currentTime=0;a.play().catch(()=>{});}}
function stopLionSound(){const a=document.getElementById('audio-lion');if(a){a.pause();a.currentTime=0;}}
function replayLionSound(){
  if(popupAudioUrl){playAudioOnly(popupAudioUrl);}
  else{playLionSound();}
}
function playSpecialMedia(){
  const q=currentQ();
  if(q.media==='lion'){
    popupAudioUrl='';
    setLionPopupContent(
      IS_EN?'LION SOUND!':'TIẾNG SƯ TỬ!',
      IS_EN?'Listen and guess the animal':'Nghe âm thanh — đây là con gì?',
      IS_EN?'🔊 Replay':'🔊 Nghe lại'
    );
    document.getElementById('lion-overlay').classList.add('active');
    playLionSound();
  }
  else if(q.media==='gummy'){const ov=document.getElementById('media-overlay'),vid=document.getElementById('media-video');vid.src='/assets/gummy-bear.mp4';ov.classList.add('active');vid.play().catch(()=>{});}
  else if(q.media==='music_42'){
      popupAudioUrl='/assets/audio/vi/cau42-ca-nha-thuong-nhau.mp3';
      setLionPopupContent(
        'NGHE BÀI HÁT!',
        'Nghe xong hãy chọn đáp án đúng',
        '🔊 Nghe lại'
      );
      document.getElementById('lion-overlay').classList.add('active');
      playAudioOnly(popupAudioUrl);
  }
  else if(q.media==='music_43'){
      popupAudioUrl='/assets/audio/vi/cau43_music.wav';
      setLionPopupContent(
        'NGHE NHẠC CỤ!',
        'Nghe xong hãy chọn đáp án đúng',
        '🔊 Nghe lại'
      );
      document.getElementById('lion-overlay').classList.add('active');
      playAudioOnly(popupAudioUrl);
  }
}
function closeLionPopup(){
  const ov=document.getElementById('lion-overlay');
  if(ov)ov.classList.remove('active');
  stopLionSound();
  stopAudio();
  popupAudioUrl='';
  onMediaClosed();
}
function closeMedia(){document.getElementById('media-video').pause();document.getElementById('media-overlay').classList.remove('active');onMediaClosed();}
function revealAnswerFromMedia(){closeMedia();}
function onMediaClosed(){if(mediaReady)return;mediaReady=true;if(gameMode==='competition'&&!answerRevealed&&!countdownRunning){setTimeout(()=>startCountdown(),300);}}
` : ``}

function showResultPopup(){
  clearTimer();stopAudio();closeAnswer();
  const total=Q.length,correct=Object.values(answered).filter(v=>v===true).length;
  document.getElementById('popup-score-num').textContent=correct+'/'+total;
  const pct=Math.round((correct/total)*100);
  let msg=IS_EN?'🎉 Great job! 🎉':'🎉 Chúc mừng các bé! 🎉',sub='';
  if(pct>=80){msg=IS_EN?'🌟 Excellent! Amazing! 🌟':'🌟 Xuất sắc! Giỏi lắm! 🌟';sub=IS_EN?('You answered '+correct+' correctly — amazing!'):('Bé đã trả lời đúng '+correct+' câu — Tuyệt vời!');}
  else if(pct>=50){msg=IS_EN?'👏 Nice work! Keep going!':'👏 Tốt lắm! Cố gắng thêm nhé!';sub=IS_EN?('You answered '+correct+' correctly!'):('Bé đã trả lời đúng '+correct+' câu!');}
  else{msg=IS_EN?'💪 Keep trying! You can do it!':'💪 Cố gắng lên nhé bé ơi!';sub=IS_EN?'Practice a bit more to improve!':'Luyện tập thêm để tiến bộ hơn!';}
  document.getElementById('popup-msg').textContent=msg;
  document.getElementById('popup-sub').textContent=sub;
  document.getElementById('result-popup').classList.add('active');
  fireworks(20);setTimeout(()=>fireworks(15),800);
  if(IS_EN){
    speakText(TXT.finishedPrefix+correct+TXT.overWord+total+TXT.qWord+(pct>=80?TXT.excellent:pct>=50?TXT.good:TXT.keepTrying));
  }
}
function closeResultPopup(){document.getElementById('result-popup').classList.remove('active');}
function resetGame(){answered={};compScore=0;gameMode='practice';clearTimer();stopAudio();buildGrid();showGrid();}
function pikachuClick(){flashLightning();spawnParticles(window.innerWidth-50,window.innerHeight-60,12);playBeep(640,880,.4);const el=document.querySelector('.float-pika');el.style.transform='scale(2.2) rotate(20deg)';setTimeout(()=>el.style.transform='',500);}

if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{});}
document.getElementById('countdown-overlay').addEventListener('click',function(){this.classList.remove('active');document.getElementById('countdown-video').pause();});
document.addEventListener('keydown',e=>{
  const onQ=document.getElementById('screen-question').classList.contains('active');
  if(e.key==='Escape'){closeAnswer();${hasMedia?`closeMedia();closeLionPopup();`:''}closeResultPopup();document.getElementById('countdown-overlay').classList.remove('active');}
  if(e.key===' '&&onQ){e.preventDefault();startCountdown();}
  if(e.key==='Enter'&&onQ){e.preventDefault();revealAnswer();}
  if((e.key==='r'||e.key==='R')&&onQ){speakQuestion();}
  if(e.key==='Backspace'&&onQ){goBack();}
  if(e.key==='1'&&onQ)selectChoice(0);
  if(e.key==='2'&&onQ)selectChoice(1);
  if(e.key==='3'&&onQ)selectChoice(2);
});
showGrid();
`
}

export default app
