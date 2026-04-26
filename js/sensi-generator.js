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
const $profileHelp = document.getElementById('profileHelp');
const $dpi = document.getElementById('dpi');
const $q = document.getElementById('q');
const $suggestions = document.getElementById('suggestions');
const $btnShow = document.getElementById('btnShow');
const $btnCopy = document.getElementById('btnCopy');
const $btnClear = document.getElementById('btnClear');
const $btnCopySensi = document.getElementById('btnCopySensi');
const $btnWhatsAppSensi = document.getElementById('btnWhatsAppSensi');
const $btnShareSensi = document.getElementById('btnShareSensi');
const $sensiShareStatus = document.getElementById('sensiShareStatus');
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
function deviceSearchTerms(item){
  const aliases = Array.isArray(item.aliases) ? item.aliases : [];
  const terms = [item.brand, item.model, `${item.brand} ${item.model}`, ...aliases];
  if(item.brand === 'Redmi' || item.brand === 'POCO'){
    terms.push(`Xiaomi ${item.brand} ${item.model}`);
  }
  return terms;
}
function deviceSearchText(item){
  return deviceSearchTerms(item).join(' ').toLowerCase();
}
function getProfile(profileId){
  return SENSI_PROFILES.find((profile) => profile.id === profileId)
    || SENSI_PROFILES.find((profile) => profile.id === DEFAULT_SENSI_PROFILE_ID)
    || SENSI_PROFILES[0];
}
function profileLabel(profileId){
  const profile = getProfile(profileId);
  return profile ? profile.label : 'King Headshot';
}
function profileDescription(profileId){
  const profile = getProfile(profileId);
  return profile ? profile.description : '';
}
function profileDpiTier(profileId){
  const profile = getProfile(profileId);
  return profile ? profile.dpiTier : 'mid';
}
function profileStyleNote(profileId){
  const notes = {
    'suave-control':'suave y estable para mejor control.',
    'balanceado':'balanceado para la mayoría de jugadores.',
    'king-headshot':'agresivo para levantar mira y buscar headshot.',
    'pvp-escopeta':'rápido para PvP, Desert Eagle y escopetas.',
    'br-ranked':'estable para partidas largas y ranked.',
    'control-4x':'controlado para AR y mira 4x.'
  };
  return notes[profileId] || 'balanceado para la mayoría de jugadores.';
}
function fillProfiles(){
  while($profile.firstChild) $profile.removeChild($profile.firstChild);
  const ph = document.createElement('option');
  ph.value = "";
  ph.textContent = 'Selecciona perfil';
  ph.disabled = true;
  ph.selected = true;
  ph.hidden = true;
  $profile.appendChild(ph);
  for(const profile of SENSI_PROFILES){
    const opt = document.createElement('option');
    opt.value = profile.id;
    opt.textContent = profile.label;
    opt.title = profile.description;
    $profile.appendChild(opt);
  }
}
function updateProfileHelp(){
  if(!$profileHelp) return;
  $profileHelp.textContent = $profile.value
    ? profileDescription($profile.value)
    : 'Elige un estilo: control suave, balanceado, headshot agresivo, escopeta, BR o 4x.';
}

function buildSuggestions(filterBrand=''){
  const list = filterBrand ? (byBrand.get(filterBrand) || []) : CATALOG;
  const vals = [...new Set(list.flatMap((x) => [
    `${x.brand} ${x.model}`,
    ...(Array.isArray(x.aliases) ? x.aliases : [])
  ]))];
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
function showSensiStatus(message){
  if(!$sensiShareStatus) return;
  $sensiShareStatus.textContent = message;
}
function searchSmart(q){
  q = (q||'').trim().toLowerCase();
  if(!q) return null;
  return CATALOG.find(x => deviceSearchText(x).includes(q));
}

// Brand-based DPI helper
function suggestedDpi(brand, prof){
  const p = profileDpiTier(prof);
  const row = SUGGESTED_DPI_BY_BRAND[brand] || {low:520, mid:680, high:780};
  return row[p] || row.mid;
}

// Hardware-aware scaling
const BASELINE = {refresh:120, touch:240}; // iPad Pro 11 reference used for the King Nation baseline
const AIM_DEVICE_SCALING = {
  general:{touch:6, refresh:4},
  red:{touch:7, refresh:4},
  x2:{touch:5, refresh:3},
  x4:{touch:4, refresh:2},
  sniper:{touch:1, refresh:1}
};
const FREELOOK_DEVICE_SCALING = {touch:3, refresh:2};
function clampFreeFire(v){ return Math.max(1, Math.min(200, Math.round(v))); }
function getDeviceSpec(brand, model){
  return DEVICE_SPECS.get([brand, model].toString()) || null;
}
function deviceDelta(dTouch, dRef, weights){
  return Math.round((-dTouch * weights.touch) + (-dRef * weights.refresh));
}
function scaleByDevice(base, spec){
  if(!spec) return {...base};
  const refresh = spec.refresh || BASELINE.refresh;
  const touch = spec.touch || BASELINE.touch;
  const instant = spec.instant || null;

  const dTouch = (touch - BASELINE.touch) / BASELINE.touch;
  const dRef   = (refresh - BASELINE.refresh) / BASELINE.refresh;

  const out = {...base};
  const generalDelta = deviceDelta(dTouch, dRef, AIM_DEVICE_SCALING.general);
  const redDelta     = deviceDelta(dTouch, dRef, AIM_DEVICE_SCALING.red);
  const x2Delta      = deviceDelta(dTouch, dRef, AIM_DEVICE_SCALING.x2);
  const x4Delta      = deviceDelta(dTouch, dRef, AIM_DEVICE_SCALING.x4);
  const sniperDelta  = deviceDelta(dTouch, dRef, AIM_DEVICE_SCALING.sniper);
  const freeDelta    = deviceDelta(dTouch, dRef, FREELOOK_DEVICE_SCALING);

  out.general   = clampFreeFire(out.general + generalDelta);
  out.red       = clampFreeFire(out.red + redDelta);
  out.x2        = clampFreeFire(out.x2 + x2Delta);
  out.x4        = clampFreeFire(out.x4 + x4Delta);
  out.sniper    = clampFreeFire(out.sniper + sniperDelta);
  out.freelook  = clampFreeFire(out.freelook + freeDelta);

  if(instant && instant >= 1000){
    out.red   = clampFreeFire(out.red - 1);
    out.x2    = clampFreeFire(out.x2 - 1);
    out.x4    = clampFreeFire(out.x4 - 2);
    out.sniper= clampFreeFire(out.sniper - 1);
  }
  return out;
}
function getSensiFor(brand, model, profile){
  const item = (byBrand.get(brand) || []).find(x=>x.model===model);
  if(!item) return null;
  const base = item.sensi[profile] || item.sensi[DEFAULT_SENSI_PROFILE_ID];
  const spec = getDeviceSpec(brand, model);
  return scaleByDevice(base, spec);
}
function getCurrentSensiResult(){
  const b = $brand.value, m = $model.value, prof = $profile.value, dpip = $dpi.value;
  if(!b || !m || !prof || !dpip) return null;
  const item = (byBrand.get(b) || []).find(x=>x.model===m);
  if(!item) return null;
  const sensi = getSensiFor(b, m, prof);
  if(!sensi) return null;
  const spec = getDeviceSpec(b, m);
  return {brand:b, model:m, profile:prof, dpiPreference:dpip, item, sensi, spec};
}
function formatSensiExport(result){
  const dpiLine = result.brand === 'Apple'
    ? 'N/A (iOS)'
    : (result.dpiPreference === 'with' ? suggestedDpi(result.brand, result.profile) : 'Sin ajustar');
  const specLine = result.spec
    ? `${result.spec.refresh || '-'} / ${result.spec.touch}${result.spec.instant ? ` (inst ${result.spec.instant})` : ''}`
    : 'estándar';
  const s = result.sensi;
  return [
    'King Nation Oficial — Sensi por Modelo',
    '',
    `Dispositivo: ${result.brand} ${result.model}`,
    `Perfil: ${profileLabel(result.profile)}`,
    `DPI: ${dpiLine}`,
    `Hz / Touch: ${specLine}`,
    '',
    `General: ${s.general}`,
    `Punto Rojo: ${s.red}`,
    `2x Scope: ${s.x2}`,
    `4x Scope: ${s.x4}`,
    `Franco (AWM): ${s.sniper}`,
    `Mirada Libre: ${s.freelook}`,
    '',
    `Estilo: ${profileStyleNote(result.profile)}`,
    'Generado en King Nation Oficial.'
  ].join('\n');
}
function ensureExportText(){
  const result = getCurrentSensiResult();
  if(!result){
    showSensiStatus('Selecciona marca, modelo, perfil y DPI para exportar la Sensi.');
    return '';
  }
  return formatSensiExport(result);
}
function fallbackCopyText(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let ok = false;
  try{
    ok = document.execCommand('copy');
  }catch(_err){
    ok = false;
  }
  document.body.removeChild(ta);
  return ok ? Promise.resolve() : Promise.reject(new Error('copy-failed'));
}
function copyTextSafe(text){
  if(navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
  }
  return fallbackCopyText(text);
}
function copySensiExport(message='Sensi copiada ✅'){
  const text = ensureExportText();
  if(!text) return Promise.resolve(false);
  return copyTextSafe(text)
    .then(()=>{ showSensiStatus(message); return true; })
    .catch(()=>{ showSensiStatus('No se pudo copiar. Inténtalo otra vez.'); return false; });
}

function render(){
  const b = $brand.value, m = $model.value, prof = $profile.value, dpip = $dpi.value;
  if(!b || !m || !prof || !dpip){
    $tbl.hidden = true; $tbody.innerHTML='';
    $title.textContent='Selecciona opciones para ver la Sensi…';
    $meta.textContent='—'; $badges.innerHTML='';
    showSensiStatus('');
    return;
  }
  const item = (byBrand.get(b) || []).find(x=>x.model===m);
  if(!item){ $tbl.hidden = true; $tbody.innerHTML=''; return; }

  const s = getSensiFor(b, m, prof);
  $title.textContent = `${b} ${m} — ${profileLabel(prof)}`;
  const dpiBadge = (b==='Apple') ? 'DPI: N/A (iOS)' : (dpip==='with' ? `DPI sugerido: ${suggestedDpi(b, prof)}` : 'DPI: Sin ajustar');
  const spec = getDeviceSpec(b, m);
  const specBadge = spec ? `Hz: ${spec.refresh || '-'} / Touch: ${spec.touch}${spec.instant?` (inst ${spec.instant})`:''}` : 'Hz/Touch: estándar';
  $meta.textContent = profileDescription(prof);
  $badges.innerHTML = [ `Gyro: ${item.gyro? 'ON':'OFF'}`, dpiBadge, specBadge ].map(t=>`<span class="tag">${t}</span>`).join('');

  $tbody.innerHTML = '';
  const rows = [ ['General', s.general], ['Punto Rojo', s.red], ['2x Scope', s.x2], ['4x Scope', s.x4], ['Franco (AWM)', s.sniper], ['Mirada Libre', s.freelook] ];
  for(const [k,v] of rows){ const tr = document.createElement('tr'); tr.innerHTML = `<td>${k}</td><td>${v}</td>`; $tbody.appendChild(tr); }
  $tbl.hidden = false;
}
function copySettings(){
  copySensiExport();
}
$brand.addEventListener('change', ()=>{ fillModels(); validate(); });
$model.addEventListener('change', validate);
$profile.addEventListener('change', ()=>{ updateProfileHelp(); validate(); });
$dpi.addEventListener('change', validate);
document.getElementById('btnShow').addEventListener('click', render);
document.getElementById('btnCopy').addEventListener('click', copySettings);
if($btnCopySensi){ $btnCopySensi.addEventListener('click', ()=>copySensiExport()); }
if($btnWhatsAppSensi){
  $btnWhatsAppSensi.addEventListener('click', ()=>{
    const text = ensureExportText();
    if(!text) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    showSensiStatus('Abriendo WhatsApp…');
  });
}
if($btnShareSensi){
  $btnShareSensi.addEventListener('click', ()=>{
    const text = ensureExportText();
    if(!text) return;
    if(navigator.share){
      navigator.share({text}).then(()=>showSensiStatus('Sensi compartida ✅')).catch(()=>{});
      return;
    }
    copySensiExport('Compartir no disponible; Sensi copiada ✅');
  });
}
document.getElementById('btnClear').addEventListener('click', ()=>{ fillBrands(); fillModels(); buildSuggestions(''); $q.value=''; $profile.selectedIndex = 0; $dpi.selectedIndex = 0; updateProfileHelp(); validate(); render(); });
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
fillProfiles();
fillBrands();
fillModels();
buildSuggestions('');
updateProfileHelp();
validate();
render();
// ======================= END CLEAN SCRIPT =======================
