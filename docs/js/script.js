// הגדרות - רק צריך את ה-Sheet ID!
const SHEET_ID = '1j8_yIbgDcms0zs7Sa_fC7yuwkraV0rgG7IUtVGJ7vDY';

// אופציונלי: אם תרצה לקבע ידנית טאבים, מלא כאן. אחרת זה ייטען אוטומטית.
// דוגמה:
// const MANUAL_TABS = [ { name: 'חפצים', gid: '0' }, { name: 'תושבים', gid: '123456' } ];
const MANUAL_TABS = [];

let allData = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadData();
    renderCategories();
    renderItems();
}

async function loadData() {
    allData = [];

    // 1) אם הוגדרו טאבים ידניים – נשתמש בהם
    let tabs = MANUAL_TABS;

    // 2) אחרת ננסה להביא רשימת טאבים אוטומטית (דורש Publish to web לכל הגיליון)
    if (!tabs.length) {
        tabs = await fetchTabsAuto();
    }

    // 3) ואם לא הצלחנו להביא שמות, ננסה לנחש GID 0-20 כ fallback
    if (!tabs.length) {
        tabs = Array.from({ length: 21 }, (_, i) => ({ name: `טאב ${i + 1}`, gid: `${i}` }));
    }

    for (const tab of tabs) {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${tab.gid}`;

        try {
            const response = await fetch(url);
            if (!response.ok) continue;

            const csv = await response.text();
            const rows = parseCSV(csv);

            if (rows.length < 2) continue;

            const headers = rows[0];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row[0]) continue;

                const item = {
                    category: tab.name,
                    fields: {}
                };

                headers.forEach((header, index) => {
                    if (header && row[index]) {
                        let value = row[index];

                        // המרת לינק גוגל דרייב לתמונה
                        if (header.includes('תמונה') || header.includes('image')) {
                            const match = value.match(/\/d\/([a-zA-Z0-9_-]+)/);
                            if (match) {
                                value = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                            }
                        }

                        item.fields[header] = value;
                    }
                });

                allData.push(item);
            }

            console.log(`נטען טאב ${tab.name} (gid ${tab.gid})`);
        } catch (error) {
            console.error(`שגיאה בטעינת ${tab.name}:`, error);
            continue;
        }
    }

    console.log(`סה"כ נטענו ${allData.length} פריטים`);
}

function parseCSV(text) {
    const rows = [];
    let current = '';
    let row = [];
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
        } else if (char === '\n' && !inQuotes) {
            row.push(current.trim());
            rows.push(row);
            row = [];
            current = '';
        } else {
            current += char;
        }
    }
    
    if (current || row.length) {
        row.push(current.trim());
        rows.push(row);
    }
    
    return rows;
}

// ניסיון להביא שמות טאבים אוטומטית (דורש Publish to web)
async function fetchTabsAuto() {
    try {
        const url = `https://spreadsheets.google.com/feeds/worksheets/${SHEET_ID}/public/full?alt=json`;
        const response = await fetch(url);
        if (!response.ok) return [];

        const data = await response.json();
        if (!data.feed || !data.feed.entry) return [];

        return data.feed.entry.map(entry => {
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'http://schemas.google.com/visualization/2008/visualizationApi');
            const gidMatch = link ? link.href.match(/gid=(\d+)/) : null;
            const gid = gidMatch ? gidMatch[1] : '0';
            return { name: title, gid };
        });
    } catch (e) {
        console.warn('לא הצלחתי להביא טאבים אוטומטית (כנראה לא פורסם ל-web)', e);
        return [];
    }
}

function renderCategories() {
    const container = document.getElementById('categories');
    const categories = ['all', ...new Set(allData.map(item => item.category))];
    
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === currentCategory ? 'active' : ''}" 
                onclick="filterCategory('${cat}')">
            ${cat === 'all' ? 'הכל' : cat}
        </button>
    `).join('');
}

function filterCategory(category) {
    currentCategory = category;
    renderCategories();
    renderItems();
}

function renderItems() {
    const container = document.getElementById('items');
    const filtered = currentCategory === 'all' 
        ? allData 
        : allData.filter(item => item.category === currentCategory);
    
    container.innerHTML = filtered.map(item => {
        let html = `<div class="item">`;
        html += `<div class="category">${item.category}</div>`;
        
        Object.entries(item.fields).forEach(([key, value]) => {
            if (key.includes('תמונה') || key.includes('image')) {
                html += `<img src="${value}" alt="${key}">`;
            } else {
                html += `<div class="field">`;
                html += `<div class="field-name">${key}</div>`;
                html += `<div class="field-value">${value}</div>`;
                html += `</div>`;
            }
        });
        
        html += `</div>`;
        return html;
    }).join('');
}
