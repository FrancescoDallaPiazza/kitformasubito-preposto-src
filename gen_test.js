// ═══════════════════════════════════════════════════════════════
// gen_test.js — Test apprendimento PREPOSTO v3 (layout-tabella)
// Ogni domanda è una TABELLA: 1 riga header (colspan=2, fill BLU_LIGHT)
// + 4 righe risposte (lettera in cella sx 415, testo in cella dx 9223).
// Test docente: shading FFFF99 sulla cella della risposta corretta.
// ═══════════════════════════════════════════════════════════════

const {
  CLIENTE, CORSO, C, FONT,
  Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, ShadingType, VerticalAlign,
  W,
  bordoLight, noBorders,
  para, vuoto, salvaDoc, creaDocStandard,
  titoloConBordo,
} = require('./helpers');

// ═══════════════════════════════════════════════════════════════
// 20 DOMANDE FISSE sui 4 MODULI ASR 17/04/2025 (5 per modulo)
// ═══════════════════════════════════════════════════════════════
function domandeFisseASR() {
  return [
    // ───── MODULO 1 – GIURIDICO NORMATIVO (5 domande) ─────
    {d:"Secondo l'art. 2 c.1 lett. e) del D.Lgs. 81/08, il preposto è:", r:[
      {lettera:'A', testo:'Un rappresentante sindacale eletto dai lavoratori', corretta:false},
      {lettera:'B', testo:"Persona che sovrintende all'attività lavorativa e garantisce l'attuazione delle direttive ricevute", corretta:true},
      {lettera:'C', testo:'Il responsabile del Servizio di Prevenzione e Protezione', corretta:false},
      {lettera:'D', testo:'Il datore di lavoro di fatto in assenza del titolare', corretta:false},
    ]},
    {d:'La Legge 215/2021 ha introdotto, a carico del datore di lavoro:', r:[
      {lettera:'A', testo:"L'obbligo di nominare un RLS esterno", corretta:false},
      {lettera:'B', testo:"L'abolizione della figura del preposto", corretta:false},
      {lettera:'C', testo:"L'obbligo di INDIVIDUARE i preposti (art. 18 c.1 lett. b-bis D.Lgs. 81/08)", corretta:true},
      {lettera:'D', testo:"L'obbligo di nominare un dirigente per la sicurezza", corretta:false},
    ]},
    {d:'Il "preposto di fatto" è una figura:', r:[
      {lettera:'A', testo:'Priva di rilievo giuridico', corretta:false},
      {lettera:'B', testo:'Riconosciuta dalla giurisprudenza anche in assenza di nomina formale, a chi esercita di fatto i poteri di sovrintendenza', corretta:true},
      {lettera:'C', testo:'Valida solo nelle aziende con più di 50 dipendenti', corretta:false},
      {lettera:'D', testo:'Una figura sostitutiva del datore di lavoro', corretta:false},
    ]},
    {d:"Ai sensi dell'art. 19 c.1 lett. a), in caso di persistente inosservanza da parte del lavoratore, il preposto deve:", r:[
      {lettera:'A', testo:'Attendere la fine del turno per una relazione scritta', corretta:false},
      {lettera:'B', testo:"Rivolgersi direttamente all'Ispettorato del Lavoro", corretta:false},
      {lettera:'C', testo:'Segnalare solo al RLS', corretta:false},
      {lettera:'D', testo:"Interrompere l'attività del lavoratore e informare i superiori diretti", corretta:true},
    ]},
    {d:"In caso di violazione dell'art. 19 c.1 lett. a), c), e), f), il preposto è punito (art. 56 D.Lgs. 81/08):", r:[
      {lettera:'A', testo:'Con una sanzione disciplinare interna', corretta:false},
      {lettera:'B', testo:"Con l'arresto fino a due mesi o con l'ammenda nei limiti previsti dall'art. 56", corretta:true},
      {lettera:'C', testo:'Solo con un richiamo verbale', corretta:false},
      {lettera:'D', testo:"Con l'ergastolo", corretta:false},
    ]},

    // ───── MODULO 2 – GESTIONE E ORGANIZZAZIONE (5 domande) ─────
    {d:"La funzione di controllo dell'osservanza da parte dei lavoratori, che l'art. 19 attribuisce al preposto, si esercita:", r:[
      {lettera:'A', testo:"Attraverso una vigilanza continuativa durante lo svolgimento dell'attività lavorativa", corretta:true},
      {lettera:'B', testo:'Solo durante le riunioni periodiche con il DL', corretta:false},
      {lettera:'C', testo:'Solo in presenza di ispettori ATS', corretta:false},
      {lettera:'D', testo:"Una volta all'anno in sede di bilancio della sicurezza", corretta:false},
    ]},
    {d:'Nel sistema di prevenzione aziendale, il preposto si relaziona principalmente con:', r:[
      {lettera:'A', testo:'Solo con i lavoratori che dipendono gerarchicamente da lui', corretta:false},
      {lettera:'B', testo:'Solo con il datore di lavoro', corretta:false},
      {lettera:'C', testo:'Con datore di lavoro, dirigenti, SPP, medico competente, RLS e lavoratori', corretta:true},
      {lettera:'D', testo:'Solo con i colleghi di pari livello', corretta:false},
    ]},
    {d:'Il preposto, rispetto al DVR aziendale:', r:[
      {lettera:'A', testo:'Non deve conoscerlo', corretta:false},
      {lettera:'B', testo:'Deve conoscerne i contenuti relativi al reparto/area in cui opera', corretta:true},
      {lettera:'C', testo:'Deve redigerlo personalmente', corretta:false},
      {lettera:'D', testo:'Deve approvarlo in assemblea con i lavoratori', corretta:false},
    ]},
    {d:'Il preposto, riguardo ai lavoratori neoassunti o somministrati:', r:[
      {lettera:'A', testo:'Non ha alcun obbligo particolare', corretta:false},
      {lettera:'B', testo:"Deve farli lavorare da soli per verificarne l'autonomia", corretta:false},
      {lettera:'C', testo:"Deve prestare particolare attenzione all'informazione e alla vigilanza iniziale, accertandosi che abbiano ricevuto adeguate istruzioni", corretta:true},
      {lettera:'D', testo:"Deve segnalarli all'INPS", corretta:false},
    ]},
    {d:'La funzione di SOVRINTENDENZA del preposto (art. 19) è caratterizzata da:', r:[
      {lettera:'A', testo:'Un ruolo esclusivamente consultivo', corretta:false},
      {lettera:'B', testo:'Un potere direttivo e di controllo funzionale, non meramente formale', corretta:true},
      {lettera:'C', testo:'Il potere di licenziare i lavoratori', corretta:false},
      {lettera:'D', testo:'La redazione del bilancio aziendale', corretta:false},
    ]},

    // ───── MODULO 3 – VALUTAZIONE RISCHI E CONTROLLO (5 domande) ─────
    {d:'Di fronte a un lavoratore che non indossa i DPI previsti, il preposto DEVE in via prioritaria:', r:[
      {lettera:'A', testo:"Ignorare se l'attività sta per finire", corretta:false},
      {lettera:'B', testo:'Limitarsi a una segnalazione verbale generica', corretta:false},
      {lettera:'C', testo:"Richiedere immediatamente l'osservanza e, in caso di persistenza, interrompere l'attività (art. 19 c.1 lett. a)", corretta:true},
      {lettera:'D', testo:'Compilare una scheda di non conformità da consegnare a fine mese', corretta:false},
    ]},
    {d:'Il "near miss" (mancato infortunio) deve essere:', r:[
      {lettera:'A', testo:'Ignorato perché non ha prodotto danni', corretta:false},
      {lettera:'B', testo:'Individuato e segnalato, perché consente azioni preventive prima di un evento grave (art. 19 c.1 lett. f)', corretta:true},
      {lettera:'C', testo:'Registrato solo se il lavoratore lo richiede', corretta:false},
      {lettera:'D', testo:"Denunciato all'autorità giudiziaria", corretta:false},
    ]},
    {d:'In caso di appalti/subappalti in azienda, il preposto deve conoscere:', r:[
      {lettera:'A', testo:'Solo i nomi delle imprese appaltatrici', corretta:false},
      {lettera:'B', testo:'Gli obblighi ex art. 26 D.Lgs. 81/08 e i contenuti del DUVRI relativi al rischio interferenziale', corretta:true},
      {lettera:'C', testo:'Solo il costo del contratto', corretta:false},
      {lettera:'D', testo:'La normativa fiscale sugli appalti', corretta:false},
    ]},
    {d:"L'art. 19 c.1 lett. f-bis) prevede che, in caso di deficienze di mezzi e DPI o di condizioni di pericolo rilevate durante la vigilanza, il preposto:", r:[
      {lettera:'A', testo:'Possa ignorare il problema se non di sua competenza', corretta:false},
      {lettera:'B', testo:'Debba attendere le 24 ore successive per intervenire', corretta:false},
      {lettera:'C', testo:"Debba consultare previamente l'ufficio acquisti", corretta:false},
      {lettera:'D', testo:"Se necessario, interrompa l'attività del lavoratore e informi tempestivamente il datore di lavoro", corretta:true},
    ]},
    {d:'Le "misure tecniche, organizzative e procedurali" contenute nel DVR sono per il preposto:', r:[
      {lettera:'A', testo:'Indicazioni generiche senza valore operativo', corretta:false},
      {lettera:'B', testo:'Consigli facoltativi da applicare solo se praticabili', corretta:false},
      {lettera:'C', testo:"Le direttive di cui deve garantire l'attuazione e la corretta esecuzione da parte dei lavoratori", corretta:true},
      {lettera:'D', testo:'Documenti di esclusiva competenza del solo RSPP', corretta:false},
    ]},

    // ───── MODULO 4 – COMUNICAZIONE E INFORMAZIONE (5 domande) ─────
    {d:'Nella comunicazione con i lavoratori, il preposto deve privilegiare uno stile:', r:[
      {lettera:'A', testo:'Autoritario e distaccato', corretta:false},
      {lettera:'B', testo:'Chiaro, diretto, orientato al rispetto delle procedure ma rispettoso della persona', corretta:true},
      {lettera:'C', testo:'Informale e ambiguo', corretta:false},
      {lettera:'D', testo:'Esclusivamente scritto via email', corretta:false},
    ]},
    {d:'Un lavoratore straniero con limitata padronanza della lingua italiana è stato appena assegnato al reparto. Il preposto deve:', r:[
      {lettera:'A', testo:"Aspettare che impari l'italiano", corretta:false},
      {lettera:'B', testo:'Farlo lavorare con mansioni semplici senza informazione sui rischi', corretta:false},
      {lettera:'C', testo:'Accertarsi che le informazioni sulla sicurezza gli siano fornite in modo comprensibile, anche con strumenti visivi o nella sua lingua', corretta:true},
      {lettera:'D', testo:'Rifiutare di farlo lavorare', corretta:false},
    ]},
    {d:'In caso di pericolo grave ed immediato, il preposto deve (art. 19 c.1 lett. d):', r:[
      {lettera:'A', testo:"Attendere l'arrivo del RSPP", corretta:false},
      {lettera:'B', testo:'Informare il più presto possibile i lavoratori esposti circa il rischio e le misure adottate o da adottare', corretta:true},
      {lettera:'C', testo:"Contattare l'Ispettorato del Lavoro", corretta:false},
      {lettera:'D', testo:'Redigere un rapporto scritto prima di comunicare', corretta:false},
    ]},
    {d:'La segnalazione al datore di lavoro delle deficienze di mezzi e DPI (art. 19 c.1 lett. f) deve essere:', r:[
      {lettera:'A', testo:"Effettuata solo al termine dell'anno lavorativo", corretta:false},
      {lettera:'B', testo:'Facoltativa a discrezione del preposto', corretta:false},
      {lettera:'C', testo:'Tempestiva, sulla base della formazione ricevuta', corretta:true},
      {lettera:'D', testo:'Anonima e riservata', corretta:false},
    ]},
    {d:"L'aggiornamento della formazione del preposto (ASR 17/04/2025):", r:[
      {lettera:'A', testo:'Ha cadenza quinquennale, durata 4 ore, può svolgersi in e-learning', corretta:false},
      {lettera:'B', testo:'Ha cadenza biennale, durata minima 6 ore, solo in presenza o videoconferenza sincrona', corretta:true},
      {lettera:'C', testo:'Non è obbligatorio', corretta:false},
      {lettera:'D', testo:'È sostituibile dalla partecipazione a un convegno', corretta:false},
    ]},
  ];
}

// ═══════════════════════════════════════════════════════════════
// 10 DOMANDE TRASVERSALI sull'art. 19 D.Lgs. 81/08 e scenari tipo
// ═══════════════════════════════════════════════════════════════
function domandeTrasversaliArt19() {
  return [
    {d:"Il preposto scopre che un lavoratore sta utilizzando un'attrezzatura priva dei ripari di sicurezza obbligatori. La condotta corretta ex art. 19 c.1 lett. a) D.Lgs. 81/08 è:", r:[
      {lettera:'A', testo:"Richiedere immediatamente l'osservanza; in caso di persistenza, interrompere l'attività e informare il DL", corretta:true},
      {lettera:'B', testo:'Attendere la fine del turno e poi redigere una nota scritta', corretta:false},
      {lettera:'C', testo:"Comunicarlo solo all'RLS alla prossima riunione periodica", corretta:false},
      {lettera:'D', testo:'Nulla, poiché il controllo ripari spetta al manutentore', corretta:false},
    ]},
    {d:"Durante l'attività, il preposto rileva un pericolo grave e immediato per un gruppo di lavoratori. Ai sensi dell'art. 19 c.1 lett. c) e d) D.Lgs. 81/08 DEVE:", r:[
      {lettera:'A', testo:'Continuare il lavoro e segnalare il problema in forma scritta entro la giornata', corretta:false},
      {lettera:'B', testo:"Informare tempestivamente i lavoratori esposti sul pericolo e sulle disposizioni adottate; astenersi dal richiedere la ripresa dell'attività se il pericolo persiste", corretta:true},
      {lettera:'C', testo:'Convocare i lavoratori in una riunione a fine giornata', corretta:false},
      {lettera:'D', testo:"Chiedere ai lavoratori di firmare un'autocertificazione di accettazione del rischio", corretta:false},
    ]},
    {d:"La formazione del preposto ai sensi dell'ASR 17/04/2025 può svolgersi:", r:[
      {lettera:'A', testo:'Esclusivamente in e-learning', corretta:false},
      {lettera:'B', testo:'Solo in presenza, senza altre modalità', corretta:false},
      {lettera:'C', testo:'In presenza o in videoconferenza sincrona (non in e-learning)', corretta:true},
      {lettera:'D', testo:'Tramite partecipazione a convegni o seminari di settore', corretta:false},
    ]},
    {d:"In base all'ASR 17/04/2025 Parte IV §6, la frequenza minima obbligatoria al corso di formazione del preposto è:", r:[
      {lettera:'A', testo:'Il 50% del monte ore', corretta:false},
      {lettera:'B', testo:'Il 70% del monte ore', corretta:false},
      {lettera:'C', testo:"L'80% del monte ore", corretta:false},
      {lettera:'D', testo:'Il 90% del monte ore', corretta:true},
    ]},
    {d:'Il verbale di verifica finale di apprendimento del corso preposto (ASR 17/04/2025 §6.3) prevede:', r:[
      {lettera:'A', testo:'Minimo 30 domande per corso base (10 per aggiornamento), superamento al 70%', corretta:true},
      {lettera:'B', testo:'Un colloquio orale libero con il docente', corretta:false},
      {lettera:'C', testo:'Un test di 5 domande con superamento al 50%', corretta:false},
      {lettera:'D', testo:'Nessuna verifica, essendo corso di aggiornamento', corretta:false},
    ]},
    {d:"L'art. 19 c.1 lett. f-bis D.Lgs. 81/08, introdotto dalla L. 215/2021, attribuisce al preposto:", r:[
      {lettera:'A', testo:'Il potere di licenziare i lavoratori inadempienti', corretta:false},
      {lettera:'B', testo:"Il dovere di interrompere l'attività in caso di persistente inosservanza delle norme di sicurezza, segnalando al superiore diretto", corretta:true},
      {lettera:'C', testo:'Il potere di modificare autonomamente il DVR aziendale', corretta:false},
      {lettera:'D', testo:'La facoltà di delegare funzioni ad altri lavoratori', corretta:false},
    ]},
    {d:'Rispetto ai lavoratori neoassunti, stranieri o somministrati, il preposto DEVE (Modulo 4 ASR 2025):', r:[
      {lettera:'A', testo:'Considerarli equivalenti ai lavoratori esperti dopo il primo giorno', corretta:false},
      {lettera:'B', testo:"Affidarli subito a compiti a rischio elevato per accelerare l'apprendimento", corretta:false},
      {lettera:'C', testo:'Verificare che abbiano compreso le informazioni/formazione ricevute, usare linguaggio adeguato e vigilare con particolare attenzione', corretta:true},
      {lettera:'D', testo:'Escluderli da qualsiasi attività fino al rilascio della formazione generale', corretta:false},
    ]},
    {d:'Il near miss (infortunio mancato) secondo il Modulo 3 ASR 2025:', r:[
      {lettera:'A', testo:'Può essere ignorato se non ci sono state lesioni', corretta:false},
      {lettera:'B', testo:'Va annotato solo dopo che si è ripetuto', corretta:false},
      {lettera:'C', testo:'Non rientra tra gli obblighi del preposto', corretta:false},
      {lettera:'D', testo:'Deve essere segnalato tempestivamente al DL/RSPP per essere analizzato e alimentare il miglioramento delle misure di prevenzione', corretta:true},
    ]},
    {d:"In caso di appalti e contratti d'opera (art. 26 D.Lgs. 81/08), il preposto DEVE vigilare in particolare:", r:[
      {lettera:'A', testo:'Sul rispetto delle misure di coordinamento previste dal DUVRI e delle informazioni sui rischi interferenziali', corretta:true},
      {lettera:'B', testo:'Solo sul personale della propria azienda, mai sugli appaltatori', corretta:false},
      {lettera:'C', testo:"Sulla correttezza fiscale delle fatture dell'appaltatore", corretta:false},
      {lettera:'D', testo:"Sulla durata contrattuale del rapporto con l'appaltatore", corretta:false},
    ]},
    {d:'Il preposto "di fatto" (riconosciuto dalla giurisprudenza anche in assenza di nomina formale):', r:[
      {lettera:'A', testo:'Non è soggetto a obblighi di sicurezza', corretta:false},
      {lettera:'B', testo:'È sanzionabile solo se espressamente nominato per iscritto', corretta:false},
      {lettera:'C', testo:'Risponde degli stessi obblighi del preposto formalmente nominato, in ragione delle mansioni effettivamente svolte', corretta:true},
      {lettera:'D', testo:'Può delegare tutte le sue responsabilità al datore di lavoro', corretta:false},
    ]},
  ];
}

// ═══════════════════════════════════════════════════════════════
// API PUBBLICA — Set domande
// BASE: 30 (20 sui 4 moduli + 10 trasversali)
// AGG.: 15 (8 dai moduli + 7 trasversali)
// ═══════════════════════════════════════════════════════════════
function domandeGeneraliste(tipoCorso) {
  const fisse = domandeFisseASR();
  const trasversali = domandeTrasversaliArt19();
  if (tipoCorso === 'BASE') return [...fisse, ...trasversali];
  return [
    fisse[0], fisse[1],
    fisse[5], fisse[6],
    fisse[10], fisse[11],
    fisse[15], fisse[16],
    ...trasversali.slice(0, 7),
  ];
}

function costruisciDomande() {
  const tutte = domandeGeneraliste(CORSO.tipoCorso);
  return tutte.map((q, idx) => ({...q, numero: idx + 1}));
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT-TABELLA per UNA domanda
//
// ┌──────────────────────────────────────────────────────────────┐
// │ N. Testo della domanda                  fill BLU_LIGHT        │ <- colspan=2, 10pt B nero
// ├─────┬────────────────────────────────────────────────────────┤
// │  A. │ Testo opzione A                                         │ 9pt
// ├─────┼────────────────────────────────────────────────────────┤
// │  B. │ Testo opzione B  ✓                       [shading FFFF99] │ <- corretta nel test docente
// ├─────┼────────────────────────────────────────────────────────┤
// │  C. │ Testo opzione C                                         │
// ├─────┼────────────────────────────────────────────────────────┤
// │  D. │ Testo opzione D                                         │
// └─────┴────────────────────────────────────────────────────────┘
//
// Larghezze: 415 (lettera) + 9223 (testo) = 9638 (W)
// ═══════════════════════════════════════════════════════════════
function tabellaDomanda(q, evidenziaCorretta) {
  const wL = 415, wR = 9223;
  const bordi = {
    top:    { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
    left:   { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
    right:  { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
    insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: C.GRIGIO_BDL },
  };
  const numRisposte = q.r.length;

  // Riga header (domanda) — cantSplit per non spezzare la domanda;
  // keepNext+keepLines sul paragrafo per "incollarlo" alla riga successiva.
  const headerRow = new TableRow({
    cantSplit: true,
    children: [new TableCell({
      width: { size: wL + wR, type: WidthType.DXA },
      columnSpan: 2,
      shading: { type: ShadingType.CLEAR, color: 'auto', fill: C.BLU_LIGHT },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        keepNext: true,
        keepLines: true,
        children: [new TextRun({
          text: `${q.numero}. ${q.d}`,
          font: FONT, size: 20, bold: true, color: '000000',
        })],
      })],
    })],
  });

  // Righe risposte: keepNext sui paragrafi tranne l'ultima riga
  // (così domanda+A+B+C stanno con D, ma D non è incollata al titolo successivo)
  const risposteRows = q.r.map((opt, idx) => {
    const isCorrect = opt.corretta;
    const evidenzia = evidenziaCorretta && isCorrect;
    const isUltima = idx === numRisposte - 1;
    const keepNext = !isUltima;  // l'ultima riga NON ha keepNext

    const cellLettera = new TableCell({
      width: { size: wL, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: evidenzia ? { type: ShadingType.CLEAR, color: 'auto', fill: C.GIALLO_HL } : undefined,
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        keepNext, keepLines: true,
        children: [new TextRun({
          text: `${opt.lettera}.`,
          font: FONT, size: 18,
          bold: evidenzia,
          color: evidenzia ? C.BLU_HEADER : '000000',
        })],
      })],
    });
    const cellTesto = new TableCell({
      width: { size: wR, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      shading: evidenzia ? { type: ShadingType.CLEAR, color: 'auto', fill: C.GIALLO_HL } : undefined,
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        keepNext, keepLines: true,
        children: [new TextRun({
          text: `${opt.testo}${evidenzia ? '  ✓' : ''}`,
          font: FONT, size: 18,
          bold: evidenzia,
          color: evidenzia ? C.BLU_HEADER : '000000',
        })],
      })],
    });
    return new TableRow({ cantSplit: true, children: [cellLettera, cellTesto] });
  });

  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wL, wR],
    borders: bordi,
    rows: [headerRow, ...risposteRows],
  });
}

// ═══════════════════════════════════════════════════════════════
// HEADER ANAGRAFICA (tabella 2x2 senza fill: Cognome/Nome | Mansione | Data | -)
// ═══════════════════════════════════════════════════════════════
function tabellaAnagraficaTest() {
  const wMezzo = Math.floor(W / 2);
  const cellAna = (testo) => new TableCell({
    width: { size: wMezzo, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: testo, font: FONT, size: 20 })],
    })],
  });
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [wMezzo, wMezzo],
    borders: bordoLight(),
    rows: [
      new TableRow({ children: [
        cellAna('Cognome e Nome: _________________________________'),
        cellAna('Mansione: _________________________________'),
      ]}),
      new TableRow({ children: [
        cellAna('Data: ____/____/__________'),
        cellAna(''),
      ]}),
    ],
  });
}

// ═══════════════════════════════════════════════════════════════
// TEST DISCENTE — layout-tabella, senza evidenziazione corrette
// ═══════════════════════════════════════════════════════════════
async function genTestDiscente() {
  const domande = costruisciDomande();
  const isBase = CORSO.tipoCorso === 'BASE';
  const sogliaTotale = domande.length;
  const sogliaMin = Math.ceil(sogliaTotale * 0.7);

  const children = [
    // Titoli con bordo bottom
    new Paragraph({ spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: "TEST DI VERIFICA DELL'APPRENDIMENTO",
        font: FONT, size: 32, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({ spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({
        text: isBase ? 'Corso di formazione per PREPOSTO (12 ore)' : 'Corso di aggiornamento per PREPOSTO (6 ore)',
        font: FONT, size: 26, bold: true, color: C.BLU_HEADER })],
    }),
    // Sottotitolo grigio italico
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
      children: [new TextRun({
        text: 'Formazione obbligatoria – D.Lgs. 81/08 e Accordo Stato-Regioni 17/04/2025',
        font: FONT, size: 18, italics: true, color: C.GRIGIO })],
    }),

    // Anagrafica in tabella 2x2
    tabellaAnagraficaTest(),

    // Istruzioni 9pt italico
    new Paragraph({ spacing: { before: 200, after: 200 },
      children: [new TextRun({
        text: `ISTRUZIONI: Per ogni domanda, barrare la risposta che si ritiene corretta (A, B, C oppure D). È ammessa una sola risposta per domanda. Durata: 30 minuti. Punteggio minimo per il superamento: ${sogliaMin}/${sogliaTotale} (70%).`,
        font: FONT, size: 18, italics: true })],
    }),

    // Domande (ognuna è una tabella, intercalate da paragrafo vuoto piccolo)
    ...domande.flatMap(q => [
      tabellaDomanda(q, false),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: ' ', size: 8 })] }),
    ]),

    vuoto(60),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 30, after: 30 },
      children: [new TextRun({
        text: `Risposte corrette: ____ / ${sogliaTotale}    Percentuale: ____ %    Esito: □ SUPERATO   □ NON SUPERATO`,
        font: FONT, size: 20, bold: true, italics: true })],
    }),
    vuoto(40),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: 'Firma del discente: ____________________________',
        font: FONT, size: 20, bold: true, italics: true })],
    }),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: 'Firma del docente: _____________________________',
        font: FONT, size: 20, bold: true, italics: true })],
    }),
  ];

  const doc = creaDocStandard(children, 'Test Finale Apprendimento Preposto');
  return salvaDoc(doc, '03 - TEST FINALE APPRENDIMENTO', 'Test_Preposto.docx');
}

// ═══════════════════════════════════════════════════════════════
// TEST DOCENTE — stesso layout, con shading FFFF99 sulla risposta corretta
// ═══════════════════════════════════════════════════════════════
async function genTestDocente() {
  const domande = costruisciDomande();
  const isBase = CORSO.tipoCorso === 'BASE';
  const sogliaTotale = domande.length;
  const sogliaMin = Math.ceil(sogliaTotale * 0.7);

  const children = [
    new Paragraph({ spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({ text: "TEST DI VERIFICA DELL'APPRENDIMENTO — VERSIONE DOCENTE",
        font: FONT, size: 32, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({ spacing: { before: 280, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.BLU_HEADER } },
      children: [new TextRun({
        text: isBase ? 'Corso di formazione per PREPOSTO (12 ore)' : 'Corso di aggiornamento per PREPOSTO (6 ore)',
        font: FONT, size: 26, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
      children: [new TextRun({
        text: 'Formazione obbligatoria – D.Lgs. 81/08 e Accordo Stato-Regioni 17/04/2025',
        font: FONT, size: 18, italics: true, color: C.GRIGIO })],
    }),

    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: 'Le risposte corrette sono evidenziate.',
        font: FONT, size: 20, bold: true, color: C.BLU_HEADER })],
    }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: `Soglia di superamento: ${sogliaMin}/${sogliaTotale} (70%) – ASR 17/04/2025, Parte IV, §6.3`,
        font: FONT, size: 20 })],
    }),

    // Anagrafica
    tabellaAnagraficaTest(),
    vuoto(20),

    // Domande con evidenziazione corretta
    ...domande.flatMap(q => [
      tabellaDomanda(q, true),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: ' ', size: 8 })] }),
    ]),

    vuoto(40),
    new Paragraph({ spacing: { before: 30, after: 30 },
      children: [new TextRun({ text: `Totale domande: ${sogliaTotale}`, font: FONT, size: 20, bold: true })],
    }),
  ];

  const doc = creaDocStandard(children, 'Test Finale Apprendimento Preposto – Docente');
  return salvaDoc(doc, '03 - TEST FINALE APPRENDIMENTO', 'Test_Preposto DOCENTE.docx');
}

module.exports = {
  domandeFisseASR,
  domandeTrasversaliArt19,
  domandeGeneraliste,
  costruisciDomande,
  genTestDiscente,
  genTestDocente,
  tabellaDomanda,
};
