/* ============================================================
   Rishit Rajput — Portfolio
   CONFIG first: change these three values and the whole site
   (nav, hero CTA, GitHub activity, contact, footer) follows.
   ============================================================ */

const DEFAULTS = {
  // GitHub username — the activity section fetches public data live
  // from the GitHub API. Nothing here is hardcoded.
  github: "rishit017",

  // Timezone shown in the hero meta line
  timezone: "Asia/Kolkata",

  // Repos listed in the activity section (most-starred, non-forks)
  maxRepos: 4
};

// Optional: window.SITE_CONFIG = { github: "..." } before this script loads
// to override the values above without editing this file.
const CONFIG = Object.assign(
  {},
  DEFAULTS,
  (typeof window !== "undefined" && window.SITE_CONFIG) || {}
);

/* ------------------------------------------------------------ */

(function () {
  "use strict";

  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Headings: per-letter outline on hover ---------- */
  $$(".section__title, .contact__big, .project__name, .cert__name, .footer__big").forEach((el) => {
    const label = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", label);
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const chr of child.textContent) {
            if (chr.trim() === "") { frag.appendChild(document.createTextNode(chr)); continue; }
            const sp = document.createElement("span");
            sp.className = "ch-h";
            sp.setAttribute("aria-hidden", "true");
            sp.style.setProperty("--i", i++);
            sp.textContent = chr;
            frag.appendChild(sp);
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { walk(child); }
      });
    };
    walk(el);
  });

  /* ---------- Projects: click-to-reveal ---------- */
  $$(".project__head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const art = btn.closest(".project");
      const open = art.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Hero name: per-letter hover sweep ---------- */
  $$(".hero__name .line").forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.style.setProperty("--i", String(i));
      s.textContent = ch;
      line.appendChild(s);
    });
  });

  /* ---------- Nav: stuck state ---------- */
  const nav = $("#nav");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-stuck", y > 8);
  }

  /* ---------- Contact: all Contact buttons land lower so whole block is visible ---------- */
  (function(){
    const contact = document.getElementById("contact");
    if(!contact) return;
    const links = Array.from(document.querySelectorAll('a[href="#contact"]'));
    if(!links.length) return;
    function scrollToContact(e){
      // handle every Contact CTA — nav island, hero, mobile sheet, footer
      if(e) e.preventDefault();
      // centre the whole contact block (header + big + icons + sig) in viewport
      // so icons never get clipped below the fold — a little more lower than top-align
      const rect = contact.getBoundingClientRect();
      const absTop = rect.top + window.pageYOffset;
      const vh = window.innerHeight;
      const ch = contact.offsetHeight;
      // if section shorter than viewport, centre it; if taller, place top 22px below nav
      let target;
      if(ch < vh - 32){
        target = absTop - (vh - ch) / 2;
      } else {
        // leave -48px margin so header sits just under nav but icons stay in view
        target = absTop - 52;
        // ensure icons bottom stays in view — push a bit lower if needed
        const icons = document.querySelector(".contact__icons");
        if(icons){
          const iconsBottom = icons.getBoundingClientRect().bottom + window.pageYOffset;
          const maxTop = iconsBottom - vh + 24; // 24px breathing room at bottom
          if(target < maxTop) target = maxTop;
        }
      }
      if(target < 0) target = 0;
      window.scrollTo({top: Math.round(target), behavior: reduced ? "auto" : "smooth"});
      try{ history.pushState(null, "", "#contact"); }catch(_){}
      // close mobile sheet if open
      const sheet = document.getElementById("sheet");
      const toggle = document.getElementById("navToggle");
      if(sheet && toggle && sheet.classList.contains("is-open")){
        // reuse existing setSheet if available, else just hide
        document.body.classList.remove("is-locked");
        sheet.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
        setTimeout(()=>{ if(!sheet.classList.contains("is-open")) sheet.hidden = true; }, 300);
      }
    }
    links.forEach(a=> a.addEventListener("click", scrollToContact, {passive:false}));
    // also handle direct #contact hash navigation (e.g. back button)
    window.addEventListener("hashchange", ()=>{
      if(location.hash === "#contact") scrollToContact();
    });
  })();
  
  /* ---------- Cursor follower — single smooth ball ---------- */
  (function(){
    const cursor = document.getElementById("cursor");
    if(!cursor) return;
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      return;
    }
    const OFF_X = 14;
    const OFF_Y = 14;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let raf = 0;
    let visible = false;

    function setVisible(v){
      if(v===visible) return;
      visible = v;
      cursor.classList.toggle("is-visible", v);
    }

    function update(){
      curX += (mouseX - curX) * 0.14;
      curY += (mouseY - curY) * 0.14;
      cursor.style.transform = "translate3d(" + (curX + OFF_X) + "px," + (curY + OFF_Y) + "px,0) translate(-50%,-50%)";
      const dx = mouseX - curX, dy = mouseY - curY;
      if(Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08){
        raf = 0;
        curX = mouseX; curY = mouseY;
      } else {
        raf = requestAnimationFrame(update);
      }
    }

    function onMove(e){
      mouseX = e.clientX;
      mouseY = e.clientY;
      if(!visible) setVisible(true);
      if(!raf) raf = requestAnimationFrame(update);
    }
    function onLeave(){ setVisible(false); }
    function onEnter(e){ mouseX = e.clientX; mouseY = e.clientY; setVisible(true); }

    window.addEventListener("mousemove", onMove, {passive:true});
    // ensure ball shows even without move (sandbox)
    setTimeout(()=>{ if(!visible){ mouseX = window.innerWidth/2 + OFF_X; mouseY = window.innerHeight/2 + OFF_Y; setVisible(true); curX = mouseX - OFF_X; curY = mouseY - OFF_Y; cursor.style.transform = "translate3d(" + (curX + OFF_X) + "px," + (curY + OFF_Y) + "px,0) translate(-50%,-50%)"; } }, 80);
    window.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseout", (e)=>{ if(!e.relatedTarget && !e.toElement) onLeave(); });

    const hoverables = "a, button, [role=button], .cert__frame, .contact__icon, .egg__close, .inv__icon";
    const headingHoverables = ".hero__name, .section__title, .contact__big, .ch-h, .project__head, h1, h2, h3";
    // per-element focus (bubbles) — keep for keyboard
    function addHover(el){
      el.addEventListener("focusin", ()=> cursor.classList.add("is-hover"));
      el.addEventListener("focusout", ()=> cursor.classList.remove("is-hover"));
    }
    function addHeadingHover(el){
      el.addEventListener("focusin", ()=> cursor.classList.add("is-heading"));
      el.addEventListener("focusout", ()=> cursor.classList.remove("is-heading"));
    }
    document.querySelectorAll(hoverables).forEach(addHover);
    document.querySelectorAll(headingHoverables).forEach(addHeadingHover);
    // delegated mouse hover — handles children (img inside frame, spans inside headings)
    document.addEventListener("mouseover", (e)=>{
      const hov = e.target.closest(hoverables);
      if(hov) cursor.classList.add("is-hover");
      const head = e.target.closest(headingHoverables);
      if(head) cursor.classList.add("is-heading");
    });
    document.addEventListener("mouseout", (e)=>{
      const hov = e.target.closest(hoverables);
      if(hov){
        const still = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(hoverables);
        if(!still) cursor.classList.remove("is-hover");
      }
      const head = e.target.closest(headingHoverables);
      if(head){
        const still = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(headingHoverables);
        if(!still) cursor.classList.remove("is-heading");
      }
    });
    const mo = new MutationObserver((muts)=>{
      muts.forEach(m=>{
        m.addedNodes.forEach(n=>{
          if(n.nodeType===1){
            if(n.matches && n.matches(hoverables)) addHover(n);
            if(n.matches && n.matches(headingHoverables)) addHeadingHover(n);
            if(n.querySelectorAll){
              n.querySelectorAll(hoverables).forEach(addHover);
              n.querySelectorAll(headingHoverables).forEach(addHeadingHover);
            }
          }
        });
      });
    });
    mo.observe(document.body, {childList:true, subtree:true});

    const eggGame = document.getElementById("eggGame");
    if(eggGame){
      const obs = new MutationObserver(()=>{
        const open = !eggGame.hidden;
        cursor.style.opacity = open ? "0.32" : "";
      });
      obs.observe(eggGame, {attributes:true, attributeFilter:["hidden"]});
    }
  })();

  /* ---------- Ticker — reactive hover: slowly comes to rest ---------- */
  (function(){
    const ticker = document.querySelector(".ticker");
    const track = document.querySelector(".ticker__track");
    if(!ticker || !track) return;
    if(typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // disable CSS keyframes, drive via JS for smooth velocity lerp
    track.style.animation = "none";
    track.style.willChange = "transform";
    let half = track.scrollWidth / 2;
    // keep half updated after fonts/images
    const updHalf = ()=> half = track.scrollWidth / 2;
    window.addEventListener("resize", updHalf);
    window.addEventListener("load", updHalf);
    let offset = 0;
    const baseSpeed = 46; // ~26s for half width, matches original CSS
    let target = baseSpeed;
    let cur = baseSpeed;
    let last = performance.now();
    let raf = 0;
    function tick(now){
      // hover check every frame — reliable vs enter/leave
      const isHover = ticker.matches(":hover") || ticker.matches(":focus-within") || track.matches(":hover");
      target = isHover ? 0 : baseSpeed;
      const dt = Math.min(0.05, (now - last)/1000);
      last = now;
      // ease velocity → target (slow rest / resume) — more pronounced
      cur += (target - cur) * 0.085;
      if(Math.abs(cur - target) < 0.08) cur = target;
      // when essentially stopped, skip transform update but keep rAF
      if(Math.abs(cur) > 0.04){
        offset -= cur * dt;
        // seamless loop — half is duplicated content
        if(offset <= -half) offset += half;
        if(offset > 0) offset -= half;
        track.style.transform = "translateX(" + offset + "px)";
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    const toRest = ()=> { target = 0; };
    const toRun = ()=> { target = baseSpeed; };
    // use pointer + mouse + focus for reliability (track covers ticker)
    ["pointerenter","mouseenter","mouseover"].forEach(ev=> ticker.addEventListener(ev, toRest));
    ["pointerleave","mouseleave","mouseout"].forEach(ev=> ticker.addEventListener(ev, toRun));
    ["pointerenter","mouseenter","mouseover"].forEach(ev=> track.addEventListener(ev, toRest));
    ["pointerleave","mouseleave","mouseout"].forEach(ev=> track.addEventListener(ev, toRun));
    ticker.addEventListener("focusin", toRest);
    ticker.addEventListener("focusout", toRun);
    ticker.addEventListener("touchstart", toRest, {passive:true});
    ticker.addEventListener("touchend", toRun);
    track.addEventListener("touchstart", toRest, {passive:true});
    track.addEventListener("touchend", toRun);
    // also pause when tab hidden to save cycles
    document.addEventListener("visibilitychange", ()=>{
      if(document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(tick); }
    });
  })();

  /* ---------- Hero morph — dense monochrome fractal sequence (right side) ---------- */
  (function(){
    const art = document.getElementById("heroArt");
    const root = document.getElementById("morphRoot");
    if(!art || !root) return;
    const N = 20; // reduced further — visibly lighter than before
    const P = 120; // points per layer
    const CX = 300, CY = 300, BASE_R = 145;
    // 13 presets — all softened (no sharp points), odd 4-pt star removed — extra soft shapes added
    const presets = [
      { m: 4,  n1: 12,  n2: 6,   n3: 6,   a:1, b:1, rot: 26 }, // 0 rounded square — soft
      { m: 2,  n1: 2.4, n2: 2.2, n3: 2.2, a:1, b:0.85, rot: 34 }, // 1 curved loop — softened eye
      { m: 6,  n1: 6,   n2: 7,   n3: 7,   a:1, b:1, rot: 18 }, // 2 soft circular bloom
      { m: 6,  n1: 9,   n2: 9,   n3: 9,   a:1, b:1, rot: 58 }, // 3 hex spiral
      { m: 5,  n1: 8,   n2: 8,   n3: 8,   a:1, b:1, rot: 36 }, // 4 pentagon — soft
      { m: 3,  n1: 8,   n2: 6,   n3: 6,   a:1, b:1, rot: 52 }, // 5 triangular — softened (was 7/4.5)
      { m: 4,  n1: 7,   n2: 8,   n3: 8,   a:1, b:1, rot: 42 }, // 6 twisted polygon — softened (was 3.0 → 7)
      { m: 2,  n1: 4.5, n2: 5,   n3: 5,   a:1, b:1, rot: 24 }, // 7 layered polygon — softened
      { m: 8,  n1: 8,   n2: 8,   n3: 8,   a:1, b:1, rot: 16 }, // 8 octagonal ripple — soft 8-fold
      { m: 4,  n1: 9,   n2: 7,   n3: 7,   a:1, b:1, rot: 30 }, // 9 soft square swirl — softened (was 5.5 → 9)
      { m: 4,  n1: 10,  n2: 8,   n3: 8,   a:1, b:1, rot: 12 }, // 10 gentle bloom — soft diamond
      { m: 5,  n1: 6.5, n2: 6,   n3: 6,   a:1, b:1, rot: 22 }, // 11 NEW soft penta bloom — cushion
      { m: 3,  n1: 9,   n2: 7,   n3: 7,   a:1, b:1, rot: 40 }  // 12 NEW soft tri cushion — rounded
    ];
    function sf(phi, m, n1, n2, n3, a, b){
      const c = Math.cos(m*phi/4);
      const s = Math.sin(m*phi/4);
      const t1 = Math.pow(Math.abs(c/a), n2);
      const t2 = Math.pow(Math.abs(s/b), n3);
      const v = t1 + t2;
      if(v === 0) return 0;
      const r = Math.pow(v, -1/n1);
      return isFinite(r) ? r : 1;
    }
    const shapes = presets.map(pr=>{
      const layers=[];
      for(let li=0; li<N; li++){
        const scale = 0.26 + 0.74 * li/(N-1);
        const layerRot = pr.rot * li/(N-1) * Math.PI/180;
        const pts=[];
        for(let pi=0; pi<P; pi++){
          const phi = 2*Math.PI*pi/P;
          let r = sf(phi, pr.m, pr.n1, pr.n2, pr.n3, pr.a, pr.b);
          if(!isFinite(r) || r>3) r = 1;
          const rr = r * scale * BASE_R;
          const ang = phi + layerRot;
          pts.push({ x: CX + rr*Math.cos(ang), y: CY + rr*Math.sin(ang) });
        }
        layers.push(pts);
      }
      return layers;
    });
    const paths=[];
    for(let i=0;i<N;i++){
      const p=document.createElementNS("http://www.w3.org/2000/svg","path");
      p.setAttribute("fill","none");
      p.setAttribute("stroke-width", (0.58 + i*0.014).toFixed(2));
      root.appendChild(p);
      paths.push(p);
    }
    function buildD(pts){
      let d="M "+pts[0].x.toFixed(2)+" "+pts[0].y.toFixed(2);
      for(let i=1;i<pts.length;i++) d+=" L "+pts[i].x.toFixed(2)+" "+pts[i].y.toFixed(2);
      d+=" Z";
      return d;
    }
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      const s0=shapes[0];
      for(let i=0;i<N;i++) paths[i].setAttribute("d", buildD(s0[i]));
      return;
    }
    const perShape = 2200; // ms
    const total = presets.length * perShape;
    const start = performance.now();
    function ease(t){ return t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
    function frame(now){
      if(typeof now !== 'number') now = performance.now();
      let elapsed = (now - start) % total;
      if(elapsed < 0) elapsed += total;
      let idx = Math.floor(elapsed / perShape) % presets.length;
      const nxt = (idx+1)%presets.length;
      const prog = (elapsed % perShape)/perShape;
      const et = ease(prog);
      const aL = shapes[idx], bL = shapes[nxt];
      if(!aL || !bL) { requestAnimationFrame(frame); return; }
      for(let li=0; li<N; li++){
        const aPts=aL[li], bPts=bL[li];
        let d="M "+(aPts[0].x*(1-et)+bPts[0].x*et).toFixed(2)+" "+(aPts[0].y*(1-et)+bPts[0].y*et).toFixed(2);
        for(let pi=1; pi<P; pi++){
          const x = aPts[pi].x*(1-et)+bPts[pi].x*et;
          const y = aPts[pi].y*(1-et)+bPts[pi].y*et;
          d+=" L "+x.toFixed(2)+" "+y.toFixed(2);
        }
        d+=" Z";
        const el=paths[li];
        el.setAttribute("d", d);
        el.style.opacity=(0.16 + 0.78*li/(N-1)).toFixed(3);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Island nav: keep open while the pointer / focus is inside */
  if (nav) {
    const openNav = () => nav.classList.add("is-open");
    const closeNav = () => {
      if (!nav.contains(document.activeElement)) nav.classList.remove("is-open");
    };
    nav.addEventListener("mouseenter", openNav);
    nav.addEventListener("mouseleave", closeNav);
    nav.addEventListener("focusin", openNav);
    nav.addEventListener("focusout", (e) => {
      if (!nav.contains(e.relatedTarget)) nav.classList.remove("is-open");
    });
  }

  /* ---------- Mobile sheet ---------- */
  const toggle = $("#navToggle");
  const sheet = $("#sheet");

  let sheetRaf = 0;
  function setSheet(open) {
    if (!toggle || !sheet) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-locked", open);
    if (open) {
      sheet.hidden = false;
      cancelAnimationFrame(sheetRaf);
      sheetRaf = requestAnimationFrame(() => sheet.classList.add("is-open"));
    } else {
      cancelAnimationFrame(sheetRaf);
      sheet.classList.remove("is-open");
      window.setTimeout(() => { if (!sheet.classList.contains("is-open")) sheet.hidden = true; }, 300);
    }
  }

  if (toggle) {
    toggle.addEventListener("click", () =>
      setSheet(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setSheet(false);
    });
    $$("a", sheet).forEach((a) => a.addEventListener("click", () => setSheet(false)));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setSheet(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealables = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- Signature: write on when Contact is in view ---------- */
  const sig = $("#sig");
  if (sig) {
    const startWrite = () => sig.classList.add("is-writing");
    if (reduced || !("IntersectionObserver" in window)) {
      startWrite();
    } else {
      const sigIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            startWrite();
            sigIo.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.35 }
      );
      sigIo.observe(sig);
    }
  }

  /* ---------- Scroll spy ---------- */
  const navAnchors = $$("#navLinks a[href^='#']");
  const sections = navAnchors
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Clock (IST) ---------- */
  const clock = $("#clock");
  if (clock) {
    const tick = () => {
      clock.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: CONFIG.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(new Date());
    };
    tick();
    window.setInterval(tick, 1000);
  }

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Theme: sliding switch, persisted, system-aware ---------- */
  const THEME_KEY = "rr-theme";
  const rootEl = document.documentElement;
  const themeBtn = $("#themeToggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const favicon = $("#favicon");

  const FAVICON = {
    light: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111111'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='15' fill='%23ffffff' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E",
    dark: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23F2F1EC'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='15' fill='%230E0E0D' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E"
  };

  function storedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }

  function applyTheme(t, persist) {
    rootEl.setAttribute("data-theme", t);
    if (themeBtn) {
      themeBtn.setAttribute("aria-checked", String(t === "dark"));
      themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    if (metaTheme) metaTheme.setAttribute("content", t === "dark" ? "#0E0E0D" : "#FFFFFF");
    if (favicon) favicon.setAttribute("href", FAVICON[t]);
    if (persist) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
  }

  if (themeBtn) {
    // The inline script in <head> already applied the saved/system theme;
    // sync the switch state to it.
    applyTheme(rootEl.getAttribute("data-theme") === "dark" ? "dark" : "light", false);

    // Circular veil wipe: a solid disc of the NEW theme's bg grows from the
    // toggle, the swap happens fully hidden beneath it, then the disc (same
    // colour as the new bg) fades so content eases in. No blending of themes,
    // no grey midpoint, no blink — identical in every browser.
    const veil = $("#themeVeil");
    const VEIL_BG = { light: "#FFFFFF", dark: "#0E0E0D" };
    let veilBusy = false, veilT1 = 0, veilT2 = 0;
    themeBtn.addEventListener("click", () => {
      const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      if (reduced || !veil) { applyTheme(next, true); return; }
      if (veilBusy) return;
      veilBusy = true;
      window.clearTimeout(veilT1); window.clearTimeout(veilT2);
      const r = themeBtn.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
      const rad = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)));
      veil.style.background = VEIL_BG[next];
      veil.style.opacity = "1";
      veil.style.visibility = "visible";
      veil.style.clipPath = "circle(0px at " + x + "px " + y + "px)";
      void veil.offsetWidth; /* commit the zero-circle before expanding */
      veil.style.clipPath = "circle(" + rad + "px at " + x + "px " + y + "px)";
      veilT1 = window.setTimeout(() => {
        applyTheme(next, true);
        veil.style.opacity = "0";
        veilT2 = window.setTimeout(() => {
          veil.style.visibility = "hidden";
          veil.style.clipPath = "circle(0px at " + x + "px " + y + "px)";
          veil.style.opacity = "1";
          veilBusy = false;
        }, 380);
      }, 470);
    });

  }

})();
/* ---------- Easter Egg — dot → ball run ---------- */
(function(){
  "use strict";
  const reducedMotion = typeof window.matchMedia==="function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // find dot after heading split
  let dotEl = null;
  let isTransitioning = false;

  function findDot(){
    const big = document.querySelector(".contact__big");
    if(!big) return null;
    const spans = big.querySelectorAll(".ch-h");
    for(let i=spans.length-1;i>=0;i--){
      const t = spans[i].textContent;
      if(t === "." || t.trim() === "."){
        return spans[i];
      }
    }
    // fallback: last char
    return spans.length ? spans[spans.length-1] : null;
  }

  function initDot(){
    if(dotEl) return;
    const dot = findDot();
    if(!dot) return;
    dotEl = dot;
    dot.classList.add("ch-h--dot");
    dot.setAttribute("role","button");
    dot.setAttribute("tabindex","0");
    dot.setAttribute("aria-label","Easter egg — click the dot to play");
    dot.setAttribute("title","Psst — click me");
    dot.addEventListener("click", onDotActivate);
    dot.addEventListener("keydown", (e)=>{
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        onDotActivate(e);
      }
    });
    window.__eggDot = dot;
  }

  // ensure dot init after split (split is sync but be safe)
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", ()=> requestAnimationFrame(initDot));
  } else {
    requestAnimationFrame(initDot);
  }
  // retry
  setTimeout(initDot, 800);
  setTimeout(initDot, 2000);

  const eggGame = document.getElementById("eggGame");
  const eggStage = document.getElementById("eggStage");
  const eggCanvas = document.getElementById("eggCanvas");
  const eggScoreEl = document.getElementById("eggScore");
  const eggOverlay = document.getElementById("eggOverlay");
  const eggMsg = document.getElementById("eggMsg");
  const eggClose = document.getElementById("eggClose");
  const eggVeil = document.getElementById("eggVeil");

  const sleep = (ms)=> new Promise(r=> setTimeout(r, ms));

  // Game state
  let ctx = null;
  let rafId = null;
  let isGameRunning = false;
  let gameState = "idle"; // idle, playing, over
  let score = 0;
  let obstacles = [];
  let frame = 0;
  let nextSpawnIn = 0;
  let speed = 6;
  let ball = null;
  let groundY = 0;
  let canvasW = 1200, canvasH = 360;
  let lastTime = 0;

  function getThemeColors(){
    const s = getComputedStyle(document.documentElement);
    const ink = s.getPropertyValue("--ink").trim() || "#111111";
    const bg = s.getPropertyValue("--bg").trim() || "#FFFFFF";
    const bgAlt = s.getPropertyValue("--bg-alt").trim() || "#FAFAF8";
    const line = s.getPropertyValue("--line").trim() || "#C7C6C0";
    const muted = s.getPropertyValue("--muted").trim() || "#77776F";
    return {ink, bg, bgAlt, line, muted};
  }

  function setupCanvas(){
    if(!eggCanvas) return false;
    ctx = eggCanvas.getContext("2d");
    if(!ctx) return false;
    // set size based on stage
    const stageRect = eggStage ? eggStage.getBoundingClientRect() : {width: window.innerWidth, height: 400};
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // logical size
    const logicalW = Math.min(1200, Math.max(320, stageRect.width - 32));
    const logicalH = Math.min(420, Math.max(240, Math.min(window.innerHeight*0.62, 380)));
    // handle canvas attributes
    eggCanvas.width = logicalW * dpr;
    eggCanvas.height = logicalH * dpr;
    eggCanvas.style.width = logicalW + "px";
    eggCanvas.style.height = logicalH + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    canvasW = logicalW;
    canvasH = logicalH;
    groundY = canvasH - 46;
    if(ball){
      ball.y = groundY - ball.r*2;
      ball.x = Math.max(60, canvasW * 0.085);
    }
    return true;
  }

  function resetGame(){
    score = 0;
    obstacles = [];
    frame = 0;
    nextSpawnIn = 30;
    speed = 6;
    if(ball){
      ball.y = groundY - ball.r*2;
      ball.vy = 0;
      ball.grounded = true;
    } else {
      ball = {
        x: Math.max(60, canvasW*0.085),
        y: groundY - 36,
        r: 18,
        vy: 0,
        gravity: 0.92,
        jumpPower: -16.2,
        grounded: true
      };
    }
    if(eggScoreEl) eggScoreEl.textContent = "00000";
    if(eggOverlay){
      eggOverlay.classList.remove("is-hidden");
      eggMsg.textContent = reducedMotion ? "Press Space to start • Esc to exit" : "Press Space to start • Esc to exit";
    }
    gameState = "idle";
    isGameRunning = false;
    draw();
  }

  function initGame(){
    if(!setupCanvas()) return;
    if(!ball){
      ball = {
        x: Math.max(60, canvasW*0.085),
        y: groundY - 36,
        r: 18,
        vy: 0,
        gravity: 0.92,
        jumpPower: -16.2,
        grounded: true
      };
    } else {
      ball.x = Math.max(60, canvasW*0.085);
      ball.y = groundY - ball.r*2;
      ball.vy = 0;
      ball.grounded = true;
    }
    resetGame();
    // bind input once
    if(!window.__eggBound){
      window.addEventListener("keydown", onKeyDown);
      eggCanvas.addEventListener("touchstart", (e)=>{ e.preventDefault(); doJump(); }, {passive:false});
      eggCanvas.addEventListener("mousedown", (e)=>{ e.preventDefault(); doJump(); });
      // close
      if(eggClose) eggClose.addEventListener("click", closeGame);
      // stage click also jumps when playing
      if(eggStage) eggStage.addEventListener("click", (e)=>{
        if(gameState==="playing") doJump();
        else if(gameState==="idle") startGame();
      });
      window.addEventListener("resize", ()=>{
        if(eggGame && !eggGame.hidden){
          setupCanvas();
          draw();
        }
      });
      window.__eggBound = true;
    }
    // show overlay idle
    gameState = "idle";
    draw();
  }

  function doJump(){
    if(!ball) return;
    if(gameState==="idle"){
      startGame();
      return;
    }
    if(gameState==="over"){
      resetGame();
      startGame();
      return;
    }
    if(ball.grounded){
      ball.vy = ball.jumpPower;
      ball.grounded = false;
    }
  }

  function onKeyDown(e){
    if(!eggGame || eggGame.hidden) return;
    if(e.code==="Space" || e.key===" "){
      e.preventDefault();
      doJump();
    } else if(e.key==="Escape"){
      e.preventDefault();
      closeGame();
    }
  }

  function startGame(){
    if(isGameRunning) return;
    gameState = "playing";
    isGameRunning = true;
    if(eggOverlay) eggOverlay.classList.add("is-hidden");
    lastTime = performance.now();
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);
  }

  function gameOver(){
    isGameRunning = false;
    gameState = "over";
    if(rafId) cancelAnimationFrame(rafId);
    if(eggOverlay){
      eggOverlay.classList.remove("is-hidden");
      eggMsg.textContent = "Game Over — " + String(Math.floor(score)).padStart(5,"0") + " • Space to restart • Esc to exit";
    }
  }

  function loop(now){
    if(!isGameRunning) return;
    rafId = requestAnimationFrame(loop);
    frame++;
    // speed increase slowly
    speed = 6 + Math.min(9, Math.floor(score/700)*0.9 + Math.floor(score/1500)*0.6);
    // spawn
    nextSpawnIn--;
    if(nextSpawnIn <= 0){
      const h = 28 + Math.random()*34; // 28-62
      const w = 20 + Math.random()*18; // 20-38
      // ensure h not too tall
      obstacles.push({x: canvasW + 12, y: groundY - h, w, h});
      nextSpawnIn = 78 + Math.random()*72 - Math.min(28, score/500);
      if(nextSpawnIn < 42) nextSpawnIn = 42;
    }
    // ball physics
    ball.vy += ball.gravity;
    ball.y += ball.vy;
    if(ball.y + ball.r*2 >= groundY){
      ball.y = groundY - ball.r*2;
      ball.vy = 0;
      ball.grounded = true;
    } else {
      ball.grounded = false;
    }
    // move obstacles
    for(let i=obstacles.length-1;i>=0;i--){
      const o = obstacles[i];
      o.x -= speed;
      if(o.x + o.w < -20){
        obstacles.splice(i,1);
        score += 18;
      }
    }
    // score tick
    score += 0.34;
    if(eggScoreEl) eggScoreEl.textContent = String(Math.floor(score)).padStart(5,"0");
    // collision
    const bx = ball.x;
    const by = ball.y;
    const br = ball.r*2;
    for(const o of obstacles){
      if(bx < o.x + o.w && bx + br > o.x && by < o.y + o.h && by + br > o.y){
        // small leniency: if ball is just grazing top, allow
        // check circular vs rect more precise
        // simple AABB is enough for now
        // add a tiny forgiveness 2px
        const overlapX = Math.min(bx+br, o.x+o.w) - Math.max(bx, o.x);
        const overlapY = Math.min(by+br, o.y+o.h) - Math.max(by, o.y);
        if(overlapX > 4 && overlapY > 4){
          // check if ball is high enough above obstacle (on top)
          // if ball bottom is near obstacle top and vy >0, maybe not
          gameOver();
          draw();
          return;
        }
      }
    }
    draw();
  }

  function draw(){
    if(!ctx) return;
    const {ink, bg, bgAlt, line, muted} = getThemeColors();
    // clear
    ctx.clearRect(0,0,canvasW, canvasH);
    // bg
    ctx.fillStyle = bgAlt;
    ctx.fillRect(0,0,canvasW, canvasH);
    // ground
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY+0.5);
    ctx.lineTo(canvasW, groundY+0.5);
    ctx.stroke();
    // ground ticks
    ctx.strokeStyle = muted;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 1;
    for(let x= (frame* speed*0.5)%24 -24; x<canvasW; x+=24){
      ctx.beginPath();
      ctx.moveTo(x, groundY+6);
      ctx.lineTo(x+8, groundY+6);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // obstacles
    ctx.fillStyle = ink;
    for(const o of obstacles){
      // body
      ctx.fillRect(o.x, o.y, o.w, o.h);
      // top cap
      ctx.fillRect(o.x-2, o.y-2, o.w+4, 3);
      // shadow
      ctx.fillStyle = bg;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(o.x+o.w-5, o.y+4, 5, o.h-4);
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
    }
    // ball
    const cx = ball.x + ball.r;
    const cy = ball.y + ball.r;
    // shadow
    ctx.fillStyle = muted;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.ellipse(cx, groundY+8, ball.r*0.9, 4, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // ball body
    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(cx, cy, ball.r, 0, Math.PI*2);
    ctx.fill();
    // highlight
    ctx.fillStyle = bg;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(cx - ball.r*0.35, cy - ball.r*0.32, ball.r*0.38, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // score is DOM, not canvas
  }

  async function onDotActivate(e){
    if(isTransitioning) return;
    // if game already open, ignore
    if(eggGame && !eggGame.hidden) return;
    isTransitioning = true;
    const dot = dotEl || findDot();
    if(!dot){
      isTransitioning = false;
      return;
    }
    dotEl = dot;
    // prevent multiple
    dot.style.pointerEvents = "none";

    // store original
    const orig = {
      position: dot.style.position,
      left: dot.style.left,
      top: dot.style.top,
      width: dot.style.width,
      height: dot.style.height,
      transform: dot.style.transform,
      zIndex: dot.style.zIndex,
      background: dot.style.background,
      color: dot.style.color,
      borderRadius: dot.style.borderRadius,
      transition: dot.style.transition,
      opacity: dot.style.opacity
    };
    dot._eggOrig = orig;

    if(reducedMotion){
      // skip fancy, just show game
      document.body.classList.add("is-egg-blur");
      if(eggVeil){
        eggVeil.hidden = false;
        eggVeil.removeAttribute("hidden");
        eggVeil.classList.add("is-on");
      }
      await sleep(280);
      document.body.classList.add("is-egg-fade");
      await sleep(420);
      dot.style.opacity = "0";
      await sleep(180);
      showGame();
      isTransitioning = false;
      return;
    }

    const rect = dot.getBoundingClientRect();
    const startX = rect.left + rect.width/2;
    const startY = rect.top + rect.height/2;

    dot.classList.add("dot-fly");
    dot.style.left = startX + "px";
    dot.style.top = startY + "px";
    dot.style.width = rect.width + "px";
    dot.style.height = rect.height + "px";
    dot.style.transform = "translate(-50%, -50%) scale(1)";
    // force
    void dot.offsetWidth;

    document.body.classList.add("is-egg-blur");
    document.body.classList.add("body-lock");
    if(eggVeil){
      eggVeil.hidden = false;
      eggVeil.removeAttribute("hidden");
      requestAnimationFrame(()=> eggVeil.classList.add("is-on"));
    }

    const targetX = Math.max(64, Math.min(window.innerWidth*0.11, 132));
    const targetY = window.innerHeight * 0.52;

    dot.style.transition = "left 0.92s cubic-bezier(.2,.7,.2,1), top 0.92s cubic-bezier(.2,.7,.2,1), width 0.92s cubic-bezier(.2,.7,.2,1), height 0.92s cubic-bezier(.2,.7,.2,1), transform 0.92s cubic-bezier(.2,.7,.2,1), background-color 0.32s ease, border-radius 0.32s ease, opacity 0.32s ease";
    requestAnimationFrame(()=>{
      dot.style.left = targetX + "px";
      dot.style.top = targetY + "px";
      dot.style.width = "36px";
      dot.style.height = "36px";
      dot.style.borderRadius = "50%";
      dot.style.background = "var(--ink)";
      dot.style.color = "transparent";
      dot.textContent = "";
    });

    await sleep(920);

    document.body.classList.add("is-egg-fade");
    await sleep(620);

    dot.style.transition = "opacity 0.38s ease";
    dot.style.opacity = "0";
    await sleep(380);

    showGame();
    isTransitioning = false;
  }

  function showGame(){
    if(!eggGame) return;
    eggGame.hidden = false;
    eggGame.removeAttribute("hidden");
    eggGame.setAttribute("aria-hidden","false");
    if(eggVeil){
      eggVeil.classList.remove("is-on");
      setTimeout(()=> { eggVeil.hidden = true; eggVeil.setAttribute("hidden",""); }, 620);
    }
    initGame();
    // focus close for a11y but keep game playable
    setTimeout(()=> { if(eggScoreEl) eggScoreEl.focus && eggScoreEl.focus({preventScroll:true}); }, 100);
  }

  function closeGame(){
    isGameRunning = false;
    gameState = "idle";
    if(rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if(eggGame){
      eggGame.hidden = true;
      eggGame.setAttribute("aria-hidden","true");
    }
    if(eggOverlay){
      eggOverlay.classList.remove("is-hidden");
      eggMsg.textContent = "Press Space to start • Esc to exit";
    }
    document.body.classList.remove("is-egg-blur","is-egg-fade","body-lock");
    if(eggVeil){
      eggVeil.classList.remove("is-on");
      setTimeout(()=> { eggVeil.hidden = true; }, 320);
    }
    if(dotEl){
      const orig = dotEl._eggOrig || {};
      dotEl.classList.remove("dot-fly");
      dotEl.style.position = orig.position || "";
      dotEl.style.left = orig.left || "";
      dotEl.style.top = orig.top || "";
      dotEl.style.width = orig.width || "";
      dotEl.style.height = orig.height || "";
      dotEl.style.transform = orig.transform || "";
      dotEl.style.zIndex = orig.zIndex || "";
      dotEl.style.background = orig.background || "";
      dotEl.style.color = orig.color || "";
      dotEl.style.borderRadius = orig.borderRadius || "";
      dotEl.style.transition = orig.transition || "";
      dotEl.style.opacity = orig.opacity || "";
      dotEl.style.pointerEvents = "";
      dotEl.textContent = ".";
      // re-trigger blink
      void dotEl.offsetWidth;
    }
    isTransitioning = false;
    score = 0;
    obstacles = [];
    frame = 0;
    if(eggScoreEl) eggScoreEl.textContent = "00000";
  }

  // expose close globally for inline handler if needed
  window.__eggClose = closeGame;

  // also handle overlay click to start
  if(eggOverlay){
    eggOverlay.addEventListener("click", ()=>{
      if(gameState==="idle") startGame();
      else if(gameState==="over"){ resetGame(); startGame(); }
    });
  }

})();
