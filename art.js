/* Destrava Kids — illustrations drawn in code (one consistent cartoon style, no emoji).
   ART.html(key) returns an <svg>. Keys: "dog", "balloon:#E53935", "num:3", ...
   Anything without a drawing yet falls back to the emoji passed as key. */
(function(){
"use strict";
const INK = "#3B2A20";
const OL = ` stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const OL3 = ` stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
const SKIN = "#FFD2AE", SKIN2 = "#E9AC82";
const shadow = (w = 56, y = 184) => `<ellipse cx="100" cy="${y}" rx="${w}" ry="8" fill="#000" opacity=".12"/>`;
const eye = (x, y, r = 9) => `<ellipse cx="${x}" cy="${y}" rx="${r*.82}" ry="${r}" fill="${INK}"/><circle cx="${x + r*.3}" cy="${y - r*.38}" r="${r*.34}" fill="#fff"/>`;
const bigEye = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r*.85}" ry="${r}" fill="${INK}"/><circle cx="${x + r*.3}" cy="${y - r*.35}" r="${r*.38}" fill="#fff"/><circle cx="${x - r*.3}" cy="${y + r*.38}" r="${r*.16}" fill="#fff"/>`;
const cheeks = (x1, x2, y, s = 1) => `<ellipse cx="${x1}" cy="${y}" rx="${11*s}" ry="${7*s}" fill="#FF7F9A" opacity=".5"/><ellipse cx="${x2}" cy="${y}" rx="${11*s}" ry="${7*s}" fill="#FF7F9A" opacity=".5"/>`;
const smile = (x, y, w = 14) => `<path d="M${x-w} ${y} Q${x} ${y + w*.95} ${x+w} ${y}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
const shine = (x, y, rx, ry, rot = -25) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".4" transform="rotate(${rot} ${x} ${y})"/>`;
const heart = (cx, cy, s, c = "#FF5FA2") => `<path d="M${cx} ${cy + s*.9} C${cx - s*1.7} ${cy - s*.1} ${cx - s*.85} ${cy - s*1.25} ${cx} ${cy - s*.42} C${cx + s*.85} ${cy - s*1.25} ${cx + s*1.7} ${cy - s*.1} ${cx} ${cy + s*.9} Z" fill="${c}"${OL}/>`;
function star(cx, cy, r, c = "#FFC21A", ol = OL){ let d = ""; for (let i = 0; i < 10; i++){ const a = -Math.PI/2 + i * Math.PI/5, rr = i % 2 ? r * .48 : r; d += (i ? "L" : "M") + (cx + Math.cos(a)*rr).toFixed(1) + " " + (cy + Math.sin(a)*rr).toFixed(1); } return `<path d="${d}Z" fill="${c}"${ol}/>`; }
const sparkle = (x, y, s = 10, c = "#FFC21A") => `<path d="M${x} ${y-s} Q${x} ${y} ${x+s} ${y} Q${x} ${y} ${x} ${y+s} Q${x} ${y} ${x-s} ${y} Q${x} ${y} ${x} ${y-s} Z" fill="${c}"/>`;

/* a round cartoon person face, used for people and feelings */
function face(cx, cy, r, o = {}){
  const skin = o.skin || SKIN, hair = o.hair, mood = o.mood || "happy";
  const ex = r * .36, ey = cy + r * .02, er = r * .14;
  let s = "";
  if (o.style === "long") s += `<path d="M${cx - r*1.1} ${cy} C${cx - r*1.2} ${cy - r*1.35} ${cx + r*1.2} ${cy - r*1.35} ${cx + r*1.1} ${cy} L${cx + r*1.08} ${cy + r*.98} C${cx + r*.6} ${cy + r*1.12} ${cx - r*.6} ${cy + r*1.12} ${cx - r*1.08} ${cy + r*.98} Z" fill="${hair}"${OL}/>`;
  if (o.style === "pigtails") s += `<circle cx="${cx - r*1.02}" cy="${cy - r*.25}" r="${r*.4}" fill="${hair}"${OL}/><circle cx="${cx + r*1.02}" cy="${cy - r*.25}" r="${r*.4}" fill="${hair}"${OL}/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${skin}"${OL}/>`;
  if (hair && o.style !== "curl") s += `<path d="M${cx - r*.99} ${cy - r*.08} C${cx - r*1.06} ${cy - r*1.32} ${cx + r*1.06} ${cy - r*1.32} ${cx + r*.99} ${cy - r*.08} C${cx + r*.72} ${cy - r*.52} ${cx + r*.15} ${cy - r*.62} ${cx - r*.18} ${cy - r*.5} C${cx - r*.52} ${cy - r*.42} ${cx - r*.82} ${cy - r*.32} ${cx - r*.99} ${cy - r*.08} Z" fill="${hair}"${OL}/>`;
  if (o.style === "curl") s += `<path d="M${cx - r*.05} ${cy - r*.98} c${-r*.08} ${-r*.32} ${r*.36} ${-r*.42} ${r*.3} ${-r*.1}" fill="none" stroke="${hair}" stroke-width="${r*.13}" stroke-linecap="round"/>`;
  if (mood === "laugh"){
    s += `<path d="M${cx - ex - er} ${ey + er*.3} Q${cx - ex} ${ey - er*1.3} ${cx - ex + er} ${ey + er*.3}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M${cx + ex - er} ${ey + er*.3} Q${cx + ex} ${ey - er*1.3} ${cx + ex + er} ${ey + er*.3}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  } else if (mood === "plead") s += bigEye(cx - ex, ey, er * 1.65) + bigEye(cx + ex, ey, er * 1.65);
  else s += eye(cx - ex, ey, er) + eye(cx + ex, ey, er);
  s += cheeks(cx - r*.6, cx + r*.6, cy + r*.32, r / 60);
  if (!o.noMouth){
    if (mood === "big" || mood === "laugh") s += `<path d="M${cx - r*.34} ${cy + r*.3} Q${cx} ${cy + r*.9} ${cx + r*.34} ${cy + r*.3} Z" fill="#8A2F3A"${OL3}/><path d="M${cx - r*.16} ${cy + r*.58} Q${cx} ${cy + r*.46} ${cx + r*.16} ${cy + r*.58} Q${cx} ${cy + r*.68} ${cx - r*.16} ${cy + r*.58} Z" fill="#FF7A8A"/>`;
    else if (mood === "sad") s += `<path d="M${cx - r*.24} ${cy + r*.56} Q${cx} ${cy + r*.32} ${cx + r*.24} ${cy + r*.56}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${cx + ex + er*.2} ${ey + er*1.5} q${-er*.9} ${er*1.6} 0 ${er*2.2} q${er*.9} ${-er*.6} 0 ${-er*2.2} Z" fill="#4FB3FF"${OL3}/>`;
    else if (mood === "plead") s += `<ellipse cx="${cx}" cy="${cy + r*.5}" rx="${r*.1}" ry="${r*.12}" fill="${INK}"/>`;
    else s += smile(cx, cy + r*.36, r * .26);
  }
  if (o.mustache) s += `<path d="M${cx} ${cy + r*.3} c${-r*.1} ${-r*.12} ${-r*.42} ${-r*.12} ${-r*.46} ${r*.1} c${r*.2} ${r*.04} ${r*.36} ${-r*.02} ${r*.46} ${-r*.1} c${r*.1} ${r*.08} ${r*.26} ${r*.14} ${r*.46} ${r*.1} c${-r*.04} ${-r*.22} ${-r*.36} ${-r*.22} ${-r*.46} ${-r*.1} Z" fill="${hair}"${OL3}/>`;
  return s;
}

/* an open hand (palm forward) inside the 200 box */
const hand = (skin = SKIN) => `
<rect x="64" y="46" width="22" height="74" rx="11" fill="${skin}"${OL}/>
<rect x="88" y="32" width="23" height="86" rx="11.5" fill="${skin}"${OL}/>
<rect x="113" y="40" width="22" height="80" rx="11" fill="${skin}"${OL}/>
<rect x="137" y="58" width="20" height="64" rx="10" fill="${skin}"${OL}/>
<rect x="30" y="96" width="24" height="58" rx="12" fill="${skin}"${OL} transform="rotate(-42 42 125)"/>
<rect x="62" y="98" width="94" height="78" rx="36" fill="${skin}"${OL}/>
<path d="M90 130 q8 6 16 0" fill="none" stroke="${SKIN2}" stroke-width="4" stroke-linecap="round"/>`;
const motion = (side = 1) => side > 0
  ? `<path d="M170 70 q12 12 0 26 M182 60 q18 22 0 46" fill="none" stroke="#FFC21A" stroke-width="7" stroke-linecap="round"/>`
  : `<path d="M30 70 q-12 12 0 26 M18 60 q-18 22 0 46" fill="none" stroke="#FFC21A" stroke-width="7" stroke-linecap="round"/>`;

function beachBall(){
  const c = [100, 104], r = 70, cols = ["#FF4D4D","#FFFFFF","#FFC21A","#FFFFFF","#3FA2FF","#FFFFFF"]; let s = shadow(54);
  for (let i = 0; i < 6; i++){
    const a0 = (i*60 - 90) * Math.PI/180, a1 = ((i+1)*60 - 90) * Math.PI/180;
    s += `<path d="M${c[0]} ${c[1]} L${(c[0] + r*Math.cos(a0)).toFixed(1)} ${(c[1] + r*Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(c[0] + r*Math.cos(a1)).toFixed(1)} ${(c[1] + r*Math.sin(a1)).toFixed(1)} Z" fill="${cols[i]}"/>`;
  }
  return s + `<circle cx="100" cy="104" r="70" fill="none"${OL}/><circle cx="100" cy="104" r="12" fill="#fff"${OL3}/>` + shine(70, 70, 16, 9);
}

const NUMCOL = { 1:"#FF4D4D", 2:"#FF9F1C", 3:"#22C55E", 4:"#3FA2FF", 5:"#8B5CFF" };
function number(n){
  const c = NUMCOL[n] || "#FF5FA2"; let dots = "";
  const gap = 30, x0 = 100 - (n - 1) * gap / 2;
  for (let i = 0; i < n; i++) dots += `<circle cx="${x0 + i*gap}" cy="176" r="11" fill="${c}"${OL3}/>`;
  return `<text x="100" y="146" text-anchor="middle" font-family="Fredoka, 'Arial Rounded MT Bold', Arial, sans-serif" font-weight="700" font-size="150" fill="${c}" stroke="${INK}" stroke-width="7" paint-order="stroke" stroke-linejoin="round">${n}</text>` + dots;
}
function balloon(c){
  return `<path d="M100 152 C90 168 112 178 100 198" fill="none" stroke="#6B5B4B" stroke-width="3.5" stroke-linecap="round"/>
<path d="M100 16 C148 16 162 60 158 92 C152 128 120 146 100 146 C80 146 48 128 42 92 C38 60 52 16 100 16 Z" fill="${c}"${OL}/>
<path d="M91 154 L100 144 L109 154 Z" fill="${c}"${OL3}/>` + shine(74, 56, 12, 22, 20) + eye(86, 80, 7) + eye(114, 80, 7) + smile(100, 96, 9);
}

const A = {
/* ---------- scenery ---------- */
tree: () => `<rect x="88" y="120" width="24" height="70" rx="8" fill="#9B6234"${OL}/><circle cx="100" cy="78" r="56" fill="#5DBB45"${OL}/><circle cx="62" cy="104" r="34" fill="#5DBB45"${OL}/><circle cx="138" cy="104" r="34" fill="#5DBB45"${OL}/><path d="M50 108 a34 34 0 0 0 100 0" fill="#5DBB45"/><circle cx="80" cy="60" r="10" fill="#8EDB6C"/><circle cx="120" cy="90" r="7" fill="#FF6B6B"${OL3}/><circle cx="78" cy="112" r="7" fill="#FF6B6B"${OL3}/><circle cx="110" cy="56" r="7" fill="#FF6B6B"${OL3}/>`,
pine: () => `<rect x="90" y="150" width="20" height="40" rx="6" fill="#9B6234"${OL}/><path d="M100 14 L150 82 L126 82 L162 128 L132 128 L170 160 L30 160 L68 128 L38 128 L74 82 L50 82 Z" fill="#2E9E5B"${OL}/><path d="M100 30 L118 56" stroke="#5FCB86" stroke-width="6" stroke-linecap="round"/>`,
flower: () => `<path d="M100 110 V190" stroke="#3E9B3A" stroke-width="7" stroke-linecap="round"/><path d="M100 160 C120 140 140 150 140 150 C130 168 110 168 100 160 Z" fill="#5DBB45"${OL3}/>` + [0,72,144,216,288].map(a => `<circle cx="${100 + 30*Math.cos(a*Math.PI/180)}" cy="${80 + 30*Math.sin(a*Math.PI/180)}" r="24" fill="#FF8FC7"${OL3}/>`).join("") + `<circle cx="100" cy="80" r="20" fill="#FFC21A"${OL3}/>` + eye(93, 78, 4) + eye(107, 78, 4),
tulip: () => `<path d="M100 100 V190" stroke="#3E9B3A" stroke-width="7" stroke-linecap="round"/><path d="M100 170 C80 150 64 156 64 156 C72 176 90 178 100 170 Z" fill="#5DBB45"${OL3}/><path d="M62 50 L82 70 L100 40 L118 70 L138 50 L134 96 C128 120 72 120 66 96 Z" fill="#FF5A5A"${OL}/>`,
mushroom: () => `<path d="M80 110 h40 l6 60 c0 10 -52 10 -52 0 Z" fill="#FFF4E0"${OL}/><path d="M30 112 C30 50 170 50 170 112 Z" fill="#FF4D4D"${OL}/><circle cx="74" cy="84" r="10" fill="#fff"/><circle cx="114" cy="74" r="12" fill="#fff"/><circle cx="142" cy="98" r="8" fill="#fff"/>`,
rock: () => `<path d="M30 170 C26 130 60 96 96 100 C130 96 170 120 172 170 Z" fill="#A9B4C2"${OL}/><path d="M70 120 q16 -8 30 0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`,
butterfly: () => `<ellipse cx="66" cy="76" rx="40" ry="34" fill="#FF8FC7"${OL}/><ellipse cx="134" cy="76" rx="40" ry="34" fill="#FF8FC7"${OL}/><ellipse cx="72" cy="132" rx="28" ry="24" fill="#FFC21A"${OL}/><ellipse cx="128" cy="132" rx="28" ry="24" fill="#FFC21A"${OL}/><rect x="92" y="56" width="16" height="104" rx="8" fill="#5A3A22"${OL3}/><path d="M96 58 L84 30 M104 58 L116 30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
bee: () => `<ellipse cx="80" cy="64" rx="26" ry="20" fill="#E6F6FF"${OL3}/><ellipse cx="120" cy="64" rx="26" ry="20" fill="#E6F6FF"${OL3}/><ellipse cx="100" cy="112" rx="56" ry="42" fill="#FFC21A"${OL}/><path d="M86 72 v80 M114 72 v80" stroke="${INK}" stroke-width="12"/><ellipse cx="100" cy="112" rx="56" ry="42" fill="none"${OL}/>` + eye(140, 104, 7),
window: () => `<rect x="30" y="30" width="140" height="130" rx="12" fill="#BFE9FF"${OL}/><path d="M100 30 V160 M30 95 H170" stroke="${INK}" stroke-width="6"/><path d="M44 46 l20 -0" stroke="#fff"/><path d="M48 62 l24 -20" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".8"/><rect x="22" y="156" width="156" height="16" rx="6" fill="#C07A3E"${OL3}/>`,
frame: () => `<rect x="34" y="40" width="132" height="110" rx="10" fill="#FFC21A"${OL}/><rect x="48" y="54" width="104" height="82" rx="6" fill="#BFE9FF"${OL3}/><path d="M48 136 L84 96 L108 120 L124 104 L152 136 Z" fill="#5DBB45"/><circle cx="128" cy="76" r="10" fill="#FFD21F"/>`,
plant: () => `<path d="M100 120 C70 60 40 70 36 80 C60 84 80 100 100 120 Z M100 120 C130 60 160 70 164 80 C140 84 120 100 100 120 Z M100 120 C96 60 100 30 100 30 C110 60 108 90 100 120 Z" fill="#3FAE52"${OL3}/><path d="M64 118 h72 l-10 66 h-52 Z" fill="#E8604C"${OL}/>`,
sofa: () => `<rect x="20" y="80" width="40" height="80" rx="18" fill="#8B5CFF"${OL}/><rect x="140" y="80" width="40" height="80" rx="18" fill="#8B5CFF"${OL}/><rect x="44" y="56" width="112" height="70" rx="20" fill="#A47CFF"${OL}/><rect x="40" y="112" width="120" height="44" rx="14" fill="#8B5CFF"${OL}/><rect x="36" y="156" width="12" height="20" rx="4" fill="#5A3A22"/><rect x="152" y="156" width="12" height="20" rx="4" fill="#5A3A22"/>`,
/* ---------- Floresta: animais ---------- */
dog: () => shadow(52) + `
<path d="M52 60 C22 58 16 112 34 134 C50 148 66 120 64 92 Z" fill="#8A5A34"${OL}/>
<path d="M148 60 C178 58 184 112 166 134 C150 148 134 120 136 92 Z" fill="#8A5A34"${OL}/>
<ellipse cx="100" cy="100" rx="58" ry="55" fill="#E9B479"${OL}/>
<ellipse cx="125" cy="84" rx="20" ry="18" fill="#C98B52"/>
<ellipse cx="100" cy="126" rx="33" ry="25" fill="#FBE6CB"${OL}/>
<path d="M93 134 Q100 154 107 134 Z" fill="#FF7A8A"${OL3}/>
<path d="M100 120 v8 M88 128 Q100 138 112 128" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
<ellipse cx="100" cy="114" rx="12" ry="9" fill="${INK}"/><ellipse cx="96" cy="111" rx="4" ry="2.5" fill="#fff" opacity=".7"/>` + eye(80, 88) + eye(122, 88) + cheeks(66, 134, 112) + shine(78, 62, 14, 8),
cat: () => shadow(52) + `
<path d="M48 82 L56 26 L94 58 Z" fill="#F4A340"${OL}/><path d="M60 66 L63 42 L82 58 Z" fill="#FFB3C1"/>
<path d="M152 82 L144 26 L106 58 Z" fill="#F4A340"${OL}/><path d="M140 66 L137 42 L118 58 Z" fill="#FFB3C1"/>
<ellipse cx="100" cy="108" rx="62" ry="54" fill="#F4A340"${OL}/>
<path d="M100 60 v16 M86 62 l4 14 M114 62 l-4 14" stroke="#D9822B" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="89" cy="128" rx="15" ry="12" fill="#FFF1DD"/><ellipse cx="111" cy="128" rx="15" ry="12" fill="#FFF1DD"/>
<path d="M92 117 h16 l-8 9 Z" fill="#FF7A8A"${OL3}/>
<path d="M100 126 q-6 10 -13 4 M100 126 q6 10 13 4" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
<path d="M66 120 L30 112 M66 130 L30 134 M134 120 L170 112 M134 130 L170 134" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>` + eye(78, 100, 10) + eye(122, 100, 10) + shine(72, 76, 13, 7),
bird: () => shadow(46) + `
<path d="M88 158 v18 M112 158 v18 M82 178 h12 M106 178 h12" stroke="#F29A2E" stroke-width="6" stroke-linecap="round"/>
<path d="M46 124 L16 106 L22 140 Z" fill="#2F86D6"${OL}/>
<path d="M94 56 C86 34 104 28 104 46 C110 30 126 36 112 56 Z" fill="#2F86D6"${OL}/>
<circle cx="100" cy="108" r="58" fill="#4FA8F0"${OL}/>
<ellipse cx="106" cy="130" rx="36" ry="28" fill="#D3EEFF"/>
<path d="M56 104 C60 78 96 84 92 112 C88 136 58 132 56 104 Z" fill="#2F86D6"${OL}/>
<path d="M112 104 L148 112 L112 124 Z" fill="#FFB02E"${OL}/>` + eye(98, 90) + eye(130, 90) + cheeks(84, 142, 110, .8) + shine(80, 66, 14, 8),
fish: () => `
<circle cx="40" cy="52" r="7" fill="#BFE9FF"${OL3}/><circle cx="26" cy="32" r="5" fill="#BFE9FF"${OL3}/>
<path d="M146 104 L186 72 L180 104 L186 136 Z" fill="#FF8A1F"${OL}/>
<path d="M76 66 C88 38 124 40 132 68 Z" fill="#FF8A1F"${OL}/>
<ellipse cx="96" cy="106" rx="64" ry="45" fill="#FFA53A"${OL}/>
<path d="M120 66 C108 88 108 124 120 146" fill="none" stroke="#fff" stroke-width="13"/>
<path d="M72 64 C62 88 62 124 72 148" fill="none" stroke="#fff" stroke-width="13"/>
<ellipse cx="96" cy="106" rx="64" ry="45" fill="none"${OL}/>
<path d="M96 116 C112 120 116 138 100 136 Z" fill="#FF8A1F"${OL3}/>` + eye(54, 96, 11) + smile(48, 118, 9) + `<ellipse cx="62" cy="118" rx="7" ry="5" fill="#FF7F9A" opacity=".55"/>` + shine(100, 76, 16, 7, -10),
duck: () => shadow(58, 186) + `
<ellipse cx="86" cy="182" rx="14" ry="6" fill="#FF9F1C"${OL3}/><ellipse cx="118" cy="182" rx="14" ry="6" fill="#FF9F1C"${OL3}/>
<path d="M36 128 C36 98 76 100 98 110 C120 118 152 98 172 114 C182 154 144 176 102 176 C60 176 36 156 36 128 Z" fill="#FFD43B"${OL}/>
<circle cx="78" cy="74" r="38" fill="#FFD43B"${OL}/>
<path d="M44 78 C28 74 20 88 34 94 C46 100 54 92 52 84 Z" fill="#FF9F1C"${OL}/>
<path d="M98 128 C112 108 148 114 144 136 C138 152 106 150 98 128 Z" fill="#F5B800"${OL}/>` + eye(80, 66, 9) + `<ellipse cx="96" cy="86" rx="9" ry="6" fill="#FF7F9A" opacity=".5"/>` + shine(70, 52, 12, 7),
/* ---------- Floresta: conhecendo / primeiras palavras ---------- */
hello: () => motion(1) + motion(-1) + `<g transform="rotate(-12 100 110)">${hand()}</g>`,
bye: () => face(86, 116, 62, { hair: "#5A3A22" }) + `<g transform="translate(112 6) scale(.46) rotate(18 100 100)">${hand()}</g>` + `<path d="M190 34 q8 10 0 20 M196 24 q14 18 0 38" fill="none" stroke="#FFC21A" stroke-width="5" stroke-linecap="round"/>`,
friend: () => heart(100, 40, 24) + face(64, 120, 48, { hair: "#5A3A22" }) + face(138, 120, 48, { hair: "#F2B33D", skin: "#EBB089", mood: "laugh" }),
yes: () => `
<rect x="62" y="24" width="30" height="90" rx="15" fill="${SKIN}"${OL} transform="rotate(-8 77 69)"/>
<rect x="54" y="84" width="100" height="90" rx="28" fill="${SKIN}"${OL}/>
<path d="M114 106 h38 M114 128 h38 M114 150 h36" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
<circle cx="154" cy="52" r="27" fill="#22C55E"${OL}/><path d="M141 52 l9 10 l17 -19" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
thanks: () => face(100, 88, 62, { hair: "#5A3A22", mood: "laugh" }) + heart(100, 166, 26) + `<circle cx="72" cy="168" r="14" fill="${SKIN}"${OL}/><circle cx="128" cy="168" r="14" fill="${SKIN}"${OL}/>`,
please: () => face(100, 92, 66, { hair: "#5A3A22", mood: "plead" }) + `<ellipse cx="100" cy="176" rx="30" ry="18" fill="${SKIN}"${OL}/><path d="M100 160 v30" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` + sparkle(36, 40, 10) + sparkle(168, 50, 8),
happy: () => face(100, 104, 78, { skin: "#FFD23F", mood: "big" }) + sparkle(28, 30, 12) + sparkle(176, 40, 10) + sparkle(178, 170, 8),
sad: () => `<path d="M58 30 C58 14 80 8 90 18 C98 4 126 6 128 24 C146 22 152 44 138 50 L62 50 C50 50 48 34 58 30 Z" fill="#DDE6F0"${OL3}/>` + face(100, 118, 70, { skin: "#9CCBFF", mood: "sad" }),
/* ---------- Casa Mágica ---------- */
bed: () => shadow(80, 182) + `
<rect x="20" y="60" width="28" height="118" rx="10" fill="#B5703A"${OL}/>
<rect x="166" y="96" width="20" height="82" rx="8" fill="#B5703A"${OL}/>
<rect x="36" y="108" width="142" height="38" rx="12" fill="#FFFFFF"${OL}/>
<ellipse cx="66" cy="102" rx="26" ry="15" fill="#FFF6E0"${OL}/>
<path d="M86 98 h84 c8 0 12 4 12 12 v32 c0 6 -4 8 -10 8 h-86 c-6 0 -8 -4 -8 -10 v-32 c0 -6 2 -10 8 -10 Z" fill="#3FA2FF"${OL}/>
<circle cx="110" cy="116" r="5" fill="#fff"/><circle cx="138" cy="126" r="5" fill="#fff"/><circle cx="160" cy="112" r="5" fill="#fff"/><circle cx="122" cy="138" r="4" fill="#fff"/>` + star(34, 84, 9, "#FFC21A", OL3),
chair: () => shadow(52) + `
<rect x="54" y="122" width="15" height="58" rx="6" fill="#B5462F"${OL}/><rect x="131" y="122" width="15" height="58" rx="6" fill="#B5462F"${OL}/>
<rect x="56" y="20" width="88" height="92" rx="20" fill="#E8604C"${OL}/>
<rect x="68" y="34" width="64" height="62" rx="14" fill="#F58B79"/>
<rect x="42" y="104" width="116" height="30" rx="12" fill="#C94A36"${OL}/>` + shine(80, 44, 12, 7),
door: () => shadow(60, 186) + `
<rect x="48" y="18" width="104" height="166" rx="12" fill="#C07A3E"${OL}/>
<rect x="64" y="34" width="72" height="56" rx="8" fill="#A9652D"${OL3}/>
<rect x="64" y="102" width="72" height="66" rx="8" fill="#A9652D"${OL3}/>
<circle cx="134" cy="102" r="9" fill="#FFC21A"${OL3}/>` + heart(100, 60, 12, "#FF8FB5"),
lamp: () => `<circle cx="100" cy="78" r="76" fill="#FFE680" opacity=".35"/>` + shadow(44, 184) + `
<rect x="93" y="92" width="14" height="74" rx="6" fill="#8A6A4A"${OL}/>
<ellipse cx="100" cy="172" rx="44" ry="13" fill="#8A6A4A"${OL}/>
<ellipse cx="100" cy="94" rx="26" ry="9" fill="#FFF3B0"/>
<path d="M62 28 L138 28 L162 94 L38 94 Z" fill="#FFC21A"${OL}/>
<path d="M70 44 h60" stroke="#FFDD66" stroke-width="7" stroke-linecap="round"/>` + sparkle(24, 40, 10) + sparkle(178, 36, 8),
book: () => shadow(58) + `
<rect x="48" y="32" width="118" height="146" rx="12" fill="#FFFFFF"${OL}/>
<path d="M150 46 v118 M140 46 v118" stroke="#E2D9C8" stroke-width="3"/>
<rect x="36" y="24" width="118" height="146" rx="12" fill="#4C7BF3"${OL}/>
<rect x="36" y="24" width="22" height="146" rx="10" fill="#2F5BD0"${OL3}/>` + star(106, 92, 30, "#FFC21A") + `<rect x="78" y="134" width="56" height="10" rx="5" fill="#9FB8FF"/>` + shine(80, 40, 12, 6, 0),
mom: () => face(100, 98, 62, { hair: "#7A3E1D", style: "long" }) + `<circle cx="38" cy="112" r="6" fill="#FFC21A"${OL3}/><circle cx="162" cy="112" r="6" fill="#FFC21A"${OL3}/>` + heart(156, 34, 12),
dad: () => face(100, 100, 64, { hair: "#3A2A1E", mustache: true }) + `<rect x="58" y="164" width="84" height="26" rx="12" fill="#3FA2FF"${OL}/><path d="M92 164 l8 14 l8 -14" fill="#FF4D4D"${OL3}/>`,
baby: () => face(100, 106, 62, { hair: "#C68642", style: "curl", mood: "laugh" }) + `<circle cx="100" cy="150" r="13" fill="#4FD1C5"${OL3}/><circle cx="100" cy="150" r="5" fill="#fff"/>` + sparkle(30, 48, 9) + sparkle(172, 60, 8),
brother: () => face(100, 106, 62, { hair: "#3A2A1E" }) + `<path d="M40 76 C42 34 158 34 160 76 Z" fill="#FF4D4D"${OL}/><path d="M150 72 C170 70 186 74 190 82 L150 82 Z" fill="#D83A3A"${OL3}/><circle cx="100" cy="42" r="6" fill="#FFC21A"${OL3}/>`,
sister: () => face(100, 106, 58, { hair: "#E0A030", style: "pigtails", mood: "laugh" }) + `<path d="M100 46 L76 34 L76 58 Z M100 46 L124 34 L124 58 Z" fill="#FF5FA2"${OL3}/><circle cx="100" cy="46" r="7" fill="#FF5FA2"${OL3}/>`,
hand: () => hand(),
eye: () => `
<path d="M24 100 C60 50 140 50 176 100 C140 150 60 150 24 100 Z" fill="#fff"${OL}/>
<circle cx="100" cy="100" r="34" fill="#4A90E2"${OL3}/><circle cx="100" cy="100" r="16" fill="${INK}"/><circle cx="110" cy="89" r="8" fill="#fff"/>
<path d="M44 74 l-10 -14 M70 60 l-6 -16 M100 55 v-17 M130 60 l6 -16 M156 74 l10 -14" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
nose: () => face(100, 100, 74, { hair: "#5A3A22", noMouth: true }) + `<circle cx="100" cy="128" r="25" fill="none" stroke="#FFC21A" stroke-width="6" stroke-dasharray="8 7"/><ellipse cx="100" cy="128" rx="14" ry="12" fill="#F4A07A"${OL3}/>` + smile(100, 156, 11),
mouth: () => `
<path d="M28 98 C64 64 136 64 172 98 C136 154 64 154 28 98 Z" fill="#E8505B"${OL}/>
<path d="M44 100 C76 90 124 90 156 100 C130 124 70 124 44 100 Z" fill="#8A2F3A"/>
<path d="M54 100 C80 94 120 94 146 100 L140 110 L60 110 Z" fill="#fff"/>` + shine(70, 84, 14, 5, -10),
foot: () => `<ellipse cx="100" cy="124" rx="46" ry="64" fill="${SKIN}"${OL}/>
<circle cx="62" cy="58" r="14" fill="${SKIN}"${OL}/><circle cx="86" cy="44" r="13" fill="${SKIN}"${OL}/><circle cx="108" cy="40" r="12" fill="${SKIN}"${OL}/><circle cx="128" cy="46" r="11" fill="${SKIN}"${OL}/><circle cx="144" cy="58" r="10" fill="${SKIN}"${OL}/>
<path d="M84 150 q16 10 32 0" fill="none" stroke="${SKIN2}" stroke-width="4" stroke-linecap="round"/>`,
ball: beachBall,
car: () => shadow(80, 178) + `
<path d="M24 134 C24 114 36 106 52 104 L70 70 C74 62 82 58 92 58 L134 58 C144 58 152 64 156 72 L172 104 C184 106 190 116 190 130 L190 142 C190 148 186 152 180 152 L34 152 C28 152 24 148 24 142 Z" fill="#FF4D4D"${OL}/>
<path d="M78 100 L88 76 C90 72 93 70 97 70 L110 70 L110 100 Z" fill="#BFE9FF"${OL3}/>
<path d="M122 100 L122 70 L132 70 C137 70 140 72 142 76 L154 100 Z" fill="#BFE9FF"${OL3}/>
<path d="M116 106 v38" stroke="#C93636" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="184" cy="120" rx="6" ry="8" fill="#FFE066"${OL3}/>
<circle cx="62" cy="154" r="21" fill="#2B2B33"${OL}/><circle cx="62" cy="154" r="8" fill="#D6D6DE"/>
<circle cx="152" cy="154" r="21" fill="#2B2B33"${OL}/><circle cx="152" cy="154" r="8" fill="#D6D6DE"/>` + shine(60, 116, 12, 5, 0),
teddy: () => shadow(56) + `
<circle cx="60" cy="50" r="20" fill="#B07040"${OL}/><circle cx="60" cy="50" r="9" fill="#E8B88A"/>
<circle cx="140" cy="50" r="20" fill="#B07040"${OL}/><circle cx="140" cy="50" r="9" fill="#E8B88A"/>
<ellipse cx="100" cy="148" rx="52" ry="40" fill="#B07040"${OL}/><ellipse cx="100" cy="154" rx="30" ry="24" fill="#E8B88A"/>
<ellipse cx="52" cy="142" rx="15" ry="25" fill="#B07040"${OL} transform="rotate(25 52 142)"/><ellipse cx="148" cy="142" rx="15" ry="25" fill="#B07040"${OL} transform="rotate(-25 148 142)"/>
<circle cx="100" cy="84" r="50" fill="#B07040"${OL}/><ellipse cx="100" cy="104" rx="23" ry="17" fill="#E8B88A"/>
<ellipse cx="100" cy="97" rx="9" ry="6.5" fill="${INK}"/><path d="M100 103 v6 M92 110 q8 6 16 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
<path d="M100 130 L82 120 L82 140 Z M100 130 L118 120 L118 140 Z" fill="#FF4D4D"${OL3}/><circle cx="100" cy="130" r="6" fill="#FF4D4D"${OL3}/>` + eye(82, 78, 8) + eye(118, 78, 8) + cheeks(72, 128, 98, .7),
kite: () => `
<path d="M100 166 C88 178 112 184 98 198" fill="none" stroke="#6B5B4B" stroke-width="3.5" stroke-linecap="round"/>
<path d="M92 180 l-12 -6 l2 12 Z M106 190 l12 -6 l-2 12 Z" fill="#FF5FA2"${OL3}/>
<path d="M100 14 L40 88 L100 100 Z" fill="#FF5FA2"/><path d="M100 14 L160 88 L100 100 Z" fill="#FFC21A"/>
<path d="M40 88 L100 166 L100 100 Z" fill="#3FA2FF"/><path d="M160 88 L100 166 L100 100 Z" fill="#22C55E"/>
<path d="M100 14 L160 88 L100 166 L40 88 Z" fill="none"${OL}/><path d="M100 14 V166 M40 88 L160 88" stroke="${INK}" stroke-width="3.5"/>` + eye(84, 70, 6) + eye(116, 70, 6) + smile(100, 80, 7),
robot: () => shadow(52, 188) + `
<path d="M100 32 V18" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="14" r="8" fill="#FF5FA2"${OL3}/>
<rect x="44" y="50" width="12" height="24" rx="5" fill="#93A4BC"${OL3}/><rect x="144" y="50" width="12" height="24" rx="5" fill="#93A4BC"${OL3}/>
<rect x="36" y="104" width="20" height="50" rx="10" fill="#93A4BC"${OL}/><rect x="144" y="104" width="20" height="50" rx="10" fill="#93A4BC"${OL}/>
<rect x="72" y="160" width="20" height="26" rx="6" fill="#7B8CA6"${OL}/><rect x="108" y="160" width="20" height="26" rx="6" fill="#7B8CA6"${OL}/>
<rect x="58" y="98" width="84" height="68" rx="16" fill="#93A4BC"${OL}/>
<rect x="54" y="30" width="92" height="66" rx="18" fill="#B8C4D6"${OL}/>
<circle cx="80" cy="60" r="12" fill="#3FD0FF"${OL3}/><circle cx="120" cy="60" r="12" fill="#3FD0FF"${OL3}/><circle cx="84" cy="56" r="4" fill="#fff"/><circle cx="124" cy="56" r="4" fill="#fff"/>
<rect x="82" y="78" width="36" height="8" rx="4" fill="${INK}"/>` + heart(100, 128, 13, "#FFC21A"),
};

/* 3D-style pictures cut from the approved Destrava Kids art sheet (img/*.webp) */
const IMGS = new Set(["baby", "bag", "ball", "bed", "bike", "blocks", "book", "brother", "car", "cat", "chair", "chest", "crayon", "cup", "dad", "dog", "doll", "door", "duck", "elephant", "eraser", "family", "fish", "fridge", "frog", "grandma", "grandpa", "kite", "lamp", "lion", "mom", "monkey", "notebook", "paint-black", "paint-blue", "paint-brown", "paint-green", "paint-orange", "paint-pink", "paint-purple", "paint-red", "paint-white", "paint-yellow", "parrot", "pencil", "pencilcase", "robot", "ruler", "scene-forest", "scene-house", "scene-lab", "scene-school", "scissors", "sister", "soccer", "sofa", "stove", "table", "teddy", "tiger", "train", "tv"]);
const base = () => (window.ART_BASE != null ? window.ART_BASE : "/img/");
const src = k => base() + k + ".webp";
function html(key){
  if (!key) return "";
  if (IMGS.has(key)) return `<img class="art art-img" src="${src(key)}" alt="" draggable="false">`;
  let body = null;
  if (key.startsWith("balloon:")) body = balloon(key.slice(8));
  else if (key.startsWith("num:")) body = number(+key.slice(4));
  else if (A[key]) body = A[key]();
  if (body) return `<svg class="art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
  return `<span class="art art-emoji" aria-hidden="true">${key}</span>`;   // still waiting for a drawing
}
window.ART = { html, src, has: k => !!(k && (IMGS.has(k) || A[k] || k.startsWith("balloon:") || k.startsWith("num:"))) };
})();
