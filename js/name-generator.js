const INV_SPACE = "\u3164"; // ㅤ
const SEP = "そ";
const INITIALS_V2 = true; // current default output format
// Initials v2 suffixes (pre-styled to match your format)
const KING_SUFFIX_STYLED = `${SEP}Ӄɪɴɢ`;
const QUEEN_SUFFIX_STYLED = `${SEP}Qᴜᴇᴇɴ`;

const SMALL_CAPS_MAP = {
  a:"ɑ", b:"ʙ", c:"ᴄ", d:"ᴅ", e:"ᴇ", f:"ꜰ", g:"ɢ", h:"ʜ", i:"ɪ", j:"ᴊ",
  k:"ᴋ", l:"ʟ", m:"ᴍ", n:"ɴ", o:"o", p:"ᴘ", q:"ǫ", r:"ʀ", s:"s", t:"ᴛ",
  u:"ᴜ", v:"ᴠ", w:"ᴡ", x:"x", y:"ʏ", z:"ᴢ",
  A:"A", B:"ʙ", C:"ᴄ", D:"ᴅ", E:"ᴇ", F:"ꜰ", G:"ɢ", H:"ʜ", I:"ɪ", J:"ᴊ",
  K:"K", L:"ʟ", M:"ᴍ", N:"ɴ", O:"o", P:"ᴘ", Q:"Q", R:"ʀ", S:"S", T:"ᴛ",
  U:"ᴜ", V:"ᴠ", W:"ᴡ", X:"x", Y:"ʏ", Z:"ᴢ"
};

function toSmallCaps(src){
  const parts = src.split(new RegExp(`(${INV_SPACE}|\\s+)`, 'g'));
  return parts.map(seg => {
    if (seg === INV_SPACE || /^\s+$/.test(seg)) return seg;
    if (!seg) return seg;
    const firstRaw = seg[0];
    const first = /[A-Za-z]/.test(firstRaw) ? firstRaw.toUpperCase() : firstRaw;
    const rest  = [...seg.slice(1)].map(ch => SMALL_CAPS_MAP[ch] ?? ch).join("");
    return first + rest;
  }).join("");
}

const normalizeName = (raw) => raw.replace(/\s+/g," ").trim();
const applyStyle = (name, smallCaps) => !name ? "" : (smallCaps ? toSmallCaps(name) : name);

// =========================
// Initials v1 (legacy: "KingㅤSoldado" style) — kept for reference
// =========================
function buildInitialsV1({ base, gender, insertInvisibleSpace }){
  let name = normalizeName(base); if (!name) return "";
  let prefix = gender === "queen" ? "Queen" : (gender === 'king' ? 'King' : '');
  const lower = name.toLowerCase();
  if (prefix && !lower.startsWith("king ") && !lower.startsWith("queen ")) name = `${prefix} ${name}`;
  if (insertInvisibleSpace) name = name.replace(/\s+/g, INV_SPACE);
  return name;
}
const makeAsciiV1 = (name) =>
  name ? name.split(INV_SPACE).map(p => p ? (p[0].toUpperCase() + p.slice(1).toLowerCase()) : p).join(INV_SPACE) : "";

// =========================
// Initials v2 (current): "SoʟᴅɑᴅoそӃɪɴɢ" style
// =========================
function buildBaseV2({ base, insertInvisibleSpace }){
  let name = normalizeName(base); if (!name) return "";
  if (insertInvisibleSpace) name = name.replace(/\s+/g, INV_SPACE);
  return name;
}
function buildSuffixV2Styled(gender){
  if (gender === "queen") return QUEEN_SUFFIX_STYLED;
  if (gender === "king")  return KING_SUFFIX_STYLED;
  return "";
}
function buildInitialsV2Styled({ base, gender, insertInvisibleSpace, smallCaps }){
  const basePart = buildBaseV2({ base, insertInvisibleSpace });
  if (!basePart) return "";
  const styledBase = applyStyle(basePart, smallCaps);
  return styledBase + buildSuffixV2Styled(gender);
}
function buildInitialsV2Ascii({ base, gender }){
  const clean = normalizeName(base);
  if (!clean) return "";
  const joined = clean.split(/\s+/g).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
  if (gender === "queen") return joined + "Queen";
  if (gender === "king")  return joined + "King";
  return joined;
}
const IcoWA = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{color:"#25D366"}} aria-hidden="true">
    <path d="M12 3.25a8.75 8.75 0 0 0-7.57 13.16L3.4 20.6l4.33-1.1A8.75 8.75 0 1 0 12 3.25Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.07 8.4c-.23.05-.47.2-.62.53-.18.39-.47 1.15-.47 1.26 0 .12.02.24.1.41.08.17.76 1.54 1.85 2.57 1.31 1.24 2.55 1.63 2.87 1.74.32.11.51.09.7-.07.2-.17.79-.92.99-1.23.2-.31.42-.26.71-.15.29.11 1.84.87 2.16 1.03.32.15.53.22.61.34.08.12.08.69-.16 1.35-.24.65-1.39 1.28-1.92 1.35-.5.07-1.13.1-1.82-.12-.42-.13-.97-.32-1.68-.63-2.96-1.29-4.88-4.3-5.03-4.5-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.26-.28.58-.35.77-.35h.55c.18 0 .43.04.65.56l.74 1.78c.06.15.1.32.03.49-.08.17-.12.28-.24.43-.11.15-.24.33-.34.44-.11.12-.22.25-.1.49.12.24.53.88 1.15 1.42.79.69 1.45.9 1.66 1 .2.09.31.08.42-.05.12-.13.49-.57.62-.76.13-.19.27-.16.45-.1.19.06 1.2.57 1.4.67.2.1.34.15.39.23" fill="currentColor"/>
  </svg>
);
const IcoX  = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{color:"#111827"}} aria-hidden="true">
    <path d="M5.48 4.75h3.33l3.64 5.07 4.29-5.07h1.78l-5.27 6.22 6.21 8.28h-3.33l-4.04-5.51-4.66 5.51H5.66l5.66-6.67-5.84-7.83Zm3 1.56H7.96l7.57 11.38h.52L8.48 6.31Z"/>
  </svg>
);
const IcoShare = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{color:"#0f766e"}} aria-hidden="true">
    <path d="M14 5h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14 19 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M19 13v3a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoLink  = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{color:"#ca8a04"}} aria-hidden="true">
    <path d="M10.2 13.8 8.4 15.6a3.1 3.1 0 1 1-4.38-4.38l3-3a3.1 3.1 0 0 1 4.38 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m13.8 10.2 1.8-1.8a3.1 3.1 0 0 1 4.38 4.38l-3 3a3.1 3.1 0 0 1-4.38 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m9 15 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

function App(){
  const GLYPH_FONT = "Noto Sans, 'Segoe UI Symbol', 'Apple SD Gothic Neo', system-ui, sans-serif";
  const tooltipTimersRef = React.useRef(new Map());
  const [baseName,setBaseName]   = React.useState("Soldado");
  const [gender,setGender]       = React.useState("king");
  const [insertInv,setInsertInv] = React.useState(true);
  const [smallCaps,setSmallCaps] = React.useState(true);
  const [addKNSuffix,setAddKNSuffix] = React.useState(false);
  const styledCore = React.useMemo(() => {
    // Initials v2 is the new default (SoʟᴅɑᴅoそӃɪɴɢ). Initials v1 is preserved above.
    if (INITIALS_V2) return buildInitialsV2Styled({ base: baseName, gender, insertInvisibleSpace: insertInv, smallCaps });
    const v1 = buildInitialsV1({ base: baseName, gender, insertInvisibleSpace: insertInv });
    return applyStyle(v1, smallCaps);
  }, [baseName, gender, insertInv, smallCaps]);
  const styled = React.useMemo(() => (addKNSuffix ? `${styledCore}${insertInv?INV_SPACE:""}ᴷᴺ` : styledCore), [styledCore, addKNSuffix, insertInv]);
  const asciiOut = React.useMemo(() => {
    if (INITIALS_V2) return buildInitialsV2Ascii({ base: baseName, gender });
    const v1 = buildInitialsV1({ base: baseName, gender, insertInvisibleSpace: insertInv });
    return makeAsciiV1(v1);
  }, [baseName, gender, insertInv]);
  const share = (platform, text) => {
    const plain = String(text||"").replace(/<[^>]+>/g,"");
    const encoded = encodeURIComponent(plain);
    if(platform==="whatsapp"){
      const wa = /Android|iPhone|iPad/i.test(navigator.userAgent) ? "https://wa.me/?text=" : "https://api.whatsapp.com/send?text=";
      window.open(wa+encoded, "_blank");
    }else if(platform==="x"){
      window.open("https://twitter.com/intent/tweet?text="+encoded, "_blank");
    }else if(platform==="native"){
      if(navigator.share) navigator.share({ text: plain }).catch(()=>{}); else alert("Compartir nativo no soportado");
    }
  };
  const copyLinkWithSettings = () => {
    const url = new URL(window.location.href); const qp = url.searchParams;
    qp.set("name", baseName || ""); qp.set("gender", gender);
    qp.set("inv", insertInv?"1":"0"); qp.set("sc", smallCaps?"1":"0"); qp.set("kn", addKNSuffix?"1":"0");
    url.search = qp.toString();
    navigator.clipboard.writeText(url.toString()).then(()=>alert("Enlace con ajustes copiado."));
  };
  React.useEffect(() => () => {
    tooltipTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    tooltipTimersRef.current.clear();
  }, []);
  const showTooltipBriefly = (event) => {
    const button = event.currentTarget;
    button.classList.add("is-tooltip-visible");
    const existingTimer = tooltipTimersRef.current.get(button);
    if (existingTimer) window.clearTimeout(existingTimer);
    const timerId = window.setTimeout(() => {
      button.classList.remove("is-tooltip-visible");
      tooltipTimersRef.current.delete(button);
    }, 1400);
    tooltipTimersRef.current.set(button, timerId);
  };
  return (
    <div className="namegen-scope">
      <div className="namegen-wrap">
        <section className="kn-card namegen-shell">
          <header className="kn-section-head">
            <div className="kn-section-brand">
              <img src="./assets/king-nation-logo.png" alt="" className="kn-logo kn-section-badge" aria-hidden="true" />
              <div>
                <h1 className="kn-section-title">Generador de Nombres</h1>
                <p className="kn-section-subtitle">Crea un nombre estilizado para Free Fire, compártelo rápido y copia tanto la versión decorada como la versión ASCII.</p>
              </div>
            </div>
          </header>

          <section className="kn-panel" aria-label="Controles del generador">
            <div className="namegen-controls-grid">
              <div>
                <label className="kn-field-label">Nombre base</label>
                <input className="kn-input" placeholder="Ej.: Soldado" value={baseName} onChange={(e)=>setBaseName(e.target.value)} />
              </div>
              <div>
                <label className="kn-field-label">Prefijo</label>
                <select value={gender} onChange={(e)=>setGender(e.target.value)} className="kn-select">
                  <option value="king">King</option>
                  <option value="queen">Queen</option>
                  <option value="none">Sin prefijo</option>
                </select>
              </div>
              <button className="kn-btn kn-btn-secondary" onClick={()=>{setBaseName("Soldado"); setGender("king"); setInsertInv(true); setSmallCaps(true); setAddKNSuffix(false);}}>
                Restablecer
              </button>
            </div>
          </section>

          <section className="kn-panel" style={{marginTop:'14px'}}>
            <div className="namegen-results-grid">
              <div>
                <h2 className="kn-helper-title">Vista previa</h2>
                <p className="kn-helper-text" style={{fontFamily: GLYPH_FONT}}>Ejemplo base: <strong>{buildInitialsV2Styled({ base: "Soldado", gender: "king", insertInvisibleSpace: true, smallCaps: true })}</strong></p>
                <div className={`namegen-preview-value ${styled ? '' : 'namegen-preview-fallback'}`} style={{fontFamily:GLYPH_FONT, marginTop:'14px'}}>{styled || "SoʟᴅɑᴅoそӃɪɴɢ"}</div>
              </div>
              <div>
                <h2 className="kn-helper-title">Acciones</h2>
                <p className="kn-helper-text">Comparte el nombre actual o genera un enlace con tus ajustes activos sin salir de la página.</p>
                <div className="namegen-social">
                  <button onClick={(event)=>{showTooltipBriefly(event); share("whatsapp", styled);}} className="icon-btn" aria-label="Compartir por WhatsApp" data-tooltip="Compartir por WhatsApp"><IcoWA/></button>
                  <button onClick={(event)=>{showTooltipBriefly(event); share("x", styled);}} className="icon-btn" aria-label="Compartir por X" data-tooltip="Compartir por X"><IcoX/></button>
                  <button onClick={(event)=>{showTooltipBriefly(event); share("native", styled);}} className="icon-btn" aria-label="Compartir" data-tooltip="Compartir"><IcoShare/></button>
                  <button onClick={(event)=>{showTooltipBriefly(event); copyLinkWithSettings();}} className="icon-btn" aria-label="Copiar enlace" data-tooltip="Copiar enlace"><IcoLink/></button>
                </div>
              </div>
            </div>
          </section>

          <div className="namegen-output-grid">
            <section className="kn-panel namegen-output-card">
              <h3 className="kn-helper-title">Estilizado</h3>
              <button onClick={()=>navigator.clipboard.writeText(styled).then(()=>alert('¡Copiado!'))} className="kn-btn-icon namegen-copy-btn" aria-label="Copiar estilizado">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="9" y="9" width="10" height="12" rx="2"/><path d="M5 15V7a2 2 0 0 1 2-2h8"/></svg>
              </button>
              <textarea className="kn-textarea namegen-textarea" style={{fontFamily:GLYPH_FONT}} readOnly value={styled}></textarea>
            </section>

            <section className="kn-panel namegen-output-card">
              <h3 className="kn-helper-title">ASCII</h3>
              <button onClick={()=>navigator.clipboard.writeText(asciiOut).then(()=>alert('¡Copiado!'))} className="kn-btn-icon namegen-copy-btn" aria-label="Copiar ASCII">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><rect x="9" y="9" width="10" height="12" rx="2"/><path d="M5 15V7a2 2 0 0 1 2-2h8"/></svg>
              </button>
              <textarea className="kn-textarea namegen-textarea" readOnly value={asciiOut}></textarea>
            </section>
          </div>

          <section className="kn-panel" style={{marginTop:'14px'}}>
            <h3 className="kn-helper-title">Consejos rápidos</h3>
            <ul className="namegen-helper-list kn-helper-text">
              <li><strong>Nombres cortos:</strong> suelen verse mejor en partida y conservan mejor el estilo decorado.</li>
              <li><strong>Versión ASCII:</strong> úsala si algún símbolo no se muestra bien en tu dispositivo o al compartir.</li>
              <li><strong>Enlace con ajustes:</strong> te permite guardar la combinación actual y volver a abrirla rápido.</li>
              <li><strong>Prefijo:</strong> cambia entre King, Queen o sin prefijo sin tocar el resto del formato.</li>
            </ul>
            <p className="kn-helper-text namegen-helper-note">Hecho para el Clan King Nation y alineado con el mismo estilo pastel del buscador de sensi.</p>
          </section>

          <footer className="namegen-footer">
            <div className="namegen-footer-brand">
              <img src="./assets/king-nation-logo.png" alt="King Nation Logo" />
              <strong>King Nation</strong>
            </div>
            <span>Hecho para el Clan King Nation</span>
          </footer>
        </section>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
