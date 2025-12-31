// הגדרות - רק צריך את ה-Sheet ID!
const SHEET_ID = '1j8_yIbgDcms0zs7Sa_fC7yuwkraV0rgG7IUtVGJ7vDY';

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
    
    // קורא טאבים אוטומטית (מנסה GID 0-20)
    for (let gid = 0; gid <= 20; gid++) {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            
            const csv = await response.text();
            const rows = parseCSV(csv);
            
            if (rows.length < 2) continue;
            
            const headers = rows[0];
            
            // שם הקטגוריה מהעמודה הראשונה או מספר הטאב
            const categoryName = `קטגוריה ${gid + 1}`;
            
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row[0]) continue;
                
                const item = {
                    category: categoryName,
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
            
            console.log(`נטען טאב GID ${gid} - ${categoryName}`);
        } catch (error) {
            // סיימנו את כל הטאבים הקיימים
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
