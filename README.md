# kitformasubito-preposto-src

Sorgenti JS dei documenti del KIT FORMASUBITO PREPOSTO (Overall Group).
Clonati a runtime dalla skill `kitformasubito-preposto` (STEP 0).

File:
- `helpers.js`  — costanti stile, blocco CLIENTE/CORSO/REGIONALE (popolati a runtime), helper docx, export
- `docs1.js`    — Progetto Formativo, Lettera di Nomina, Registro Presenze
- `docs2.js`    — Attestato, Verbale Verifica, Verifica Efficacia, Questionario Gradimento
- `gen_test.js` — Test 30 domande generaliste (discente + docente)
- `run.js`      — orchestratore: genera tutti i documenti + ZIP

⚠️ `helpers.js` contiene un CLIENTE di esempio (placeholder). Non pushare mai
`helpers.js` con i dati di un cliente reale: i campi CLIENTE/CORSO/REGIONALE sono
compilati a runtime da Claude e non vanno ricommittati.
