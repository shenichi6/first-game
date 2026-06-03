import json

heroes = [
    {"id": 1, "name": "Rowan", "rarity": "Common", "class": "DPS", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 2, "name": "Brak", "rarity": "Common", "class": "Tank", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 3, "name": "Elowen", "rarity": "Uncommon", "class": "Healer", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 4, "name": "Thorn", "rarity": "Rare", "class": "Assassin", "faction": "Shadow Rogues", "origin": "Forest of Whispers"},
    {"id": 5, "name": "Sylvara", "rarity": "Rare", "class": "Controller", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 6, "name": "Fenric", "rarity": "Rare", "class": "DPS", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 7, "name": "Ardan", "rarity": "Epic", "class": "Tank", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 8, "name": "Liora", "rarity": "Epic", "class": "Support", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 9, "name": "Elaris", "rarity": "Legendary", "class": "Controller", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 10, "name": "Elder Oakheart", "rarity": "Legendary", "class": "Tank", "faction": "Wildkin Shamans", "origin": "Forest of Whispers"},
    {"id": 11, "name": "Caelum", "rarity": "Rare", "class": "DPS", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 12, "name": "Selene", "rarity": "Rare", "class": "Controller", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 13, "name": "Voss", "rarity": "Epic", "class": "Tank", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 14, "name": "Aria", "rarity": "Epic", "class": "Healer", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 15, "name": "Lucian", "rarity": "Legendary", "class": "DPS", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 16, "name": "Crystal Queen Seraphine", "rarity": "Legendary", "class": "Controller", "faction": "Arcane Mages", "origin": "Crystal Caverns"},
    {"id": 17, "name": "Vulkar", "rarity": "Rare", "class": "Tank", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 18, "name": "Ember", "rarity": "Rare", "class": "DPS", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 19, "name": "Pyra", "rarity": "Epic", "class": "Controller", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 20, "name": "Kaelor", "rarity": "Epic", "class": "Support", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 21, "name": "Ignis", "rarity": "Legendary", "class": "DPS", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 22, "name": "Inferna", "rarity": "Legendary", "class": "Healer", "faction": "Volcanic", "origin": "Volcanic Wastes"},
    {"id": 23, "name": "Aurelius", "rarity": "Epic", "class": "Tank", "faction": "Sky Citadel", "origin": "Sky Citadel"},
    {"id": 24, "name": "Seraphine", "rarity": "Epic", "class": "Healer", "faction": "Sky Citadel", "origin": "Sky Citadel"},
    {"id": 25, "name": "Valor", "rarity": "Legendary", "class": "DPS", "faction": "Sky Citadel", "origin": "Sky Citadel"},
    {"id": 26, "name": "Celestia", "rarity": "UR", "class": "Support", "faction": "Sky Citadel", "origin": "Sky Citadel"},
    {"id": 27, "name": "Frostfang", "rarity": "Rare", "class": "DPS", "faction": "Frozen Tundra", "origin": "Frozen Tundra"},
    {"id": 28, "name": "Ylena", "rarity": "Epic", "class": "Controller", "faction": "Frozen Tundra", "origin": "Frozen Tundra"},
    {"id": 29, "name": "Boreas", "rarity": "Legendary", "class": "Tank", "faction": "Frozen Tundra", "origin": "Frozen Tundra"},
    {"id": 30, "name": "Glacia", "rarity": "Legendary", "class": "Healer", "faction": "Frozen Tundra", "origin": "Frozen Tundra"},
    {"id": 31, "name": "Shade", "rarity": "Rare", "class": "Assassin", "faction": "Shadow Realm", "origin": "Shadow Realm"},
    {"id": 32, "name": "Nocturne", "rarity": "Epic", "class": "Controller", "faction": "Shadow Realm", "origin": "Shadow Realm"},
    {"id": 33, "name": "Umbra", "rarity": "Legendary", "class": "DPS", "faction": "Shadow Realm", "origin": "Shadow Realm"},
    {"id": 34, "name": "Malachar", "rarity": "SP", "class": "DPS", "faction": "Shadow Realm", "origin": "Shadow Realm"},
    {"id": 35, "name": "Aldric", "rarity": "Legendary", "class": "Tank", "faction": "Golden Palace", "origin": "Golden Palace"},
    {"id": 36, "name": "Lyssa", "rarity": "Legendary", "class": "Healer", "faction": "Golden Palace", "origin": "Golden Palace"},
    {"id": 37, "name": "Regulus", "rarity": "SP", "class": "Support", "faction": "Golden Palace", "origin": "Golden Palace"},
    {"id": 38, "name": "Abyss Seer", "rarity": "Epic", "class": "Controller", "faction": "Abyss Deep", "origin": "Abyss Deep"},
    {"id": 39, "name": "Leviara", "rarity": "Legendary", "class": "DPS", "faction": "Abyss Deep", "origin": "Abyss Deep"},
    {"id": 40, "name": "Abyss Lord Nethros", "rarity": "SP", "class": "Controller", "faction": "Abyss Deep", "origin": "Abyss Deep"},
    {"id": 41, "name": "Astra", "rarity": "Legendary", "class": "Support", "faction": "Celestial Realm", "origin": "Celestial Realm"},
    {"id": 42, "name": "Solarius", "rarity": "SP", "class": "DPS", "faction": "Celestial Realm", "origin": "Celestial Realm"},
    {"id": 43, "name": "Orion", "rarity": "SP", "class": "Tank", "faction": "Celestial Realm", "origin": "Celestial Realm"},
    {"id": 44, "name": "Veyrath Redeemed", "rarity": "UR", "class": "Controller", "faction": "Void's End", "origin": "Void's End"},
    {"id": 45, "name": "Celestia Ascendant", "rarity": "UR", "class": "Support", "faction": "Void's End", "origin": "Void's End"},
    {"id": 46, "name": "Voidbane", "rarity": "UR", "class": "DPS", "faction": "Void's End", "origin": "Void's End"},
    {"id": 47, "name": "Eternal Guardian", "rarity": "UR", "class": "Tank", "faction": "Void's End", "origin": "Void's End"},
    {"id": 48, "name": "Aether Prime", "rarity": "UR", "class": "Support", "faction": "Void's End", "origin": "Void's End"},
    {"id": 49, "name": "Ash Runner", "rarity": "Rare", "class": "Assassin", "faction": "Fire Clan", "origin": "Volcanic Wastes"},
    {"id": 50, "name": "Wind Slicer", "rarity": "Rare", "class": "DPS", "faction": "Sky Tribe", "origin": "Sky Citadel"},
    {"id": 51, "name": "Stone Warden", "rarity": "Rare", "class": "Tank", "faction": "Mountain Clan", "origin": "Forest of Whispers"},
    {"id": 52, "name": "Luma Priest", "rarity": "Uncommon", "class": "Healer", "faction": "Lumina", "origin": "Celestial Realm"},
    {"id": 53, "name": "Rift Scout", "rarity": "Rare", "class": "Controller", "faction": "Void Hunters", "origin": "Void's End"},
    {"id": 54, "name": "Iron Fang", "rarity": "Rare", "class": "Tank", "faction": "Wildkin", "origin": "Forest of Whispers"},
    {"id": 55, "name": "Ember Witch", "rarity": "Epic", "class": "DPS", "faction": "Fire Coven", "origin": "Volcanic Wastes"},
    {"id": 56, "name": "Frost Valkyrie", "rarity": "Epic", "class": "Tank", "faction": "Iceborn", "origin": "Frozen Tundra"},
    {"id": 57, "name": "Spirit Caller", "rarity": "Epic", "class": "Healer", "faction": "Spirit Realm", "origin": "Shadow Realm"},
    {"id": 58, "name": "Blade Echo", "rarity": "Epic", "class": "Assassin", "faction": "Shadow Rogues", "origin": "Shadow Realm"},
    {"id": 59, "name": "Arc Engineer", "rarity": "Epic", "class": "Controller", "faction": "Tech Order", "origin": "Sky Citadel"},
    {"id": 60, "name": "Void Whisperer", "rarity": "Epic", "class": "Controller", "faction": "Void-Touched", "origin": "Void's End"},
    {"id": 61, "name": "Solaris Knight", "rarity": "Legendary", "class": "DPS", "faction": "Lumina Knights", "origin": "Celestial Realm"},
    {"id": 62, "name": "Lunar Empress", "rarity": "Legendary", "class": "Controller", "faction": "Celestial", "origin": "Celestial Realm"},
    {"id": 63, "name": "Chaos Druid", "rarity": "Legendary", "class": "Controller", "faction": "Nature Balance", "origin": "Forest of Whispers"},
    {"id": 64, "name": "Void Reaper", "rarity": "SP", "class": "DPS", "faction": "Void-Touched", "origin": "Void's End"},
    {"id": 65, "name": "Time Breaker", "rarity": "SP", "class": "Controller", "faction": "Chrono Order", "origin": "Void's End"},
    {"id": 66, "name": "Star Devourer", "rarity": "SP", "class": "DPS", "faction": "Cosmic Entity", "origin": "Abyss Deep"},
    {"id": 67, "name": "Seraph Prime", "rarity": "UR", "class": "Support", "faction": "Celestial", "origin": "Celestial Realm"},
    {"id": 68, "name": "Eternal King", "rarity": "UR", "class": "Tank", "faction": "Ancient Ruler", "origin": "Golden Palace"},
    {"id": 69, "name": "World Root Guardian", "rarity": "UR", "class": "Tank", "faction": "Nature Core", "origin": "Forest of Whispers"},
    {"id": 70, "name": "Veyrath Fragment", "rarity": "UR", "class": "Controller", "faction": "Void-Touched", "origin": "Void's End"}
]

# Base stats for heroes based on rarity and class
def get_base_stats(rarity, hero_class):
    stats = {
        "HP": 1000,
        "Attack": 100,
        "Defense": 50,
        "Speed": 100,
        "CritRate": 0.05,
        "CritDamage": 1.5,
        "HealingPower": 0,
        "EffectAccuracy": 0.1,
        "EffectResistance": 0.1
    }
    
    # Rarity multipliers
    rarity_mult = {
        "Common": 1.0,
        "Uncommon": 1.2,
        "Rare": 1.5,
        "Epic": 2.0,
        "Legendary": 3.0,
        "SP": 3.5,
        "UR": 4.0
    }
    
    mult = rarity_mult.get(rarity, 1.0)
    for k in ["HP", "Attack", "Defense"]:
        stats[k] = int(stats[k] * mult)
        
    # Class adjustments
    if hero_class == "Tank":
        stats["HP"] = int(stats["HP"] * 1.5)
        stats["Defense"] = int(stats["Defense"] * 1.5)
        stats["Attack"] = int(stats["Attack"] * 0.7)
    elif hero_class == "DPS":
        stats["Attack"] = int(stats["Attack"] * 1.5)
        stats["CritRate"] += 0.1
    elif hero_class == "Assassin":
        stats["Attack"] = int(stats["Attack"] * 1.3)
        stats["Speed"] = int(stats["Speed"] * 1.3)
        stats["CritRate"] += 0.15
        stats["CritDamage"] += 0.5
    elif hero_class == "Healer":
        stats["HealingPower"] = int(stats["Attack"] * 1.0)
        stats["HP"] = int(stats["HP"] * 1.1)
    elif hero_class == "Support":
        stats["Speed"] = int(stats["Speed"] * 1.2)
        stats["HP"] = int(stats["HP"] * 1.2)
    elif hero_class == "Controller":
        stats["EffectAccuracy"] += 0.2
        stats["Speed"] = int(stats["Speed"] * 1.1)
        
    return stats

def get_hero_kit(rarity, hero_class):
    kit = {
        "basic_attack": {"name": "Basic Attack", "multiplier": 1.0},
        "skills": [],
        "ultimate": None,
        "passives": []
    }
    
    # Common: Basic
    if rarity == "Common": pass
    # Uncommon/Rare: Basic + 1 Skill
    elif rarity in ["Uncommon", "Rare"]:
        kit["skills"].append({"name": "Skill 1", "multiplier": 1.5, "cooldown": 3})
    # Epic: Basic + 2 Skills
    elif rarity == "Epic":
        kit["skills"].append({"name": "Skill 1", "multiplier": 1.5, "cooldown": 3})
        kit["skills"].append({"name": "Skill 2", "multiplier": 1.8, "cooldown": 5})
    # Legendary: Basic + 2 Skills + Ultimate
    elif rarity == "Legendary":
        kit["skills"].append({"name": "Skill 1", "multiplier": 1.6, "cooldown": 3})
        kit["skills"].append({"name": "Skill 2", "multiplier": 2.0, "cooldown": 5})
        kit["ultimate"] = {"name": "Ultimate Ability", "multiplier": 3.5}
    # SP: Basic + 2 Skills + Ultimate + 1 Passive
    elif rarity == "SP":
        kit["skills"].append({"name": "Skill 1", "multiplier": 1.8, "cooldown": 3})
        kit["skills"].append({"name": "Skill 2", "multiplier": 2.2, "cooldown": 5})
        kit["ultimate"] = {"name": "Ultimate Ability", "multiplier": 4.0}
        kit["passives"].append({"name": "Passive 1", "description": "Bonus Energy gain"})
    # UR: Basic + 2 Skills + Ultimate + 2 Passives
    elif rarity == "UR":
        kit["skills"].append({"name": "Skill 1", "multiplier": 2.0, "cooldown": 3})
        kit["skills"].append({"name": "Skill 2", "multiplier": 2.5, "cooldown": 5})
        kit["ultimate"] = {"name": "Ultimate Ability", "multiplier": 5.0}
        kit["passives"].append({"name": "Passive 1", "description": "Global Stat Buff"})
        kit["passives"].append({"name": "Passive 2", "description": "Void Resistance"})
        
    return kit

for h in heroes:
    h["base_stats"] = get_base_stats(h["rarity"], h["class"])
    h["kit"] = get_hero_kit(h["rarity"], h["class"])
    # Star levels
    base_stars = {"Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Legendary": 5, "SP": 6, "UR": 7}
    h["base_stars"] = base_stars.get(h["rarity"], 1)
    h["max_level_base"] = h["base_stars"] * 20

with open("aetheria/data/heroes.json", "w") as f:
    json.dump(heroes, f, indent=4)

# Generate Enemies
chapters = [
    "Forest of Whispers", "Crystal Caverns", "Volcanic Wastes", "Sky Citadel", 
    "Frozen Tundra", "Shadow Realm", "Golden Palace", "Abyss Deep", 
    "Celestial Realm", "Void's End"
]

enemies = []
enemy_id = 1
for i, chapter in enumerate(chapters):
    # 10 normal enemies per chapter
    for j in range(10):
        enemies.append({
            "id": enemy_id,
            "name": f"Enemy {enemy_id} ({chapter})",
            "chapter": chapter,
            "type": "Normal",
            "stats": {"HP": 500 * (i+1), "Attack": 50 * (i+1), "Defense": 20 * (i+1)}
        })
        enemy_id += 1
    # 3 bosses per chapter
    for j in range(3):
        enemies.append({
            "id": enemy_id,
            "name": f"Boss {enemy_id} ({chapter})",
            "chapter": chapter,
            "type": "Boss",
            "stats": {"HP": 2000 * (i+1), "Attack": 150 * (i+1), "Defense": 100 * (i+1)}
        })
        enemy_id += 1

with open("aetheria/data/enemies.json", "w") as f:
    json.dump(enemies, f, indent=4)

print("Database files generated successfully.")
