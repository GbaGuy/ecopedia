# Ecopedia - Quick Start Guide (עברית)

## שלב 1: קבל את פרטי ה-Airtable שלך

### Personal Access Token
1. לך ל-https://airtable.com/account/api
2. לחץ על "Create new token"
3. שם את הטוקן: "Ecopedia"
4. בחר את ההרשאות הבאות:
   - `data.records:read` (קריאת רשומות)
   - `schema.bases:read` (קריאת מבנה בסיס הנתונים)
5. לחץ "Create token" **וגם עותק** (לא תראה אותו שוב!)

### Base ID
1. פתח את ה-Airtable שלך
2. כתובת האתר נראית כך: `https://airtable.com/app{BASE_ID}/...`
3. העתק את ה-`{BASE_ID}`

## שלב 2: עדכן את ה-Configuration

1. פתח את הקובץ `app.js`
2. מצא את החלק הזה בהתחלה:
```javascript
const CONFIG = {
    AIRTABLE_TOKEN: 'YOUR_AIRTABLE_TOKEN_HERE',
    BASE_ID: 'YOUR_BASE_ID_HERE'
};
```

3. החלף ב:
```javascript
const CONFIG = {
    AIRTABLE_TOKEN: 'YOUR_TOKEN_HERE',
    BASE_ID: 'appXXXXXXXXXXXXXX'
};
```

## שלב 3: ארגן את Airtable שלך

**המבנה:**
- כל **טבלה** ב-Airtable → **קטגוריה** באתר
- כל **רשומה** בטבלה → **ערך (article)** באתר
- **השדה הראשון** = כותרת הערך
- **השדות הנוספים** = חלקים בערך

**דוגמה:**
```
טבלה: "חיות"
  רשומה: "אריה"
    - כותרת: "אריה"
    - תיאור: "אריה הוא חתול גדול..."
    - בית גידול: "אפריקה ואסיה"
    - סטטוס שימור: "פגיע"

התוצאה: קטגוריה "חיות" → ערך "אריה" עם חלקים
```

## שלב 4: דיפלוי ל-GitHub Pages

1. **עדכן את הקובץ:**
```bash
git add app.js
git commit -m "Update Airtable credentials"
git push origin main
```

2. **הפעל GitHub Pages:**
   - כנס לגדרי המאגר (Repository Settings)
   - בחר "Pages" מהתפריט
   - בחר "Deploy from a branch"
   - בחר את ענף `main`
   - לחץ "Save"

3. **גש לאתר שלך:**
   - `https://YOUR_USERNAME.github.io/ecopedia`

## טיפים

### בדוק את הנתונים שלך
בקונסולת הדפדפן (F12) תראה:
- כמה טבלאות נטענו
- כמה רשומות בכל טבלה
- שגיאות API אם יש

### שנה את השם של האתר
בקובץ `index.html`:
```html
<h1 class="wiki-title">Ecopedia</h1>
<p class="wiki-subtitle">The Free Encyclopedia</p>
```

### שנה את הצבעים
בקובץ `styles.css` בתחילת הקובץ:
```css
:root {
    --wiki-blue: #3366cc;      /* כחול ראשי */
    --wiki-light-blue: #f5f7fa; /* כחול בהיר */
    --wiki-text: #202122;       /* טקסט */
    --wiki-link: #0645ad;       /* קישורים */
}
```

## פתרון בעיות

**"Configuration Error" מופיע**
- בדוק שהקלדת את הטוקן ו-Base ID נכון
- וודא שיש לטוקן את ההרשאות הנכונות

**אין תוכן**
- וודא שיש בבסיס נתונים שלך טבלאות ורשומות
- בדוק קונסולה (F12) לשגיאות

**החיפוש לא עובד**
- וודא שיש בזשומות שדות עם טקסט
- נסה חיפוש של מילים שיודעת שיש בנתונים

## משאבים

- [Airtable API Documentation](https://airtable.com/api)
- [GitHub Pages](https://pages.github.com/)
- [Wikipedia Style Guide](https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style)

---

בהצלחה! 🚀
