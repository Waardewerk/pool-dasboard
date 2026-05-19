// Vercel serverless function — scrapt WPA Men's World Ranking
// Endpoint: /api/rankings

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600'); // cache 1 uur op Vercel CDN

  try {
    const response = await fetch('https://wpapool.com/rankings/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });

    if (!response.ok) throw new Error(`WPA responded with ${response.status}`);

    const html = await response.text();

    // WPA embeds rankings as a JSON array directly in the HTML
    // Pattern: [[[\"Rank\",\"Player\",\"WPA License Number\",\"Country\",\" Total Points \",...
    const match = html.match(/\[\[\[["']Rank["']/);
    if (!match) throw new Error('JSON data not found in WPA page');

    // Extract the full JSON array — find start and balance brackets
    const start = html.indexOf('[[[');
    if (start === -1) throw new Error('Could not find data start');

    let depth = 0;
    let end = start;
    for (let i = start; i < html.length; i++) {
      if (html[i] === '[') depth++;
      else if (html[i] === ']') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }

    const jsonStr = html.slice(start, end);
    const parsed = JSON.parse(jsonStr);

    // Structure: [[ headers[], row[], row[], ... ]]
    // parsed[0][0] = headers, parsed[0][1..] = data rows
    const rows = parsed[0];
    const headers = rows[0]; // ["Rank","Player","WPA License Number","Country"," Total Points ", ...]

    const rankIdx = headers.findIndex(h => h.toString().trim() === 'Rank');
    const nameIdx = headers.findIndex(h => h.toString().trim() === 'Player');
    const countryIdx = headers.findIndex(h => h.toString().trim() === 'Country');
    const ptsIdx = headers.findIndex(h => h.toString().includes('Total Points'));

    const players = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rank = parseInt(row[rankIdx]);
      const pts = parseInt(String(row[ptsIdx]).replace(/[^0-9]/g, ''));
      if (!isNaN(rank) && rank >= 1) {
        players.push({
          r: rank,
          n: String(row[nameIdx] || '').trim(),
          c: String(row[countryIdx] || '').trim().toUpperCase().slice(0, 3),
          pts: isNaN(pts) ? 0 : pts
        });
      }
    }

    if (players.length < 5) throw new Error('Too few players parsed: ' + players.length);

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
