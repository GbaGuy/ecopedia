let allItems = [];
let currentCategory = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
    setupEventListeners();
    displayAllItems();
});

// Load content from JSON
async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();
        allItems = data.items;
        renderCategories(data.categories);
        updateSiteTitle(data.site);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Update site title
function updateSiteTitle(site) {
    document.title = site.title;
    const logoTitle = document.querySelector('.logo h1');
    logoTitle.textContent = site.title;
}

// Render categories in navigation and sidebar
function renderCategories(categories) {
    const navContainer = document.getElementById('categoryNav');
    const sidebarContainer = document.getElementById('categoryList');

    navContainer.innerHTML = '';
    sidebarContainer.innerHTML = '';

    categories.forEach(category => {
        // Navigation link
        const navItem = document.createElement('a');
        navItem.textContent = `${category.icon} ${category.name}`;
        navItem.addEventListener('click', () => filterByCategory(category.id));
        navContainer.appendChild(navItem);

        // Sidebar link
        const sidebarItem = document.createElement('li');
        sidebarItem.textContent = `${category.icon} ${category.name}`;
        sidebarItem.dataset.categoryId = category.id;
        sidebarItem.addEventListener('click', () => filterByCategory(category.id));
        sidebarContainer.appendChild(sidebarItem);
    });

    // Add "All" category
    const allNavItem = document.createElement('a');
    allNavItem.textContent = '📚 All';
    allNavItem.addEventListener('click', () => displayAllItems());
    navContainer.appendChild(allNavItem);

    const allSidebarItem = document.createElement('li');
    allSidebarItem.textContent = '📚 All';
    allSidebarItem.addEventListener('click', () => displayAllItems());
    sidebarContainer.insertBefore(allSidebarItem, sidebarContainer.firstChild);
}

// Setup event listeners
function setupEventListeners() {
    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', (e) => searchItems(e.target.value));

    const closeButton = document.querySelector('.close');
    const modal = document.getElementById('detailModal');
    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Display all items
function displayAllItems() {
    currentCategory = null;
    updateActiveSidebar();
    renderGrid(allItems);
}

// Filter by category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    updateActiveSidebar();
    const filtered = allItems.filter(item => item.category === categoryId);
    renderGrid(filtered);
}

// Search items
function searchItems(query) {
    const results = allItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    renderGrid(results);
}

// Update active sidebar item
function updateActiveSidebar() {
    document.querySelectorAll('#categoryList li').forEach(li => {
        li.classList.remove('active');
        if (!currentCategory && li.textContent.includes('All')) {
            li.classList.add('active');
        } else if (li.dataset.categoryId === currentCategory) {
            li.classList.add('active');
        }
    });
}

// Render grid of items
function renderGrid(items) {
    const grid = document.getElementById('itemGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No items found.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-image">
            <div class="card-content">
                <span class="card-category">${item.category}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-description">${item.description}</p>
                <p class="card-rarity">${item.rarity}</p>
            </div>
        `;
        card.addEventListener('click', () => showDetail(item));
        grid.appendChild(card);
    });
}

// Show detail modal
function showDetail(item) {
    const modal = document.getElementById('detailModal');
    const detailContent = document.getElementById('detailContent');

    let traitsHtml = '';
    if (item.traits) {
        traitsHtml = `
            <div class="detail-section">
                <h3>Traits</h3>
                ${item.traits.map(trait => `<span class="detail-badge">${trait}</span>`).join('')}
            </div>
        `;
    }

    detailContent.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="detail-image">
        <h2 class="detail-title">${item.name}</h2>
        <div class="detail-meta">
            <span class="detail-badge">${item.category}</span>
            <span class="detail-badge">${item.rarity}</span>
        </div>
        <div class="detail-section">
            <p>${item.details}</p>
        </div>
        ${traitsHtml}
        <div class="detail-section">
            <h3>Habitat</h3>
            <p>${item.habitat}</p>
        </div>
    `;

    modal.style.display = 'block';
}
