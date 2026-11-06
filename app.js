/* ==========================================================
   CONFIGURACIÓN: cambia aquí tu número de WhatsApp.
   Formato internacional sin "+" ni espacios: 51 + número (Perú).
   ========================================================== */
const WHATSAPP_NUMBER = "51908538355";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const soles = (c) => "S/ " + (c / 100).toFixed(2);
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Enlaces de WhatsApp ---------- */
function wireWhatsApp(root = document) {
  $$("[data-wa]", root).forEach((a) => {
    a.href = waLink(a.dataset.wa);
    a.target = "_blank";
    a.rel = "noopener";
  });
}
wireWhatsApp();

$("#waForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const biz = $("#waBiz").value;
  const need = $("#waMsg").value.trim();
  const msg = `Hola Alvaro, mi negocio es ${biz}.` + (need ? ` ${need}` : " Quiero saber qué sistema me sirve.");
  window.open(waLink(msg), "_blank", "noopener");
});

/* ---------- Selector de negocio ---------- */
const BUSINESS = {
  bodega: {
    problem: "Vendes rápido, fías a los vecinos y el internet no siempre acompaña.",
    product: "Caserito POS, plan Caja",
    anchor: "#caserito-demo",
    points: [
      "Escáner rápido: pasas el código y listo; 6* y el código suma seis de golpe.",
      "Fiado con límite por cliente, abonos y recordatorio por WhatsApp.",
      "Sigue vendiendo sin internet y envía las boletas cuando vuelve.",
      "Alertas de stock mínimo para que no te quedes sin lo que más sale.",
    ],
    wa: "Hola Alvaro, tengo una bodega y me interesa Caserito POS.",
  },
  licoreria: {
    problem: "Vendes por unidad, six-pack y caja, y el fin de semana no hay tiempo para nada.",
    product: "Caserito POS, plan Caja o Negocio",
    anchor: "#caserito-demo",
    points: [
      "Presentaciones: vendes la caja y el stock baja en botellas, solo.",
      "Cobro con Yape o QR que se confirma cuando llega el pago.",
      "Publicidad para WhatsApp e Instagram con la advertencia legal de licores ya puesta.",
      "Reporte de productos que no rotan, para armar combos y sacarlos.",
    ],
    wa: "Hola Alvaro, tengo una licorería y me interesa Caserito POS.",
  },
  restaurante: {
    problem: "Los pedidos se pierden entre el salón y la cocina, y dividir la cuenta es un lío.",
    product: "Caserito POS, plan Negocio",
    anchor: "#caserito",
    points: [
      "Plano de mesas con estado y tiempo de cada una.",
      "Pantalla de cocina por estación, con alerta cuando un plato se demora.",
      "Dividir la cuenta por consumo o en partes iguales, con propina.",
      "Recetas: al vender un plato se descuentan sus insumos.",
    ],
    wa: "Hola Alvaro, tengo un restaurante y me interesa Caserito POS.",
  },
  gas: {
    problem: "Tienes cilindros repartidos en muchos clientes y no siempre sabes cuáles ni desde cuándo.",
    product: "VegaFact",
    anchor: "#vegafact-demo",
    points: [
      "Cada cilindro con su etiqueta QR, su ubicación y su historial.",
      "Alquileres cobrados por período y garantías bien controladas.",
      "Reparto con evidencia de entrega y guías de remisión.",
      "Caja, compras, proveedores y varios almacenes.",
    ],
    wa: "Hola Alvaro, tengo una distribuidora de gases y me interesa VegaFact.",
  },
  web: {
    problem: "Tus clientes te buscan en Google y en el celular, y hoy no te encuentran.",
    product: "Una página web para tu negocio",
    anchor: "#web-demo",
    points: [
      "Tu nombre, tus productos, tu horario y tu ubicación en un solo enlace.",
      "Botón que abre WhatsApp con el pedido ya escrito.",
      "Se ve bien en el celular y carga rápido con datos móviles.",
      "Tú me pides los cambios y yo los hago.",
    ],
    wa: "Hola Alvaro, quiero una página web para mi negocio.",
  },
  software: {
    problem: "Ya tienes tu sistema y solo necesitas que emita comprobantes electrónicos.",
    product: "ApiFact",
    anchor: "#apifact-demo",
    points: [
      "Mandas un JSON; recibes la respuesta de SUNAT.",
      "Facturas, boletas, notas, resumen diario y bajas.",
      "Sin duplicados aunque repitas la solicitud.",
      "Hoy en el entorno de pruebas de SUNAT; te aviso cuando pase a producción.",
    ],
    wa: "Hola Alvaro, tengo un sistema propio y me interesa integrar ApiFact.",
  },
  otro: {
    problem: "Tu negocio funciona distinto y ningún programa de tienda te calza.",
    product: "Un sistema a medida",
    anchor: "#sobre-mi",
    points: [
      "Conversamos cómo trabajas hoy y qué te quita tiempo.",
      "Te propongo algo simple primero y lo hacemos crecer contigo.",
      "Web, celular o ambos; con facturación electrónica si la necesitas.",
      "Respaldos y datos separados desde el inicio.",
    ],
    wa: "Hola Alvaro, necesito un sistema a medida para mi negocio.",
  },
};

function renderBusiness(key) {
  const b = BUSINESS[key];
  const panel = $("#pick-panel");
  panel.innerHTML = `
    <p class="pick__problem"></p>
    <p class="pick__product">Te recomiendo: <strong></strong></p>
    <ul class="pick__list">${b.points.map(() => "<li></li>").join("")}</ul>
    <div class="pick__actions">
      <a class="btn btn--wa" data-wa="">Consultar por WhatsApp</a>
      <a class="btn btn--ghost" href="${b.anchor}">Ver cómo funciona</a>
    </div>`;
  $(".pick__problem", panel).textContent = b.problem;
  $(".pick__product strong", panel).textContent = b.product;
  $$(".pick__list li", panel).forEach((li, i) => (li.textContent = b.points[i]));
  $("[data-wa]", panel).dataset.wa = b.wa;
  wireWhatsApp(panel);
  window.Motion?.swap?.(panel);
}
const bizTabs = $$("[data-biz]");
bizTabs.forEach((t) =>
  t.addEventListener("click", () => {
    bizTabs.forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    renderBusiness(t.dataset.biz);
  })
);
$(".picker__tabs").addEventListener("keydown", (e) => {
  if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
  e.preventDefault();
  const i = bizTabs.indexOf(document.activeElement);
  const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
  const next = bizTabs[(i + step + bizTabs.length) % bizTabs.length];
  next.focus();
  next.click();
});
renderBusiness("bodega");

/* ==========================================================
   Demo Caserito POS
   ========================================================== */
const PRODUCTS = [
  { id: "pilsen", code: "7751001", name: "Pilsen Callao", detail: "Botella 630 ml", price: 750, adult: true },
  { id: "six", code: "7751006", name: "Six-pack Pilsen", detail: "6 latas 355 ml", price: 4500, adult: true },
  { id: "cristal", code: "7751002", name: "Cristal", detail: "Botella 650 ml", price: 700, adult: true },
  { id: "inca", code: "7751010", name: "Gaseosa amarilla", detail: "1.5 L", price: 850 },
  { id: "agua", code: "7751020", name: "Agua sin gas", detail: "625 ml", price: 200 },
  { id: "pisco", code: "7751030", name: "Pisco quebranta", detail: "700 ml", price: 4200, adult: true },
  { id: "ron", code: "7751031", name: "Ron añejo", detail: "750 ml", price: 3890, adult: true },
  { id: "hielo", code: "7751040", name: "Hielo", detail: "Bolsa 3 kg", price: 500 },
  { id: "papas", code: "7751050", name: "Papas fritas", detail: "Bolsa 180 g", price: 450 },
];
const FIADO = { name: "María Flores Condori", limit: 20000, used: 6500 };

const pos = {
  cart: new Map(),
  method: "efectivo",
  qrPaid: false,
  online: true,
  pending: 0,
  number: 245,
  syncing: false,
};

const posGrid = $("#posGrid");
posGrid.innerHTML = PRODUCTS.map(
  (p) => `<button class="prod" type="button" data-id="${p.id}">
      <span class="prod__code">${p.code}</span>
      <span class="prod__name">${p.name}</span>
      <span class="prod__detail">${p.detail}</span>
      <span class="prod__price">${soles(p.price)}</span>
      ${p.adult ? '<span class="prod__adult" title="Venta solo a mayores de 18">+18</span>' : ""}
    </button>`
).join("");
posGrid.addEventListener("click", (e) => {
  const b = e.target.closest(".prod");
  if (!b) return;
  addToCart(b.dataset.id, 1);
  done("tap");
});

function addToCart(id, qty) {
  pos.cart.set(id, (pos.cart.get(id) || 0) + qty);
  if (pos.cart.get(id) <= 0) pos.cart.delete(id);
  renderCart(id);
}

function totals() {
  let total = 0;
  for (const [id, q] of pos.cart) total += PRODUCTS.find((p) => p.id === id).price * q;
  const base = Math.round(total / 1.18);
  return { total, base, igv: total - base };
}

function renderCart(changedId) {
  const list = $("#cartList");
  if (!pos.cart.size) {
    list.innerHTML = '<li class="cart__empty">Toca un producto o escanea un código para empezar.</li>';
  } else {
    list.innerHTML = [...pos.cart]
      .map(([id, q]) => {
        const p = PRODUCTS.find((x) => x.id === id);
        return `<li class="line" data-id="${id}">
          <div><div class="line__name">${p.name}</div><div class="line__sub">${p.detail} · ${soles(p.price)} c/u</div></div>
          <div class="line__total">${soles(p.price * q)}</div>
          <div class="qty" aria-label="Cantidad de ${p.name}">
            <button type="button" data-q="-1" data-id="${id}" aria-label="Quitar uno">−</button>
            <span>${q}</span>
            <button type="button" data-q="1" data-id="${id}" aria-label="Agregar uno">+</button>
          </div>
        </li>`;
      })
      .join("");
  }
  const t = totals();
  $("#cartSum").innerHTML = `<dt>Op. gravada</dt><dd>${soles(t.base)}</dd><dt>IGV 18%</dt><dd>${soles(t.igv)}</dd>`;
  if (window.Motion?.enabled) Motion.total($("#cartTotal"), t.total, soles);
  else $("#cartTotal").textContent = soles(t.total);
  if (changedId) window.Motion?.line?.($(`#cartList .line[data-id="${changedId}"]`));
  $("#payBtn").disabled = t.total === 0;
}
$("#cartList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-q]");
  if (b) addToCart(b.dataset.id, Number(b.dataset.q));
});

/* Escáner */
$("#scanForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#scanInput");
  const msg = $("#scanMsg");
  let raw = input.value.trim();
  if (!raw) return;
  let qty = 1;
  const m = raw.match(/^(\d{1,3})\s*\*\s*(.+)$/);
  if (m) { qty = Number(m[1]); raw = m[2]; }
  const q = norm(raw);
  const p = PRODUCTS.find((x) => x.code === q) || PRODUCTS.find((x) => norm(x.name).includes(q));
  msg.classList.remove("is-err", "is-ok");
  if (!p || qty < 1) {
    msg.textContent = `No encontré “${raw}”. Prueba con el código 7751001 o escribe “pilsen”.`;
    msg.classList.add("is-err");
    return;
  }
  addToCart(p.id, qty);
  msg.textContent = `Agregado: ${qty} × ${p.name}.`;
  msg.classList.add("is-ok");
  input.value = "";
  if (m) done("scan");
});

/* Internet y sincronización */
$("#netToggle").addEventListener("change", (e) => {
  pos.online = e.target.checked;
  $("#netLabel").textContent = pos.online ? "Con internet" : "Sin internet";
  if (pos.online) syncPending();
  renderSync();
});
function renderSync() {
  const b = $("#syncBadge");
  const before = b.textContent;
  if (pos.pending > 0) {
    b.textContent = pos.online ? `Enviando ${pos.pending}…` : `${pos.pending} por enviar`;
    b.classList.add("is-pending");
  } else {
    b.textContent = pos.online ? "Todo enviado" : "Sin conexión, sigue vendiendo";
    b.classList.toggle("is-pending", !pos.online);
  }
  if (before !== b.textContent) window.Motion?.pulse?.(b);
}
async function syncPending() {
  if (pos.syncing) return;
  pos.syncing = true;
  while (pos.online && pos.pending > 0) {
    renderSync();
    await wait(900);
    if (!pos.online) break;
    pos.pending--;
    $$(".js-sale-state").forEach((el) => {
      if (el.dataset.state === "pending") {
        el.dataset.state = "sent";
        el.textContent = "Enviada a SUNAT (demo)";
      }
    });
  }
  pos.syncing = false;
  renderSync();
}

/* Cobro */
const payPanel = $("#payPanel");
$("#payBtn").addEventListener("click", openPay);
$("#payClose").addEventListener("click", closePay);
document.addEventListener("keydown", (e) => {
  if (e.key === "F12" && document.activeElement && $("#caserito-demo").contains(document.activeElement) && totals().total > 0) {
    e.preventDefault();
    openPay();
  }
  if (e.key === "Escape" && !payPanel.hidden) closePay();
});
function openPay() {
  pos.qrPaid = false;
  setMethod("efectivo");
  payPanel.hidden = false;
  $("[data-method='efectivo']").focus();
}
function closePay() {
  payPanel.hidden = true;
  $("#payBtn").focus();
}
$$("[data-method]").forEach((b) => b.addEventListener("click", () => setMethod(b.dataset.method)));

function setMethod(m) {
  pos.method = m;
  pos.qrPaid = false;
  $$("[data-method]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.method === m)));
  $("#payErr").textContent = "";
  const { total } = totals();
  const body = $("#payBody");
  if (m === "efectivo") {
    const opts = [...new Set([total, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000, Math.ceil(total / 10000) * 10000])];
    body.innerHTML = `
      <p class="pay__total">${soles(total)}</p>
      <label for="cashIn">Recibido</label>
      <input id="cashIn" type="text" inputmode="decimal" value="${(total / 100).toFixed(2)}">
      <div class="pay__quick">${opts.map((o) => `<button type="button" data-cash="${o}">${soles(o)}</button>`).join("")}</div>
      <p class="pay__change" id="cashChange"></p>`;
    const upd = () => {
      const got = Math.round(parseFloat($("#cashIn").value.replace(",", ".")) * 100);
      $("#cashChange").textContent = Number.isFinite(got) && got >= total ? `Vuelto: ${soles(got - total)}` : "Falta dinero para completar el cobro.";
    };
    $("#cashIn").addEventListener("input", upd);
    $$("[data-cash]", body).forEach((b) => b.addEventListener("click", () => { $("#cashIn").value = (b.dataset.cash / 100).toFixed(2); upd(); }));
    upd();
  } else if (m === "qr") {
    body.innerHTML = `
      <p class="pay__total">${soles(total)}</p>
      <div class="qr">
        <div class="qr__img" id="qrImg" role="img" aria-label="Código QR de pago (demo)"></div>
        <div>
          <p id="qrState"><span class="state">Esperando el pago</span></p>
          <p style="font-size:.85rem;color:var(--ink3);margin-top:6px">El cliente escanea con su app. Cuando el banco avisa, la venta se confirma sola.</p>
          <button class="link" type="button" id="qrSim">Simular que el cliente pagó</button>
        </div>
      </div>`;
    if (!pos.online) {
      $("#qrState").innerHTML = '<span class="state">Sin internet: confirma a mano con el n.º de operación</span>';
    }
    $("#qrSim").addEventListener("click", () => {
      pos.qrPaid = true;
      const img = $("#qrImg");
      img.classList.add("is-paid");
      img.textContent = "✓";
      $("#qrState").innerHTML = '<span class="state state--ok">Pago recibido</span>';
      setTimeout(() => { if (pos.method === "qr" && !payPanel.hidden) confirmSale(); }, 700);
    });
  } else {
    const avail = FIADO.limit - FIADO.used;
    body.innerHTML = `
      <p class="pay__total">${soles(total)}</p>
      <div class="client">
        <strong>${FIADO.name}</strong>
        <span style="font-size:.88rem;color:var(--ink2)">Debe ${soles(FIADO.used)} de un límite de ${soles(FIADO.limit)}. Disponible: ${soles(avail)}.</span>
        <div class="meter" aria-hidden="true"><span style="width:${Math.min(100, (FIADO.used / FIADO.limit) * 100)}%"></span></div>
      </div>`;
  }
}

$("#payConfirm").addEventListener("click", confirmSale);
function confirmSale() {
  const { total } = totals();
  const err = $("#payErr");
  err.textContent = "";
  if (!total) return;
  if (pos.method === "efectivo") {
    const got = Math.round(parseFloat($("#cashIn").value.replace(",", ".")) * 100);
    if (!Number.isFinite(got) || got < total) {
      err.textContent = `El monto recibido no alcanza. Faltan ${soles(total - (Number.isFinite(got) ? got : 0))}.`;
      return;
    }
  }
  if (pos.method === "qr" && !pos.qrPaid && pos.online) {
    err.textContent = "El pago QR todavía no llega. Usa “Simular que el cliente pagó”.";
    return;
  }
  if (pos.method === "fiado") {
    const avail = FIADO.limit - FIADO.used;
    if (total > avail) {
      err.textContent = `Supera el límite de fiado: le quedan ${soles(avail)}. Cobra una parte en efectivo o quita productos.`;
      return;
    }
    FIADO.used += total;
    done("fiado");
  }
  printSale();
  if (!pos.online) done("offline");
  pos.cart.clear();
  renderCart();
  payPanel.hidden = true;
}

function printSale() {
  const { total, base, igv } = totals();
  pos.number++;
  const num = "B001-" + String(pos.number).padStart(6, "0");
  const now = new Date();
  const fecha = now.toLocaleDateString("es-PE") + " " + now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  const metodo = { efectivo: "Efectivo", qr: "Yape / QR", fiado: "Fiado: " + FIADO.name }[pos.method];
  if (pos.online) {
    // en línea: se envía al momento
  } else {
    pos.pending++;
  }
  const lines = [...pos.cart]
    .map(([id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return `<p>${q} × ${p.name}</p><p class="t-row"><span>&nbsp;&nbsp;${soles(p.price)}</span><span>${soles(p.price * q)}</span></p>`;
    })
    .join("");
  const hasAdult = [...pos.cart.keys()].some((id) => PRODUCTS.find((p) => p.id === id).adult);
  const slot = $("#receiptSlot");
  slot.innerHTML = `
    <div class="paper paper--sale" role="region" aria-label="Boleta ${num}">
      <div class="paper__in">
        <p class="t-center t-strong">LICORERÍA EL BRINDIS</p>
        <p class="t-center">RUC 20000000001</p>
        <p class="t-rule"></p>
        <p class="t-center t-strong">BOLETA DE VENTA ELECTRÓNICA</p>
        <p class="t-center">${num}</p>
        <p class="t-center">${fecha}</p>
        <p class="t-rule"></p>
        ${lines}
        <p class="t-rule"></p>
        <p class="t-row"><span>Op. gravada</span><span>${soles(base)}</span></p>
        <p class="t-row"><span>IGV 18%</span><span>${soles(igv)}</span></p>
        <p class="t-row t-strong"><span>TOTAL</span><span>${soles(total)}</span></p>
        <p class="t-rule"></p>
        <p>Pago: ${metodo}</p>
        ${hasAdult ? '<p class="t-small">Prohibida la venta a menores de 18 años.</p>' : ""}
        <p class="t-center"><span class="t-stamp js-sale-state" data-state="${pos.online ? "sent" : "pending"}">${pos.online ? "Enviada a SUNAT (demo)" : "Guardada sin internet"}</span></p>
        <p class="t-center t-small" style="margin-top:6px">Demo sin valor tributario</p>
      </div>
    </div>`;
  window.Motion?.print?.($(".paper--sale", slot));
  renderSync();
}

/* Recorrido guiado */
function done(task) {
  const li = $(`#tour [data-task="${task}"]`);
  if (li && !li.classList.contains("is-done")) {
    li.classList.add("is-done");
    window.Motion?.done?.(li);
  }
}

renderCart();
renderSync();

/* ==========================================================
   Demo VegaFact: ciclo de un cilindro
   ========================================================== */
const RATE = 150; // S/ 1.50 por día
const DEPOSIT = 25000;
const CLIENT = "Metalmecánica Santa Rosa SAC";
let cyl;

function cylInit() {
  cyl = { st: "almacen", day: 0, start: null, paidUntil: null, debt: 0, deposit: 0, collected: 0, guide: 31, log: [] };
  cylLog("Día 0", "Cilindro lleno e inspeccionado en el almacén principal.");
  renderCyl();
}
function cylLog(when, text) { cyl.log.unshift({ when, text }); }
function daysOut() { return cyl.start === null ? 0 : cyl.day - cyl.start; }

const CYL_ACTIONS = {
  almacen: [
    { label: `Entregar a ${CLIENT}`, run() {
      cyl.st = "cliente"; cyl.start = cyl.day; cyl.paidUntil = cyl.day; cyl.deposit = DEPOSIT; cyl.guide++;
      cylLog(`Día ${cyl.day}`, `Entregado con guía T001-${String(cyl.guide).padStart(5, "0")}. Garantía de ${soles(DEPOSIT)} cobrada en caja. Empieza el alquiler a ${soles(RATE)} por día.`);
    } },
  ],
  cliente: [
    { label: "Pasar 15 días", ghost: true, run() {
      cyl.day += 15;
      cyl.debt = (cyl.day - cyl.paidUntil) * RATE;
      cylLog(`Día ${cyl.day}`, `El cilindro lleva ${daysOut()} días con el cliente. Alquiler pendiente: ${soles(cyl.debt)}.`);
    } },
    { label: "Cobrar alquiler del período", ghost: true, when: () => cyl.debt > 0, run() {
      const d = cyl.day - cyl.paidUntil;
      cylLog(`Día ${cyl.day}`, `Cobro de alquiler por ${d} días: ${soles(cyl.debt)}. Ese período ya no se puede cobrar dos veces.`);
      cyl.collected += cyl.debt; cyl.paidUntil = cyl.day; cyl.debt = 0;
    } },
    { label: "Registrar devolución", run() {
      const d = cyl.day - cyl.paidUntil;
      const owe = d * RATE;
      const back = cyl.deposit - owe;
      if (owe > 0) {
        cylLog(`Día ${cyl.day}`, `Devuelto vacío. Se liquidan ${d} días pendientes (${soles(owe)}) contra la garantía y se devuelven ${soles(back)}.`);
      } else {
        cylLog(`Día ${cyl.day}`, `Devuelto vacío. Alquiler al día: se devuelve la garantía completa de ${soles(cyl.deposit)}.`);
      }
      cyl.collected += owe; cyl.debt = 0; cyl.deposit = 0; cyl.st = "devuelto"; cyl.start = null;
    } },
  ],
  devuelto: [
    { label: "Inspeccionar y recargar", run() {
      cyl.day += 1; cyl.st = "almacen";
      cylLog(`Día ${cyl.day}`, "Inspección aprobada y recarga hecha. Vuelve al almacén, listo para otro cliente.");
    } },
  ],
};

function renderCyl() {
  $$("#cylRoute li").forEach((li) => li.classList.toggle("is-here", li.dataset.st === cyl.st));
  const level = cyl.st === "almacen" ? 1 : cyl.st === "cliente" ? Math.max(0.15, 1 - daysOut() / 60) : 0.04;
  const h = 218 * level;
  const fill = $("#cylFill");
  if (window.Motion?.enabled) Motion.fill(fill, 34 + 218 - h, h);
  else { fill.setAttribute("y", String(34 + 218 - h)); fill.setAttribute("height", String(h)); }
  const where = { almacen: "Almacén principal", cliente: CLIENT, devuelto: "Zona de inspección" }[cyl.st];
  $("#cylStats").innerHTML = `
    <div><dt>Dónde está</dt><dd>${where}</dd></div>
    <div><dt>Días con el cliente</dt><dd>${daysOut()}</dd></div>
    <div><dt>Alquiler por cobrar</dt><dd>${soles(cyl.debt)}</dd></div>
    <div><dt>Garantía en caja</dt><dd>${soles(cyl.deposit)}</dd></div>
    <div><dt>Alquiler cobrado</dt><dd>${soles(cyl.collected)}</dd></div>
    <div><dt>Día</dt><dd>${cyl.day}</dd></div>`;
  const acts = $("#cylActions");
  acts.innerHTML = "";
  CYL_ACTIONS[cyl.st].filter((a) => !a.when || a.when()).forEach((a) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn " + (a.ghost ? "btn--ghost" : "btn--ink");
    b.textContent = a.label;
    b.addEventListener("click", () => { a.run(); renderCyl(); const f = $("#cylActions button"); if (f) f.focus(); });
    acts.appendChild(b);
  });
  $("#cylLog").innerHTML = cyl.log.map((l) => `<li><b>${l.when}</b>${l.text}</li>`).join("");
  window.Motion?.logIn?.($("#cylLog li"));
}
$("#cylReset").addEventListener("click", cylInit);
cylInit();

/* ==========================================================
   Demo ApiFact: ruta de una factura
   ========================================================== */
let apiSent = null; // resultado guardado por Idempotency-Key
let apiBusy = false;

$("#apiSend").addEventListener("click", async () => {
  if (apiBusy) return;
  apiBusy = true;
  const steps = $$("#apiSteps li");
  const result = $("#apiResult");
  const timeout = $("#apiTimeout").checked;
  steps.forEach((s) => (s.className = ""));
  result.className = "api__result";
  result.innerHTML = "";
  $("#apiSend").disabled = true;
  $("#apiRepeat").hidden = true;
  for (let i = 0; i < steps.length; i++) {
    steps[i].classList.add("is-run");
    await wait(i === 4 ? 1100 : 550);
    steps[i].classList.remove("is-run");
    if (timeout && i === 4) {
      steps[i].classList.add("is-fail");
      result.classList.add("is-warn");
      result.innerHTML = "<strong>Estado: UNKNOWN</strong>SUNAT no respondió a tiempo. La factura no se reenvía sola para no duplicarla; se consulta su estado antes de volver a intentar.";
      apiSent = { status: "UNKNOWN" };
      break;
    }
    steps[i].classList.add("is-done");
  }
  if (!timeout) {
    result.classList.add("is-ok");
    result.innerHTML = "<strong>Aceptada por SUNAT (entorno beta)</strong>Gravado S/ 100.00, IGV S/ 18.00, total S/ 118.00. CDR: <code>La Factura numero F001-87, ha sido aceptada</code>";
    apiSent = { status: "ACCEPTED" };
  }
  $("#apiSend").disabled = false;
  $("#apiRepeat").hidden = false;
  apiBusy = false;
});

$("#apiRepeat").addEventListener("click", () => {
  const result = $("#apiResult");
  result.className = "api__result is-info";
  result.innerHTML = `<strong>Misma Idempotency-Key, mismo comprobante</strong>La API devuelve la factura F001-87 que ya existe (estado ${apiSent ? apiSent.status : "—"}). No crea otra ni la envía de nuevo a SUNAT.`;
});

/* ---------- Páginas web: boceto en vivo ---------- */
const WEB_TYPES = {
  bodega: {
    label: "bodega",
    tag: "Abarrotes, bebidas y más, a la vuelta de tu casa. Pide por WhatsApp y te lo llevamos.",
    nav: "Productos",
    section: "Lo más pedido",
    cta: "Pedir por WhatsApp",
    hours: "Lun a dom · 7:00 a 22:00",
    items: [["Arroz extra 5 kg", "S/ 24.90"], ["Aceite vegetal 1 L", "S/ 9.50"], ["Gaseosa 3 L", "S/ 12.00"]],
  },
  restaurante: {
    label: "restaurante",
    tag: "Menú del día, carta criolla y delivery en la zona. Reserva tu mesa o pide para llevar.",
    nav: "Carta",
    section: "Nuestra carta",
    cta: "Reservar o pedir",
    hours: "Mar a dom · 12:00 a 22:00",
    items: [["Lomo saltado", "S/ 28.00"], ["Ají de gallina", "S/ 22.00"], ["Chicha morada 1 L", "S/ 8.00"]],
  },
  licoreria: {
    label: "licorería",
    tag: "Cervezas, piscos y vinos con delivery hasta medianoche. Hielo y piqueos para tu reunión.",
    nav: "Bebidas",
    section: "Lo más pedido",
    cta: "Pedir delivery",
    hours: "Todos los días · 10:00 a 00:00",
    items: [["Six pack de cerveza", "S/ 27.00"], ["Pisco quebranta 700 ml", "S/ 39.90"], ["Hielo en bolsa 3 kg", "S/ 6.00"]],
    legal: true,
  },
  servicios: {
    label: "negocio de servicios",
    tag: "Atención profesional con cita previa. Escríbenos y te respondemos el mismo día.",
    nav: "Servicios",
    section: "Servicios",
    cta: "Pedir una cita",
    hours: "Lun a sáb · 9:00 a 19:00",
    items: [["Diagnóstico", "Desde S/ 50"], ["Mantenimiento", "Desde S/ 120"], ["Atención a domicilio", "Consultar"]],
  },
};
const COLOR_NAMES = { "#d9480f": "naranja", "#8e1b3a": "vino", "#2e6bc6": "azul", "#1c7a5a": "verde", "#14203a": "azul noche" };
const web = { type: "bodega", color: "#d9480f", view: "pc" };
// Nombre de ejemplo por tipo; solo se cambia si el visitante no escribió el suyo.
const WEB_SAMPLE = { bodega: "Bodega Don Lucho", restaurante: "Sabor Norteño", licoreria: "Licorería La Esquina", servicios: "Taller Ramírez" };

const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "") || "tunegocio";

function renderWeb() {
  const t = WEB_TYPES[web.type];
  const name = $("#webName").value.trim() || "Tu negocio";
  const prev = $("#webPreview");
  prev.style.setProperty("--brand", web.color);
  prev.dataset.view = web.view;
  $("#webUrl").textContent = slug(name) + ".pe";
  $("#webLogo").textContent = name.charAt(0).toUpperCase();
  $("#webBrand").textContent = name;
  $("#webTitle").textContent = name;
  $("#webTag").textContent = t.tag;
  $("#webCta").textContent = t.cta;
  $("#webNavItems").textContent = t.nav;
  $("#webSection").textContent = t.section;
  $("#webHours").textContent = t.hours;
  $("#webLegal").hidden = !t.legal;
  const list = $("#webItems");
  list.innerHTML = t.items.map(() => '<li><span class="site__img"></span><span class="site__item"></span><span class="site__price"></span></li>').join("");
  $$("li", list).forEach((li, i) => {
    $(".site__item", li).textContent = t.items[i][0];
    $(".site__price", li).textContent = t.items[i][1];
  });
  const wa = $("#webWa");
  wa.dataset.wa = `Hola Alvaro, quiero una página web para mi ${t.label} "${name}", en color ${COLOR_NAMES[web.color] || "a elegir"}. ¿Me cuentas cómo trabajas?`;
  wireWhatsApp(wa.parentElement);
}

function radioGroup(sel, attr, key) {
  const btns = $$(sel);
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      btns.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
      if (key === "type") {
        const input = $("#webName");
        if (!input.value.trim() || Object.values(WEB_SAMPLE).includes(input.value.trim())) input.value = WEB_SAMPLE[b.dataset[attr]];
      }
      web[key] = b.dataset[attr];
      renderWeb();
      window.Motion?.relayout?.();
    })
  );
}
radioGroup("[data-type]", "type", "type");
radioGroup("[data-color]", "color", "color");
radioGroup("[data-view]", "view", "view");
$("#webName").addEventListener("input", renderWeb);
$("#webForm").addEventListener("submit", (e) => e.preventDefault());
renderWeb();
