/**
 * ORBITAL SENTINEL — script.js
 * Global Crisis Monitoring Platform
 * Initial build: April 16, 2026
 * Last updated: April 23, 2026
 */

// ══════════════════════════════════════
// 0. AUTH
// ══════════════════════════════════════
const VALID_PASSWORD = 'password123';
let accounts = {};
let currentUser = null;

function simpleHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return String(h);
}

document.getElementById('go-signup').onclick = () => {
  document.getElementById('panel-login').classList.add('hidden');
  document.getElementById('panel-signup').classList.remove('hidden');
};
document.getElementById('go-login').onclick = () => {
  document.getElementById('panel-signup').classList.add('hidden');
  document.getElementById('panel-login').classList.remove('hidden');
};

document.getElementById('btn-login').onclick = doLogin;
document.getElementById('btn-signup').onclick = doSignup;

['login-pass','login-user'].forEach(id =>
  document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); })
);

function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  if (!u||!p)           { err.textContent='⚠ All fields required.'; return; }
  if (!accounts[u])     { err.textContent='⚠ Username not found.'; return; }
  if (accounts[u] !== simpleHash(p)) { err.textContent='⚠ Incorrect password.'; return; }
  err.textContent='';
  currentUser = u;
  launchApp();
}

function doSignup() {
  const u = document.getElementById('signup-user').value.trim();
  const p = document.getElementById('signup-pass').value;
  const c = document.getElementById('signup-confirm').value;
  const err = document.getElementById('signup-error');
  if (!u||!p||!c)           { err.textContent='⚠ All fields required.'; return; }
  if (u.length < 3)          { err.textContent='⚠ Username must be 3+ characters.'; return; }
  if (accounts[u])           { err.textContent='⚠ Username already taken.'; return; }
  if (p !== VALID_PASSWORD)  { err.textContent='⚠ Password must be: password123'; return; }
  if (p !== c)               { err.textContent='⚠ Passwords do not match.'; return; }
  accounts[u] = simpleHash(p);
  err.style.color = 'var(--green)';
  err.textContent = '✔ Account created! You can now log in.';
  setTimeout(() => {
    err.style.color = '';
    err.textContent = '';
    document.getElementById('panel-signup').classList.add('hidden');
    document.getElementById('panel-login').classList.remove('hidden');
    document.getElementById('login-user').value = u;
  }, 1500);
}

document.getElementById('btn-logout').onclick = () => {
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-user').value = '';
  document.getElementById('login-pass').value = '';
};

function launchApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('topbar-username').textContent = currentUser.toUpperCase();
  if (!appStarted) initApp();
}

// ══════════════════════════════════════
// 1. AUDIO
// ══════════════════════════════════════
let _actx = null;
let soundOn = true;

function getAC() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  if (_actx.state === 'suspended') _actx.resume();
  return _actx;
}

function playBoom() {
  if (!soundOn) return;
  try {
    const c = getAC(); const n = c.currentTime;
    const sub=c.createOscillator(); const sg=c.createGain();
    sub.connect(sg); sg.connect(c.destination);
    sub.type='sine';
    sub.frequency.setValueAtTime(90,n);
    sub.frequency.exponentialRampToValueAtTime(18,n+0.4);
    sg.gain.setValueAtTime(0.28,n);
    sg.gain.exponentialRampToValueAtTime(0.001,n+0.5);
    sub.start(n); sub.stop(n+0.5);

    const mid=c.createOscillator(); const mg=c.createGain();
    mid.connect(mg); mg.connect(c.destination);
    mid.type='sawtooth';
    mid.frequency.setValueAtTime(200,n);
    mid.frequency.exponentialRampToValueAtTime(35,n+0.2);
    mg.gain.setValueAtTime(0.15,n);
    mg.gain.exponentialRampToValueAtTime(0.001,n+0.22);
    mid.start(n); mid.stop(n+0.22);

    const bl=Math.floor(c.sampleRate*0.24); const buf=c.createBuffer(1,bl,c.sampleRate);
    const d=buf.getChannelData(0); for(let i=0;i<bl;i++) d[i]=Math.random()*2-1;
    const ns=c.createBufferSource(),bpf=c.createBiquadFilter(),ng=c.createGain();
    ns.buffer=buf; bpf.type='lowpass'; bpf.frequency.value=650;
    ns.connect(bpf); bpf.connect(ng); ng.connect(c.destination);
    ng.gain.setValueAtTime(0.11,n); ng.gain.exponentialRampToValueAtTime(0.001,n+0.26);
    ns.start(n); ns.stop(n+0.26);
  } catch(e) {}
}

function playZap() {
  if (!soundOn) return;
  try {
    const c=getAC(); const n=c.currentTime;
    const o=c.createOscillator(); const g=c.createGain();
    o.connect(g); g.connect(c.destination); o.type='sawtooth';
    o.frequency.setValueAtTime(900,n);
    o.frequency.exponentialRampToValueAtTime(3000,n+0.13);
    o.frequency.exponentialRampToValueAtTime(180,n+0.36);
    g.gain.setValueAtTime(0.18,n); g.gain.exponentialRampToValueAtTime(0.001,n+0.38);
    o.start(n); o.stop(n+0.38);
  } catch(e) {}
}

function playRumble() {
  if (!soundOn) return;
  try {
    const c=getAC(); const n=c.currentTime;
    const o=c.createOscillator(); const g=c.createGain();
    o.connect(g); g.connect(c.destination); o.type='sine';
    o.frequency.setValueAtTime(38,n);
    o.frequency.setValueAtTime(55,n+0.12);
    o.frequency.setValueAtTime(28,n+0.3);
    g.gain.setValueAtTime(0.22,n);
    g.gain.setValueAtTime(0.22,n+0.3);
    g.gain.exponentialRampToValueAtTime(0.001,n+0.85);
    o.start(n); o.stop(n+0.85);
  } catch(e) {}
}

document.getElementById('btn-sound').onclick = () => {
  try { getAC(); } catch(e) {}
  soundOn = !soundOn;
  const btn = document.getElementById('btn-sound');
  btn.textContent = soundOn ? '🔊' : '🔇';
  btn.classList.toggle('muted', !soundOn);
};

// ══════════════════════════════════════
// 2. MAP
// ══════════════════════════════════════
let map;
function initMap() {
  map = L.map('map', {
    center:[20,10], zoom:2, minZoom:1,
    scrollWheelZoom:true, touchZoom:true,
    doubleClickZoom:true, worldCopyJump:true,
    zoomControl:true,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    noWrap:false, keepBuffer:4,
  }).addTo(map);

  map.on('click', () => { try { getAC(); } catch(e) {} playBoom(); });
  map.on('click', () => { if(window.innerWidth<=600) document.getElementById('side-panel').classList.remove('open'); });
}

// ══════════════════════════════════════
// 3. COUNTRIES
// ══════════════════════════════════════
const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
let geoLayer = null;
let countryData = {};
let strikeMode = false;
let struckCountries = new Set();

async function loadCountries() {
  let gj;
  try {
    const r = await fetch(GEO_URL);
    if (!r.ok) throw 0;
    gj = await r.json();
  } catch(e) { gj = FALLBACK_GEO; }
  buildCountries(gj);
}

function buildCountries(gj) {
  if (geoLayer) { map.removeLayer(geoLayer); geoLayer=null; }
  geoLayer = L.geoJSON(gj, {
    style: () => ({
      fillColor:'#00e5ff', fillOpacity:0.06,
      color:'rgba(0,229,255,0.28)', weight:0.8,
    }),
    onEachFeature(feat, layer) {
      const name = feat.properties.ADMIN || feat.properties.name || 'Unknown';
      const iso  = feat.properties.ISO_A3 || feat.properties.iso_a3 || name.slice(0,3).toUpperCase();
      let center;
      try { center = layer.getBounds().getCenter(); } catch(e) { return; }
      countryData[iso] = { name, layer, center, labelMarker: null };

      // Label — shown at zoom ≥ 3
      const lbl = L.marker(center, {
        icon: L.divIcon({
          className:'country-label',
          html:`<div class="country-label-inner">${name}</div>`,
          iconAnchor:[0,0],
        }),
        interactive:false, zIndexOffset:-100,
      });
      function syncLabel() {
        if (map.getZoom() >= 3) { try { lbl.addTo(map); } catch(e){} }
        else { try { map.removeLayer(lbl); } catch(e){} }
      }
      map.on('zoomend', syncLabel);
      syncLabel();
      countryData[iso].labelMarker = lbl;

      layer.on('mouseover', function() {
        if (struckCountries.has(iso)) return;
        this.setStyle({ fillOpacity:0.2, color:'rgba(0,229,255,0.7)', weight:1.4 });
        this.bringToFront();
      });
      layer.on('mouseout', function() {
        if (struckCountries.has(iso)) return;
        const isWar = warLayerMap[iso];
        if (isWar) this.setStyle({ fillColor:'#ff2d4a', fillOpacity:0.16, color:'#ff2d4a', weight:1.2 });
        else geoLayer.resetStyle(this);
      });
      layer.on('click', function(e) {
        if (strikeMode && !struckCountries.has(iso)) { strikeCountry(iso, name, layer, e); return; }
        showCountryInfo(iso, name, e);
      });
    }
  }).addTo(map);
}

function showCountryInfo(iso, name, e) {
  const w = WAR_ZONES.find(x => x.iso===iso);
  const content = w
    ? `<strong>${name}</strong><br><span class="pop-level-war">⚔ ${w.level} CONFLICT</span><br>${w.desc}`
    : `<strong>${name}</strong><br><span style="color:var(--green)">✔ No active conflict</span>`;
  L.popup({closeButton:false,autoClose:true,autoPan:false})
    .setLatLng(e.latlng).setContent(content).openOn(map);
  setTimeout(() => map.closePopup(), 2600);
}

// ══════════════════════════════════════
// 4. WAR ZONES
// ══════════════════════════════════════
const WAR_ZONES = [
  {iso:'UKR',name:'Ukraine',         level:'CRITICAL',lat:49.0,lng:31.5,desc:'Full-scale armed conflict. Heavy civilian casualties.'},
  {iso:'PSE',name:'Gaza/Palestine',  level:'CRITICAL',lat:31.4,lng:34.4,desc:'High-intensity urban warfare. Humanitarian crisis.'},
  {iso:'SDN',name:'Sudan',           level:'HIGH',    lat:15.5,lng:30.0,desc:'Civil war between military factions. Mass displacement.'},
  {iso:'SOM',name:'Somalia',         level:'HIGH',    lat:5.5, lng:46.2,desc:'Ongoing insurgency. Al-Shabaab active in south.'},
  {iso:'SYR',name:'Syria',           level:'HIGH',    lat:34.8,lng:38.9,desc:'Multi-faction conflict in multiple provinces.'},
  {iso:'MMR',name:'Myanmar',         level:'HIGH',    lat:19.7,lng:96.1,desc:'Military junta vs resistance. Heavy airstrikes.'},
  {iso:'YEM',name:'Yemen',           level:'MED',     lat:15.5,lng:48.5,desc:'Ceasefire fragile. Houthi forces active.'},
  {iso:'ETH',name:'Ethiopia',        level:'MED',     lat:9.1, lng:40.5,desc:'Regional insurgencies in Amhara and Oromia.'},
  {iso:'COD',name:'DR Congo',        level:'MED',     lat:-4.0,lng:21.8,desc:'M23 activity in North Kivu region.'},
  {iso:'MLI',name:'Mali',            level:'MED',     lat:17.6,lng:-3.9,desc:'Sahel jihadist insurgency ongoing.'},
  {iso:'IRQ',name:'Iraq',            level:'LOW',     lat:33.2,lng:43.7,desc:'ISIS remnants. Coalition operations ongoing.'},
  {iso:'AFG',name:'Afghanistan',     level:'LOW',     lat:33.9,lng:67.7,desc:'Taliban governance. Isolated IS-K attacks.'},
];

let warMarkers = [];
let warLayerMap = {};

function loadWarZones() {
  WAR_ZONES.forEach(w => {
    // Style the country layer if found
    const entry = Object.entries(countryData).find(([k,v]) => k===w.iso || v.name===w.name);
    if (entry) {
      const [iso, data] = entry;
      data.layer.setStyle({
        fillColor:'#ff2d4a', fillOpacity:0.16,
        color:'#ff2d4a', weight:1.2, dashArray:'',
      });
      warLayerMap[iso] = data.layer;
      // Animate pulse
      let flip = false;
      setInterval(() => {
        if (!warLayerMap[iso]) return;
        flip = !flip;
        try {
          data.layer.setStyle({ fillOpacity: flip ? 0.26 : 0.12 });
        } catch(e) {}
      }, 1100);
    }

    // War icon marker
    const icon = L.divIcon({
      className:'',
      html:`<div class="war-icon" title="${w.name}">⚔</div>`,
      iconSize:[26,26], iconAnchor:[13,13],
    });
    const m = L.marker([w.lat,w.lng],{icon,zIndexOffset:300}).addTo(map);
    m.on('click', () => showWarDetail(w));
    warMarkers.push(m);
  });

  updateWarCount();
  buildWarList();
  setTimeout(checkCriticalAlerts, 2200);
}

function showWarDetail(w) {
  const colMap = {CRITICAL:'var(--crimson)',HIGH:'#ff8844',MED:'var(--amber)',LOW:'var(--green)'};
  const pct    = {CRITICAL:95,HIGH:72,MED:45,LOW:20}[w.level]||30;
  const barCls = {CRITICAL:'high',HIGH:'high',MED:'med',LOW:'low'}[w.level]||'low';
  showDetailPanel(`⚔ ${w.name}`, `
    <div class="dp-field">
      <div class="dp-field-label">CONFLICT STATUS</div>
      <div class="dp-field-value" style="color:${colMap[w.level]};font-weight:700">⚔ ACTIVE WAR ZONE</div>
    </div>
    <div class="dp-field">
      <div class="dp-field-label">THREAT LEVEL</div>
      <div class="dp-field-value">
        <span style="color:${colMap[w.level]};font-weight:700">${w.level}</span>
        <div class="dp-bar-wrap"><div class="dp-bar ${barCls}" style="width:${pct}%"></div></div>
      </div>
    </div>
    <div class="dp-field">
      <div class="dp-field-label">SITUATION REPORT</div>
      <div class="dp-field-value">${w.desc}</div>
    </div>
    <div class="dp-field">
      <div class="dp-field-label">COORDINATES</div>
      <div class="dp-field-value">${w.lat.toFixed(2)}°N, ${w.lng.toFixed(2)}°E</div>
    </div>
    <div class="dp-field">
      <div class="dp-field-label">ORBITAL STRIKE</div>
      <div class="dp-field-value" style="color:var(--muted)">Activate Strike Mode to engage target.</div>
    </div>
  `);
}

// ══════════════════════════════════════
// 5. TYPHOON SYSTEM
// ══════════════════════════════════════
const TYPHOON_CATS = [
  {cat:'TD',  label:'TROPICAL DEP.',  minKph:0,  color:'#aaddff', devastation:'Minimal. Light rain, gusty winds. Minor flooding possible.'},
  {cat:'TS',  label:'TROPICAL STORM', minKph:63, color:'#00cfff', devastation:'Moderate. Significant rain, coastal flooding, tree damage.'},
  {cat:'CAT 1',label:'CATEGORY 1',   minKph:119,color:'#39ff7a', devastation:'Low-moderate. Roof damage, downed trees, power outages.'},
  {cat:'CAT 2',label:'CATEGORY 2',   minKph:154,color:'#ffe040', devastation:'Moderate. Extensive roof damage, flooding, evacuation zones.'},
  {cat:'CAT 3',label:'CATEGORY 3',   minKph:178,color:'#ff8c00', devastation:'Severe. Structural damage, long-term power loss, storm surge.'},
  {cat:'CAT 4',label:'CATEGORY 4',   minKph:209,color:'#ff4422', devastation:'Extreme. Catastrophic damage. Widespread destruction. Week-long outages.'},
  {cat:'CAT 5',label:'SUPER TYPHOON',minKph:252,color:'#ff2d4a', devastation:'CATASTROPHIC. Total roof failure. Buildings leveled. Do NOT shelter in place.'},
];
function getTyphoonCat(kph) {
  for (let i = TYPHOON_CATS.length-1; i >= 0; i--) {
    if (kph >= TYPHOON_CATS[i].minKph) return TYPHOON_CATS[i];
  }
  return TYPHOON_CATS[0];
}

const STORM_ORIGINS=[
  {la:15,lo:145},{la:20,lo:-155},{la:12,lo:80},{la:25,lo:-65},
  {la:-15,lo:115},{la:10,lo:-30},{la:30,lo:170},{la:-8,lo:-148},
];
let storms=[], stormId=0;

function spawnTyphoon(forced) {
  if (!forced && storms.length >= 5) return;
  const id=++stormId;
  const o=STORM_ORIGINS[Math.floor(Math.random()*STORM_ORIGINS.length)];
  let la=o.la+(Math.random()-.5)*8, lo=o.lo+(Math.random()-.5)*8;
  let dla=(Math.random()-.5)*0.12, dlo=(Math.random()-.5)*0.2;
  const kph=Math.floor(Math.random()*255+40);
  const cat=getTyphoonCat(kph);
  const name=`STORM-${String.fromCharCode(65+Math.floor(Math.random()*26))}${id}`;

  const circle=L.circle([la,lo],{
    radius:380000+kph*900, color:cat.color,weight:1,
    opacity:0.38,fillColor:cat.color,fillOpacity:0.05,dashArray:'6,5',
  }).addTo(map);

  const icon=L.divIcon({
    className:'',
    html:`<div class="storm-marker" id="sm-${id}">
      <div class="storm-emoji" style="filter:drop-shadow(0 0 8px ${cat.color})">🌀</div>
      <div class="storm-label" style="color:${cat.color};border-color:${cat.color}44">${cat.cat} · ${kph}km/h</div>
    </div>`,
    iconSize:[80,50],iconAnchor:[40,25],
  });
  const marker=L.marker([la,lo],{icon,zIndexOffset:400}).addTo(map);

  const onCk=()=>showTyphoonDetail(id,name,kph,cat,la,lo);
  marker.on('click',onCk); circle.on('click',onCk);

  const mv=setInterval(()=>{
    const s=storms.find(x=>x.id===id);
    if(!s){clearInterval(mv);return;}
    s.la+=dla; s.lo+=dlo;
    if(s.lo>180)s.lo-=360; if(s.lo<-180)s.lo+=360;
    if(s.la>65||s.la<-58)dla*=-1;
    marker.setLatLng([s.la,s.lo]); circle.setLatLng([s.la,s.lo]);
  },280);

  storms.push({id,marker,circle,mv,la,lo,name,kph,cat});
  updateTyphoonCount(); buildTyphoonList();

  if (['CAT 3','CAT 4','CAT 5'].includes(cat.cat)) {
    setTimeout(()=>showAlertModal('🌀',`${cat.label} DETECTED`,`${cat.cat} — ${kph} km/h`,
      `<strong>${name}</strong> has intensified to <strong>${cat.label}</strong>.<br><br>${cat.devastation}`,cat.color),1400);
  }
  toast(`🌀 ${name} — ${cat.label} (${kph} km/h)`,'amber');
}

function showTyphoonDetail(id,name,kph,cat,la,lo) {
  playZap();
  const s=storms.find(x=>x.id===id);
  const cla=s?s.la:la, clo=s?s.lo:lo;
  showDetailPanel(`🌀 ${name}`,`
    <div class="dp-field"><div class="dp-field-label">CLASSIFICATION</div>
      <div class="dp-field-value" style="color:${cat.color};font-weight:700">${cat.label}</div></div>
    <div class="dp-field"><div class="dp-field-label">WIND SPEED</div>
      <div class="dp-field-value">${kph} km/h (${Math.round(kph*0.621)} mph)
        <div class="dp-bar-wrap"><div class="dp-bar ${kph>208?'high':kph>118?'med':'low'}" style="width:${Math.min(100,kph/270*100).toFixed(0)}%"></div></div>
      </div></div>
    <div class="dp-field"><div class="dp-field-label">DEVASTATION ASSESSMENT</div>
      <div class="dp-field-value">${cat.devastation}</div></div>
    <div class="dp-field"><div class="dp-field-label">CURRENT POSITION</div>
      <div class="dp-field-value">${cla.toFixed(2)}°, ${clo.toFixed(2)}°</div></div>
    <div class="dp-field"><div class="dp-field-label">AFFECTED RADIUS</div>
      <div class="dp-field-value">${Math.round((380000+kph*900)/1000)} km</div></div>
    <div class="dp-field"><div class="dp-field-label">ACTION</div>
      <div class="dp-field-value" style="color:var(--cyan);cursor:pointer" onclick="killTyphoon(${id})">▶ Neutralize Storm System</div></div>
  `);
}

function killTyphoon(id) {
  const idx=storms.findIndex(x=>x.id===id);
  if(idx===-1)return;
  const s=storms[idx];
  const el=document.getElementById(`sm-${id}`);
  if(el) el.closest('.storm-marker').classList.add('storm-dying');
  const pos=map.latLngToContainerPoint(s.marker.getLatLng());
  explodeFX(pos.x,pos.y+58,'🌀'); playZap(); playBoom();
  setTimeout(()=>{
    clearInterval(s.mv);
    try{map.removeLayer(s.marker);}catch(e){}
    try{map.removeLayer(s.circle);}catch(e){}
    storms.splice(idx,1);
    document.getElementById('detail-panel').classList.add('hidden');
    updateTyphoonCount(); buildTyphoonList();
    toast(`✅ ${s.name} NEUTRALIZED`,'cyan');
  },560);
}

// ══════════════════════════════════════
// 6. EARTHQUAKE SYSTEM
// ══════════════════════════════════════
const QUAKE_ZONES=[
  {name:'Pacific Ring of Fire',lat:35.7,lng:140.1},
  {name:'Sumatra Fault',lat:-0.8,lng:100.2},
  {name:'Anatolian Fault',lat:39.9,lng:32.8},
  {name:'San Andreas',lat:34.1,lng:-118.3},
  {name:'Himalayan Front',lat:28.2,lng:84.1},
  {name:'Caribbean Plate',lat:18.5,lng:-72.3},
  {name:'New Zealand Alpine',lat:-43.5,lng:172.6},
  {name:'Hindu Kush',lat:36.7,lng:70.8},
  {name:'Zagros Mountains',lat:29.6,lng:52.5},
  {name:'Philippine Trench',lat:9.8,lng:126.6},
];

function getMagInfo(m) {
  if(m<4)  return{level:'MINOR',   color:'var(--green)',  bar:'low', pct:14,dev:'Felt by few. No structural damage expected.'};
  if(m<5)  return{level:'MODERATE',color:'#aaffcc',       bar:'low', pct:28,dev:'Felt widely. Minor cracks in walls.'};
  if(m<6)  return{level:'STRONG',  color:'var(--amber)',  bar:'med', pct:48,dev:'Moderate damage to weak structures. Casualties possible.'};
  if(m<7)  return{level:'MAJOR',   color:'#ff8844',       bar:'high',pct:68,dev:'Serious damage. Significant casualties. Infrastructure disruption.'};
  if(m<8)  return{level:'GREAT',   color:'var(--crimson)',bar:'high',pct:86,dev:'Major destruction over large area. Thousands of casualties. Tsunami risk.'};
  return        {level:'MEGA',     color:'#ff00cc',       bar:'high',pct:100,dev:'CATASTROPHIC. Total destruction. Massive casualties. National emergency declared.'};
}

let quakes=[], quakeId=0;

function spawnQuake(forced) {
  if(!forced && quakes.length>=5) return;
  const id=++quakeId;
  const z=QUAKE_ZONES[Math.floor(Math.random()*QUAKE_ZONES.length)];
  const la=z.lat+(Math.random()-.5)*3, lo=z.lng+(Math.random()-.5)*3;
  const mag=+(Math.random()*5.8+2.4).toFixed(1);
  const info=getMagInfo(mag);
  const name=`M${mag.toFixed(1)} ${z.name}`;

  const r1=L.circle([la,lo],{radius:mag*38000,color:info.color,weight:1.5,opacity:0.55,fillOpacity:0.05}).addTo(map);
  const r2=L.circle([la,lo],{radius:mag*76000,color:info.color,weight:0.7,opacity:0.25,fillOpacity:0,dashArray:'4,6'}).addTo(map);

  const icon=L.divIcon({
    className:'',
    html:`<div class="quake-marker" id="qm-${id}">
      <div class="quake-emoji" style="filter:drop-shadow(0 0 8px ${info.color})">🌋</div>
      <div class="quake-label" style="color:${info.color};border-color:${info.color}44">M${mag.toFixed(1)} ${info.level}</div>
    </div>`,
    iconSize:[72,46],iconAnchor:[36,23],
  });
  const marker=L.marker([la,lo],{icon,zIndexOffset:350}).addTo(map);
  const onCk=()=>showQuakeDetail(id,name,mag,info,la,lo);
  marker.on('click',onCk); r1.on('click',onCk);

  const rt=setTimeout(()=>removeQuake(id),50000);
  quakes.push({id,marker,r1,r2,la,lo,name,mag,info,rt});
  updateQuakeCount(); buildQuakeList();

  if(mag>=6) {
    setTimeout(()=>showAlertModal('🌋',`${info.level} EARTHQUAKE`,
      `M${mag.toFixed(1)} — ${info.level}`,
      `<strong>${name}</strong><br><br>${info.dev}<br><br>⚠ Zone: <strong>${z.name}</strong>`,info.color),900);
  }
  playRumble();
  toast(`🌋 SEISMIC: ${name}`,'amber');
}

function showQuakeDetail(id,name,mag,info,la,lo) {
  showDetailPanel(`🌋 ${name}`,`
    <div class="dp-field"><div class="dp-field-label">MAGNITUDE</div>
      <div class="dp-field-value" style="color:${info.color};font-weight:700;font-size:1.2rem">M${mag.toFixed(1)}</div></div>
    <div class="dp-field"><div class="dp-field-label">CLASSIFICATION</div>
      <div class="dp-field-value" style="color:${info.color};font-weight:700">${info.level}</div></div>
    <div class="dp-field"><div class="dp-field-label">INTENSITY INDEX</div>
      <div class="dp-field-value">${info.pct}%
        <div class="dp-bar-wrap"><div class="dp-bar ${info.bar}" style="width:${info.pct}%"></div></div>
      </div></div>
    <div class="dp-field"><div class="dp-field-label">DEVASTATION ASSESSMENT</div>
      <div class="dp-field-value">${info.dev}</div></div>
    <div class="dp-field"><div class="dp-field-label">EPICENTER</div>
      <div class="dp-field-value">${la.toFixed(3)}°N, ${lo.toFixed(3)}°E</div></div>
    <div class="dp-field"><div class="dp-field-label">TSUNAMI RISK</div>
      <div class="dp-field-value" style="color:${mag>=7?'var(--crimson)':'var(--green)'}">${mag>=7?'⚠ HIGH — Coastal warnings issued':'✔ LOW RISK'}</div></div>
  `);
}

function removeQuake(id) {
  const idx=quakes.findIndex(q=>q.id===id);
  if(idx===-1)return;
  const q=quakes[idx];
  clearTimeout(q.rt);
  try{map.removeLayer(q.marker);}catch(e){}
  try{map.removeLayer(q.r1);}catch(e){}
  try{map.removeLayer(q.r2);}catch(e){}
  quakes.splice(idx,1);
  updateQuakeCount(); buildQuakeList();
}

// ══════════════════════════════════════
// 7. ORBITAL STRIKE
// ══════════════════════════════════════
function toggleStrikeMode() {
  strikeMode=!strikeMode;
  const btn=document.getElementById('btn-orbital-strike');
  const ind=document.getElementById('strike-indicator');
  btn.classList.toggle('active',strikeMode);
  ind.textContent=strikeMode?'ARMED':'OFF';
  ind.classList.toggle('on',strikeMode);
  toast(strikeMode?'☄ ORBITAL STRIKE ARMED — SELECT TARGET':'☄ STRIKE MODE DISENGAGED',strikeMode?'red':'cyan');
}

function strikeCountry(iso,name,layer,e) {
  if(struckCountries.has(iso))return;
  struckCountries.add(iso);
  const x=e.originalEvent?e.originalEvent.clientX:window.innerWidth/2;
  const y=e.originalEvent?e.originalEvent.clientY:window.innerHeight/2;
  explodeFX(x,y,'☄'); playBoom(); shakeFX();
  layer.setStyle({fillColor:'#ff2d4a',fillOpacity:0.4,color:'#ff2d4a',weight:2});
  setTimeout(()=>layer.setStyle({fillColor:'#332211',fillOpacity:0.2,color:'#554433',weight:0.8}),700);
  L.popup({closeButton:false,autoClose:true,autoPan:false})
    .setLatLng(e.latlng)
    .setContent(`<strong>☄ ORBITAL STRIKE</strong><br>${name}<br><span style="color:var(--amber)">Target neutralized from orbit.</span>`)
    .openOn(map);
  setTimeout(()=>map.closePopup(),2400);
  showAlertBanner(`☄ ORBITAL STRIKE EXECUTED ON ${name.toUpperCase()}`);
  toast(`☄ STRIKE CONFIRMED: ${name.toUpperCase()}`,'red');
}

// ══════════════════════════════════════
// 8. UI
// ══════════════════════════════════════
function showDetailPanel(title,html) {
  document.getElementById('dp-title').textContent=title;
  document.getElementById('dp-content').innerHTML=html;
  document.getElementById('detail-panel').classList.remove('hidden');
}
document.getElementById('dp-close').onclick=()=>document.getElementById('detail-panel').classList.add('hidden');

let toastTimer;
function toast(msg,type='cyan') {
  const el=document.getElementById('toast');
  el.textContent=msg; el.className=`show ${type}`;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),2800);
}

// ── Alert Feed (nav bell) ──────────────────────
let alertCount = 0;

// Wire up bell toggle
document.getElementById('btn-alert-bell').onclick = (e) => {
  e.stopPropagation();
  const feed = document.getElementById('alert-feed');
  feed.classList.toggle('hidden');
  // Reset badge when opened
  if (!feed.classList.contains('hidden')) {
    document.getElementById('alert-badge').classList.add('hidden');
    document.getElementById('alert-badge').textContent = '0';
    document.getElementById('btn-alert-bell').classList.remove('has-alerts');
    alertCount = 0;
  }
};

// Close feed when clicking outside
document.addEventListener('click', (e) => {
  if (!document.getElementById('alert-bell-wrap').contains(e.target)) {
    document.getElementById('alert-feed').classList.add('hidden');
  }
});

document.getElementById('btn-clear-alerts').onclick = () => {
  const list = document.getElementById('alert-feed-list');
  list.innerHTML = '<div class="alert-feed-empty">No alerts</div>';
  document.getElementById('alert-badge').classList.add('hidden');
  document.getElementById('btn-alert-bell').classList.remove('has-alerts');
  alertCount = 0;
};

function now() {
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

/**
 * Push an alert into the nav feed.
 * Replaces the old showAlertModal — no screen blocking, no popup.
 */
function showAlertModal(icon, title, level, body, color='var(--crimson)') {
  const list = document.getElementById('alert-feed-list');

  // Remove empty placeholder if present
  const empty = list.querySelector('.alert-feed-empty');
  if (empty) empty.remove();

  // Determine level badge class
  const lvlClass = /CRITICAL|CAT 5|CAT 4|MEGA|GREAT/i.test(level) ? 'level-crit'
    : /HIGH|CAT 3|MAJOR/i.test(level)   ? 'level-high'
    : /MED|CAT 2|STRONG|MODERATE/i.test(level) ? 'level-med'
    : 'level-low';

  // Strip HTML tags from body for feed summary
  const plainBody = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ').trim().slice(0,90)
    + (body.length > 90 ? '…' : '');

  const item = document.createElement('div');
  item.className = 'alert-item';
  item.innerHTML = `
    <div class="alert-item-icon">${icon}</div>
    <div class="alert-item-body">
      <div class="alert-item-title" style="color:${color}">${title}</div>
      <div class="alert-item-desc">${plainBody}</div>
      <div class="alert-item-time">⏱ ${now()}</div>
    </div>
    <div class="alert-item-level ${lvlClass}">${level}</div>
  `;

  // Prepend so newest is on top
  list.prepend(item);

  // Update badge
  alertCount++;
  const badge = document.getElementById('alert-badge');
  badge.textContent = alertCount > 99 ? '99+' : alertCount;
  badge.classList.remove('hidden');

  const bell = document.getElementById('btn-alert-bell');
  bell.classList.add('has-alerts');
}

/** Replaced: no more separate banner — feeds into the same bell */
function showAlertBanner(msg) {
  // Push a brief nav entry instead of a banner
  showAlertModal('⚠', msg, 'INFO', msg, 'var(--amber)');
}

function explodeFX(x,y,emoji) {
  const el=document.getElementById('explosion-fx');
  el.textContent=emoji; el.style.left=x+'px'; el.style.top=y+'px';
  el.className=''; void el.offsetWidth; el.classList.add('pop');
  setTimeout(()=>{el.classList.replace('pop','fade');setTimeout(()=>el.className='',380);},340);
}
function shakeFX() {
  document.getElementById('map').classList.add('shaking');
  setTimeout(()=>document.getElementById('map').classList.remove('shaking'),320);
}

document.getElementById('sp-toggle').onclick=()=>document.getElementById('side-panel').classList.toggle('open');
document.getElementById('sp-close').onclick=()=>document.getElementById('side-panel').classList.remove('open');

// ══════════════════════════════════════
// 9. HUD COUNTS + LISTS
// ══════════════════════════════════════
function updateWarCount()     { document.getElementById('war-count').textContent=WAR_ZONES.length; }
function updateTyphoonCount() { document.getElementById('typhoon-count').textContent=storms.length; }
function updateQuakeCount()   { document.getElementById('quake-count').textContent=quakes.length; }

function lClass(level) {
  return {CRITICAL:'level-crit',HIGH:'level-high',MED:'level-med',LOW:'level-low',
    'CAT 5':'level-crit','CAT 4':'level-high','CAT 3':'level-high','CAT 2':'level-med',
    GREAT:'level-crit',MAJOR:'level-high',STRONG:'level-med',MODERATE:'level-low',MINOR:'level-low',MEGA:'level-crit'}[level]||'level-low';
}

function buildWarList() {
  document.getElementById('war-list').innerHTML=WAR_ZONES.map(w=>`
    <div class="sp-item" onclick='showWarDetail(${JSON.stringify(w)})'>
      <span class="sp-item-dot" style="background:${w.level==='CRITICAL'?'var(--crimson)':w.level==='HIGH'?'#ff8844':w.level==='MED'?'var(--amber)':'var(--green)'};border-radius:50%;width:8px;height:8px;flex-shrink:0"></span>
      <span class="sp-item-name">${w.name}</span>
      <span class="sp-item-level ${lClass(w.level)}">${w.level}</span>
    </div>`).join('');
}

function buildTyphoonList() {
  document.getElementById('typhoon-list').innerHTML=storms.length===0
    ?'<div style="padding:10px 14px;font-size:0.62rem;color:var(--muted)">No active systems</div>'
    :storms.map(s=>`
    <div class="sp-item" onclick="showTyphoonDetail(${s.id},'${s.name}',${s.kph},${JSON.stringify(s.cat).replace(/"/g,"'")},${s.la},${s.lo})">
      <span style="font-size:0.9rem">🌀</span>
      <span class="sp-item-name">${s.name}</span>
      <span class="sp-item-level ${lClass(s.cat.cat)}" style="color:${s.cat.color}">${s.cat.cat}</span>
    </div>`).join('');
}

function buildQuakeList() {
  document.getElementById('quake-list').innerHTML=quakes.length===0
    ?'<div style="padding:10px 14px;font-size:0.62rem;color:var(--muted)">No recent events</div>'
    :quakes.map(q=>`
    <div class="sp-item" onclick="showQuakeDetail(${q.id},'${q.name}',${q.mag},${JSON.stringify(q.info).replace(/"/g,"'")},${q.la},${q.lo})">
      <span style="font-size:0.9rem">🌋</span>
      <span class="sp-item-name">M${q.mag.toFixed(1)} Seismic</span>
      <span class="sp-item-level ${lClass(q.info.level)}">${q.info.level}</span>
    </div>`).join('');
}

function checkCriticalAlerts() {
  const crit=WAR_ZONES.filter(w=>w.level==='CRITICAL');
  if(crit.length) {
    showAlertModal('⚔','CRITICAL WAR ZONES ACTIVE',
      `${crit.length} CRITICAL THREAT${crit.length>1?'S':''}`,
      crit.map(w=>`<strong>${w.name}</strong>: ${w.desc}`).join('<br><br>'),
      'var(--crimson)');
    showAlertBanner(`⚠ ${crit.length} CRITICAL CONFLICT ZONE${crit.length>1?'S':''} ACTIVE — REVIEW EVENTS PANEL`);
  }
}

// ══════════════════════════════════════
// 10. BUTTONS
// ══════════════════════════════════════
document.getElementById('btn-spawn-typhoon').onclick=()=>{try{getAC();}catch(e){} spawnTyphoon(true);};
document.getElementById('btn-spawn-quake').onclick  =()=>{try{getAC();}catch(e){} spawnQuake(true);};
document.getElementById('btn-orbital-strike').onclick=toggleStrikeMode;

// ══════════════════════════════════════
// 11. AUTO SPAWN
// ══════════════════════════════════════
function startAutoSpawn() {
  setTimeout(()=>spawnTyphoon(),2000);
  setTimeout(()=>spawnTyphoon(),5500);
  setTimeout(()=>spawnTyphoon(),9000);
  setTimeout(()=>spawnQuake(),3500);
  setTimeout(()=>spawnQuake(),8000);
  setInterval(()=>{if(storms.length<5)spawnTyphoon();},22000);
  setInterval(()=>{if(quakes.length<4)spawnQuake();},28000);
}

// ══════════════════════════════════════
// 12. MAIN INIT
// ══════════════════════════════════════
let appStarted=false;
async function initApp() {
  if(appStarted) return;
  appStarted=true;
  initMap();
  await loadCountries();
  loadWarZones();
  buildTyphoonList();
  buildQuakeList();
  startAutoSpawn();
  toast('🛰 ORBITAL SENTINEL ONLINE — MONITORING ACTIVE','cyan');
}

// ══════════════════════════════════════
// 13. FALLBACK GEO
// ══════════════════════════════════════
const FALLBACK_GEO={"type":"FeatureCollection","features":[
  {"type":"Feature","properties":{"ADMIN":"United States","ISO_A3":"USA"},"geometry":{"type":"Polygon","coordinates":[[[-125,48],[-66,48],[-80,25],[-117,25],[-125,48]]]}},
  {"type":"Feature","properties":{"ADMIN":"Canada","ISO_A3":"CAN"},"geometry":{"type":"Polygon","coordinates":[[[-140,83],[-52,83],[-52,48],[-140,48],[-140,83]]]}},
  {"type":"Feature","properties":{"ADMIN":"Mexico","ISO_A3":"MEX"},"geometry":{"type":"Polygon","coordinates":[[[-117,30],[-87,30],[-87,14],[-92,14],[-117,30]]]}},
  {"type":"Feature","properties":{"ADMIN":"Brazil","ISO_A3":"BRA"},"geometry":{"type":"Polygon","coordinates":[[[-74,5],[-34,5],[-38,-34],[-74,-16],[-74,5]]]}},
  {"type":"Feature","properties":{"ADMIN":"Argentina","ISO_A3":"ARG"},"geometry":{"type":"Polygon","coordinates":[[[-74,-20],[-53,-20],[-66,-56],[-74,-40],[-74,-20]]]}},
  {"type":"Feature","properties":{"ADMIN":"United Kingdom","ISO_A3":"GBR"},"geometry":{"type":"Polygon","coordinates":[[[-6,50],[2,50],[2,59],[-5,59],[-6,50]]]}},
  {"type":"Feature","properties":{"ADMIN":"France","ISO_A3":"FRA"},"geometry":{"type":"Polygon","coordinates":[[[-5,42],[8,42],[8,51],[-2,51],[-5,42]]]}},
  {"type":"Feature","properties":{"ADMIN":"Germany","ISO_A3":"DEU"},"geometry":{"type":"Polygon","coordinates":[[[6,47],[15,47],[15,55],[6,55],[6,47]]]}},
  {"type":"Feature","properties":{"ADMIN":"Spain","ISO_A3":"ESP"},"geometry":{"type":"Polygon","coordinates":[[[-10,36],[4,36],[4,44],[-10,44],[-10,36]]]}},
  {"type":"Feature","properties":{"ADMIN":"Italy","ISO_A3":"ITA"},"geometry":{"type":"Polygon","coordinates":[[[7,36],[19,36],[14,47],[7,47],[7,36]]]}},
  {"type":"Feature","properties":{"ADMIN":"Russia","ISO_A3":"RUS"},"geometry":{"type":"Polygon","coordinates":[[[28,50],[140,50],[140,80],[28,80],[28,50]]]}},
  {"type":"Feature","properties":{"ADMIN":"China","ISO_A3":"CHN"},"geometry":{"type":"Polygon","coordinates":[[[73,18],[135,18],[135,53],[73,53],[73,18]]]}},
  {"type":"Feature","properties":{"ADMIN":"Japan","ISO_A3":"JPN"},"geometry":{"type":"Polygon","coordinates":[[[130,30],[145,30],[145,46],[130,46],[130,30]]]}},
  {"type":"Feature","properties":{"ADMIN":"India","ISO_A3":"IND"},"geometry":{"type":"Polygon","coordinates":[[[68,8],[97,8],[97,36],[68,36],[68,8]]]}},
  {"type":"Feature","properties":{"ADMIN":"Australia","ISO_A3":"AUS"},"geometry":{"type":"Polygon","coordinates":[[[113,-44],[154,-44],[154,-10],[113,-10],[113,-44]]]}},
  {"type":"Feature","properties":{"ADMIN":"South Africa","ISO_A3":"ZAF"},"geometry":{"type":"Polygon","coordinates":[[[16,-35],[33,-35],[33,-22],[16,-22],[16,-35]]]}},
  {"type":"Feature","properties":{"ADMIN":"Nigeria","ISO_A3":"NGA"},"geometry":{"type":"Polygon","coordinates":[[[3,4],[15,4],[15,14],[3,14],[3,4]]]}},
  {"type":"Feature","properties":{"ADMIN":"Egypt","ISO_A3":"EGY"},"geometry":{"type":"Polygon","coordinates":[[[25,22],[35,22],[35,32],[25,32],[25,22]]]}},
  {"type":"Feature","properties":{"ADMIN":"Saudi Arabia","ISO_A3":"SAU"},"geometry":{"type":"Polygon","coordinates":[[[37,16],[56,16],[56,32],[37,32],[37,16]]]}},
  {"type":"Feature","properties":{"ADMIN":"Ukraine","ISO_A3":"UKR"},"geometry":{"type":"Polygon","coordinates":[[[22,44],[40,44],[40,52],[22,52],[22,44]]]}},
  {"type":"Feature","properties":{"ADMIN":"Indonesia","ISO_A3":"IDN"},"geometry":{"type":"Polygon","coordinates":[[[95,-8],[141,-8],[141,6],[95,6],[95,-8]]]}},
  {"type":"Feature","properties":{"ADMIN":"Pakistan","ISO_A3":"PAK"},"geometry":{"type":"Polygon","coordinates":[[[60,24],[77,24],[77,37],[60,37],[60,24]]]}},
  {"type":"Feature","properties":{"ADMIN":"Turkey","ISO_A3":"TUR"},"geometry":{"type":"Polygon","coordinates":[[[26,36],[45,36],[45,42],[26,42],[26,36]]]}},
  {"type":"Feature","properties":{"ADMIN":"Syria","ISO_A3":"SYR"},"geometry":{"type":"Polygon","coordinates":[[[36,32],[42,32],[42,37],[36,37],[36,32]]]}},
  {"type":"Feature","properties":{"ADMIN":"Yemen","ISO_A3":"YEM"},"geometry":{"type":"Polygon","coordinates":[[[42,12],[55,12],[55,19],[42,19],[42,12]]]}},
  {"type":"Feature","properties":{"ADMIN":"Afghanistan","ISO_A3":"AFG"},"geometry":{"type":"Polygon","coordinates":[[[60,29],[74,29],[74,38],[60,38],[60,29]]]}},
  {"type":"Feature","properties":{"ADMIN":"Sudan","ISO_A3":"SDN"},"geometry":{"type":"Polygon","coordinates":[[[22,10],[38,10],[38,22],[22,22],[22,10]]]}},
  {"type":"Feature","properties":{"ADMIN":"Somalia","ISO_A3":"SOM"},"geometry":{"type":"Polygon","coordinates":[[[41,2],[51,2],[51,12],[41,12],[41,2]]]}},
  {"type":"Feature","properties":{"ADMIN":"Myanmar","ISO_A3":"MMR"},"geometry":{"type":"Polygon","coordinates":[[[92,10],[101,10],[101,28],[92,28],[92,10]]]}},
  {"type":"Feature","properties":{"ADMIN":"Philippines","ISO_A3":"PHL"},"geometry":{"type":"Polygon","coordinates":[[[117,5],[127,5],[127,20],[117,20],[117,5]]]}},
  {"type":"Feature","properties":{"ADMIN":"Vietnam","ISO_A3":"VNM"},"geometry":{"type":"Polygon","coordinates":[[[102,8],[110,8],[110,23],[102,23],[102,8]]]}},
  {"type":"Feature","properties":{"ADMIN":"South Korea","ISO_A3":"KOR"},"geometry":{"type":"Polygon","coordinates":[[[126,34],[130,34],[130,38],[126,38],[126,34]]]}},
  {"type":"Feature","properties":{"ADMIN":"Iraq","ISO_A3":"IRQ"},"geometry":{"type":"Polygon","coordinates":[[[38,29],[48,29],[48,38],[38,38],[38,29]]]}},
  {"type":"Feature","properties":{"ADMIN":"Ethiopia","ISO_A3":"ETH"},"geometry":{"type":"Polygon","coordinates":[[[33,3],[48,3],[48,15],[33,15],[33,3]]]}},
  {"type":"Feature","properties":{"ADMIN":"DR Congo","ISO_A3":"COD"},"geometry":{"type":"Polygon","coordinates":[[[12,-13],[31,-13],[31,5],[12,5],[12,-13]]]}},
  {"type":"Feature","properties":{"ADMIN":"Mali","ISO_A3":"MLI"},"geometry":{"type":"Polygon","coordinates":[[[-5,10],[4,10],[4,25],[-5,25],[-5,10]]]}},
]};