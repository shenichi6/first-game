import os
import json
import random
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)
app.secret_key = "aetheria_secret_key"

# =========================
# FILE PATHS
# =========================
DATA_DIR = "data"
USER_STATE_FILE = os.path.join(DATA_DIR, "user_state.json")

# =========================
# LOAD GAME DATA
# =========================
def load_json(filename):
    with open(os.path.join(DATA_DIR, filename), "r") as f:
        return json.load(f)

HEROES = load_json("heroes.json")
ENEMIES = load_json("enemies.json")
STORY = load_json("story.json")


# =========================
# USER STATE SYSTEM
# =========================
def load_user_state():
    if not os.path.exists(USER_STATE_FILE):
        default = {
            "gems": 1000,
            "gold": 5000,
            "unlocked_chapter": 1,
            "heroes": [],
            "guild_tech": {
                "atk_boost": 0,
                "hp_boost": 0,
                "def_boost": 0,
                "speed_boost": 0
            }
        }
        save_user_state(default)
        return default

    with open(USER_STATE_FILE, "r") as f:
        return json.load(f)


def save_user_state(state):
    with open(USER_STATE_FILE, "w") as f:
        json.dump(state, f, indent=4)


user_state = load_user_state()


# =========================
# HERO HELPERS
# =========================
def get_hero_template(hero_id):
    return next((h for h in HEROES if h["id"] == hero_id), None)


def build_fighter(hero_template, instance):
    stats = hero_template["base_stats"]

    return {
        "id": hero_template["id"],
        "name": hero_template["name"],
        "rarity": hero_template["rarity"],

        "max_hp": stats["HP"],
        "hp": stats["HP"],

        "attack": stats["Attack"],
        "defense": stats["Defense"],
        "speed": stats["Speed"],

        "crit_rate": stats["CritRate"],
        "crit_damage": stats["CritDamage"],

        "energy": 0,
        "alive": True,

        "stars": instance["stars"],
        "level": instance["level"]
    }


# =========================
# ROUTES
# =========================
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/heroes")
def api_heroes():
    return jsonify(HEROES)


@app.route("/api/user")
def api_user():
    return jsonify(user_state)


# =========================
# SUMMON SYSTEM
# =========================
@app.route("/api/summon", methods=["POST"])
def summon():
    global user_state

    count = request.json.get("count", 1)
    results = []

    for _ in range(count):
        roll = random.random() * 100

        if roll < 0.5:
            rarity = "UR"
        elif roll < 2:
            rarity = "SP"
        elif roll < 7:
            rarity = "Legendary"
        elif roll < 17:
            rarity = "Epic"
        elif roll < 35:
            rarity = "Rare"
        elif roll < 60:
            rarity = "Uncommon"
        else:
            rarity = "Common"

        pool = [h for h in HEROES if h["rarity"] == rarity]
        hero = random.choice(pool)

        existing = next(
            (h for h in user_state["heroes"] if h["hero_id"] == hero["id"]),
            None
        )

        if existing:
            existing["shards"] += 100
        else:
            user_state["heroes"].append({
                "hero_id": hero["id"],
                "stars": hero["base_stars"],
                "level": 1,
                "shards": 0
            })

        results.append(hero)

    save_user_state(user_state)
    return jsonify(results)


# =========================
# AFK CLAIM
# =========================
@app.route("/api/afk/claim", methods=["POST"])
def afk_claim():
    global user_state

    gold_gain = 500
    xp_gain = 200

    user_state["gold"] += gold_gain

    for h in user_state["heroes"]:
        h["xp"] = h.get("xp", 0) + xp_gain
        h["level"] = h.get("level", 1)

        while h["xp"] >= h["level"] * 100:
            h["xp"] -= h["level"] * 100
            h["level"] += 1

    save_user_state(user_state)

    return jsonify({
        "gold": gold_gain,
        "xp": xp_gain,
        "new_total_gold": user_state["gold"]
    })


# =========================
# HERO UPGRADE
# =========================
@app.route("/api/hero/upgrade", methods=["POST"])
def upgrade_hero():
    global user_state

    hero_id = request.json.get("hero_id")

    instance = next(
        (h for h in user_state["heroes"] if h["hero_id"] == hero_id),
        None
    )

    if not instance:
        return jsonify({"error": "Hero not found"}), 404

    template = get_hero_template(hero_id)

    cost = 100 + (instance["stars"] - template["base_stars"]) * 50

    if instance["shards"] >= cost:
        instance["shards"] -= cost
        instance["stars"] += 1
        save_user_state(user_state)
        return jsonify({"success": True, "new_stars": instance["stars"]})

    return jsonify({"success": False, "error": "Not enough shards"})


# =========================
# BATTLE SYSTEM (AFK ARENA STYLE)
# =========================
@app.route("/api/battle/start", methods=["POST"])
def battle_start():
    global user_state

    team_ids = request.json.get("team", [])
    chapter = request.json.get("chapter", "Forest of Whispers")

    # Build player team
    player_team = []
    for hid in team_ids:
        template = get_hero_template(hid)
        instance = next(
            (h for h in user_state["heroes"] if h["hero_id"] == hid),
            None
        )
        if template and instance:
            player_team.append(build_fighter(template, instance))

    # Enemy team
    chapter_enemies = [e for e in ENEMIES if e["chapter"] == chapter]
    enemy_team_raw = random.sample(chapter_enemies, min(5, len(chapter_enemies)))

    enemy_team = []
    for e in enemy_team_raw:
        enemy_team.append({
            "id": e["id"],
            "name": e["name"],
            "hp": e["stats"]["HP"],
            "max_hp": e["stats"]["HP"],
            "attack": e["stats"]["Attack"],
            "defense": e["stats"]["Defense"],
            "speed": 80,
            "energy": 0,
            "alive": True
        })

    # Simulate quick battle (backend decides result)
    log = []

    round_num = 1
    while round_num <= 10 and any(p["alive"] for p in player_team) and any(e["alive"] for e in enemy_team):

        all_units = [*player_team, *enemy_team]
        all_units = sorted(all_units, key=lambda x: x["speed"], reverse=True)

        for unit in all_units:
            if not unit["alive"]:
                continue

            if unit in player_team:
                targets = [e for e in enemy_team if e["alive"]]
            else:
                targets = [p for p in player_team if p["alive"]]

            if not targets:
                continue

            target = random.choice(targets)

            dmg = max(10, unit["attack"] - target["defense"])

            target["hp"] -= dmg

            log.append(f"{unit['name']} hits {target['name']} for {dmg}")

            if target["hp"] <= 0:
                target["alive"] = False
                target["hp"] = 0
                log.append(f"{target['name']} died!")

        round_num += 1

    player_alive = any(p["alive"] for p in player_team)
    enemy_alive = any(e["alive"] for e in enemy_team)

    result = "win" if player_alive else "lose"

    if result == "win":
        user_state["gold"] += 200
        save_user_state(user_state)

    return jsonify({
        "result": result,
        "player_team": player_team,
        "enemy_team": enemy_team,
        "log": log
    })


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True, port=5000)