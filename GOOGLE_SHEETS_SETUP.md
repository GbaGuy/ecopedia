# Google Sheets Setup Guide for Ecopedia

This is the simple way to manage your wiki data - directly in a Google Sheet that everyone can edit!

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Spreadsheet"**
3. Name it: `Ecopedia Items` (or whatever you like)
4. You now have a blank sheet!

## Step 2: Set Up the Columns

In your Google Sheet, create these columns in Row 1:
- **A:** Name
- **B:** Category
- **C:** Image
- **D:** Rarity
- **E:** Description
- **F:** Details
- **G:** Traits
- **H:** Habitat

### Example Row (Row 2):
```
Name              | Category  | Image                      | Rarity | Description        | Details            | Traits           | Habitat
Verdant Dragon    | creatures | img/creatures/dragon.jpg  | Rare   | A green dragon     | Lives in forests  | Flying, Magic    | Forest
```

**Important:** 
- **Traits** should be separated by semicolons (`;`) - e.g., `Flying; Magic; Dragon`
- **Image** paths should start with `img/`
- **Category** must match one of your categories (creatures, plants, locations, equipment, etc.)

## Step 3: Share Your Sheet

1. Click **Share** (top right)
2. Set to **"Anyone with the link can edit"**
3. Copy the link - it contains your Sheet ID in the URL

## Step 4: Get Your Sheet ID

From your shared link, find the Sheet ID:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMoons8J2A...../edit?usp=...
                                          ^ Copy this long ID
```

The Sheet ID is the long string of letters and numbers between `/d/` and `/edit`

**Example ID:** `1BxiMVs0XRA5nFMoons8J2AbCdEfGhIjKlMnOpQrS`

## Step 5: Enter Settings in Ecopedia

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

Make sure your item's **Category** matches one of your categories:
- creatures
- plants
- locations
- equipment
- (or any custom categories you created)

---

## Troubleshooting

### "Could not fetch Google Sheet"
- Make sure you shared the sheet (Share button → Anyone with link can edit)
- Copy the Sheet ID correctly
- Wait 1-2 minutes after sharing before syncing

### Items not appearing
- Check Sheet Name is correct (usually `Sheet1`)
- Make sure **Name** column (A) has values
- Verify **Category** matches an existing category

### Images not showing
- Image paths must start with `img/`
- Check the path matches your actual image location
- Example: `img/creatures/dragon.jpg`

### Missing columns
- All columns should be: Name, Category, Image, Rarity, Description, Details, Traits, Habitat
- Leave cells blank if you don't have data for them
- Row 1 should have headers

---

## Example Google Sheet

| Name | Category | Image | Rarity | Description | Details | Traits | Habitat |
|------|----------|-------|--------|-------------|---------|--------|---------|
| Verdant Dragon | creatures | img/creatures/dragon.jpg | Rare | A majestic green dragon | Breathes fire and magic | Flying; Magical; Dragon | Mountains |
| Crystal Fern | plants | img/plants/fern.jpg | Common | A shimmering fern | Glows at night | Glowing; Rare Herb | Forest Floor |
| Ancient Library | locations | img/locations/library.jpg | Legendary | Secret knowledge store | Protected by guardians | Historic; Magic | Underground |

---

## Next Steps

1. Create your Google Sheet
2. Add your wiki items to it
3. Sync with Ecopedia admin panel
4. Share the wiki with your friends!
5. Keep the sheet updated as your wiki grows

---

**That's it!** No Firebase, no complicated setup. Just a simple Google Sheet that everyone can edit. 🎉
