// ═══════════════════════════════════════════════════════════════
// run.js — Orchestrator KIT PREPOSTO v3
// Genera tutti i documenti in base a CORSO.tipoCorso
// (Niente Scheda Ruolo: rimossa dal KIT su richiesta cliente)
// ═══════════════════════════════════════════════════════════════

const { CLIENTE, CORSO, KIT_DIR, ensureDir } = require('./helpers');
const {
  genProgettoFormativo,
  genLetteraNomina,
  genRegistroPresenze,
} = require('./docs1');
const {
  genAttestato,
  genVerbaleVerifica,
  genVerificaEfficacia,
  genQuestionarioGradimento,
  genColloquioPreposto,
} = require('./docs2');
const {
  genTestDiscente,
  genTestDocente,
  costruisciDomande,
} = require('./gen_test');

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`KIT PREPOSTO FORMASUBITO — Generazione documenti`);
  console.log(`Cliente: ${CLIENTE.ragioneSociale}`);
  console.log(`Tipo corso: ${CORSO.tipoCorso} (${CORSO.oreCorso} ore)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Verifica conteggio domande — solo per il corso BASE (l'aggiornamento usa il colloquio)
  if (CORSO.tipoCorso === 'BASE') {
    const domande = costruisciDomande();
    const minRichiesto = 30;
    if (domande.length < minRichiesto) {
      console.error(`❌ ERRORE: il test ha solo ${domande.length} domande, ma ASR 17/04/2025 richiede almeno ${minRichiesto} per ${CORSO.tipoCorso}.`);
      console.error(`   Verifica gen_test.js (domandeGeneraliste) e rilancia.`);
      process.exit(1);
    }
    console.log(`✅ Test: ${domande.length} domande totali (minimo ASR: ${minRichiesto})\n`);
  } else {
    console.log(`ℹ️  Modalità AGGIORNAMENTO: verifica finale tramite COLLOQUIO orale verbalizzato (no test scritto)\n`);
  }

  ensureDir(KIT_DIR);

  // Generazione documenti (senza Scheda Ruolo)
  await genProgettoFormativo();
  await genLetteraNomina();

  // Registro presenze: uno solo in base al tipoCorso
  if (CORSO.tipoCorso === 'BASE') {
    await genRegistroPresenze('INIZIALE');
  } else {
    await genRegistroPresenze('AGGIORNAMENTO');
  }

  // Verifica finale dell'apprendimento:
  //  - BASE 12h        → Test scritto a risposta multipla (discente + docente)
  //  - AGGIORNAMENTO 6h → Colloquio orale verbalizzato (ASR Parte IV §6.3: test OPPURE colloquio)
  if (CORSO.tipoCorso === 'BASE') {
    await genTestDiscente();
    await genTestDocente();
  } else {
    await genColloquioPreposto();
  }

  // Questionario gradimento
  await genQuestionarioGradimento();

  // Attestato
  if (CORSO.tipoCorso === 'BASE') {
    await genAttestato('INIZIALE');
  } else {
    await genAttestato('AGGIORNAMENTO');
  }

  // Verbale verifica e verifica efficacia
  await genVerbaleVerifica();
  await genVerificaEfficacia();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`✅ KIT PREPOSTO generato in: ${KIT_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(err => {
  console.error('❌ ERRORE durante la generazione:', err);
  process.exit(1);
});
