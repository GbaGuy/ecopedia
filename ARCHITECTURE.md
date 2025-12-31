# Ecopedia - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Pages Hosting                     │
│                  (Your Static Website)                       │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Served to browsers
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
    ┌──────────────┐                    ┌──────────────┐
    │  index.html  │                    │  styles.css  │
    │  (Structure) │◄──────────────────►│  (Design)    │
    └──────────────┘                    └──────────────┘
        ▲                                       ▲
        │                                       │
        └───────────┬──────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │   app.js     │
            │ (JavaScript  │
            │   Logic)     │◄─────────┐
            └──────────────┘          │
                    │                 │
                    │ Fetches data    │
                    │ with API calls  │
                    │                 │
                    ▼                 │
        ┌─────────────────────────┐   │
        │   Airtable API         │───┘
        │  (Backend Data)         │
        │                         │
        │ • Personal Access Token │
        │ • Base ID              │
        │ • Read Tables & Records│
        └─────────────────────────┘
```

## 📊 Data Flow

### 1️⃣ Initialization
```
User opens website
    ↓
app.js loads
    ↓
Configuration loaded (Token + Base ID)
    ↓
Airtable API request: GET /meta/bases/{BASE_ID}/tables
    ↓
Tables fetched (each table = one category)
    ↓
For each table: Fetch all records
    ↓
Store in appState.records
    ↓
Render categories view
```

### 2️⃣ Category View
```
Airtable Tables          →    Ecopedia Categories
─────────────────              ──────────────────
Animals (5 records)      →    [Animals] 5 articles
Plants (3 records)       →    [Plants] 3 articles
Minerals (8 records)     →    [Minerals] 8 articles
```

### 3️⃣ Article View
```
Airtable Record          →    Ecopedia Article
──────────────────              ─────────────
Field 1: "Lion"          →    Title: Lion
Field 2: "Large cat..."  →    Section 1: Description
Field 3: "Africa"        →    Section 2: Habitat
Field 4: ["Meat", "..."] →    Section 3: Diet (as list)
```

## 🔄 Key Components

### HTML (index.html)
- **Header**: Title, subtitle, search bar
- **Sidebar**: Category navigation
- **Main Content**: Four view containers
  1. Categories view (grid of all tables)
  2. Articles list view (records in category)
  3. Article detail view (full article content)
  4. Search results view
- **Footer**: Attribution

### CSS (styles.css)
- Wikipedia color scheme and typography
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Print-friendly styling

### JavaScript (app.js)
- **Airtable Integration**
  - `fetchTablesAndRecords()`: Get all tables and records
  - `fetchTableRecords()`: Handle pagination
  
- **Rendering Functions**
  - `renderCategoriesView()`: Show all tables as cards
  - `showCategoryArticles()`: List records in table
  - `showArticle()`: Display full article
  - `displaySearchResults()`: Show search matches
  
- **Event Handling**
  - Click navigation between views
  - Search functionality (full-text)
  - Back button navigation

## 🔐 Security

- **Token Storage**: Stored in `app.js` (locally in browser)
- **API Calls**: Direct to Airtable from browser
- **Data**: Only your Airtable is accessed
- **No Backend Needed**: 100% static site

⚠️ **Important**: Your Airtable token is visible in the browser. Consider:
- Using a view-only token
- Restricting token to specific tables
- Never using personal data in Airtable

## 📱 Responsive Breakpoints

```
Mobile    (<480px)  → Single column, large text
Tablet    (480-768) → Sidebar hidden, single column
Desktop   (768+)    → Full layout with sidebar
```

## 🚀 Deployment Flow

```
Local Development
    ↓
Test in browser
    ↓
Add/Commit changes
    ↓
git push origin main
    ↓
GitHub receives push
    ↓
GitHub Pages builds & deploys
    ↓
Your site live at:
https://USERNAME.github.io/ecopedia
```

## 🔄 How Data Updates

```
You update Airtable
    ↓ (automatic)
(No rebuild needed)
    ↓
Visitor refreshes page
    ↓
app.js fetches latest data from Airtable
    ↓
New content appears
```

**Update Latency**: Instant (limited only by Airtable's response time)

## 🎨 Customization Points

| Element | File | Line Range |
|---------|------|------------|
| Site title/subtitle | index.html | 30-31 |
| Header styling | styles.css | 50-80 |
| Colors | styles.css | 8-14 |
| Search functionality | app.js | 350-400 |
| Airtable token | app.js | 4-7 |
| Field rendering logic | app.js | 210-260 |

## 📊 Sample Data Structure

### Airtable Base
```
Table: "Animals"
├─ Lion
│  ├─ Name: "Lion"
│  ├─ Description: "Large feline predator"
│  └─ Conservation: "Vulnerable"
└─ Elephant
   ├─ Name: "Elephant"
   ├─ Description: "Largest land mammal"
   └─ Conservation: "Endangered"

Table: "Plants"
├─ Oak
│  ├─ Name: "Oak"
│  ├─ Type: "Tree"
│  └─ Height: "30 meters"
```

### Resulting Website
```
Ecopedia (Home)
├─ [Animals] 2 articles
│  ├─ Lion
│  │  ├─ Description: Large feline predator
│  │  └─ Conservation: Vulnerable
│  └─ Elephant
│     ├─ Description: Largest land mammal
│     └─ Conservation: Endangered
└─ [Plants] 1 article
   └─ Oak
      ├─ Type: Tree
      └─ Height: 30 meters
```

## 🔧 Technical Stack

| Layer | Technology |
|-------|-----------|
| Hosting | GitHub Pages (static) |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Airtable API v0 |
| Auth | Personal Access Token (Bearer) |
| API Format | REST JSON |

## 📈 Performance

- **Load Time**: < 1 second (static HTML + CSS)
- **Airtable Requests**: ~1 per page load
- **Rate Limit**: 5 req/sec (free tier)
- **Page Size**: ~150 KB

---

**Ready to deploy?** Follow the README.md for setup instructions!
