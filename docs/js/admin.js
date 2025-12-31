// Admin Panel functionality
let adminData = { categories: [], items: [] };

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});

function initializeAdmin() {
    const adminBtn = document.getElementById('adminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const adminClose = document.querySelector('.admin-close');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Load data from content.json
    loadAdminData();

    // Admin button toggle
    adminBtn.addEventListener('click', () => {
        adminPanel.classList.add('active');
    });

    adminClose.addEventListener('click', () => {
        adminPanel.classList.remove('active');
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Form submissions
    document.getElementById('addItemForm').addEventListener('submit', addNewItem);
    document.getElementById('addCategoryForm').addEventListener('submit', addNewCategory);
    document.getElementById('copyJsonBtn').addEventListener('click', copyJsonToClipboard);

    // Close panel when clicking outside
    adminPanel.addEventListener('click', (e) => {
        if (e.target === adminPanel) {
            adminPanel.classList.remove('active');
        }
    });
}

function loadAdminData() {
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            adminData.site = data.site;
            adminData.categories = data.categories;
            adminData.items = data.items;
            
            // Populate form and displays
            populateCategorySelect();
            displayExistingItems();
            displayExistingCategories();
            updateJsonExport();
        })
        .catch(error => console.error('Error loading data:', error));
}

function populateCategorySelect() {
    const select = document.getElementById('itemCategory');
    select.innerHTML = '<option value="">Select category...</option>';
    
    adminData.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.icon} ${cat.name}`;
        select.appendChild(option);
    });
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update JSON export when switching to export tab
    if (tabName === 'export') {
        updateJsonExport();
    }
}

function addNewItem(e) {
    e.preventDefault();

    const newItem = {
        id: `item-${String(adminData.items.length + 1).padStart(3, '0')}`,
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value,
        rarity: document.getElementById('itemRarity').value,
        description: document.getElementById('itemDescription').value,
        details: document.getElementById('itemDetails').value,
        traits: document.getElementById('itemTraits').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t),
        habitat: document.getElementById('itemHabitat').value
    };

    adminData.items.push(newItem);

    // Reset form
    e.target.reset();

    // Update displays
    displayExistingItems();
    updateJsonExport();

    alert('✅ Item added successfully! Don\'t forget to export and upload to GitHub.');
}

function addNewCategory(e) {
    e.preventDefault();

    const newCategory = {
        id: document.getElementById('categoryId').value,
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value
    };

    // Check if category already exists
    if (adminData.categories.some(cat => cat.id === newCategory.id)) {
        alert('❌ Category ID already exists!');
        return;
    }

    adminData.categories.push(newCategory);

    // Reset form
    e.target.reset();

    // Update displays
    populateCategorySelect();
    displayExistingCategories();
    updateJsonExport();

    alert('✅ Category added successfully! Don\'t forget to export and upload to GitHub.');
}

function displayExistingItems() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';

    if (adminData.items.length === 0) {
        list.innerHTML = '<p style="color: var(--text-dark);">No items yet. Add one above!</p>';
        return;
    }

    adminData.items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Rarity:</strong> ${item.rarity}</p>
                <p><strong>Image:</strong> ${item.image}</p>
            </div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function displayExistingCategories() {
    const list = document.getElementById('categoriesList');
    list.innerHTML = '';

    if (adminData.categories.length === 0) {
        list.innerHTML = '<p style="color: var(--text-dark);">No categories yet. Add one above!</p>';
        return;
    }

    adminData.categories.forEach((cat, index) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-info">
                <h4>${cat.icon} ${cat.name}</h4>
                <p><strong>ID:</strong> ${cat.id}</p>
                <p><strong>Description:</strong> ${cat.description}</p>
            </div>
            <div class="category-actions">
                <button class="btn-delete" onclick="deleteCategory(${index})">Delete</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        adminData.items.splice(index, 1);
        displayExistingItems();
        updateJsonExport();
    }
}

function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category?')) {
        const categoryId = adminData.categories[index].id;
        
        // Check if any items use this category
        const itemsInCategory = adminData.items.filter(item => item.category === categoryId);
        if (itemsInCategory.length > 0) {
            alert(`❌ Cannot delete! ${itemsInCategory.length} item(s) still use this category.`);
            return;
        }

        adminData.categories.splice(index, 1);
        populateCategorySelect();
        displayExistingCategories();
        updateJsonExport();
    }
}

function updateJsonExport() {
    const exportData = {
        site: adminData.site,
        categories: adminData.categories,
        items: adminData.items
    };

    const jsonText = document.getElementById('jsonExport');
    jsonText.value = JSON.stringify(exportData, null, 2);
}

function copyJsonToClipboard() {
    const jsonText = document.getElementById('jsonExport');
    
    jsonText.select();
    document.execCommand('copy');

    const btn = document.getElementById('copyJsonBtn');
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied!';

    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}
