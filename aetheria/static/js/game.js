let myHeroes = [];
let allHeroes = [];
let gems = 1000;
let gold = 5000;

// Initialize
let currentChapter = 1;
let userHeroes = [];

async function init() {
    const hResp = await fetch('/api/heroes');
    allHeroes = await hResp.json();
    // Fetch user state (mocked for now, usually from an endpoint)
    updateUI();
}

function applyGlitchEffect() {
    if (currentChapter >= 6) {
        document.body.classList.add('glitch-active');
        setTimeout(() => document.body.classList.remove('glitch-active'), 2000);
    }
}

function showView(viewId) {
    const views = ['lobby', 'battle', 'summon', 'heroes', 'guild'];
    views.forEach(v => {
        const el = document.getElementById(`${v}-view`);
        if (el) el.classList.add('hidden');
    });
    document.getElementById(`${viewId}-view`).classList.remove('hidden');
    
    if (viewId === 'heroes') renderHeroGrid();
}

function updateUI() {
    document.getElementById('gems').innerText = gems;
    document.getElementById('gold').innerText = gold;
}

async function doSummon(count) {
    const cost = count === 10 ? 900 : 100;
    if (gems < cost) {
        alert("Not enough gems!");
        return;
    }
    
    gems -= cost;
    updateUI();
    
    const response = await fetch('/api/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
    });
    
    const results = await response.json();
    // Update local state and merge with template data
    results.forEach(h => {
        const existing = myHeroes.find(mh => mh.id === h.id);
        if (existing) {
            existing.shards = (existing.shards || 0) + 100;
        } else {
            myHeroes.push({
                ...h,
                stars: h.base_stars,
                level: 1,
                shards: 0,
                xp: 0
            });
        }
    });
    
    const resultsDiv = document.getElementById('summon-results');
    resultsDiv.innerHTML = '';
    results.forEach(h => {
        resultsDiv.innerHTML += `
            <div class="card p-2 text-xs">
                <p class="rarity-${h.rarity} font-bold">${h.rarity}</p>
                <p>${h.name}</p>
                <p class="text-gray-500">${h.class}</p>
            </div>
        `;
    });
}

function renderHeroGrid() {
    const grid = document.getElementById('hero-grid');
    document.getElementById('hero-count').innerText = myHeroes.length;
    grid.innerHTML = '';
    
    if (myHeroes.length === 0) {
        grid.innerHTML = '<p class="col-span-4 text-center text-gray-500 py-8">No heroes yet. Go to the Summon screen!</p>';
        return;
    }

    myHeroes.forEach(h => {
        const shardsNeeded = 100 + (h.stars - h.base_stars) * 50;
        grid.innerHTML += `
            <div class="card p-4 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start">
                        <p class="rarity-${h.rarity} text-xs font-bold">${h.rarity}</p>
                        <p class="text-amber-400 text-xs">${h.stars || h.base_stars}★</p>
                    </div>
                    <h4 class="font-bold">${h.name}</h4>
                    <p class="text-xs text-gray-400">${h.class} | ${h.faction}</p>
                    <div class="mt-2 text-[10px] text-gray-500">
                        LVL: ${h.level || 1} / ${(h.stars || h.base_stars) * 20}
                    </div>
                </div>
                <div class="mt-4">
                    <div class="w-full bg-gray-800 h-1 rounded-full mb-1">
                        <div class="bg-indigo-500 h-1 rounded-full" style="width: ${Math.min(100, (h.shards || 0) / shardsNeeded * 100)}%"></div>
                    </div>
                    <p class="text-[9px] text-right mb-2">${h.shards || 0}/${shardsNeeded} Shards</p>
                    <button onclick="upgradeHero(${h.id})" class="w-full text-[10px] py-1 bg-indigo-600 rounded hover:bg-indigo-500">UPGRADE</button>
                </div>
            </div>
        `;
    });
}

async function claimAFK() {
    const response = await fetch('/api/afk/claim', { method: 'POST' });
    const result = await response.json();
    gold = result.new_total_gold;
    updateUI();
    alert(`Claimed ${result.gold} Gold and ${result.xp} XP for all heroes!`);
    // Re-sync local hero data if needed
}

async function upgradeHero(heroId) {
    const response = await fetch('/api/hero/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_id: heroId })
    });
    const result = await response.json();
    if (result.success) {
        const hero = myHeroes.find(h => h.id === heroId);
        const shardsNeeded = 100 + (hero.stars - hero.base_stars) * 50;
        hero.shards -= shardsNeeded;
        hero.stars = result.new_stars;
        renderHeroGrid();
    } else {
        alert(result.error);
    }
}

async function startBattle() {
    if (myHeroes.length === 0) {
        alert("You need heroes to fight! Go to Summon first.");
        return;
    }

    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = true;
    startBtn.innerText = "BATTLE IN PROGRESS...";

    const team = myHeroes.slice(0, 5).map(h => h.id);
    const response = await fetch('/api/battle/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team, chapter: 'Forest of Whispers' })
    });
    
    const state = await response.json();
    
    // Render teams
    const pUnits = document.getElementById('player-units');
    pUnits.innerHTML = state.player_team.map(h => `<div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-[10px]" title="${h.name}">${h.name[0]}</div>`).join('');
    
    const eUnits = document.getElementById('enemy-units');
    eUnits.innerHTML = state.enemy_team.map(e => `<div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-[10px]" title="${e.name}">${e.name[0]}</div>`).join('');

    // Simulate turns with Focus Targeting logic
    const log = document.getElementById('battle-log');
    log.innerHTML = '<div><i>System: All heroes focusing on the first enemy by default.</i></div>';
    
    let focusTargetIndex = 0; // Default focus on the first enemy
    
    for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 800));
        const attacker = state.player_team[i % state.player_team.length];
        
        // Target logic: Focus Target first, then random
        let target = state.enemy_team[focusTargetIndex];
        if (!target) target = state.enemy_team[Math.floor(Math.random() * state.enemy_team.length)];
        
        const dmg = Math.floor(attacker.base_stats.Attack * (0.9 + Math.random() * 0.2));
        
        log.innerHTML += `<div>Turn ${i+1}: <span class="text-indigo-400">${attacker.name}</span> uses <span class="text-indigo-200">Basic Attack</span> on <span class="text-red-400">${target.name}</span> for ${dmg} damage!</div>`;
        
        // Small chance for a skill
        if (Math.random() > 0.7) {
            log.innerHTML += `<div class="text-xs text-indigo-300 ml-4">✨ ${attacker.name} activated a special skill!</div>`;
        }
        
        log.scrollTop = log.scrollHeight;
    }

    await new Promise(r => setTimeout(r, 800));
    const win = Math.random() > 0.3;
    if (win) {
        log.innerHTML += `<div class="text-green-400 font-bold mt-2">VICTORY! You gained 100 Gold and 50 XP.</div>`;
        gold += 100;
        updateUI();
    } else {
        log.innerHTML += `<div class="text-red-400 font-bold mt-2">DEFEAT! The Void was too strong this time.</div>`;
    }
    
    startBtn.disabled = false;
    startBtn.innerText = "START BATTLE";
}

init();
