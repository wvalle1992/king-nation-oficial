const CATALOG = [];
const KING_NATION_HEADSHOT_BASELINE = {
  general:185,
  red:171,
  x2:153,
  x4:174,
  sniper:65,
  freelook:170
};
const DEFAULT_SENSI_PROFILE_ID = 'king-headshot';
const SENSI_PROFILES = [
  {
    id:'suave-control',
    label:'Suave / Control',
    description:'Más estable para jugadores que sienten temblor, sobredrag o prefieren controlar mejor cada mira.',
    dpiTier:'low',
    baseline:{general:178, red:162, x2:146, x4:165, sniper:60, freelook:160}
  },
  {
    id:'balanceado',
    label:'Balanceado',
    description:'Opción segura para la mayoría: levanta bien a la cabeza sin sentirse demasiado agresiva.',
    dpiTier:'mid',
    baseline:{general:182, red:167, x2:150, x4:170, sniper:62, freelook:165}
  },
  {
    id:'king-headshot',
    label:'King Headshot',
    description:'Estilo principal King Nation para drag agresivo y levantada fuerte de headshot.',
    dpiTier:'high',
    baseline:{...KING_NATION_HEADSHOT_BASELINE}
  },
  {
    id:'pvp-escopeta',
    label:'PvP Escopeta',
    description:'Corta distancia para Desert Eagle, M1887 y M1014 con drag rápido y Rojo fuerte.',
    dpiTier:'high',
    baseline:{general:191, red:175, x2:158, x4:169, sniper:57, freelook:182}
  },
  {
    id:'br-ranked',
    label:'BR Ranked',
    description:'Agresiva pero más estable para BR, peleas largas, AR y distancias mezcladas.',
    dpiTier:'high',
    baseline:{general:185, red:170, x2:153, x4:176, sniper:64, freelook:172}
  },
  {
    id:'control-4x',
    label:'4x Control',
    description:'Para levantar a la cabeza sin sobredrag en 4x o AR a larga distancia.',
    dpiTier:'mid',
    baseline:{general:183, red:169, x2:152, x4:168, sniper:64, freelook:168}
  }
];
const KING_NATION_SENSI_PRESETS = buildSensiPreset();

function tuneSensi(values, delta={}){
  return {
    general: values.general + (delta.general || 0),
    red: values.red + (delta.red || 0),
    x2: values.x2 + (delta.x2 || 0),
    x4: values.x4 + (delta.x4 || 0),
    sniper: values.sniper + (delta.sniper || 0),
    freelook: values.freelook + (delta.freelook || 0)
  };
}
function buildSensiPreset(profileDeltas={}){
  return Object.fromEntries(SENSI_PROFILES.map((profile) => {
    const delta = profileDeltas[profile.id] || profileDeltas.default || {};
    return [profile.id, tuneSensi(profile.baseline, delta)];
  }));
}
function addBatch(brand, models, opts={}){
  const base = opts.base || KING_NATION_SENSI_PRESETS;
  const gyroDefault = Boolean(opts.gyro);
  for(const m of models){
    const modelName = (typeof m === 'object' && m.name) ? m.name : m;
    const gyro = (typeof m === 'object' && 'gyro' in m) ? Boolean(m.gyro) : gyroDefault;
    const sensi = (typeof m === 'object' && m.sensi) ? m.sensi : base;
    CATALOG.push({brand, model:modelName, gyro, sensi});
  }
}

// Catalog
addBatch('Apple', [
  'iPhone 9','iPhone SE (2nd Gen)','iPhone X','iPhone XR','iPhone XS','iPhone XS Max',
  'iPhone 11','iPhone 11 Pro','iPhone 11 Pro Max',
  'iPhone 12','iPhone 12 Mini','iPhone 12 Pro','iPhone 12 Pro Max',
  'iPhone 13','iPhone 13 Mini','iPhone 13 Pro','iPhone 13 Pro Max',
  'iPhone 14','iPhone 14 Plus','iPhone 14 Pro','iPhone 14 Pro Max',
  'iPhone 15','iPhone 15 Plus','iPhone 15 Pro','iPhone 15 Pro Max',
  'iPhone 16','iPhone 16 Plus','iPhone 16 Pro','iPhone 16 Pro Max',
  'iPad 9th Gen','iPad 10th Gen','iPad Air 5','iPad Mini 6','iPad Pro 11"','iPad Pro 12.9"'
], {gyro:true});

// Samsung Galaxy A56 keeps a tuned profile, refreshed from the King Nation headshot baseline.
addBatch('Samsung', [
  'Galaxy A03','Galaxy A05s','Galaxy A14','Galaxy A24','Galaxy A34','Galaxy A54','Galaxy A55',
  {
    name:'Galaxy A56',
    gyro:true,
    sensi:buildSensiPreset({default:{general:2, red:2, x2:1}})
  },
  'Galaxy M14','Galaxy M34','Galaxy S20 FE','Galaxy S21 FE',
  'Galaxy S22','Galaxy S22+','Galaxy S22 Ultra','Galaxy S23','Galaxy S23+','Galaxy S23 Ultra',
  'Galaxy S24','Galaxy S24+','Galaxy S24 Ultra'
], {gyro:true});

addBatch('Xiaomi', [
  'Redmi 9A','Redmi 10C','Redmi 13C',
  'Redmi Note 9','Redmi Note 10','Redmi Note 11',
  'Redmi Note 12','Redmi Note 12 Pro',
  'Redmi Note 13','Redmi Note 13 Pro','Redmi Note 13 Pro+',
  'Redmi Note 8','Redmi Note 8 Pro','Redmi Note 8T (2019)','Redmi Note 8T (2021)',
  'POCO M4 Pro','POCO F4','POCO X3 Pro','POCO X5','POCO X6 Pro'
]);
addBatch('Motorola', ['Moto E13','Moto E22','Moto G13','Moto G32','Moto G54','Moto G84','Edge 30','Edge 40']);
addBatch('OPPO', ['A16','A57','A78','Reno 7','Reno 8','Reno 10']);
addBatch('vivo', ['Y20','Y21','Y27','Y36','V21','V27','V30','V30 Pro','V30e']);
addBatch('TECNO', ['Spark 10','Spark 20','Pova 5','Camon 20']);
addBatch('Infinix', ['Hot 11','Hot 12','Hot 30','Hot 40','Note 12','Note 30']);
addBatch('Huawei', ['P30 Lite','P40 Lite','nova 9','Y9s','Y9a'], {gyro:true});
addBatch('realme', ['C25','C55','9i','10 Pro+','11 Pro+']);
addBatch('OnePlus', ['7T','8','9','Nord','Nord 2','11R'], {gyro:true});
addBatch('Google', ['Pixel 4a','Pixel 5a','Pixel 6a','Pixel 7','Pixel 7a'], {gyro:true});
addBatch('Nokia', ['G10','G20','X10']);
addBatch('ZTE', ['Blade A31','Blade A51']);
addBatch('Alcatel', ['1','1S','3']);
addBatch('BLU', ['G9 Pro','Studio X10']);
addBatch('Sony', ['Xperia 10 III','Xperia 5 IV'], {gyro:true});
addBatch('Honor', ['X8','50 Lite'], {gyro:true});
addBatch('LG', ['K51S','K61']);

// Device specs (refresh/touch/instant)
const DEVICE_SPECS = new Map([
  [["Samsung","Galaxy S24"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy S24+"].toString(),       {refresh:120, touch:240}],
  [["Samsung","Galaxy S24 Ultra"].toString(),  {refresh:120, touch:240}],
  [["Samsung","Galaxy A56"].toString(),        {refresh:120, touch:240}],
  [["Motorola","Moto G54"].toString(),         {refresh:120, touch:240}],
  [["Infinix","Hot 40"].toString(),            {refresh:90,  touch:240}],
  [["Xiaomi","POCO X6 Pro"].toString(),        {refresh:120, touch:480, instant:2160}],
  [["Xiaomi","Redmi Note 13 Pro+"].toString(), {refresh:120, touch:240, instant:2160}],
  [["Xiaomi","Redmi 13C"].toString(),          {refresh:90,  touch:180}],
  [["Xiaomi","Redmi Note 8"].toString(),       {refresh:60,  touch:120}],
  [["Xiaomi","Redmi Note 8 Pro"].toString(),   {refresh:60,  touch:120}],
  [["Xiaomi","Redmi Note 8T (2019)"].toString(), {refresh:60, touch:120}],
  [["Xiaomi","Redmi Note 8T (2021)"].toString(), {refresh:60, touch:120}],
  [["Apple","iPhone 11 Pro"].toString(),       {refresh:60,  touch:120}],
  [["Apple","iPhone 12 Pro Max"].toString(),   {refresh:60,  touch:240}],
  [["Apple","iPhone 13 Pro"].toString(),       {refresh:120, touch:240}],
  [["Apple","iPhone 14 Pro"].toString(),       {refresh:120, touch:240}],
  [["Apple","iPhone 15 Pro Max"].toString(),   {refresh:120, touch:240}],
  [["Apple","iPhone 16 Pro Max"].toString(),   {refresh:120, touch:240}],
  [["Apple","iPad 9th Gen"].toString(),        {refresh:60,  touch:120}],
  [["Apple","iPad 10th Gen"].toString(),       {refresh:60,  touch:120}],
  [["Apple","iPad Air 5"].toString(),          {refresh:60,  touch:120}],
  [["Apple","iPad Mini 6"].toString(),         {refresh:60,  touch:120}],
  [["Apple","iPad Pro 11\""].toString(),       {refresh:120, touch:240}],
  [["Apple","iPad Pro 12.9\""].toString(),     {refresh:120, touch:240}],
]);

const SUGGESTED_DPI_BY_BRAND = {
  'Samsung': {low:620, mid:740, high:840},
  'Xiaomi': {low:570, mid:720, high:840},
  'Motorola': {low:540, mid:700, high:800},
  'Infinix': {low:520, mid:670, high:780},
  'TECNO': {low:520, mid:670, high:780},
  'realme': {low:560, mid:700, high:800},
  'OPPO': {low:560, mid:720, high:820},
  'vivo': {low:540, mid:700, high:800},
  'Huawei': {low:580, mid:720, high:820},
  'OnePlus': {low:580, mid:740, high:840},
  'Google': {low:580, mid:740, high:840},
  'Nokia': {low:520, mid:670, high:760},
  'ZTE': {low:520, mid:660, high:740},
  'Alcatel': {low:500, mid:640, high:720},
  'BLU': {low:500, mid:640, high:720},
  'Sony': {low:580, mid:720, high:820},
  'Honor': {low:580, mid:720, high:820},
  'Apple': {low:0, mid:0, high:0}
};
