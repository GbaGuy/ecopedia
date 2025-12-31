# Ecopedia Quick Add Guide

## The 3-Step Process to Add Content

### Step 1️⃣: Add Your Image
```
Drop image into: docs/img/[creatures|plants|locations|equipment]/
Example: docs/img/creatures/my-creature.jpg
```

### Step 2️⃣: Copy-Paste Template
Open `docs/data/content.json` and add this to the `items` array:

```json
{
    "id": "item-XXX",
    "name": "Your Item Name",
    "category": "creatures",
    "image": "img/creatures/your-image.jpg",
    "rarity": "Rare",
    "description": "One sentence description.",
    "details": "Longer description with more details about the item.",
    "traits": ["Trait1", "Trait2", "Trait3"],
    "habitat": "Where it lives"
}
```

### Step 3️⃣: Push to GitHub
```bash
git add .
git commit -m "Add new item: Your Item Name"
git push origin main
```

**Done!** Your site updates in 5 minutes ⏱️

---

## Field Reference

| Field | Example | Notes |
|-------|---------|-------|
| id | item-005 | Must be unique |
| name | Verdant Dragon | Display name |
| category | creatures | Use: creatures, plants, locations, equipment |
| image | img/creatures/dragon.jpg | Path must match file location |
| rarity | Rare | Common, Uncommon, Rare, Epic, Legendary |
| description | A majestic dragon | 1-2 sentences, shows on card |
| details | Known for its symbiotic... | Full description, shows in modal |
| traits | ["Flying", "Fire Breath"] | Special abilities/features |
| habitat | Deep Forests | Where it's found |

---

## Common Tasks

### Add New Category
1. Open `docs/data/content.json`
2. Find `categories` array
3. Add:
```json
{
    "id": "magic-items",
    "name": "Magic Items",
    "description": "Enchanted objects",
    "icon": "✨"
}
```
4. Create folder: `docs/img/magic-items/`

### Change Site Title
In `content.json`, change:
```json
"site": {
    "title": "Your New Title",
    "subtitle": "Your New Subtitle",
    "description": "Your description"
}
```

### Update Item Info
Find the item in `content.json` and edit any field (name, description, image, etc.)

### Delete an Item
Remove the entire `{}` block for that item from the `items` array.

---

## Image Tips
- ✅ Supported: JPG, PNG, WebP
- ✅ Max size: 500KB
- ✅ Min size: 400x400px
- ✅ Name format: `lowercase-with-hyphens.jpg`

---

## Validation Checklist
Before pushing:
- [ ] JSON is valid (check at jsonlint.com if unsure)
- [ ] Image file exists in correct folder
- [ ] Category in JSON matches an existing category
- [ ] No duplicate item IDs
- [ ] Item id number increments (item-001, item-002, etc.)

---

## URL After Deployment
```
https://[your-github-username].github.io/ecopedia
```

---

## Still Need Help?
See the full guide: `ECOPEDIA_BUILD_INSTRUCTIONS.md`
