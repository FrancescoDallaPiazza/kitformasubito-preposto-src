// ═══════════════════════════════════════════════════════════════
// docs2.js — Documenti KIT PREPOSTO v3 (allineato esempi cliente)
// 4. Attestato (header solo logo, footer compatto)
// 5. Verbale Verifica Finale (sezioni BLU_MED, tabella ammessi)
// 6. Verifica Efficacia (tabella valutazione 6 col, header solo logo)
// 7. Questionario Gradimento (banda blu LEGENDA, 3 textarea)
// ═══════════════════════════════════════════════════════════════

const {
  CLIENTE, CORSO, C, FONT,
  Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, VerticalAlign, ShadingType,
  W,
  bordiNormali, bordoLight, noBorders,
  para, vuoto, salvaDoc,
  creaDocStandard, creaDocAttestato, creaDocVerificaEfficacia, creaDocQuestionario,
  titoloSezione, titoloSezioneVerbale,
  cella, celHeaderBlu, celEtichetta, celValore, bandaTitolo,
  indirizzoCompleto, codiceFiscaleEffettivo,
} = require('./helpers');

// ── DOCENZA (STEP 1 della skill) ──────────────────────────────────────────────
// formatoreEsterno valorizzato → docente esterno qualificato ex D.I. 06/03/2013;
// vuoto → docenza del Datore di Lavoro che svolge il ruolo di RSPP (default).
function isFormExt() { return !!(CLIENTE.formatoreEsterno && CLIENTE.formatoreEsterno.trim()); }
function firmaRelatoreLabel() { return isFormExt() ? 'Firma del Relatore / Docente' : 'Firma del Relatore / Datore di Lavoro / RSPP'; }

// ═══════════════════════════════════════════════════════════════
// 4. ATTESTATO
// ═══════════════════════════════════════════════════════════════
async function genAttestato(tipo /* 'INIZIALE' | 'AGGIORNAMENTO' */) {
  const isIniziale = tipo === 'INIZIALE';
  const oreTotali = isIniziale ? 12 : 6;
  const tipoLabel = isIniziale
    ? 'FORMAZIONE PER PREPOSTO (12 ore)'
    : 'AGGIORNAMENTO FORMAZIONE PREPOSTO (6 ore)';
  const rifNormRiga2 = isIniziale
    ? "Riferimento normativo e contenuti minimi secondo l'Accordo Stato-Regioni del 17 aprile 2025"
    : "Riferimento normativo: art. 37 c.7-ter D.Lgs. 81/08 – ASR 17/04/2025";
  const rifNormRiga3 = isIniziale
    ? "Parte II dell'Accordo – Punto 2.2 (formazione del preposto, 4 moduli)"
    : "Parte III dell'Accordo – Punto 1.2 (aggiornamento biennale 6 ore)";
  const notaFondo = isIniziale
    ? "Il presente attestato ha validità su tutto il territorio nazionale."
    : "Il presente attestato di aggiornamento ha validità di 2 anni su tutto il territorio nazionale.";

  // Helper riga centrata
  const PAR = (testo, opts = {}) => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.spA != null ? opts.spA : 40 },
    children: [new TextRun({
      text: testo, font: FONT,
      size: opts.sz || 20,
      bold: opts.bold || false, color: opts.col || undefined,
      italics: opts.italics || false,
    })],
  });

  // Tabella anagrafica corso (2 col)
  const wL = 2698, wR = W - wL;
  const tabellaCorso = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordiNormali(),
    rows: [
      new TableRow({ children: [
        celEtichetta('Tipologia corso:', { width: wL }),
        celValore(tipoLabel, { width: wR, bold: true }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Riferimento normativo:', { width: wL }),
        cellaRifNorm(wR, 'ASR 17/04/2025 (D.Lgs. 81/2008, art. 37)', rifNormRiga2, rifNormRiga3),
      ]}),
      new TableRow({ children: [
        celEtichetta('Durata:', { width: wL }),
        celValore(`${oreTotali} ore`, { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Modalità:', { width: wL }),
        celValore('Presenza sul campo / Videoconferenza sincrona', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Data inizio:', { width: wL }),
        celValore('___/___/_____', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Data fine:', { width: wL }),
        celValore('___/___/_____', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Sede di svolgimento:', { width: wL }),
        celValore(CLIENTE.indirizzo, { width: wR }),
      ]}),
    ],
  });

  // Tabella firme (2 col)
  const wF = Math.floor(W / 2);
  const tabellaFirme = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wF, wF],
    borders: bordiNormali(),
    rows: [
      new TableRow({ children: [
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: 'Firma del Soggetto Formatore / Datore di Lavoro', font: FONT, size: 20, bold: true })] })],
        }),
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: firmaRelatoreLabel(), font: FONT, size: 20, bold: true })] })],
        }),
      ]}),
      new TableRow({
        height: { value: 700, rule: 'exact' },
        children: [
          new TableCell({ width: { size: wF, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 40 })] })],
          }),
          new TableCell({ width: { size: wF, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 40 })] })],
          }),
        ],
      }),
    ],
  });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: 'ATTESTATO DI FORMAZIONE', font: FONT, size: 40, bold: true, color: C.BLU_DARK })],
    }),
    vuoto(40),
    PAR(`Il/La sottoscritto/a ${CLIENTE.datoreLavoro} in qualità di Datore di Lavoro e Soggetto Formatore`),
    PAR(`della Società ${CLIENTE.ragioneSociale}`),
    PAR(`con Codice ATECO ${CLIENTE.atecoCodice} – ${CLIENTE.atecoDesc}`),
    PAR('nei confronti del/la lavoratore/rice avente'),
    vuoto(20),
    PAR('Ruolo di PREPOSTO', { sz: 24, bold: true, col: C.BLU_DARK, spA: 60 }),
    vuoto(20),
    PAR('Sig./Sig.ra  ____________________________________________'),
    PAR('Nato/a a ________________________ il ___/___/_____'),
    PAR('Residente in ____________________________________________'),
    PAR('Codice Fiscale: ___________________________________________', { spA: 60 }),
    PAR('ha frequentato il corso di formazione in materia di Salute e Sicurezza sul Lavoro:', { spA: 100 }),
    vuoto(40),

    tabellaCorso,
    vuoto(20),

    PAR("Superando con esito positivo la verifica finale dell'apprendimento,"),
    PAR("effettuata in data ___/___/_____ secondo quanto previsto dall'Accordo Stato-Regioni 17/04/2025.", { spA: 100 }),
    vuoto(20),
    PAR(notaFondo, { sz: 19, bold: true, italics: true, col: C.GRIGIO, spA: 100 }),
    PAR("L'aggiornamento della formazione è previsto ogni 2 anni.", { sz: 19, bold: true, italics: true, col: C.GRIGIO, spA: 100 }),
    vuoto(80),

    new Paragraph({
      alignment: AlignmentType.LEFT, spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'Luogo e data: ______________________', font: FONT, size: 20 })],
    }),
    vuoto(30),
    tabellaFirme,
  ];

  const doc = creaDocAttestato(children);
  const sottocartella = '05 - ATTESTATI';
  const nomefile = isIniziale ? 'Attestato_Preposto.docx' : 'Attestato_Aggiornamento_Preposto.docx';
  return salvaDoc(doc, sottocartella, nomefile);
}

function cellaRifNorm(wR, riga1, riga2, riga3) {
  return new TableCell({
    width: { size: wR, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [
      new Paragraph({ children: [new TextRun({ text: riga1, font: FONT, size: 20, color: '000000' })] }),
      new Paragraph({ children: [new TextRun({ text: riga2, font: FONT, size: 18, italics: true, color: '000000' })] }),
      new Paragraph({ children: [new TextRun({ text: riga3, font: FONT, size: 18, italics: true, color: '000000' })] }),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════
// 5. VERBALE VERIFICA FINALE
// ═══════════════════════════════════════════════════════════════
async function genVerbaleVerifica() {
  const isBase = CORSO.tipoCorso === 'BASE';

  // Tabella formatore (2 col, 4 righe)
  const wL1 = 3539, wR1 = W - wL1;
  const tabellaFormatore = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL1, wR1],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        celEtichetta('Denominazione', { width: wL1 }),
        celValore(CLIENTE.ragioneSociale, { width: wR1 }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Codice Fiscale / P.IVA', { width: wL1 }),
        celValore(codiceFiscaleEffettivo(), { width: wR1 }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Responsabile progetto formativo', { width: wL1 }),
        celValore(CLIENTE.datoreLavoro, { width: wR1 }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Soggetto Formatore / Docente', { width: wL1 }),
        celValore('Per la ditta', { width: wR1 }),
      ]}),
    ],
  });

  // Tabella ammessi (5 col, 8 righe vuote + header)
  const colWidths = [464, 2384, 3243, 1417, 2130]; // somma 9638
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      celHeaderBlu('N.', { width: colWidths[0] }),
      celHeaderBlu('Cognome e Nome', { width: colWidths[1] }),
      celHeaderBlu('Codice Fiscale', { width: colWidths[2] }),
      celHeaderBlu('Ammesso (SI/NO)', { width: colWidths[3], sz: 16 }),
      celHeaderBlu('Esito (Idoneo / Non idoneo)', { width: colWidths[4], sz: 16 }),
    ],
  });
  const emptyRows = [];
  for (let i = 1; i <= 8; i++) {
    emptyRows.push(new TableRow({
      children: [
        new TableCell({
          width: { size: colWidths[0], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 60, right: 60 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(i), font: FONT, size: 20 })] })],
        }),
        new TableCell({
          width: { size: colWidths[1], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 60, right: 60 },
          children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
        }),
        new TableCell({
          width: { size: colWidths[2], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 60, right: 60 },
          children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
        }),
        new TableCell({
          width: { size: colWidths[3], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 60, right: 60 },
          children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
        }),
        new TableCell({
          width: { size: colWidths[4], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 60, right: 60 },
          children: [new Paragraph({ children: [new TextRun({ text: ' ' })] })],
        }),
      ],
    }));
  }
  const tabellaAmmessi = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: bordoLight(),
    rows: [headerRow, ...emptyRows],
  });

  // Tabella firma finale (1 col)
  const tabellaFirmaResponsabile = new Table({
    width: { size: 7132, type: WidthType.DXA },
    columnWidths: [7132],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [new TableCell({
        width: { size: 7132, type: WidthType.DXA },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: 'Responsabile del Progetto Formativo', font: FONT, size: 20, bold: true })] })],
      })]}),
      new TableRow({
        height: { value: 700, rule: 'exact' },
        children: [new TableCell({
          width: { size: 7132, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 50 })] })],
        })],
      }),
    ],
  });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 280, after: 120 },
      children: [new TextRun({ text: "VERBALE DI VERIFICA FINALE DELL'APPRENDIMENTO",
        font: FONT, size: 32, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: "Redatto ai sensi dell'ASR 17/04/2025, Parte IV, punto 6.3.",
        font: FONT, size: 20, italics: true })],
    }),
    vuoto(40),

    titoloSezioneVerbale('1. DATI DEL SOGGETTO FORMATORE'),
    tabellaFormatore,
    vuoto(20),

    titoloSezioneVerbale('2. DATI DEL CORSO'),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: 'Tipologia e durata:', font: FONT, size: 20, bold: true })] }),
    new Paragraph({ spacing: { after: 60 }, children: [
      new TextRun({ text: '☐  Formazione', font: FONT, size: 20, bold: isBase }),
      new TextRun({ text: ' Aggiuntiva Preposti – Durata: ___ ore', font: FONT, size: 20 }),
    ]}),
    new Paragraph({ spacing: { after: 60 }, children: [
      new TextRun({ text: '☐  Aggiornamento', font: FONT, size: 20, bold: !isBase }),
      new TextRun({ text: ' Preposti – Durata: ___ ore', font: FONT, size: 20 }),
    ]}),
    vuoto(20),

    titoloSezioneVerbale('3. ELENCO AMMESSI ALLA VERIFICA FINALE ED ESITO'),
    tabellaAmmessi,

    titoloSezioneVerbale('4. MODALITÀ DI VERIFICA'),
    new Paragraph({ spacing: { after: 60 }, children: [
      new TextRun({ text: '☐  Test', font: FONT, size: 20, bold: true }),
      new TextRun({ text: ' scritto a risposte multiple', font: FONT, size: 20 }),
    ]}),
    new Paragraph({ spacing: { after: 60 }, children: [
      new TextRun({ text: '☐  Colloquio', font: FONT, size: 20, bold: true }),
      new TextRun({ text: ' individuale', font: FONT, size: 20 }),
    ]}),
    new Paragraph({ spacing: { after: 60 }, children: [
      new TextRun({ text: '☐  Prova', font: FONT, size: 20, bold: true }),
      new TextRun({ text: ' pratica', font: FONT, size: 20 }),
    ]}),

    titoloSezioneVerbale('5. LUOGO E DATA DELLA VERIFICA FINALE'),
    new Paragraph({ spacing: { after: 80, line: 360, lineRule: 'auto' },
      children: [new TextRun({ text: 'Luogo: _____________________________________________________________', font: FONT, size: 20 })] }),
    new Paragraph({ spacing: { after: 80, line: 360, lineRule: 'auto' },
      children: [new TextRun({ text: 'Data: _____________________________ - Orario: dalle ______ alle ______', font: FONT, size: 20 })] }),

    titoloSezioneVerbale('6. DICHIARAZIONE DEL DOCENTE'),
    para("Il sottoscritto docente attesta che il discente sopra indicato ha svolto la verifica finale di apprendimento e che l'esito è stato quello sopra riportato. In caso di esito positivo, il discente ha raggiunto le competenze previste dai 4 moduli dell'ASR 17/04/2025 (Parte II, §2.2 per il corso base, Parte III, §1.2 per l'aggiornamento)."),
    vuoto(30),
    para('Luogo e data: ___________________________, ___ / ___ / ______'),
    vuoto(20),
    tabellaFirmaResponsabile,
  ];

  const doc = creaDocStandard(children, 'Verbale Verifica Finale Preposto');
  return salvaDoc(doc, '06 - VERBALE VERIFICA', 'Verbale_Verifica_Finale_Preposto.docx');
}

// ═══════════════════════════════════════════════════════════════
// 6. VERIFICA EFFICACIA
// ═══════════════════════════════════════════════════════════════
async function genVerificaEfficacia() {
  // Tabella anagrafica (2 col, 4 righe)
  const wL = 3256, wR = W - wL;
  const tabellaAnagrafica = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        celEtichetta('Corso di riferimento:', { width: wL }),
        celValore('Formazione aggiuntiva preposti', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Data verifica:', { width: wL }),
        celValore('___/___/______', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Lavoratore verificato:', { width: wL }),
        celValore('', { width: wR }),
      ]}),
      new TableRow({ children: [
        celEtichetta('Osservatore (nome e qualifica):', { width: wL }),
        celValore('', { width: wR }),
      ]}),
    ],
  });

  // Tabella valutazione (6 col, 10 items + header)
  const items = [
    'Riconosce i rischi presenti nel reparto di sovrintendenza',
    "Vigila sull'osservanza da parte dei lavoratori dei propri obblighi di legge (art. 19 c.1 lett. a)",
    'Interviene tempestivamente in caso di inosservanza delle disposizioni di sicurezza',
    "Verifica l'uso corretto dei DPI da parte dei lavoratori",
    'Comunica efficacemente con il Datore di Lavoro e con il SPP',
    'Segnala deficienze di mezzi, attrezzature e DPI (art. 19 c.1 lett. f)',
    'Informa i lavoratori esposti a pericolo grave e immediato (art. 19 c.1 lett. d)',
    'Segnala near miss e infortuni mancati',
    'Conosce le procedure di emergenza e sa farle applicare',
    'Dimostra leadership e autorevolezza nella gestione del team',
  ];
  const colW = [4671, 442, 441, 441, 441, 1560];
  const tabellaValutazione = new Table({
    width: { size: 5000, type: WidthType.PERCENTAGE },
    columnWidths: colW,
    borders: bordiNormali(),
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          celHeaderBlu('Area di verifica', { width: colW[0], sz: 18 }),
          celHeaderBlu('1', { width: colW[1], sz: 18 }),
          celHeaderBlu('2', { width: colW[2], sz: 18 }),
          celHeaderBlu('3', { width: colW[3], sz: 18 }),
          celHeaderBlu('4', { width: colW[4], sz: 18 }),
          celHeaderBlu('Note', { width: colW[5], sz: 18 }),
        ],
      }),
      ...items.map(it => new TableRow({
        children: [
          new TableCell({ width: { size: colW[0], type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({
              alignment: AlignmentType.JUSTIFIED, spacing: { before: 30, after: 30 },
              children: [new TextRun({ text: it, font: FONT, size: 20 })] })],
          }),
          ...[1,2,3,4].map((_, ix) => new TableCell({
            width: { size: colW[1+ix], type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 60, bottom: 60, left: 60, right: 60 },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 },
              children: [new TextRun({ text: '□', font: 'Arial', size: 20 })] })],
          })),
          new TableCell({ width: { size: colW[5], type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 20 })] })],
          }),
        ],
      })),
    ],
  });

  // Tabella firma osservatore (2 col)
  const wF = Math.floor(W / 2);
  const tabellaFirma = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wF, wF],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: 'Firma Osservatore', font: FONT, size: 20, bold: true })] })],
        }),
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 20 })] })],
        }),
      ]}),
    ],
  });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 60 },
      children: [new TextRun({ text: "VERIFICA DELL'EFFICACIA DELLA FORMAZIONE",
        font: FONT, size: 32, bold: true, color: C.BLU_DARK })],
    }),
    vuoto(80),

    new Paragraph({
      spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: "Formazione Preposto ai sensi dell'art. 37 D.Lgs. 81/08",
        font: FONT, size: 26, bold: true, color: C.BLU_HEADER })],
    }),
    para("La verifica dell'efficacia della formazione è prevista dall'ASR 17/04/2025 (Parte IV, §7) e deve essere effettuata a distanza di tempo dalla conclusione del corso, durante lo svolgimento dell'attività lavorativa, per accertare:"),
    para('• le conoscenze, le abilità e le competenze acquisite con la formazione;'),
    para('• i comportamenti e le pratiche, quali la corretta applicazione di procedure, schede lavorative e protocolli.'),
    vuoto(20),
    tabellaAnagrafica,
    vuoto(20),

    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [new TextRun({ text: 'VALUTAZIONE COMPORTAMENTALE', font: FONT, size: 22, bold: true, color: C.BLU_DARK })],
    }),
    para('Per ciascun item valutare con: 1 = Insufficiente, 2 = Sufficiente, 3 = Buono, 4 = Ottimo'),
    tabellaValutazione,

    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [new TextRun({ text: 'OSSERVAZIONI / AREE DI MIGLIORAMENTO', font: FONT, size: 20, bold: true })],
    }),
    new Paragraph({
      spacing: { before: 160, after: 80, line: 360, lineRule: 'auto' },
      children: [new TextRun({ text: '_'.repeat(180), font: FONT, size: 20, bold: true })],
    }),

    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [new TextRun({ text: 'Esito complessivo:', font: FONT, size: 20, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({ text: '☐ ADEGUATO     ☐ PARZIALMENTE ADEGUATO     ☐ NON ADEGUATO', font: FONT, size: 20, bold: true })],
    }),

    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: 'Azioni correttive proposte:', font: FONT, size: 20 })] }),
    new Paragraph({
      spacing: { after: 200, line: 360, lineRule: 'auto' },
      children: [new TextRun({ text: '_'.repeat(180), font: FONT, size: 20, bold: true })],
    }),
    tabellaFirma,
  ];

  const doc = creaDocVerificaEfficacia(children);
  return salvaDoc(doc, '07 - VERIFICA EFFICACIA', 'Verifica_Efficacia_Preposto.docx');
}

// ═══════════════════════════════════════════════════════════════
// 7. QUESTIONARIO GRADIMENTO
// ═══════════════════════════════════════════════════════════════
async function genQuestionarioGradimento() {
  const domande = [
    "Gli obiettivi del corso sono stati chiaramente esposti all'inizio",
    'I contenuti del corso sono stati coerenti con gli obiettivi dichiarati',
    'I contenuti sono stati utili per il mio ruolo di preposto',
    'Il docente ha mostrato padronanza della materia',
    'Il docente ha saputo spiegare in modo chiaro',
    'Il docente ha favorito la partecipazione e il confronto',
    'I materiali didattici forniti sono risultati adeguati',
    'La durata del corso è stata appropriata ai contenuti',
    "L'ambiente / la piattaforma di erogazione è risultata funzionale",
    'Consiglierei questo corso a un collega',
  ];

  // Tabella valutazione (5 col)
  const colW = [5590, 1012, 1012, 1012, 1012];
  const tabellaValutazione = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: colW,
    borders: bordoLight(),
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ width: { size: colW[0], type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.BLU_DARK },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED,
              children: [new TextRun({ text: 'DOMANDA', font: FONT, size: 20, bold: true, color: C.BIANCO })] })],
          }),
          ...['1','2','3','4'].map((t, i) => new TableCell({
            width: { size: colW[1+i], type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.BLU_DARK },
            margins: { top: 60, bottom: 60, left: 60, right: 60 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: t, font: FONT, size: 20, bold: true, color: C.BIANCO })] })],
          })),
        ],
      }),
      ...domande.map(d => new TableRow({
        children: [
          new TableCell({ width: { size: colW[0], type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.JUSTIFIED,
              children: [new TextRun({ text: d, font: FONT, size: 20 })] })],
          }),
          ...[0,1,2,3].map(i => new TableCell({
            width: { size: colW[1+i], type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 60, right: 60 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: '☐', font: FONT, size: 20 })] })],
          })),
        ],
      })),
    ],
  });

  // Helper textarea (tabella 1x1 grigia)
  const textarea = () => new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [W],
    borders: bordoLight(),
    rows: [new TableRow({
      height: { value: 700, rule: 'atLeast' },
      children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 24 })] })],
      })],
    })],
  });

  const children = [
    vuoto(60),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: 'QUESTIONARIO DI VALUTAZIONE DEL GRADIMENTO',
        font: FONT, size: 28, bold: true, color: C.BLU_DARK })],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [new TextRun({
        text: 'Il presente questionario è anonimo e ha lo scopo di migliorare la qualità dei futuri interventi formativi. Le chiediamo di rispondere con sincerità.',
        font: FONT, size: 20 })],
    }),
    bandaTitolo('LEGENDA: 1 = Insufficiente   2 = Sufficiente   3 = Buono   4 = Ottimo',
      { fill: C.BLU_DARK, sz: 20 }),
    new Paragraph({ spacing: { after: 10 }, children: [new TextRun({ text: ' ', size: 8 })] }),

    tabellaValutazione,
    new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: ' ', size: 8 })] }),

    bandaTitolo('OSSERVAZIONI E SUGGERIMENTI', { fill: C.BLU_DARK, sz: 20 }),
    new Paragraph({ spacing: { before: 10, after: 6 },
      children: [new TextRun({ text: 'Cosa ha apprezzato maggiormente?', font: FONT, size: 20 })] }),
    textarea(),
    new Paragraph({ spacing: { before: 10, after: 6 },
      children: [new TextRun({ text: 'Cosa migliorereste?', font: FONT, size: 20 })] }),
    textarea(),
    new Paragraph({ spacing: { before: 10, after: 6 },
      children: [new TextRun({ text: 'Temi che vorrei approfondire in futuri aggiornamenti:', font: FONT, size: 20 })] }),
    textarea(),
    vuoto(30),
    para('Data compilazione: ___ / ___ / ______'),
  ];

  const doc = creaDocQuestionario(children, 'Questionario di Gradimento Preposto');
  return salvaDoc(doc, '04 - QUESTIONARIO GRADIMENTO', 'Questionario_Gradimento_Preposto.docx');
}

// ═══════════════════════════════════════════════════════════════
// 8. COLLOQUIO DI APPRENDIMENTO (solo AGGIORNAMENTO)
// ───────────────────────────────────────────────────────────────
// L'aggiornamento del preposto NON usa il test scritto a risposta
// multipla: la verifica di apprendimento è un COLLOQUIO orale
// verbalizzato condotto dal docente al termine delle 6 ore
// (ASR 17/04/2025 Parte III §1.2 + Parte IV §6.3 — test OPPURE colloquio).
// Corso generalista → un UNICO colloquio generico (nome del preposto
// a segnaposto, compilato dal datore di lavoro), come l'Attestato.
// Il template NON contiene domande pre-stampate: le formula il docente
// in aula, calibrate sui contenuti dell'aggiornamento e sulle funzioni
// art. 19. Nessun campo domandeColloquio in helpers.js.
// ═══════════════════════════════════════════════════════════════
function docenteColloquioNome()     { return isFormExt() ? CLIENTE.formatoreEsterno : CLIENTE.datoreLavoro; }
function docenteColloquioQualifica(){ return isFormExt() ? 'Formatore qualificato ex D.I. 06/03/2013' : 'Datore di Lavoro / RSPP (art. 34 D.Lgs. 81/08)'; }

async function genColloquioPreposto() {
  const wL = 3373, wR = W - wL;

  // KV table coerente con gli altri documenti del KIT preposto
  const kvTable = (righe) => new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordoLight(),
    rows: righe.map(([k, v]) => new TableRow({ children: [
      celEtichetta(k, { width: wL }),
      celValore(v, { width: wR }),
    ]})),
  });

  const CHECK = (txt) => new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: `☐  ${txt}`, font: FONT, size: 20, color: '000000' })],
  });

  // Tabella firme (2 col) — stesso stile del Verbale/Attestato
  const wF = Math.floor(W / 2);
  const tabellaFirme = new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wF, wF],
    borders: bordiNormali(),
    rows: [
      new TableRow({ children: [
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: firmaRelatoreLabel(), font: FONT, size: 20, bold: true })] })],
        }),
        new TableCell({ width: { size: wF, type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: 'Firma del Preposto', font: FONT, size: 20, bold: true })] })],
        }),
      ]}),
      new TableRow({
        height: { value: 700, rule: 'exact' },
        children: [
          new TableCell({ width: { size: wF, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 40 })] })] }),
          new TableCell({ width: { size: wF, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT, size: 40 })] })] }),
        ],
      }),
    ],
  });

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 120, after: 40 },
      children: [new TextRun({ text: 'VERBALE DI COLLOQUIO INDIVIDUALE', font: FONT, size: 32, bold: true, color: C.BLU_DARK })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 40 },
      children: [new TextRun({ text: 'Verifica finale dell\u2019apprendimento \u2013 Aggiornamento Preposto', font: FONT, size: 22, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 120 },
      children: [new TextRun({ text: 'Redatto ai sensi dell\u2019ASR 17/04/2025, Parte IV, punto 6.3 (verifica mediante colloquio individuale).', font: FONT, size: 18, italics: true, color: C.GRIGIO })],
    }),

    titoloSezioneVerbale('1. DATI DEL SOGGETTO FORMATORE'),
    kvTable([
      ['Denominazione', CLIENTE.ragioneSociale],
      ['Docente', docenteColloquioNome()],
      ['Qualifica', docenteColloquioQualifica()],
    ]),
    vuoto(20),

    titoloSezioneVerbale('2. DATI DEL CORSO DI AGGIORNAMENTO'),
    kvTable([
      ['Modalit\u00e0', '\u2610 In presenza      \u2610 Videoconferenza sincrona'],
      ['Durata', '6 ore (aggiornamento biennale)'],
      ['Data/e di svolgimento', '___________________________________'],
    ]),
    vuoto(20),

    titoloSezioneVerbale('3. DATI DEL PARTECIPANTE'),
    kvTable([
      ['Cognome e Nome', '___________________________________'],
      ['Data di nascita', '___ / ___ / _______'],
      ['Ruolo', 'PREPOSTO'],
      ['Reparto / Area di sovrintendenza', '___________________________________'],
    ]),
    vuoto(20),

    titoloSezioneVerbale('4. FINALIT\u00c0 E CONTENUTI DELL\u2019AGGIORNAMENTO'),
    para('Il colloquio verifica l\u2019apprendimento dei contenuti dell\u2019aggiornamento del preposto (ASR 17/04/2025, Parte III, punti 1 e 1.2). Barrare gli ambiti trattati nel colloquio:'),
    CHECK('Modifiche normative intervenute'),
    CHECK('Aggiornamenti tecnici sui rischi ai quali sono esposti i lavoratori'),
    CHECK('Organizzazione e gestione della sicurezza in azienda'),
    CHECK('Fonti di rischio e relative misure di prevenzione'),
    CHECK('Cambiamenti del contesto: reparto, processi produttivi e organizzativi'),
    CHECK('Funzioni del preposto ex art. 19 D.Lgs. 81/08 e misure adottate a seguito della valutazione dei rischi'),
    new Paragraph({ spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: '\u2610  Altro: _______________________________________________', font: FONT, size: 20, color: '000000' })] }),
    vuoto(20),

    titoloSezioneVerbale('5. MODALIT\u00c0 DI CONDUZIONE DEL COLLOQUIO'),
    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: '\u2610  Domande aperte        \u2610  Caso pratico        \u2610  Simulazione        \u2610  Discussione su near miss', font: FONT, size: 20, color: '000000' })] }),
    vuoto(20),

    titoloSezioneVerbale('6. ESITO DELLA VERIFICA'),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: '\u2610  IDONEO            \u2610  NON IDONEO', font: FONT, size: 22, bold: true, color: '000000' })] }),
    new Paragraph({ spacing: { after: 80 },
      children: [new TextRun({ text: 'Note del docente: _______________________________________________________', font: FONT, size: 20 })] }),
    vuoto(40),

    new Paragraph({ spacing: { after: 60 },
      children: [new TextRun({ text: `Luogo: ${CLIENTE.indirizzo}`, font: FONT, size: 20 })] }),
    new Paragraph({ spacing: { after: 120 },
      children: [new TextRun({ text: 'Data: ___ / ___ / _______', font: FONT, size: 20 })] }),
    vuoto(20),
    tabellaFirme,
  ];

  const doc = creaDocStandard(children, 'Colloquio di Apprendimento \u2013 Aggiornamento Preposto');
  return salvaDoc(doc, '03 - COLLOQUIO DI APPRENDIMENTO', 'Colloquio_Preposto.docx');
}

module.exports = {
  genAttestato,
  genVerbaleVerifica,
  genVerificaEfficacia,
  genQuestionarioGradimento,
  genColloquioPreposto,
};
