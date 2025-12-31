// Configuration
const DEFAULT_SHEET_ID = '1j8_yIbgDcms0zs7Sa_fC7yuwkraV0rgG7IUtVGJ7vDY';

// Define your tabs (sheets) - each tab is a category
// Format: { name: 'Category Name', gid: '0' }
// To find GID: Open the tab in Google Sheets, look at URL: #gid=XXXXXX
const SHEET_TABS = [
    { name: 'Main', gid: '0' },  // First sheet is always gid=0
    // Add more tabs here:
    // { name: 'Items', gid: '123456' },
    // { name: 'NPCs', gid: '789012' },
];

// State
let sheetId = localStorage.getItem('ecopediaSheetId') || DEFAULT_SHEET_ID;
let allItems = [];
let categories = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    
    // If DEFAULT_SHEET_ID is set, load data directly
    if (sheetId && sheetId !== 'YOUR_SHEET_ID_HERE') {
        showMain();
        loadData();
    } else {
        showSetup();
    }
}

function setupEventListeners() {
    // Setup
    document.getElementById('saveSheetId')?.addEventListener('click', saveSheetIdFromSetup);
    
    // Settings
    document.getElementById('settingsBtn')?.addEventListener('click', openSettings);
    document.getElementById('updateSheetId')?.addEventListener('click', updateSheetId);
    document.getElementById('clearSheetId')?.addEventListener('click', clearSheetId);
    
    // Modal close
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Click outside modal
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });
    
    // Reload
    document.getElementById('reloadData')?.addEventListener('click', loadData);
}

function showSetup() {
    document.getElementById('setupSection').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
}

function showMain() {
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function saveSheetIdFromSetup() {
    const input = document.getElementById('sheetIdInput').value.trim();
    if (!input) {
        showStatus('setupStatus', 'Please enter a Sheet ID', 'error');
        return;
    }
    
    sheetId = input;
    localStorage.setItem('ecopediaSheetId', sheetId);
    showStatus('setupStatus', 'Loading data...', 'info');
    
    setTimeout(() => {
        loadData();
    }, 500);
}

function updateSheetId() {
    const input = document.getElementById('settingsSheetId').value.trim();
    if (!input) {
        showStatus('settingsStatus', 'Please enter a Sheet ID', 'error');
        return;
    }
    
    sheetId = input;
    localStorage.setItem('ecopediaSheetId', sheetId);
    showStatus('settingsStatus', 'Reloading data...', 'info');
    
    setTimeout(() => {
        closeModals();
        loadData();
    }, 500);
}

function clearSheetId() {
    if (confirm('Clear settings and start over?')) {
        localStorage.removeItem('ecopediaSheetId');
        sheetId = null;
        allItems = [];
        categories = [];
        closeModals();
        showSetup();
    }
}

function openSettings() {
    document.getElementById('settingsSheetId').value = sheetId || '';
    document.getElementById('settingsModal').classList.add('active');
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showStatus(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.className = type;
        el.style.display = 'block';
        
        if (type !== 'info') {
            setTimeout(() => {
                el.style.display = 'none';
            }, 4000);
        }
    }
}

// Load data from Google Sheets
async function loadData() {
    if (!sheetId) return;
    
    try {
        allItems = [];
        categories = [];
        
        // Load each tab (category)
        for (const tab of SHEET_TABS) {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${tab.gid}`;
            const response = await fetch(csvUrl);
            
            if (!response.ok) {
                console.error(`Failed to load tab: ${tab.name}`);
                continue;
            }
            
            const csvText = await response.text();
            parseTabData(csvText, tab.name);
        }
        
        if (allItems.length === 0) {
            showNoData();
        } else {
            categories = [...new Set(allItems.map(item => item.category))];
            renderCategories();
            renderItems();
            showMain();
        }
        
    } catch (error) {
        console.error('Load error:', error);
        alert('Error loading data: ' + error.message);
    }
}

function parseTabData(csvText, categoryName) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return;
    
    // Parse headers (first row)
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length > 0 && values[0].trim()) {
            const item = {
                id: `item-${categoryName}-${i}`,
                category: categoryName,
                fields: {}
            };
            
            // Map all columns dynamically
            headers.forEach((header, index) => {
                if (header && values[index]) {
                    let value = values[index].trim();
                    
                    // Convert Google Drive links for image fields
                    if (header.toLowerCase().includes('image') || 
                        header.toLowerCase().includes('תמונה') ||
                        header.toLowerCase().includes('pic')) {
                        value = convertGoogleDriveLink(value);
                    }
                    
                    item.fields[header] = value;
                }
            });
            
            // Set title (use first non-empty field or first field)
            item.title = item.fields[headers[0]] || 'Untitled';
            
            // Find image field
            const imageField = headers.find(h => 
                h.toLowerCase().includes('image') || 
                h.toLowerCase().includes('תמונה') ||
                h.toLowerCase().includes('pic')
            );
            item.image = imageField ? item.fields[imageField] : 'img/default.jpg';
            
            allItems.push(item);
        }
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

function renderCategories() {
    const container = document.getElementById('categoriesFilter');
    container.innerHTML = '';
    
    // All button
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => filterByCategory('all');
    container.appendChild(allBtn);
    
    // Category buttons
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat;
        btn.onclick = () => filterByCategory(cat);
        container.appendChild(btn);
    });
}

function filterByCategory(cat) {
    currentFilter = cat;
    
    // Update button states
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((cat === 'all' && btn.textContent === 'All') || btn.textContent === cat) {
            btn.classList.add('active');
        }
    });
    
    renderItems();
}

function renderItems() {
    const container = document.getElementById('itemsGrid');
    container.innerHTML = '';
    
    const filtered = currentFilter === 'all' 
        ? allItems 
        : allItems.filter(item => item.category === currentFilter);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem; color: #8ab4b8;">No items in this category</p>';
        return;
    }
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.onclick = () => showItemDetail(item);
        
        // Get first field value for preview
        const firstField = Object.values(item.fields)[1] || Object.values(item.fields)[0] || '';
        const preview = firstField.substring(0, 100) + (firstField.length > 100 ? '...' : '');
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='img/default.jpg'">
            <div class="item-card-content">
                <div class="item-category">${item.category}</div>
                <h3>${item.title}</h3>
                <p>${preview}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function showItemDetail(item) {
    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalCategory').textContent = item.category;
    
    // Display all fields dynamically
    let detailsHTML = '';
    Object.entries(item.fields).forEach(([key, value]) => {
        if (value) {
            detailsHTML += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    });
    
    document.getElementById('modalDescription').innerHTML = detailsHTML;
    document.getElementById('itemModal').classList.add('active');
}

function showNoData() {
    document.getElementById('noDataMessage').style.display = 'block';
    document.getElementById('itemsGrid').style.display = 'none';
    document.getElementById('categoriesFilter').style.display = 'none';
    showMain();
}

// Convert Google Drive share links to direct image URLs
function convertGoogleDriveLink(url) {
    if (!url) return 'img/default.jpg';
    
    // If already a direct URL, return as is
    if (url.startsWith('http') && !url.includes('drive.google.com')) {
        return url;
    }
    
    // Convert Google Drive sharing link to direct image
    // From: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // To: https://drive.google.com/uc?export=view&id=FILE_ID
    
    let fileId = null;
    
    // Try to extract file ID from various Google Drive URL formats
    if (url.includes('drive.google.com/file/d/')) {
        fileId = url.split('/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
    } else if (url.includes('drive.google.com') && url.includes('/open?id=')) {
        fileId = url.split('open?id=')[1].split('&')[0];
    }
    
    if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    // If not a Google Drive link, return as is (local path or other URL)
    return url;
}
