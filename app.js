// ============================================
// Ecopedia - Supabase-powered Wiki
// ============================================

// Supabase Configuration
const SUPABASE_URL = 'https://wptdmhkwedfmmfhdhqvb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PIv1EaFEjNa7E5xbvsNTUg_NFGblxrq';

// Initialize Supabase
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Application State
let appState = {
    categories: {},
    allArticles: [],
    currentView: 'categories',
    currentCategory: null,
    searchResults: []
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeApp();
        setupEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to load data. Please refresh the page.');
    }
});

async function initializeApp() {
    console.log('📱 Initializing Ecopedia with Supabase...');
    
    // Fetch all records
    const { data: records, error } = await supabase
        .from('records')
        .select('*')
        .order('category', { ascending: true });
    
    if (error) {
        throw new Error(`Failed to fetch records: ${error.message}`);
    }
    
    console.log(`✅ Loaded ${records.length} records from Supabase`);
    
    // Organize records by category
    organizeByCategory(records);
    renderCategoriesView();
}

function organizeByCategory(records) {
    appState.categories = {};
    appState.allArticles = [];
    
    records.forEach(record => {
        const category = record.category || 'Uncategorized';
        const title = record.title || 'Untitled';
        
        // Initialize category if needed
        if (!appState.categories[category]) {
            appState.categories[category] = [];
        }
        
        // Create article object
        const article = {
            id: record.id,
            category,
            title,
            content: record.content || '',
            created_at: record.created_at
        };
        
        appState.categories[category].push(article);
        appState.allArticles.push(article);
        
        console.log(`📄 Record: ${category} → ${title}`);
    });
    
    console.log('📚 Categories:', Object.keys(appState.categories));
}

// ============================================
// View Rendering Functions
// ============================================

function renderCategoriesView() {
    hideAllViews();
    document.getElementById('categories-view').style.display = 'block';
    
    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = '';
    
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
        <div class="category-card-count">${articleCount} article${articleCount !== 1 ? 's' : ''}</div>
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
    
    articles.forEach((article, index) => {
        const item = createArticleItem(article);
        articlesList.appendChild(item);
    });
    
    updateSidebarNav(categoryName);
}

function createArticleItem(article) {
    const item = document.createElement('a');
    item.className = 'article-item';
    item.href = '#';
    
    const preview = article.content.substring(0, 150) || 'No description';
    
    item.innerHTML = `
        <div class="article-item-title">${escapeHtml(article.title)}</div>
        <div class="article-item-preview">${escapeHtml(preview)}</div>
    `;
    
    item.addEventListener('click', (e) => {
        e.preventDefault();
        showArticle(article);
    });
    
    return item;
}

function showArticle(article) {
    appState.currentView = 'article';
    appState.currentArticle = article;
    hideAllViews();
    document.getElementById('article-view').style.display = 'block';
    
    const content = article.content 
        ? article.content.replace(/\n/g, '<br>')
        : '<p>No content available.</p>';
    
    document.getElementById('article-title').textContent = escapeHtml(article.title);
    document.getElementById('article-category').innerHTML = 
        `<a href="#" onclick="showCategoryArticles('${escapeHtml(article.category)}'); return false;">${escapeHtml(article.category)}</a>`;
    document.getElementById('article-content').innerHTML = `<p>${content}</p>`;
    
    updateSidebarNav(article.category);
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
    
    // Home link
    const homeLink = document.createElement('a');
    homeLink.className = 'category-link';
    if (!activeCategory) homeLink.classList.add('active');
    homeLink.href = '#';
    homeLink.textContent = '← Home';
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCategoriesView();
    });
    nav.appendChild(homeLink);
    
    // Category links
    Object.keys(appState.categories).forEach(categoryName => {
        const link = document.createElement('a');
        link.className = 'category-link';
        if (categoryName === activeCategory) link.classList.add('active');
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
        renderCategoriesView();
        return;
    }
    
    appState.searchResults = [];
    const lowerQuery = query.toLowerCase();
    
    appState.allArticles.forEach(article => {
        if (article.title.toLowerCase().includes(lowerQuery) || 
            article.content.toLowerCase().includes(lowerQuery)) {
            appState.searchResults.push(article);
        }
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
    
    appState.searchResults.forEach(article => {
        const resultItem = document.createElement('a');
        resultItem.className = 'search-result-item';
        resultItem.href = '#';
        
        const preview = article.content.substring(0, 150) || 'No description';
        
        resultItem.innerHTML = `
            <div class="search-result-title">${escapeHtml(article.title)}</div>
            <div class="search-result-category">${escapeHtml(article.category)}</div>
            <div class="search-result-text">${escapeHtml(preview)}</div>
        `;
        
        resultItem.addEventListener('click', (e) => {
            e.preventDefault();
            showArticle(article);
        });
        
        searchResults.appendChild(resultItem);
    });
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Search
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
    errorDiv.style.cssText = 'padding: 1rem; background: #fee; color: #c33; border-radius: 4px; margin: 1rem;';
    errorDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.insertBefore(errorDiv, mainContent.firstChild);
}

// ============================================
// Export for debugging
// ============================================

window.ecopedia = {
    appState,
    supabase,
    performSearch,
    showArticle,
    showCategoryArticles,
    renderCategoriesView,
    initializeApp
};
