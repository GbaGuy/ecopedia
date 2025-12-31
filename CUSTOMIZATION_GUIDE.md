# How to Add Content to Ecopedia (NO CODING REQUIRED)

## Overview
Everything is controlled by ONE file: `docs/data/content.json`

Edit this file to:
- Add new creatures, plants, locations, or equipment
- Create new categories
- Change site title/description
- Add/edit images

---

## Adding a New Item

### 1. Add the Image
1. Go to: `docs/img/[category-name]/`
2. Add your image file (jpg, png, webp)
3. Note the filename (e.g., `blue-frog.jpg`)

### 2. Edit content.json
Add a new item object in the `items` array:

```json
{
    "id": "item-003",
    "name": "Blue Tree Frog",
    "category": "creatures",
    "image": "img/creatures/blue-frog.jpg",
    "rarity": "Rare",
    "description": "A bright blue frog with sticky pads.",
    "details": "Lives in humid rainforests and feeds on insects.",
    "traits": ["Jumper", "Water Lover", "Nocturnal"],
    "habitat": "Tropical Rainforest"
}
```

### Field Explanations:
- **id**: Unique identifier (e.g., item-001, item-002, etc.)
- **name**: Display name
- **category**: Must match a category id (creatures, plants, locations, equipment)
- **image**: Path to image file in docs/img/
- **rarity**: Rarity level (Common, Uncommon, Rare, Epic, Legendary)
- **description**: Short summary (1-2 sentences)
- **details**: Longer description with more info
- **traits**: Special characteristics (array)
- **habitat**: Where it's found

---

## Adding a New Category

Edit the `categories` array in content.json:

```json
{
    "id": "magic-items",
    "name": "Magic Items",
    "description": "Enchanted objects with special powers",
    "icon": "✨"
}
```

Then create the corresponding folder: `docs/img/magic-items/`

---

## Editing Existing Items

Find the item in the `items` array and modify any field:

```json
{
    "id": "item-001",
    "name": "Verdant Dragon - Updated",  // Changed name
    "category": "creatures",
    "image": "img/creatures/verdant-dragon-v2.jpg",  // Changed image
    ...
}
```

---

## Important Notes

- **Keep the JSON format valid** (proper commas, brackets)
- **Image paths** must start with `img/`
- **Category must exist** - can't reference a non-existent category
- **Unique IDs** - each item needs a unique id
- After editing, commit to GitHub: `git add . && git commit -m "Add new items" && git push`

---

## JSON Validation

To check if your JSON is valid, use: https://jsonlint.com/

---

## Example: Adding a New Plant

1. Save image: `docs/img/plants/moonflower.jpg`

2. Add to content.json:
```json
{
    "id": "item-004",
    "name": "Moonflower",
    "category": "plants",
    "image": "img/plants/moonflower.jpg",
    "rarity": "Uncommon",
    "description": "A delicate white flower that blooms at night.",
    "details": "The Moonflower only opens its petals under moonlight, releasing a sweet fragrance that attracts nocturnal pollinators.",
    "traits": ["Nocturnal", "Luminescent", "Fragrant"],
    "habitat": "Meadows and Forest Clearings"
}
```

3. Commit and push to GitHub

That's it! The site auto-updates.
