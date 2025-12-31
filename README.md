# Ecopedia - Wikipedia-style Airtable Encyclopedia

A dynamic, Wikipedia-style website powered by Airtable data. Display your Airtable tables as categories, and records as articles.

## Features

- 📚 **Wikipedia-style Design** - Clean, professional layout inspired by Wikipedia
- 🔄 **Dynamic Content** - All content pulled directly from Airtable
- 🔍 **Full-text Search** - Search across all tables and records
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Simple Setup** - Just add your Airtable credentials

## Setup Instructions

### 1. Get Your Airtable Credentials

**Personal Access Token:**
1. Go to https://airtable.com/account/api
2. Click "Create new token"
3. Name it "Ecopedia"
4. Under "Scopes," select:
   - `data.records:read` (Read records)
   - `schema.bases:read` (Read schema/tables)
5. Click "Create token" and **copy it** (you won't see it again!)

**Base ID:**
1. Open your Airtable workspace
2. The URL looks like: `https://airtable.com/app{BASE_ID}/...`
3. Copy the `{BASE_ID}` part

### 2. Configure Ecopedia

Edit `app.js` and update the configuration at the top:

```javascript
const CONFIG = {
    AIRTABLE_TOKEN: 'YOUR_PERSONAL_ACCESS_TOKEN_HERE',
    BASE_ID: 'YOUR_BASE_ID_HERE'
};
```

### 3. Organize Your Airtable Base

**Structure:**
- Each **table** in Airtable becomes a **category** in Ecopedia
- Each **record** in a table becomes an **article**
- The first field in each table is used as the article **title**
- Other fields become article **sections**

**Example:**
```
Table: "Animals"
  Record: "Lion"
    - Title: "Lion"
    - Description: "The lion is a large cat..."
    - Habitat: "Africa and Asia"
    - Conservation Status: "Vulnerable"

Result: Category "Animals" → Article "Lion" with sections
```

### 4. Deploy to GitHub Pages

1. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Initial Ecopedia setup"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Under "Pages," select "Deploy from a branch"
   - Select the `main` branch
   - Click "Save"

3. **Access Your Site:**
   - Your site will be available at: `https://YOUR_USERNAME.github.io/ecopedia`

## Project Structure

```
ecopedia/
├── index.html       # Main HTML file
├── styles.css       # Wikipedia-style CSS
├── app.js           # JavaScript logic and Airtable integration
├── README.md        # This file
└── .git/            # Git repository
```

## Features Guide

### Viewing Content
- **Categories View**: Browse all Airtable tables as categories
- **Articles List**: View all articles in a category
- **Article View**: Read full article with all fields displayed as sections

### Navigation
- **Sidebar**: Quick navigation between categories
- **Search**: Find articles by keyword
- **Breadcrumbs**: Navigate back to category or home

### Field Types Support
- **Text**: Displayed as paragraphs
- **Long Text**: Full content preserved
- **Numbers**: Displayed as-is
- **Attachments**: Links to files
- **URLs**: Automatically converted to clickable links
- **Arrays**: Displayed as lists

## Customization

### Change Site Title
In `index.html`, update:
```html
<h1 class="wiki-title">Ecopedia</h1>
<p class="wiki-subtitle">The Free Encyclopedia</p>
```

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --wiki-blue: #3366cc;
    --wiki-light-blue: #f5f7fa;
    --wiki-border: #a2a9b1;
    --wiki-text: #202122;
    --wiki-link: #0645ad;
}
```

### Change Default View
In `app.js`, modify `appState` initialization:
```javascript
currentView: 'categories', // or 'articles', 'article', 'search'
```

## Troubleshooting

### "Configuration Error" appears
- Check that you've entered your Airtable token and base ID correctly
- Ensure the token has the correct scopes

### No content appears
- Verify your Airtable base has tables and records
- Check browser console (F12) for API errors
- Ensure your Personal Access Token hasn't expired

### Search doesn't work
- Check that records have searchable text fields
- Try searching for common words in your data

### Styling looks broken
- Clear browser cache (Ctrl+Shift+Del)
- Try a different browser
- Check that `styles.css` is in the same directory as `index.html`

## API Limits

Airtable has rate limits:
- Free tier: 5 requests/second
- Higher tiers: more requests

The app respects these limits automatically.

## Privacy & Security

- Your Airtable token is stored **locally in your browser**
- It's never sent to external servers (except Airtable)
- Never commit your token to public repositories
- Consider adding `app.js` to `.gitignore` if storing credentials

## License

Feel free to use and modify for your own projects!

## Support

For issues or questions:
1. Check this README
2. Review browser console errors (F12)
3. Check Airtable API status
4. Verify your Airtable base structure

---

Made with 💙 for Wikipedia-style wikis powered by Airtable
