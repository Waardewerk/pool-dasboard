// Vercel serverless function — scrapt WPA Men's World Ranking
// Endpoint: /api/rankings

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  try {
    const response = await fetch('https://wpapool.com/rankings/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) throw new Error(`WPA responded with ${response.status}`);
    const html = await response.text();

    // De WPA pagina bevat meerdere JSON arrays (men, women, etc.)
    // We zoeken specifiek de array NA "MEN'S PLAYER RANKING"
    // De data staat als [[[\"Rank\",\"Player\",...],[ rijen ]]]
    
    // Vind alle posities van [[[ in de HTML
    const allStarts = [];
    let searchFrom = 0;
    while (true) {
      const idx = html.indexOf('[[[', searchFrom);
      if (idx === -1) break;
      allStarts.push(idx);
      searchFrom = idx + 1;
    }

    // Vind de positie van "MEN'S PLAYER RANKING" of "MEN" sectie
    const menMarkers = ["MEN'S PLAYER RANKING", "MEN&#8217;S PLAYER RANKING", "PLAYER RANKING"];
    let menPos = -1;
    for (const marker of menMarkers) {
      menPos = html.indexOf(marker);
      if (menPos !== -1) break;
    }

    // Kies de [[[  die het dichtst NA de men's marker staat
    let chosenStart = -1;
    if (menPos !== -1) {
      for (const s of allStarts) {
        if (s > menPos) { chosenStart = s; break; }
      }
    }
    // Fallback: eerste array
    if (chosenStart === -1 && allStarts.length > 0) chosenStart = allStarts[0];
    if (chosenStart === -1) throw new Error('Geen data gevonden op WPA pagina');

    // Extraheer de volledige JSON array via bracket balancing
    let depth = 0, end = chosenStart;
    for (let i = chosenStart; i < html.length; i++) {
      if (html[i] === '[') depth++;
      else if (html[i] === ']') { depth--; if (depth === 0) { end = i + 1; break; } }
    }

    const parsed = JSON.parse(html.slice(chosenStart, end));
    const rows = parsed[0];
    const headers = rows[0];

    const rankIdx   = headers.findIndex(h => String(h).trim() === 'Rank');
    const nameIdx   = headers.findIndex(h => String(h).trim() === 'Player');
    const countryIdx= headers.findIndex(h => String(h).trim() === 'Country');
    const ptsIdx    = headers.findIndex(h => String(h).includes('Total Points'));

    if (rankIdx === -1 || nameIdx === -1) throw new Error('Headers niet herkend: ' + JSON.stringify(headers.slice(0,5)));

    const players = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rank = parseInt(row[rankIdx]);
      const pts  = parseInt(String(row[ptsIdx] ?? 0).replace(/[^0-9]/g, ''));
      const name = String(row[nameIdx] || '').trim();
      const country = String(row[countryIdx] || '').trim().toUpperCase().slice(0, 3);
      // Filter: echte WPA landcodes zijn 3 letters, punten > 1000 voor top spelers
      if (!isNaN(rank) && rank >= 1 && name && country.length === 3) {
        players.push({ r: rank, n: name, c: country, pts: isNaN(pts) ? 0 : pts });
      }
    }

    if (players.length < 10) throw new Error(`Te weinig spelers (${players.length}) — verkeerde array`);

    // Sorteer op rank, pak top 50
    players.sort((a, b) => a.r - b.r);

    return res.status(200).json({
      source: 'live',
      updated: new Date().toISOString(),
      players: players.slice(0, 50)
    });

  } catch (err) {
    return res.status(200).json({
      source: 'fallback',
      updated: new Date().toISOString(),
      note: err.message,
      players: FALLBACK
    });
  }
}

// Fallback: WPA top 42 exact per 5 mei 2026
const FALLBACK = [
  {r:1, n:'Szewczyk, Wojciech',     c:'POL', pts:35360},
  {r:2, n:'Biado, Carlo',            c:'PHI', pts:35316},
  {r:3, n:'Maciol, Daniel',          c:'POL', pts:32658},
  {r:4, n:'Gorst, Fedor',            c:'AIN', pts:32540},
  {r:5, n:'Kazakis, Alexander',      c:'GRE', pts:32110},
  {r:6, n:'Yapp, Aloysius',          c:'SGP', pts:31860},
  {r:7, n:'Oi, Naoyuki',             c:'JPN', pts:30520},
  {r:8, n:'Sanchez-Ruiz, Francisco', c:'ESP', pts:30240},
  {r:9, n:'Ouschan, Albin',          c:'AUT', pts:29050},
  {r:10,n:'Filler, Joshua',          c:'GER', pts:28135},
  {r:11,n:'Zielinski, Wiktor',       c:'POL', pts:28112},
  {r:12,n:'Teutscher, Marco',        c:'NED', pts:26532},
  {r:13,n:'Kasper, Stefan',          c:'GER', pts:26400},
  {r:14,n:'He, Mario',               c:'AUT', pts:26357},
  {r:15,n:'Grabe, Dennis',           c:'EST', pts:25824},
  {r:16,n:'Kural, Szymon',           c:'POL', pts:25788},
  {r:17,n:'Al-Awadhi, Bader',        c:'KUW', pts:25188},
  {r:18,n:'Wu, Kun-Lin',             c:'TPE', pts:25104},
  {r:19,n:'Souto Comino, Jonas',     c:'ESP', pts:24557},
  {r:20,n:'Loukatos, Dimitrios',     c:'GRE', pts:24076},
  {r:21,n:'Capito, Robbie',          c:'HKG', pts:23090},
  {r:21,n:'Van Boening, Shane',      c:'USA', pts:23090},
  {r:23,n:'Szolnoki, Oliver',        c:'HUN', pts:23000},
  {r:24,n:'Juszczyszyn, Konrad',     c:'POL', pts:22811},
  {r:25,n:'Lechner, Maximilian',     c:'AUT', pts:22436},
  {r:26,n:'De Luna, Jeffrey',        c:'PHI', pts:20684},
  {r:27,n:'Matikainen, Casper',      c:'FIN', pts:20370},
  {r:28,n:'Fortunski, Mieszko',      c:'POL', pts:20136},
  {r:29,n:'Hsu, Jui-An',             c:'TPE', pts:18525},
  {r:30,n:'Martinez Boza, Gerson',   c:'PER', pts:18086},
  {r:31,n:'Souquet, Ralf',           c:'GER', pts:17343},
  {r:32,n:'Sniegocki, Mateusz',      c:'POL', pts:16676},
  {r:33,n:'Shaw, Jayson',            c:'GBR', pts:16450},
  {r:34,n:'Hohmann, Thorsten',       c:'USA', pts:16320},
  {r:35,n:'Styer, Tyler',            c:'USA', pts:15676},
  {r:36,n:'Sun, Yi-Hsuan',           c:'TPE', pts:15578},
  {r:37,n:'Neuhausen, Moritz',       c:'GER', pts:15150},
  {r:38,n:'Hijikata, Hayato',        c:'JPN', pts:14990},
  {r:39,n:'Montpellier, Alex',       c:'FRA', pts:14896},
  {r:40,n:'Ko, Ping-Chung',          c:'TPE', pts:14400},
  {r:41,n:'Morra, John',             c:'CAN', pts:14128},
  {r:42,n:'Bongers, Tobias',         c:'GER', pts:14000},
];
