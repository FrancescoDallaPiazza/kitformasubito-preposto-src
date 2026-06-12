// ═══════════════════════════════════════════════════════════════
// docs1.js — Documenti KIT PREPOSTO v3 (allineato esempi)
// 1. Progetto Formativo (layout ricco con banda hero + tabelle bicolori)
// 2. Lettera di Nomina (bordi inferiori sezioni, tabella firme finale)
// 3. Registro Presenze (landscape, 7 colonne, 15 righe vuote)
// ═══════════════════════════════════════════════════════════════

const {
  CLIENTE, CORSO, REGIONALE, C, FONT,
  Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, VerticalAlign, ShadingType, ImageRun, HeightRule, SimpleField,
  W, W_LAND,
  bordiNormali, bordoLight, noBorders,
  para, corpo, vuoto, salvaDoc,
  creaDocStandard, creaDocLandscape,
  titoloSezione, titoloConBordo,
  cella, celHeaderBlu, celEtichetta, celValore, bandaHero,
  indirizzoCompleto, codiceFiscaleEffettivo,
  logoBytes, LOGO_TYPE,
} = require('./helpers');

// ═══════════════════════════════════════════════════════════════
// CONTENUTI NORMATIVI DEI 4 MODULI (ASR 17/04/2025 – Parte II, §2.2)
// ═══════════════════════════════════════════════════════════════
const MODULI_PREPOSTO = [
  {
    titolo: 'MODULO 1 – GIURIDICO NORMATIVO',
    ore: 3,
    contenuti: [
      'Individuazione del preposto (art. 2 c.1 lett. e) D.Lgs. 81/08, come modificato dalla L. 215/2021)',
      'Preposto di fatto ed effettività del ruolo (Cass. Pen. orientamento consolidato)',
      'Compiti e obblighi del preposto (art. 19 D.Lgs. 81/08)',
      'Relazioni tra i vari soggetti interni ed esterni del sistema di prevenzione aziendale',
    ],
  },
  {
    titolo: 'MODULO 2 – GESTIONE E ORGANIZZAZIONE DELLA SICUREZZA',
    ore: 3,
    contenuti: [
      'Modalità di esercizio della funzione di controllo dell\'osservanza da parte dei lavoratori (art. 19 D.Lgs. 81/08)',
      'Modalità di comunicazione e relazione con i soggetti della prevenzione aziendale (DL, RSPP/ASPP, MC, RLS)',
    ],
  },
  {
    titolo: 'MODULO 3 – VALUTAZIONE DELLE SITUAZIONI DI RISCHIO E CONTROLLO DELLA CORRETTA ESECUZIONE',
    ore: 4,
    contenuti: [
      'Misure tecniche, organizzative e procedurali di prevenzione e protezione adottate a seguito della valutazione dei rischi dell\'azienda, con riferimento al contesto in cui il preposto opera',
      'Obblighi connessi ai contratti di appalto, d\'opera e di somministrazione (art. 26 D.Lgs. 81/08)',
      'Gestione del rischio interferenziale e il DUVRI',
      'Modalità per sovrintendere e vigilare sulle attività lavorative per garantire l\'attuazione delle direttive ricevute',
      'L\'importanza di individuare e segnalare incidenti, infortuni mancati (near miss)',
    ],
  },
  {
    titolo: 'MODULO 4 – COMUNICAZIONE E INFORMAZIONE',
    ore: 2,
    contenuti: [
      'Tecniche e strumenti di comunicazione e sensibilizzazione dei lavoratori',
      'Focus sul coinvolgimento di neoassunti, lavoratori somministrati e stranieri',
      'Gestione del dialogo in caso di comportamenti non conformi alle procedure',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// 1. PROGETTO FORMATIVO — layout ricco con banda hero
// ═══════════════════════════════════════════════════════════════
async function genProgettoFormativo() {
  const isBase = CORSO.tipoCorso === 'BASE';
  const oreTotali = isBase ? 12 : 6;
  const livelloRischio = isBase
    ? 'Corso di formazione per PREPOSTO  (12 ore)'
    : 'Aggiornamento PREPOSTO  (6 ore)';

  const children = [
    // ──── HERO: ragione sociale + indirizzo + P.IVA + CF ────
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: CLIENTE.ragioneSociale, font: FONT, size: 36, bold: true, color: C.BLU_DARK })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [new TextRun({ text: indirizzoCompleto(), font: FONT, size: 20, color: C.GRIGIO })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [new TextRun({ text: `P.IVA: ${CLIENTE.piva}`, font: FONT, size: 20, color: C.GRIGIO })],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [new TextRun({ text: `Codice Fiscale: ${codiceFiscaleEffettivo()}`, font: FONT, size: 20, color: C.GRIGIO })],
    }),
    vuoto(40),

    // ──── BANDA TITOLO BLU ────
    bandaHero([
      { testo: 'PROGETTO FORMATIVO AZIENDALE', sz: 26, bold: true, col: C.BIANCO },
      { testo: isBase ? 'Formazione aggiuntiva per i PREPOSTI' : 'Aggiornamento per i PREPOSTI',
        sz: 20, bold: false, col: C.BIANCO },
      { testo: 'D.Lgs. 81/2008 e s.m.i. – Accordo Stato-Regioni 17/04/2025',
        sz: 20, bold: false, col: C.BLU_LIGHT },
    ]),
    vuoto(40),

    // ──── TABELLA SINTESI 2x2 ────
    new Table({
      width: { size: W, type: WidthType.DXA },
      columnWidths: [4819, 4819],
      borders: bordoLight(),
      rows: [
        new TableRow({ children: [
          celValoreLabel(['Datore di Lavoro / RSPP:', CLIENTE.datoreLavoro], { width: 4819, fill: C.BLU_LIGHT }),
          celValoreLabel(['Codice ATECO:', `${CLIENTE.atecoCodice} – ${CLIENTE.atecoDesc}`], { width: 4819, fill: C.BLU_LIGHT }),
        ]}),
        new TableRow({ children: [
          celValoreLabel(['Livello di rischio:', livelloRischio], { width: 4819, fill: C.BIANCO, valoreCol: C.ROSSO, valoreBold: true }),
          celValoreLabel(['Anno:', CLIENTE.anno], { width: 4819, fill: C.BIANCO }),
        ]}),
      ],
    }),

    // ──── PREMESSA ────
    para("Redatto ai sensi dell'art. 37 c. 7 e c. 7-ter del D.Lgs. 81/08 e dell'Accordo Stato-Regioni del 17 aprile 2025, Parte II, punto 2.2."),

    // ── 1. FINALITÀ E OBIETTIVI (a pagina nuova come da modello) ──
    titoloSezione('1. FINALITÀ E OBIETTIVI', { pageBreakBefore: true }),
    para("Il corso ha l'obiettivo di far acquisire al preposto le competenze necessarie a svolgere le funzioni attribuite dall'art. 19 del D.Lgs. 81/08, in coerenza con l'Accordo Stato-Regioni 17/04/2025. In particolare, al termine del corso il preposto dovrà essere in grado di:"),
    para('• Conoscere il ruolo e gli obblighi posti in capo al preposto e il rapporto con le altre figure della prevenzione aziendale.'),
    para('• Individuare i rischi per la salute e sicurezza dei lavoratori connessi al contesto operativo e le relative misure di prevenzione e protezione.'),
    para("• Esercitare le funzioni di controllo: sovraintendenza, vigilanza, interruzione dell'attività, informazione e segnalazione."),
    para('• Utilizzare strumenti efficaci di comunicazione e cooperazione con datore di lavoro, dirigenti, SPP e lavoratori.'),

    // ── 2. PREREQUISITI ──
    titoloSezione('2. PREREQUISITI'),
    para('Al corso per preposti si accede solo dopo aver frequentato la formazione (generale e specifica) per lavoratori (ASR 17/04/2025, Parte II, §2.2).'),

    // ── 3. RIFERIMENTO NORMATIVO ──
    titoloSezione('3. RIFERIMENTO NORMATIVO'),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: "Accordo Stato-Regioni del 17 aprile 2025 – Parte II, Punto 2 e Parte IV, Punto 1",
        font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    vuoto(20),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({ text: "Parte II dell'Accordo – Punto 2", font: FONT, size: 20, underline: { type: 'single' }, color: '000000' }),
        new TextRun({ text: ': ', font: FONT, size: 20, color: '000000' }),
        new TextRun({ text: "i datori di lavoro possono organizzare direttamente i corsi di formazione ex art. 37, comma 2, del D.Lgs. n. 81/2008 nei confronti dei propri lavoratori, preposti e dirigenti, a condizione che venga rispettato quanto previsto dal presente Accordo.",
          font: FONT, size: 20, italics: true, color: '000000' }),
      ],
    }),
    vuoto(20),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({
        text: "Il datore di lavoro in possesso dei requisiti per lo svolgimento diretto dei compiti del servizio di prevenzione e protezione di cui all'articolo 34 del D.Lgs. n. 81/2008, può svolgere anche in qualità di docente, esclusivamente nei riguardi dei propri lavoratori, preposti e dirigenti, le attività di formazione previste dall'articolo 37 del medesimo decreto.",
        font: FONT, size: 20, italics: true, color: '000000' })],
    }),
    vuoto(20),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({ text: "Parte IV dell'Accordo", font: FONT, size: 20, underline: { type: 'single' }, color: '000000' }),
        new TextRun({ text: ' – ', font: FONT, size: 20, color: '000000' }),
        new TextRun({ text: "Punto 1: le indicazioni metodologiche per l'organizzazione e la gestione dei corsi, fatta eccezione dei punti 3.2, 3.3, 3.4, 3.5, 6.3 e 7, non si applicano ai Datori di Lavoro che organizzano ed erogano autonomamente, all'interno delle proprie aziende, i corsi.",
          font: FONT, size: 20, italics: true, color: '000000' }),
      ],
    }),

    // ──── NOTA REGIONALE (opzionale, in coda alla sez. 3 — popolata dallo STEP 0.5 della skill) ────
    ...(REGIONALE && REGIONALE.enabled && REGIONALE.testoNota && REGIONALE.testoNota.trim() ? [
      vuoto(20),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: `Disposizioni regionali (${REGIONALE.regione || ''})`,
          font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
      }),
      vuoto(20),
      new Paragraph({ alignment: AlignmentType.JUSTIFIED,
        children: [new TextRun({ text: REGIONALE.testoNota, font: FONT, size: 20, color: '000000' })],
      }),
    ] : []),

    // ── 4. DATI IDENTIFICATIVI DELL'AZIENDA ──
    titoloSezione("4. DATI IDENTIFICATIVI DELL'AZIENDA"),
    tabellaDatiAzienda(),

    // ── 5. DATI IDENTIFICATIVI DEL CORSO (a pagina nuova come da modello) ──
    titoloSezione('5. DATI IDENTIFICATIVI DEL CORSO', { pageBreakBefore: true }),
    tabellaDatiCorso(isBase, oreTotali),

    // ── 6. STRUTTURA DEL CORSO ──
    titoloSezione('6. STRUTTURA DEL CORSO'),
    ...moduliFormativi(isBase),

    // ── 6.1 AGGIORNAMENTO ──
    titoloSezione('6.1 AGGIORNAMENTO'),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: 'Durata: 6 ore ogni 2 anni (Accordo Stato-Regioni 17/04/2025, Parte III).',
        font: FONT, size: 20, bold: true, color: C.ROSSO })],
    }),
    vuoto(10),
    para('Modalità: colloquio individuale o test scritto a risposta multipla.'),
    vuoto(10),
    para('Contenuti:'),
    para('• aggiornamento sui rischi specifici', { spacing: { before: 4, after: 4 } }),
    para('• nuove normative', { spacing: { before: 4, after: 4 } }),
    para('• cambiamenti organizzativi/produttivi.', { spacing: { before: 4, after: 4 } }),

    // ── 7. VERIFICA DI EFFICACIA ──
    // (no page break esplicito: §6.1 è breve, §7 attacca subito dopo;
    //  se la pagina è piena §7 va naturalmente a capo come nel modello)
    titoloSezione('7. VERIFICA DI EFFICACIA'),
    para("A distanza di tempo dalla conclusione della formazione, durante lo svolgimento dell'attività lavorativa, è prevista una verifica dell'efficacia per accertare conoscenze, abilità, competenze acquisite e la corretta applicazione delle procedure."),

    // ── 8. SOGGETTI FORMATORI E DOCENTI ──
    titoloSezione('8. SOGGETTI FORMATORI E DOCENTI'),
    vuoto(10),
    tabellaSoggettoFormatore(),
    vuoto(20),
    tabellaSoggettoDocente(),
  ];

  const doc = creaDocStandard(children, 'Progetto Formativo Preposto');
  return salvaDoc(doc, '00 - PROGETTO FORMATIVO', 'ProgettoFormativo_Preposto.docx');
}

// Helper: cella con riga "etichetta:" + riga "valore"
function celValoreLabel(testi, opts = {}) {
  const [label, valore] = testi;
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: opts.fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({ children: [new TextRun({ text: label, font: FONT, size: 20, bold: true, color: C.BLU_HEADER })] }),
      new Paragraph({ children: [new TextRun({
        text: valore, font: FONT, size: 20,
        bold: opts.valoreBold || false,
        color: opts.valoreCol || '000000',
      })] }),
    ],
  });
}

function tabellaDatiAzienda() {
  const wL = 3000, wR = W - wL;
  const rows = [
    ['Soggetto formatore', CLIENTE.ragioneSociale],
    ['Codice ATECO', `${CLIENTE.atecoCodice} — ${CLIENTE.atecoDesc}`],
    ['P.IVA / C.F.', codiceFiscaleEffettivo() === CLIENTE.piva ? CLIENTE.piva : `P.IVA ${CLIENTE.piva} – C.F. ${CLIENTE.cf}`],
    ['Sede', indirizzoCompleto()],
    ['Datore di Lavoro / RSPP', CLIENTE.datoreLavoro],
  ].map(([k, v], i) => {
    const altFill = i % 2 === 0 ? C.BLU_LIGHT : C.BLU_ALT;
    const valFill = i % 2 === 0 ? C.BIANCO : C.GRIGIO_ALT;
    return new TableRow({ children: [
      celEtichetta(k, { width: wL, fill: altFill }),
      celValore(v, { width: wR, fill: valFill }),
    ]});
  });
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordoLight(),
    rows,
  });
}

function tabellaDatiCorso(isBase, oreTotali) {
  const wL = 3000, wR = W - wL;
  const rows = [
    ['Ore formazione', isBase ? '12 ore, articolate in 4 moduli.' : '6 ore di aggiornamento.'],
    ['Modalità di erogazione', [
      'in presenza oppure in videoconferenza sincrona.',
      'NON è consentita la modalità e-learning asincrona per questa figura (art. 37 c. 7-ter D.Lgs. 81/08).',
    ]],
    ['Numero max partecipanti per sessione', '30'],
    ['Soglia di presenza minima', '90% delle ore previste'],
    ['Metodologia didattica', 'Lezione frontale interattiva, discussione guidata di casi aziendali, analisi di near miss e infortuni mancati, esercitazioni su procedure e comportamenti attesi'],
    ['Verifica finale', 'Test a risposta multipla – superamento con almeno 70% di risposte corrette (ASR 17/04/2025, Parte IV, §6.3).'],
  ].map(([k, v], i) => {
    const altFill = i % 2 === 0 ? C.BLU_LIGHT : C.BLU_ALT;
    const valFill = i % 2 === 0 ? C.BIANCO : C.GRIGIO_ALT;

    let cellaValore;
    if (Array.isArray(v)) {
      const paragrafi = v.map(t => new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 30, after: 30 },
        children: [new TextRun({ text: t, font: FONT, size: 20, color: '000000' })],
      }));
      cellaValore = celValore(paragrafi, { width: wR, fill: valFill });
    } else {
      cellaValore = celValore(v, { width: wR, fill: valFill });
    }
    return new TableRow({ children: [
      celEtichetta(k, { width: wL, fill: altFill }),
      cellaValore,
    ]});
  });
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordoLight(),
    rows,
  });
}

function moduliFormativi(isBase) {
  const result = [];
  vuoto(10);
  const moduli = MODULI_PREPOSTO; // i moduli base; per AGGIORNAMENTO lasciamo gli stessi titoli (struttura identica, contenuti aggiornati)
  moduli.forEach((m, idx) => {
    if (idx > 0) result.push(vuoto(10));
    // Titolo modulo in rosso C00000
    result.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({
        text: `${m.titolo} (${m.ore} ore)`, font: FONT, size: 20, bold: true, color: C.ROSSO,
      })],
    }));
    m.contenuti.forEach(c => result.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: `• ${c}`, font: FONT, size: 20 })],
    })));
  });
  return result;
}

function tabellaSoggettoFormatore() {
  const wL = 3000, wR = W - wL;
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [wL, wR],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        celEtichetta('Soggetto formatore', { width: wL }),
        celValore(`${CLIENTE.datoreLavoro} – Datore di Lavoro e RSPP`, { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Base normativa', { width: wL }),
        celValore('ASR 17/04/2025, Punto 2 – Parte II', { width: wR }),
      ]}),
    ],
  });
}

function tabellaSoggettoDocente() {
  const wL = 3000, wR = W - wL;
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [wL, wR],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        celEtichetta('Soggetto relatore / docente', { width: wL }),
        celValore(`${CLIENTE.datoreLavoro} – Datore di Lavoro e RSPP`, { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Base normativa docente', { width: wL }),
        celValore('ASR 17/04/2025, Punto 2 – Parte II (deroga per Datore di Lavoro RSPP)', { width: wR }),
      ]}),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════
// 2. LETTERA DI NOMINA
// ═══════════════════════════════════════════════════════════════
async function genLetteraNomina() {
  const children = [
    // ──── TITOLO PRINCIPALE CENTRATO con bordo bottom ────
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: 'LETTERA DI NOMINA A PREPOSTO', font: FONT, size: 32, bold: true, color: C.BLU_HEADER })],
    }),

    // ──── OGGETTO con bordo bottom ────
    new Paragraph({
      spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [
        new TextRun({ text: "OGGETTO: Comunicazione di individuazione quale Preposto ai sensi dell'", font: FONT, size: 22, bold: true, color: C.BLU_HEADER }),
        new TextRun({ text: 'Art. 2 c.1 lett. e) e art. 19 D.Lgs. 81/08 — L. 215/2021', font: FONT, size: 22, bold: true, color: C.BLU_HEADER }),
      ],
    }),
    vuoto(20),

    // ──── CORPO INTRODUTTIVO ────
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 30, after: 30, line: 360, lineRule: 'auto' },
      children: [
        new TextRun({ text: 'Il/La sottoscritto/a Sig. ', font: FONT, size: 20 }),
        new TextRun({ text: CLIENTE.datoreLavoro.toUpperCase(), font: FONT, size: 20, bold: true }),
        new TextRun({ text: ' in qualità di Datore di Lavoro della ditta ', font: FONT, size: 20 }),
        new TextRun({ text: CLIENTE.ragioneSociale, font: FONT, size: 20, bold: true }),
        new TextRun({ text: ', sita in ', font: FONT, size: 20 }),
        new TextRun({ text: CLIENTE.indirizzo, font: FONT, size: 20 }),
        new TextRun({ text: ', P. Iva e C.F. ', font: FONT, size: 20 }),
        new TextRun({ text: codiceFiscaleEffettivo() === CLIENTE.piva ? CLIENTE.piva : `${CLIENTE.piva} – ${CLIENTE.cf}`, font: FONT, size: 20 }),
        new TextRun({ text: ", ai sensi dell'art. 18 comma 1 lettera b-bis) del D.Lgs. 81/08 e s.m.i., Legge 215/2021 e previa consultazione ex art. 50. c. 1 lettera c) del medesimo decreto con il Rappresentante dei Lavoratori qualora fosse nominato",
          font: FONT, size: 20 }),
      ],
    }),

    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60 },
      children: [new TextRun({ text: 'INDIVIDUA E NOMINA', font: FONT, size: 20, bold: true })],
    }),

    // Linea con segnaposto nome preposto
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 60, line: 360, lineRule: 'auto' },
      children: [new TextRun({
        text: "________________________________________ in qualità di lavoratore della scrivente ditta a svolgere, unitamente alle mansioni svolte durante il normale orario di lavoro nell'ambito dell'attività produttiva, l'incarico di preposto, ai sensi dell'art. 19 del D.Lgs. 81/08.",
        font: FONT, size: 20,
      })],
    }),

    // ──── ATTRIBUZIONI E OBBLIGHI con bordo bottom ────
    new Paragraph({
      spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: 'ATTRIBUZIONI E OBBLIGHI', font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    paraLineato("In tale veste, Lei è tenuto/a ad adempiere agli obblighi previsti dall'art. 19 del D.Lgs. 81/08, tra cui in particolare:"),
    paraLineato("a) sovrintendere e vigilare sull'osservanza da parte dei lavoratori dei loro obblighi di legge e delle disposizioni aziendali in materia di salute e sicurezza, dell'uso dei mezzi di protezione collettivi e dei DPI; in caso di persistenza dell'inosservanza, interrompere l'attività del lavoratore e informare i superiori diretti;"),
    paraLineato('b) verificare che accedano alle zone a rischio grave solo i lavoratori che hanno ricevuto adeguate istruzioni;'),
    paraLineato("c) richiedere l'osservanza delle misure per il controllo delle situazioni di rischio in caso di emergenza;"),
    paraLineato('d) informare i lavoratori esposti a pericolo grave e immediato;'),
    paraLineato("e) astenersi dal richiedere la ripresa dell'attività in presenza di pericolo grave ed immediato;"),
    paraLineato('f) segnalare tempestivamente al Datore di Lavoro/Dirigente deficienze dei mezzi, attrezzature e DPI e ogni condizione di pericolo;'),
    paraLineato("f-bis) interrompere, se necessario, l'attività del lavoratore e informare tempestivamente il Datore di Lavoro;"),
    paraLineato("g) frequentare i corsi di formazione previsti dall'art. 37 (12 ore iniziali + aggiornamento biennale di 6 ore)."),

    // ──── POTERI CONFERITI con bordo bottom ────
    new Paragraph({
      spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: 'POTERI CONFERITI', font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    para("Per l'adempimento degli obblighi sopra elencati, Le sono conferiti i poteri gerarchici e funzionali adeguati alla natura dell'incarico, ivi compreso il potere di:"),
    para("• richiamare i lavoratori all'osservanza delle disposizioni di sicurezza;"),
    para("• interrompere l'attività in caso di persistenza dell'inosservanza o di pericolo grave;"),
    para('• segnalare al Datore di Lavoro criticità, near miss, infortuni mancati.'),

    // ──── FORMAZIONE con bordo bottom ────
    new Paragraph({
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: 'FORMAZIONE', font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    para("L'Azienda si impegna a garantire la Sua formazione ai sensi dell'art. 37 c.7 e 7-ter D.Lgs. 81/08 e dell'ASR 17/04/2025: corso base di 12 ore e aggiornamento biennale di 6 ore, in presenza o in videoconferenza sincrona."),
    vuoto(20),

    // ──── SANZIONI con bordo bottom ────
    new Paragraph({
      spacing: { after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: 'SANZIONI PER INADEMPIMENTO (art. 56 D.Lgs. 81/08)', font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    para("Il preposto è punito nei casi previsti dall'art. 56 con l'arresto fino a due mesi o con l'ammenda da 491,40 a 1.474,21 euro per la violazione dell'articolo 19, comma 1, lettere a), c), e), f); con l'arresto sino a un mese o l'ammenda da 245,70 a 737,11 euro per la violazione dell'art. 19, comma 1, lettere b), d), f-bis), g)."),
    para('Valori aggiornati dal D.L. 146/2021 e soggetti a rivalutazione periodica.', { color: C.GRIGIO }),
    vuoto(40),

    // ──── LUOGO E DATA ────
    para('Luogo e data, ______________________________'),
    vuoto(40),

    // ──── TABELLA FIRME 2x3 ────
    tabellaFirmeLetteraNomina(),
  ];

  const doc = creaDocStandard(children, 'Lettera di Nomina Preposto');
  return salvaDoc(doc, '01 - LETTERA DI NOMINA', 'LetteraNomina_Preposto.docx');
}

function paraLineato(testo) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 30, after: 30, line: 276, lineRule: 'auto' },
    children: [new TextRun({ text: testo, font: FONT, size: 20 })],
  });
}

function tabellaFirmeLetteraNomina() {
  const NOB = noBorders();
  const wMezzo = Math.floor(W / 2);
  const cellTxt = (txt, opts={}) => new TableCell({
    width: { size: wMezzo, type: WidthType.DXA },
    borders: NOB, margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.JUSTIFIED,
      spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: txt, font: FONT, size: 20, bold: opts.bold || false })],
    })],
  });
  return new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    columnWidths: [wMezzo, wMezzo],
    borders: NOB,
    rows: [
      new TableRow({ children: [ cellTxt('Il Datore di Lavoro'), cellTxt('Per accettazione, il Preposto') ]}),
      new TableRow({ children: [ cellTxt(CLIENTE.datoreLavoro, { bold: true }), cellTxt('________________________', { bold: true }) ]}),
      new TableRow({ children: [ cellTxt('___________________________'), cellTxt('_____________________________') ]}),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. REGISTRO PRESENZE — landscape, 7 colonne, 15 righe
// ═══════════════════════════════════════════════════════════════
async function genRegistroPresenze(tipo /* 'INIZIALE' | 'AGGIORNAMENTO' */) {
  const isIniziale = tipo === 'INIZIALE';
  const oreTotali = isIniziale ? 12 : 6;
  const titoloDoc = 'Registro Presenze Corso Preposto';

  // Tabella info corso (2 col, 2 righe)
  const wTotal = W_LAND;
  const wA = 6964, wB = wTotal - wA;

  const infoCorso = new Table({
    width: { size: wTotal, type: WidthType.DXA },
    columnWidths: [wA, wB],
    borders: bordiNormali(),
    rows: [
      new TableRow({ children: [
        new TableCell({
          width: { size: wA, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [
            new TextRun({ text: 'Corso: ', font: FONT, size: 20, bold: true }),
            new TextRun({ text: 'Formazione ', font: FONT, size: 20 }),
            new TextRun({ text: isIniziale ? 'aggiuntiva preposti base ' : 'aggiornamento preposti ', font: FONT, size: 20 }),
            new TextRun({ text: `(${oreTotali} ore)`, font: FONT, size: 20 }),
          ]})],
        }),
        new TableCell({ width: { size: wB, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [new TextRun({ text: '', font: FONT, size: 20 })] })],
        }),
      ]}),
      new TableRow({ children: [
        new TableCell({
          width: { size: wA, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [
            new TextRun({ text: 'Relatore / Docente: ', font: FONT, size: 20, bold: true }),
            new TextRun({ text: CLIENTE.datoreLavoro, font: FONT, size: 20 }),
          ]})],
        }),
        new TableCell({ width: { size: wB, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 20 })] })],
        }),
      ]}),
    ],
  });

  // Tabella firme (15 righe vuote + 1 header)
  const colWidths = [2025, 2004, 3196, 708, 3402, 709, 2526]; // somma = 14570
  const colTitles = ['COGNOME', 'NOME', 'FIRMA ENTRATA', 'ORA', 'FIRMA USCITA', 'ORA', 'DATA INTERVENTO'];
  const headerRow = new TableRow({
    tableHeader: true,
    children: colTitles.map((t, i) => celHeaderBlu(t, { width: colWidths[i], sz: 18 })),
  });
  const emptyRows = [];
  for (let i = 0; i < 15; i++) {
    emptyRows.push(new TableRow({
      children: colWidths.map(w => new TableCell({
        width: { size: w, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 60, right: 60 },
        children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
      })),
    }));
  }
  const tabellaFirme = new Table({
    width: { size: wTotal, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: bordiNormali(),
    rows: [headerRow, ...emptyRows],
  });

  // Tabella argomenti
  const tabellaArgomenti = new Table({
    width: { size: wTotal, type: WidthType.DXA },
    columnWidths: [wTotal],
    borders: bordiNormali(),
    rows: [new TableRow({ children: [new TableCell({
      width: { size: wTotal, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ children: [
        new TextRun({ text: 'Argomenti trattati: ', font: FONT, size: 20, bold: true }),
        new TextRun({ text: 'Vedasi progetto formativo', font: FONT, size: 20 }),
      ]})],
    })]})],
  });

  const children = [
    // Titolo
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [new TextRun({ text: 'REGISTRO PRESENZE', font: FONT, size: 34, bold: true, color: C.BLU_DARK })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: CLIENTE.ragioneSociale, font: FONT, size: 24, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: indirizzoCompleto(), font: FONT, size: 20 })],
    }),
    vuoto(40),
    infoCorso,
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: ' ', size: 8 })] }),
    tabellaFirme,
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: ' ', size: 8 })] }),
    tabellaArgomenti,
    vuoto(40),
  ];

  const doc = creaDocLandscape(children, titoloDoc);
  const sottocartella = '02 - REGISTRO PRESENZE';
  const nomefile = isIniziale
    ? 'Registro_FormIniziale_Preposto.docx'
    : 'Registro_Aggiornamento_Preposto.docx';
  return salvaDoc(doc, sottocartella, nomefile);
}

module.exports = {
  genProgettoFormativo,
  genLetteraNomina,
  genRegistroPresenze,
  MODULI_PREPOSTO,
};
