/* ==========================================================
   Movimiento (GSAP + ScrollTrigger)
   Regla: una sola secuencia sin interacción (el monograma del hero),
   dos efectos de scroll con significado (nombres de producto y
   la ruta de "Cómo empezamos"), y el resto solo responde a acciones.
   app.js llama a window.Motion?.x(); si GSAP no carga, nada se rompe.
   ========================================================== */
(() => {
  const root = document.documentElement;
  const M = (window.Motion = { enabled: false });
  if (!window.gsap) { root.classList.remove("motion"); return; }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.5 });

  /* ---------- Navegación: sección activa + cabecera ---------- */
  const nav = document.querySelector(".nav");
  const ind = document.querySelector(".nav__ind");
  const links = [...nav.querySelectorAll("a")];
  function setActive(link) {
    links.forEach((a) => (a === link ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    if (!ind) return;
    if (!link) { gsap.to(ind, { autoAlpha: 0, duration: reduce ? 0 : 0.2 }); return; }
    gsap.to(ind, {
      autoAlpha: 1,
      x: link.offsetLeft,
      scaleX: link.offsetWidth / 100,
      duration: reduce ? 0 : 0.45,
      ease: "power3.inOut",
    });
  }
  if (window.ScrollTrigger) {
    // Sección activa: la que cruza la línea del 45 % de la pantalla.
    const secs = links.map((a) => [a, document.querySelector(a.getAttribute("href"))]).filter((x) => x[1]);
    let current;
    const spy = (force) => {
      const line = window.innerHeight * 0.45;
      let hit = null;
      for (const [a, sec] of secs) {
        const r = sec.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) hit = a;
      }
      if (hit !== current || force === true) { current = hit; setActive(hit); }
    };
    window.addEventListener("scroll", spy, { passive: true });
    ScrollTrigger.addEventListener("refresh", () => spy(true));
    spy();
    ScrollTrigger.create({
      start: 8,
      end: "max",
      toggleClass: { targets: ".top", className: "is-scrolled" },
    });

    // El botón flotante aparece cuando ya pasaste el hero (ahí ya hay botones de WhatsApp).
    const fab = document.querySelector(".wa-float");
    gsap.set(fab, { autoAlpha: 0, scale: 0.6 });
    ScrollTrigger.create({
      trigger: ".hero",
      start: "bottom 30%",
      onEnter: () => gsap.to(fab, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.4, ease: "back.out(2)" }),
      onLeaveBack: () => gsap.to(fab, { autoAlpha: 0, scale: 0.6, duration: reduce ? 0 : 0.25, ease: "power2.in" }),
    });
  }

  // Las demos cambian la altura de la página (boletas, historial, selector):
  // recalcular las posiciones de scroll poco después de cada cambio.
  const relayout = window.ScrollTrigger ? gsap.delayedCall(0.35, () => ScrollTrigger.refresh()).pause() : null;
  M.relayout = () => relayout && relayout.restart(true);

  if (reduce) {
    root.classList.remove("motion");
    ["swap", "print", "logIn"].forEach((k) => (M[k] = M.relayout));
    return;
  }
  M.enabled = true;

  /* ---------- Hero: el monograma metálico se enciende ---------- */
  const hero = gsap.timeline({ defaults: { ease: "power3.out" } });
  hero
    .fromTo(".hero .eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
    .fromTo(".hero h1", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.3")
    .fromTo(".hero .lead", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.55")
    .fromTo(".hero .actions > *", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 }, "-=0.4")
    .fromTo(".hero__facts", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.25")
    // La luz sube sobre el metal: de casi apagado a su brillo normal.
    .fromTo(
      ".hero__mark img",
      { autoAlpha: 0, scale: 0.94, filter: "brightness(0.25)" },
      { autoAlpha: 1, scale: 1, filter: "brightness(1)", duration: 1.8, ease: "power2.out" },
      0.2
    );

  /* ---------- Scroll: nombres de producto ---------- */
  if (window.ScrollTrigger) {
    gsap.utils.toArray(".product__name").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 100% 0% 0%)", x: -24 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          x: 0,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

    /* ---------- Scroll: la ruta de "Cómo empezamos" se dibuja ---------- */
    const steps = gsap.utils.toArray(".process li");
    gsap.set(steps, { "--draw": 0 });
    const route = gsap.timeline({
      scrollTrigger: { trigger: ".process", start: "top 80%", end: "bottom 60%", scrub: 0.6 },
    });
    steps.forEach((li, i) => {
      route
        .fromTo(li, { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 0.4, ease: "none" }, i * 0.5)
        .to(li, { "--draw": 1, duration: 0.5, ease: "none" }, i * 0.5 + 0.2);
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- Respuestas a acciones ---------- */
  M.swap = (panel) => {
    M.relayout();
    gsap.fromTo(panel.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, overwrite: true });
  };

  const totalState = { v: 0 };
  M.total = (el, cents, fmt) => {
    gsap.to(totalState, {
      v: cents,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => (el.textContent = fmt(Math.round(totalState.v))),
    });
  };

  M.line = (li) => {
    if (!li) return;
    gsap.fromTo(li, { backgroundColor: "#f8e3ea" }, { backgroundColor: "rgba(248,227,234,0)", duration: 0.9, ease: "power1.out", clearProps: "backgroundColor" });
    const q = li.querySelector(".qty span");
    if (q) gsap.fromTo(q, { scale: 1.35 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
  };

  M.print = (el) => {
    M.relayout();
    if (!el) return;
    el.style.animation = "none";
    gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "steps(16)" });
  };

  M.pulse = (el) => gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });

  M.done = (li) => gsap.fromTo(li, { backgroundColor: "#e2f4ea", x: 6 }, { backgroundColor: "#ffffff", x: 0, duration: 0.6, clearProps: "backgroundColor" });

  M.fill = (rect, y, h) => gsap.to(rect, { attr: { y, height: h }, duration: 0.9, ease: "power2.inOut" });

  M.logIn = (li) => li && (M.relayout(), true) && gsap.fromTo(li, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4 });

  // Preguntas: la respuesta entra suave al abrir
  document.querySelectorAll(".faq details").forEach((d) => {
    d.addEventListener("toggle", () => {
      M.relayout();
      if (d.open) gsap.fromTo(d.querySelector("p"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35 });
    });
  });
})();
