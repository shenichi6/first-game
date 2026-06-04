let allHeroes = [];
let myHeroes = [];
let gems = 1000;
let gold = 5000;

let currentBattle = null;

// =========================
// INIT
// =========================
async function init() {
    const res = await fetch('/api/heroes');
    allHeroes = await res.json();
    updateUI();
}

function updateUI() {
    document.getElementById("gems").innerText = gems;
    document.getElementById("gold").innerText = gold;
}

// =========================
// NAVIGATION
// =========================
function showView(view) {
    const views = ["lobby", "battle", "summon", "heroes", "guild"];

    views.forEach(v => {
        document.getElementById(v + "-view").classList.add("hidden");
    });

    document.getElementById(view + "-view").classList.remove("hidden");

    if (view === "heroes") renderHeroes();
}

// =========================
// SUMMON SYSTEM
// =========================
async function doSummon(count) {
    const cost = count === 10 ? 900 : 100;

    if (gems < cost) {
        alert("Not enough gems!");
        return;
    }

    gems -= cost;
    updateUI();

    const res = await fetch('/api/summon', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({count})
    });

    const results = await res.json();

    const container = document.getElementById("summon-results");
    container.innerHTML = "";

    results.forEach(hero => {
        container.innerHTML += `
            <div class="card p-2 text-center">
                <div class="rarity-${hero.rarity} font-bold">${hero.rarity}</div>
                <div>${hero.name}</div>
                <div class="text-xs text-gray-400">${hero.class}</div>
            </div>
        `;
    });
}

// =========================
// HERO GRID
// =========================
function renderHeroes() {
    const grid = document.getElementById("hero-grid");
    grid.innerHTML = "";

    if (myHeroes.length === 0) {
        grid.innerHTML = `<p class="text-gray-400 col-span-4 text-center">No heroes yet</p>`;
        return;
    }

    myHeroes.forEach(hero => {
        grid.innerHTML += `
            <div class="card p-3 hero-card">
                <div class="rarity-${hero.rarity} text-xs">${hero.rarity}</div>
                <div class="font-bold">${hero.name}</div>
                <div class="text-xs text-gray-400">${hero.class}</div>
                <div class="text-xs mt-2">LVL ${hero.level}</div>
            </div>
        `;
    });
}

// =========================
// ADD HERO TO COLLECTION
// =========================
function addHero(heroTemplate) {
    let existing = myHeroes.find(h => h.id === heroTemplate.id);

    if (existing) return;

    myHeroes.push({
        ...heroTemplate,
        level: 1,
        stars: heroTemplate.base_stars
    });
}

// =========================
// START BATTLE
// =========================
async function startBattle() {
    if (myHeroes.length === 0) {
        alert("You need heroes!");
        return;
    }

    const team = myHeroes.slice(0, 5).map(h => h.id);

    const res = await fetch("/api/battle/start", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            team,
            chapter: "Forest of Whispers"
        })
    });

    const data = await res.json();
    currentBattle = data;

    renderBattle(data);
}

// =========================
// RENDER BATTLEFIELD
// =========================
function renderBattle(data) {
    const playerBox = document.getElementById("player-units");
    const enemyBox = document.getElementById("enemy-units");
    const log = document.getElementById("battle-log");

    playerBox.innerHTML = "";
    enemyBox.innerHTML = "";
    log.innerHTML = "";

    data.player_team.forEach((h, i) => {
        playerBox.innerHTML += `
            <div class="battle-unit player-unit" id="p-${i}">
                ${h.name[0]}
            </div>
        `;
    });

    data.enemy_team.forEach((e, i) => {
        enemyBox.innerHTML += `
            <div class="battle-unit enemy-unit" id="e-${i}">
                ${e.name[0]}
            </div>
        `;
    });

    log.innerHTML = `<div class="text-gray-400">Battle Started...</div>`;

    runBattleAnimation(data);
}

// =========================
// BATTLE ANIMATION ENGINE
// =========================
async function runBattleAnimation(data) {
    const log = document.getElementById("battle-log");

    let playerAlive = [...data.player_team];
    let enemyAlive = [...data.enemy_team];

    let round = 0;

    while (playerAlive.length > 0 && enemyAlive.length > 0 && round < 10) {

        await delay(700);

        let attackerGroup = Math.random() > 0.5 ? playerAlive : enemyAlive;
        let targetGroup = attackerGroup === playerAlive ? enemyAlive : playerAlive;

        let attacker = attackerGroup[Math.floor(Math.random() * attackerGroup.length)];
        let target = targetGroup[Math.floor(Math.random() * targetGroup.length)];

        let dmg = Math.floor(attacker.attack * (0.8 + Math.random() * 0.4));

        target.hp -= dmg;

        log.innerHTML += `
            <div>
                <span class="text-indigo-400">${attacker.name}</span>
                hits
                <span class="text-red-400">${target.name}</span>
                for ${dmg}
            </div>
        `;

        // death check
        if (target.hp <= 0) {
            targetGroup.splice(targetGroup.indexOf(target), 1);

            log.innerHTML += `
                <div class="text-red-500 text-xs">${target.name} was defeated!</div>
            `;
        }

        log.scrollTop = log.scrollHeight;
        round++;
    }

    await delay(500);

    if (playerAlive.length > 0) {
        log.innerHTML += `<div class="text-green-400 font-bold">VICTORY!</div>`;
    } else {
        log.innerHTML += `<div class="text-red-400 font-bold">DEFEAT!</div>`;
    }
}

// =========================
// HELPERS
// =========================
function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// =========================
// CLAIM AFK
// =========================
async function claimAFK() {
    const res = await fetch("/api/afk/claim", {method: "POST"});
    const data = await res.json();

    gold = data.new_total_gold;
    updateUI();

    alert(`+${data.gold} Gold, +${data.xp} XP`);
}

// =========================
// INIT GAME
// =========================
init();