# 🌿 Ecopedia

A GitHub Pages-hosted wiki/fandom-style site for Ecopedia with easy content management.

## 🚀 Features

- 📱 Fully responsive design (mobile-friendly)
- 🔍 Search functionality
- 📂 Category filtering
- 🖼️ Image gallery with modal detail view
- ⚡ No server required (pure static site)
- 🎯 Auto-deploys via GitHub Pages
- 📝 Single JSON file for all content management
- 🎨 Customizable colors via CSS variables

## 📁 Project Structure

```
ecopedia/
├── docs/                    # GitHub Pages root folder
│   ├── index.html          # Main page
│   ├── css/
│   │   └── style.css       # Styling
│   ├── js/
│   │   └── script.js       # JavaScript functionality
│   ├── img/                # Images (organized by category)
│   │   ├── creatures/
│   │   ├── plants/
│   │   ├── locations/
│   │   └── equipment/
│   ├── data/
│   │   └── content.json    # Main content file
│   └── assets/
│       └── fonts/
├── CUSTOMIZATION_GUIDE.md  # Easy guide for adding content
├── QUICK_ADD_GUIDE.md      # Quick reference guide
└── README.md               # This file
```

## 🛠️ Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages" section
3. Set Source to: `main` branch, `/docs` folder
4. Save

Your site will be available at: `https://[your-username].github.io/ecopedia`

### 2. Local Testing (Optional)

To test locally, you'll need a simple HTTP server (due to CORS restrictions with local JSON files):

```bash
# Using Python 3
cd docs
python -m http.server 8000

# Then visit http://localhost:8000 in your browser
```

Or use VS Code's Live Server extension.

### 3. Deploy Changes

After making any changes:

```bash
git add .
git commit -m "Update content"
git push origin main
```

GitHub Pages will automatically deploy your changes within 5 minutes.

## ✏️ Adding Content (No Coding Required!)

All content is managed through **one file**: `docs/data/content.json`

### Quick Add Process:

1. **Add your image** to `docs/img/[category]/`
2. **Edit** `docs/data/content.json` and add your item
3. **Push to GitHub**

See [QUICK_ADD_GUIDE.md](QUICK_ADD_GUIDE.md) for a quick reference or [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) for detailed instructions.

### Example: Adding a New Creature

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

## 🎨 Customization

### Change Colors

Edit the CSS variables in `docs/css/style.css`:

```css
:root {
    --primary-color: #2d5016;      /* Main green */
    --secondary-color: #7cb342;    /* Light green */
    --accent-color: #ffb74d;       /* Orange accent */
}
```

### Add New Categories

1. Add to the `categories` array in `content.json`
2. Create corresponding folder in `docs/img/[category-name]/`

## 📝 Content Guidelines

### Images
- **Format**: JPG, PNG, or WebP
- **Size**: Keep under 500KB per image
- **Dimensions**: 400x400px minimum
- **Naming**: Use lowercase with hyphens (e.g., `verdant-dragon.jpg`)

### JSON Structure
- Keep valid JSON format (proper commas, brackets)
- Each item needs a unique ID
- Category must exist in the categories array
- Image paths must start with `img/`

Validate your JSON at: https://jsonlint.com/

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Site not updating | Wait 5 mins, clear browser cache (Ctrl+Shift+Delete) |
| Images not showing | Check path in JSON matches actual file location |
| Style looks broken | Verify CSS file is in `docs/css/style.css` |
| JSON error on page | Validate JSON at jsonlint.com |
| Items not appearing | Check category exists in categories array |

## 📚 Documentation

- [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) - Detailed guide for managing content
- [QUICK_ADD_GUIDE.md](QUICK_ADD_GUIDE.md) - Quick reference for adding items
- [ECOPEDIA_BUILD_INSTRUCTIONS.md](ECOPEDIA_BUILD_INSTRUCTIONS.md) - Complete build instructions

## 🌐 Live Site

Once deployed, your site will be available at:
```
https://[your-github-username].github.io/ecopedia
```

## 📄 License

This project is open source and available for personal and educational use.

---

**Built with ❤️ for easy wiki management**
