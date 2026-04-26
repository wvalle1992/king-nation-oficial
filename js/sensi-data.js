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
function device(name, tier='mid', aliases=[]){
  return {name, tier, aliases};
}
function addBatch(brand, models, opts={}){
  const base = opts.base || KING_NATION_SENSI_PRESETS;
  const gyroDefault = Boolean(opts.gyro);
  const tierDefault = opts.tier || 'mid';
  for(const m of models){
    const modelName = (typeof m === 'object' && m.name) ? m.name : m;
    const gyro = (typeof m === 'object' && 'gyro' in m) ? Boolean(m.gyro) : gyroDefault;
    const sensi = (typeof m === 'object' && m.sensi) ? m.sensi : base;
    const tier = (typeof m === 'object' && m.tier) ? m.tier : tierDefault;
    const aliases = (typeof m === 'object' && Array.isArray(m.aliases)) ? m.aliases : [];
    CATALOG.push({brand, model:modelName, aliases, tier, gyro, sensi});
  }
}

// Catalog
addBatch('Apple', [
  device('iPhone 9', 'mid'), device('iPhone SE (2nd Gen)', 'mid'),
  device('iPhone X', 'mid'), device('iPhone XR', 'mid'), device('iPhone XS', 'midHigh'), device('iPhone XS Max', 'midHigh'),
  device('iPhone 11', 'midHigh'), device('iPhone 11 Pro', 'high'), device('iPhone 11 Pro Max', 'high'),
  device('iPhone 12', 'high'), device('iPhone 12 Mini', 'high'), device('iPhone 12 Pro', 'high'), device('iPhone 12 Pro Max', 'high'),
  device('iPhone 13', 'high'), device('iPhone 13 Mini', 'high'), device('iPhone 13 Pro', 'flagship'), device('iPhone 13 Pro Max', 'flagship'),
  device('iPhone 14', 'high'), device('iPhone 14 Plus', 'high'), device('iPhone 14 Pro', 'flagship'), device('iPhone 14 Pro Max', 'flagship'),
  device('iPhone 15', 'high'), device('iPhone 15 Plus', 'high'), device('iPhone 15 Pro', 'flagship'), device('iPhone 15 Pro Max', 'flagship'),
  device('iPhone 16', 'high'), device('iPhone 16 Pro', 'flagship'), device('iPhone 16 Pro Max', 'flagship'),
  device('iPad 9th Gen', 'mid'), device('iPad 10th Gen', 'mid'), device('iPad Air 5', 'high'), device('iPad Air M2', 'high'),
  device('iPad Mini 6', 'high'), device('iPad Pro 11"', 'flagship'), device('iPad Pro 12.9"', 'flagship'),
  device('iPad Pro M4 11"', 'flagship', ['iPad Pro 11 M4']), device('iPad Pro M4 13"', 'flagship', ['iPad Pro 13 M4'])
], {gyro:true});

// Samsung Galaxy A56 keeps a tuned profile, refreshed from the King Nation headshot baseline.
addBatch('Samsung', [
  device('Galaxy A03', 'entry'), device('Galaxy A05', 'entry'), device('Galaxy A05s', 'low'), device('Galaxy A06', 'entry'),
  device('Galaxy A14', 'low'), device('Galaxy A15', 'low'), device('Galaxy A16', 'low'),
  device('Galaxy A24', 'mid'), device('Galaxy A25', 'mid'), device('Galaxy A34', 'mid'), device('Galaxy A35', 'mid'),
  device('Galaxy A54', 'midHigh'), device('Galaxy A55', 'midHigh'),
  {
    name:'Galaxy A56',
    aliases:['A56'],
    tier:'midHigh',
    gyro:true,
    sensi:buildSensiPreset({default:{general:2, red:2, x2:1}})
  },
  device('Galaxy M14', 'low'), device('Galaxy M15', 'low'), device('Galaxy M34', 'mid'), device('Galaxy M35', 'mid'),
  device('Galaxy S20 FE', 'high'), device('Galaxy S21 FE', 'high'),
  device('Galaxy S22', 'flagship'), device('Galaxy S22+', 'flagship'), device('Galaxy S22 Ultra', 'flagship'),
  device('Galaxy S23', 'flagship'), device('Galaxy S23+', 'flagship'), device('Galaxy S23 FE', 'high'), device('Galaxy S23 Ultra', 'flagship'),
  device('Galaxy S24', 'flagship'), device('Galaxy S24+', 'flagship'), device('Galaxy S24 FE', 'high'), device('Galaxy S24 Ultra', 'flagship'),
  device('Galaxy S25', 'flagship'), device('Galaxy S25 Plus', 'flagship', ['Galaxy S25+']), device('Galaxy S25 Ultra', 'flagship')
], {gyro:true});

addBatch('Xiaomi', [
  device('12', 'flagship', ['Xiaomi 12']),
  device('12T', 'high', ['Xiaomi 12T']),
  device('13', 'flagship', ['Xiaomi 13']),
  device('13T', 'high', ['Xiaomi 13T']),
  device('13T Pro', 'flagship', ['Xiaomi 13T Pro']),
  device('14', 'flagship', ['Xiaomi 14']),
  device('14T', 'high', ['Xiaomi 14T']),
  device('14T Pro', 'flagship', ['Xiaomi 14T Pro']),
  device('15', 'flagship', ['Xiaomi 15']),
  device('15 Ultra', 'flagship', ['Xiaomi 15 Ultra'])
], {gyro:true});

addBatch('Redmi', [
  device('9A', 'entry', ['Xiaomi Redmi 9A']), device('10C', 'entry', ['Xiaomi Redmi 10C']),
  device('12', 'low', ['Xiaomi Redmi 12']), device('13', 'low', ['Xiaomi Redmi 13']), device('13C', 'entry', ['Xiaomi Redmi 13C']),
  device('14C', 'entry', ['Xiaomi Redmi 14C']), device('A3', 'entry', ['Xiaomi Redmi A3']), device('A5', 'entry', ['Xiaomi Redmi A5']),
  device('Note 8', 'low', ['Xiaomi Redmi Note 8']), device('Note 8 Pro', 'low', ['Xiaomi Redmi Note 8 Pro']),
  device('Note 8T (2019)', 'low', ['Xiaomi Redmi Note 8T 2019']), device('Note 8T (2021)', 'low', ['Xiaomi Redmi Note 8T 2021']),
  device('Note 9', 'low', ['Xiaomi Redmi Note 9']), device('Note 10', 'low', ['Xiaomi Redmi Note 10']),
  device('Note 11', 'mid', ['Xiaomi Redmi Note 11']), device('Note 12', 'mid', ['Xiaomi Redmi Note 12']),
  device('Note 12 Pro', 'midHigh', ['Xiaomi Redmi Note 12 Pro']),
  device('Note 13', 'mid', ['Xiaomi Redmi Note 13']), device('Note 13 Pro', 'midHigh', ['Xiaomi Redmi Note 13 Pro']),
  device('Note 13 Pro+', 'midHigh', ['Xiaomi Redmi Note 13 Pro Plus', 'Redmi Note 13 Pro Plus']),
  device('Note 14', 'mid', ['Xiaomi Redmi Note 14']), device('Note 14 Pro', 'midHigh', ['Xiaomi Redmi Note 14 Pro']),
  device('Note 14 Pro+', 'midHigh', ['Xiaomi Redmi Note 14 Pro Plus', 'Redmi Note 14 Pro Plus']),
  device('Note 15', 'mid', ['Xiaomi Redmi Note 15']), device('Note 15 Pro', 'midHigh', ['Xiaomi Redmi Note 15 Pro']),
  device('Note 15 Pro+', 'midHigh', ['Xiaomi Redmi Note 15 Pro Plus', 'Redmi Note 15 Pro Plus'])
]);

addBatch('POCO', [
  device('C65', 'entry', ['Xiaomi POCO C65']), device('C75', 'entry', ['Xiaomi POCO C75']),
  device('M4 Pro', 'mid', ['Xiaomi POCO M4 Pro']), device('M5', 'low', ['Xiaomi POCO M5']),
  device('M6', 'mid', ['Xiaomi POCO M6']), device('M6 Pro', 'mid', ['Xiaomi POCO M6 Pro']), device('M7 Pro', 'mid', ['Xiaomi POCO M7 Pro']),
  device('X3 Pro', 'midHigh', ['Xiaomi POCO X3 Pro']), device('X5', 'mid', ['Xiaomi POCO X5']), device('X5 Pro', 'midHigh', ['Xiaomi POCO X5 Pro']),
  device('X6', 'midHigh', ['Xiaomi POCO X6']), device('X6 Pro', 'high', ['Xiaomi POCO X6 Pro']),
  device('X7', 'midHigh', ['Xiaomi POCO X7']), device('X7 Pro', 'high', ['Xiaomi POCO X7 Pro']),
  device('F4', 'high', ['Xiaomi POCO F4']), device('F5', 'high', ['Xiaomi POCO F5']), device('F5 Pro', 'flagship', ['Xiaomi POCO F5 Pro']),
  device('F6', 'high', ['Xiaomi POCO F6']), device('F6 Pro', 'flagship', ['Xiaomi POCO F6 Pro']),
  device('F7', 'high', ['Xiaomi POCO F7']), device('F7 Pro', 'flagship', ['Xiaomi POCO F7 Pro'])
]);

addBatch('Motorola', [
  device('Moto E13', 'entry'), device('Moto E22', 'entry'), device('Moto G13', 'low'), device('Moto G14', 'low'),
  device('Moto G24', 'low'), device('Moto G32', 'low'), device('Moto G34', 'mid'), device('Moto G35', 'mid'),
  device('Moto G54', 'mid'), device('Moto G55', 'mid'), device('Moto G73', 'mid'), device('Moto G84', 'midHigh'), device('Moto G85', 'midHigh'),
  device('Moto Edge 30', 'high', ['Edge 30']), device('Moto Edge 40', 'high', ['Edge 40']), device('Moto Edge 40 Neo', 'midHigh', ['Edge 40 Neo']),
  device('Moto Edge 50', 'high', ['Edge 50']), device('Moto Edge 50 Fusion', 'midHigh', ['Edge 50 Fusion']),
  device('Moto Edge 50 Pro', 'high', ['Edge 50 Pro']), device('Moto Edge 50 Ultra', 'flagship', ['Edge 50 Ultra']),
  device('Moto Edge 60', 'high', ['Edge 60']), device('Moto Edge 60 Fusion', 'midHigh', ['Edge 60 Fusion']), device('Moto Edge 60 Pro', 'high', ['Edge 60 Pro'])
]);

addBatch('HONOR', [
  device('X5 Plus', 'entry', ['Honor X5 Plus']), device('X6', 'entry', ['Honor X6']),
  device('X6a', 'low', ['Honor X6a']), device('X6b', 'low', ['Honor X6b']),
  device('X6c', 'low', ['Honor X6c', 'X6C', 'MediaTek Helio G81 Ultra', '6 GB RAM', 'HONOR RAM Turbo']),
  device('X7', 'low', ['Honor X7']), device('X7a', 'low', ['Honor X7a']), device('X7b', 'mid', ['Honor X7b']),
  device('X8', 'mid', ['Honor X8']), device('X8a', 'mid', ['Honor X8a']), device('X8b', 'mid', ['Honor X8b']),
  device('X9a', 'midHigh', ['Honor X9a']), device('X9b', 'midHigh', ['Honor X9b']), device('X9c', 'midHigh', ['Honor X9c']),
  device('90', 'high', ['Honor 90']), device('90 Lite', 'mid', ['Honor 90 Lite']),
  device('200', 'high', ['Honor 200']), device('200 Lite', 'mid', ['Honor 200 Lite']), device('200 Pro', 'flagship', ['Honor 200 Pro']),
  device('Magic6 Lite', 'midHigh', ['Honor Magic6 Lite', 'Magic 6 Lite']),
  device('Magic7 Lite', 'midHigh', ['Honor Magic7 Lite', 'Magic 7 Lite', 'BRP-NX3', 'VMD', 'Snapdragon 6 Gen 1', '8 GB RAM', 'HONOR RAM Turbo']),
  device('Magic6 Pro', 'flagship', ['Honor Magic6 Pro', 'Magic 6 Pro']),
  device('Magic7 Pro', 'flagship', ['Honor Magic7 Pro', 'Magic 7 Pro'])
], {gyro:true});

addBatch('Infinix', [
  device('Smart 8', 'entry'), device('Smart 9', 'entry'),
  device('Hot 11', 'entry'), device('Hot 12', 'entry'), device('Hot 30', 'low'), device('Hot 40', 'mid'), device('Hot 40 Pro', 'mid'),
  device('Hot 50', 'mid'), device('Hot 50 Pro', 'midHigh'),
  device('Note 12', 'low'), device('Note 30', 'mid'), device('Note 30 Pro', 'midHigh'),
  device('Note 40', 'mid'), device('Note 40 Pro', 'midHigh'), device('Note 40 Pro+', 'midHigh', ['Note 40 Pro Plus']),
  device('GT 10 Pro', 'high'), device('GT 20 Pro', 'high')
]);

addBatch('Tecno', [
  device('Spark 10', 'low'), device('Spark 10 Pro', 'mid'), device('Spark 20', 'low'),
  device('Spark 20 Pro', 'mid'), device('Spark 20 Pro+', 'mid', ['Spark 20 Pro Plus']),
  device('Spark 30', 'low'), device('Spark 30 Pro', 'mid'),
  device('Camon 20', 'mid'), device('Camon 20 Pro', 'midHigh'), device('Camon 30', 'mid'), device('Camon 30 Pro', 'midHigh'),
  device('Pova 5', 'mid'), device('Pova 5 Pro', 'midHigh'), device('Pova 6', 'mid'), device('Pova 6 Pro', 'midHigh')
]);

addBatch('realme', [
  device('C25', 'entry'), device('C53', 'low'), device('C55', 'low'), device('C65', 'low'), device('C67', 'mid'), device('C75', 'mid'),
  device('9i', 'low'), device('10', 'mid'), device('10 Pro+', 'midHigh', ['10 Pro Plus']),
  device('11', 'mid'), device('11 Pro', 'midHigh'), device('11 Pro+', 'midHigh', ['11 Pro Plus']),
  device('12', 'mid'), device('12 Pro', 'midHigh'), device('12 Pro+', 'high', ['12 Pro Plus']),
  device('13', 'mid'), device('13 Pro', 'midHigh'),
  device('GT Neo 5', 'high'), device('GT Neo 6', 'high'), device('GT 6', 'high')
]);

addBatch('OPPO', [
  device('A16', 'entry'), device('A17', 'entry'), device('A18', 'entry'), device('A38', 'low'),
  device('A57', 'low'), device('A58', 'low'), device('A60', 'low'), device('A78', 'mid'), device('A79', 'mid'),
  device('Reno 7', 'mid'), device('Reno 8', 'midHigh'), device('Reno 10', 'midHigh'), device('Reno 11', 'midHigh'),
  device('Reno 12', 'midHigh'), device('Reno 13', 'high'),
  device('Find X5', 'flagship'), device('Find X6', 'flagship'), device('Find X7', 'flagship'), device('Find X8', 'flagship')
]);

addBatch('vivo', [
  device('Y17s', 'entry'), device('Y18', 'entry'), device('Y20', 'entry'), device('Y21', 'entry'),
  device('Y27', 'low'), device('Y28', 'low'), device('Y36', 'mid'), device('Y56', 'mid'), device('Y100', 'midHigh'),
  device('V21', 'mid'), device('V25', 'midHigh'), device('V27', 'midHigh'), device('V29', 'midHigh'),
  device('V30', 'high'), device('V30 Pro', 'high'), device('V30e', 'midHigh'), device('V40', 'high'),
  device('X80', 'flagship'), device('X90', 'flagship'), device('X100', 'flagship'), device('X200', 'flagship')
]);

addBatch('Huawei', ['P30 Lite','P40 Lite','nova 9','Y9s','Y9a'], {gyro:true, tier:'mid'});
addBatch('OnePlus', ['7T','8','9','Nord','Nord 2','11R'], {gyro:true, tier:'high'});
addBatch('Google', ['Pixel 4a','Pixel 5a','Pixel 6a','Pixel 7','Pixel 7a'], {gyro:true, tier:'high'});
addBatch('Nokia', ['G10','G20','X10'], {tier:'low'});
addBatch('ZTE', ['Blade A31','Blade A51'], {tier:'entry'});
addBatch('Alcatel', ['1','1S','3'], {tier:'entry'});
addBatch('BLU', ['G9 Pro','Studio X10'], {tier:'entry'});
addBatch('Sony', ['Xperia 10 III','Xperia 5 IV'], {gyro:true, tier:'high'});
addBatch('LG', ['K51S','K61'], {tier:'low'});

// Device specs (refresh/touch/instant)
const DEVICE_SPECS = new Map([
  [["Samsung","Galaxy A35"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy A54"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy A55"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy S24"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy S24+"].toString(),       {refresh:120, touch:240}],
  [["Samsung","Galaxy S24 Ultra"].toString(),  {refresh:120, touch:240}],
  [["Samsung","Galaxy S25"].toString(),        {refresh:120, touch:240}],
  [["Samsung","Galaxy S25 Plus"].toString(),   {refresh:120, touch:240}],
  [["Samsung","Galaxy S25 Ultra"].toString(),  {refresh:120, touch:240}],
  [["Samsung","Galaxy A56"].toString(),        {refresh:120, touch:240}],
  [["Motorola","Moto G54"].toString(),         {refresh:120, touch:240}],
  [["Motorola","Moto G84"].toString(),         {refresh:120, touch:240}],
  [["Motorola","Moto G85"].toString(),         {refresh:120, touch:240}],
  [["Motorola","Moto Edge 50 Pro"].toString(), {refresh:144, touch:360}],
  [["Infinix","Hot 40"].toString(),            {refresh:90,  touch:240}],
  [["Infinix","Hot 40 Pro"].toString(),        {refresh:120, touch:240}],
  [["Infinix","GT 20 Pro"].toString(),         {refresh:144, touch:360}],
  [["Tecno","Spark 20 Pro"].toString(),        {refresh:120, touch:240}],
  [["Tecno","Camon 30 Pro"].toString(),        {refresh:144, touch:360}],
  [["Tecno","Pova 6 Pro"].toString(),          {refresh:120, touch:240}],
  [["Redmi","13C"].toString(),                 {refresh:90,  touch:180}],
  [["Redmi","14C"].toString(),                 {refresh:120, touch:240}],
  [["Redmi","Note 8"].toString(),              {refresh:60,  touch:120}],
  [["Redmi","Note 8 Pro"].toString(),          {refresh:60,  touch:120}],
  [["Redmi","Note 8T (2019)"].toString(),      {refresh:60,  touch:120}],
  [["Redmi","Note 8T (2021)"].toString(),      {refresh:60,  touch:120}],
  [["Redmi","Note 13"].toString(),             {refresh:120, touch:240}],
  [["Redmi","Note 13 Pro"].toString(),         {refresh:120, touch:240}],
  [["Redmi","Note 13 Pro+"].toString(),        {refresh:120, touch:240, instant:2160}],
  [["Redmi","Note 14"].toString(),             {refresh:120, touch:240}],
  [["Redmi","Note 14 Pro"].toString(),         {refresh:120, touch:240}],
  [["Redmi","Note 14 Pro+"].toString(),        {refresh:120, touch:240, instant:2160}],
  [["POCO","X6"].toString(),                   {refresh:120, touch:240}],
  [["POCO","X6 Pro"].toString(),               {refresh:120, touch:480, instant:2160}],
  [["POCO","X7"].toString(),                   {refresh:120, touch:240}],
  [["POCO","X7 Pro"].toString(),               {refresh:120, touch:480, instant:2160}],
  [["POCO","F6"].toString(),                   {refresh:120, touch:480, instant:2160}],
  [["POCO","F6 Pro"].toString(),               {refresh:120, touch:480, instant:2160}],
  [["HONOR","X6c"].toString(),                 {refresh:60,  touch:120}],
  [["HONOR","X9b"].toString(),                 {refresh:120, touch:240}],
  [["HONOR","X9c"].toString(),                 {refresh:120, touch:240}],
  [["HONOR","Magic7 Lite"].toString(),         {refresh:120, touch:240}],
  [["HONOR","Magic6 Pro"].toString(),          {refresh:120, touch:240}],
  [["HONOR","Magic7 Pro"].toString(),          {refresh:120, touch:240}],
  [["Xiaomi","13T Pro"].toString(),            {refresh:144, touch:480, instant:2160}],
  [["Xiaomi","14"].toString(),                 {refresh:120, touch:240}],
  [["Xiaomi","14T Pro"].toString(),            {refresh:144, touch:480, instant:2160}],
  [["Xiaomi","15 Ultra"].toString(),           {refresh:120, touch:240}],
  [["Apple","iPhone 11 Pro"].toString(),       {refresh:60,  touch:120}],
  [["Apple","iPhone 12 Pro Max"].toString(),   {refresh:60,  touch:240}],
  [["Apple","iPhone 13 Pro"].toString(),       {refresh:120, touch:240}],
  [["Apple","iPhone 14 Pro"].toString(),       {refresh:120, touch:240}],
  [["Apple","iPhone 15 Pro Max"].toString(),   {refresh:120, touch:240}],
  [["Apple","iPhone 16 Pro Max"].toString(),   {refresh:120, touch:240}],
  [["Apple","iPad 9th Gen"].toString(),        {refresh:60,  touch:120}],
  [["Apple","iPad 10th Gen"].toString(),       {refresh:60,  touch:120}],
  [["Apple","iPad Air 5"].toString(),          {refresh:60,  touch:120}],
  [["Apple","iPad Air M2"].toString(),         {refresh:60,  touch:120}],
  [["Apple","iPad Mini 6"].toString(),         {refresh:60,  touch:120}],
  [["Apple","iPad Pro 11\""].toString(),       {refresh:120, touch:240}],
  [["Apple","iPad Pro 12.9\""].toString(),     {refresh:120, touch:240}],
  [["Apple","iPad Pro M4 11\""].toString(),    {refresh:120, touch:240}],
  [["Apple","iPad Pro M4 13\""].toString(),    {refresh:120, touch:240}],
]);

const SUGGESTED_DPI_BY_BRAND = {
  'Samsung': {low:620, mid:740, high:840},
  'Xiaomi': {low:570, mid:720, high:840},
  'Redmi': {low:570, mid:720, high:840},
  'POCO': {low:580, mid:740, high:860},
  'Motorola': {low:540, mid:700, high:800},
  'Infinix': {low:520, mid:670, high:780},
  'Tecno': {low:520, mid:670, high:780},
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
  'HONOR': {low:580, mid:720, high:820},
  'Honor': {low:580, mid:720, high:820},
  'Apple': {low:0, mid:0, high:0}
};
