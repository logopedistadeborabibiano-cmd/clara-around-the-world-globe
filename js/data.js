/*
======================================================
CLARA AROUND THE WORLD
Data
Versione 6.3 - Fix parsing coordinate con virgola decimale
======================================================
*/
const CITTA_CSV = "https://docs.google.com/spreadsheets/d/1HjgM5w4hQO1trNQaNwuKppIAc_yZBnWd/gviz/tq?tqx=out:csv&gid=1800383631";
const INIZIATIVE_CSV = "https://docs.google.com/spreadsheets/d/1HjgM5w4hQO1trNQaNwuKppIAc_yZBnWd/gviz/tq?tqx=out:csv&gid=767627493";

// Lingua del globo (stesso meccanismo usato da panel.js e language.js:
// parametro ?lang=en / ?lang=pt nell'URL dell'iframe, default italiano)
function detectDataLang() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang === "en" || lang === "pt") return lang;
    return "it";
}

// Sceglie il testo nella lingua corretta, con fallback
// automatico sull'italiano se la traduzione manca
function pickByLang(row, lang, baseField, enField, ptField) {
    return (
        (lang === "en" && row[enField]) ||
        (lang === "pt" && row[ptField]) ||
        row[baseField]
    );
}

// Converte una coordinata scritta con la virgola come separatore
// decimale (es. "46,40") in un numero valido per JavaScript (46.4).
// Senza questa conversione, parseFloat("46,40") restituirebbe
// semplicemente 46, arrotondando e causando sovrapposizioni tra
// città vicine (es. Aprica e Santa Caterina Valfurva).
function parseCoordinate(value) {
    return parseFloat(String(value).trim().replace(",", "."));
}

// Parser CSV minimale, gestisce anche eventuali virgole dentro virgolette
function parseCSV(text) {
    const rows = text.trim().split(/\r?\n/).map(line => {
        const cells = [];
        let cur = "", inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') { inQuotes = !inQuotes; continue; }
            if (c === ',' && !inQuotes) { cells.push(cur); cur = ""; continue; }
            cur += c;
        }
        cells.push(cur);
        return cells;
    });
    const headers = rows[0].map(h => h.trim());
    return rows.slice(1).map(r => {
        const obj = {};
        headers.forEach((h, i) => obj[h] = (r[i] || "").trim());
        return obj;
    });
}

// Carica Città + Iniziative e le unisce tramite CityID
async function loadInitiatives() {
    const lang = detectDataLang();
    const [cittaRes, iniziativeRes] = await Promise.all([
        fetch(CITTA_CSV),
        fetch(INIZIATIVE_CSV)
    ]);
    const cittaRows = parseCSV(await cittaRes.text());
    const iniziativeRows = parseCSV(await iniziativeRes.text());
    const cityMap = {};
    cittaRows.forEach(row => {
        const cityName = pickByLang(row, lang, "Città IT", "Città EN", "Città PT");
        const country = pickByLang(row, lang, "Paese IT", "Paese EN", "Paese PT");
        cityMap[row.ID] = {
            city: cityName,
            country: country,
            lat: parseCoordinate(row.Latitudine),
            lng: parseCoordinate(row.Longitudine),
            active: (row.Attiva || "").toUpperCase() === "SI",
            initiatives: []
        };
    });
    iniziativeRows.forEach(row => {
        const city = cityMap[row.CityID];
        if (!city) return;
        const title = pickByLang(row, lang, "Nome", "Nome EN", "Nome PT");
        city.initiatives.push({
            title: title,
            slug: {
                it: row.Slug || null,
                en: row["Slug.EN"] || null,
                pt: row["Slug-PT"] || null
            }
        });
    });
    return Object.values(cityMap);
}

// Variabile globale che il resto del codice (globe.js) si aspetta già pronta
let initiatives = [];

// Da chiamare prima di GlobeManager.init() - vedi script.js
async function initData() {
    initiatives = await loadInitiatives();
}
