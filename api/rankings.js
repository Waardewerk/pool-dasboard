<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>World Pool Dashboard · 9-Ball</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
:root{
  --bg:#0a0f0d;
  --surface:#111710;
  --surface2:#161d14;
  --felt:#0d3320;
  --felt2:#0f3d26;
  --border:#1e2e1e;
  --border2:#243324;
  --nine:#e8a800;
  --cue:#d4891a;
  --chalk-blue:#4a9eff;
  --red:#e03535;
  --text:#e8ede8;
  --text2:#8a9e8a;
  --text3:#4a5e4a;
  --mono:'JetBrains Mono',monospace;
  --sans:'Inter',sans-serif;
  --display:'Oswald',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;overflow-x:hidden}

/* felt texture overlay */
body::before{
  content:'';position:fixed;inset:0;
  background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.005) 2px,rgba(255,255,255,.005) 4px),
  repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,.005) 2px,rgba(255,255,255,.005) 4px);
  pointer-events:none;z-index:0
}

/* header */
header{
  background:linear-gradient(180deg,#0d1f12 0%,#0a1a0f 100%);
  border-bottom:1px solid var(--border);
  padding:2rem 2rem 1.75rem;
  position:relative;overflow:hidden
}
header::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 100% at 80% 50%,rgba(13,51,32,.8) 0%,transparent 70%);
  pointer-events:none
}
header::after{
  content:'9';position:absolute;right:1rem;top:50%;transform:translateY(-50%);
  font-family:var(--display);font-size:14rem;font-weight:700;
  color:transparent;-webkit-text-stroke:1px rgba(232,168,0,.06);
  pointer-events:none;line-height:1;letter-spacing:-.02em
}
.header-inner{max-width:960px;margin:0 auto;position:relative;z-index:1}
.header-label{
  font-family:var(--mono);font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;
  color:var(--nine);opacity:.7;margin-bottom:.5rem
}
h1{
  font-family:var(--display);font-size:3.5rem;font-weight:700;
  letter-spacing:.04em;line-height:.95;margin-bottom:1rem;
  text-transform:uppercase
}
h1 em{font-style:normal;color:var(--nine)}
.header-meta{display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.live-pill{
  display:inline-flex;align-items:center;gap:.35rem;
  background:rgba(13,51,32,.6);border:1px solid rgba(74,158,255,.2);
  border-radius:2rem;padding:.2rem .7rem;
  font-family:var(--mono);font-size:.6rem;letter-spacing:.08em;color:var(--chalk-blue)
}
.live-dot{width:5px;height:5px;background:#4ade80;border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(74,222,128,.4)}50%{opacity:.5;box-shadow:0 0 0 4px rgba(74,222,128,0)}}
.source-link{font-family:var(--mono);font-size:.6rem;color:var(--text3);text-decoration:none;letter-spacing:.05em;transition:color .15s}
.source-link:hover{color:var(--text2)}

/* nav */
nav{
  background:var(--surface);
  border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:100
}
.nav-inner{max-width:960px;margin:0 auto;display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.nav-inner::-webkit-scrollbar{display:none}
.nav-btn{
  font-family:var(--mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;
  color:var(--text3);padding:.875rem 1.25rem;cursor:pointer;border:none;background:none;
  white-space:nowrap;border-bottom:2px solid transparent;transition:all .2s
}
.nav-btn:hover{color:var(--text2)}
.nav-btn.active{color:var(--nine);border-bottom-color:var(--nine)}

/* main */
main{max-width:960px;margin:0 auto;padding:2rem;position:relative;z-index:1}
.section{display:none}.section.active{display:block}

/* stat bar */
.stat-bar{
  display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  margin-bottom:1.5rem;background:var(--border);border-radius:6px;overflow:hidden;
  border:1px solid var(--border)
}
.stat-item{background:var(--surface);padding:.875rem 1rem}
.stat-l{font-family:var(--mono);font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:.3rem}
.stat-v{font-size:.95rem;font-weight:500;color:var(--text)}

/* refresh */
.refresh-bar{display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;flex-wrap:wrap}
.refresh-btn{
  font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;
  padding:.4rem 1rem;background:var(--felt);color:var(--nine);
  border:1px solid rgba(232,168,0,.25);border-radius:4px;cursor:pointer;
  display:flex;align-items:center;gap:.4rem;transition:all .15s
}
.refresh-btn:hover{background:var(--felt2);border-color:rgba(232,168,0,.5)}
.refresh-btn:disabled{opacity:.5;cursor:not-allowed}
.refresh-status{font-family:var(--mono);font-size:.6rem;color:var(--text3)}

/* search */
.search-wrap{position:relative;margin-bottom:.75rem}
.search-wrap input{
  width:100%;padding:.6rem 1rem .6rem 2.25rem;
  border:1px solid var(--border2);border-radius:4px;
  font-family:var(--mono);font-size:.75rem;
  background:var(--surface2);color:var(--text);outline:none;transition:border .15s
}
.search-wrap input::placeholder{color:var(--text3)}
.search-wrap input:focus{border-color:rgba(232,168,0,.4)}
.search-icon{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);font-size:.8rem;color:var(--text3)}

/* filters */
.filters{display:flex;gap:.4rem;margin-bottom:1.25rem;flex-wrap:wrap}
.fb{
  font-family:var(--mono);font-size:.55rem;letter-spacing:.08em;text-transform:uppercase;
  padding:.3rem .75rem;border:1px solid var(--border2);border-radius:2rem;
  background:transparent;cursor:pointer;color:var(--text3);transition:all .15s
}
.fb:hover{border-color:var(--text3);color:var(--text2)}
.fb.active{background:var(--felt);border-color:rgba(232,168,0,.4);color:var(--nine)}

/* ranking table */
.rank-table{width:100%;border-collapse:collapse}
.rank-table thead tr{border-bottom:1px solid var(--border2)}
.rank-table th{
  font-family:var(--mono);font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;
  padding:.5rem .75rem;text-align:left;color:var(--text3);font-weight:400
}
.rank-table th:first-child{text-align:right;width:2.5rem}
.rank-table th:last-child{text-align:right}
.rank-table tbody tr{border-bottom:1px solid rgba(30,46,30,.6);transition:background .1s}
.rank-table tbody tr:hover{background:rgba(13,51,32,.4)}
.rank-table td{padding:.6rem .75rem;font-size:.85rem}
.rank-table td:first-child{font-family:var(--mono);font-size:.75rem;font-weight:500;text-align:right;color:var(--text3);width:2.5rem}
.rank-table td:last-child{font-family:var(--mono);font-size:.7rem;text-align:right;color:var(--text3)}
.r1{color:var(--nine)!important;font-size:.95rem!important}
.r2{color:#b0b8b0!important}
.r3{color:var(--cue)!important}
.player-cell{display:flex;align-items:center;gap:.625rem}
.av{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:.55rem;font-weight:500;flex-shrink:0;
  border:1px solid var(--border2)
}
.pname{font-weight:500;font-size:.85rem;color:var(--text)}
.note-row td{
  font-family:var(--mono);font-size:.55rem;color:var(--text3);
  padding:.4rem .75rem;background:rgba(0,0,0,.2);font-style:italic;
  border-top:1px solid var(--border)
}
.note-row td:first-child{text-align:right}

/* toernooien */
.t-grid{display:grid;gap:.625rem}
.t-card{
  background:var(--surface);border:1px solid var(--border2);border-radius:6px;
  padding:1rem 1.125rem;display:grid;grid-template-columns:1fr auto;gap:.2rem .75rem;
  align-items:start;transition:border-color .15s
}
.t-card:hover{border-color:rgba(232,168,0,.25)}
.t-name{font-weight:600;font-size:.875rem;grid-column:1;color:var(--text)}
.t-loc{font-family:var(--mono);font-size:.6rem;color:var(--text3);grid-column:1;margin-top:.15rem}
.t-desc{font-size:.78rem;color:var(--text2);line-height:1.55;grid-column:1;margin-top:.5rem}
.t-badge{
  font-family:var(--mono);font-size:.55rem;letter-spacing:.08em;text-transform:uppercase;
  padding:.2rem .6rem;border-radius:2rem;grid-column:2;grid-row:1;align-self:start;white-space:nowrap
}
.bwc{background:rgba(212,137,26,.15);color:var(--cue);border:1px solid rgba(212,137,26,.3)}
.bet{background:rgba(74,158,255,.1);color:var(--chalk-blue);border:1px solid rgba(74,158,255,.25)}
.bmc{background:rgba(224,53,53,.1);color:var(--red);border:1px solid rgba(224,53,53,.25)}

/* weetjes */
.w-add{
  display:inline-flex;align-items:center;gap:.5rem;
  font-family:var(--mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;
  padding:.45rem 1rem;background:var(--felt);color:var(--nine);
  border:1px solid rgba(232,168,0,.25);border-radius:4px;cursor:pointer;margin-bottom:1rem;transition:all .15s
}
.w-add:hover{background:var(--felt2);border-color:rgba(232,168,0,.5)}
.w-form{
  background:var(--surface);border:1px solid var(--border2);border-radius:6px;
  padding:1.125rem;margin-bottom:1rem;display:none
}
.w-form.open{display:block}
.w-form input,.w-form textarea{
  width:100%;padding:.5rem .75rem;border:1px solid var(--border2);border-radius:4px;
  font-family:var(--sans);font-size:.8rem;margin-bottom:.625rem;outline:none;
  background:var(--surface2);color:var(--text)
}
.w-form input::placeholder,.w-form textarea::placeholder{color:var(--text3)}
.w-form input:focus,.w-form textarea:focus{border-color:rgba(232,168,0,.4)}
.w-form textarea{min-height:80px;resize:vertical}
.w-form-row{display:flex;gap:.5rem}.w-form-row input{flex:1}
.btn-save{
  font-family:var(--mono);font-size:.6rem;letter-spacing:.08em;
  padding:.4rem 1rem;background:var(--felt);color:var(--nine);
  border:1px solid rgba(232,168,0,.3);border-radius:4px;cursor:pointer
}
.btn-cancel{
  font-family:var(--mono);font-size:.6rem;padding:.4rem .875rem;
  background:none;color:var(--text3);border:1px solid var(--border2);
  border-radius:4px;cursor:pointer;margin-left:.4rem
}
.w-grid{display:grid;gap:.625rem}
.w-card{
  background:var(--surface);border:1px solid var(--border2);border-radius:6px;
  padding:1rem 1.125rem;border-left:2px solid var(--nine)
}
.w-title{font-weight:600;font-size:.875rem;margin-bottom:.35rem;color:var(--text)}
.w-text{font-size:.78rem;color:var(--text2);line-height:1.6}
.w-player{font-family:var(--mono);font-size:.55rem;color:var(--text3);margin-top:.5rem}

/* hall of fame */
.hof-grid{display:grid;gap:.625rem}
.hof-card{
  background:var(--surface);border:1px solid var(--border2);border-radius:6px;
  padding:1rem 1.125rem;display:flex;gap:1rem;transition:border-color .15s
}
.hof-card:hover{border-color:rgba(232,168,0,.2)}
.hof-num{font-family:var(--display);font-size:2.25rem;font-weight:700;color:var(--border2);line-height:1;min-width:2.25rem}
.hof-num.h1{color:var(--nine)}.hof-num.h2{color:#666}.hof-num.h3{color:var(--cue)}
.hof-name{font-weight:600;font-size:.9rem;margin-bottom:.15rem;color:var(--text)}
.hof-era{font-family:var(--mono);font-size:.55rem;color:var(--text3);margin-bottom:.4rem}
.hof-text{font-size:.78rem;color:var(--text2);line-height:1.6}

/* footer */
footer{
  border-top:1px solid var(--border);padding:1.5rem 2rem;
  text-align:center;font-family:var(--mono);font-size:.58rem;color:var(--text3)
}
footer a{color:var(--text3);text-decoration:none}
footer a:hover{color:var(--text2)}

/* responsive */
@media(max-width:600px){
  h1{font-size:2.5rem}
  main{padding:1.25rem 1rem}
  .stat-bar{grid-template-columns:repeat(2,1fr)}
  .rank-table th:nth-child(3),.rank-table td:nth-child(3){display:none}
  .t-card{grid-template-columns:1fr}
  .t-badge{grid-column:1;width:fit-content}
}
</style>
</head>
<body>

<header>
  <!-- SVG ballen illustratie -->
  <div style="position:absolute;bottom:0;right:0;left:0;height:110px;overflow:hidden;pointer-events:none;z-index:0">
    <svg viewBox="0 0 960 110" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" style="width:100%;height:100%">
      <defs>
        <!-- felt achtergrond gradient -->
        <radialGradient id="b1g" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#c8920a"/></radialGradient>
        <radialGradient id="b2g" cx="40%" cy="35%"><stop offset="0%" stop-color="#5bc8f5"/><stop offset="100%" stop-color="#1565a0"/></radialGradient>
        <radialGradient id="b3g" cx="40%" cy="35%"><stop offset="0%" stop-color="#f07030"/><stop offset="100%" stop-color="#a03010"/></radialGradient>
        <radialGradient id="b4g" cx="40%" cy="35%"><stop offset="0%" stop-color="#9c4fcc"/><stop offset="100%" stop-color="#5a1d88"/></radialGradient>
        <radialGradient id="b5g" cx="40%" cy="35%"><stop offset="0%" stop-color="#e84040"/><stop offset="100%" stop-color="#9a1010"/></radialGradient>
        <radialGradient id="b6g" cx="40%" cy="35%"><stop offset="0%" stop-color="#2ecc6a"/><stop offset="100%" stop-color="#0d6b30"/></radialGradient>
        <radialGradient id="b7g" cx="40%" cy="35%"><stop offset="0%" stop-color="#b85010"/><stop offset="100%" stop-color="#6a2008"/></radialGradient>
        <radialGradient id="b8g" cx="40%" cy="35%"><stop offset="0%" stop-color="#222"/><stop offset="100%" stop-color="#000"/></radialGradient>
        <radialGradient id="b9g" cx="40%" cy="35%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#c8920a"/></radialGradient>
        <radialGradient id="bcg" cx="40%" cy="35%"><stop offset="0%" stop-color="#f8f8f0"/><stop offset="100%" stop-color="#ccc"/></radialGradient>
        <filter id="bshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,.7)"/>
        </filter>
        <!-- stripe mask -->
        <clipPath id="top-half"><rect x="-40" y="-40" width="80" height="40"/></clipPath>
        <clipPath id="bot-half"><rect x="-40" y="0" width="80" height="40"/></clipPath>
      </defs>

      <!-- fade overlay top -->
      <rect width="960" height="110" fill="url(#topfade)"/>
      <defs><linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0d1f12" stop-opacity="1"/><stop offset="40%" stop-color="#0d1f12" stop-opacity=".5"/><stop offset="100%" stop-color="#0d1f12" stop-opacity="0"/></linearGradient></defs>

      <!-- Ball helper macro — drawn as groups at bottom edge -->
      <!-- r=28, baseline y=105 -->

      <!-- Bal 1 — geel solid -->
      <g transform="translate(560,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b1g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">1</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 2 — blauw solid -->
      <g transform="translate(618,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b2g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">2</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 3 — rood solid -->
      <g transform="translate(676,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b3g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">3</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 4 — paars solid -->
      <g transform="translate(734,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b4g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">4</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 5 — rood solid -->
      <g transform="translate(792,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b5g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">5</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 6 — groen solid -->
      <g transform="translate(850,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b6g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">6</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 7 — bruin solid -->
      <g transform="translate(908,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b7g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">7</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
      </g>

      <!-- Bal 8 — zwart -->
      <g transform="translate(966,77)" filter="url(#bshadow)">
        <circle r="28" fill="url(#b8g)"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">8</text>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      </g>

      <!-- Bal 9 — geel stripe (highlight) -->
      <g transform="translate(1024,77)" filter="url(#bshadow)">
        <circle r="28" fill="white"/>
        <rect x="-28" y="-11" width="56" height="22" fill="url(#b9g)"/>
        <circle r="28" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="1"/>
        <circle r="14" fill="white" opacity=".95"/>
        <text x="0" y="5" text-anchor="middle" font-family="Oswald,sans-serif" font-size="13" font-weight="700" fill="#333">9</text>
        <circle r="28" fill="none" stroke="rgba(200,146,10,.4)" stroke-width="1.5"/>
      </g>

      <!-- fade links en rechts -->
      <rect width="200" height="110" fill="url(#lfade)"/>
      <rect x="760" width="200" height="110" fill="url(#rfade)"/>
      <defs>
        <linearGradient id="lfade"><stop offset="0%" stop-color="#0d1f12" stop-opacity="1"/><stop offset="100%" stop-color="#0d1f12" stop-opacity="0"/></linearGradient>
        <linearGradient id="rfade" x1="0" x2="1"><stop offset="0%" stop-color="#0d1f12" stop-opacity="0"/><stop offset="100%" stop-color="#0d1f12" stop-opacity="1"/></linearGradient>
      </defs>
    </svg>
  </div>

  <div class="header-inner">
    <div class="header-label">Pool Biljart &nbsp;·&nbsp; 9-Ball</div>
    <h1>World <em>Pool</em><br>Dashboard</h1>
    <div class="header-meta">
      <span class="live-pill"><span class="live-dot"></span>Live data</span>
      <a class="source-link" href="https://wpapool.com/rankings/" target="_blank">wpapool.com ↗</a>
    </div>
  </div>
</header>

<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showTab('rankings',this)">Rankings</button>
    <button class="nav-btn" onclick="showTab('toernooien',this)">Toernooien</button>
    <button class="nav-btn" onclick="showTab('weetjes',this)">Weetjes</button>
    <button class="nav-btn" onclick="showTab('hof',this)">Hall of Fame</button>
  </div>
</nav>

<main>

  <!-- RANKINGS -->
  <div id="tab-rankings" class="section active">
    <div class="stat-bar">
      <div class="stat-item"><div class="stat-l">Bron</div><div class="stat-v" style="font-size:.8rem">WPA Officieel</div></div>
      <div class="stat-item"><div class="stat-l">#1 nu</div><div class="stat-v" style="font-size:.85rem" id="stat-num1">🇵🇱 Szewczyk</div></div>
      <div class="stat-item"><div class="stat-l">Spelers</div><div class="stat-v" id="stat-count">42</div></div>
      <div class="stat-item"><div class="stat-l">Stand</div><div class="stat-v" style="font-size:.75rem" id="stat-date">5 mei 2026</div></div>
    </div>
    <div class="refresh-bar">
      <button onclick="fetchRankings()" id="refresh-btn" class="refresh-btn">
        <span id="refresh-icon">↻</span> Ververs rankings
      </button>
      <span id="refresh-status" class="refresh-status"></span>
    </div>

    <div class="search-wrap">
      <span class="search-icon">⌕</span>
      <input type="text" id="rsearch" placeholder="Zoek speler of land..." oninput="filterR(this.value)"/>
    </div>
    <div class="filters" id="nat-filters">
      <button class="fb active" onclick="filterNat('all',this)">Alle landen</button>
      <button class="fb" onclick="filterNat('POL',this)">🇵🇱 Polen</button>
      <button class="fb" onclick="filterNat('PHI',this)">🇵🇭 Filipijnen</button>
      <button class="fb" onclick="filterNat('GER',this)">🇩🇪 Duitsland</button>
      <button class="fb" onclick="filterNat('AUT',this)">🇦🇹 Oostenrijk</button>
      <button class="fb" onclick="filterNat('TPE',this)">🇹🇼 Taiwan</button>
      <button class="fb" onclick="filterNat('USA',this)">🇺🇸 USA</button>
    </div>

    <table class="rank-table" id="rtable">
      <thead><tr>
        <th>#</th>
        <th>Speler</th>
        <th>Land</th>
        <th>Punten</th>
      </tr></thead>
      <tbody id="r-body"></tbody>
    </table>
  </div>

  <!-- TOERNOOIEN -->
  <div id="tab-toernooien" class="section">
    <div class="filters">
      <button class="fb active" onclick="filterT('all',this)">Alle</button>
      <button class="fb" onclick="filterT('WC',this)">Wereldkampioenschappen</button>
      <button class="fb" onclick="filterT('ET',this)">Euro Tour</button>
      <button class="fb" onclick="filterT('MC',this)">Mosconi Cup</button>
    </div>
    <div class="t-grid" id="t-list"></div>
  </div>

  <!-- WEETJES -->
  <div id="tab-weetjes" class="section">
    <button class="w-add" onclick="toggleW()">+ Weetje toevoegen</button>
    <div class="w-form" id="wform">
      <div class="w-form-row">
        <input type="text" id="w-titel" placeholder="Titel"/>
        <input type="text" id="w-speler" placeholder="Speler"/>
      </div>
      <textarea id="w-tekst" placeholder="Beschrijving van de prestatie..."></textarea>
      <button class="btn-save" onclick="saveW()">Opslaan</button>
      <button class="btn-cancel" onclick="toggleW()">Annuleren</button>
    </div>
    <div class="w-grid" id="w-list"></div>
  </div>

  <!-- HALL OF FAME -->
  <div id="tab-hof" class="section">
    <div class="hof-grid" id="hof-list"></div>
  </div>

</main>

<footer style="text-align:center;padding:2rem;font-family:var(--mono);font-size:.6rem;color:#aaa;border-top:1px solid var(--chalk)">
  Rankings: <a href="https://wpapool.com/rankings/" style="color:#888">WPA World Pool Association</a> — 5 mei 2026 &nbsp;·&nbsp; Fargo &amp; AZ data volgt zodra beschikbaar
</footer>

<script>
const FL={POL:'🇵🇱',PHI:'🇵🇭',AIN:'🏳️',GRE:'🇬🇷',SGP:'🇸🇬',JPN:'🇯🇵',ESP:'🇪🇸',AUT:'🇦🇹',GER:'🇩🇪',NED:'🇳🇱',EST:'🇪🇪',KUW:'🇰🇼',TPE:'🇹🇼',HUN:'🇭🇺',HKG:'🇭🇰',USA:'🇺🇸',FIN:'🇫🇮',PER:'🇵🇪',GBR:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',FRA:'🇫🇷',CAN:'🇨🇦',ALB:'🇦🇱'};
const AVC={POL:{bg:'#dbeafe',c:'#1e3a8a'},PHI:{bg:'#dcfce7',c:'#14532d'},GER:{bg:'#fef3c7',c:'#78350f'},AUT:{bg:'#fce7f3',c:'#831843'},ESP:{bg:'#fee2e2',c:'#7f1d1d'},GRE:{bg:'#ede9fe',c:'#3b0764'},NED:{bg:'#dcfce7',c:'#064e3b'},JPN:{bg:'#fef2f2',c:'#7f1d1d'},SGP:{bg:'#f0fdf4',c:'#052e16'},USA:{bg:'#fef3c7',c:'#713f12'},TPE:{bg:'#dbeafe',c:'#1e3a8a'},GBR:{bg:'#ede9fe',c:'#2e1065'},HKG:{bg:'#fef2f2',c:'#7f1d1d'},EST:{bg:'#dbeafe',c:'#1e3a8a'},FIN:{bg:'#dcfce7',c:'#052e16'},PER:{bg:'#fef3c7',c:'#713f12'},FRA:{bg:'#dbeafe',c:'#1e3a8a'},CAN:{bg:'#fee2e2',c:'#7f1d1d'},HUN:{bg:'#dcfce7',c:'#052e16'},ALB:{bg:'#fee2e2',c:'#7f1d1d'},default:{bg:'#f3f4f6',c:'#374151'}};

// WPA Men's World Ranking — 5 mei 2026
// Ranks 1-42: EXACT van wpapool.com. Ranks 43+: niet opgenomen (onvoldoende data).
const WPA=[
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

function flag(c){return FL[c]||'🌍'}
function av(c){return AVC[c]||AVC.default}
function ini(n){return n.split(',').map(s=>s.trim()[0]).join('').slice(0,2).toUpperCase()}

let natF='all';
function renderR(list){
  const tbody=document.getElementById('r-body');
  if(!list.length){tbody.innerHTML='<tr><td colspan="4" style="text-align:center;padding:2rem;font-family:var(--mono);font-size:.75rem;color:#aaa">Geen spelers gevonden</td></tr>';return;}
  const a=av;
  tbody.innerHTML=list.map(p=>{
    const rc=p.r===1?'r1':p.r===2?'r2':p.r===3?'r3':'';
    const col=a(p.c);
    return `<tr>
      <td class="${rc}">${p.r}</td>
      <td><div class="player-cell">
        <div class="av" style="background:${col.bg};color:${col.c}">${ini(p.n)}</div>
        <div><div class="pname">${p.n}</div></div>
      </div></td>
      <td style="font-family:var(--mono);font-size:.7rem;color:#666">${flag(p.c)} ${p.c}</td>
      <td class="pts-cell">${p.pts.toLocaleString('nl-NL')}</td>
    </tr>`;
  }).join('')
  + `<tr class="note-row"><td>—</td><td colspan="3">Ranks 43–50 niet opgenomen — onvoldoende geverifieerde data</td></tr>`;
}
function filterR(q){
  let l=natF==='all'?WPA:WPA.filter(p=>p.c===natF);
  if(q)l=l.filter(p=>p.n.toLowerCase().includes(q.toLowerCase())||p.c.toLowerCase().includes(q.toLowerCase()));
  renderR(l);
}
function filterNat(n,btn){
  natF=n;
  document.querySelectorAll('#nat-filters .fb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  filterR(document.getElementById('rsearch').value||'');
}

const TOURN=[
  // WERELDKAMPIOENSCHAPPEN
  {naam:'WPA World 9-Ball Championship 2025',type:'WC',loc:'Jeddah, Saudi-Arabië',per:'21–26 juli 2025',
   desc:'Winnaar: Carlo Biado (PHI). Georganiseerd door Matchroom & WPA. 128 spelers, prijs­geld $1.000.000. Race to 9 in de groepsfase, race to 11 in de knock-outfase, race to 15 in de finale.'},
  {naam:'Yalin WPA Men\'s 8-Ball World Championship 2025',type:'WC',loc:'Bali, Indonesië',per:'2025',
   desc:'Winnaar: Albin Ouschan (AUT). Zijn tweede wereldtitel na 2021. Gespeeld in Bali.'},
  {naam:'Predator Pro Billiard Series – WPA Teams 10-Ball World Championship',type:'WC',loc:'Las Vegas, USA',per:'24–27 feb 2026',
   desc:'Team 10-ball WK onderdeel van de PBS Las Vegas 2026. Gespeeld naast het Men\'s en Women\'s Open.'},
  {naam:'US Open 9-Ball Championship',type:'WC',loc:'Atlantic City, NJ, USA',per:'Oktober jaarlijks',
   desc:'Oudste open toernooi ter wereld, opgericht 1976. Ko Pin Chung potte hier 99 ballen op rij — tot op heden ongeëvenaard in officieel toernooispel.'},
  // MOSCONI CUP
  {naam:'Mosconi Cup',type:'MC',loc:'Wisselt (London / Las Vegas)',per:'December jaarlijks',
   desc:'Europa vs. USA teamcompetitie — het meest emotionele event in pool. Ryder Cup-sfeer, 5 man per team. Opgericht 1994. Europa domineert de recente edities.'},
  // WNT / PRO TOUR
  {naam:'WNT Legends – Manila',type:'ET',loc:'Manila, Filipijnen',per:'22–24 jan 2026',
   desc:'Matchroom World Nineball Tour event. Elite invitational met de wereldtop. Onderdeel van de WPA ranking 2026.'},
  {naam:'Premier League Pool 2026',type:'ET',loc:'Miami, Florida, USA',per:'18–22 feb 2026',
   desc:'Matchroom WNT event. Round-robin format met de top 8 spelers ter wereld. Hoge kijkcijfers via Sky Sports en DAZN.'},
  {naam:'Predator Pro Billiard Series – Las Vegas 2026',type:'ET',loc:'Las Vegas, USA',per:'18 feb – 27 feb 2026',
   desc:'Groot multi-discipline event: Men\'s Open 10-ball (18–23 feb), Women\'s Open 10-ball (19–23 feb), Junior Open en Teams WK (24–27 feb). Aloysius Yapp won het Men\'s Open.'},
  {naam:'Pattaya Open 2026',type:'ET',loc:'Pattaya, Thailand',per:'2–6 maart 2026',
   desc:'WNT ranking event in Azië. Sterk Aziatisch en Filipijns deelnemersveld.'},
  {naam:'Carabao International Open 2026',type:'ET',loc:'Jakarta, Indonesië',per:'4–8 feb 2026',
   desc:'WNT ranking event. Onderdeel van de groeiende Aziatische pool tour.'},
  {naam:'European Championships 2026',type:'ET',loc:'Antalya, Turkije',per:'28 feb – 13 maart 2026',
   desc:'Multi-discipline EK: 9-ball, 10-ball, 14.1 en 8-ball. Sterk Europees veld. Polen dominant met Szewczyk, Maciol, Zielinski en Kural.'},
];

let tF='all';
function renderT(list){
  document.getElementById('t-list').innerHTML=list.map(t=>{
    const bc=t.type==='WC'?'bwc':t.type==='MC'?'bmc':'bet';
    const bl=t.type==='WC'?'WK':t.type==='MC'?'Mosconi Cup':'Euro Tour';
    return `<div class="t-card">
      <div class="t-name">${t.naam}</div>
      <span class="t-badge ${bc}">${bl}</span>
      <div class="t-loc">📍 ${t.loc} &nbsp;·&nbsp; ${t.per}</div>
      <div class="t-desc">${t.desc}</div>
    </div>`;
  }).join('');
}
function filterT(t,btn){
  document.querySelectorAll('#tab-toernooien .fb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderT(t==='all'?TOURN:TOURN.filter(x=>x.type===t));
}

let WD=[
  {t:'99 ballen op rij — Ko Pin Chung',sp:'Ko Pin Chung 🇹🇼',
   txt:'Op het US Open 9-Ball Championship potte Ko Pin Chung 99 opeenvolgende ballen zonder te missen. De zaal viel volledig stil. Tot op heden ongeëvenaard in officieel toernooispel.'},
  {t:'11 runouts op rij — Earl Strickland',sp:'Earl Strickland 🇺🇸',
   txt:'Strickland speelde elf opeenvolgende racks uit in een race-to-11 match — zonder zijn tegenstander ook maar eenmaal aan tafel te laten. Een demonstratie van absolute tafelbeheersing.'},
  {t:'Shane Van Boening: 5× US Open winnaar',sp:'Shane Van Boening 🇺🇸',
   txt:'Van Boening won het US Open 9-Ball Championship vijf keer — een absoluut record. Hij staat ook op 6 nationale 9-ball titels en is de meest dominante Amerikaanse speler van zijn generatie.'},
  {t:'Efren Reyes: WK én Skins Game in één week',sp:'Efren Reyes 🇵🇭',
   txt:'"The Magician" won in 1999 het World 9-Ball Championship én het Skins Game in dezelfde week. Zijn creativiteit en shotmaking zijn in de sport nooit geëvenaard.'},
  {t:'Wojciech Szewczyk: huidig WPA #1',sp:'Wojciech Szewczyk 🇵🇱',
   txt:'De Poolse speler staat per mei 2026 bovenaan de WPA wereldranking — een positie lang gedomineerd door Aziatische spelers. Zijn combinatie van 8-ball, 9-ball en Euro Tour resultaten bracht hem naar de top.'},
  {t:'Fedor Gorst speelt als neutrale sporter',sp:'Fedor Gorst (AIN)',
   txt:'Gorst speelt onder de AIN-vlag (Authorized Individual Neutral) vanwege de Russische sportuitsluiting. Toch won hij in 2025 zowel het WK 9-ball als het WK 10-ball en staat hij WPA #4.'},
];
function renderW(){
  document.getElementById('w-list').innerHTML=WD.map(w=>`
    <div class="w-card">
      <div class="w-title">${w.t}</div>
      <div class="w-text">${w.txt}</div>
      <div class="w-player">— ${w.sp}</div>
    </div>`).join('');
}
function toggleW(){document.getElementById('wform').classList.toggle('open')}
function saveW(){
  const t=document.getElementById('w-titel').value.trim();
  const s=document.getElementById('w-speler').value.trim();
  const x=document.getElementById('w-tekst').value.trim();
  if(!t||!x)return;
  WD.unshift({t,sp:s||'Onbekend',txt:x});
  ['w-titel','w-speler','w-tekst'].forEach(id=>document.getElementById(id).value='');
  toggleW();renderW();
}

const HOF=[
  {n:'Efren Reyes',land:'🇵🇭',era:'1980–heden',
   a:'World 9-Ball (1999), World 8-Ball, US Open meerdere keren. "The Magician" — zijn creativiteit en shotmaking zijn uniek in de sport. Universeel beschouwd als de grootste pool speler aller tijden.'},
  {n:'Earl Strickland',land:'🇺🇸',era:'1985–2010',
   a:'3× US Open, 2× World 9-Ball. Meest explosief talent van zijn generatie. Zijn 11 runouts op rij en zijn dominantie in de jaren 90 zijn legendarisch.'},
  {n:'Shane Van Boening',land:'🇺🇸',era:'2005–heden',
   a:'5× US Open, 6× US National 9-Ball. Technisch meest complete speler van de 21e eeuw. Jarenlang standvastig in de WPA top-5.'},
  {n:'Ko Pin Chung',land:'🇹🇼',era:'2005–heden',
   a:'3× World 9-Ball kampioen. Zijn 99 opeenvolgende ballen op het US Open zijn een onbreekbaar record. Sterkste break in de sport.'},
  {n:'Ralf Souquet',land:'🇩🇪',era:'1990–2015',
   a:'World 9-Ball 1999, meeste Euro Tour titels ooit. "The Kaiser" — Europa\'s dominante speler van zijn tijdperk, ongekende consistentie over twee decennia.'},
  {n:'Thorsten Hohmann',land:'🇩🇪',era:'1998–heden',
   a:'World 9-Ball (2003), World Straight Pool. Meest veelzijdige kampioen — won op alle disciplines.'},
  {n:'Francisco Bustamante',land:'🇵🇭',era:'1995–heden',
   a:'2× World 9-Ball. "Django" — haast onklopbaar in long races. Zijn comeback na jaren middenveld is een van de mooiste verhalen in pool.'},
  {n:'Niels Feijen',land:'🇳🇱',era:'2003–heden',
   a:'World 9-Ball 2014, meerdere Euro Tour titels. Beste Nederlandse pool speler ooit en jarenlang vaste WPA top-10.'},
];
function renderHof(){
  document.getElementById('hof-list').innerHTML=HOF.map((p,i)=>{
    const nc=i===0?'h1':i===1?'h2':i===2?'h3':'';
    return `<div class="hof-card">
      <div class="hof-num ${nc}">${i+1}</div>
      <div><div class="hof-name">${p.land} ${p.n}</div>
      <div class="hof-era">${p.era}</div>
      <div class="hof-text">${p.a}</div></div>
    </div>`;
  }).join('');
}

function showTab(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  btn.classList.add('active');
}

async function fetchRankings(){
  const btn = document.getElementById('refresh-btn');
  const icon = document.getElementById('refresh-icon');
  const status = document.getElementById('refresh-status');
  btn.disabled = true;
  icon.style.display = 'inline-block';
  icon.style.animation = 'spin .8s linear infinite';
  status.textContent = 'Ophalen van wpapool.com…';

  try {
    const res = await fetch('/api/rankings');
    const data = await res.json();

    if (data.players && data.players.length > 0) {
      // Update de globale WPA array
      WPA.length = 0;
      data.players.forEach(p => WPA.push(p));

      // Update stat bar
      const num1 = WPA[0];
      if (num1) {
        document.getElementById('stat-num1').textContent = (flag(num1.c)||'') + ' ' + num1.n.split(',')[0];
      }
      document.getElementById('stat-count').textContent = WPA.length;
      const d = new Date(data.updated);
      document.getElementById('stat-date').textContent = d.toLocaleDateString('nl-NL',{day:'numeric',month:'short',year:'numeric'});

      // Herrender tabel
      natF = 'all';
      document.querySelectorAll('#nat-filters .fb').forEach(b=>b.classList.remove('active'));
      document.querySelector('#nat-filters .fb').classList.add('active');
      renderR(WPA);

      if (data.source === 'live') {
        status.textContent = '✓ Live data — ' + WPA.length + ' spelers geladen';
        status.style.color = '#4ade80';
      } else {
        status.textContent = '⚠ Fallback data — WPA tijdelijk niet bereikbaar';
        status.style.color = '#f59e0b';
      }
    }
  } catch(e) {
    status.textContent = '✗ Fout: ' + e.message;
    status.style.color = '#f87171';
  } finally {
    btn.disabled = false;
    icon.style.animation = '';
  }
}

// Spin animatie voor refresh icon
const style = document.createElement('style');
style.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(style);

renderR(WPA);renderT(TOURN);renderW();renderHof();
</script>
</body>
</html>
