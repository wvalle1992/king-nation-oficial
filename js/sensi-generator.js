// ========================= CLEAN SCRIPT (device-aware) =========================
// Build brand map
const byBrand = (() => {
  const map = new Map();
  for(const x of CATALOG){ if(!map.has(x.brand)) map.set(x.brand, []); map.get(x.brand).push(x); }
  for(const [k, arr] of map){ arr.sort((a,b)=>a.model.localeCompare(b.model)); }
  return new Map([...map.entries()].sort((a,b)=>a[0].localeCompare(b[0])));
})();

// DOM refs
const $brand = document.getElementById('brand');
const $model = document.getElementById('model');
const $profile = document.getElementById('profile');
const $dpi = document.getElementById('dpi');
const $q = document.getElementById('q');
const $suggestions = document.getElementById('suggestions');
const $btnShow = document.getElementById('btnShow');
const $btnCopy = document.getElementById('btnCopy');
const $btnClear = document.getElementById('btnClear');
const $tbl = document.getElementById('tbl');
const $tbody = $tbl.querySelector('tbody');
const $title = document.getElementById('resultTitle');
const $meta = document.getElementById('resultMeta');
const $badges = document.getElementById('badges');

// ---------- Helpers that AVOID innerHTML so models with quotes (iPad Pro 11") work ----------
function setSelectOptions(selectEl, values, placeholderText){
  while(selectEl.firstChild) selectEl.removeChild(selectEl.firstChild);
  if(placeholderText){
    const ph = document.createElement('option');
    ph.value = ""; ph.textContent = placeholderText; ph.disabled = true; ph.selected = true; ph.hidden = true;
    selectEl.appendChild(ph);
  }
  for(const v of values){
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v; selectEl.appendChild(opt);
  }
}
function setDatalistOptions(datalistEl, values){
  while(datalistEl.firstChild) datalistEl.removeChild(datalistEl.firstChild);
  for(const v of values){
    const opt = document.createElement('option');
    opt.value = v; datalistEl.appendChild(opt);
  }
}
function placeholder(text){ return text; }

function buildSuggestions(filterBrand=''){
  const list = filterBrand ? (byBrand.get(filterBrand) || []) : CATALOG;
  const vals = list.map(x=>`${x.brand} ${x.model}`);
  setDatalistOptions($suggestions, vals);
}
function fillBrands(){
  const brands = [...byBrand.keys()];
  setSelectOptions($brand, brands, 'Selecciona marca');
}
function fillModels(){
  const b = $brand.value;
  if(!b){ setSelectOptions($model, [], 'Selecciona modelo'); return; }
  const list = byBrand.get(b) || [];
  const models = list.map(x=>x.model);
  setSelectOptions($model, models, 'Selecciona modelo');
  buildSuggestions(b);
}

function validate(){
  const ok = Boolean($brand.value && $model.value && $profile.value && $dpi.value);
  $btnShow.disabled = !ok; $btnCopy.disabled = !ok;
}
function searchSmart(q){
  q = (q||'').trim().toLowerCase();
  if(!q) return null;
  return CATALOG.find(x => `${x.brand} ${x.model}`.toLowerCase().includes(q));
}

// Brand-based DPI helper
function suggestedDpi(brand, prof){
  const p = prof||'mid';
  const row = SUGGESTED_DPI_BY_BRAND[brand] || {low:520, mid:680, high:780};
  return row[p] || row.mid;
}

// Hardware-aware scaling
const BASELINE = {refresh:120, touch:240}; // reference
function clamp100_200(v){ return Math.max(1, Math.min(200, Math.round(v))); }
function getDeviceSpec(brand, model){
  return DEVICE_SPECS.get([brand, model].toString()) || null;
}
function scaleByDevice(base, spec){
  if(!spec) return {...base};
  const refresh = spec.refresh || BASELINE.refresh;
  const touch = spec.touch || BASELINE.touch;
  const instant = spec.instant || null;

  const dTouch = (touch - BASELINE.touch) / BASELINE.touch;
  const dRef   = (refresh - BASELINE.refresh) / BASELINE.refresh;

  const out = {...base};
  const generalDelta = Math.round((-dTouch*10) + (-dRef*6));
  const redDelta     = Math.round((-dTouch*10) + (-dRef*5));
  const x2Delta      = Math.round((-dTouch*8)  + (-dRef*4));
  const x4Delta      = Math.round((-dTouch*7)  + (-dRef*3));
  const sniperDelta  = Math.round((-dTouch*6)  + (-dRef*2));
  const freeDelta    = Math.round((-dTouch*6)  + (-dRef*2));

  out.general   = clamp100_200(out.general + generalDelta);
  out.red       = clamp100_200(out.red + redDelta);
  out.x2        = clamp100_200(out.x2 + x2Delta);
  out.x4        = clamp100_200(out.x4 + x4Delta);
  out.sniper    = clamp100_200(out.sniper + sniperDelta);
  out.freelook  = clamp100_200(out.freelook + freeDelta);

  if(instant && instant >= 1000){
    out.red   = clamp100_200(out.red - 2);
    out.x2    = clamp100_200(out.x2 - 2);
    out.x4    = clamp100_200(out.x4 - 2);
    out.sniper= clamp100_200(out.sniper - 2);
  }
  return out;
}
function getSensiFor(brand, model, profile){
  const item = (byBrand.get(brand) || []).find(x=>x.model===model);
  if(!item) return null;
  const base = item.sensi[profile];
  const spec = getDeviceSpec(brand, model);
  return scaleByDevice(base, spec);
}

function render(){
  const b = $brand.value, m = $model.value, prof = $profile.value, dpip = $dpi.value;
  if(!b || !m || !prof || !dpip){
    $tbl.hidden = true; $tbody.innerHTML='';
    $title.textContent='Selecciona opciones para ver la Sensi…';
    $meta.textContent='—'; $badges.innerHTML='';
    return;
  }
  const item = (byBrand.get(b) || []).find(x=>x.model===m);
  if(!item){ $tbl.hidden = true; $tbody.innerHTML=''; return; }

  const s = getSensiFor(b, m, prof);
  $title.textContent = `${b} ${m} — ${prof==='low'?'Baja':prof==='mid'?'Media':'Alta'}`;
  const dpiBadge = (b==='Apple') ? 'DPI: N/A (iOS)' : (dpip==='with' ? `DPI sugerido: ${suggestedDpi(b, prof)}` : 'DPI: Sin ajustar');
  const spec = getDeviceSpec(b, m);
  const specBadge = spec ? `Hz: ${spec.refresh || '-'} / Touch: ${spec.touch}${spec.instant?` (inst ${spec.instant})`:''}` : 'Hz/Touch: estándar';
  $meta.textContent = 'Presets orientativos adaptados a tu hardware; ajusta según FPS y estilo.';
  $badges.innerHTML = [ `Gyro: ${item.gyro? 'ON':'OFF'}`, dpiBadge, specBadge ].map(t=>`<span class="tag">${t}</span>`).join('');

  $tbody.innerHTML = '';
  const rows = [ ['General', s.general], ['Punto Rojo', s.red], ['2x Scope', s.x2], ['4x Scope', s.x4], ['Franco (AWM)', s.sniper], ['Mirada Libre', s.freelook] ];
  for(const [k,v] of rows){ const tr = document.createElement('tr'); tr.innerHTML = `<td>${k}</td><td>${v}</td>`; $tbody.appendChild(tr); }
  $tbl.hidden = false;
}
function copySettings(){
  const b = $brand.value, m = $model.value, prof = $profile.value, dpip = $dpi.value; if(!b||!m||!prof||!dpip) return;
  const item = (byBrand.get(b) || []).find(x=>x.model===m); if(!item) return; const s = getSensiFor(b, m, prof);
  const header = `Sensi de ${b} ${m} (${prof==='low'?'Baja':prof==='mid'?'Media':'Alta'})`;
  const dpiLine = (b==='Apple') ? 'DPI: N/A (iOS)' : (dpip==='with' ? `DPI sugerido: ${suggestedDpi(b, prof)}` : 'DPI: Sin ajustar');
  const spec = getDeviceSpec(b,m);
  const specLine = spec ? `Panel: ${spec.refresh||'-'}Hz · Touch: ${spec.touch}Hz${spec.instant?` (inst ${spec.instant}Hz)`:''}` : 'Panel: estándar';
  const lines = [ header, dpiLine, specLine, `Gyro: ${item.gyro? 'ON':'OFF'}`, `General: ${s.general}`, `Punto Rojo: ${s.red}`, `2x: ${s.x2}`, `4x: ${s.x4}`, `Franco: ${s.sniper}`, `Mirada Libre: ${s.freelook}` ].join('\n');
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(lines); }
}
$brand.addEventListener('change', ()=>{ fillModels(); validate(); });
$model.addEventListener('change', validate);
$profile.addEventListener('change', validate);
$dpi.addEventListener('change', validate);
document.getElementById('btnShow').addEventListener('click', render);
document.getElementById('btnCopy').addEventListener('click', copySettings);
document.getElementById('btnClear').addEventListener('click', ()=>{ fillBrands(); fillModels(); buildSuggestions(''); $q.value=''; $profile.selectedIndex = 0; $dpi.selectedIndex = 0; validate(); render(); });
$q.addEventListener('input', ()=>{
  const hit = searchSmart($q.value);
  if(hit){ $brand.value = hit.brand; fillModels(); $model.value = hit.model; validate(); }
});
$q.addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){
    const hit = searchSmart($q.value);
    if(hit){ $brand.value = hit.brand; fillModels(); $model.value = hit.model; }
    validate(); if(!document.getElementById('btnShow').disabled){ e.preventDefault(); render(); }
  }
});
window.addEventListener('keydown', (e)=>{ if(e.key==='Enter' && !document.getElementById('btnShow').disabled){ e.preventDefault(); render(); } });
fillBrands();
fillModels();
buildSuggestions('');
validate();
render();
// ======================= END CLEAN SCRIPT =======================
