# Google Sheets Setup Guide for Ecopedia

This is the simple way to manage your wiki data - directly in a Google Sheet that everyone can edit!

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Spreadsheet"**
3. Name it: `Ecopedia Items` (or whatever you like)
4. You now have a blank sheet!

## Step 2: Upload Images to Google Drive

1. Go to [Google Drive](https://drive.google.com)
2. Create a folder called `Ecopedia Images` (optional)
3. Upload your images (JPG, PNG, etc.)
4. **For each image:**
   - Right-click → **Share**
   - Change to: **"Anyone with the link can view"**
   - Click **Copy link**
   - Save this link!

### Example Image Link:
```
https://drive.google.com/file/d/1ABC123def456GHI789jkl/view?usp=sharing
```

## Step 3: Set Up the Columns

In your Google Sheet, create these 3 simple columns in Row 1:
- **A: Category** - סוג הפריט (חפץ, תושב קבע, אחר, וכו')
- **B: Description** - תיאור הפריט
- **C: Image** - קישור לתמונה מ-Google Drive

### Example Rows:
```
Category     | Description                          | Image
חפץ          | חרב זהב עתיקה מהמקדש                 | https://drive.google.com/file/d/1ABC123.../view
תושב קבע     | איש זקן שמוכר שיקויים               | https://drive.google.com/file/d/1XYZ789.../view
אחר          | מפה של האזור המסתורי                | https://drive.google.com/file/d/1DEF456.../view
```

**Important:** 
- **Category** can be anything you want (חפץ, תושב קבע, מקום, אחר, etc.)
- **Description** is free text - describe the item
- **Image** should be the full Google Drive sharing link

## Step 4: Get Your Sheet ID

From your shared link, find the Sheet ID:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMoons8J2A...../edit?usp=...
                                          ^ Copy this long ID
```

The Sheet ID is the long string of letters and numbers between `/d/` and `/edit`

**Example ID:** `1BxiMVs0XRA5nFMoons8J2AbCdEfGhIjKlMnOpQrS`

## Step 5: Share Your Google Sheet

1. In your Google Sheet, click **Share** (top right)
2. Set to **"Anyone with the link can view"** (not edit!)
3. Click **Done**

## Step 6: Enter Settings in Ecopedia

1. Open your Ecopedia site
2. Click **⚙️ Admin** button
3. You should see **📊 Google Sheets Setup** section
4. Paste your Sheet ID
5. Enter sheet name (usually `Sheet1` or whatever you named it)
6. Click **"Save Google Sheets Settings"**
7. You should see: ✅ Google Sheets settings saved!

## Step 6: Sync Your Data

1. Click the **"Save & Sync"** tab in admin panel
2. Click **"📥 Sync from Google Sheet"**
3. Your data from the Google Sheet loads into the wiki!

## Step 7: Share with Your Team

1. Share the Google Sheet link with team members
2. They can edit rows directly in the sheet
3. You (or anyone with admin access) can click "Sync from Google Sheet" to pull in their changes
4. Click "📥 Download JSON" to backup your data

---

## How It Works

```
Google Sheet (shared with team)
        ↓
    [You click Sync]
        ↓
  Ecopedia Admin Panel (loads data)
        ↓
  Wiki Site (displays to everyone)
```

**Flow:**
1. Team edits the Google Sheet
2. You click "Sync from Google Sheet" in admin panel
3. Wiki automatically updates with new items
4. Changes go live on the website

---

## Tips & Tricks

### Add Images Easily

1. Keep images in `docs/img/[category]/`
2. In your Google Sheet, just write the path: `img/creatures/dragon.jpg`
3. The wiki will find the image automatically

### Team Collaboration

- Share the Google Sheet with your team
- Multiple people can edit at once
- When someone adds a row, click "Sync" to pull it in
- No coding knowledge needed!

### Backup Your Data

- Always click "📥 Download JSON" after syncing
- This creates a backup file
- Store it somewhere safe

### Categories

Your **Category** can be anything:
- חפץ (item)
- תושב קבע (NPC)
- מקום (location)
- אחר (other)
- Or any custom category you want!

The wiki will automatically group items by category.

---

## Troubleshooting

### "Could not fetch Google Sheet"
- Make sure you shared the sheet (Share button → Anyone with link can edit)
- Copy the Sheet ID correctly
- Wait 1-2 minutes after sharing before syncing

### Items not appearing
- Check Sheet Name is correct (usually `Sheet1`)
- Make sure **Category** column (A) has values
- Verify **Description** column (B) has values

### Images not showing
- Make sure images are shared: "Anyone with link can view"
- Copy the full Google Drive link including the file ID
- The wiki automatically converts Google Drive links to direct images
- Example: `https://drive.google.com/file/d/1ABC123.../view`

### Missing columns
- You need exactly 3 columns: **Category, Description, Image**
- Leave cells blank if you don't have an image
- Row 1 should have headers

---

## Example Google Sheet

| Category | Description | Image |
|----------|-------------|-------|
| חפץ | חרב זהב עתיקה מהמקדש הקדום | https://drive.google.com/file/d/1ABC123.../view |
| תושב קבע | איש זקן שמוכר שיקויים בכפר | https://drive.google.com/file/d/1XYZ789.../view |
| מקום | ספרייה עתיקה מלאה בידע | https://drive.google.com/file/d/1DEF456.../view |
| אחר | מפה של האזור המסתורי | https://drive.google.com/file/d/1GHI012.../view |

**Note:** All images are uploaded to Google Drive and shared with "Anyone with link can view"

---

## Next Steps

1. Create your Google Sheet
2. Add your wiki items to it
3. Sync with Ecopedia admin panel
4. Share the wiki with your friends!
5. Keep the sheet updated as your wiki grows

---

**That's it!** No Firebase, no complicated setup. Just a simple Google Sheet that everyone can edit. 🎉
