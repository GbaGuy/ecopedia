# 🌿 Ecopedia

A GitHub Pages-hosted wiki/fandom-style site for Ecopedia with easy content management.

## 🚀 Features

- 📱 Fully responsive design (mobile-friendly)
- 🔍 Search functionality
- 📂 Category filtering
- 🖼️ Image gallery with modal detail view
- ⚡ No server required (pure static site)
- 🎯 Auto-deploys via GitHub Pages
- 📝 Admin panel for adding/editing content
- 📊 Google Sheets integration for team collaboration
- 📤 Export and backup as JSON
- 🔗 Share links for collaborative editing
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

### Quick Setup (5 minutes)

1. **Create your Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new sheet with 3 columns: **Category, Description, Image**
   - Add your wiki data
   - Share: "Anyone with link can view"
   - Copy the Sheet ID from the URL

2. **Configure the wiki**
   - Open `docs/js/script.js`
   - Find line 2: `const DEFAULT_SHEET_ID = 'YOUR_SHEET_ID_HERE';`
   - Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID
   - Save the file

3. **Deploy**
   ```bash
   git add .
   git commit -m "Configure Sheet ID"
   git push origin main
   ```

4. **Done!** Your wiki is live at: `https://[your-username].github.io/ecopedia`

Visitors will see your content immediately - no setup required on their end!

## ✏️ Adding Content

### Admin Panel (Recommended)

1. Open your Ecopedia site
2. Click the **⚙️ Admin** button (bottom right)
3. Use the **Items** or **Categories** tabs to add content
4. Click **Save to Firebase** to store in the cloud
5. Or **Download JSON** for a backup

### Manual Edit Method

All content is managed through: `docs/data/content.json`

### Quick Add Process:

1. **Add your image** to `docs/img/[category]/`
2. **Edit** `docs/data/content.json` and add your item
3. **Push to GitHub** or **use the admin panel**

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

- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Easy team collaboration setup (recommended!)
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
