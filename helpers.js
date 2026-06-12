'use strict';
// ═══════════════════════════════════════════════════════════════
// helpers.js — KIT FORMASUBITO PREPOSTO v3 (allineato esempi cliente)
// Stile: Gill Sans MT, palette blu kitformasubito, layout ricco con
// banda hero, tabelle bicolori, header/footer differenziati per tipo.
// Modificare SOLO i blocchi CLIENTE e CORSO.
// ═══════════════════════════════════════════════════════════════

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, SectionType, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, SimpleField, LineRuleType, PageNumber,
  HeightRule,
} = require('docx');
const fs   = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════
// PALETTE COLORI (allineata agli esempi cliente)
// ═══════════════════════════════════════════════════════════════
const C = {
  BLU_DARK   : '1F3864',  // hero, titoli principali
  BLU_HEADER : '1F4E79',  // titoli sezione, header tabelle
  BLU_MED    : '2E75B6',  // titoli verbale (più chiaro)
  BLU_LIGHT  : 'D5E8F0',  // fill cella header tabella
  BLU_ALT    : 'EBF3FB',  // fill cella alternato
  GRIGIO_ALT : 'F2F2F2',  // fill cella body alternato
  GRIGIO     : '595959',  // testo metadati / footer
  GRIGIO_BD  : 'AAAAAA',  // bordo tabella standard
  GRIGIO_BDL : 'CCCCCC',  // bordo tabella light
  BIANCO     : 'FFFFFF',
  ROSSO      : 'C00000',  // evidenza (titoli moduli, livello)
  GIALLO_HL  : 'FFFF99',  // shading risposta corretta nel test docente
};

const FONT = 'Gill Sans MT';

// ═══════════════════════════════════════════════════════════════
// DATI CLIENTE — da personalizzare
// ═══════════════════════════════════════════════════════════════
const CLIENTE = {
  ragioneSociale:      'Nome completo S.r.l.',
  ragioneSocialeBreve: 'NomeBreve',
  indirizzo:           'Via Esempio 1, 20100 Milano (MI)',
  indirizzoUL:         '',                 // OPZIONALE: U.L. (es: 'U.L.: Via X, 12345 Y (Z)'). Lasciare '' se assente
  piva:                '00000000000',
  cf:                  '',                 // OPZIONALE: Codice Fiscale se diverso da P.IVA. Lasciare '' per usare la P.IVA
  atecoCodice:         '00.00.00',
  atecoDesc:           'Descrizione attività',
  datoreLavoro:        'Nome Cognome',
  anno:                '2026',
};

// ═══════════════════════════════════════════════════════════════
// DATI CORSO — da personalizzare
// ═══════════════════════════════════════════════════════════════
const CORSO = {
  tipoCorso:   'BASE',   // 'BASE' (12h) | 'AGGIORNAMENTO' (6h)
  oreCorso:    12,       // 12 per BASE, 6 per AGGIORNAMENTO
};

// ═══════════════════════════════════════════════════════════════
// NOTA REGIONALE — opzionale (popolata dallo STEP 0.5)
// ═══════════════════════════════════════════════════════════════
// Se l'utente al passo 0.5.d sceglie "Solo nota informativa nel documento finale",
// impostare enabled=true, regione e testoNota. La nota viene iniettata nel Progetto
// Formativo in coda alla sezione "3. RIFERIMENTO NORMATIVO", con titolo
// "Disposizioni regionali (<regione>)". Se enabled=false, nessuna nota viene inserita.
const REGIONALE = {
  enabled:   false,
  regione:   '',     // es. 'Lombardia' / 'Emilia-Romagna'
  testoNota: '',     // testo completo della nota (inizia tipicamente con "Nota: ...")
};

// ═══════════════════════════════════════════════════════════════
// LOGO — solo logo cliente
// ═══════════════════════════════════════════════════════════════
const LOGO_PATH = path.join(__dirname, 'logo.png');
const LOGO_TYPE = 'jpg';  // 'png' o 'jpg' (il file può avere ext .png anche se è jpg)

let logoBytes = null;
try { logoBytes = fs.readFileSync(LOGO_PATH); } catch { logoBytes = null; }

// ═══════════════════════════════════════════════════════════════
// DEFAULT STYLES — body 10pt = size 20 in half-points (docx)
// ═══════════════════════════════════════════════════════════════
const docStyles = {
  default: { document: { run: { font: FONT, size: 20 } } }
};

// ═══════════════════════════════════════════════════════════════
// COSTANTI DOCUMENTO
// ═══════════════════════════════════════════════════════════════
const A4_P       = { width: 11906, height: 16838 };
// Per landscape, docx.js scambia automaticamente width/height dato orientation=landscape.
// Quindi passiamo i valori "portrait" e settiamo orientation: il render scambia da solo.
const A4_L       = { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE };
const MARGIN_STD = { top: 2100, right: 1134, bottom: 1134, left: 1134, header: 567, footer: 567 };
const MARGIN_REG = { top: 1134, right: 1134, bottom: 1134, left: 1134, header: 709, footer: 709 };
const MARGIN_ATT = { top: 1800, right: 1134, bottom: 1134, left: 1134, header: 567, footer: 567 };
const W          = 9638;       // larghezza utile in twips (A4 portrait)
const W_LAND     = 14570;      // larghezza utile in twips (A4 landscape)

const OUT_DIR_BASE = path.join(__dirname, 'OUT');
const KIT_NAME     = `KIT PREPOSTO - ${CLIENTE.ragioneSocialeBreve}`;
const KIT_DIR      = path.join(OUT_DIR_BASE, KIT_NAME);
const OUT          = KIT_DIR;

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// ═══════════════════════════════════════════════════════════════
// HELPER LIVELLO DATI
// ═══════════════════════════════════════════════════════════════
function indirizzoCompleto() {
  return CLIENTE.indirizzoUL && CLIENTE.indirizzoUL.trim()
    ? `${CLIENTE.indirizzo} | ${CLIENTE.indirizzoUL}`
    : CLIENTE.indirizzo;
}
function codiceFiscaleEffettivo() {
  return CLIENTE.cf && CLIENTE.cf.trim() ? CLIENTE.cf : CLIENTE.piva;
}

// ═══════════════════════════════════════════════════════════════
// HEADER STANDARD (logo + 3 righe ragione sociale/titolo/ATECO)
// Usato per: Progetto Formativo, Lettera Nomina, Test, Verbale, Questionario, Registro
// ═══════════════════════════════════════════════════════════════
function makeHeader(titoloDoc, opts = {}) {
  const NO_B = {
    top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},
    left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE},
  };
  const wTotal = opts.landscape ? W_LAND : W;
  const wLogo  = opts.landscape ? 2400 : 2977;
  const wRight = wTotal - wLogo;

  const logoCell = new TableCell({
    width: { size: wLogo, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    borders: NO_B,
    children: [new Paragraph({
      alignment: AlignmentType.LEFT,
      children: logoBytes
        ? [new ImageRun({ data: logoBytes, type: LOGO_TYPE, transformation: { width: 80, height: 80 } })]
        : [new TextRun({ text: '' })],
    })],
  });

  const tbl = new Table({
    width: { size: wTotal, type: WidthType.DXA },
    columnWidths: [wLogo, wRight],
    borders: {
      top: NO_B.top, bottom: NO_B.bottom, left: NO_B.left, right: NO_B.right,
      insideHorizontal: NO_B.top, insideVertical: NO_B.left,
    },
    rows: [
      new TableRow({
        children: [
          logoCell,
          new TableCell({
            width: { size: wRight, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            borders: NO_B,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: CLIENTE.ragioneSociale, bold: true, color: C.BLU_HEADER, font: FONT, size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: titoloDoc, bold: true, color: C.BLU_HEADER, font: FONT, size: 22 })],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: `ATECO: ${CLIENTE.atecoCodice} – ${CLIENTE.atecoDesc}`, color: C.BLU_HEADER, font: FONT, size: 18 })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  return new Header({ children: [tbl] });
}

// HEADER SOLO LOGO (per Attestato, Verifica Efficacia)
function makeHeaderSoloLogo() {
  return new Header({ children: [new Paragraph({
    alignment: AlignmentType.LEFT,
    children: logoBytes
      ? [new ImageRun({ data: logoBytes, type: LOGO_TYPE, transformation: { width: 80, height: 80 } })]
      : [new TextRun({ text: '' })],
  })]});
}

// ═══════════════════════════════════════════════════════════════
// FOOTER STANDARD (titolo doc \tab Pag. X a Y)
// ═══════════════════════════════════════════════════════════════
function makeFooter(docTitle = '', opts = {}) {
  const wTotal = opts.landscape ? W_LAND : W;
  return new Footer({
    children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: wTotal }],
      children: [
        new TextRun({ text: docTitle, size: 18, font: FONT, color: C.GRIGIO }),
        new TextRun({ text: '\tPag. ', size: 18, font: FONT }),
        new SimpleField('PAGE'),
        new TextRun({ text: ' a ', size: 18, font: FONT }),
        new SimpleField('NUMPAGES'),
      ],
    })],
  });
}

// FOOTER COMPATTO (bordo top, ragione sociale + indirizzo + opzionale Pag. X)
function makeFooterCompatto(opts = {}) {
  const includePag = opts.includePag !== false;
  const runs = [
    new TextRun({
      text: `${CLIENTE.ragioneSociale} – ${indirizzoCompleto()}`,
      size: 16, font: FONT, color: C.GRIGIO,
    }),
  ];
  if (includePag) {
    runs.push(
      new TextRun({ text: '   |   Pag. ', size: 16, font: FONT, color: C.GRIGIO }),
      new SimpleField('PAGE'),
    );
  }
  return new Footer({
    children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, space: 1, color: C.GRIGIO } },
      children: runs,
    })],
  });
}

// ═══════════════════════════════════════════════════════════════
// TITOLI
// ═══════════════════════════════════════════════════════════════
function titoloSezione(testo, opts = {}) {
  const sz = opts.sz || 26;  // default 13pt
  const col = opts.col || C.BLU_HEADER;
  const border = opts.border ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: col } } : undefined;
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    pageBreakBefore: opts.pageBreakBefore || false,
    border,
    children: [new TextRun({ text: testo, bold: true, color: col, font: FONT, size: sz })],
  });
}
function titoloSezioneVerbale(testo) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: testo, bold: true, color: C.BLU_MED, font: FONT, size: 22 })],
  });
}
function titoloConBordo(testo, opts = {}) {
  const sz = opts.sz || 26;
  const col = opts.col || C.BLU_HEADER;
  return new Paragraph({
    spacing: { before: 280, after: 120 },
    alignment: opts.alignment || AlignmentType.LEFT,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: col } },
    children: [new TextRun({ text: testo, bold: true, color: col, font: FONT, size: sz })],
  });
}

// titolo() legacy: livello 1 = 16pt, 2 = 13pt, 3 = 12pt
function titolo(testo, livello = 1, opts = {}) {
  const sz = livello === 1 ? 32 : livello === 2 ? 26 : 24;
  return titoloSezione(testo, { ...opts, sz });
}

// ═══════════════════════════════════════════════════════════════
// CORPO TESTO — 10pt giustificato
// ═══════════════════════════════════════════════════════════════
function corpo(testo, opts = {}) {
  return new Paragraph({
    alignment: opts.alignment || (opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED),
    spacing: opts.spacing || { before: opts.before || 30, after: opts.after || 30 },
    children: [new TextRun({
      text: testo, font: FONT, size: opts.sz || 20,
      bold: opts.bold || false, color: opts.color || undefined,
      italics: opts.italics || false,
    })],
  });
}
const para = corpo;

function rigaDati(etichetta, valore, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 30, after: 30 },
    children: [
      new TextRun({ text: etichetta + ': ', bold: true, font: FONT, size: opts.sz || 20 }),
      new TextRun({ text: valore, font: FONT, size: opts.sz || 20 }),
    ],
  });
}

function vuoto(sp = 60) {
  return new Paragraph({ spacing: { after: sp }, children: [new TextRun({ text: '' })] });
}

// ═══════════════════════════════════════════════════════════════
// CELLE
// ═══════════════════════════════════════════════════════════════
function cella(content, opts = {}) {
  const children = typeof content === 'string'
    ? [new Paragraph({
        alignment: opts.align === 'center' ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: content, font: FONT, size: opts.sz || 20, bold: opts.bold || false, color: opts.color || undefined })],
      })]
    : content;
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    verticalAlign: opts.vAlign || VerticalAlign.TOP,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: opts.margins || { top: 80, bottom: 80, left: 120, right: 120 },
    columnSpan: opts.span,
    borders: opts.borders || undefined,
    children,
  });
}

function celHeaderBlu(testo, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill || C.BLU_HEADER },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    columnSpan: opts.span,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.CENTER,
      children: [new TextRun({ text: testo, font: FONT, size: opts.sz || 18, bold: true, color: C.BIANCO })],
    })],
  });
}

function celEtichetta(testo, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill || C.BLU_LIGHT },
    verticalAlign: opts.vAlign || VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: testo, font: FONT, size: opts.sz || 20, bold: true, color: C.BLU_HEADER })],
    })],
  });
}

function celValore(testo, opts = {}) {
  const children = Array.isArray(testo) ? testo : [new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: opts.spacing || { before: 30, after: 30 },
    children: [new TextRun({
      text: testo, font: FONT, size: opts.sz || 20,
      bold: opts.bold || false, color: opts.color || '000000',
      italics: opts.italics || false,
    })],
  })];
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill } : undefined,
    verticalAlign: opts.vAlign || VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children,
  });
}

// ═══════════════════════════════════════════════════════════════
// BANDA HERO (banda blu scura con testo bianco)
// ═══════════════════════════════════════════════════════════════
function bandaHero(linee) {
  const paragrafi = linee.map(l => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: l.spA != null ? l.spA : 20 },
    children: [new TextRun({
      text: l.testo, font: FONT,
      size: l.sz || 20, bold: l.bold !== false,
      color: l.col || C.BIANCO,
    })],
  }));
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [W],
    borders: bordoLight(),
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.BLU_DARK },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: paragrafi,
      })],
    })],
  });
}

// BANDA SINGOLA (utile in questionario per "LEGENDA" e "OSSERVAZIONI E SUGGERIMENTI")
function bandaTitolo(testo, opts = {}) {
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [W],
    borders: bordoLight(),
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill || C.BLU_DARK },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: testo, font: FONT, size: opts.sz || 20, bold: true, color: C.BIANCO })],
        })],
      })],
    })],
  });
}

// ═══════════════════════════════════════════════════════════════
// BORDI
// ═══════════════════════════════════════════════════════════════
const BORDI_STD = {
  top:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
  bottom:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
  left:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
  right:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
  insideHorizontal:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
  insideVertical:{style:BorderStyle.SINGLE,size:4,color:C.GRIGIO_BD},
};
function bordoLight() {
  return {
    top:{style:BorderStyle.SINGLE,size:1,color:C.GRIGIO_BDL},
    bottom:{style:BorderStyle.SINGLE,size:1,color:C.GRIGIO_BDL},
    left:{style:BorderStyle.SINGLE,size:1,color:C.GRIGIO_BDL},
    right:{style:BorderStyle.SINGLE,size:1,color:C.GRIGIO_BDL},
    insideHorizontal:{style:BorderStyle.SINGLE,size:4,color:'auto'},
    insideVertical:{style:BorderStyle.SINGLE,size:4,color:'auto'},
  };
}
function noBorders() {
  return {
    top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
  };
}
function bordiNormali() { return BORDI_STD; }

// ═══════════════════════════════════════════════════════════════
// SALVA DOC
// ═══════════════════════════════════════════════════════════════
async function salvaDoc(doc, ...args) {
  let filepath;
  if (args.length === 2) {
    const [sottocartella, nomefile] = args;
    const dir = path.join(KIT_DIR, sottocartella);
    ensureDir(dir);
    filepath = path.join(dir, nomefile);
  } else {
    filepath = args[0];
    ensureDir(path.dirname(filepath));
  }
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(filepath, buf);
  console.log(`✅ ${path.relative(KIT_DIR, filepath)}`);
  return filepath;
}

// ═══════════════════════════════════════════════════════════════
// FACTORY DOCUMENTI
// ═══════════════════════════════════════════════════════════════
function creaDocStandard(children, titoloDoc = 'KIT FORMASUBITO PREPOSTO') {
  return new Document({
    styles: docStyles,
    sections: [{
      properties: { page: { size: A4_P, margin: MARGIN_STD } },
      headers: { default: makeHeader(titoloDoc) },
      footers: { default: makeFooter(titoloDoc) },
      children: [vuoto(120), ...children],
    }],
  });
}

function creaDocLandscape(children, titoloDoc) {
  return new Document({
    styles: docStyles,
    sections: [{
      properties: { page: { size: A4_L, margin: MARGIN_REG } },
      headers: { default: makeHeader(titoloDoc, { landscape: true }) },
      footers: { default: makeFooterCompatto({ includePag: true }) },
      children,
    }],
  });
}

function creaDocAttestato(children) {
  return new Document({
    styles: docStyles,
    sections: [{
      properties: { page: { size: A4_P, margin: MARGIN_ATT } },
      headers: { default: makeHeaderSoloLogo() },
      footers: { default: makeFooterCompatto({ includePag: false }) },
      children,
    }],
  });
}

function creaDocVerificaEfficacia(children) {
  return new Document({
    styles: docStyles,
    sections: [{
      properties: { page: { size: A4_P, margin: MARGIN_REG } },
      headers: { default: makeHeaderSoloLogo() },
      footers: { default: makeFooterCompatto({ includePag: false }) },
      children,
    }],
  });
}

function creaDocQuestionario(children, titoloDoc = 'Questionario di Gradimento Preposto') {
  return new Document({
    styles: docStyles,
    sections: [{
      properties: {
        page: { size: A4_P, margin: { top: 1700, right: 1134, bottom: 1134, left: 1134, header: 708, footer: 708 } },
      },
      headers: { default: makeHeader(titoloDoc) },
      footers: { default: makeFooterCompatto({ includePag: true }) },
      children,
    }],
  });
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════
module.exports = {
  CLIENTE, CORSO, REGIONALE,
  C, FONT,
  COLORE_OVERALL: C.BLU_HEADER, COLORE_NERO: '000000',
  COLORE_GRIGIO: C.GRIGIO, COLORE_GRIGIO_CHIARO: C.GRIGIO_ALT,
  A4_P, A4_L, MARGIN_STD, MARGIN_REG, MARGIN_ATT, W, W_LAND,
  docStyles, logoBytes, LOGO_TYPE, BORDI_STD,
  OUT_DIR_BASE, KIT_NAME, KIT_DIR, OUT,
  ensureDir, indirizzoCompleto, codiceFiscaleEffettivo,
  makeHeader, makeFooter, makeHeaderSoloLogo, makeFooterCompatto,
  titoloSezione, titoloSezioneVerbale, titoloConBordo,
  corpo, para, rigaDati, vuoto, cella, celHeaderBlu, celEtichetta, celValore,
  bandaHero, bandaTitolo,
  salvaDoc, creaDocStandard, creaDocLandscape, creaDocAttestato,
  creaDocVerificaEfficacia, creaDocQuestionario,
  noBorders, bordiNormali, bordoLight, titolo,
  creaHeader2Colonne: makeHeader, creaFooter: makeFooter,
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, PageNumber, Table, TableRow, TableCell, WidthType,
  BorderStyle, ImageRun, PageOrientation,
  VerticalAlign, ShadingType, SimpleField, TabStopType, TabStopPosition,
  HeightRule,
};
