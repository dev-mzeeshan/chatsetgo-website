// ═══════════ GA4 ANALYTICS INIT ═══════════
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-11XFC47N3H'); // ← Replace with your Measurement ID from analytics.google.com

// ═══════════ DEVICE & MOTION DETECTION ═══════════
const _mobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const _reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══════════ THREE.JS HERO PARTICLES ═══════════
(function () {
    const cv = document.getElementById('heroCanvas');
    if (!cv || typeof THREE === 'undefined') return;
    if (_reduced) return; // respect prefers-reduced-motion
    const W = window.innerWidth, H = window.innerHeight;
    const r = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !_mobile });
    r.setSize(W, H); r.setPixelRatio(_mobile ? 1 : Math.min(devicePixelRatio, 2));
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, .1, 1000);
    cam.position.z = 32;
    // Particles — 500 on mobile, 2400 on desktop
    const N = _mobile ? 500 : 2400, p = new Float32Array(N * 3), c = new Float32Array(N * 3), v = [];
    for (let i = 0; i < N; i++) {
        p[i * 3] = (Math.random() - .5) * 90; p[i * 3 + 1] = (Math.random() - .5) * 65; p[i * 3 + 2] = (Math.random() - .5) * 45;
        const t = Math.random();
        c[i * 3] = .93 + t * .07; c[i * 3 + 1] = .24 + t * .35; c[i * 3 + 2] = .02 + t * .04;
        v.push({ x: (Math.random() - .5) * .018, y: (Math.random() - .5) * .015, z: (Math.random() - .5) * .009 });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: .22, vertexColors: true, transparent: true, opacity: .72 }));
    sc.add(pts);
    // Wireframe rings
    const addRing = (rad, tube, ox, oy, oz, rx, ry, op) => {
        const m = new THREE.Mesh(new THREE.TorusGeometry(rad, tube, 8, 64), new THREE.MeshBasicMaterial({ color: 0xF97316, wireframe: true, transparent: true, opacity: op }));
        m.rotation.set(rx, ry, 0); sc.add(m); return m;
    };
    const r1 = addRing(14, .12, 0, 0, 0, .5, 0, .05);
    const r2 = addRing(20, .09, 0, 0, 0, 1.2, .5, .03);
    const r3 = addRing(8, .06, 0, 0, 0, .2, 1.1, .07);
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - .5) * 2; my = -(e.clientY / innerHeight - .5) * 2; });
    (function a() {
        requestAnimationFrame(a);
        const pa = g.attributes.position.array;
        for (let i = 0; i < N; i++) {
            pa[i * 3] += v[i].x; pa[i * 3 + 1] += v[i].y; pa[i * 3 + 2] += v[i].z;
            if (Math.abs(pa[i * 3]) > 45) v[i].x *= -1;
            if (Math.abs(pa[i * 3 + 1]) > 32) v[i].y *= -1;
            if (Math.abs(pa[i * 3 + 2]) > 22) v[i].z *= -1;
        }
        g.attributes.position.needsUpdate = true;
        pts.rotation.y += .0003 + mx * .0004; pts.rotation.x += .0001 + my * .0003;
        r1.rotation.z += .0018; r2.rotation.x += .0012; r2.rotation.y += .0015; r3.rotation.z -= .002;
        r.render(sc, cam);
    })();
    window.addEventListener('resize', () => { const w = innerWidth, h = innerHeight; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); });
})();

// ═══════════ 3D DIVIDER MINI-SCENES ═══════════
function makeScene3D(canvasId, color, shapes) {
    const cv = document.getElementById(canvasId);
    if (!cv || typeof THREE === 'undefined') return;
    const W = cv.parentElement.offsetWidth || 800, H = 180;
    const r = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    r.setSize(W, H); r.setPixelRatio(Math.min(devicePixelRatio, 2));
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, W / H, .1, 500);
    cam.position.z = 20;
    shapes.forEach(s => {
        let geo;
        if (s.t === 'oct') geo = new THREE.OctahedronGeometry(s.r || 1.5, 0);
        else if (s.t === 'ico') geo = new THREE.IcosahedronGeometry(s.r || 1.5, 0);
        else if (s.t === 'tor') geo = new THREE.TorusGeometry(s.r || 2, s.tube || .3, 8, 24);
        else geo = new THREE.BoxGeometry(s.r || 1.5, s.r || 1.5, s.r || 1.5);
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: s.op || .15 }));
        m.position.set(s.x || 0, s.y || 0, s.z || 0);
        m.rotation.set(s.rx || 0, s.ry || 0, 0);
        sc.add(m); s.mesh = m;
    });
    (function a() {
        requestAnimationFrame(a);
        shapes.forEach((s, i) => { if (s.mesh) { s.mesh.rotation.x += .007 * (i % 2 ? 1 : -1); s.mesh.rotation.y += .01 * (i % 3 ? 1 : -1); } });
        r.render(sc, cam);
    })();
}
// 3D dividers skipped on mobile — purely decorative, saves 3 WebGL contexts
if (!_mobile && !_reduced) makeScene3D('sc1', 0xF97316, [
    { t: 'oct', r: 2, x: -12, y: 0, op: .18 }, { t: 'ico', r: 1.5, x: 0, y: 0, op: .12 },
    { t: 'tor', r: 3, tube: .2, x: 10, y: .5, op: .1 }, { t: 'oct', r: 1, x: 6, y: -1, op: .15 },
    { t: 'ico', r: 2.5, x: -5, y: 0, op: .08 }, { t: 'box', r: 1.2, x: 16, y: .5, op: .13 }
]);
if (!_mobile && !_reduced) makeScene3D('sc2', 0xF97316, [
    { t: 'ico', r: 2.2, x: -10, y: 0, op: .15 }, { t: 'tor', r: 2.5, tube: .15, x: 2, y: 0, op: .12 },
    { t: 'oct', r: 1.8, x: 12, y: 0, op: .18 }, { t: 'box', r: 1, x: -4, y: 0, op: .1 }, { t: 'ico', r: 1, x: 18, y: 0, op: .14 }
]);
if (!_mobile && !_reduced) makeScene3D('sc3', 0xF97316, [
    { t: 'box', r: 1.5, x: -14, y: 0, op: .14 }, { t: 'oct', r: 2, x: -2, y: 0, op: .16 },
    { t: 'ico', r: 1.8, x: 8, y: .5, op: .12 }, { t: 'tor', r: 3, tube: .18, x: -8, y: 0, op: .1 }, { t: 'box', r: 1, x: 14, y: 0, op: .15 }
]);

// ═══════════ CTA CANVAS ═══════════
(function () {
    const cv = document.getElementById('ctaCanvas');
    if (!cv || typeof THREE === 'undefined') return;
    if (_reduced) return;
    const el = cv.parentElement, W = el.offsetWidth || 800, H = el.offsetHeight || 600;
    const r = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: !_mobile });
    r.setSize(W, H); r.setPixelRatio(_mobile ? 1 : Math.min(devicePixelRatio, 2));
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, W / H, .1, 500);
    cam.position.z = 22;
    const N = _mobile ? 200 : 1000, p = new Float32Array(N * 3), c = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const rd = 10 + Math.random() * 14, th = Math.random() * Math.PI * 2, ph = (Math.random() - .5) * .7;
        p[i * 3] = rd * Math.cos(th) * Math.cos(ph); p[i * 3 + 1] = rd * Math.sin(ph); p[i * 3 + 2] = rd * Math.sin(th) * Math.cos(ph);
        c[i * 3] = .97; c[i * 3 + 1] = .3 + Math.random() * .35; c[i * 3 + 2] = .04;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('color', new THREE.BufferAttribute(c, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: .17, vertexColors: true, transparent: true, opacity: .85 }));
    sc.add(pts);
    (function a() { requestAnimationFrame(a); pts.rotation.y += .0025; pts.rotation.x += .001; r.render(sc, cam); })();
})();

// ═══════════ SCROLL REVEAL ═══════════
const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add('vis'), i * 75); });
}, { threshold: .07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ═══════════ NAV SCROLL ═══════════
window.addEventListener('scroll', () => document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 40));

// ═══════════ MOBILE NAV TOGGLE ═══════════
const hamBtn = document.getElementById('hamBtn');
const mobileMenu = document.getElementById('mobileMenu');
function setMenu(open) {
    if (!hamBtn || !mobileMenu) return;
    hamBtn.classList.toggle('active', open);
    mobileMenu.classList.toggle('open', open);
    hamBtn.setAttribute('aria-expanded', String(open));
}
if (hamBtn && mobileMenu) {
    hamBtn.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });
}

// ═══════════ 3D CARD TILT ═══════════
document.querySelectorAll('.svc-card').forEach(c => {
    c.addEventListener('mousemove', e => {
        const rc = c.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
        const cx = rc.width / 2, cy = rc.height / 2;
        c.style.transform = `perspective(800px) rotateX(${-(y - cy) / cy * 7}deg) rotateY(${(x - cx) / cx * 7}deg) translateZ(6px)`;
        c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    });
    c.addEventListener('mouseleave', () => c.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)');
});

// ═══════════ PRICING TOGGLE ═══════════
let yearly = false;
const plans = [
    { pm: 4000, py: 38400, sm: 15000, sy: 12000 },
    { pm: 9000, py: 81000, sm: 30000, sy: 24000 },
    { pm: 18000, py: 151200, sm: 55000, sy: 45000 }
];
const fmt = n => n.toLocaleString('en-PK');
function toggleP() {
    yearly = !yearly;
    document.getElementById('ptog').classList.toggle('yr', yearly);
    document.getElementById('lm').classList.toggle('on', !yearly);
    document.getElementById('ly').classList.toggle('on', yearly);
    plans.forEach((pl, i) => {
        const pe = document.getElementById('p' + i), pe2 = document.getElementById('pp' + i), ps = document.getElementById('ps' + i), se = document.getElementById('s' + i);
        if (yearly) {
            const mo = Math.round(pl.py / 12), sav = (pl.pm * 12) - pl.py;
            pe.textContent = fmt(mo); pe2.textContent = 'per month (billed yearly)';
            ps.textContent = '✓ Save PKR ' + fmt(sav) + '/year'; se.textContent = 'PKR ' + fmt(pl.sy);
        } else {
            pe.textContent = fmt(pl.pm); pe2.textContent = 'per month'; ps.textContent = ''; se.textContent = 'PKR ' + fmt(pl.sm);
        }
    });
}

// ═══════════ WA CHAT ANIMATION ═══════════
const msgs = [
    { k: 'r', t: 'Assalam o Alaikum! Welcome to XYZ FastFood.<br>Reply <b>MENU</b> to see today\'s deals!', d: 0 },
    { k: 's', t: 'MENU', d: 1100 },
    { k: 'r', t: '<b>Today\'s Menu:</b><br>1. Zinger Burger - Rs.350<br>2. Pizza Slice - Rs.280<br>3. Fries + Drink - Rs.200<br>4. Chicken Roll - Rs.220<br><br>Reply item number to order!', d: 2100 },
    { k: 's', t: '1', d: 3400 },
    { k: 'ai', t: '<b>Zinger Burger</b> added!<br>Total: Rs.350<br><br>Please share your address:', d: 4200 },
    { k: 's', t: 'F-10 Markaz, Islamabad', d: 5500 },
    { k: 'ai', t: '<b>Order Confirmed! #124</b><br>Amount: Rs.350 (COD)<br>ETA: 25–30 mins<br><br>Thank you! We\'ll notify you when it\'s on the way.', d: 6500 }
];
let chatDone = false;
function initChat() {
    if (chatDone) return; chatDone = true;
    const body = document.getElementById('waBody');
    msgs.forEach(msg => {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = (msg.k === 's' ? 'ms' : msg.k === 'ai' ? 'mai' : 'mr') + ' msg-in';
            el.innerHTML = msg.t; body.appendChild(el); body.scrollTop = body.scrollHeight;
        }, msg.d + 600);
    });
}
const waObs = new IntersectionObserver(e => { if (e[0].isIntersecting) { initChat(); waObs.disconnect(); } }, { threshold: .3 });
const waEl = document.getElementById('waPhone'); if (waEl) waObs.observe(waEl);

// ═══════════ COUNTER ANIMATION ═══════════
const cnts = document.querySelectorAll('[data-count]');
const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target, tgt = +el.dataset.count; let cur = 0;
            const tm = setInterval(() => { cur = Math.min(cur + tgt / 40, tgt); el.textContent = Math.round(cur) + (el.dataset.suf || ''); if (cur >= tgt) clearInterval(tm); }, 35);
            cObs.unobserve(el);
        }
    });
}, { threshold: .5 });
cnts.forEach(el => cObs.observe(el));

// ═══════════ STEP HIGHLIGHT CYCLE ═══════════
let si = 0; const sc_cards = document.querySelectorAll('.step');
function cycleS() { sc_cards.forEach((c, i) => c.classList.toggle('lit', i === si)); si = (si + 1) % sc_cards.length; }
if (sc_cards.length) { cycleS(); setInterval(cycleS, 2200); }

// ═══════════ PRICING CARD 3D TILT ═══════════
document.querySelectorAll('.pc').forEach(c => {
    c.addEventListener('mousemove', e => {
        const rc = c.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
        const cx = rc.width / 2, cy = rc.height / 2;
        c.style.transform = `perspective(1000px) rotateX(${-(y - cy) / cy * 5}deg) rotateY(${(x - cx) / cx * 5}deg) translateY(-14px)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
});

// ═══════════ PRICING TOGGLE BIND (inline onclick removed for CSP) ═══════════
const ptogBtn = document.getElementById('ptog');
if (ptogBtn) ptogBtn.addEventListener('click', toggleP);