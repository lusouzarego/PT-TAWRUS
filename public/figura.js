// Figura animada dos exercícios (SVG desenhado por código, sem imagens externas).
//
// Coordenadas: x para a frente (direita da tela), h = altura acima do chão.
// Ângulos absolutos em graus: 0 = para baixo, 90 = para a frente, 180 = para cima, -90 = para trás.
//
// Uma pose:
//   hip:   [x, h]            posição do quadril
//   torso: ângulo            quadril → pescoço
//   head:  ângulo            pescoço → cabeça (padrão = torso)
//   legL/legR/armL/armR:     { a: [sup, inf] }  ângulos dos dois segmentos, ou
//                            { to: [x, h], bend: 1 | -1 }  ponto final (tornozelo/mão) com
//                            a articulação do meio para um lado ou outro
//   footL/footR: ângulo do pé (padrão 90 = apoiado, apontando para a frente)
//   "L" é o lado de trás (mais escuro) na vista lateral e o lado esquerdo da tela na frontal.
//
// Um exercício: { view: "side" | "front", frames: [pose, pose, ...], props: {...} }
(function () {
  const L = { torso: 52, neck: 15, head: 10.5, upper: 29, fore: 27, thigh: 42, shin: 40, foot: 13 };

  // Personagem inspirada na Luana: cabelo longo castanho-claro com mechas mel, pele clara
  // e quente, olhos castanhos, colar de corrente e argolinha dourados, roupa em tons neutros.
  const C = {
    skin: "#ecc2a4", skinFar: "#d8a98a", blush: "#e3a08e",
    top: "#b89a86", topFar: "#9e8170",
    pants: "#2f2b3a", pantsFar: "#211e2b",
    shoe: "#ffffff", shoeLine: "#2f2b3a",
    hair: "#8a6748", hairLight: "#c39c6c",
    eye: "#4a2e22", lips: "#b9676a", gold: "#d4a93c",
    weight: "#3d3d46", mat: "#cfe0d8", chair: "#c9b29b", band: "#e98c7a",
  };

  const rad = (d) => (d * Math.PI) / 180;
  const dir = (a) => [Math.sin(rad(a)), -Math.cos(rad(a))];
  const add = (p, a, len) => { const d = dir(a); return [p[0] + d[0] * len, p[1] + d[1] * len]; };
  const ang = (p, q) => (Math.atan2(q[0] - p[0], -(q[1] - p[1])) * 180) / Math.PI;

  // Membro de dois segmentos: por ângulos ou pelo ponto final (IK de dois ossos).
  function limb(root, spec, l1, l2) {
    if (spec.a) {
      const mid = add(root, spec.a[0], l1);
      return [root, mid, add(mid, spec.a[1], l2)];
    }
    const t = spec.to, dx = t[0] - root[0], dy = t[1] - root[1];
    let d = Math.hypot(dx, dy);
    const max = l1 + l2 - 0.01;
    if (d > max) { // não alcança: estica na direção do alvo
      const a = ang(root, t);
      const mid = add(root, a, l1);
      return [root, mid, add(mid, a, l2)];
    }
    d = Math.max(d, Math.abs(l1 - l2) + 0.01);
    const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
    const ux = dx / d, uy = dy / d, b = spec.bend || 1;
    const mid = [root[0] + ux * x - uy * h * b, root[1] + uy * x + ux * h * b];
    return [root, mid, t.slice()];
  }

  // Interpolação entre poses (ângulos pelo caminho mais curto).
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpAng = (a, b, t) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };
  const lerpPt = (p, q, t) => [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  function lerpLimb(p, q, t) {
    if (p.a && q.a) return { a: [lerpAng(p.a[0], q.a[0], t), lerpAng(p.a[1], q.a[1], t)] };
    if (p.to && q.to) return { to: lerpPt(p.to, q.to, t), bend: t < 0.5 ? p.bend : q.bend };
    return t < 0.5 ? p : q;
  }
  function lerpPose(p, q, t) {
    const out = { hip: lerpPt(p.hip, q.hip, t), torso: lerpAng(p.torso, q.torso, t) };
    out.head = lerpAng(p.head ?? p.torso, q.head ?? q.torso, t);
    for (const k of ["legL", "legR", "armL", "armR"]) out[k] = lerpLimb(p[k], q[k], t);
    for (const k of ["footL", "footR"]) out[k] = lerpAng(p[k] ?? 90, q[k] ?? 90, t);
    return out;
  }

  // Calcula as articulações de uma pose.
  function solve(pose, view) {
    const front = view === "front";
    const hip = [pose.hip[0], pose.hip[1]];
    const neck = add(hip, pose.torso, L.torso);
    const head = add(neck, pose.head ?? pose.torso, L.neck);
    // Ombros e quadris afastados na vista frontal; sobrepostos na lateral.
    const side = (p, w) => [p[0] + w, p[1]];
    const shoulder = add(neck, pose.torso + 180, 5);
    const sh = front ? { L: side(shoulder, -15), R: side(shoulder, 15) } : { L: shoulder, R: shoulder };
    const hp = front ? { L: side(hip, -9), R: side(hip, 9) } : { L: hip, R: hip };
    const j = { hip, neck, head, sh, hp };
    for (const s of ["L", "R"]) {
      j["leg" + s] = limb(hp[s], pose["leg" + s], L.thigh, L.shin);
      j["arm" + s] = limb(sh[s], pose["arm" + s], L.upper, L.fore);
      const ankle = j["leg" + s][2];
      j["foot" + s] = [add(ankle, (pose["foot" + s] ?? 90) + 180, 3), add(ankle, pose["foot" + s] ?? 90, L.foot)];
    }
    return j;
  }

  // ── Desenho ─────────────────────────────────────────────────────────────
  const P = (p) => `${p[0].toFixed(1)},${(-p[1]).toFixed(1)}`;
  const seg = (a, b, w, color) =>
    `<line x1="${a[0].toFixed(1)}" y1="${(-a[1]).toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${(-b[1]).toFixed(1)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const dot = (p, r, color) => `<circle cx="${p[0].toFixed(1)}" cy="${(-p[1]).toFixed(1)}" r="${r}" fill="${color}"/>`;

  // Faixa com largura variável entre dois pontos (tronco).
  function band(a, b, wa, wb, color) {
    const d = [b[0] - a[0], b[1] - a[1]], n = Math.hypot(d[0], d[1]) || 1;
    const px = -d[1] / n, py = d[0] / n;
    const pts = [
      [a[0] + px * wa / 2, a[1] + py * wa / 2], [b[0] + px * wb / 2, b[1] + py * wb / 2],
      [b[0] - px * wb / 2, b[1] - py * wb / 2], [a[0] - px * wa / 2, a[1] - py * wa / 2],
    ];
    return `<polygon points="${pts.map(P).join(" ")}" fill="${color}" stroke="${color}" stroke-width="7" stroke-linejoin="round"/>`;
  }

  function dumbbell(hand, foreAngle, far) {
    const a = foreAngle + 90, p1 = add(hand, a, 9), p2 = add(hand, a + 180, 9);
    const c = far ? "#2c2c33" : C.weight;
    return seg(p1, p2, 3.5, c) + dot(p1, 5, c) + dot(p2, 5, c);
  }

  function drawLeg(j, s, far) {
    const [hp, knee, ankle] = j["leg" + s], [heel, toe] = j["foot" + s];
    const pants = far ? C.pantsFar : C.pants;
    return seg(hp, knee, 15, pants) + seg(knee, ankle, 12, pants) +
      seg(heel, toe, 8, C.shoeLine) + seg(heel, toe, 5.5, C.shoe);
  }

  function drawArm(j, s, far, props) {
    const [sh, elbow, hand] = j["arm" + s];
    const skin = far ? C.skinFar : C.skin;
    let out = seg(sh, elbow, 9.5, far ? C.topFar : C.top) + seg(elbow, hand, 8, skin) + dot(hand, 4.6, skin);
    if (props.weights) out += dumbbell(hand, ang(elbow, hand), far);
    return out;
  }

  function drawHead(j, view, facing) {
    const h = j.head, t = ang(j.neck, j.head);
    const up = (p, d) => add(p, t, d), fw = (p, d) => add(p, t + 90 * facing, d);
    let out = seg(j.neck, up(j.neck, 7), 7, C.skin);
    // Colar de corrente dourada na base do pescoço.
    out += `<path d="M${P(fw(up(j.neck, 1), -6))} Q${P(up(j.neck, -2.5))} ${P(fw(up(j.neck, 1), 6))}" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-linecap="round"/>`;
    if (view === "front") {
      out += dot(up(h, 2), L.head + 1.2, C.hair);
      out += dot(up(h, -1.2), L.head - 0.8, C.skin);
      // Franja lateral (repartido de lado) com mecha clara.
      out += `<path d="M${P(fw(up(h, 10.5), 3))} Q${P(fw(up(h, 6), -9))} ${P(fw(up(h, -4), -10.5))} L${P(fw(up(h, 4), -6))} Q${P(fw(up(h, 8), 0))} ${P(fw(up(h, 10.5), 3))} Z" fill="${C.hair}"/>`;
      out += `<path d="M${P(fw(up(h, 9), 1))} Q${P(fw(up(h, 5), -7))} ${P(fw(up(h, -2), -9))}" fill="none" stroke="${C.hairLight}" stroke-width="1.6" stroke-linecap="round"/>`;
      // Rosto: sobrancelhas, olhos castanhos, bochechas e sorriso.
      for (const sgn of [-1, 1]) {
        const eye = fw(up(h, 0.5), 3.8 * sgn);
        out += dot(eye, 1.25, C.eye);
        out += `<path d="M${P(fw(up(h, 3.3), 2.2 * sgn))} Q${P(fw(up(h, 4.4), 4 * sgn))} ${P(fw(up(h, 3.7), 5.8 * sgn))}" fill="none" stroke="${C.hair}" stroke-width="1" stroke-linecap="round"/>`;
        out += dot(fw(up(h, -3), 5.8 * sgn), 1.7, C.blush).replace("/>", ' opacity=".55"/>');
      }
      out += `<path d="M${P(fw(up(h, -4.6), -2.6))} Q${P(up(h, -6.6))} ${P(fw(up(h, -4.6), 2.6))}" fill="none" stroke="${C.lips}" stroke-width="1.3" stroke-linecap="round"/>`;
      for (const sgn of [-1, 1]) out += `<circle cx="${fw(up(h, -3), 10.3 * sgn)[0].toFixed(1)}" cy="${(-fw(up(h, -3), 10.3 * sgn)[1]).toFixed(1)}" r="1.2" fill="none" stroke="${C.gold}" stroke-width="0.8"/>`;
    } else {
      // Rabo de cavalo longo com mecha mel.
      const base = fw(up(h, 4), -8.5), mid = add(base, t - 150 * facing, 11), end = add(mid, t - 175 * facing, 10);
      out += seg(base, mid, 7, C.hair) + seg(mid, end, 5.5, C.hair);
      out += `<path d="M${P(base)} L${P(mid)} L${P(end)}" fill="none" stroke="${C.hairLight}" stroke-width="1.6" stroke-linecap="round"/>`;
      out += dot(fw(up(h, 1.6), -2.2), L.head + 0.8, C.hair);
      out += dot(fw(up(h, -1.4), 1.8), L.head - 1.2, C.skin);
      // Mecha clara no topo, olho, sobrancelha, bochecha, sorriso e argolinha.
      out += `<path d="M${P(fw(up(h, 10), 3))} Q${P(fw(up(h, 9), -6))} ${P(fw(up(h, 3), -10))}" fill="none" stroke="${C.hairLight}" stroke-width="1.6" stroke-linecap="round"/>`;
      out += dot(fw(up(h, 0.6), 6), 1.25, C.eye);
      out += `<path d="M${P(fw(up(h, 3.4), 4))} Q${P(fw(up(h, 4.4), 5.8))} ${P(fw(up(h, 3.8), 7.6))}" fill="none" stroke="${C.hair}" stroke-width="1" stroke-linecap="round"/>`;
      out += dot(fw(up(h, -3), 4.6), 1.8, C.blush).replace("/>", ' opacity=".55"/>');
      out += `<path d="M${P(fw(up(h, -4.8), 5.6))} Q${P(fw(up(h, -6), 7.4))} ${P(fw(up(h, -4.4), 8.6))}" fill="none" stroke="${C.lips}" stroke-width="1.2" stroke-linecap="round"/>`;
      const ear = fw(up(h, -4.2), -3);
      out += `<circle cx="${ear[0].toFixed(1)}" cy="${(-ear[1]).toFixed(1)}" r="1.2" fill="none" stroke="${C.gold}" stroke-width="0.8"/>`;
    }
    return out;
  }

  // Cabelo longo solto (vista de frente), desenhado atrás do corpo.
  function drawHairBack(j) {
    const h = j.head, t = ang(j.neck, j.head);
    const up = (p, d) => add(p, t, d), fw = (p, d) => add(p, t + 90, d);
    // Duas mechas longas caindo pelos ombros, uma de cada lado do pescoço.
    let out = "";
    for (const g of [-1, 1]) {
      const pts = [up(fw(h, 11 * g), 4), up(fw(h, 15 * g), -12), up(fw(h, 13.5 * g), -33), up(fw(h, 7.5 * g), -30),
        up(fw(h, 7.5 * g), -14), up(fw(h, 8.5 * g), -4)];
      out += `<path d="M${P(pts[0])} Q${P(pts[1])} ${P(pts[2])} L${P(pts[3])} Q${P(pts[4])} ${P(pts[5])} Z" fill="${C.hair}"/>`;
      out += `<path d="M${P(up(fw(h, 11.5 * g), -6))} Q${P(up(fw(h, 13 * g), -18))} ${P(up(fw(h, 11 * g), -30))}" fill="none" stroke="${C.hairLight}" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    return out;
  }

  function drawProps(props, bounds) {
    let out = "";
    if (props.mat) out += `<rect x="${bounds[0] - 14}" y="-3" width="${bounds[1] - bounds[0] + 28}" height="5" rx="2.5" fill="${C.mat}"/>`;
    if (props.chair) {
      const [x, w, h] = props.chair;
      out += `<rect x="${x}" y="${-h}" width="${w}" height="6" rx="2" fill="${C.chair}"/>` +
        seg([x + 4, h - 3], [x + 4, 0], 4, C.chair) + seg([x + w - 4, h - 3], [x + w - 4, 0], 4, C.chair);
    }
    return out;
  }

  function draw(def, pose) {
    const view = def.view || "side", props = def.props || {};
    const j = solve(pose, view);
    const facing = 1;
    const body =
      band(j.hip, add(j.hip, pose.torso, L.torso * 0.42), view === "front" ? 30 : 22, view === "front" ? 26 : 19, C.pants) +
      band(add(j.hip, pose.torso, L.torso * 0.38), j.neck, view === "front" ? 24 : 18, view === "front" ? 30 : 21, C.top);
    const band_ = props.band
      ? seg(lerpPt(j.legL[0], j.legL[1], 0.75), lerpPt(j.legR[0], j.legR[1], 0.75), 3, C.band)
      : "";
    if (view === "front") {
      return drawLeg(j, "L", false) + drawLeg(j, "R", false) + band_ + body + drawHairBack(j) +
        drawArm(j, "L", false, props) + drawArm(j, "R", false, props) + drawHead(j, view, facing);
    }
    return drawArm(j, "L", true, props) + drawLeg(j, "L", true) + band_ + body +
      drawLeg(j, "R", false) + drawHead(j, view, facing) + drawArm(j, "R", false, props);
  }

  // Caixa que cabe todos os quadros (para o enquadramento não pular).
  function extent(def) {
    let x0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const f of def.frames) {
      const j = solve(f, def.view);
      const pts = [j.head, j.neck, j.hip, ...j.legL, ...j.legR, ...j.armL, ...j.armR, ...j.footL, ...j.footR];
      for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    }
    if (def.props && def.props.chair) { x0 = Math.min(x0, def.props.chair[0]); x1 = Math.max(x1, def.props.chair[0] + def.props.chair[1]); }
    return { x0: x0 - 26, x1: x1 + 26, top: y1 + 22 };
  }

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // Pose no instante t (segundos): vai e volta entre os quadros, com pausa em cada um.
  function poseAt(def, t) {
    const fr = def.frames, n = fr.length;
    const move = def.move ?? 0.9, hold = def.hold ?? 0.35;
    const seq = n === 2 ? [0, 1] : [...fr.keys()];
    const loop = def.loop ?? (n === 2 ? [0, 1, 0] : [...seq, 0]);
    const legs = loop.length - 1, per = move + hold, total = legs * per;
    const u = ((t % total) + total) % total, i = Math.floor(u / per), r = u - i * per;
    const k = r < hold ? 0 : ease((r - hold) / move);
    return lerpPose(fr[loop[i]], fr[loop[i + 1]], k);
  }

  function svg(def, pose, opts = {}) {
    const e = extent(def), w = e.x1 - e.x0, h = e.top + 14;
    const ground = `<ellipse cx="${((e.x0 + e.x1) / 2).toFixed(1)}" cy="2" rx="${(w / 2 - 10).toFixed(1)}" ry="4" fill="#000" opacity=".06"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${e.x0.toFixed(1)} ${(-e.top).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}"` +
      ` width="${opts.width || "100%"}" height="${opts.height || "100%"}" preserveAspectRatio="xMidYMax meet">` +
      ground + drawProps(def.props || {}, [e.x0 + 26, e.x1 - 26]) + draw(def, pose) + `</svg>`;
  }

  // Anima dentro de um elemento. Devolve uma função para parar.
  function animate(el, def) {
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      el.innerHTML = svg(def, poseAt(def, (now - start) / 1000));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  window.Figura = { svg, animate, poseAt, frame: (def, i) => svg(def, def.frames[i]) };
})();
