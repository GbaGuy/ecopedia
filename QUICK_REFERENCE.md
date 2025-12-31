# Ecopedia - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Get credentials from Airtable
# Visit: https://airtable.com/account/api
# Create token, copy token and Base ID

# 2. Edit app.js (lines 4-7)
# Add your token and Base ID

# 3. Commit and push
git add app.js
git commit -m "Add Airtable credentials"
git push origin main

# 4. Enable GitHub Pages
# Settings > Pages > Deploy from a branch > main > Save

# 5. Visit your site
# https://YOUR_USERNAME.github.io/ecopedia
```

---

## 📁 Project Files

```
ecopedia/
├── index.html           ← Website structure
├── styles.css           ← Wikipedia-style design
├── app.js               ← JavaScript + Airtable integration
├── README.md            ← Full documentation
├── SETUP_GUIDE_HE.md    ← Guide in Hebrew
├── ARCHITECTURE.md      ← How it works
├── CHECKLIST.md         ← Setup checklist
└── .gitignore           ← Git configuration
```

---

## ⚙️ Configuration

### In app.js (lines 4-7):
```javascript
const CONFIG = {
    AIRTABLE_TOKEN: 'patXXXXXXXXXXXXXX...',
    BASE_ID: 'appXXXXXXXXXXXXXX'
};
```

**Where to find:**
- **Token**: https://airtable.com/account/api
- **Base ID**: Your Airtable URL: `https://airtable.com/app{BASE_ID}/...`

---

## 📊 Airtable Structure

```
Your Airtable Base
├── Table 1 (becomes Category 1)
│   ├── Record A (becomes Article A)
│   │   ├── Field 1: Title
│   │   ├── Field 2: Content section
│   │   └── Field 3: More content
│   └── Record B (becomes Article B)
└── Table 2 (becomes Category 2)
    └── Record C (becomes Article C)
```

**Rule of Thumb:**
- 1st field = Article title
- Other fields = Content sections
- Text fields work best

---

## 🎨 Customization

### Change Title
File: `index.html` (line 30)
```html
<h1 class="wiki-title">Your Title Here</h1>
```

### Change Colors
File: `styles.css` (lines 8-14)
```css
:root {
    --wiki-blue: #3366cc;        /* Main color */
    --wiki-light-blue: #f5f7fa;  /* Background */
    --wiki-link: #0645ad;        /* Link color */
}
```

### Change Subtitle
File: `index.html` (line 31)
```html
<p class="wiki-subtitle">Your Subtitle</p>
```

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Configuration Error" | Check CONFIG in app.js |
| No content shows | Token/Base ID incorrect |
| Styling broken | Hard refresh (Ctrl+Shift+R) |
| Search doesn't work | Add text to your Airtable |
| Site not deploying | Check GitHub Pages settings |

---

## 🔐 Security Notes

⚠️ **Your Airtable token is in the code!**

Options:
1. **Use read-only token** - Recommended
2. **Restrict token scope** - Only needed tables
3. **Don't use in public repos** - Keep private
4. **Rotate token regularly** - Monthly is good

---

## 📱 Testing Checklist

- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iPhone, Android)
- [ ] Tablet
- [ ] Categories show
- [ ] Articles load
- [ ] Search works
- [ ] Back button works
- [ ] Links are clickable

---

## 🌐 Deployment

```
Local Development
↓
git add . && git commit -m "message" && git push
↓
GitHub receives changes
↓
GitHub Pages rebuilds (1-2 min)
↓
Live at: https://USERNAME.github.io/ecopedia
```

**To update content:**
1. Edit your Airtable
2. Refresh the website (F5)
3. That's it! No rebuild needed

---

## 📞 Command Reference

### Git Commands
```bash
git status              # Check what changed
git add .              # Stage all changes
git commit -m "msg"    # Commit changes
git push origin main   # Push to GitHub
git log --oneline      # See commit history
```

### Testing Locally
```bash
# Just open index.html in your browser
# No server needed!
```

---

## 🎯 Next Steps

1. ✅ Configure app.js with your Airtable credentials
2. ✅ Push to GitHub
3. ✅ Enable GitHub Pages
4. ✅ Share your site URL
5. ✅ Add more content to Airtable
6. ✅ Customize colors and title

---

## 📚 Learn More

- **Airtable API**: https://airtable.com/api
- **GitHub Pages**: https://pages.github.com
- **Wikipedia Style**: https://en.wikipedia.org
- **JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript

---

## 💡 Pro Tips

```javascript
// Check what's loaded in console (F12):
console.log(ecopedia.appState.tables);
console.log(ecopedia.appState.records);

// Search programmatically:
ecopedia.performSearch('your search term');

// Go to home:
ecopedia.renderCategoriesView();
```

---

## ✨ Features at a Glance

| Feature | Status |
|---------|--------|
| Wikipedia-style design | ✅ Ready |
| Dynamic Airtable integration | ✅ Ready |
| Full-text search | ✅ Ready |
| Mobile responsive | ✅ Ready |
| GitHub Pages hosted | ✅ Ready |
| No backend needed | ✅ Ready |
| Free forever | ✅ Ready |

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Production Ready ✅

---

## Questions?

1. Check README.md (full documentation)
2. Check ARCHITECTURE.md (how it works)
3. Check browser console (F12) for errors
4. Check Airtable API status
5. Review the code comments in app.js

**You've got this!** 🚀
