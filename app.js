// ============================================
// Ecopedia - Airtable-powered Wiki
// ============================================

// Configuration - UPDATE THESE WITH YOUR VALUES
const CONFIG = {
    // Get your Airtable Personal Access Token from https://airtable.com/account/api
    AIRTABLE_TOKEN: 'patbBdVmYmUenU3tn.2a45dd438b0539b40bf6fa9366968dc79e3ed752950f04f5d58cefb92c8aad42',
    // Get your Base ID from your Airtable workspace
    BASE_ID: 'appFhnPRMRFzdcbds'
};

// Application State
let appState = {
    tables: [],
    records: {},
    categoriesTable: null, // Reference to the categories table
    categoriesMappings: {}, // Maps table names to their categories
    currentView: 'categories', // categories, articles, article
    currentCategory: null,
    currentArticle: null,
    searchResults: []
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    if (!validateConfig()) {
        showError('Configuration Error: Please update CONFIG with your Airtable credentials.');
        return;
    }

    await initializeApp();
    setupEventListeners();
});

function validateConfig() {
    return CONFIG.AIRTABLE_TOKEN !== 'YOUR_AIRTABLE_TOKEN_HERE' &&
           CONFIG.BASE_ID !== 'YOUR_BASE_ID_HERE';
}

async function initializeApp() {
    try {
        await fetchTablesAndRecords();
        renderCategoriesView();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load data from Airtable. Check your credentials.');
    }
}

// ============================================
// Airtable API Functions
// ============================================

async function fetchTablesAndRecords() {
    try {
        // Fetch all tables (bases have tables, we'll get field metadata)
        const baseUrl = `https://api.airtable.com/v0/meta/bases/${CONFIG.BASE_ID}/tables`;
        
        const response = await fetch(baseUrl, {
            headers: {
                'Authorization': `Bearer ${CONFIG.AIRTABLE_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        appState.tables = data.tables;

        // Find and fetch the categories table first
        appState.categoriesTable = appState.tables.find(t => t.name === 'קטגוריות');
        if (appState.categoriesTable) {
            await fetchTableRecords(appState.categoriesTable.id, appState.categoriesTable.name);
            // Build the mappings from categories table
            buildCategoryMappings();
        }

        // Fetch records for each table (except the categories table)
        for (const table of appState.tables) {
            if (table.name !== 'קטגוריות') {
                await fetchTableRecords(table.id, table.name);
            }
        }
        
        // Reorganize data by categories
        organizeByCategories();
    } catch (error) {
        console.error('Error fetching tables:', error);
        throw error;
    }
}

function buildCategoryMappings() {
    // From the קטגוריות table, create a mapping of table names to categories
    const categoryRecords = appState.records['קטגוריות'] || [];
    
    categoryRecords.forEach(record => {
        const fields = record.fields;
        const fieldNames = Object.keys(fields);
        
        // Get first field as table name, second as category
        const tableName = fields[fieldNames[0]]; // שם טבלה
        const category = fields[fieldNames[1]];   // קטגוריה שייכת ל
        
        if (tableName && category) {
            appState.categoriesMappings[String(tableName).trim()] = String(category).trim();
            console.log(`📋 Category Mapping: "${tableName}" → "${category}"`);
        }
    });
}

function organizeByCategories() {
    // Create a new structure: categories -> articles
    appState.categories = {};
    appState.allArticles = []; // Keep track of all articles for search
    
    // Iterate through all tables and records
    Object.entries(appState.records).forEach(([tableName, records]) => {
        // Skip the categories table itself
        if (tableName === 'קטגוריות') return;
        
        // Check if this table has a mapped category
        const mappedCategory = appState.categoriesMappings[tableName];
        
        records.forEach((record) => {
            const fields = record.fields;
            const fieldNames = Object.keys(fields);
            
            let category;
            
            if (mappedCategory) {
                // This table is mapped to a specific category
                category = mappedCategory;
            } else {
                // This table is its own category
                category = tableName;
            }
            
            // Initialize category if it doesn't exist
            if (!appState.categories[category]) {
                appState.categories[category] = [];
            }
            
            // Create article object
            const article = {
                tableName,
                record,
                fields,
                fieldNames
            };
            
            // Add article to category
            appState.categories[category].push(article);
            appState.allArticles.push({ ...article, category });
            
            console.log('📄 Article:', {
                tableName,
                category,
                title: fields[fieldNames[0]] || 'Untitled',
                fields: fieldNames
            });
        });
    });
    
    console.log('📚 Organized categories:', Object.keys(appState.categories));
}

async function fetchTableRecords(tableId, tableName) {
    try {
        const records = [];
        let offset = null;

        // Pagination loop
        do {
            const url = new URL(`https://api.airtable.com/v0/${CONFIG.BASE_ID}/${encodeURIComponent(tableId)}`);
            
            // Configure the request
            const params = {
                pageSize: 100,
                view: 'Grid view' // Default view name - adjust if needed
            };
            
            if (offset) {
                params.offset = offset;
            }

            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${CONFIG.AIRTABLE_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch records from ${tableName}`);
            }

            const data = await response.json();
            records.push(...data.records);
            offset = data.offset;
        } while (offset);

        appState.records[tableName] = records;
        console.log(`Loaded ${records.length} records from table: ${tableName}`);
    } catch (error) {
        console.error(`Error fetching records from ${tableName}:`, error);
    }
}

// ============================================
// View Rendering Functions
// ============================================

function renderCategoriesView() {
    hideAllViews();
    document.getElementById('categories-view').style.display = 'block';
    
    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = '';

    // Show categories from the organized data
    Object.entries(appState.categories).forEach(([categoryName, articles]) => {
        const card = createCategoryCard(categoryName, articles.length);
        categoriesGrid.appendChild(card);
    });

    updateSidebarNav();
}

function createCategoryCard(categoryName, articleCount) {
    const card = document.createElement('a');
    card.className = 'category-card';
    card.href = '#';
    card.innerHTML = `
        <div class="category-card-title">${escapeHtml(categoryName)}</div>
        <div class="category-card-count">${articleCount} articles</div>
    `;
    
    card.addEventListener('click', (e) => {
        e.preventDefault();
        showCategoryArticles(categoryName);
    });
    
    return card;
}

function showCategoryArticles(categoryName) {
    appState.currentView = 'articles';
    appState.currentCategory = categoryName;
    hideAllViews();
    document.getElementById('articles-view').style.display = 'block';
    
    document.getElementById('category-title').textContent = categoryName;
    
    const articles = appState.categories[categoryName] || [];
    const articlesList = document.getElementById('articles-list');
    articlesList.innerHTML = '';

    if (articles.length === 0) {
        articlesList.innerHTML = '<p class="no-results">No articles in this category.</p>';
        return;
    }

    articles.forEach((articleData, index) => {
        const item = createArticleItem(articleData, categoryName, index);
        articlesList.appendChild(item);
    });

    updateSidebarNav(categoryName);
}

function createArticleItem(articleData, categoryName, index) {
    const item = document.createElement('a');
    item.className = 'article-item';
    item.href = '#';

    const fields = articleData.fields;
    const fieldNames = articleData.fieldNames || Object.keys(fields);
    
    // Use first field as title (for tables that are their own category)
    // Or use first field as title for all cases
    const title = fields[fieldNames[0]] || `Article ${index + 1}`;
    
    // Use remaining fields as preview
    const preview = fieldNames.slice(1)
        .map(name => fields[name])
        .filter(v => typeof v === 'string')
        .join(' | ')
        .substring(0, 150) || 'No description';

    item.innerHTML = `
        <div class="article-item-title">${escapeHtml(String(title))}</div>
        <div class="article-item-preview">${escapeHtml(preview)}</div>
    `;

    item.addEventListener('click', (e) => {
        e.preventDefault();
        showArticle(articleData.record, articleData.fields, articleData.fieldNames);
    });

    return item;
}

function showArticle(record, fields, fieldNames = null) {
    appState.currentView = 'article';
    appState.currentArticle = { record, fields, fieldNames };
    hideAllViews();
    document.getElementById('article-view').style.display = 'block';

    const fNames = fieldNames || Object.keys(fields);
    // First field is title
    const title = fields[fNames[0]] || 'Untitled Article';
    const category = appState.currentCategory;
    const content = renderArticleContent(fields, fNames);

    document.getElementById('article-title').textContent = escapeHtml(String(title));
    document.getElementById('article-category').innerHTML = 
        `<a href="#" onclick="showCategoryArticles('${escapeHtml(String(category))}'); return false;">${escapeHtml(String(category))}</a>`;
    document.getElementById('article-content').innerHTML = content;

    updateSidebarNav(appState.currentCategory);
}

function renderArticleContent(fields, fieldNames = null) {
    let html = '';
    const fNames = fieldNames || Object.keys(fields);
    
    // Show ALL fields, skip none (since first field is title, not category)
    fNames.forEach((fieldName, index) => {
        const fieldValue = fields[fieldName];

        if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
            return;
        }

        html += `<section>`;

        // Add field name as section header
        html += `<h2>${escapeHtml(fieldName)}</h2>`;

        // Render different field types
        if (typeof fieldValue === 'string') {
            // Convert URLs to links
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const processedText = fieldValue
                .replace(/\n/g, '</p><p>')
                .replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
            html += `<p>${processedText}</p>`;
        } else if (Array.isArray(fieldValue)) {
            // Check if this is an attachments array
            if (fieldValue.length > 0 && typeof fieldValue[0] === 'object' && fieldValue[0].url) {
                // This is definitely an attachments field
                let hasImages = false;
                let imagesHtml = '';
                let otherHtml = '';
                
                fieldValue.forEach(attachment => {
                    if (!attachment.url) return;
                    
                    const filename = attachment.filename || '';
                    const url = attachment.url;
                    
                    // Check if it's an image - multiple ways
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(filename) ||
                                   (attachment.type && attachment.type.toLowerCase().includes('image')) ||
                                   url.includes('.png') || 
                                   url.includes('.jpg') || 
                                   url.includes('.jpeg') ||
                                   url.includes('.gif') ||
                                   url.includes('/image');
                    
                    console.log('📎 Attachment:', { 
                        filename, 
                        isImage, 
                        type: attachment.type,
                        urlContains: url.substring(url.length - 50)
                    });
                    
                    if (isImage) {
                        hasImages = true;
                        imagesHtml += `<figure style="margin: 1rem 0; text-align: center;">
                                        <img src="${url}" alt="${escapeHtml(filename)}" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                        ${filename ? `<figcaption style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">${escapeHtml(filename)}</figcaption>` : ''}
                                      </figure>`;
                    } else {
                        otherHtml += `<p><a href="${url}" target="_blank" class="wiki-link" download>📎 ${escapeHtml(filename || 'Download file')}</a></p>`;
                    }
                });
                
                html += imagesHtml + otherHtml;
            } else {
                // Regular array - show as list
                html += '<ul>';
                fieldValue.forEach(item => {
                    if (typeof item === 'string') {
                        html += `<li>${escapeHtml(item)}</li>`;
                    } else if (typeof item === 'object' && item.url) {
                        html += `<li><a href="${item.url}" target="_blank">${escapeHtml(item.filename || 'File')}</a></li>`;
                    }
                });
                html += '</ul>';
            }
        } else if (typeof fieldValue === 'object') {
            html += `<p>${escapeHtml(JSON.stringify(fieldValue, null, 2))}</p>`;
        } else {
            html += `<p>${escapeHtml(String(fieldValue))}</p>`;
        }

        html += `</section>`;
    });

    return html || '<p>No content available for this article.</p>';
}

function hideAllViews() {
    document.getElementById('categories-view').style.display = 'none';
    document.getElementById('articles-view').style.display = 'none';
    document.getElementById('article-view').style.display = 'none';
    document.getElementById('search-view').style.display = 'none';
}

// ============================================
// Sidebar Navigation
// ============================================

function updateSidebarNav(activeCategory = null) {
    const nav = document.getElementById('categories-nav');
    nav.innerHTML = '';

    // Add link to main page
    const homeLink = document.createElement('a');
    homeLink.className = 'category-link';
    if (!activeCategory) {
        homeLink.classList.add('active');
    }
    homeLink.href = '#';
    homeLink.textContent = '← Home';
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCategoriesView();
    });

    nav.appendChild(homeLink);

    // Add all categories
    Object.keys(appState.categories).forEach(categoryName => {
        const link = document.createElement('a');
        link.className = 'category-link';
        if (categoryName === activeCategory) {
            link.classList.add('active');
        }
        link.href = '#';
        link.textContent = categoryName;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            showCategoryArticles(categoryName);
        });

        nav.appendChild(link);
    });
}

// ============================================
// Search Functionality
// ============================================

function performSearch(query) {
    if (!query.trim()) {
        appState.currentView = 'categories';
        renderCategoriesView();
        return;
    }

    appState.searchResults = [];
    const lowerQuery = query.toLowerCase();

    // Search through all categories and articles
    Object.entries(appState.categories).forEach(([categoryName, articles]) => {
        articles.forEach((articleData) => {
            const fields = articleData.fields;
            let searchMatch = false;
            let matchedField = '';

            // Search in all fields
            Object.entries(fields).forEach(([fieldName, fieldValue]) => {
                const searchText = String(fieldValue).toLowerCase();
                if (searchText.includes(lowerQuery)) {
                    searchMatch = true;
                    matchedField = fieldName;
                }
            });

            if (searchMatch) {
                appState.searchResults.push({
                    record: articleData.record,
                    fields: articleData.fields,
                    category: categoryName,
                    matchedField
                });
            }
        });
    });

    displaySearchResults(query);
}

function displaySearchResults(query) {
    hideAllViews();
    document.getElementById('search-view').style.display = 'block';

    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (appState.searchResults.length === 0) {
        searchResults.innerHTML = `<p class="no-results">No results found for "${escapeHtml(query)}"</p>`;
        return;
    }

    appState.searchResults.forEach(result => {
        const resultItem = document.createElement('a');
        resultItem.className = 'search-result-item';
        resultItem.href = '#';

        const fields = result.fields;
        const fieldNames = Object.keys(fields);
        const title = fields[fieldNames[0]] || 'Untitled';
        const preview = fieldNames.slice(1)
            .map(name => fields[name])
            .find(v => typeof v === 'string') || 'No description';

        resultItem.innerHTML = `
            <div class="search-result-title">${escapeHtml(String(title))}</div>
            <div class="search-result-category">${escapeHtml(result.category)}</div>
            <div class="search-result-text">${escapeHtml(String(preview).substring(0, 150))}</div>
        `;

        resultItem.addEventListener('click', (e) => {
            e.preventDefault();
            showArticle(result.record, result.fields);
        });

        searchResults.appendChild(resultItem);
    });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        performSearch(query);
    });

    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('searchInput').value;
            performSearch(query);
        }
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (appState.currentCategory) {
            showCategoryArticles(appState.currentCategory);
        } else {
            renderCategoriesView();
        }
    });
}

// ============================================
// Utility Functions
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(errorDiv, mainContent.firstChild);
}

// ============================================
// Export for debugging
// ============================================

window.ecopedia = {
    appState,
    config: CONFIG,
    performSearch,
    showArticle,
    showCategoryArticles,
    renderCategoriesView
};
