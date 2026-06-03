import os
import json
import random
from flask import Flask, render_template, jsonify, request, session

app = Flask(__name__)
app.secret_key = 'aetheria_secret_key'

# Load Data
def load_data(filename):
    with open(os.path.join('data', filename), 'r') as f:
        return json.load(f)

HEROES = load_data('heroes.json')
ENEMIES = load_data('enemies.json')
STORY = load_data('story.json')

# User State (Mocking a database for now)
user_state = {
    'gems': 1000,
    'gold': 5000,
    'heroes': [], # Owned hero instances {hero_id, stars, level, shards}
    'afk_start': 0,
    'guild_tech': {'atk_boost': 0, 'hp_boost': 0, 'def_boost': 0, 'speed_boost': 0},
    'unlocked_chapter': 1
}

# Helper to get hero by ID
def get_hero(hero_id):
    return next((h for h in HEROES if h['id'] == hero_id), None)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/heroes')
def get_heroes():
    return jsonify(HEROES)

@app.route('/api/summon', methods=['POST'])
def summon():
    count = request.json.get('count', 1)
    results = []
    for _ in range(count):
        roll = random.random() * 100
        if roll < 0.5: rarity = "UR"
        elif roll < 2.0: rarity = "SP"
        elif roll < 7.0: rarity = "Legendary"
        elif roll < 17.0: rarity = "Epic"
        elif roll < 35.0: rarity = "Rare"
        elif roll < 60.0: rarity = "Uncommon"
        else: rarity = "Common"
        
        pool = [h for h in HEROES if h['rarity'] == rarity]
        hero_template = random.choice(pool)
        
        # Check if user already has this hero
        existing = next((h for h in user_state['heroes'] if h['hero_id'] == hero_template['id']), None)
        if existing:
            existing['shards'] += 100 # Duplicate conversion
            results.append({**hero_template, 'is_duplicate': True})
        else:
            new_hero = {
                'hero_id': hero_template['id'],
                'stars': hero_template['base_stars'],
                'level': 1,
                'shards': 0,
                'xp': 0
            }
            user_state['heroes'].append(new_hero)
            results.append({**hero_template, 'is_duplicate': False})
            
    return jsonify(results)

@app.route('/api/afk/claim', methods=['POST'])
def claim_afk():
    # Calculate rewards based on time since last claim
    # For mock purposes, just give a flat reward
    gold_gain = 500
    xp_gain = 200
    user_state['gold'] += gold_gain
    for h in user_state['heroes']:
        h['xp'] += xp_gain
        # Auto-level logic: Level * 100 XP
        while h['xp'] >= h['level'] * 100:
            h['xp'] -= h['level'] * 100
            h['level'] += 1
            
    return jsonify({
        'gold': gold_gain,
        'xp': xp_gain,
        'new_total_gold': user_state['gold']
    })

@app.route('/api/hero/upgrade', methods=['POST'])
def upgrade_hero():
    hero_id = request.json.get('hero_id')
    hero_instance = next((h for h in user_state['heroes'] if h['hero_id'] == hero_id), None)
    if not hero_instance: return jsonify({'error': 'Hero not found'}), 404
    
    # Hybrid shard cost: 50 * (stars - base_stars + 1) + 50
    hero_template = get_hero(hero_id)
    cost = 100 + (hero_instance['stars'] - hero_template['base_stars']) * 50
    
    if hero_instance['shards'] >= cost:
        hero_instance['shards'] -= cost
        hero_instance['stars'] += 1
        return jsonify({'success': True, 'new_stars': hero_instance['stars']})
    return jsonify({'success': False, 'error': 'Not enough shards'})

@app.route('/api/battle/start', methods=['POST'])
def start_battle():
    player_team_ids = request.json.get('team', [])
    chapter = request.json.get('chapter', 'Forest of Whispers')
    
    player_team = [get_hero(hid) for hid in player_team_ids if get_hero(hid)]
    chapter_enemies = [e for e in ENEMIES if e['chapter'] == chapter]
    enemy_team = random.sample(chapter_enemies, min(5, len(chapter_enemies)))
    
    # Initialize battle state
    battle_state = {
        'player_team': player_team,
        'enemy_team': enemy_team,
        'turn': 1,
        'log': ['Battle started!']
    }
    return jsonify(battle_state)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
