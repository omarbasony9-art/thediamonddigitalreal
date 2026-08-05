-- Diamond Digital — site_pages export
-- Generated: 2026-08-05T05:05:26.115Z
-- Source: Replit PostgreSQL → Cloudflare D1 (SQLite)
-- Rows: 24
-- Escaping: single quotes doubled (SQLite standard); driver-level fetch, no manual string parsing.

BEGIN;
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (1, 1, 'Home', '/', 'Hero section: LogiTrack — Real-time logistics intelligence for modern fleets. CTA: Start Free Trial.', 0, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (2, 1, 'Dashboard', '/dashboard', 'Main analytics dashboard with shipment tracking map, delivery stats, and fleet status overview.', 1, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (3, 1, 'Reports', '/reports', 'Detailed analytics and export tools for logistics performance reports.', 2, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (4, 3, 'Home', '/', 'Hero: Fresh ingredients, delivered weekly. Try Bite Bright — your first box 30% off. Pricing section with 3 tiers. Testimonials.', 0, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (5, 4, 'Home', '/', 'Welcome to Pacific Dental Group — Your Smile, Our Priority. Services overview and booking CTA.', 0, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (6, 4, 'Services', '/services', 'Comprehensive dental services: General Dentistry, Cosmetic Dentistry, Orthodontics, Implants.', 1, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (7, 4, 'Locations', '/locations', 'Three convenient locations across the Bay Area. Each with address, hours, and booking link.', 2, '2026-07-22T05:03:49.480Z', '2026-07-22T05:03:49.480Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (8, 6, 'index.html', 'index.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
</head>
<body>
  <header class="header">
    <div class="logo">My Brand</div>
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>Your website starts here. Edit the files on the left to make it yours.</p>
    <button class="btn" onclick="handleClick()">Get Started</button>
  </section>

  <section class="features">
    <div class="card"><h3>Fast</h3><p>Built for speed and performance.</p></div>
    <div class="card"><h3>Reliable</h3><p>Always online, always working.</p></div>
    <div class="card"><h3>Beautiful</h3><p>Designed to impress visitors.</p></div>
  </section>

  <footer>
    <p>&copy; 2026 My Website. All rights reserved.</p>
  </footer>
</body>
</html>', 0, '2026-07-22T05:54:33.683Z', '2026-07-22T05:54:33.683Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (9, 6, 'style.css', 'style.css', '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: ''Segoe UI'', system-ui, sans-serif;
  background: #0f0f1a;
  color: #e8e8f0;
  line-height: 1.6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: sticky; top: 0;
  backdrop-filter: blur(12px);
}

.logo { font-weight: 800; font-size: 1.1rem; color: #00cfff; letter-spacing: 1px; }

nav a { color: #aaa; text-decoration: none; margin-left: 1.5rem; font-size: .9rem; transition: color .2s; }
nav a:hover { color: #fff; }

.hero {
  text-align: center;
  padding: 6rem 2rem;
  background: radial-gradient(ellipse at 50% 0%, rgba(0,207,255,.08) 0%, transparent 60%);
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #00cfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p { color: #888; font-size: 1.1rem; margin-bottom: 2rem; }

.btn {
  background: #00cfff; color: #0f0f1a;
  border: none; padding: .85rem 2rem;
  font-size: .95rem; font-weight: 700; cursor: pointer;
  letter-spacing: .5px; transition: opacity .2s;
}
.btn:hover { opacity: .85; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem; max-width: 900px; margin: 0 auto; padding: 4rem 2rem;
}

.card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  padding: 2rem; border-radius: 2px;
}
.card h3 { color: #00cfff; margin-bottom: .5rem; }
.card p { color: #888; font-size: .9rem; }

footer {
  text-align: center; padding: 2rem; color: #555;
  border-top: 1px solid rgba(255,255,255,.06);
  font-size: .85rem; margin-top: 4rem;
}', 0, '2026-07-22T05:54:33.771Z', '2026-07-22T05:54:33.771Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (10, 6, 'script.js', 'script.js', '// Main JavaScript
console.log(''Site loaded!'');

function handleClick() {
  alert(''Welcome! Edit the files to build your site.'');
}

// Animate cards on scroll
document.addEventListener(''DOMContentLoaded'', () => {
  const cards = document.querySelectorAll(''.card'');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = ''1'';
        entry.target.style.transform = ''translateY(0)'';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = ''0'';
    card.style.transform = ''translateY(20px)'';
    card.style.transition = ''opacity 0.5s, transform 0.5s'';
    observer.observe(card);
  });
});', 0, '2026-07-22T05:54:33.871Z', '2026-07-22T05:54:33.871Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (11, 4, 'index.html', 'index.html', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="Discover beautifully engineered phones, accessories, and mobile support from NEXA."><title>NEXA — Made to Move</title><link rel="stylesheet" href="style.css"></head><body><div class="announcement">Free express delivery on every NEXA One order <button class="close-announcement" aria-label="Close announcement">×</button></div><header class="site-header"><a href="#home" class="logo" aria-label="NEXA home">NEXA<span>°</span></a><button class="nav-toggle" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button><nav class="main-nav"><a href="#phones">Phones</a><a href="#experience">Experience</a><a href="#accessories">Accessories</a><a href="#support">Support</a></nav><a class="header-cta" href="#phones">Shop phones <span>→</span></a></header><main><section class="hero" id="home"><div class="hero-copy"><p class="eyebrow">Introducing NEXA ONE</p><h1>Less phone.<br><em>More you.</em></h1><p class="hero-text">A powerful new way to stay close to what matters, without losing sight of everything else.</p><div class="hero-actions"><a class="button primary" href="#phones">Explore NEXA One <span>↗</span></a><a class="text-link" href="#experience">See what’s new <span>↓</span></a></div></div><div class="hero-device-wrap"><div class="halo halo-one"></div><div class="halo halo-two"></div><div class="phone phone-back"><div class="back-camera"><b></b><b></b><b></b></div><span class="device-mark">NEXA</span></div><div class="phone phone-front"><div class="screen"><div class="island"></div><div class="screen-time">09:41</div><div class="screen-orb orb-a"></div><div class="screen-orb orb-b"></div><div class="screen-orb orb-c"></div><div class="screen-ui"><span>Tuesday, June 24</span><strong>Make room<br>for wonder.</strong><div class="screen-pill"></div></div></div></div><p class="device-caption">Obsidian Black · 6.3″ edge display</p></div><div class="hero-scroll">Scroll to discover <span></span></div></section><section class="marquee"><div class="marquee-track"><span>Engineered for the everyday</span><b>✦</b><span>Made to move with you</span><b>✦</b><span>Engineered for the everyday</span><b>✦</b><span>Made to move with you</span><b>✦</b></div></section><section class="intro section"><div class="section-label">01 / The philosophy</div><div class="intro-content"><h2>Technology should<br>feel <em>human.</em></h2><p>We made NEXA One to quietly make your day better. It is fast when life is fast, calm when life is full, and always ready for the next brilliant thing.</p><a href="#experience" class="text-link dark">Our approach <span>→</span></a></div></section><section class="products section" id="phones"><div class="section-heading"><div><div class="section-label">02 / Choose your NEXA</div><h2>Find your <em>one.</em></h2></div><a href="#support" class="text-link dark">Compare all models <span>→</span></a></div><div class="product-grid"><article class="product-card featured"><div class="product-top"><span>Our latest</span><button class="favorite" aria-label="Save NEXA One">♡</button></div><div class="product-visual violet"><div class="mini-phone tilted-one"><div class="mini-island"></div></div><div class="mini-phone tilted-two back-mini"><div class="mini-camera"></div></div></div><div class="product-info"><h3>NEXA One</h3><p>All-day brilliance. Built to last.</p><div class="product-bottom"><strong>From $699</strong><a href="#shop" aria-label="Shop NEXA One">→</a></div></div></article><article class="product-card"><div class="product-top"><span>Pro performance</span><button class="favorite" aria-label="Save NEXA One Pro">♡</button></div><div class="product-visual sand"><div class="pro-phone"><div class="pro-cameras"><i></i><i></i><i></i></div><small>NEXA</small></div></div><div class="product-info"><h3>NEXA One Pro</h3><p>The most capable NEXA, ever.</p><div class="product-bottom"><strong>From $999</strong><a href="#shop" aria-label="Shop NEXA One Pro">→</a></div></div></article><article class="product-card"><div class="product-top"><span>Small, mighty</span><button class="favorite" aria-label="Save NEXA Mini">♡</button></div><div class="product-visual blue"><div class="mini-pro-phone"><div class="mini-island"></div><div class="blue-orb"></div></div></div><div class="product-info"><h3>NEXA Mini</h3><p>Everything you need. Less to hold.</p><div class="product-bottom"><strong>From $499</strong><a href="#shop" aria-label="Shop NEXA Mini">→</a></div></div></article></div></section><section class="feature-panel" id="experience"><div class="feature-copy"><div class="section-label light">03 / Built around life</div><h2>A camera that sees<br>what you <em>feel.</em></h2><p>From the smallest details to the biggest nights out, the NEXA camera system brings every memory closer to how it felt in the moment.</p><a href="#shop" class="button light-button">Explore the camera <span>↗</span></a></div><div class="camera-art"><div class="camera-sun"></div><div class="camera-mountain mountain-back"></div><div class="camera-mountain mountain-front"></div><div class="camera-phone"><div class="camera-lens l1"></div><div class="camera-lens l2"></div><div class="camera-lens l3"></div><div class="camera-flash"></div><span>NEXA</span></div><div class="camera-caption">50 MP / Natural light engine</div></div></section><section class="stats section"><div class="stat-intro"><div class="section-label">04 / Numbers worth knowing</div><h2>Big power,<br><em>thoughtfully used.</em></h2></div><div class="stat-grid"><div class="stat"><strong data-count="48" data-suffix=" hrs">0</strong><span>of battery life that keeps up</span></div><div class="stat"><strong data-count="50" data-suffix=" MP">0</strong><span>main camera with true-tone detail</span></div><div class="stat"><strong data-count="100" data-suffix="%">0</strong><span>recycled rare earth elements</span></div></div></section><section class="accessories section" id="accessories"><div class="accessory-art"><div class="case case-lilac"></div><div class="case case-clear"></div><div class="case case-sun"></div><div class="cable"></div></div><div class="accessory-copy"><div class="section-label">05 / Make it yours</div><h2>The details<br>make the <em>difference.</em></h2><p>Cases, chargers, and sound that fit your life—and look right at home in it.</p><a href="#shop" class="button primary">Shop accessories <span>↗</span></a></div></section><section class="newsletter" id="support"><div><p class="eyebrow">Stay in the loop</p><h2>Good things are<br>on the <em>line.</em></h2></div><form id="newsletter-form" novalidate><label for="email">Email address</label><div class="input-row"><input type="email" id="email" placeholder="you@example.com" required><button type="submit" aria-label="Subscribe">→</button></div><p class="form-message" aria-live="polite"></p><small>By subscribing, you agree to receive news and offers from NEXA.</small></form></section></main><footer><div class="footer-top"><a href="#home" class="logo">NEXA<span>°</span></a><p>Designed for the way<br>life really happens.</p><a href="#home" class="back-top">Back to top ↑</a></div><div class="footer-links"><div><span>Explore</span><a href="#phones">Phones</a><a href="#experience">NEXA One</a><a href="#accessories">Accessories</a></div><div><span>Help</span><a href="#support">Support center</a><a href="#support">Shipping & returns</a><a href="#support">Contact us</a></div><div><span>Follow</span><a href="#home">Instagram</a><a href="#home">YouTube</a><a href="#home">LinkedIn</a></div></div><div class="footer-bottom"><span>© 2025 NEXA Mobile, Inc.</span><span>Privacy &nbsp; Terms &nbsp; Accessibility</span></div></footer><script src="script.js"></script></body></html>', 0, '2026-07-22T06:12:34.381Z', '2026-07-22T06:12:34.381Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (12, 4, 'script.js', 'script.js', 'document.addEventListener(''DOMContentLoaded'',()=>{const toggle=document.querySelector(''.nav-toggle'');const nav=document.querySelector(''.main-nav'');toggle.addEventListener(''click'',()=>{const open=nav.classList.toggle(''open'');toggle.setAttribute(''aria-expanded'',open);toggle.setAttribute(''aria-label'',open?''Close menu'':''Open menu'')});document.querySelectorAll(''.main-nav a'').forEach(a=>a.addEventListener(''click'',()=>{nav.classList.remove(''open'');toggle.setAttribute(''aria-expanded'',''false'')}));document.querySelector(''.close-announcement'').addEventListener(''click'',e=>e.currentTarget.parentElement.style.display=''none'');document.querySelectorAll(''.favorite'').forEach(button=>button.addEventListener(''click'',()=>{const saved=button.textContent===''♥'';button.textContent=saved?''♡'':''♥'';button.style.color=saved?'''':''#7659c9''}));const counters=document.querySelectorAll(''[data-count]'');let counted=false;const animateCounters=()=>{if(counted)return;const stats=document.querySelector(''.stats'');if(stats.getBoundingClientRect().top<window.innerHeight*.8){counted=true;counters.forEach(el=>{const target=+el.dataset.count,suffix=el.dataset.suffix;let start=0;const duration=1300;const tick=time=>{if(!start)start=time;const progress=Math.min((time-start)/duration,1);el.textContent=Math.floor(progress*target)+suffix;if(progress<1)requestAnimationFrame(tick);else el.textContent=target+suffix};requestAnimationFrame(tick)})}};window.addEventListener(''scroll'',animateCounters);animateCounters();const form=document.getElementById(''newsletter-form'');const message=form.querySelector(''.form-message'');form.addEventListener(''submit'',e=>{e.preventDefault();const email=form.querySelector(''input'');if(!email.validity.valid){message.textContent=''Please enter a valid email address.'';message.style.color=''#ffd0d0'';email.focus();return}message.textContent=''You’re on the list. Welcome to NEXA.'';message.style.color=''#c5ff43'';form.reset()})});', 0, '2026-07-22T06:12:34.435Z', '2026-07-22T06:12:34.435Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (13, 4, 'style.css', 'style.css', '@import url(''https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap'');:root{--ink:#172321;--cream:#f7f5f0;--lime:#c5ff43;--purple:#6254d8;--muted:#6e7571;--line:#dcded7}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font-family:Manrope,Arial,sans-serif}a{color:inherit;text-decoration:none}.announcement{background:#172321;color:#f7f5f0;text-align:center;font:11px ''DM Mono'',monospace;letter-spacing:.04em;padding:11px 40px;position:relative}.close-announcement{position:absolute;right:22px;top:4px;border:0;background:transparent;color:white;font-size:22px;cursor:pointer}.site-header{height:83px;padding:0 4.8vw;display:flex;align-items:center;justify-content:space-between;position:absolute;top:35px;left:0;right:0;z-index:5}.logo{font-size:24px;font-weight:800;letter-spacing:-1.5px}.logo span{color:#805ee8}.main-nav{display:flex;gap:32px;margin-left:130px}.main-nav a,.header-cta{font-size:13px;font-weight:700}.main-nav a{opacity:.75;transition:opacity .2s}.main-nav a:hover{opacity:1}.header-cta{border-bottom:1px solid var(--ink);padding-bottom:3px}.header-cta span{margin-left:8px}.nav-toggle{display:none}.hero{background:#ddd4c5;min-height:760px;position:relative;overflow:hidden;padding:193px 9vw 70px;display:flex}.hero-copy{z-index:2;width:48%}.eyebrow,.section-label{font:11px ''DM Mono'',monospace;text-transform:uppercase;letter-spacing:.08em}.eyebrow{margin:0 0 24px}.hero h1,.intro h2,.section-heading h2,.feature-copy h2,.stat-intro h2,.accessory-copy h2,.newsletter h2{font-size:clamp(46px,6vw,89px);line-height:.96;letter-spacing:-.07em;margin:0;font-weight:600}.hero h1 em,h2 em{font-family:''Playfair Display'',serif;font-weight:500;letter-spacing:-.08em}.hero-text{font-size:15px;line-height:1.7;max-width:385px;margin:29px 0}.hero-actions{display:flex;align-items:center;gap:29px}.button{font-size:13px;font-weight:800;display:inline-block;padding:15px 19px;border-radius:2px;transition:transform .25s,box-shadow .25s}.button:hover{transform:translateY(-3px);box-shadow:4px 5px 0 rgba(23,35,33,.25)}.primary{background:var(--ink);color:#fff}.button span{margin-left:17px}.text-link{font-size:13px;font-weight:800;border-bottom:1px solid;padding-bottom:3px}.text-link span{margin-left:9px}.hero-device-wrap{position:absolute;right:5%;width:49%;height:100%;top:0}.halo{position:absolute;border-radius:50%;filter:blur(1px)}.halo-one{width:540px;height:540px;background:#d9f365;right:-95px;top:135px}.halo-two{height:330px;width:330px;background:#b29ce3;right:250px;top:395px;opacity:.75}.phone{position:absolute;border:8px solid #1d2021;border-radius:45px;box-shadow:18px 27px 29px #4f4b4461}.phone-front{height:550px;width:270px;right:115px;top:150px;transform:rotate(13deg);z-index:2;background:#222}.screen{height:100%;border-radius:35px;overflow:hidden;position:relative;background:linear-gradient(148deg,#381c63 3%,#855ec7 40%,#e49dbb 73%,#ffbd5d)}.island,.mini-island{position:absolute;background:#171717;border-radius:12px;top:11px;left:50%;transform:translateX(-50%);width:82px;height:22px}.screen-time{position:absolute;top:14px;left:21px;color:white;font-size:11px;font-weight:bold}.screen-orb{position:absolute;border-radius:50%;filter:blur(2px)}.orb-a{background:#f75f57;width:260px;height:260px;bottom:-58px;right:-89px}.orb-b{background:#ffc98a;width:200px;height:200px;top:100px;left:-110px}.orb-c{width:140px;height:180px;background:#5b3389;right:-25px;top:40px}.screen-ui{position:absolute;color:white;left:25px;bottom:30px}.screen-ui span{font-size:9px}.screen-ui strong{font-size:26px;line-height:1;letter-spacing:-1.5px;display:block;margin-top:6px}.screen-pill{width:85px;height:4px;border-radius:5px;background:white;margin-top:20px}.phone-back{height:515px;width:250px;right:335px;top:180px;background:linear-gradient(125deg,#393b3a,#121414);transform:rotate(-13deg)}.back-camera{position:absolute;top:19px;left:19px;width:96px;height:96px;border-radius:28px;background:#2a2c2b;padding:10px;display:grid;grid-template-columns:1fr 1fr;gap:5px}.back-camera b,.pro-cameras i,.camera-lens{border-radius:50%;background:#101313;border:3px solid #747a77;box-shadow:inset 0 0 0 3px #2d3838}.back-camera b:last-child{grid-column:1}.device-mark{color:#939694;font:10px ''DM Mono'';letter-spacing:4px;position:absolute;bottom:24px;left:82px;transform:rotate(-90deg)}.device-caption{position:absolute;bottom:27px;right:35px;font:10px ''DM Mono'';z-index:3}.hero-scroll{position:absolute;bottom:38px;left:4.8vw;font:10px ''DM Mono'';text-transform:uppercase;letter-spacing:.06em;display:flex;align-items:center;gap:11px}.hero-scroll span{width:42px;height:1px;background:var(--ink)}.marquee{overflow:hidden;background:var(--lime);padding:14px 0}.marquee-track{display:flex;width:max-content;gap:31px;align-items:center;animation:marquee 18s linear infinite;font-size:13px;font-weight:800;white-space:nowrap}.marquee-track b{font-size:19px}@keyframes marquee{to{transform:translateX(-30%)}}.section{padding:125px 9vw}.intro{display:grid;grid-template-columns:27% 1fr}.section-label{color:#6d736f}.intro-content h2{font-size:clamp(43px,5.4vw,74px)}.intro-content p{max-width:390px;line-height:1.8;font-size:15px;margin:28px 0}.dark{border-color:var(--ink)}.products{padding-top:45px}.section-heading{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px}.section-heading h2{font-size:clamp(45px,5vw,72px);margin-top:16px}.product-grid{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:16px}.product-card{background:#ecebe6;transition:transform .3s}.product-card:hover{transform:translateY(-8px)}.product-top{padding:19px 20px;display:flex;justify-content:space-between;font:10px ''DM Mono'';text-transform:uppercase}.favorite{border:0;background:none;font-size:20px;line-height:12px;cursor:pointer}.product-visual{height:310px;position:relative;overflow:hidden}.violet{background:#9e8de5}.sand{background:#cec0ab}.blue{background:#a9c3d3}.mini-phone{height:255px;width:127px;border:5px solid #222;border-radius:24px;position:absolute;background:linear-gradient(135deg,#905fdb,#e4a2d3 70%,#fee77a);box-shadow:8px 10px 16px #3c32664d}.tilted-one{left:33%;top:30px;transform:rotate(15deg);z-index:2}.tilted-two{left:53%;top:43px;transform:rotate(-17deg);background:#3e3a5b}.back-mini:after{content:'''';width:46px;height:46px;border-radius:13px;background:#29263b;position:absolute;top:10px;left:10px}.pro-phone{height:280px;width:145px;border:5px solid #5e5b52;border-radius:29px;background:linear-gradient(130deg,#e2d5bf,#b7a889);position:absolute;left:50%;top:23px;transform:translateX(-50%) rotate(-9deg);box-shadow:12px 12px 15px #403a3040}.pro-cameras{position:absolute;width:60px;height:60px;top:12px;left:12px;border-radius:16px;background:#ada18a;padding:6px;display:grid;grid-template-columns:1fr 1fr;gap:3px}.pro-cameras i{border-width:2px}.pro-cameras i:last-child{grid-column:1}.pro-phone small{position:absolute;bottom:19px;left:49px;letter-spacing:2px;font:7px ''DM Mono'';transform:rotate(-90deg)}.mini-pro-phone{height:265px;width:132px;position:absolute;left:50%;top:28px;transform:translateX(-50%) rotate(11deg);border:5px solid #1d282c;border-radius:28px;background:linear-gradient(145deg,#183b58,#70b4d0 58%,#c4dff0);overflow:hidden;box-shadow:9px 12px 18px #30444f59}.blue-orb{position:absolute;width:160px;height:160px;bottom:-30px;left:-40px;background:#ffc354;border-radius:50%;filter:blur(5px)}.product-info{padding:23px 21px 19px}.product-info h3{margin:0;font-size:19px;letter-spacing:-.7px}.product-info p{font-size:12px;color:#626965;margin:6px 0 25px}.product-bottom{display:flex;justify-content:space-between;align-items:center}.product-bottom strong{font-size:12px}.product-bottom a{background:var(--ink);color:#fff;width:29px;height:29px;border-radius:50%;display:grid;place-items:center;transition:background .2s}.product-bottom a:hover{background:#7659c9}.feature-panel{margin:0 4.8vw;background:#232f2b;color:#f5f2ec;min-height:625px;display:grid;grid-template-columns:48% 52%;overflow:hidden}.feature-copy{padding:97px 11%}.light{color:#b9c2ba}.feature-copy h2{font-size:clamp(42px,5vw,68px);margin:18px 0 25px}.feature-copy p{font-size:14px;line-height:1.8;color:#c3c9c4;max-width:380px;margin-bottom:33px}.light-button{color:var(--ink);background:var(--lime)}.camera-art{background:#d9ad79;position:relative;overflow:hidden}.camera-sun{position:absolute;width:330px;height:330px;background:#f9d9a4;border-radius:50%;right:-18px;top:53px}.camera-mountain{position:absolute;bottom:-20px;clip-path:polygon(0 100%,47% 10%,100% 100%)}.mountain-back{width:520px;height:250px;background:#836f67;left:-80px}.mountain-front{width:500px;height:210px;background:#584f4b;right:-80px}.camera-phone{height:410px;width:208px;background:linear-gradient(125deg,#596e57,#263934);border:6px solid #1b2420;border-radius:37px;position:absolute;bottom:-75px;left:34%;transform:rotate(19deg);box-shadow:14px 15px 22px #1e231f78}.camera-lens{position:absolute;width:45px;height:45px}.l1{top:15px;left:15px}.l2{top:15px;left:68px}.l3{top:68px;left:15px}.camera-flash{width:9px;height:9px;background:#d8d5c1;border-radius:50%;position:absolute;top:78px;left:78px}.camera-phone span{position:absolute;bottom:28px;left:88px;font:8px ''DM Mono'';letter-spacing:3px;color:#b7b9a8;transform:rotate(-90deg)}.camera-caption{font:10px ''DM Mono'';position:absolute;bottom:29px;right:26px}.stats{display:grid;grid-template-columns:39% 61%;padding-bottom:140px}.stat-intro h2{font-size:clamp(40px,4.3vw,62px);margin-top:18px}.stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:end}.stat{border-top:1px solid var(--ink);padding-top:18px}.stat strong{display:block;font:500 clamp(39px,4vw,57px)/1 ''Playfair Display'';letter-spacing:-.06em}.stat span{font-size:12px;line-height:1.5;display:block;margin-top:9px;max-width:135px}.accessories{background:#e6e4dd;display:grid;grid-template-columns:55% 45%;padding:0 9vw;min-height:610px}.accessory-art{position:relative;overflow:hidden;min-height:610px}.case{width:175px;height:330px;border-radius:31px;border:5px solid #504e50;position:absolute;bottom:82px;box-shadow:12px 15px 18px #66635d4f}.case:after{content:'''';position:absolute;top:14px;left:14px;width:64px;height:64px;background:#807c83;border-radius:18px}.case-lilac{background:#9e85d1;left:3%;transform:rotate(-20deg)}.case-clear{background:#d5d1c5cc;left:31%;bottom:117px;transform:rotate(4deg)}.case-sun{background:#e7ad63;left:59%;transform:rotate(22deg)}.cable{position:absolute;border:13px solid #617d7c;border-left-color:transparent;border-bottom-color:transparent;width:330px;height:250px;border-radius:50%;bottom:-70px;left:17%;transform:rotate(-20deg)}.accessory-copy{align-self:center}.accessory-copy h2{font-size:clamp(42px,4.8vw,66px);margin:18px 0 24px}.accessory-copy p{line-height:1.8;font-size:14px;max-width:340px;margin-bottom:31px}.newsletter{background:var(--purple);color:#fff;padding:100px 9vw;display:grid;grid-template-columns:1fr 1fr;gap:14%;align-items:center}.newsletter h2{font-size:clamp(42px,5vw,70px)}.newsletter .eyebrow{color:#dfdafa}.newsletter form{padding-top:15px}.newsletter label{font:11px ''DM Mono'';display:block;margin-bottom:10px}.input-row{border-bottom:1px solid #cbc7f2;display:flex}.input-row input{background:transparent;border:0;outline:0;color:#fff;font:16px Manrope;width:100%;padding:10px 0}.input-row input::placeholder{color:#cbc7e9}.input-row button{background:none;border:0;color:#fff;font-size:26px;cursor:pointer}.newsletter small{font-size:10px;color:#d6d3ed;line-height:1.6;display:block;margin-top:13px}.form-message{font-size:12px;min-height:18px;margin:10px 0 0;color:var(--lime)}footer{padding:62px 4.8vw 20px;background:#172321;color:#eef0e8}.footer-top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:68px}.footer-top p{font-size:15px;line-height:1.5;margin:0 0 0 10%}.back-top{font:11px ''DM Mono'';border-bottom:1px solid #89918a;padding-bottom:4px}.footer-links{border-top:1px solid #53605b;padding:28px 0 56px;display:grid;grid-template-columns:repeat(3,150px);gap:70px}.footer-links div{display:flex;flex-direction:column;gap:11px}.footer-links span{font:10px ''DM Mono'';color:#8e9790;text-transform:uppercase;margin-bottom:4px}.footer-links a{font-size:12px}.footer-links a:hover{color:var(--lime)}.footer-bottom{border-top:1px solid #53605b;padding-top:19px;display:flex;justify-content:space-between;color:#9aa49c;font:10px ''DM Mono''}@media(max-width:800px){.site-header{height:64px;top:35px;padding:0 6vw}.main-nav,.header-cta{display:none}.nav-toggle{display:block;width:36px;height:25px;border:0;background:none;padding:4px;cursor:pointer}.nav-toggle i{display:block;height:2px;background:var(--ink);margin:5px 0;transition:.2s}.main-nav.open{display:flex;position:absolute;top:64px;left:0;right:0;margin:0;background:#e5ddcf;padding:24px 6vw;flex-direction:column;gap:19px}.hero{min-height:760px;padding:135px 7vw 0}.hero-copy{width:100%}.hero h1{font-size:57px}.hero-text{max-width:290px}.hero-device-wrap{right:-28%;top:270px;width:92%;transform:scale(.78);transform-origin:top center}.hero-scroll{left:7vw;bottom:20px}.device-caption{display:none}.intro,.stats{grid-template-columns:1fr;gap:35px}.section{padding:82px 7vw}.section-heading{align-items:start}.section-heading .text-link{display:none}.product-grid{grid-template-columns:1fr;gap:18px}.product-visual{height:285px}.feature-panel{margin:0;display:block}.feature-copy{padding:76px 7vw}.camera-art{height:440px}.camera-phone{left:27%}.stat-grid{gap:26px;margin-top:2px}.accessories{display:flex;flex-direction:column-reverse;padding:70px 7vw 0}.accessory-art{min-height:390px;margin-top:25px}.case{transform:scale(.8)}.case-lilac{left:-10%}.case-clear{left:26%}.case-sun{left:58%}.newsletter{padding:75px 7vw;grid-template-columns:1fr;gap:32px}.footer-top{padding-bottom:45px;flex-wrap:wrap;gap:25px}.footer-top p{margin:0;width:100%;order:3}.footer-links{grid-template-columns:repeat(3,1fr);gap:15px}.footer-bottom{gap:15px;line-height:1.6}.announcement{font-size:9px}.close-announcement{right:9px}}@media(max-width:430px){.stats .stat-grid{grid-template-columns:1fr 1fr}.stats .stat:last-child{grid-column:span 2}.hero-actions{gap:15px}.button{padding:14px 12px}.text-link{font-size:11px}.footer-links{grid-template-columns:1fr 1fr}.product-visual{height:255px}}', 0, '2026-07-22T06:12:34.481Z', '2026-07-22T06:12:34.481Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (14, 1, 'index.html', 'index.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="DUDE is a creative digital studio building memorable brands, websites, and products.">
  <title>DUDE — Creative Digital Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="grain"></div>

  <header class="site-header">
    <a href="#home" class="logo" aria-label="DUDE home">DUDE<span>®</span></a>

    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#work">Work</a>
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#journal">Journal</a>
    </nav>

    <a href="#contact" class="header-cta">Let''s talk <span>↗</span></a>

    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">
      <span></span>
      <span></span>
    </button>
  </header>

  <div class="mobile-menu">
    <nav aria-label="Mobile navigation">
      <a href="#home">Home <span>01</span></a>
      <a href="#work">Work <span>02</span></a>
      <a href="#services">Services <span>03</span></a>
      <a href="#about">About <span>04</span></a>
      <a href="#journal">Journal <span>05</span></a>
      <a href="#contact">Contact <span>06</span></a>
    </nav>
    <p>New York · London · Everywhere</p>
  </div>

  <main>
    <section class="hero" id="home">
      <div class="hero-topline">
        <p>Independent creative studio</p>
        <p>Est. 2016 — Worldwide</p>
      </div>

      <div class="hero-content">
        <p class="eyebrow">Make it matter.</p>
        <h1>Ideas with<br><em>some damn</em><br>personality.</h1>
        <div class="hero-bottom">
          <p>We build brands and digital experiences that make people stop, look twice, and remember.</p>
          <a href="#work" class="round-arrow" aria-label="Explore our work">↓</a>
        </div>
      </div>

      <div class="hero-shape shape-one"></div>
      <div class="hero-shape shape-two"></div>
      <div class="hero-sticker">GOOD<br>IDEAS<br>ONLY</div>
    </section>

    <section class="marquee-section" aria-label="Creative services">
      <div class="marquee">
        <div class="marquee-track">
          <span>Branding</span><i>✦</i>
          <span>Web Design</span><i>✦</i>
          <span>Digital Products</span><i>✦</i>
          <span>Creative Direction</span><i>✦</i>
          <span>Branding</span><i>✦</i>
          <span>Web Design</span><i>✦</i>
          <span>Digital Products</span><i>✦</i>
          <span>Creative Direction</span><i>✦</i>
        </div>
      </div>
    </section>

    <section class="work section-padding" id="work">
      <div class="section-head fade-in">
        <div>
          <p class="eyebrow">Selected work / 2023—24</p>
          <h2>Made to be<br>noticed.</h2>
        </div>
        <p class="section-intro">We partner with restless founders and ambitious teams who are done blending in.</p>
      </div>

      <div class="project-grid">
        <article class="project project-large fade-in">
          <a href="#contact" class="project-image project-luma">
            <div class="project-orb orb-blue"></div>
            <span class="image-wordmark">LUMA</span>
            <span class="project-view">View case study ↗</span>
          </a>
          <div class="project-meta">
            <div>
              <h3>Luma Energy</h3>
              <p>Brand strategy · Identity · Web</p>
            </div>
            <span>01</span>
          </div>
        </article>

        <article class="project project-small fade-in">
          <a href="#contact" class="project-image project-sundays">
            <div class="sun-card">
              <span>slow down.<br>stay awhile.</span>
              <strong>SUNDAYS</strong>
              <i>☼</i>
            </div>
            <span class="project-view">View case study ↗</span>
          </a>
          <div class="project-meta">
            <div>
              <h3>Sundays Hotel</h3>
              <p>Positioning · Art direction · Digital</p>
            </div>
            <span>02</span>
          </div>
        </article>

        <article class="project project-small fade-in">
          <a href="#contact" class="project-image project-field">
            <div class="field-device">
              <div class="device-top">FIELD NOTES</div>
              <div class="device-number">78°</div>
              <div class="device-bottom">PROTECT WHAT<br>YOU LOVE.</div>
            </div>
            <span class="project-view">View case study ↗</span>
          </a>
          <div class="project-meta">
            <div>
              <h3>Field Works</h3>
              <p>Campaign · E-commerce · Packaging</p>
            </div>
            <span>03</span>
          </div>
        </article>

        <article class="project project-large fade-in">
          <a href="#contact" class="project-image project-afters">
            <div class="afters-title">after<span>s</span></div>
            <div class="afters-circle"></div>
            <p>THE NIGHT<br>IS STILL YOUNG</p>
            <span class="project-view">View case study ↗</span>
          </a>
          <div class="project-meta">
            <div>
              <h3>Afters Studio</h3>
              <p>Identity · Editorial · Online store</p>
            </div>
            <span>04</span>
          </div>
        </article>
      </div>

      <a href="#contact" class="text-link fade-in">See all the good stuff <span>→</span></a>
    </section>

    <section class="services" id="services">
      <div class="services-intro fade-in">
        <p class="eyebrow">What we do</p>
        <h2>Big thinking.<br><em>Zero beige.</em></h2>
        <p>From first spark to final pixel, we bring focus, feeling, and a healthy disregard for the expected.</p>
      </div>

      <div class="service-list">
        <article class="service-item fade-in">
          <span class="service-number">01</span>
          <h3>Brand<br>Foundations</h3>
          <p>Strategy, naming, visual identity, voice, and the conviction to use them well.</p>
          <span class="service-icon">↗</span>
        </article>
        <article class="service-item fade-in">
          <span class="service-number">02</span>
          <h3>Digital<br>Experiences</h3>
          <p>Websites and products with thoughtful journeys, sharp interfaces, and real personality.</p>
          <span class="service-icon">↗</span>
        </article>
        <article class="service-item fade-in">
          <span class="service-number">03</span>
          <h3>Campaigns &<br>Content</h3>
          <p>Creative platforms and stories that give people something worth talking about.</p>
          <span class="service-icon">↗</span>
        </article>
      </div>
    </section>

    <section class="about section-padding" id="about">
      <div class="about-copy fade-in">
        <p class="eyebrow">A little about us</p>
        <h2>Small team.<br>Wide <em>angle.</em></h2>
        <p class="lead">DUDE is an independent studio for people making a meaningful dent in the universe.</p>
        <p>We are designers, writers, strategists, developers, and occasional overthinkers. We work closely, ask better questions, and care far too much about the details. It makes for work with a pulse.</p>
        <a href="#contact" class="text-link">Meet the humans <span>→</span></a>
      </div>

      <div class="about-visual fade-in">
        <div class="photo-frame">
          <div class="photo-sun"></div>
          <div class="photo-person person-one"></div>
          <div class="photo-person person-two"></div>
          <div class="photo-person person-three"></div>
          <div class="photo-caption">The DUDE crew,<br>somewhere sunny.</div>
        </div>
        <div class="scribble">Nice<br>to meet<br>you! <span>→</span></div>
      </div>
    </section>

    <section class="numbers">
      <div class="number-card fade-in">
        <strong>08</strong>
        <span>Years making<br>noise</span>
      </div>
      <div class="number-card fade-in">
        <strong>117</strong>
        <span>Projects launched<br>into the wild</span>
      </div>
      <div class="number-card fade-in">
        <strong>14</strong>
        <span>Countries we''ve<br>worked across</span>
      </div>
      <div class="number-card fade-in">
        <strong>∞</strong>
        <span>Cups of coffee<br>(give or take)</span>
      </div>
    </section>

    <section class="journal section-padding" id="journal">
      <div class="section-head fade-in">
        <div>
          <p class="eyebrow">From the notebook</p>
          <h2>Thoughts,<br>unfiltered.</h2>
        </div>
        <a href="#contact" class="text-link">Read all notes <span>→</span></a>
      </div>

      <div class="article-list">
        <article class="article fade-in">
          <a href="#contact">
            <div class="article-tag">Perspective</div>
            <h3>Why a distinct point of view is your brand''s best investment.</h3>
            <div class="article-foot"><span>06.12.24</span><span>Read note ↗</span></div>
          </a>
        </article>
        <article class="article article-accent fade-in">
          <a href="#contact">
            <div class="article-tag">Process</div>
            <h3>The difference between a logo and an identity system.</h3>
            <div class="article-foot"><span>22.10.24</span><span>Read note ↗</span></div>
          </a>
        </article>
        <article class="article fade-in">
          <a href="#contact">
            <div class="article-tag">Culture</div>
            <h3>Making room for weird ideas in a serious business.</h3>
            <div class="article-foot"><span>18.09.24</span><span>Read note ↗</span></div>
          </a>
        </article>
      </div>
    </section>

    <section class="contact" id="contact">
      <div class="contact-star">✦</div>
      <p class="eyebrow">Have a good one?</p>
      <h2>Let''s make<br>it <em>real.</em></h2>
      <p>Tell us what you''re building, where you''re stuck, or just say hello. We answer every good email.</p>
      <a class="contact-email" href="mailto:hello@dude.studio">hello@dude.studio <span>↗</span></a>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-top">
      <a href="#home" class="logo">DUDE<span>®</span></a>
      <p>New York · London · Working everywhere</p>
      <div class="social-links">
        <a href="#contact">Instagram</a>
        <a href="#contact">LinkedIn</a>
        <a href="#contact">Behance</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 DUDE Studio. All good things reserved.</p>
      <a href="#home">Back to top ↑</a>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>', 0, '2026-07-22T10:01:06.133Z', '2026-07-22T10:05:13.622Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (15, 1, 'script.js', 'script.js', 'document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  fadeElements.forEach((element) => observer.observe(element));

  document.querySelectorAll(''a[href^="#"]'').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});', 0, '2026-07-22T10:01:06.224Z', '2026-07-22T10:05:13.664Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (16, 1, 'style.css', 'style.css', ':root {
  --ink: #17201d;
  --paper: #f6f1e8;
  --lime: #dfff47;
  --coral: #ff674d;
  --blue: #91b7ff;
  --orange: #fa8c3e;
  --line: rgba(23, 32, 29, 0.18);
  --mono: "DM Mono", monospace;
  --sans: "Manrope", sans-serif;
  --serif: "Playfair Display", serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--sans);
  overflow-x: hidden;
}
body.menu-open { overflow: hidden; }
a { color: inherit; text-decoration: none; }
button { font: inherit; }
.grain {
  position: fixed;
  z-index: 20;
  inset: 0;
  opacity: .055;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox=''0 0 180 180'' xmlns=''http://www.w3.org/2000/svg''%3E%3Cfilter id=''n''%3E%3CfeTurbulence type=''fractalNoise'' baseFrequency=''.9'' numOctaves=''4'' stitchTiles=''stitch''/%3E%3C/filter%3E%3Crect width=''100%25'' height=''100%25'' filter=''url(%23n)'' opacity=''.8''/%3E%3C/svg%3E");
}
.site-header {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4.5vw;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 15;
}
.logo {
  font-size: 1.75rem;
  letter-spacing: -.12em;
  font-weight: 800;
  line-height: 1;
}
.logo span { font: 400 .46rem var(--mono); vertical-align: top; margin-left: 3px; letter-spacing: 0; }
.desktop-nav { display: flex; gap: clamp(18px, 2.6vw, 46px); }
.desktop-nav a, .header-cta {
  font-size: .78rem;
  font-weight: 700;
  transition: opacity .25s ease;
}
.desktop-nav a:hover { opacity: .5; }
.header-cta { border-bottom: 1px solid var(--ink); padding-bottom: 4px; }
.header-cta span { font-size: 1rem; margin-left: 5px; }
.menu-toggle { display: none; background: none; border: 0; width: 38px; padding: 8px 0; cursor: pointer; }
.menu-toggle span { display: block; height: 2px; background: var(--ink); margin: 6px 0; transition: transform .3s ease; }

.hero {
  min-height: 730px;
  height: 100vh;
  max-height: 960px;
  position: relative;
  overflow: hidden;
  padding: 123px 4.5vw 48px;
  background: var(--lime);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hero-topline { display: flex; justify-content: space-between; position: relative; z-index: 2; }
.hero-topline p, .eyebrow {
  font: 500 .65rem var(--mono);
  text-transform: uppercase;
  letter-spacing: .08em;
  margin: 0;
}
.hero-content { position: relative; z-index: 2; }
.hero-content .eyebrow { margin-bottom: 20px; }
h1, h2, h3, p { margin-top: 0; }
h1 {
  font-size: clamp(4.1rem, 10.3vw, 10rem);
  letter-spacing: -.09em;
  line-height: .83;
  margin-bottom: clamp(36px, 6vw, 72px);
  font-weight: 800;
}
h1 em, h2 em { font-family: var(--serif); font-weight: 600; letter-spacing: -.08em; }
.hero-bottom { display: flex; justify-content: space-between; align-items: end; }
.hero-bottom p { max-width: 325px; line-height: 1.45; font-size: .92rem; margin-bottom: 0; }
.round-arrow {
  border: 1px solid var(--ink);
  width: 66px; height: 66px;
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 1.65rem;
  transition: background .25s, transform .25s;
}
.round-arrow:hover { background: var(--ink); color: var(--lime); transform: rotate(-15deg); }
.hero-shape { position: absolute; border-radius: 50%; opacity: .95; }
.shape-one { width: 30vw; height: 30vw; right: 9%; top: 14%; background: var(--coral); }
.shape-two { width: 16vw; height: 16vw; right: 31%; bottom: -5%; background: var(--blue); }
.hero-sticker {
  position: absolute; z-index: 3; right: 18%; top: 27%;
  width: 92px; height: 92px; border-radius: 50%;
  background: var(--ink); color: var(--lime); display: grid; place-items: center;
  text-align: center; font: 500 .63rem/1.15 var(--mono); letter-spacing: .04em;
  transform: rotate(12deg);
}

.marquee-section { background: var(--ink); color: var(--paper); overflow: hidden; padding: 20px 0 22px; }
.marquee { width: max-content; animation: scroll 25s linear infinite; }
.marquee-track { display: flex; align-items: center; gap: 26px; white-space: nowrap; }
.marquee span { font: 800 clamp(1.6rem, 3vw, 3rem)/1 var(--sans); letter-spacing: -.06em; }
.marquee i { color: var(--lime); font-style: normal; font-size: 1.5rem; }
@keyframes scroll { to { transform: translateX(-50%); } }

.section-padding { padding: 140px 4.5vw; }
.section-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 76px; }
h2 { font-size: clamp(3.1rem, 7vw, 7.5rem); line-height: .87; letter-spacing: -.09em; margin: 17px 0 0; }
.section-intro { max-width: 260px; font-size: .95rem; line-height: 1.5; margin: 0 9vw 8px 0; }
.project-grid { display: grid; grid-template-columns: 1.18fr .82fr; gap: 70px 3.5vw; }
.project:nth-child(3) { margin-top: -10vw; }
.project-image { overflow: hidden; height: 520px; display: block; position: relative; }
.project-small .project-image { height: 390px; }
.project-view {
  position: absolute; right: 18px; bottom: 18px; background: var(--paper);
  color: var(--ink); padding: 12px 14px; font: 500 .63rem var(--mono);
  text-transform: uppercase; opacity: 0; transform: translateY(10px); transition: .3s ease;
}
.project-image:hover .project-view { opacity: 1; transform: translateY(0); }
.project-luma { background: #4d5eeb; display: grid; place-items: center; }
.image-wordmark { color: #dfffb4; font-size: clamp(4rem, 10vw, 9rem); letter-spacing: -.11em; font-weight: 800; z-index: 1; }
.project-orb { position: absolute; border-radius: 50%; width: 52%; aspect-ratio: 1; right: 10%; top: 12%; background: linear-gradient(140deg, #dfff47, #23bda3); filter: blur(1px); }
.project-sundays { background: #f6a80c; display: grid; place-items: center; }
.sun-card { background: #f7e7cf; width: 57%; height: 70%; box-shadow: 11px 11px 0 rgba(23,32,29,.22); padding: 15px; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
.sun-card span { font: 500 .55rem var(--mono); }
.sun-card strong { font-size: clamp(1.7rem, 3vw, 3.3rem); letter-spacing: -.1em; }
.sun-card i { font-size: 4rem; font-style: normal; align-self: end; }
.project-field { background: #d8e6cf; display: grid; place-items: center; }
.field-device { width: 50%; height: 77%; background: #1c3931; color: #eaffc0; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 9px 11px 0 #f46b3d; transform: rotate(5deg); }
.device-top, .device-bottom { font: .53rem var(--mono); letter-spacing: .08em; }
.device-number { font: 800 clamp(3rem, 7vw, 6rem)/1 var(--sans); letter-spacing: -.1em; }
.project-afters { background: #e84858; color: #ffecce; padding: 10%; }
.afters-title { font: 800 clamp(4rem, 9vw, 9rem)/.8 var(--sans); letter-spacing: -.12em; position: relative; z-index: 1; }
.afters-title span { font-family: var(--serif); font-style: italic; }
.afters-circle { position: absolute; width: 46%; aspect-ratio: 1; background: #ffdf47; border-radius: 50%; right: 11%; top: 20%; }
.project-afters p { font: 600 .68rem/1.2 var(--mono); position: absolute; bottom: 12%; left: 10%; }
.project-meta { display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--ink); margin-top: 15px; }
.project-meta h3 { font-size: 1rem; letter-spacing: -.04em; margin: 0 0 6px; }
.project-meta p, .project-meta > span { font: .6rem var(--mono); text-transform: uppercase; letter-spacing: .03em; margin: 0; }
.text-link { display: inline-block; font-size: .83rem; font-weight: 800; border-bottom: 1px solid var(--ink); padding-bottom: 6px; margin-top: 72px; }
.text-link span { font-size: 1.2rem; margin-left: 12px; transition: margin .25s; }
.text-link:hover span { margin-left: 19px; }

.services { background: var(--coral); padding: 132px 4.5vw 0; }
.services-intro { display: grid; grid-template-columns: 1fr 1.5fr 1fr; align-items: end; padding-bottom: 90px; }
.services-intro h2 { grid-column: 2; }
.services-intro > p:last-child { font-size: .9rem; line-height: 1.55; margin: 0; }
.service-list { border-top: 1px solid var(--ink); display: grid; grid-template-columns: repeat(3, 1fr); }
.service-item { min-height: 330px; padding: 25px 2vw 35px 0; position: relative; border-right: 1px solid var(--ink); display: flex; flex-direction: column; }
.service-item + .service-item { padding-left: 2vw; }
.service-item:last-child { border: 0; }
.service-number { font: .63rem var(--mono); }
.service-item h3 { font-size: clamp(1.8rem, 3vw, 3.2rem); letter-spacing: -.08em; line-height: .9; margin: auto 0 20px; }
.service-item p { font-size: .82rem; line-height: 1.45; max-width: 215px; margin: 0; }
.service-icon { position: absolute; right: 20px; top: 24px; font-size: 1.3rem; }

.about { display: grid; grid-template-columns: .92fr 1.08fr; gap: 11vw; align-items: center; }
.about-copy .lead { font-size: 1.18rem; line-height: 1.35; font-weight: 600; margin: 46px 0 20px; max-width: 415px; }
.about-copy > p:not(.eyebrow):not(.lead) { font-size: .9rem; line-height: 1.55; max-width: 400px; }
.about-copy .text-link { margin-top: 37px; }
.about-visual { position: relative; }
.photo-frame { height: 525px; background: var(--blue); position: relative; overflow: hidden; }
.photo-sun { width: 150px; height: 150px; position: absolute; border-radius: 50%; background: var(--lime); top: 62px; right: 18%; }
.photo-person { position: absolute; bottom: 0; width: 31%; border-radius: 50% 50% 0 0; }
.person-one { left: 6%; height: 61%; background: #f36d55; }
.person-two { left: 35%; height: 79%; background: #1a3633; }
.person-three { right: 6%; height: 55%; background: #f6c547; }
.photo-caption { position: absolute; bottom: 16px; left: 18px; font: .59rem/1.35 var(--mono); color: white; }
.scribble { position: absolute; color: var(--coral); right: -50px; top: -45px; font: 600 1.4rem/.9 var(--serif); transform: rotate(13deg); }
.scribble span { font-family: var(--sans); }

.numbers { background: var(--ink); color: var(--paper); display: grid; grid-template-columns: repeat(4, 1fr); padding: 0 4.5vw; }
.number-card { min-height: 250px; padding: 33px 2vw; border-right: 1px solid #5a605e; display: flex; flex-direction: column; justify-content: space-between; }
.number-card:last-child { border-right: 0; }
.number-card strong { color: var(--lime); font-size: clamp(3.4rem, 6vw, 6.2rem); letter-spacing: -.1em; line-height: .8; }
.number-card span { font: .67rem/1.4 var(--mono); text-transform: uppercase; }

.journal .section-head { margin-bottom: 44px; }
.journal .text-link { margin: 0 9vw 8px 0; }
.article-list { border-top: 1px solid var(--ink); }
.article { border-bottom: 1px solid var(--ink); transition: background .3s; }
.article:hover { background: var(--lime); }
.article a { display: grid; grid-template-columns: 18% 1fr 18%; align-items: center; min-height: 148px; padding: 20px 1vw; }
.article-tag, .article-foot { font: .61rem var(--mono); text-transform: uppercase; letter-spacing: .04em; }
.article h3 { font-size: clamp(1.3rem, 2.5vw, 2.6rem); letter-spacing: -.07em; max-width: 680px; margin: 0; line-height: 1; }
.article-foot { display: flex; flex-direction: column; gap: 20px; align-items: start; }
.article-accent { background: var(--blue); }
.article-accent:hover { background: #b1cbff; }

.contact { background: var(--lime); padding: 132px 4.5vw 143px; position: relative; overflow: hidden; }
.contact > p:not(.eyebrow) { max-width: 350px; font-size: .95rem; line-height: 1.5; margin: 40px 0; position: relative; z-index: 1; }
.contact-email { border-bottom: 2px solid var(--ink); padding-bottom: 8px; font-size: clamp(1.3rem, 2.7vw, 2.6rem); letter-spacing: -.06em; font-weight: 800; position: relative; z-index: 1; }
.contact-email span { margin-left: 11px; }
.contact-star { position: absolute; right: 10%; top: -15%; color: var(--coral); font-size: min(35vw, 430px); line-height: 1; transform: rotate(18deg); }

.site-footer { background: var(--ink); color: var(--paper); padding: 42px 4.5vw 25px; }
.footer-top { display: flex; align-items: center; justify-content: space-between; padding-bottom: 76px; }
.footer-top > p, .social-links a, .footer-bottom { font: .62rem var(--mono); text-transform: uppercase; letter-spacing: .04em; }
.social-links { display: flex; gap: 24px; }
.social-links a { border-bottom: 1px solid transparent; padding-bottom: 3px; }
.social-links a:hover { border-color: var(--paper); }
.footer-bottom { border-top: 1px solid #515957; padding-top: 22px; display: flex; justify-content: space-between; }
.footer-bottom p { margin: 0; }

.mobile-menu { display: none; }

.fade-in { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 760px) {
  .site-header { height: 70px; padding: 0 22px; }
  .desktop-nav, .header-cta { display: none; }
  .menu-toggle { display: block; position: relative; z-index: 25; }
  body.menu-open .menu-toggle span:first-child { transform: translateY(4px) rotate(45deg); }
  body.menu-open .menu-toggle span:last-child { transform: translateY(-4px) rotate(-45deg); }
  .mobile-menu { display: flex; background: var(--lime); position: fixed; z-index: 14; inset: 0; padding: 104px 22px 27px; justify-content: space-between; flex-direction: column; clip-path: inset(0 0 100% 0); transition: clip-path .45s cubic-bezier(.77,0,.18,1); }
  body.menu-open .mobile-menu { clip-path: inset(0); }
  .mobile-menu nav { display: flex; flex-direction: column; }
  .mobile-menu nav a { font-weight: 800; letter-spacing: -.07em; font-size: clamp(2.3rem, 11vw, 4rem); padding: 8px 0; border-bottom: 1px solid var(--ink); display: flex; justify-content: space-between; }
  .mobile-menu nav span, .mobile-menu > p { font: .59rem var(--mono); letter-spacing: .04em; align-self: center; }
  .mobile-menu > p { margin: 0; text-transform: uppercase; }
  .hero { min-height: 690px; padding: 103px 22px 30px; }
  .hero-topline p:last-child { display: none; }
  h1 { font-size: clamp(3.85rem, 17vw, 6.3rem); line-height: .84; }
  .hero-bottom p { max-width: 220px; font-size: .8rem; }
  .round-arrow { width: 54px; height: 54px; flex: 0 0 auto; }
  .shape-one { width: 63vw; height: 63vw; right: -13%; top: 18%; }
  .shape-two { width: 40vw; height: 40vw; bottom: -4%; right: 23%; }
  .hero-sticker { width: 71px; height: 71px; right: 18%; top: 23%; font-size: .5rem; }
  .section-padding { padding: 82px 22px; }
  .section-head { display: block; margin-bottom: 46px; }
  .section-intro { margin: 27px 0 0; max-width: 300px; }
  h2 { font-size: clamp(3rem, 14vw, 5rem); }
  .project-grid { display: block; }
  .project { margin-bottom: 50px; }
  .project:nth-child(3) { margin-top: 0; }
  .project-image, .project-small .project-image { height: 420px; }
  .project-small .project-image { height: 340px; }
  .text-link { margin-top: 15px; }
  .services { padding: 83px 22px 0; }
  .services-intro { display: block; padding-bottom: 58px; }
  .services-intro h2 { margin: 17px 0 30px; }
  .services-intro > p:last-child { max-width: 300px; }
  .service-list { display: block; }
  .service-item, .service-item + .service-item { padding: 22px 0 32px; min-height: 245px; border-right: 0; border-bottom: 1px solid var(--ink); }
  .service-item h3 { font-size: 2.4rem; margin: auto 0 18px; }
  .about { display: block; }
  .about-visual { margin-top: 68px; }
  .photo-frame { height: 405px; }
  .scribble { right: -8px; top: -44px; }
  .numbers { grid-template-columns: 1fr 1fr; padding: 0 22px; }
  .number-card { min-height: 190px; padding: 24px 12px; border-bottom: 1px solid #515957; }
  .number-card:nth-child(2) { border-right: 0; }
  .number-card strong { font-size: 3.6rem; }
  .journal .text-link { margin: 27px 0 0; }
  .article a { display: block; min-height: 0; padding: 24px 0; }
  .article h3 { margin: 19px 0 29px; font-size: 1.75rem; }
  .article-foot { flex-direction: row; justify-content: space-between; }
  .contact { padding: 85px 22px 96px; }
  .contact-star { right: -14%; top: -6%; font-size: 66vw; }
  .footer-top { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding-bottom: 44px; }
  .footer-top > p { grid-column: span 2; order: 3; line-height: 1.5; }
  .social-links { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .footer-bottom { display: block; line-height: 1.6; }
  .footer-bottom a { display: inline-block; margin-top: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .marquee { animation: none; }
  .fade-in { opacity: 1; transform: none; transition: none; }
}', 0, '2026-07-22T10:01:06.277Z', '2026-07-22T10:05:13.665Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (17, 2, 'index.html', 'index.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="logo">My Brand</div>
    <nav>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>Describe your website to the AI on the left and watch it come to life in seconds.</p>
    <button class="btn">Get Started</button>
  </section>
  <footer><p>&copy; 2026 My Website</p></footer>
  <script src="script.js"></script>
</body>
</html>', 0, '2026-07-22T10:11:18.041Z', '2026-07-22T10:11:18.041Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (18, 2, 'style.css', 'style.css', '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: ''Segoe UI'', system-ui, sans-serif; background: #0f0f1a; color: #e8e8f0; line-height: 1.6; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; background: rgba(255,255,255,.03); border-bottom: 1px solid rgba(255,255,255,.08); position: sticky; top: 0; backdrop-filter: blur(12px); }
.logo { font-weight: 800; font-size: 1.1rem; color: #00cfff; letter-spacing: 1px; }
nav a { color: #aaa; text-decoration: none; margin-left: 1.5rem; transition: color .2s; }
nav a:hover { color: #fff; }
.hero { text-align: center; padding: 6rem 2rem; }
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, #00cfff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { color: #888; font-size: 1.1rem; margin-bottom: 2rem; }
.btn { background: #00cfff; color: #0f0f1a; border: none; padding: .85rem 2rem; font-size: .95rem; font-weight: 700; cursor: pointer; border-radius: 4px; }
.btn:hover { opacity: .85; }
footer { text-align: center; padding: 2rem; color: #555; border-top: 1px solid rgba(255,255,255,.06); }', 0, '2026-07-22T10:11:18.129Z', '2026-07-22T10:11:18.129Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (19, 2, 'script.js', 'script.js', 'console.log(''Site loaded!'');', 0, '2026-07-22T10:11:18.210Z', '2026-07-22T10:11:18.210Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (20, 5, 'index.html', 'index.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Jersey Quik Fix Management System — one connected workspace for sales, repairs, inventory, customers, scheduling, and operations.">
  <title>Jersey Quik Fix | Smarter Store Management</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="page-orb orb-one"></div>
  <div class="page-orb orb-two"></div>

  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Jersey Quik Fix home">
      <span class="brand-mark">JQ</span>
      <span>Jersey <strong>Quik Fix</strong><small>MANAGEMENT SYSTEM</small></span>
    </a>

    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="main-nav" aria-label="Primary navigation">
      <a class="active" href="index.html">Overview</a>
      <a href="about.html">Platform</a>
      <a href="services.html">Modules</a>
      <a class="nav-action" href="services.html#request-demo">Request a demo <span>→</span></a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy fade-in">
        <p class="eyebrow"><span class="status-dot"></span> BUILT FOR MODERN DEVICE RETAIL &amp; REPAIR</p>
        <h1>Everything your store needs to <em>move faster.</em></h1>
        <p class="hero-text">Jersey Quik Fix unifies product sales, repair tickets, inventory, customers, appointments, and administration in one clear, secure workspace.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="services.html#request-demo">See the system <span>→</span></a>
          <a class="button button-quiet" href="about.html">Explore the platform <span>↗</span></a>
        </div>
        <div class="trust-line">
          <div class="stacked-avatars"><i>J</i><i>Q</i><i>F</i><i>+</i></div>
          <p><strong>One connected command center</strong><br>for every customer, device, and transaction.</p>
        </div>
      </div>

      <div class="dashboard-stage fade-in">
        <div class="dashboard-window">
          <div class="window-top">
            <div class="window-logo"><span>JQ</span> Jersey Quik Fix</div>
            <div class="top-search">⌕&nbsp; Search customers, repairs, inventory...</div>
            <div class="top-user">AR</div>
          </div>
          <div class="window-body">
            <aside class="dashboard-sidebar">
              <small>WORKSPACE</small>
              <a class="selected" href="javascript:void(0)">▦ Dashboard</a>
              <a href="javascript:void(0)">▣ Products</a>
              <a href="javascript:void(0)">◫ Inventory <b>4</b></a>
              <a href="javascript:void(0)">⌕ Repairs</a>
              <a href="javascript:void(0)">♙ Customers</a>
              <small class="side-divider">OPERATIONS</small>
              <a href="javascript:void(0)">◷ Schedule</a>
              <a href="javascript:void(0)">▤ Reports</a>
            </aside>

            <section class="dashboard-content">
              <div class="dash-title">
                <div>
                  <p>MONDAY, JULY 22</p>
                  <h2>Good morning, Alex.</h2>
                </div>
                <button>+ New repair</button>
              </div>

              <div class="metric-grid">
                <article>
                  <span class="metric-icon blue">⌕</span>
                  <p>OPEN REPAIRS</p>
                  <strong>24</strong><small class="positive">↑ 12% this week</small>
                </article>
                <article>
                  <span class="metric-icon mint">↗</span>
                  <p>TODAY''S SALES</p>
                  <strong>$2,840</strong><small class="positive">↑ 8.4% vs. yesterday</small>
                </article>
                <article>
                  <span class="metric-icon orange">!</span>
                  <p>LOW STOCK</p>
                  <strong>4 items</strong><small class="warning">Review inventory</small>
                </article>
              </div>

              <div class="dash-panels">
                <article class="repair-list">
                  <div class="panel-heading"><div><p>ACTIVE QUEUE</p><h3>Repair tickets</h3></div><a href="services.html">View all</a></div>
                  <div class="repair-row">
                    <span class="device-symbol">▯</span>
                    <div><strong>iPhone 15 Pro · Screen repair</strong><small>Maria Rodriguez · Assigned to Devon</small></div>
                    <span class="tag in-progress">IN PROGRESS</span>
                  </div>
                  <div class="repair-row">
                    <span class="device-symbol">◧</span>
                    <div><strong>MacBook Air · Diagnostics</strong><small>James Wilson · Due today</small></div>
                    <span class="tag awaiting">AWAITING PART</span>
                  </div>
                  <div class="repair-row">
                    <span class="device-symbol">◉</span>
                    <div><strong>PlayStation 5 · HDMI port</strong><small>Tyler Brooks · Assigned to Casey</small></div>
                    <span class="tag ready">READY</span>
                  </div>
                </article>

                <article class="today-list">
                  <div class="panel-heading"><div><p>UP NEXT</p><h3>Today''s schedule</h3></div></div>
                  <div class="appointment"><b>10:30</b><span></span><div><strong>Tablet repair drop-off</strong><small>Kenya Hall</small></div></div>
                  <div class="appointment"><b>12:00</b><span></span><div><strong>Device trade-in review</strong><small>Chris Morgan</small></div></div>
                  <div class="appointment"><b>2:30</b><span></span><div><strong>Water damage diagnostic</strong><small>David Lee</small></div></div>
                </article>
              </div>
            </section>
          </div>
        </div>

        <div class="float-card revenue-card">
          <small>WEEKLY REVENUE</small>
          <strong>$14,582</strong><b>+18.6%</b>
          <div class="mini-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
        </div>

        <div class="float-card stock-card">
          <span>◫</span><div><small>INVENTORY ALERT</small><strong>4 items running low</strong><p>Review stock levels</p></div>
        </div>
      </div>
    </section>

    <section class="partner-strip fade-in">
      <p>ONE SYSTEM FOR THE ENTIRE JERSEY QUIK FIX OPERATION</p>
      <div><span>RETAIL</span><i></i><span>REPAIRS</span><i></i><span>INVENTORY</span><i></i><span>CUSTOMERS</span><i></i><span>OPERATIONS</span></div>
    </section>

    <section class="section capabilities">
      <div class="section-intro fade-in">
        <p class="eyebrow">CONNECTED BY DESIGN</p>
        <h2>From the counter to the <em>repair bench.</em></h2>
        <p>Stop switching between disconnected tools. Every product, part, repair, customer conversation, and appointment stays in sync.</p>
      </div>

      <div class="capability-grid">
        <article class="capability-card large-card fade-in">
          <span class="feature-icon">⌕</span>
          <p class="card-kicker">REPAIR COMMAND CENTER</p>
          <h3>Every repair, clearly in motion.</h3>
          <p>Create detailed tickets, assign technicians, capture device photos, track parts, communicate status, and keep estimated completion dates visible.</p>
          <ul>
            <li>Device, customer, notes &amp; photo history</li>
            <li>Live status and technician assignments</li>
            <li>Approvals, warranties, and release records</li>
          </ul>
          <div class="ticket-preview">
            <div class="ticket-preview-top"><span class="phone-icon">▯</span><div><strong>iPhone 14 Pro</strong><small>Screen replacement · Ticket #RF-1842</small></div><span class="tag in-progress">IN PROGRESS</span></div>
            <div class="progress-bar"><i></i></div>
            <small>Technician: Devon R. &nbsp;·&nbsp; Estimated ready: 4:30 PM</small>
          </div>
        </article>

        <article class="capability-card bright-card fade-in">
          <span class="feature-icon light-icon">◫</span>
          <p class="card-kicker">INVENTORY INTELLIGENCE</p>
          <h3>Know what is on every shelf.</h3>
          <p>Manage phones, accessories, parts, suppliers, serial numbers, adjustments, and purchase history from one inventory ledger.</p>
          <div class="stock-lines">
            <div><span>iPhone 15 screens</span><i><b style="width:78%"></b></i><strong>28</strong></div>
            <div><span>USB-C charging ports</span><i><b style="width:46%"></b></i><strong>12</strong></div>
            <div><span>Galaxy S24 batteries</span><i><b style="width:22%"></b></i><strong>4</strong></div>
          </div>
        </article>

        <article class="capability-card dark-card fade-in">
          <span class="feature-icon dark-icon">↗</span>
          <p class="card-kicker">SALES &amp; INSIGHTS</p>
          <h3>Make every day measurable.</h3>
          <p>Track sales performance, repair revenue, inventory movement, tax, and team activity with actionable reporting.</p>
          <div class="chart-preview">
            <div class="chart-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <b>Monthly revenue <em>+24%</em></b>
          </div>
        </article>
      </div>
    </section>

    <section class="workflow section">
      <div class="workflow-copy fade-in">
        <p class="eyebrow">A BETTER WORKFLOW</p>
        <h2>Clear estimates. Faster <em>approvals.</em></h2>
        <p>Build accurate repair estimates from labor, parts, and tax. Send a polished approval request, then convert it into a live repair ticket without entering anything twice.</p>
        <div class="workflow-list">
          <article class="active"><span>01</span><div><h3>Build the estimate</h3><p>Select device details, labor, parts, discounts, tax, and expected turnaround.</p></div></article>
          <article><span>02</span><div><h3>Get customer approval</h3><p>Connect approvals to customer phone, email, and optional SMS notifications.</p></div></article>
          <article><span>03</span><div><h3>Start work with confidence</h3><p>Reserve stock, assign a technician, and track every repair milestone.</p></div></article>
        </div>
      </div>

      <div class="estimate-stage fade-in">
        <div class="estimate-sheet">
          <div class="estimate-header"><div><span class="tiny-mark">JQ</span><p>REPAIR ESTIMATE<br><small>#EST-2097 · JULY 22, 2026</small></p></div><b>PENDING APPROVAL</b></div>
          <div class="customer-line"><div><small>PREPARED FOR</small><strong>Maria Rodriguez</strong><span>iPhone 15 Pro · Black · 256GB</span></div><div><small>ESTIMATED READY</small><strong>Today, 4:30 PM</strong><span>Devon R., Technician</span></div></div>
          <div class="estimate-table"><div class="line-title"><span>DESCRIPTION</span><span>AMOUNT</span></div><div><span>Premium OLED screen assembly</span><b>$189.00</b></div><div><span>Repair labor</span><b>$65.00</b></div><div><span>Device diagnostic</span><b>$0.00</b></div></div>
          <div class="estimate-total"><span>Total including tax<small>Parts warranty included</small></span><strong>$271.91</strong></div>
          <div class="estimate-buttons"><button>Send for approval</button><button>Print PDF</button></div>
          <p class="estimate-note">This estimate is linked to the customer profile and repair authorization.</p>
        </div>
        <div class="approval-pop"><span>✓</span><div><strong>Approval received</strong><small>Maria approved this estimate</small></div><b>NOW</b></div>
      </div>
    </section>

    <section class="operations">
      <div class="section operations-inner">
        <div class="section-intro fade-in">
          <p class="eyebrow">BUILT FOR THE WHOLE BUSINESS</p>
          <h2>More control behind <em>every counter.</em></h2>
        </div>
        <div class="operations-grid">
          <article class="fade-in"><span>♙</span><h3>Customer 360</h3><p>Profiles, contact details, device records, purchases, repair history, and warranty information in one place.</p></article>
          <article class="fade-in"><span>◷</span><h3>Scheduling</h3><p>Coordinate employee shifts, appointments, technician availability, reminders, and daily repair workload.</p></article>
          <article class="fade-in"><span>✎</span><h3>Contracts</h3><p>Create repair authorizations, releases, service agreements, warranties, signatures, and printable PDFs.</p></article>
          <article class="fade-in"><span>⚙</span><h3>Secure Admin</h3><p>Manage roles, permissions, tax, pricing, audit logs, backups, store settings, and reporting access.</p></article>
        </div>
      </div>
    </section>

    <section class="section cta-section" id="contact">
      <div class="cta-card fade-in">
        <div class="cta-rings"></div>
        <div class="cta-copy">
          <p class="eyebrow light-eyebrow">ONE CONNECTED WORKSPACE</p>
          <h2>Ready to run a <em>sharper store?</em></h2>
          <p>Give your team a faster, clearer way to serve customers and manage every detail of the business.</p>
          <div class="cta-actions">
            <a class="button button-white" href="services.html#request-demo">Request a demo <span>→</span></a>
            <a class="cta-link" href="about.html">See how it works <span>↗</span></a>
          </div>
        </div>
        <div class="cta-stat"><div>24/7</div><p>Visibility across your<br><strong>entire operation.</strong></p></div>
      </div>
    </section>
  </main>

  <footer>
    <a class="brand footer-brand" href="index.html"><span class="brand-mark">JQ</span><span>Jersey <strong>Quik Fix</strong></span></a>
    <p>© 2026 Jersey Quik Fix Management System.</p>
    <div><a href="about.html">Platform</a><a href="services.html">Modules</a><a href="services.html#request-demo">Request a demo</a></div>
  </footer>
  <script src="script.js"></script>
</body>
</html>', 0, '2026-07-22T10:11:30.345Z', '2026-07-22T10:18:52.557Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (21, 5, 'style.css', 'style.css', '@import url(''https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap'');

:root{
  --navy:#052f50; --deep:#04243d; --blue:#087db7; --ocean:#05a9c5; --aqua:#dff7fa;
  --mint:#0aa785; --ink:#163f57; --muted:#6b8595; --line:#dcebf0; --paper:#fff; --bg:#f8fcfd;
  --shadow:0 22px 55px rgba(12,74,100,.12);
}
*{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;background:var(--bg);color:var(--ink);font-family:"DM Sans",Arial,sans-serif;overflow-x:hidden}
a{text-decoration:none;color:inherit} button,input{font:inherit}.page-orb{position:absolute;z-index:-1;pointer-events:none;border-radius:50%;filter:blur(2px)}.orb-one{width:650px;height:650px;right:-180px;top:-290px;background:radial-gradient(circle,rgba(20,181,205,.18),transparent 67%)}.orb-two{width:570px;height:570px;left:-390px;top:650px;background:radial-gradient(circle,rgba(10,125,183,.10),transparent 70%)}
.site-header{max-width:1240px;height:90px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:20}.brand{display:flex;align-items:center;gap:10px;color:var(--navy);font:600 18px/1 "Outfit",sans-serif;letter-spacing:-.45px}.brand strong{color:var(--ocean)}.brand small{display:block;font:700 7px "DM Sans",sans-serif;color:#7d9aaa;letter-spacing:1.25px;margin-top:4px}.brand-mark,.tiny-mark{display:grid;place-items:center;color:#fff;background:linear-gradient(140deg,#08b6ca,#0870ae);box-shadow:0 7px 15px rgba(5,139,180,.25);font:700 11px "Outfit",sans-serif}.brand-mark{width:36px;height:36px;border-radius:11px}.main-nav{display:flex;align-items:center;gap:30px;color:#456377;font-size:14px;font-weight:700}.main-nav>a:not(.nav-action){position:relative}.main-nav>a:not(.nav-action):after{content:"";position:absolute;bottom:-8px;left:0;width:0;height:2px;background:var(--ocean);transition:.25s}.main-nav>a:hover,.main-nav>a.active{color:var(--blue)}.main-nav>a:hover:after,.main-nav>a.active:after{width:100%}.nav-action{background:var(--navy);color:#fff;padding:12px 17px;border-radius:9px;box-shadow:0 9px 22px rgba(4,47,80,.2);transition:.25s}.nav-action:hover{transform:translateY(-2px);background:#075078}.nav-action span,.button span,.text-link span{display:inline-block;margin-left:5px;transition:.25s}.nav-action:hover span,.button:hover span,.text-link:hover span{transform:translateX(4px)}.menu-toggle{border:0;background:transparent;display:none;width:42px;padding:8px}.menu-toggle span{display:block;height:2px;background:var(--navy);margin:5px 0;transition:.25s}
.hero{max-width:1180px;margin:auto;padding:76px 18px 60px;min-height:650px;display:grid;grid-template-columns:.88fr 1.12fr;gap:38px;align-items:center}.eyebrow{margin:0 0 17px;color:var(--blue);font-size:10px;font-weight:700;letter-spacing:1.6px}.status-dot{display:inline-block;width:8px;height:8px;margin-right:7px;border-radius:50%;background:#13b994;box-shadow:0 0 0 4px #dcf8f0}.hero h1,.page-hero h1,h2{margin:0;color:var(--navy);font:700 clamp(42px,5.1vw,68px)/1.04 "Outfit",sans-serif;letter-spacing:-2.5px}h1 em,h2 em{color:var(--ocean);font-style:normal}.hero-text,.page-hero-copy>p:not(.eyebrow){max-width:510px;margin:23px 0 28px;color:#5c7789;font-size:17px;line-height:1.65}.hero-actions{display:flex;align-items:center;gap:12px}.button{display:inline-block;border:0;border-radius:9px;padding:14px 19px;font-size:14px;font-weight:700;transition:.25s;cursor:pointer}.button-primary{color:#fff;background:linear-gradient(135deg,#079fbe,#0874b4);box-shadow:0 10px 25px rgba(6,127,181,.25)}.button-primary:hover{transform:translateY(-2px);box-shadow:0 15px 30px rgba(6,127,181,.34)}.button-quiet{color:var(--navy)}.button-quiet:hover{color:var(--blue)}.trust-line{display:flex;align-items:center;gap:12px;margin-top:42px}.stacked-avatars{display:flex}.stacked-avatars i{width:28px;height:28px;margin-left:-7px;border:2px solid #fff;border-radius:50%;display:grid;place-items:center;background:#8ac8d2;color:#fff;font-style:normal;font-size:8px;font-weight:700}.stacked-avatars i:first-child{margin-left:0;background:#0d668f}.stacked-avatars i:nth-child(2){background:#e4a073}.stacked-avatars i:nth-child(3){background:#087db7}.stacked-avatars i:last-child{background:#e4f4f7;color:var(--blue);font-size:14px}.trust-line p{margin:0;color:#7891a0;font-size:11px;line-height:1.45}.trust-line strong{color:#35596e}
.dashboard-stage{position:relative;width:100%;filter:drop-shadow(0 23px 26px rgba(18,79,104,.16))}.dashboard-window{overflow:hidden;background:#fff;border:1px solid #cce3ea;border-radius:16px}.window-top{height:45px;display:flex;align-items:center;justify-content:space-between;padding:0 15px;border-bottom:1px solid #e5eef1;font-size:9px}.window-logo{font-weight:700;color:var(--navy);display:flex;align-items:center;gap:5px}.window-logo span,.tiny-mark{border-radius:5px;width:18px;height:18px;font-size:6px;box-shadow:none}.top-search{border:1px solid #e2edf1;border-radius:4px;padding:6px 24px 6px 10px;color:#95aab5}.top-user{padding:5px;border-radius:50%;color:#0a749f;background:#d5edf3;font-size:7px}.window-body{display:flex;height:380px}.dashboard-sidebar{width:109px;flex-shrink:0;padding:16px 9px;background:#f8fbfc}.dashboard-sidebar small{display:block;padding-left:8px;color:#a3b5bd;font-size:6px;font-weight:700;letter-spacing:.75px}.dashboard-sidebar a{display:flex;align-items:center;gap:4px;margin-top:3px;padding:8px;border-radius:5px;color:#718999;font-size:8px}.dashboard-sidebar a.selected{color:#087aaa;background:#d9f3f7;font-weight:700}.dashboard-sidebar b{margin-left:auto;padding:2px 4px;border-radius:5px;background:#efa35e;color:white;font-size:6px}.dashboard-sidebar .side-divider{margin-top:17px}.dashboard-content{padding:18px;flex:1;overflow:hidden}.dash-title{display:flex;align-items:flex-start;justify-content:space-between}.dash-title p,.dash-title h2{margin:0}.dash-title p{font-size:8px;color:#94a8b3}.dash-title h2{margin-top:2px;color:#173e56;font-size:16px;letter-spacing:-.4px}.dash-title button{border:0;border-radius:5px;background:#087bb9;color:#fff;padding:8px 10px;font-size:8px}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:15px 0}.metric-grid article{padding:10px;border:1px solid #e3edf1;border-radius:7px}.metric-icon{display:grid;place-items:center;width:19px;height:19px;border-radius:5px;font-size:11px;font-weight:bold}.blue{background:#e3f6fb;color:#0783bb}.mint{background:#e3faf4;color:#09a688}.orange{background:#fff0e5;color:#e48127}.metric-grid p{margin:8px 0 2px;color:#7a92a1;font-size:7px}.metric-grid strong{color:#1b4057;font:700 13px "Outfit"}.metric-grid small{display:block;margin-top:3px;font-size:6px}.positive{color:#07a47c}.warning{color:#dd7e2c}.dash-panels{display:grid;grid-template-columns:1.45fr 1fr;gap:9px}.repair-list,.today-list{padding:11px;border:1px solid #e4edf1;border-radius:7px}.panel-heading{display:flex;justify-content:space-between}.panel-heading p{margin:0;color:#91a4ae;font-size:6px;letter-spacing:.8px}.panel-heading h3{margin:2px 0 8px;color:#244b61;font:700 10px "Outfit"}.panel-heading a{color:#0782b9;font-size:7px}.repair-row{display:flex;align-items:center;gap:6px;padding:7px 0;border-top:1px solid #edf2f4}.device-symbol{color:#0b85b4;font-size:15px}.repair-row div{flex:1}.repair-row strong,.repair-row small{display:block;font-size:7px}.repair-row strong{color:#34596e}.repair-row small{margin-top:2px;color:#92a5ae;font-size:6px}.tag{white-space:nowrap;border-radius:10px;padding:4px 6px;font-size:6px;font-weight:700}.in-progress{background:#dff4fa;color:#0783ac}.awaiting{background:#fff1de;color:#d6812a}.ready{background:#e2f8ed;color:#079b70}.appointment{display:flex;align-items:center;gap:6px;border-top:1px solid #edf2f4;padding:8px 0}.appointment>b{color:#708a99;font-size:7px}.appointment>span{height:21px;width:2px;background:#0fa2c1}.appointment strong,.appointment small{display:block;font-size:7px}.appointment strong{color:#34596e}.appointment small{margin-top:2px;color:#9aaab3;font-size:6px}.float-card{position:absolute;background:#fff;border:1px solid #dcebf0;border-radius:9px;padding:10px;box-shadow:0 15px 27px rgba(17,77,102,.14)}.float-card small{display:block;color:#8ca3af;font-size:6px;letter-spacing:.6px;font-weight:700}.float-card strong{display:block;color:#254b61;font-size:10px;margin-top:3px}.revenue-card{width:138px;bottom:-22px;left:-29px}.revenue-card strong{font:700 17px "Outfit"}.revenue-card>b{position:absolute;right:9px;top:25px;color:#08a37c;font-size:7px}.mini-bars{display:flex;align-items:end;gap:3px;height:18px;margin-top:6px}.mini-bars i{width:10px;background:#85d9e4;border-radius:2px 2px 0 0}.mini-bars i:nth-child(1){height:7px}.mini-bars i:nth-child(2){height:12px}.mini-bars i:nth-child(3){height:8px}.mini-bars i:nth-child(4){height:15px}.mini-bars i:nth-child(5){height:12px}.mini-bars i:nth-child(6){height:18px;background:#0b95bd}.mini-bars i:nth-child(7){height:16px}.stock-card{right:-24px;top:61%;display:flex;align-items:center;gap:8px}.stock-card>span{padding:8px;color:#0785b9;background:#e3f6fb;border-radius:6px}.stock-card p{margin:2px 0 0;color:#869da9;font-size:7px}
.partner-strip{max-width:1145px;margin:15px auto 90px;padding:25px 18px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);text-align:center}.partner-strip p{margin:0;color:#91a6b0;font-size:9px;font-weight:700;letter-spacing:1.25px}.partner-strip div{display:flex;justify-content:space-around;align-items:center;margin-top:18px;color:#5a8296;font:600 13px "Outfit";letter-spacing:.8px}.partner-strip i{width:4px;height:4px;background:#8fd9e2;border-radius:50%}.section{max-width:1180px;margin:auto;padding:72px 18px}.section-intro{max-width:690px;margin:0 auto 48px;text-align:center}.section-intro h2,.story-grid h2,.data-copy h2,.communication-copy h2{font-size:46px}.section-intro>p:last-child{margin:18px auto 0;color:#688394;font-size:16px;line-height:1.65}.capability-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:16px}.capability-card{position:relative;overflow:hidden;min-height:310px;padding:30px;border:1px solid #dfedf1;border-radius:16px;background:#fff}.large-card{grid-row:span 2;min-height:636px;background:linear-gradient(150deg,#fff 40%,#effafd)}.feature-icon{display:grid;place-items:center;width:41px;height:41px;border-radius:11px;background:#e0f6fb;color:#0684b9;font-size:20px}.card-kicker{margin:20px 0 8px;color:#078dba;font-size:10px;font-weight:700;letter-spacing:1.15px}.capability-card h3{margin:0;color:var(--navy);font:700 26px/1.08 "Outfit";letter-spacing:-.7px}.capability-card>p:not(.card-kicker){max-width:390px;color:#668193;font-size:14px;line-height:1.6}.capability-card ul{padding:0;list-style:none;color:#42657a;font-size:12px;line-height:2}.capability-card li:before,.check-list li:before{content:"✓";color:#05a383;font-weight:700;margin-right:8px}.ticket-preview{position:absolute;right:30px;bottom:28px;left:30px;padding:17px;border:1px solid #d8ebf0;border-radius:10px;background:white;box-shadow:0 13px 24px rgba(36,120,151,.08)}.ticket-preview-top{display:flex;align-items:center;gap:8px}.phone-icon{padding:6px;color:#0787ba;background:#e1f4fa;border-radius:6px;font-size:15px}.ticket-preview-top div{flex:1}.ticket-preview strong,.ticket-preview small{display:block;font-size:11px}.ticket-preview small{margin-top:3px;color:#8299a6;font-size:9px}.progress-bar{height:5px;margin:15px 0 8px;border-radius:5px;background:#e7f1f4}.progress-bar i{display:block;width:72%;height:100%;border-radius:5px;background:#0b9fc4}.ticket-preview>small{color:#8099a7;font-size:9px}.bright-card{background:linear-gradient(135deg,#00a5c6,#0575b3);border:0;color:#fff}.bright-card .feature-icon{background:#ffffff25;color:#fff}.bright-card .card-kicker{color:#c8f8ff}.bright-card h3{color:#fff}.bright-card>p:not(.card-kicker){color:#d7f4f8}.stock-lines{margin-top:30px}.stock-lines div{display:flex;align-items:center;gap:8px;margin:11px 0;font-size:10px}.stock-lines span{width:110px}.stock-lines i{height:6px;flex:1;border-radius:5px;background:#ffffff3d}.stock-lines b{display:block;height:100%;border-radius:5px;background:#fff}.stock-lines strong{width:20px;font-size:9px}.dark-card{background:#063b5d;border-color:#063b5d}.dark-card .feature-icon{background:#ffffff1c;color:#7be1ed}.dark-card .card-kicker{color:#7eddea}.dark-card h3{color:#fff}.dark-card>p:not(.card-kicker){color:#b9d5e2}.chart-preview{position:absolute;right:30px;bottom:27px;left:30px;height:102px;border-bottom:1px solid #ffffff29}.chart-bars{display:flex;align-items:end;gap:8px;height:82px}.chart-bars i{width:17px;border-radius:3px 3px 0 0;background:linear-gradient(#2ac1d8,#117ebc)}.chart-bars i:nth-child(1){height:28%}.chart-bars i:nth-child(2){height:42%}.chart-bars i:nth-child(3){height:35%}.chart-bars i:nth-child(4){height:60%}.chart-bars i:nth-child(5){height:49%}.chart-bars i:nth-child(6){height:72%}.chart-bars i:nth-child(7){height:92%;background:#75dfdf}.chart-preview b{position:absolute;bottom:-20px;color:#d5edf4;font-size:9px}.chart-preview em{color:#56dcb5;font-style:normal;margin-left:4px}
.workflow{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center;padding-top:120px;padding-bottom:120px}.workflow-copy>p:not(.eyebrow){max-width:470px;margin:21px 0 28px;color:#668294;font-size:16px;line-height:1.65}.workflow-list{border-top:1px solid #dcebef}.workflow-list article{display:flex;gap:19px;padding:17px 0;border-bottom:1px solid #dcebef;opacity:.58;transition:.25s}.workflow-list article:hover,.workflow-list article.active{opacity:1}.workflow-list span{padding-top:3px;color:#0b99be;font:600 12px "Outfit"}.workflow-list h3{margin:0 0 5px;color:#17435c;font:600 16px "Outfit"}.workflow-list p{margin:0;color:#6f8999;font-size:13px;line-height:1.5}.estimate-stage{position:relative}.estimate-sheet{padding:28px;border:1px solid #d7e8ee;border-radius:15px;background:#fff;box-shadow:var(--shadow)}.estimate-header,.estimate-header>div{display:flex;align-items:center}.estimate-header{justify-content:space-between;padding-bottom:20px;border-bottom:1px solid #e4eef1}.estimate-header>div{gap:9px}.estimate-header p{margin:0;color:#164b66;font:700 9px/1.4 "Outfit";letter-spacing:.6px}.estimate-header p small{color:#87a1ae;font:500 7px "DM Sans";letter-spacing:1px}.estimate-header>b{padding:6px 8px;border-radius:4px;background:#fff1df;color:#d07c23;font-size:7px}.customer-line{display:flex;justify-content:space-between;padding:20px 0}.customer-line small{display:block;color:#9aadb6;font-size:7px;font-weight:700;letter-spacing:1px}.customer-line strong{display:block;margin:5px 0;color:#254e66;font:600 13px "Outfit"}.customer-line span{display:block;color:#738c9c;font-size:9px}.estimate-table{border-top:1px solid #e4eef1}.estimate-table>div{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e8f0f3;color:#526f80;font-size:10px}.estimate-table .line-title{color:#9eb0b9;font-size:7px;font-weight:700;letter-spacing:.8px}.estimate-table b{color:#284f65}.estimate-total{display:flex;align-items:center;justify-content:space-between;padding:17px 0}.estimate-total span{color:#345b70;font-size:11px;font-weight:700}.estimate-total small{display:block;margin-top:2px;color:#92a7b2;font-size:8px;font-weight:400}.estimate-total strong{color:#087cac;font:700 23px "Outfit"}.estimate-buttons{display:flex;gap:9px}.estimate-buttons button{padding:11px 12px;border:0;border-radius:6px;font-size:10px;font-weight:700}.estimate-buttons button:first-child{flex:1;background:#087eb8;color:#fff}.estimate-buttons button:last-child{background:#edf6f8;color:#4d7082}.estimate-note{margin:14px 0 0;color:#94a9b4;text-align:center;font-size:7px}.approval-pop{position:absolute;right:-30px;bottom:35px;display:flex;align-items:center;gap:8px;padding:11px;border:1px solid #dcecf1;border-radius:9px;background:#fff;box-shadow:0 15px 30px rgba(23,78,109,.14)}.approval-pop>span{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#dff8ee;color:#08a271;font-weight:700}.approval-pop strong,.approval-pop small{display:block;font-size:9px}.approval-pop strong{color:#31586d}.approval-pop small{margin-top:2px;color:#91a6b1;font-size:7px}.approval-pop>b{align-self:flex-start;margin-left:10px;color:#9bafba;font-size:7px}
.operations{background:#e9f8fb}.operations-inner{padding-top:88px;padding-bottom:88px}.operations-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.operations-grid article{min-height:215px;padding:24px 20px;border:1px solid #d7edf1;border-radius:12px;background:#faffff}.operations-grid span{display:grid;place-items:center;width:37px;height:37px;border-radius:9px;background:#d9f4f8;color:#0884b6;font-size:18px}.operations-grid h3{margin:19px 0 10px;color:#17455d;font:600 17px "Outfit"}.operations-grid p{margin:0;color:#668394;font-size:13px;line-height:1.55}.cta-section{padding-top:110px;padding-bottom:95px}.cta-card,.demo-card{position:relative;overflow:hidden;padding:64px 70px;border-radius:20px;background:linear-gradient(115deg,#063653,#075a89 57%,#059ab7);color:#fff}.cta-card{min-height:350px}.cta-rings{position:absolute;right:-10px;top:-100px;width:470px;height:470px;border:1px solid #76e2eb4f;border-radius:50%;box-shadow:0 0 0 50px #4eced014,0 0 0 110px #4eced00e}.cta-copy{position:relative;z-index:1}.light-eyebrow{color:#98eef7}.cta-card h2,.demo-card h2{color:white;font-size:48px}.cta-card h2 em,.demo-card h2 em{color:#8ce7ef}.cta-copy>p:not(.eyebrow),.demo-copy>p:not(.eyebrow){max-width:510px;margin:17px 0 25px;color:#c7e4ed;font-size:15px;line-height:1.6}.button-white{background:white;color:#0875a9}.cta-actions{display:flex;align-items:center;gap:20px}.cta-link{color:#d4edf4;font-size:12px;font-weight:700}.cta-stat{position:absolute;right:75px;bottom:57px;z-index:1;width:190px}.cta-stat div{display:grid;place-items:center;width:82px;height:82px;margin-bottom:14px;border:1px solid #b8eff451;border-radius:50%;box-shadow:0 0 0 12px #a4edf012;color:#fff;font:700 16px "Outfit"}.cta-stat p{color:#b7e4ec;font:600 15px/1.2 "Outfit";letter-spacing:.5px}.cta-stat strong{color:#fff}footer{display:flex;align-items:center;gap:27px;max-width:1180px;margin:auto;padding:0 18px 38px;color:#7891a0;font-size:12px}footer>p{padding-left:28px;border-left:1px solid #dbe9ef}footer>div{display:flex;gap:20px;margin-left:auto}footer a:hover{color:var(--blue)}.footer-brand small{display:none}
.page-hero{max-width:1180px;min-height:490px;margin:auto;padding:80px 18px 70px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}.compact-hero{min-height:500px}.page-hero-copy h1{max-width:600px;font-size:58px}.platform-map{position:relative;height:360px}.map-core{position:absolute;z-index:2;top:112px;left:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;width:150px;height:150px;border:1px solid #a8e1e9;border-radius:50%;background:#fff;box-shadow:var(--shadow);transform:translateX(-50%);text-align:center}.map-core .brand-mark{margin-bottom:8px}.map-core strong{font:600 12px "Outfit";color:var(--navy)}.map-core small{margin-top:4px;color:#83a0ae;font-size:6px;font-weight:700;letter-spacing:.7px}.map-node{position:absolute;display:flex;align-items:center;gap:8px;padding:10px;border:1px solid #d4e9ee;border-radius:9px;background:#fff;box-shadow:0 10px 22px rgba(24,90,113,.1);font-size:16px;color:#0686b6}.map-node span{display:block}.map-node b,.map-node small{display:block;font-size:9px}.map-node b{color:#31586d}.map-node small{margin-top:2px;color:#8ca2ad;font-size:7px}.node-one{top:22px;left:12px}.node-two{top:15px;right:0}.node-three{bottom:27px;left:5px}.node-four{bottom:10px;right:10px}.platform-map:before,.platform-map:after{content:"";position:absolute;top:48%;left:12%;width:75%;height:1px;background:#b7e5ea;transform:rotate(25deg)}.platform-map:after{transform:rotate(-25deg)}
.story-grid{display:grid;grid-template-columns:1fr 1fr;gap:90px}.story-copy p,.data-copy>p:not(.eyebrow),.communication-copy>p:not(.eyebrow){color:#668294;font-size:16px;line-height:1.68}.principles-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:70px}.principle{padding:27px;border-top:2px solid #8bdbe5;background:#fff}.principle span{color:#0a9abd;font:700 13px "Outfit"}.principle h3{margin:17px 0 9px;color:var(--navy);font:600 21px "Outfit"}.principle p{margin:0;color:#688394;font-size:14px;line-height:1.6}.data-section{display:grid;grid-template-columns:1fr 1fr;gap:95px;align-items:center;padding-top:100px;padding-bottom:100px}.data-card{padding:23px;border:1px solid #d5e8ee;border-radius:15px;background:#fff;box-shadow:var(--shadow)}.data-card-head{display:flex;justify-content:space-between;color:#31576d;font:600 12px "Outfit"}.data-card-head b{padding:4px 7px;border-radius:5px;background:#e0f8ed;color:#079b70;font-size:7px}.profile-row{display:flex;align-items:center;gap:10px;margin:21px 0}.profile-row i{display:grid;place-items:center;width:37px;height:37px;border-radius:50%;background:#d8f1f5;color:#087da9;font-style:normal;font-size:10px;font-weight:700}.profile-row strong,.profile-row small{display:block}.profile-row strong{color:#254c62;font:600 13px "Outfit"}.profile-row small{margin-top:3px;color:#8ba1ac;font-size:8px}.profile-tabs{display:flex;gap:18px;border-bottom:1px solid #e2edf1;color:#91a5af;font-size:9px}.profile-tabs span{padding:9px 0}.profile-tabs .selected{border-bottom:2px solid #08a0bd;color:#087fae;font-weight:700}.profile-details{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:19px 0}.profile-details div{padding:9px;border-radius:6px;background:#f5fafb}.profile-details small,.profile-details strong{display:block}.profile-details small{color:#98aab3;font-size:6px;font-weight:700}.profile-details strong{margin-top:5px;color:#244d63;font:600 11px "Outfit"}.device-entry{display:flex;align-items:center;gap:9px;padding:12px;border:1px solid #e1edf1;border-radius:7px}.device-entry>span{font-size:18px;color:#0585b6}.device-entry div{flex:1}.device-entry strong,.device-entry small{display:block}.device-entry strong{color:#31576c;font-size:10px}.device-entry small{margin-top:3px;color:#93a5ae;font-size:8px}.device-entry>b{color:#087eaf;font-size:7px}.check-list{padding:0;list-style:none;color:#486a7d;font-size:14px;line-height:1.55}.check-list li{margin:15px 0}.security-band{background:var(--deep);color:#fff}.security-inner{padding-top:84px;padding-bottom:84px}.security-inner h2{color:#fff;font-size:45px}.security-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:45px;margin-top:45px}.security-grid span{color:#78e3ee;font-size:22px}.security-grid h3{margin:12px 0 8px;color:#fff;font:600 18px "Outfit"}.security-grid p{margin:0;color:#aacbd9;font-size:14px;line-height:1.6}
.modules-hero{display:block;min-height:390px;padding-top:80px;text-align:center}.modules-hero .page-hero-copy{margin:auto}.modules-hero .page-hero-copy>p:not(.eyebrow){margin-right:auto;margin-left:auto}.module-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.module-card{min-height:310px;padding:25px;border:1px solid #dcebf0;border-radius:13px;background:#fff;transition:.25s}.module-card:hover{transform:translateY(-5px);border-color:#9edce5;box-shadow:0 18px 30px rgba(13,91,118,.1)}.module-icon{display:grid;place-items:center;width:39px;height:39px;border-radius:10px;background:#e1f6f9;color:#0786b7;font-size:18px}.module-card>p{margin:18px 0 7px;color:#078fbc;font-size:9px;font-weight:700;letter-spacing:1.2px}.module-card h3{margin:0;color:var(--navy);font:600 20px "Outfit"}.module-card ul{padding:0;list-style:none;color:#668293;font-size:12px;line-height:1.5}.module-card li{margin:10px 0}.module-card li:before{content:"•";color:#08a3bd;font-weight:bold;margin-right:7px}.communication-section{display:grid;grid-template-columns:1fr .8fr;gap:100px;align-items:center;padding-top:100px;padding-bottom:100px}.communication-points{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:25px;color:#42677b;font-size:13px;font-weight:600}.message-window{padding:21px;border:1px solid #d4e8ed;border-radius:15px;background:#fff;box-shadow:var(--shadow)}.message-title{display:flex;align-items:center;gap:8px;padding-bottom:16px;border-bottom:1px solid #e5eef1}.message-title strong,.message-title small{display:block}.message-title strong{color:#244d63;font:600 11px "Outfit"}.message-title small{margin-top:2px;color:#95a8b1;font-size:8px}.message-bubble{max-width:80%;margin:16px 0;padding:11px;border-radius:4px 10px 10px 10px;background:#edf7f9;color:#477083;font-size:11px;line-height:1.5}.accent-bubble{margin-left:auto;border-radius:10px 4px 10px 10px;background:#087fb7;color:white}.message-time{text-align:center;color:#9aaab2;font-size:7px;font-weight:700;letter-spacing:.8px}.message-input{margin-top:17px;padding:10px;border:1px solid #dbeaf0;border-radius:6px;color:#a1afb6;font-size:9px}.message-input b{float:right;color:#0786b6}.demo-section{padding-top:25px}.demo-card{display:grid;grid-template-columns:1fr .8fr;gap:60px;align-items:center}.demo-form{position:relative;z-index:1;padding:22px;border-radius:12px;background:#fff;color:var(--ink)}.demo-form label{display:block;margin-bottom:12px;color:#557385;font-size:10px;font-weight:700}.demo-form input{width:100%;margin-top:5px;padding:11px;border:1px solid #d9e8ee;border-radius:6px;outline:none;color:var(--ink);font-size:12px}.demo-form input:focus{border-color:#08a1bf;box-shadow:0 0 0 3px #dff5f8}.demo-form .button{width:100%;margin-top:4px}.demo-form small{display:block;margin-top:12px;color:#91a3ad;font-size:8px;text-align:center}.demo-details{display:flex;gap:16px;color:#bde6ed;font-size:11px;font-weight:700}
.fade-in{opacity:0;transform:translateY(25px);transition:opacity .7s ease,transform .7s ease}.fade-in.visible{opacity:1;transform:none}
@media(max-width:950px){.hero{grid-template-columns:1fr;padding-top:55px;text-align:center}.hero-copy{display:flex;flex-direction:column;align-items:center}.dashboard-stage{max-width:680px;margin:20px auto}.trust-line{text-align:left}.capability-grid{grid-template-columns:1fr}.large-card{grid-row:auto;min-height:560px}.workflow,.data-section,.communication-section{grid-template-columns:1fr;gap:50px}.workflow{padding-top:85px;padding-bottom:85px}.estimate-stage,.data-visual,.message-window{max-width:600px;margin:auto;width:100%}.operations-grid,.module-grid{grid-template-columns:repeat(2,1fr)}.page-hero{gap:35px}.page-hero-copy h1{font-size:49px}.story-grid{gap:50px}.cta-stat{opacity:.5}.demo-card{grid-template-columns:1fr;gap:25px}.platform-map{transform:scale(.9)}}@media(max-width:620px){.site-header{height:72px;padding:0 18px}.main-nav{position:absolute;top:63px;right:15px;left:15px;display:none;flex-direction:column;align-items:stretch;gap:16px;padding:18px;border-radius:13px;background:white;box-shadow:0 15px 35px rgba(18,59,88,.15)}.main-nav.open{display:flex}.main-nav .nav-action{text-align:center}.menu-toggle{display:block}.hero{min-height:auto;padding:48px 18px 35px}.hero h1,.page-hero h1{font-size:43px;letter-spacing:-1.8px}.hero-text,.page-hero-copy>p:not(.eyebrow){font-size:15px}.hero-actions{flex-direction:column;width:100%}.hero-actions .button{width:100%;text-align:center}.dashboard-window{width:120%;margin-bottom:-62px;transform:scale(.83);transform-origin:top left}.window-body{height:355px}.dashboard-sidebar{width:94px}.float-card{transform:scale(.84)}.revenue-card{left:-15px}.stock-card{right:-16px}.partner-strip{margin:20px 18px 35px}.partner-strip div{gap:7px;font-size:9px}.partner-strip i{display:none}.section{padding:55px 20px}.section-intro{margin-bottom:30px}.section-intro h2,.story-grid h2,.data-copy h2,.communication-copy h2,.security-inner h2,.cta-card h2,.demo-card h2{font-size:36px;letter-spacing:-1.5px}.capability-card{min-height:285px;padding:23px}.large-card{min-height:510px}.ticket-preview{right:20px;bottom:20px;left:20px}.workflow{padding-top:60px;padding-bottom:65px}.estimate-sheet{padding:19px}.approval-pop{right:-8px;bottom:-25px}.operations-inner{padding-top:58px;padding-bottom:58px}.operations-grid,.module-grid,.principles-grid{grid-template-columns:1fr;gap:12px}.operations-grid article{min-height:auto}.cta-section{padding-top:60px;padding-bottom:60px}.cta-card,.demo-card{padding:40px 25px}.cta-card{min-height:420px}.cta-stat{right:26px;bottom:20px;transform:scale(.8);transform-origin:bottom right}.cta-actions{flex-direction:column;align-items:flex-start;gap:17px}.cta-card .button{width:auto}.page-hero{display:block;min-height:auto;padding:50px 20px 55px;text-align:center}.page-hero-copy>p:not(.eyebrow){margin-right:auto;margin-left:auto}.platform-map{height:300px;margin-top:35px;transform:scale(.8);transform-origin:center top}.story-grid{grid-template-columns:1fr;gap:25px}.principles-grid{margin-top:35px}.data-section,.communication-section{padding-top:60px;padding-bottom:60px}.security-grid{grid-template-columns:1fr;gap:25px;margin-top:32px}.modules-hero{padding-top:50px}.communication-points{grid-template-columns:1fr}.module-card{min-height:auto}.demo-details{flex-direction:column;gap:10px}footer{flex-wrap:wrap;gap:12px;padding-bottom:26px}footer>p{width:100%;margin:0;padding:0;border:0}footer>div{width:100%;margin:5px 0 0;justify-content:space-between;font-size:10px}.customer-line{gap:10px}.estimate-header>b{font-size:5px}}', 0, '2026-07-22T10:11:30.432Z', '2026-07-22T10:18:53.002Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (22, 5, 'script.js', 'script.js', 'document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  document.querySelectorAll(''a[href^="#"]'').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const items = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("visible"), index * 55);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  } else {
    items.forEach(item => item.classList.add("visible"));
  }

  const demoForm = document.querySelector(".demo-form");
  if (demoForm) {
    demoForm.addEventListener("submit", event => {
      event.preventDefault();
      const button = demoForm.querySelector("button");
      button.textContent = "Demo request received ✓";
      button.style.background = "#079b79";
      button.disabled = true;
    });
  }
});', 0, '2026-07-22T10:11:30.512Z', '2026-07-22T10:18:53.087Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (23, 5, 'about.html', 'about.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Discover the connected platform behind Jersey Quik Fix Management System.">
  <title>Platform | Jersey Quik Fix</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="page-orb orb-one"></div>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Jersey Quik Fix home"><span class="brand-mark">JQ</span><span>Jersey <strong>Quik Fix</strong><small>MANAGEMENT SYSTEM</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="Primary navigation">
      <a href="index.html">Overview</a>
      <a class="active" href="about.html">Platform</a>
      <a href="services.html">Modules</a>
      <a class="nav-action" href="services.html#request-demo">Request a demo <span>→</span></a>
    </nav>
  </header>

  <main>
    <section class="page-hero compact-hero">
      <div class="page-hero-copy fade-in">
        <p class="eyebrow">ONE SOURCE OF TRUTH</p>
        <h1>Built around the way your <em>store actually works.</em></h1>
        <p>Jersey Quik Fix turns the moving pieces of retail and repair into one connected operational system—designed for the pace of a busy electronics store.</p>
        <a class="button button-primary" href="services.html#request-demo">Request a demo <span>→</span></a>
      </div>
      <div class="platform-map fade-in">
        <div class="map-core"><span class="brand-mark">JQ</span><strong>Jersey Quik Fix</strong><small>CONNECTED OPERATIONS</small></div>
        <div class="map-node node-one">◫ <span><b>Inventory</b><small>Stock &amp; suppliers</small></span></div>
        <div class="map-node node-two">⌕ <span><b>Repairs</b><small>Tickets &amp; status</small></span></div>
        <div class="map-node node-three">♙ <span><b>Customers</b><small>History &amp; contact</small></span></div>
        <div class="map-node node-four">◷ <span><b>Schedule</b><small>People &amp; appointments</small></span></div>
      </div>
    </section>

    <section class="section story-section">
      <div class="story-grid">
        <div class="fade-in">
          <p class="eyebrow">DESIGNED FOR CLARITY</p>
          <h2>A platform that keeps the whole team <em>in step.</em></h2>
        </div>
        <div class="story-copy fade-in">
          <p>At a device repair and retail store, a sale can become a customer record, a repair can consume a part, and an approval can become a signed service agreement. Jersey Quik Fix preserves those relationships automatically.</p>
          <p>That means less manual follow-up, fewer inventory surprises, and a better customer experience from first conversation through final pickup.</p>
          <a class="text-link" href="services.html">Explore the modules <span>→</span></a>
        </div>
      </div>

      <div class="principles-grid">
        <article class="principle fade-in"><span>01</span><h3>Connected records</h3><p>Products, serial numbers, suppliers, customers, devices, estimates, invoices, and repair tickets stay linked.</p></article>
        <article class="principle fade-in"><span>02</span><h3>Fast at the counter</h3><p>Search-first workflows help staff find products, customer history, repair status, and availability quickly.</p></article>
        <article class="principle fade-in"><span>03</span><h3>Controlled access</h3><p>Role-based permissions give owners, managers, technicians, and sales staff the access they need—nothing more.</p></article>
      </div>
    </section>

    <section class="section data-section">
      <div class="data-visual fade-in">
        <div class="data-card">
          <div class="data-card-head"><span>Customer profile</span><b>ACTIVE</b></div>
          <div class="profile-row"><i>MR</i><div><strong>Maria Rodriguez</strong><small>maria.rodriguez@email.com · (201) 555-0148</small></div></div>
          <div class="profile-tabs"><span class="selected">Overview</span><span>Repairs</span><span>Purchases</span><span>Devices</span></div>
          <div class="profile-details"><div><small>LIFETIME SPEND</small><strong>$1,482.50</strong></div><div><small>OPEN REPAIRS</small><strong>1</strong></div><div><small>WARRANTIES</small><strong>2 active</strong></div></div>
          <div class="device-entry"><span>▯</span><div><strong>iPhone 15 Pro</strong><small>Serial tracked · Screen repair in progress</small></div><b>VIEW →</b></div>
        </div>
      </div>
      <div class="data-copy fade-in">
        <p class="eyebrow">CONTEXT AT EVERY STEP</p>
        <h2>Every interaction begins with the <em>full picture.</em></h2>
        <p>Customer profiles provide the context your team needs: contact preferences, device history, repair and purchase history, warranties, approvals, and communications.</p>
        <ul class="check-list">
          <li>Direct links between customer, store phone, email, and repair documentation</li>
          <li>Optional email and SMS notifications for estimate approvals and status updates</li>
          <li>Complete transaction history for better service at every return visit</li>
        </ul>
      </div>
    </section>

    <section class="security-band">
      <div class="section security-inner">
        <div class="fade-in"><p class="eyebrow light-eyebrow">BUILT FOR RESPONSIBLE OPERATIONS</p><h2>Powerful access, <em>purposeful control.</em></h2></div>
        <div class="security-grid fade-in">
          <article><span>◈</span><h3>Role-based permissions</h3><p>Set practical access levels for technicians, front counter staff, managers, and administrators.</p></article>
          <article><span>▤</span><h3>Audit-ready visibility</h3><p>Track adjustments, activity, pricing changes, and operational actions with clear audit logs.</p></article>
          <article><span>◌</span><h3>Business continuity</h3><p>Manage settings, system backups, reporting, tax configuration, and store-level controls centrally.</p></article>
        </div>
      </div>
    </section>

    <section class="section cta-section">
      <div class="cta-card fade-in">
        <div class="cta-rings"></div>
        <div class="cta-copy"><p class="eyebrow light-eyebrow">SEE THE COMPLETE WORKSPACE</p><h2>Bring every operation into <em>focus.</em></h2><p>Explore the modules that make Jersey Quik Fix a complete business management system.</p><a class="button button-white" href="services.html">Explore modules <span>→</span></a></div>
      </div>
    </section>
  </main>

  <footer>
    <a class="brand footer-brand" href="index.html"><span class="brand-mark">JQ</span><span>Jersey <strong>Quik Fix</strong></span></a>
    <p>© 2026 Jersey Quik Fix Management System.</p>
    <div><a href="index.html">Overview</a><a href="services.html">Modules</a><a href="services.html#request-demo">Request a demo</a></div>
  </footer>
  <script src="script.js"></script>
</body>
</html>', 0, '2026-07-22T10:18:52.800Z', '2026-07-22T10:18:52.800Z');
INSERT INTO site_pages ("id", "site_id", "title", "slug", "content", "order", "created_at", "updated_at") VALUES (24, 5, 'services.html', 'services.html', '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Explore Jersey Quik Fix Management System modules for retail, repairs, inventory, customers, scheduling, contracts, and administration.">
  <title>Modules | Jersey Quik Fix</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="page-orb orb-two"></div>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Jersey Quik Fix home"><span class="brand-mark">JQ</span><span>Jersey <strong>Quik Fix</strong><small>MANAGEMENT SYSTEM</small></span></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    <nav class="main-nav" aria-label="Primary navigation">
      <a href="index.html">Overview</a>
      <a href="about.html">Platform</a>
      <a class="active" href="services.html">Modules</a>
      <a class="nav-action" href="#request-demo">Request a demo <span>→</span></a>
    </nav>
  </header>

  <main>
    <section class="page-hero modules-hero">
      <div class="page-hero-copy fade-in">
        <p class="eyebrow">COMPLETE BUSINESS MANAGEMENT</p>
        <h1>Every module. <em>One intelligent workflow.</em></h1>
        <p>Purpose-built tools for the work that keeps Jersey Quik Fix moving—from the sales floor to the repair bench and back office.</p>
      </div>
    </section>

    <section class="section modules-section">
      <div class="module-grid">
        <article class="module-card fade-in"><span class="module-icon">▣</span><p>COMMERCE</p><h3>Products &amp; sales</h3><ul><li>Smartphones, tablets, laptops, consoles, wearables, accessories, and more</li><li>Categories, prices, cost, supplier details, photos, and availability</li><li>Barcode and serial number tracking</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">◫</span><p>STOCK CONTROL</p><h3>Inventory</h3><ul><li>Additions, deductions, stock adjustments, and movement logs</li><li>Low inventory alerts and purchase history</li><li>Supplier tracking and part availability</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">⌕</span><p>SERVICE DESK</p><h3>Repairs</h3><ul><li>Tickets for screens, batteries, ports, water damage, software, and diagnostics</li><li>Board-level and micro-soldering workflows</li><li>Technician assignment, notes, photos, and completion dates</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">≋</span><p>APPROVALS</p><h3>Repair estimation</h3><ul><li>Automatic labor, parts, and tax calculations</li><li>Printable estimates and invoice-ready totals</li><li>Customer approval tracking before work begins</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">♙</span><p>RELATIONSHIPS</p><h3>Customers</h3><ul><li>Profiles with phone numbers and email addresses</li><li>Repair, purchase, device, and warranty history</li><li>Linked communications and customer context</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">◷</span><p>TIME MANAGEMENT</p><h3>Scheduling &amp; events</h3><ul><li>Employee schedules and technician availability</li><li>Repair appointments, reminders, and calendar views</li><li>Promotions, holiday hours, meetings, and campaigns</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">✎</span><p>DOCUMENTS</p><h3>Contracts</h3><ul><li>Service agreements, authorizations, releases, and warranties</li><li>Digital signatures and printable PDF generation</li><li>Business contract drafting and storage</li></ul></article>
        <article class="module-card fade-in"><span class="module-icon">⚙</span><p>LEADERSHIP</p><h3>Admin &amp; reporting</h3><ul><li>Employees, roles, permissions, tax, store, and pricing settings</li><li>Analytics, audit logs, system backups, and dashboard oversight</li><li>Secure operational control at every level</li></ul></article>
      </div>
    </section>

    <section class="section communication-section">
      <div class="communication-copy fade-in">
        <p class="eyebrow">COMMUNICATIONS THAT STAY CONNECTED</p>
        <h2>Keep every customer <em>in the loop.</em></h2>
        <p>Repair orders, estimates, invoices, and customer profiles connect directly to the details your team relies on. Keep communication professional, timely, and easy to trace.</p>
        <div class="communication-points"><span>✓ Email notifications</span><span>✓ Optional SMS notifications</span><span>✓ Store and customer contact links</span><span>✓ Appointment reminders</span></div>
      </div>
      <div class="message-window fade-in">
        <div class="message-title"><span class="tiny-mark">JQ</span><div><strong>Jersey Quik Fix</strong><small>Message preview</small></div></div>
        <div class="message-bubble">Hi Maria, your iPhone 15 Pro repair estimate is ready. Review and approve it securely whenever you''re ready.</div>
        <div class="message-bubble accent-bubble">Your repair is now in progress. Estimated completion: today at 4:30 PM.</div>
        <div class="message-time">DELIVERED · 10:42 AM</div>
        <div class="message-input">Type a message <b>➤</b></div>
      </div>
    </section>

    <section class="section demo-section" id="request-demo">
      <div class="demo-card fade-in">
        <div class="demo-copy">
          <p class="eyebrow light-eyebrow">LET''S BUILD A BETTER WORKDAY</p>
          <h2>See Jersey Quik Fix in <em>action.</em></h2>
          <p>Request a guided walkthrough of the workflows that matter most to your store: sales, repairs, inventory, appointments, contracts, and reporting.</p>
          <div class="demo-details"><span>◷ Personalized walkthrough</span><span>◈ Built around your operation</span></div>
        </div>
        <form class="demo-form" action="#" method="post">
          <label>Work email<input type="email" placeholder="you@yourstore.com" required></label>
          <label>Store name<input type="text" placeholder="Your store name" required></label>
          <button class="button button-primary" type="submit">Request my demo <span>→</span></button>
          <small>We''ll use these details only to coordinate your demonstration.</small>
        </form>
      </div>
    </section>
  </main>

  <footer>
    <a class="brand footer-brand" href="index.html"><span class="brand-mark">JQ</span><span>Jersey <strong>Quik Fix</strong></span></a>
    <p>© 2026 Jersey Quik Fix Management System.</p>
    <div><a href="index.html">Overview</a><a href="about.html">Platform</a><a href="#request-demo">Request a demo</a></div>
  </footer>
  <script src="script.js"></script>
</body>
</html>', 0, '2026-07-22T10:18:52.887Z', '2026-07-22T10:18:52.887Z');
COMMIT;
