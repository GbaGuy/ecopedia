// Configuration - Set your Google Sheet ID here!
const DEFAULT_SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your actual Sheet ID

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
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        
        if (!response.ok) {
            throw new Error('Failed to load sheet. Make sure it\'s shared publicly.');
        }
        
        const csvText = await response.text();
        parseData(csvText);
        
        if (allItems.length === 0) {
            showNoData();
        } else {
            renderCategories();
            renderItems();
            showMain();
        }
        
    } catch (error) {
        console.error('Load error:', error);
        alert('Error loading data: ' + error.message);
    }
}

function parseData(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
        allItems = [];
        return;
    }
    
    allItems = [];
    categories = [];
    
    // Skip header (line 0)
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length >= 2 && values[0].trim()) {
            const category = values[0].trim();
            const description = values[1].trim();
            let image = values.length >= 3 ? values[2].trim() : 'img/default.jpg';
            
            // Convert Google Drive links to direct image URLs
            image = convertGoogleDriveLink(image);
            
            const item = {
                id: `item-${i}`,
                category: category,
                description: description,
                image: image,
                title: description.substring(0, 60) + (description.length > 60 ? '...' : '')
            };
            
            allItems.push(item);
            
            // Collect unique categories
            if (!categories.includes(category)) {
                categories.push(category);
            }
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
        
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" onerror="this.src='img/default.jpg'">
            <div class="item-card-content">
                <div class="item-category">${item.category}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function showItemDetail(item) {
    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalTitle').textContent = item.description.substring(0, 100);
    document.getElementById('modalCategory').textContent = item.category;
    document.getElementById('modalDescription').textContent = item.description;
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
