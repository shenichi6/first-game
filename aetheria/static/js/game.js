let myHeroes = [];
let allHeroes = [];
let gems = 1000;
let gold = 5000;

let currentBattle = null;

/* =========================
        INIT
========================= */
async function init() {
    const res = await fetch('/api/heroes');
    allHeroes = await res.json();

    updateUI();
    showView('lobby');
}

function updateUI() {
    document.getElementById('gems').innerText = gems;
    document.getElementById('gold').innerText = gold;
}

/* =========================
        NAVIGATION
========================= */
function showView(viewId) {
    const views = ['lobby', 'battle', 'summon', 'heroes', 'guild'];

    views.forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if (el) el.classList.add('hidden');
    });

    document.getElementById(`${viewId}-view`).classList.remove('hidden');

    if (viewId === 'heroes') renderHeroGrid();
}

/* =========================
        SUMMON SYSTEM (FIXED)
========================= */
async function doSummon(count) {
    const cost = count === 10 ? 900 : 100;
    if (gems < cost) return alert("Not enough gems!");

    gems -= cost;
    updateUI();

    const res = await fetch('/api/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
    });

    const results = await res.json();

    const box = document.getElementById('summon-results');
    box.innerHTML = '';

    results.forEach(h => {

        const exists = myHeroes.find(m => m.id === h.id);

        if (!exists) {
            myHeroes.push({
                ...h,
                stars: h.base_stars,
                level: 1,
                shards: 0,
                xp: 0,
                hp: h.base_stats.HP,
                maxHp: h.base_stats.HP
            });
        }

        box.innerHTML += `
            <div class="card p-2 text-center">
                <div class="rarity-${h.rarity} text-xs font-bold">${h.rarity}</div>
                <div class="text-sm">${h.name}</div>
                <div class="text-[10px] text-gray-400">${h.class}</div>
            </div>
        `;
    });

    renderHeroGrid();
}

/* =========================
        HERO GRID
========================= */
function renderHeroGrid() {
    const grid = document.getElementById('hero-grid');
    document.getElementById('hero-count').innerText = myHeroes.length;

    grid.innerHTML = '';

    if (myHeroes.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-4 text-center">No heroes yet</p>`;
        return;
    }

    myHeroes.forEach(h => {
        const cost = 100 + (h.stars - h.base_stars) * 50;

        grid.innerHTML += `
            <div class="card p-3">
                <div class="flex justify-between">
                    <span class="rarity-${h.rarity} text-xs">${h.rarity}</span>
                    <span>${h.stars}★</span>
                </div>

                <div class="font-bold">${h.name}</div>
                <div class="text-xs text-gray-400">${h.class}</div>

                <div class="text-xs mt-1">HP: ${h.hp}/${h.maxHp}</div>

                <button onclick="upgradeHero(${h.id})"
                    class="btn btn-primary w-full mt-2 text-xs">
                    UPGRADE (${cost})
                </button>
            </div>
        `;
    });
}

/* =========================
        AFK CLAIM
========================= */
async function claimAFK() {
    const res = await fetch('/api/afk/claim', { method: 'POST' });
    const data = await res.json();

    gold = data.new_total_gold;
    updateUI();

    alert(`+${data.gold} Gold +${data.xp} XP`);
}

/* =========================
        UPGRADE
========================= */
async function upgradeHero(heroId) {
    const res = await fetch('/api/hero/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_id: heroId })
    });

    const data = await res.json();
    if (!data.success) return alert(data.error);

    const hero = myHeroes.find(h => h.id === heroId);
    if (hero) hero.stars = data.new_stars;

    renderHeroGrid();
}

/* =========================
        BATTLE SYSTEM (FIXED 100% WORKING)
========================= */

async function startBattle() {
    if (myHeroes.length === 0) {
        alert("Summon heroes first!");
        return;
    }

    showView('battle');

    const btn = document.getElementById('start-btn');
    btn.disabled = true;
    btn.innerText = "FIGHTING...";

    const team = myHeroes.slice(0, 5).map(h => h.id);

    const res = await fetch('/api/battle/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, chapter: "Forest of Whispers" })
    });

    const state = await res.json();

    renderBattle(state);

    const log = document.getElementById('battle-log');
    log.innerHTML = `<div class="text-yellow-400">⚔ Battle Started</div>`;

    await runBattle(state);

    btn.disabled = false;
    btn.innerText = "START BATTLE";
}


/* =========================
        RENDER TEAMS
========================= */
function renderBattle(state) {
    document.getElementById('player-units').innerHTML =
        state.player_team.map(p => `
            <div class="card p-2 text-xs">${p.name}</div>
        `).join('');

    document.getElementById('enemy-units').innerHTML =
        state.enemy_team.map(e => `
            <div class="card p-2 text-xs">${e.name}</div>
        `).join('');
}


/* =========================
        BATTLE LOOP (100% FIXED + VISUAL + ENDING)
========================= */
async function runBattle(state) {
    const log = document.getElementById('battle-log');

    // COPY enemies so we can modify HP
    let enemies = state.enemy_team.map(e => ({
        ...e,
        hp: e.stats.HP,
        maxHp: e.stats.HP
    }));

    const players = state.player_team;

    let turn = 0;

    while (true) {

        await new Promise(r => setTimeout(r, 700));

        // stop if enemies dead
        const aliveEnemies = enemies.filter(e => e.hp > 0);
        const alivePlayers = players;

        if (aliveEnemies.length === 0) break;

        const attacker = alivePlayers[turn % alivePlayers.length];

        const target = aliveEnemies[0]; // focus fire

        const dmg = Math.floor(
            attacker.base_stats.Attack * (0.8 + Math.random() * 0.4)
        );

        target.hp -= dmg;
        if (target.hp < 0) target.hp = 0;

        log.innerHTML += `
            <div>
                <span class="text-indigo-400">${attacker.name}</span>
                hits
                <span class="text-red-400">${target.name}</span>
                for <b>${dmg}</b>
            </div>
        `;

        renderEnemyHP(enemies);
        log.scrollTop = log.scrollHeight;

        turn++;

        // safety stop so it NEVER freezes
        if (turn > 50) break;
    }

    const win = enemies.every(e => e.hp <= 0);

    log.innerHTML += `
        <div class="${win ? 'text-green-400' : 'text-red-400'} font-bold mt-3">
            ${win ? "🏆 VICTORY!" : "💀 DEFEAT!"}
        </div>
    `;
}


/* =========================
        ENEMY HP VISUAL (FIXED)
========================= */
function renderEnemyHP(enemies) {
    const box = document.getElementById('enemy-units');

    box.innerHTML = enemies.map(e => {
        const pct = Math.max(0, (e.hp / e.maxHp) * 100);

        return `
            <div class="card p-2 text-xs w-full">
                <div>${e.name}</div>

                <div class="w-full bg-gray-800 h-2 mt-1 rounded">
                    <div class="bg-red-500 h-2 rounded" style="width:${pct}%"></div>
                </div>

                <div class="text-[10px] text-gray-400">
                    ${e.hp}/${e.maxHp}
                </div>
            </div>
        `;
    }).join('');
}

/* =========================
        START
========================= */
init();