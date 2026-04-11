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
const IcoWA = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" style={{color:"#25D366"}} aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.77 13.5L3 21l4.65-1.2A9 9 0 1 0 12 3Z"/><path d="M8.5 9.5c.2 2.3 3 4.8 5.2 5 .5.1 1.4-.3 1.7-.8l.6-1.1c.2-.4 0-.8-.4-1.1l-1-.5c-.3-.1-.7 0-.9.3l-.3.4c-.2.2-.6.3-.9.1-1-.5-2-1.4-2.5-2.4-.2-.3 0-.4.1-.5l.4-.3c.3-.2.4-.6.3-.9l-.5-1c-.3-.4-.7-.6-1.1-.4l-1.1.6c-.5.3-.9 1.2-.8 1.7Z"/></svg>);
const IcoX  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20"/></svg>);
const IcoShare = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" style={{color:"#008080"}} aria-hidden="true"><path d="M14 9l7-7m0 0h-5m5 0v5"/><path d="M21 13v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h5"/></svg>);
const IcoLink  = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" style={{color:"#FFD700"}} aria-hidden="true"><path d="M10 14a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13"/><path d="M14 10a5 5 0 0 1 0 7L12.5 18.5a5 5 0 0 1-7-7L7 11"/></svg>);

function App(){
  const GLYPH_FONT = "Noto Sans, 'Segoe UI Symbol', 'Apple SD Gothic Neo', system-ui, sans-serif";
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
                  <button onClick={()=>share("whatsapp", styled)} className="icon-btn" aria-label="WhatsApp"><IcoWA/></button>
                  <button onClick={()=>share("x", styled)} className="icon-btn" aria-label="X / Twitter"><IcoX/></button>
                  <button onClick={()=>share("native", styled)} className="icon-btn" aria-label="Compartir nativo"><IcoShare/></button>
                  <button onClick={copyLinkWithSettings} className="icon-btn" aria-label="Copiar enlace con ajustes"><IcoLink/></button>
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
