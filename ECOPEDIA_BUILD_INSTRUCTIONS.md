# Ecopedia Wiki Build Instructions for AI Agent

## Project Overview
Build a GitHub Pages-hosted wiki/fandom-style site for Ecopedia with easy content management, allowing the owner to add sections, categories, and images without touching code.

---

## Phase 1: Project Setup

### Step 1.1: Initialize GitHub Repository
- Create a new public GitHub repository named `ecopedia` (or use existing)
- Enable GitHub Pages in repository settings (Settings → Pages → Source: main branch, /docs folder)
- Clone repository locally: `git clone https://github.com/[username]/ecopedia.git`

### Step 1.2: Create Project Structure
```
ecopedia/
├── docs/                    # GitHub Pages root folder
│   ├── index.html          # Home page
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   ├── img/                # All images (categorized by subfolder)
│   │   ├── creatures/
│   │   ├── plants/
│   │   ├── locations/
│   │   └── equipment/
│   ├── data/               # JSON files for content (NO HTML editing needed)
│   │   └── content.json    # Central content file
│   └── assets/
│       └── fonts/
├── README.md
└── CUSTOMIZATION_GUIDE.md  # Easy guide for adding content
```

---

## Phase 2: Core Files Development

### Step 2.1: Create index.html (Main Page Template)
**File:** `docs/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ecopedia - Wiki Fandom</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="logo">
                <h1>🌿 Ecopedia</h1>
            </div>
            <ul class="nav-links" id="categoryNav">
                <!-- Categories populated from JSON -->
            </ul>
            <input type="text" id="searchBox" placeholder="Search...">
        </nav>
    </header>

    <main>
        <div id="heroSection" class="hero">
            <h2>Welcome to Ecopedia</h2>
            <p>Explore the world of Ecoloco</p>
        </div>

        <div class="container">
            <aside class="sidebar">
                <h3>Categories</h3>
                <ul id="categoryList">
                    <!-- Populated from JSON -->
                </ul>
            </aside>

            <section id="contentArea" class="content">
                <div id="itemGrid" class="grid">
                    <!-- Items populated from JSON -->
                </div>
            </section>
        </div>

        <div id="detailModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div id="detailContent">
                    <!-- Item details populated here -->
                </div>
            </div>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 Ecopedia | Powered by GitHub Pages</p>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>
```

### Step 2.2: Create data/content.json (Content File - MAIN CUSTOMIZATION FILE)
**File:** `docs/data/content.json`

```json
{
  "site": {
    "title": "Ecopedia",
    "subtitle": "The Ecoloco Wiki",
    "description": "Explore creatures, plants, locations, and equipment in the world of Ecoloco"
  },
  "categories": [
    {
      "id": "creatures",
      "name": "Creatures",
      "description": "All creatures in Ecoloco",
      "icon": "🦎"
    },
    {
      "id": "plants",
      "name": "Plants",
      "description": "Flora of Ecoloco",
      "icon": "🌱"
    },
    {
      "id": "locations",
      "name": "Locations",
      "description": "Places to explore",
      "icon": "🗺️"
    },
    {
      "id": "equipment",
      "name": "Equipment",
      "description": "Tools and gear",
      "icon": "⚙️"
    }
  ],
  "items": [
    {
      "id": "item-001",
      "name": "Verdant Dragon",
      "category": "creatures",
      "image": "img/creatures/verdant-dragon.jpg",
      "rarity": "Rare",
      "description": "A majestic dragon with emerald scales that dwells in ancient forests.",
      "details": "The Verdant Dragon is known for its symbiotic relationship with forest ecosystems. These creatures help spread seeds and maintain healthy vegetation patterns.",
      "traits": ["Flying", "Fire Breath", "Nature Aligned"],
      "habitat": "Deep Forests"
    },
    {
      "id": "item-002",
      "name": "Crystalline Fern",
      "category": "plants",
      "image": "img/plants/crystalline-fern.jpg",
      "rarity": "Uncommon",
      "description": "A glowing fern with crystal-like fronds.",
      "details": "Found only in caves with high mineral content. The crystals on its leaves emit a soft bioluminescence that guides travelers.",
      "traits": ["Bioluminescent", "Rare Minerals"],
      "habitat": "Underground Caverns"
    }
  ]
}
```

### Step 2.3: Create css/style.css (Styling)
**File:** `docs/css/style.css`

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #2d5016;
    --secondary-color: #7cb342;
    --accent-color: #ffb74d;
    --text-color: #333;
    --bg-color: #f5f5f5;
    --card-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
}

/* Header & Navigation */
.header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 1rem 0;
    box-shadow: var(--card-shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.logo h1 {
    font-size: 1.8rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
    flex: 1;
    justify-content: center;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
    cursor: pointer;
}

.nav-links a:hover {
    opacity: 0.8;
}

#searchBox {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    width: 200px;
    font-size: 0.9rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    text-align: center;
    padding: 4rem 2rem;
    margin-bottom: 2rem;
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* Container Layout */
.container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 0 2rem;
}

/* Sidebar */
.sidebar {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--card-shadow);
    height: fit-content;
    position: sticky;
    top: 100px;
}

.sidebar h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

#categoryList {
    list-style: none;
}

#categoryList li {
    padding: 0.75rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.3s;
}

#categoryList li:hover,
#categoryList li.active {
    background: var(--secondary-color);
    color: white;
}

/* Content Grid */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--card-shadow);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: var(--bg-color);
}

.card-content {
    padding: 1.5rem;
}

.card-title {
    color: var(--primary-color);
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.card-category {
    display: inline-block;
    background: var(--secondary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
}

.card-description {
    font-size: 0.9rem;
    color: #666;
}

.card-rarity {
    margin-top: 0.5rem;
    font-weight: bold;
    color: var(--accent-color);
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.close {
    color: #aaa;
    float: right;
    font-size: 1.5rem;
    cursor: pointer;
}

.close:hover {
    color: black;
}

.detail-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.detail-title {
    color: var(--primary-color);
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.detail-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.detail-badge {
    background: var(--secondary-color);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.85rem;
}

.detail-section {
    margin: 1.5rem 0;
}

.detail-section h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

/* Footer */
footer {
    background: var(--primary-color);
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
    }

    .nav-links {
        gap: 1rem;
        font-size: 0.9rem;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    #searchBox {
        width: 100%;
    }
}
```

### Step 2.4: Create js/script.js (Functionality)
**File:** `docs/js/script.js`

```javascript
let allItems = [];
let currentCategory = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
    setupEventListeners();
    displayAllItems();
});

// Load content from JSON
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();
        allItems = data.items;
        renderCategories(data.categories);
        updateSiteTitle(data.site);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Update site title
function updateSiteTitle(site) {
    document.title = site.title;
    const logoTitle = document.querySelector('.logo h1');
    logoTitle.textContent = site.title;
}

// Render categories in navigation and sidebar
function renderCategories(categories) {
    const navContainer = document.getElementById('categoryNav');
    const sidebarContainer = document.getElementById('categoryList');

    navContainer.innerHTML = '';
    sidebarContainer.innerHTML = '';

    categories.forEach(category => {
        // Navigation link
        const navItem = document.createElement('a');
        navItem.textContent = `${category.icon} ${category.name}`;
        navItem.addEventListener('click', () => filterByCategory(category.id));
        navContainer.appendChild(navItem);

        // Sidebar link
        const sidebarItem = document.createElement('li');
        sidebarItem.textContent = `${category.icon} ${category.name}`;
        sidebarItem.dataset.categoryId = category.id;
        sidebarItem.addEventListener('click', () => filterByCategory(category.id));
        sidebarContainer.appendChild(sidebarItem);
    });

    // Add "All" category
    const allNavItem = document.createElement('a');
    allNavItem.textContent = '📚 All';
    allNavItem.addEventListener('click', () => displayAllItems());
    navContainer.appendChild(allNavItem);

    const allSidebarItem = document.createElement('li');
    allSidebarItem.textContent = '📚 All';
    allSidebarItem.addEventListener('click', () => displayAllItems());
    sidebarContainer.insertBefore(allSidebarItem, sidebarContainer.firstChild);
}

// Setup event listeners
function setupEventListeners() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', (e) => searchItems(e.target.value));

    const closeButton = document.querySelector('.close');
    const modal = document.getElementById('detailModal');
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Display all items
function displayAllItems() {
    currentCategory = null;
    updateActiveSidebar();
    renderGrid(allItems);
}

// Filter by category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    updateActiveSidebar();
    const filtered = allItems.filter(item => item.category === categoryId);
    renderGrid(filtered);
}

// Search items
function searchItems(query) {
    const results = allItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    renderGrid(results);
}

// Update active sidebar item
function updateActiveSidebar() {
    document.querySelectorAll('#categoryList li').forEach(li => {
        li.classList.remove('active');
        if (!currentCategory && li.textContent.includes('All')) {
            li.classList.add('active');
        } else if (li.dataset.categoryId === currentCategory) {
            li.classList.add('active');
        }
    });
}

// Render grid of items
function renderGrid(items) {
    const grid = document.getElementById('itemGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items found.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-image">
            <div class="card-content">
                <span class="card-category">${item.category}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-description">${item.description}</p>
                <p class="card-rarity">${item.rarity}</p>
            </div>
        `;
        card.addEventListener('click', () => showDetail(item));
        grid.appendChild(card);
    });
}

// Show detail modal
function showDetail(item) {
    const modal = document.getElementById('detailModal');
    const detailContent = document.getElementById('detailContent');

    let traitsHtml = '';
    if (item.traits) {
        traitsHtml = `
            <div class="detail-section">
                <h3>Traits</h3>
                ${item.traits.map(trait => `<span class="detail-badge">${trait}</span>`).join('')}
            </div>
        `;
    }

    detailContent.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="detail-image">
        <h2 class="detail-title">${item.name}</h2>
        <div class="detail-meta">
            <span class="detail-badge">${item.category}</span>
            <span class="detail-badge">${item.rarity}</span>
        </div>
        <div class="detail-section">
            <p>${item.details}</p>
        </div>
        ${traitsHtml}
        <div class="detail-section">
            <h3>Habitat</h3>
            <p>${item.habitat}</p>
        </div>
    `;

    modal.style.display = 'block';
}
```

---

## Phase 3: Create Customization Guide

### Step 3.1: Create CUSTOMIZATION_GUIDE.md
**File:** `CUSTOMIZATION_GUIDE.md`

```markdown
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
```

---

## Phase 4: GitHub Pages Deployment

### Step 4.1: Configure Repository
1. Go to repository Settings
2. Navigate to "Pages" section
3. Set Source to: `main` branch, `/docs` folder
4. Save

### Step 4.2: GitHub Pages URL
Your site will be available at: `https://[username].github.io/ecopedia`

### Step 4.3: Initial Deployment
```bash
cd ecopedia
git add .
git commit -m "Initial Ecopedia site setup"
git push origin main
```

Site should be live within 5 minutes!

---

## Phase 5: Adding Images (File Structure)

### Step 5.1: Create Image Directory
Create folders in `docs/img/`:
```
docs/img/
├── creatures/      (images of creatures)
├── plants/        (images of plants)
├── locations/     (images of locations)
└── equipment/     (images of equipment)
```

### Step 5.2: Image Guidelines
- **Format**: JPG, PNG, or WebP
- **Size**: Keep under 500KB per image
- **Dimensions**: 400x400px minimum (will be displayed at different sizes)
- **Naming**: Use lowercase with hyphens (e.g., `verdant-dragon.jpg`, `crystalline-fern.png`)

---

## Phase 6: Maintenance & Updates

### To Add Content:
1. Edit `docs/data/content.json`
2. Add images to `docs/img/[category]/`
3. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update: Add [item name]"
   git push origin main
   ```

### To Change Design:
- Edit `docs/css/style.css` for styling
- Edit `docs/js/script.js` for functionality

### To Change Site Info:
- Edit the `site` section in `docs/data/content.json`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Site not updating | Wait 5 mins, clear browser cache (Ctrl+Shift+Delete) |
| Images not showing | Check path in JSON matches actual file location |
| Style looks broken | Verify CSS file is in `docs/css/style.css` |
| JSON error on page | Validate JSON at jsonlint.com |
| Items not appearing | Check category exists in categories array |

---

## Summary

**To manage your Ecopedia wiki:**
- ✅ Only edit `docs/data/content.json` for content
- ✅ Add images to `docs/img/[category]/` folders
- ✅ Push changes to GitHub (auto-deploys in 5 mins)
- ✅ No coding knowledge required!

All content changes flow through one JSON file, making it extremely customizable and maintainable.
```

---

## Phase 7: Final Setup Instructions

### Step 7.1: Complete File Checklist
Ensure your `docs/` folder has:
- ✅ `index.html`
- ✅ `css/style.css`
- ✅ `js/script.js`
- ✅ `data/content.json`
- ✅ `img/creatures/` (with sample images)
- ✅ `img/plants/` (with sample images)
- ✅ `img/locations/` (empty initially)
- ✅ `img/equipment/` (empty initially)

### Step 7.2: Sample Images
Add 2-3 placeholder images to start:
- `img/creatures/verdant-dragon.jpg`
- `img/plants/crystalline-fern.jpg`
- `img/locations/forest.jpg`

### Step 7.3: Push to GitHub
```bash
git add .
git commit -m "Initial Ecopedia Wiki Setup"
git push origin main
```

### Step 7.4: Verify Live
- Visit: `https://[your-username].github.io/ecopedia`
- You should see the wiki homepage
- Try clicking items, filtering by category, searching

---

## Features Summary

✨ **What You Get:**
- 📱 Fully responsive design (mobile-friendly)
- 🔍 Search functionality
- 📂 Category filtering
- 🖼️ Image gallery with modal detail view
- ⚡ No server required (pure static site)
- 🚀 Auto-deploys via GitHub Pages
- 📝 Single JSON file for all content
- 🎨 Customizable colors via CSS variables

---

## Customization Tips

### Change Colors
Edit the `:root` section in `style.css`:
```css
:root {
    --primary-color: #2d5016;      /* Green */
    --secondary-color: #7cb342;    /* Light Green */
    --accent-color: #ffb74d;       /* Orange */
}
```

### Add New Category
1. Add to `categories` array in content.json
2. Create `docs/img/[category-id]/` folder
3. Add items with matching category id

### Change Site Logo
Modify the `.logo h1` content in `index.html`

---

## Next Steps for AI Agent

When implementing this:
1. ✅ Create folder structure in Phase 1
2. ✅ Create all files from Phase 2 (HTML, CSS, JS, JSON)
3. ✅ Create CUSTOMIZATION_GUIDE.md
4. ✅ Add sample images
5. ✅ Configure GitHub Pages
6. ✅ Test locally before pushing
7. ✅ Deploy and verify

The site is now ready for the owner to add content anytime by editing one JSON file!
